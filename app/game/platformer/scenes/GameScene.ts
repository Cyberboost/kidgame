// Main gameplay scene for the platformer
import { Player } from '../entities/Player';
import { Bunny } from '../entities/Bunny';
import { Controls } from '../systems/Controls';
import { LevelLoader } from '../levels/levelLoader';
import { LEVEL_1 } from '../levels/level1';
import { collectLetter, LetterHitBox } from '../entities/Letter';

export interface GameSceneData {
  targetWord: string;
  profileId: string;
}

export interface GameSceneEvents {
  onLetterCollected?: (letter: string, collected: string[]) => void;
  onCheckpointReached?: (checkpoint: { x: number; y: number; wordIndex: number }) => void;
  onBunnyFreed?: (bunnyName: string) => void;
  onLevelComplete?: (stats: { wordsSpelled: number; bunniesRescued: number }) => void;
}

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private controls!: Controls;
  private levelLoader!: LevelLoader;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private letterGroup!: Phaser.Physics.Arcade.StaticGroup;
  private bunnies: Bunny[] = [];
  private collectedLetters: string[] = [];
  private targetWord = '';
  private wordSpelled = 0;
  private bunniesRescued = 0;
  private checkpoints: Array<{ x: number; y: number; wordIndex: number; triggered: boolean }> = [];
  private goalFlag!: Phaser.GameObjects.Text;
  private levelComplete = false;

  // Callbacks to React layer
  public events!: Phaser.Events.EventEmitter;

  constructor() {
    super({ key: 'GameScene' });
  }

  init(data: GameSceneData) {
    this.targetWord = (data.targetWord || 'CAT').toUpperCase();
    this.collectedLetters = [];
    this.bunniesRescued = 0;
    this.wordSpelled = 0;
    this.levelComplete = false;
  }

  create() {
    const level = LEVEL_1;

    // World bounds
    this.physics.world.setBounds(0, 0, level.worldWidth, level.worldHeight);
    this.cameras.main.setBounds(0, 0, level.worldWidth, level.worldHeight);

    // Background
    this.add.rectangle(
      level.worldWidth / 2,
      level.worldHeight / 2,
      level.worldWidth,
      level.worldHeight,
      level.backgroundColor
    );

    // Clouds (decorative)
    this.createClouds(level.worldWidth);

    // Ground and platforms
    this.levelLoader = new LevelLoader(this);
    this.platforms = this.levelLoader.createGround(level);

    // Spawn letters spaced across the level
    const letterStartX = 300;
    this.letterGroup = this.levelLoader.spawnLetters(
      this.targetWord,
      letterStartX,
      level.platforms[0].y
    );

    // Spawn bunnies
    level.bunnies.forEach((b) => {
      const bunny = new Bunny(this, b.x, b.y, b.name, b.color);
      this.bunnies.push(bunny);
    });

    // Checkpoints (flag markers)
    level.checkpoints.forEach((cp) => {
      const marker = this.add.container(cp.x, cp.y);
      const pole = this.add.rectangle(0, -40, 4, 80, 0x8b4513);
      const flag = this.add.triangle(
        0, -80, 0, 0, 30, -15, 0, -30, 0xffff00
      );
      const label = this.add.text(0, -100, '🏁', { fontSize: '20px' }).setOrigin(0.5);
      marker.add([pole, flag, label]);
      this.checkpoints.push({ ...cp, triggered: false });
    });

    // Goal flag
    this.goalFlag = this.add.text(level.goalX, level.platforms[0].y - 50, '🏆', {
      fontSize: '40px',
    }).setOrigin(0.5);

    // Controls & Player
    this.controls = new Controls(this);
    this.player = new Player(this, level.playerStart.x, level.playerStart.y, this.controls);

    // Camera follow player
    this.cameras.main.startFollow(this.player.sprite, true, 0.1, 0.1);

    // Collisions
    this.physics.add.collider(this.player.sprite, this.platforms);

    // Letter overlap
    this.physics.add.overlap(
      this.player.sprite,
      this.letterGroup,
      (_player, letterObj) => {
        const lo = letterObj as LetterHitBox;
        if (lo.collected) return;
        const collected = collectLetter(lo);
        if (collected) {
          this.collectedLetters.push(lo.letterValue);
          this.events.emit('letterCollected', lo.letterValue, [...this.collectedLetters]);
        }
      }
    );

    // Register touch controls listener
    this.events.on('touchLeft', (active: boolean) => {
      this.controls.touchLeft = active;
    });
    this.events.on('touchRight', (active: boolean) => {
      this.controls.touchRight = active;
    });
    this.events.on('touchJump', (active: boolean) => {
      this.controls.touchJump = active;
    });
    // Spelling result from UI
    this.events.on('spellingResult', (correct: boolean) => {
      this.handleSpellingResult(correct);
    });
  }

  private createClouds(worldWidth: number) {
    for (let cx = 200; cx < worldWidth; cx += 300 + Math.random() * 200) {
      const cy = 60 + Math.random() * 100;
      const cloud = this.add.graphics();
      cloud.fillStyle(0xffffff, 0.85);
      cloud.fillEllipse(0, 0, 80, 40);
      cloud.fillEllipse(-30, 10, 60, 35);
      cloud.fillEllipse(30, 10, 60, 35);
      cloud.setPosition(cx, cy);
    }
  }

  private handleSpellingResult(correct: boolean) {
    if (correct) {
      this.wordSpelled++;
      // Find the most recently triggered checkpoint and free the associated bunny
      const checkpoint = this.checkpoints.find(
        (cp) => cp.triggered && !this.bunnies[cp.wordIndex]?.freed
      );
      if (checkpoint) {
        const bunny = this.bunnies[checkpoint.wordIndex];
        if (bunny) {
          bunny.free();
          this.bunniesRescued++;
          this.events.emit('bunnyFreed', bunny.name, this.bunniesRescued);
        }
      }
      // Reset collected letters for next word
      this.collectedLetters = [];
      this.events.emit('letterCollected', '', []);
    }
  }

  update(_time: number, delta: number) {
    if (this.levelComplete) return;

    this.player.update(delta);

    const px = this.player.getPosition().x;
    const py = this.player.getPosition().y;

    // Check checkpoints
    this.checkpoints.forEach((cp) => {
      if (!cp.triggered && Math.abs(px - cp.x) < 60) {
        cp.triggered = true;
        // Emit event to React to show spelling challenge
        this.events.emit('checkpointReached', cp, [...this.collectedLetters], this.targetWord);
      }
    });

    // Check goal
    if (px >= LEVEL_1.goalX - 40) {
      this.levelComplete = true;
      this.events.emit('levelComplete', {
        wordsSpelled: this.wordSpelled,
        bunniesRescued: this.bunniesRescued,
      });
    }

    // Fell off the world
    if (py > LEVEL_1.worldHeight + 50) {
      this.respawnPlayer();
    }
  }

  private respawnPlayer() {
    this.player.sprite.setPosition(LEVEL_1.playerStart.x, LEVEL_1.playerStart.y);
    (this.player.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);
  }
}
