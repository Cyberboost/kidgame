import Phaser from 'phaser';
import type { Profile } from '@/core/types';
import { getComboLabel } from '@/core/starPointsManager';
import { ACHIEVEMENT_DEFINITIONS } from '@/core/achievementDefinitions';

interface UISceneData {
  targetWord: string;
  lives: number;
  profile: Profile;
  gameScene: Phaser.Scene;
}

export class UIScene extends Phaser.Scene {
  private scoreText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;
  private comboText!: Phaser.GameObjects.Text;
  private powerUpText!: Phaser.GameObjects.Text;
  private wordSlots: Phaser.GameObjects.Text[] = [];
  private sceneData!: UISceneData;
  private collectedCount: number = 0;

  // Touch control state (read by GameScene via registry)
  private touchLeft: boolean = false;
  private touchRight: boolean = false;
  private touchJump: boolean = false;

  // Emote wheel
  private emoteWheelOpen: boolean = false;
  private emoteWheelContainer!: Phaser.GameObjects.Container;
  private emoteKey!: Phaser.Input.Keyboard.Key;

  constructor() {
    super({ key: 'UIScene' });
  }

  init(data: UISceneData) {
    this.sceneData = data;
    this.collectedCount = 0;
    this.touchLeft = false;
    this.touchRight = false;
    this.touchJump = false;
    this.emoteWheelOpen = false;
  }

  create() {
    // HUD background bar
    this.add.rectangle(400, 30, 800, 60, 0x000000, 0.5);

    // Star points
    this.scoreText = this.add.text(10, 10, '⭐ 0', {
      fontSize: '20px',
      color: '#ffd54f',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 3,
    });

    // Lives
    this.livesText = this.add
      .text(400, 10, '❤️❤️❤️', {
        fontSize: '20px',
        color: '#ff4444',
      })
      .setOrigin(0.5, 0);

    // Word display
    this.buildWordSlots(this.sceneData.targetWord);

    // Combo text
    this.comboText = this.add
      .text(790, 10, '', {
        fontSize: '20px',
        color: '#ff9800',
        fontStyle: 'bold',
        stroke: '#000',
        strokeThickness: 3,
      })
      .setOrigin(1, 0);

    // Power-up text
    this.powerUpText = this.add
      .text(790, 35, '', {
        fontSize: '16px',
        color: '#ce93d8',
        stroke: '#000',
        strokeThickness: 2,
      })
      .setOrigin(1, 0);

    // Mobile touch controls
    this.createTouchControls();

    // Emote wheel (hidden by default)
    this.createEmoteWheel();

    // E key to toggle emote wheel
    if (this.input.keyboard) {
      this.emoteKey = this.input.keyboard.addKey('E');
      this.emoteKey.on('down', () => this.toggleEmoteWheel());
    }

    // Listen to game events
    const gameScene = this.scene.get('GameScene');

    gameScene.events.on(
      'letterCollected',
      (data: {
        letter: string;
        collectedCount: number;
        word: string;
        combo: number;
        score: number;
      }) => {
        this.collectedCount = data.collectedCount;
        this.updateWordDisplay(data.word, data.collectedCount);
        this.updateScore(data.score);
        this.updateCombo(data.combo);
      }
    );

    gameScene.events.on('updateScore', (score: number) => {
      this.updateScore(score);
    });

    gameScene.events.on('powerUpCollected', (type: string) => {
      const names: Record<string, string> = {
        'star-power': '⭐ Star Power',
        'rocket-boots': '🚀 Rocket Boots',
        'speed-boost': '💨 Speed Boost',
        'x-ray-glasses': '🔍 X-Ray',
        'time-freeze': '⏰ Time Freeze',
        'letter-magnet': '🧲 Magnet',
      };
      this.powerUpText.setText(names[type] || type);
    });

    gameScene.events.on('powerUpExpired', () => {
      this.powerUpText.setText('');
    });

    gameScene.events.on(
      'levelLoaded',
      (data: { targetWord: string; lives: number }) => {
        this.collectedCount = 0;
        this.sceneData.targetWord = data.targetWord;
        this.buildWordSlots(data.targetWord);
        this.updateLives(data.lives);
        this.scoreText.setText('⭐ 0');
        this.comboText.setText('');
        this.powerUpText.setText('');
      }
    );

    gameScene.events.on('bunnyRescued', (count: number) => {
      const bunnyText = this.add
        .text(400, 120, `🐰 Bunny ${count} Rescued!`, {
          fontSize: '18px',
          color: '#ffc107',
          stroke: '#000',
          strokeThickness: 3,
        })
        .setOrigin(0.5);
      this.tweens.add({
        targets: bunnyText,
        y: 80,
        alpha: 0,
        duration: 1500,
        onComplete: () => bunnyText.destroy(),
      });
    });

    gameScene.events.on('achievementsUnlocked', (ids: string[]) => {
      ids.forEach((id, i) => {
        const def = ACHIEVEMENT_DEFINITIONS.find(a => a.id === id);
        if (!def) return;
        this.time.delayedCall(i * 1200, () => {
          this.showAchievementPopup(def.icon, def.name);
        });
      });
    });
  }

