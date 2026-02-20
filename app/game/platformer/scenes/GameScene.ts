import Phaser from 'phaser';
import type { Profile } from '@/core/types';
import { getComboMultiplier, getComboLabel, progressAchievement, awardPoints } from '@/core/starPointsManager';
import { saveLevelProgress } from '@/core/persistence';
import { getWordListForGrade } from '@/words/starterLists';

interface GameSceneData {
  profile: Profile;
  onGameComplete: (starPointsEarned: number) => void;
  onBack: () => void;
}

interface LevelData {
  id: string;
  word: string; // set dynamically from grade word list at runtime
  groundSegments: { x: number; width: number }[];
  platforms: { x: number; y: number; width: number }[];
  breakables: { x: number; y: number; type: 'crate' | 'stone' | 'question' }[];
  // letterPositions are generated dynamically from word length
  bunnyCages: { x: number; y: number }[];
  powerUps: { x: number; y: number; type: string }[];
  goalX: number;
  levelWidth: number;
  parTime: number;
  // Number of letter slots available (max word length this template supports)
  maxLetters: number;
}

// Level templates — word is replaced at runtime from the player's grade word list.
// letterPositions are generated dynamically based on actual word length.
const LEVEL_TEMPLATES: LevelData[] = [
  {
    id: 'level-1',
    word: 'CAT', // fallback; overridden at runtime
    groundSegments: [{ x: 0, width: 1600 }],
    platforms: [
      { x: 300, y: 350, width: 96 },
      { x: 500, y: 300, width: 96 },
      { x: 700, y: 320, width: 96 },
    ],
    breakables: [
      { x: 400, y: 320, type: 'question' },
      { x: 600, y: 270, type: 'crate' },
    ],
    bunnyCages: [{ x: 1100, y: 430 }],
    powerUps: [{ x: 750, y: 270, type: 'star-power' }],
    goalX: 1450,
    levelWidth: 1600,
    parTime: 60,
    maxLetters: 4,
  },
  {
    id: 'level-2',
    word: 'PLAY',
    groundSegments: [{ x: 0, width: 2000 }],
    platforms: [
      { x: 250, y: 350, width: 96 },
      { x: 450, y: 290, width: 96 },
      { x: 650, y: 330, width: 96 },
      { x: 850, y: 260, width: 96 },
      { x: 1100, y: 310, width: 128 },
    ],
    breakables: [
      { x: 350, y: 320, type: 'crate' },
      { x: 550, y: 260, type: 'question' },
      { x: 750, y: 300, type: 'stone' },
      { x: 950, y: 230, type: 'crate' },
    ],
    bunnyCages: [
      { x: 600, y: 430 },
      { x: 1400, y: 430 },
    ],
    powerUps: [
      { x: 900, y: 225, type: 'rocket-boots' },
      { x: 1300, y: 420, type: 'letter-magnet' },
    ],
    goalX: 1850,
    levelWidth: 2000,
    parTime: 90,
    maxLetters: 5,
  },
  {
    id: 'level-3',
    word: 'JUMP',
    groundSegments: [{ x: 0, width: 2400 }],
    platforms: [
      { x: 200, y: 340, width: 96 },
      { x: 400, y: 280, width: 96 },
      { x: 600, y: 220, width: 96 },
      { x: 800, y: 300, width: 96 },
      { x: 1000, y: 240, width: 128 },
      { x: 1300, y: 200, width: 96 },
      { x: 1600, y: 280, width: 96 },
    ],
    breakables: [
      { x: 300, y: 310, type: 'crate' },
      { x: 500, y: 250, type: 'stone' },
      { x: 700, y: 190, type: 'question' },
      { x: 900, y: 270, type: 'crate' },
      { x: 1100, y: 210, type: 'stone' },
      { x: 1400, y: 170, type: 'question' },
    ],
    bunnyCages: [
      { x: 800, y: 430 },
      { x: 1200, y: 430 },
      { x: 1900, y: 430 },
    ],
    powerUps: [
      { x: 400, y: 245, type: 'speed-boost' },
      { x: 1300, y: 165, type: 'x-ray-glasses' },
      { x: 1800, y: 420, type: 'time-freeze' },
    ],
    goalX: 2200,
    levelWidth: 2400,
    parTime: 120,
    maxLetters: 6,
  },
];

