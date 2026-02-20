import Phaser from 'phaser';
import type { Profile } from '@/core/types';
import { getComboLabel } from '@/core/starPointsManager';

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

  constructor() {
    super({ key: 'UIScene' });
  }

  init(data: UISceneData) {
    this.sceneData = data;
    this.collectedCount = 0;
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
  }

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