  // ─── Touch Controls ──────────────────────────────────────────────────────────

  private createTouchControls() {
    const btnSize = 56;
    const btnAlpha = 0.55;
    const bottomY = 470;

    // Left button
    const leftBg = this.add
      .circle(50, bottomY, btnSize / 2, 0xffffff, btnAlpha)
      .setInteractive({ useHandCursor: true })
      .setDepth(20);
    this.add
      .text(50, bottomY, '◀', { fontSize: '24px', color: '#333' })
      .setOrigin(0.5)
      .setDepth(21);
    leftBg.on('pointerdown', () => { this.touchLeft = true; this.syncTouchState(); });
    leftBg.on('pointerup', () => { this.touchLeft = false; this.syncTouchState(); });
    leftBg.on('pointerout', () => { this.touchLeft = false; this.syncTouchState(); });

    // Right button
    const rightBg = this.add
      .circle(118, bottomY, btnSize / 2, 0xffffff, btnAlpha)
      .setInteractive({ useHandCursor: true })
      .setDepth(20);
    this.add
      .text(118, bottomY, '▶', { fontSize: '24px', color: '#333' })
      .setOrigin(0.5)
      .setDepth(21);
    rightBg.on('pointerdown', () => { this.touchRight = true; this.syncTouchState(); });
    rightBg.on('pointerup', () => { this.touchRight = false; this.syncTouchState(); });
    rightBg.on('pointerout', () => { this.touchRight = false; this.syncTouchState(); });

    // Jump button (right side)
    const jumpBg = this.add
      .circle(740, bottomY, btnSize / 2, 0x4caf50, btnAlpha)
      .setInteractive({ useHandCursor: true })
      .setDepth(20);
    this.add
      .text(740, bottomY, '⬆', { fontSize: '24px', color: '#fff' })
      .setOrigin(0.5)
      .setDepth(21);
    jumpBg.on('pointerdown', () => {
      this.touchJump = true;
      this.syncTouchState();
      // Send jump impulse to game scene
      const gs = this.scene.get('GameScene') as any;
      if (gs && gs.onTouchJump) gs.onTouchJump();
    });
    jumpBg.on('pointerup', () => { this.touchJump = false; this.syncTouchState(); });
    jumpBg.on('pointerout', () => { this.touchJump = false; this.syncTouchState(); });

    // Emote button (above jump)
    const emoteBg = this.add
      .circle(740, bottomY - 72, 24, 0xff9800, btnAlpha)
      .setInteractive({ useHandCursor: true })
      .setDepth(20);
    this.add
      .text(740, bottomY - 72, '🎭', { fontSize: '16px' })
      .setOrigin(0.5)
      .setDepth(21);
    emoteBg.on('pointerdown', () => this.toggleEmoteWheel());
  }

  private syncTouchState() {
    // Write touch flags to game registry so GameScene can read them in update()
    this.registry.set('touchLeft', this.touchLeft);
    this.registry.set('touchRight', this.touchRight);
  }

  // ─── Emote Wheel ─────────────────────────────────────────────────────────────