export class GameScene extends Phaser.Scene {
  private sceneData!: GameSceneData;
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
  };
  private groundGroup!: Phaser.Physics.Arcade.StaticGroup;
  private platformGroup!: Phaser.Physics.Arcade.StaticGroup;
  private breakableGroup!: Phaser.Physics.Arcade.StaticGroup;
  private letterGroup!: Phaser.Physics.Arcade.Group;
  private cageGroup!: Phaser.Physics.Arcade.StaticGroup;
  private powerUpGroup!: Phaser.Physics.Arcade.Group;
  private goalGroup!: Phaser.Physics.Arcade.StaticGroup;
  private currentLevel!: LevelData;
  private currentLevelIndex: number = 0;
  private collectedLetters: string[] = [];
  private targetWord: string = '';
  private comboCount: number = 0;
  private lastCollectTime: number = 0;
  private levelStartTime: number = 0;
  private starPointsEarned: number = 0;
  private bunniesRescued: number = 0;
  private lives: number = 3;
  private isInvincible: boolean = false;
  private activePowerUp: string | null = null;
  private powerUpTimer: Phaser.Time.TimerEvent | null = null;
  private jumpBuffered: boolean = false;
  private jumpBufferTimer: Phaser.Time.TimerEvent | null = null;
  private coyoteTime: number = 0;
  private wasOnGround: boolean = false;
  private levelCompleteTriggered: boolean = false;
  private blocksBrokenSession: number = 0;
  private newAchievements: string[] = [];
  /** Words picked from the profile's grade list for this play session */
  private sessionWords: string[] = [];
  private isRespawning: boolean = false;

  constructor() {
    super({ key: 'GameScene' });
  }

  init(data: GameSceneData) {
    this.sceneData = data;
    this.currentLevelIndex = 0;
    this.lives = 3;
    // Pick grade-appropriate words for this session
    const profile = data.profile;
    const allWords = getWordListForGrade(profile.defaultGrade, profile.customWords ?? []);
    // Filter to words that fit platformer level templates (2–6 letters)
    const suitable = allWords.filter(w => w.length >= 2 && w.length <= 6);
    // Fisher-Yates shuffle for unbiased randomization
    const shuffled = [...suitable];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    this.sessionWords = shuffled.length > 0 ? shuffled : ['CAT', 'PLAY', 'JUMP'];
  }

  create() {
    this.loadLevel(this.currentLevelIndex);

    this.scene.launch('UIScene', {
      targetWord: this.targetWord,
      lives: this.lives,
      profile: this.sceneData.profile,
      gameScene: this,
    });
  }

  /**
   * Pick the word for a given level index from the session word list.
   * Cycles through sessionWords so the game keeps going indefinitely.
   */
  private pickWord(levelIndex: number): string {
    return this.sessionWords[levelIndex % this.sessionWords.length];
  }

  private loadLevel(index: number) {
    const template = LEVEL_TEMPLATES[index % LEVEL_TEMPLATES.length];
    // Deep-clone the template (including nested arrays) so runtime mutations don't affect the shared template
    this.currentLevel = structuredClone(template);
    this.currentLevel.word = this.pickWord(index);
    this.targetWord = this.currentLevel.word;
    this.collectedLetters = [];
    this.comboCount = 0;
    this.lastCollectTime = 0;
    this.levelStartTime = this.time.now;
    this.bunniesRescued = 0;
    this.levelCompleteTriggered = false;
    this.isRespawning = false;

    // Clear previous objects
    this.children.removeAll(true);

    this.physics.world.setBounds(0, 0, this.currentLevel.levelWidth, 600);

    // Sky background
    this.add.rectangle(
      this.currentLevel.levelWidth / 2,
      250,
      this.currentLevel.levelWidth,
      500,
      0x87ceeb
    );

    // Ground
    this.groundGroup = this.physics.add.staticGroup();
    for (const seg of this.currentLevel.groundSegments) {
      const count = Math.ceil(seg.width / 64);
      for (let i = 0; i < count; i++) {
        const tile = this.groundGroup.create(
          seg.x + i * 64 + 32,
          468,
          'ground'
        ) as Phaser.Physics.Arcade.Image;
        tile.refreshBody();
      }
    }

    // Platforms
    this.platformGroup = this.physics.add.staticGroup();
    for (const plat of this.currentLevel.platforms) {
      const count = Math.ceil(plat.width / 96);
      for (let i = 0; i < count; i++) {
        const tile = this.platformGroup.create(
          plat.x + i * 96 + 48,
          plat.y,
          'platform'
        ) as Phaser.Physics.Arcade.Image;
        tile.refreshBody();
      }
    }

    // Breakable blocks
    this.breakableGroup = this.physics.add.staticGroup();
    for (const block of this.currentLevel.breakables) {
      const texture =
        block.type === 'question'
          ? 'question-block'
          : block.type === 'stone'
          ? 'breakable-stone'
          : 'breakable-crate';
      const tile = this.breakableGroup.create(
        block.x,
        block.y,
        texture
      ) as Phaser.Physics.Arcade.Image;
      tile.setData('type', block.type);
      tile.setData('hits', block.type === 'stone' ? 2 : 1);
      tile.refreshBody();
    }

    // Letter collectibles
    // Generate letter positions spread across the level based on word length.
    // Each letter gets a position based on equal spacing across the level width.
    this.letterGroup = this.physics.add.group();
    const word = this.targetWord;
    const spacing = Math.floor(this.currentLevel.levelWidth / (word.length + 1));
    const platformYPositions = this.currentLevel.platforms.map(p => p.y - 32);
    const hasPlatforms = platformYPositions.length > 0;
    for (let i = 0; i < word.length; i++) {
      const posX = spacing * (i + 1);
      // Alternate between ground-level and platform-level positions
      const posY = (i % 2 === 0 || !hasPlatforms)
        ? 420
        : platformYPositions[i % platformYPositions.length];

      const letter = this.letterGroup.create(
        posX,
        posY,
        'letter-collectible'
      ) as Phaser.Physics.Arcade.Image;
      letter.setData('letter', word[i]);
      letter.setData('index', i);
      (letter.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

      // Letter label — stored on the sprite so it can be destroyed together
      const label = this.add.text(posX, posY, word[i], {
        fontSize: '14px',
        color: '#333333',
        fontStyle: 'bold',
      }).setOrigin(0.5).setDepth(1);
      letter.setData('label', label);

      const bobDuration = 800 + Math.random() * 400;
      // Bob both the sprite and the label together
      this.tweens.add({
        targets: [letter, label],
        y: posY - 10,
        duration: bobDuration,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1,
      });
    }

    // Bunny cages
    this.cageGroup = this.physics.add.staticGroup();
    for (const cage of this.currentLevel.bunnyCages) {
      const cageSprite = this.cageGroup.create(
        cage.x,
        cage.y,
        'bunny-cage'
      ) as Phaser.Physics.Arcade.Image;
      cageSprite.setData('rescued', false);
      cageSprite.refreshBody();
    }

    // Power-ups
    this.powerUpGroup = this.physics.add.group();
    for (const pu of this.currentLevel.powerUps) {
      const puSprite = this.powerUpGroup.create(
        pu.x,
        pu.y,
        'power-up'
      ) as Phaser.Physics.Arcade.Image;
      puSprite.setData('type', pu.type);
      (puSprite.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
      this.tweens.add({
        targets: puSprite,
        y: pu.y - 8,
        duration: 1000,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1,
      });
    }

    // Goal flag
    this.goalGroup = this.physics.add.staticGroup();
    const goalTile = this.goalGroup.create(
      this.currentLevel.goalX,
      420,
      'flag-goal'
    ) as Phaser.Physics.Arcade.Image;
    goalTile.refreshBody();

    // Player
    this.player = this.physics.add.sprite(80, 400, 'player') as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0);
    this.player.setDragX(800);
    this.player.setDepth(2);

    // Camera
    this.cameras.main.setBounds(0, 0, this.currentLevel.levelWidth, 600);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

    // Collisions
    this.physics.add.collider(this.player, this.groundGroup);
    this.physics.add.collider(this.player, this.platformGroup);
    this.physics.add.collider(
      this.player,
      this.breakableGroup,
      this.handleBlockHit as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );

    // Overlaps
    this.physics.add.overlap(
      this.player,
      this.letterGroup,
      this.collectLetter as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.cageGroup,
      this.rescueBunny as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.powerUpGroup,
      this.collectPowerUp as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.goalGroup,
      this.reachGoal as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );

    // Input
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasdKeys = {
        W: this.input.keyboard.addKey('W'),
        A: this.input.keyboard.addKey('A'),
        S: this.input.keyboard.addKey('S'),
        D: this.input.keyboard.addKey('D'),
      };
    }
  }

  private handleBlockHit(
    player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    block: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ) {
    const playerSprite = player as Phaser.Physics.Arcade.Sprite;
    const blockSprite = block as Phaser.Physics.Arcade.Image;
    const body = playerSprite.body as Phaser.Physics.Arcade.Body;
    if (body.velocity.y < 0 && playerSprite.y > blockSprite.y) {
      const hits = blockSprite.getData('hits') as number;
      const type = blockSprite.getData('type') as string;

      if (hits > 1) {
        blockSprite.setData('hits', hits - 1);
        blockSprite.setTint(0xcccccc);
        this.cameras.main.shake(100, 0.005);
      } else {
        this.cameras.main.shake(150, 0.008);
        this.spawnBreakParticles(
          blockSprite.x,
          blockSprite.y,
          type === 'question' ? 0xffd54f : 0x8d6e63
        );
        if (type === 'question') {
          this.starPointsEarned += 20;
          this.showFloatingText(blockSprite.x, blockSprite.y, '+20 ⭐', 0xffd54f);
          this.events.emit('updateScore', this.starPointsEarned);
        }
        this.breakableGroup.remove(blockSprite, true, true);
        this.events.emit('blockBroken');
        this.blocksBrokenSession++;
        // Achievement: Breaker (first block)
        this.checkAchievement('breaker', 1, 1);
      }
    }
  }

  private collectLetter(
    _player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    letterObj: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ) {
    const letterSprite = letterObj as Phaser.Physics.Arcade.Image;
    const letter = letterSprite.getData('letter') as string;
    const idx = letterSprite.getData('index') as number;
    const key = letter + idx;

    if (this.collectedLetters.includes(key)) return;
    this.collectedLetters.push(key);

    const now = this.time.now;
    if (now - this.lastCollectTime < 3000) {
      this.comboCount++;
    } else {
      this.comboCount = 1;
    }
    this.lastCollectTime = now;

    const multiplier = getComboMultiplier(this.comboCount);
    const points = 10 * multiplier;
    this.starPointsEarned += points;

    this.showFloatingText(letterSprite.x, letterSprite.y - 20, `+${points} ⭐`, 0xffffff);
    this.spawnCollectParticles(letterSprite.x, letterSprite.y);

    // Combo achievements
    if (this.comboCount >= 5) this.checkAchievement('combo-king', this.comboCount, 5);
    if (this.comboCount >= 10) this.checkAchievement('on-fire', this.comboCount, 10);
    // Hot-streak (3 letters in a row)
    if (this.comboCount >= 3) this.checkAchievement('hot-streak', this.comboCount, 3);

    this.events.emit('letterCollected', {
      letter,
      collectedCount: this.collectedLetters.length,
      word: this.targetWord,
      combo: this.comboCount,
      score: this.starPointsEarned,
    });

    // Destroy the label text along with the sprite
    const label = letterSprite.getData('label') as Phaser.GameObjects.Text | null;
    if (label) label.destroy();
    letterSprite.destroy();

    if (this.collectedLetters.length >= this.targetWord.length) {
      this.time.delayedCall(500, () => this.completeWord());
    }
  }

  private completeWord() {
    if (this.levelCompleteTriggered) return;
    this.levelCompleteTriggered = true;

    const elapsed = (this.time.now - this.levelStartTime) / 1000;
    const speedBonus = elapsed < this.currentLevel.parTime;

    this.starPointsEarned += 50;
    if (speedBonus) this.starPointsEarned += 25;
    this.starPointsEarned += this.bunniesRescued * 30;

    // Achievement: first word, speed demon, word master, explorer
    const profile = this.sceneData.profile;
    this.checkAchievement('first-word', 1, 1);
    if (speedBonus) this.checkAchievement('speed-demon', 1, 1);
    this.checkAchievement('word-master', 1, 50);
    this.checkAchievement('explorer', 1, 3);
    // Persist points to profile
    awardPoints(profile, this.starPointsEarned);
    profile.stats.totalWordsSpelled++;
    // Emit new achievements to UIScene
    if (this.newAchievements.length > 0) {
      this.events.emit('achievementsUnlocked', [...this.newAchievements]);
      this.newAchievements = [];
    }

    // Save level progress to IndexedDB (fire-and-forget)
    saveLevelProgress({
      levelId: this.currentLevel.id,
      completed: true,
      bestTime: elapsed,
      starsEarned: this.calculateStars(speedBonus, this.bunniesRescued),
      lettersFound: this.targetWord.length,
      secretsFound: 0,
    }).catch(() => { /* non-critical */ });

    this.spawnWordCompleteEffect();
    this.cameras.main.flash(500, 255, 255, 100);

    this.time.delayedCall(1500, () => {
      this.scene.pause('GameScene');
      this.scene.pause('UIScene');
      this.scene.launch('LevelCompleteScene', {
        word: this.targetWord,
        lettersFound: this.targetWord.length,
        totalLetters: this.targetWord.length,
        timeElapsed: elapsed,
        speedBonus,
        bunniesRescued: this.bunniesRescued,
        totalBunnies: this.currentLevel.bunnyCages.length,
        comboBonus: Math.max(0, this.comboCount - 1) * 5,
        totalStarPoints: this.starPointsEarned,
        levelIndex: this.currentLevelIndex,
        onContinue: () => this.nextLevel(),
        onReplay: () => this.replayLevel(),
        onBack: this.sceneData.onBack,
      });
    });
  }

  private nextLevel() {
    this.currentLevelIndex++;
    this.starPointsEarned = 0;
    this.scene.stop('LevelCompleteScene');
    this.scene.resume('GameScene');
    this.scene.resume('UIScene');
    this.loadLevel(this.currentLevelIndex);
    this.events.emit('levelLoaded', {
      targetWord: this.targetWord,
      lives: this.lives,
    });
  }

  private replayLevel() {
    this.starPointsEarned = 0;
    this.scene.stop('LevelCompleteScene');
    this.scene.resume('GameScene');
    this.scene.resume('UIScene');
    this.loadLevel(this.currentLevelIndex);
    this.events.emit('levelLoaded', {
      targetWord: this.targetWord,
      lives: this.lives,
    });
  }

  /**
   * Called when the player falls off the bottom of the world.
   * Decrements lives; respawns at the start of the level or shows game over.
   */
  private playerDied() {
    if (this.isRespawning || this.isInvincible || this.levelCompleteTriggered) return;
    this.isRespawning = true;

    this.lives--;
    this.cameras.main.shake(300, 0.015);
    this.cameras.main.flash(300, 255, 50, 50);

    this.events.emit('livesChanged', this.lives);

    if (this.lives <= 0) {
      // Game over — go back to menu after a short delay
      this.time.delayedCall(1000, () => {
        this.scene.stop('UIScene');
        this.sceneData.onBack();
      });
      return;
    }

    // Respawn with brief invincibility
    this.isInvincible = true;
    this.player.setPosition(80, 400);
    (this.player.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

    // Flash player during invincibility window
    this.tweens.add({
      targets: this.player,
      alpha: 0.3,
      duration: 100,
      yoyo: true,
      repeat: 10,
      onComplete: () => {
        this.player.setAlpha(1);
        this.isInvincible = false;
        this.isRespawning = false;
      },
    });
  }

  private rescueBunny(
    _player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    cageObj: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ) {
    const cage = cageObj as Phaser.Physics.Arcade.Image;
    if (cage.getData('rescued')) return;
    cage.setData('rescued', true);
    this.bunniesRescued++;
    this.starPointsEarned += 30;
    this.showFloatingText(cage.x, cage.y - 20, '🐰 +30 ⭐', 0xffc107);
    this.spawnCollectParticles(cage.x, cage.y);
    cage.setTint(0x4caf50);
    this.events.emit('bunnyRescued', this.bunniesRescued);
    // Achievement: bunny-friend (first rescue)
    this.checkAchievement('bunny-friend', 1, 1);
    const profile = this.sceneData.profile;
    profile.stats.totalBunniesRescued++;
    this.checkAchievement('bunny-rescuer', profile.stats.totalBunniesRescued, 10);
  }

  private collectPowerUp(
    _player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    puObj: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ) {
    const puSprite = puObj as Phaser.Physics.Arcade.Image;
    const type = puSprite.getData('type') as string;
    this.activePowerUp = type;
    this.showFloatingText(puSprite.x, puSprite.y - 20, '⚡ Power Up!', 0xce93d8);
    this.spawnCollectParticles(puSprite.x, puSprite.y);
    puSprite.destroy();

    if (this.powerUpTimer) {
      this.powerUpTimer.destroy();
    }

    const durations: Record<string, number> = {
      'star-power': 10000,
      'rocket-boots': 20000,
      'speed-boost': 15000,
      'x-ray-glasses': 20000,
      'time-freeze': 20000,
      'letter-magnet': 15000,
    };
    const duration = durations[type] || 15000;

    this.events.emit('powerUpCollected', { type, duration });

    if (type === 'star-power') {
      this.isInvincible = true;
      this.player.setTint(0xffff00);
    }

    this.powerUpTimer = this.time.delayedCall(
      duration,
      () => {
        if (type === 'star-power') {
          this.isInvincible = false;
          this.player.clearTint();
        }
        this.activePowerUp = null;
        this.events.emit('powerUpExpired');
      }
    );
  }

  private reachGoal(
    _player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    _goal: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ) {
    if (this.collectedLetters.length < this.targetWord.length) {
      this.showFloatingText(
        this.player.x,
        this.player.y - 40,
        'Find all letters first!',
        0xff6b6b
      );
      return;
    }
    this.completeWord();
  }

  private spawnBreakParticles(x: number, y: number, color: number) {
    for (let i = 0; i < 8; i++) {
      const piece = this.add.rectangle(x, y, 8, 8, color);
      const vx = (Math.random() - 0.5) * 300;
      const vy = -(Math.random() * 200 + 100);
      this.tweens.add({
        targets: piece,
        x: piece.x + vx * 0.5,
        y: piece.y + vy * 0.3 + 80,
        alpha: 0,
        duration: 500,
        onComplete: () => piece.destroy(),
      });
    }
  }

  private spawnCollectParticles(x: number, y: number) {
    for (let i = 0; i < 6; i++) {
      const spark = this.add.image(x, y, 'spark');
      const angle = (Math.PI * 2 * i) / 6;
      const dist = 40 + Math.random() * 20;
      this.tweens.add({
        targets: spark,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist - 20,
        alpha: 0,
        scale: 0,
        duration: 400,
        onComplete: () => spark.destroy(),
      });
    }
  }

  private spawnWordCompleteEffect() {
    for (let i = 0; i < 20; i++) {
      const star = this.add.image(this.player.x, this.player.y, 'star-particle');
      const angle = (Math.PI * 2 * i) / 20;
      const dist = 80 + Math.random() * 80;
      this.tweens.add({
        targets: star,
        x: this.player.x + Math.cos(angle) * dist,
        y: this.player.y + Math.sin(angle) * dist - 40,
        alpha: 0,
        scale: 0,
        duration: 1000,
        onComplete: () => star.destroy(),
      });
    }

    const colors = [0xff0000, 0xff9800, 0xffeb3b, 0x4caf50, 0x2196f3, 0x9c27b0];
    for (const color of colors) {
      const circle = this.add.circle(this.player.x, this.player.y, 10, color, 0.5);
      this.tweens.add({
        targets: circle,
        scaleX: 10,
        scaleY: 10,
        alpha: 0,
        duration: 800,
        onComplete: () => circle.destroy(),
      });
    }
  }

  private showFloatingText(x: number, y: number, text: string, color: number) {
    const hexStr = '#' + color.toString(16).padStart(6, '0');
    const floatText = this.add
      .text(x, y, text, {
        fontSize: '18px',
        color: hexStr,
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 3,
      })
      .setOrigin(0.5)
      .setDepth(10);

    this.tweens.add({
      targets: floatText,
      y: y - 60,
      alpha: 0,
      duration: 1200,
      onComplete: () => floatText.destroy(),
    });
  }

  /**
   * Called by UIScene's touch jump button to inject a jump impulse.
   * Public so UIScene can access it via scene.get('GameScene').
   */
  onTouchJump() {
    if (!this.player) return;
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    const onGround = this.player.body.blocked.down;
    const jumpHeight = this.activePowerUp === 'rocket-boots' ? -650 : -450;
    if (onGround || this.time.now - this.coyoteTime < 150) {
      body.setVelocityY(jumpHeight);
    } else {
      this.jumpBuffered = true;
      if (this.jumpBufferTimer) this.jumpBufferTimer.destroy();
      this.jumpBufferTimer = this.time.delayedCall(200, () => {
        this.jumpBuffered = false;
      });
    }
  }

  /** Calculate 1–3 stars based on level performance. */
  private calculateStars(speedBonus: boolean, bunniesRescued: number): number {
    if (speedBonus) return 3;
    if (bunniesRescued > 0) return 2;
    return 1;
  }

  /**
   * Progress or unlock a single achievement on the profile.
   * Newly unlocked achievements are queued in newAchievements for display.
   */
  private checkAchievement(id: string, increment: number, threshold: number) {
    const unlocked = progressAchievement(this.sceneData.profile, id, increment, threshold);
    if (unlocked) {
      this.newAchievements.push(id);
    }
  }

  update() {
    if (!this.player || !this.cursors) return;

    // Fall detection — player fell off the bottom of the world
    if (this.player.y > 560) {
      this.playerDied();
      return;
    }

    const onGround = this.player.body.blocked.down;
    const body = this.player.body as Phaser.Physics.Arcade.Body;

    // Coyote time
    if (this.wasOnGround && !onGround) {
      this.coyoteTime = this.time.now;
    }
    this.wasOnGround = onGround;

    const canCoyoteJump = !onGround && this.time.now - this.coyoteTime < 150;
    const moveSpeed = this.activePowerUp === 'speed-boost' ? 300 : 200;
    const jumpHeight = this.activePowerUp === 'rocket-boots' ? -650 : -450;

    // Horizontal movement (keyboard + touch)
    const touchLeft = this.registry.get('touchLeft') as boolean | undefined;
    const touchRight = this.registry.get('touchRight') as boolean | undefined;
    if (this.cursors.left.isDown || this.wasdKeys.A.isDown || touchLeft) {
      body.setVelocityX(-moveSpeed);
      this.player.setFlipX(true);
    } else if (this.cursors.right.isDown || this.wasdKeys.D.isDown || touchRight) {
      body.setVelocityX(moveSpeed);
      this.player.setFlipX(false);
    }

    // Jump
    const jumpPressed =
      Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
      Phaser.Input.Keyboard.JustDown(this.cursors.space) ||
      Phaser.Input.Keyboard.JustDown(this.wasdKeys.W);

    if (jumpPressed) {
      if (onGround || canCoyoteJump) {
        body.setVelocityY(jumpHeight);
      } else {
        this.jumpBuffered = true;
        if (this.jumpBufferTimer) this.jumpBufferTimer.destroy();
        this.jumpBufferTimer = this.time.delayedCall(200, () => {
          this.jumpBuffered = false;
        });
      }
    }

    // Jump buffer: execute when landing
    if (this.jumpBuffered && onGround) {
      body.setVelocityY(jumpHeight);
      this.jumpBuffered = false;
      if (this.jumpBufferTimer) {
        this.jumpBufferTimer.destroy();
        this.jumpBufferTimer = null;
      }
    }
  }
}