  private createEmoteWheel() {
    this.emoteWheelContainer = this.add.container(400, 280).setDepth(30).setVisible(false);

    // Dark backdrop
    const bg = this.add.circle(0, 0, 130, 0x000000, 0.7);
    this.emoteWheelContainer.add(bg);

    // Title
    const title = this.add.text(0, -110, 'Emotes', {
      fontSize: '14px', color: '#ffffff', fontStyle: 'bold',
    }).setOrigin(0.5);
    this.emoteWheelContainer.add(title);

    // Close label
    const closeBtn = this.add.text(0, 0, 'Close\n[E]', {
      fontSize: '12px', color: '#aaaaaa', align: 'center',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    closeBtn.on('pointerdown', () => this.toggleEmoteWheel());
    this.emoteWheelContainer.add(closeBtn);

    const profile = this.sceneData.profile;
    const unlockedEmotes = profile.unlockedEmotes ?? ['wave', 'celebrate', 'flex', 'heart'];

    const emoteEmojis: Record<string, string> = {
      wave: '👋', celebrate: '🎉', flex: '💪', heart: '❤️',
      dance: '💃', 'thumbs-up': '👍', 'star-eyes': '🤩', cool: '😎',
      rainbow: '🌈', fireworks: '🎆', 'superhero-pose': '🦸', 'dragon-roar': '🐉',
    };

    const slots = unlockedEmotes.slice(0, 8);
    slots.forEach((emoteId, i) => {
      const angle = (Math.PI * 2 * i) / slots.length - Math.PI / 2;
      const r = 90;
      const ex = Math.cos(angle) * r;
      const ey = Math.sin(angle) * r;

      const btn = this.add.circle(ex, ey, 26, 0x333333, 0.85).setInteractive({ useHandCursor: true });
      const label = this.add.text(ex, ey, emoteEmojis[emoteId] || '❓', { fontSize: '20px' }).setOrigin(0.5);

      btn.on('pointerdown', () => {
        this.playEmote(emoteEmojis[emoteId] || '❓');
        this.toggleEmoteWheel();
      });
      btn.on('pointerover', () => btn.setFillStyle(0x555555, 0.9));
      btn.on('pointerout', () => btn.setFillStyle(0x333333, 0.85));

      this.emoteWheelContainer.add([btn, label]);
    });
  }

  private toggleEmoteWheel() {
    this.emoteWheelOpen = !this.emoteWheelOpen;
    this.emoteWheelContainer.setVisible(this.emoteWheelOpen);
    // Pause/resume game while wheel is open
    const gs = this.scene.get('GameScene');
    if (this.emoteWheelOpen) {
      gs.scene.pause();
    } else {
      gs.scene.resume();
    }
  }

  private playEmote(emoji: string) {
    // Show the emote emoji floating up from the center of the screen
    const emoteText = this.add
      .text(400, 350, emoji, { fontSize: '64px' })
      .setOrigin(0.5)
      .setDepth(25);
    this.tweens.add({
      targets: emoteText,
      y: 200,
      alpha: 0,
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 1800,
      ease: 'Power2',
      onComplete: () => emoteText.destroy(),
    });
  }

  // ─── Achievement Popup ────────────────────────────────────────────────────────

  private showAchievementPopup(icon: string, name: string) {
    const bg = this.add
      .rectangle(400, 460, 280, 40, 0xffd54f, 0.95)
      .setDepth(30);
    const text = this.add
      .text(400, 460, `🏆 ${icon} ${name} Unlocked!`, {
        fontSize: '14px',
        color: '#333',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setDepth(31);

    this.tweens.add({
      targets: [bg, text],
      y: 430,
      duration: 300,
    });
    this.time.delayedCall(2500, () => {
      this.tweens.add({
        targets: [bg, text],
        alpha: 0,
        duration: 400,
        onComplete: () => { bg.destroy(); text.destroy(); },
      });
    });
  }

  // ─── HUD Helpers ──────────────────────────────────────────────────────────────

  private buildWordSlots(word: string) {
    this.wordSlots.forEach(s => s.destroy());
    this.wordSlots = [];

    const startX = 400 - ((word.length - 1) * 36) / 2;
    for (let i = 0; i < word.length; i++) {
      const slot = this.add
        .text(startX + i * 36, 75, '_', {
          fontSize: '22px',
          color: '#ffffff',
          fontStyle: 'bold',
          stroke: '#000',
          strokeThickness: 2,
        })
        .setOrigin(0.5);
      this.wordSlots.push(slot);
    }
  }

  private updateWordDisplay(word: string, collectedCount: number) {
    for (let i = 0; i < this.wordSlots.length; i++) {
      if (i < collectedCount) {
        this.wordSlots[i].setText(word[i]).setColor('#4caf50');
      }
    }
  }

  private updateScore(score: number) {
    this.scoreText.setText(`⭐ ${score}`);
  }

  private updateCombo(combo: number) {
    if (combo < 2) {
      this.comboText.setText('');
      return;
    }
    this.comboText.setText(`${getComboLabel(combo)} ${combo}x`);
    this.tweens.add({
      targets: this.comboText,
      scaleX: 1.3,
      scaleY: 1.3,
      duration: 150,
      yoyo: true,
    });
  }

  private updateLives(lives: number) {
    this.livesText.setText('❤️'.repeat(Math.max(0, lives)));
  }
}
