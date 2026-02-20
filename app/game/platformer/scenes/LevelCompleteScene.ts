import Phaser from 'phaser';

interface LevelCompleteData {
  word: string;
  lettersFound: number;
  totalLetters: number;
  timeElapsed: number;
  speedBonus: boolean;
  bunniesRescued: number;
  totalBunnies: number;
  comboBonus: number;
  totalStarPoints: number;
  levelIndex: number;
  onContinue: () => void;
  onReplay: () => void;
  onBack: () => void;
}

export class LevelCompleteScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LevelCompleteScene' });
  }

  create(data: LevelCompleteData) {
    // Dark overlay
    this.add.rectangle(400, 250, 800, 500, 0x000000, 0.8);

    this.spawnConfetti();

    // Title
    this.add
      .text(400, 60, '✨ LEVEL COMPLETE! ✨', {
        fontSize: '36px',
        color: '#ffd54f',
        fontStyle: 'bold',
        stroke: '#000',
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    // Word spelled
    this.add
      .text(400, 120, `Word: ${data.word} ✓`, {
        fontSize: '28px',
        color: '#4caf50',
        fontStyle: 'bold',
        stroke: '#000',
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    // Stats
    const mins = Math.floor(data.timeElapsed / 60);
    const secs = String(Math.floor(data.timeElapsed % 60)).padStart(2, '0');
    const timeStr = `${mins}:${secs}`;
    const stats = [
      `📝 Letters: ${data.lettersFound}/${data.totalLetters}`,
      `⏱️ Time: ${timeStr}${data.speedBonus ? ' ⚡ Speed Bonus!' : ''}`,
      `🐰 Bunnies: ${data.bunniesRescued}/${data.totalBunnies}`,
    ];

    stats.forEach((stat, i) => {
      this.add
        .text(400, 170 + i * 32, stat, {
          fontSize: '18px',
          color: '#ffffff',
          stroke: '#000',
          strokeThickness: 2,
        })
        .setOrigin(0.5);
    });

    // Points breakdown
    this.add.rectangle(400, 315, 380, 2, 0x666666);
    this.add
      .text(400, 330, 'STAR POINTS EARNED', {
        fontSize: '16px',
        color: '#ffd54f',
      })
      .setOrigin(0.5);

    const letterPoints = data.lettersFound * 10;
    const wordBonus = 50;
    const speedBonusPts = data.speedBonus ? 25 : 0;
    const bunnyPoints = data.bunniesRescued * 30;

    const breakdown = [
      `📝 Letters (${data.lettersFound}): ${letterPoints} ⭐`,
      `🌟 Word Bonus: ${wordBonus} ⭐`,
      data.speedBonus ? `⚡ Speed Bonus: ${speedBonusPts} ⭐` : '',
      data.bunniesRescued > 0 ? `🐰 Bunnies (${data.bunniesRescued}): ${bunnyPoints} ⭐` : '',
      data.comboBonus > 0 ? `🔥 Combo: ${data.comboBonus} ⭐` : '',
    ].filter(Boolean);

    breakdown.forEach((line, i) => {
      this.add
        .text(400, 358 + i * 24, line, {
          fontSize: '15px',
          color: '#e0e0e0',
        })
        .setOrigin(0.5);
    });

    const totalY = 358 + breakdown.length * 24 + 12;
    this.add.rectangle(400, totalY, 380, 2, 0x666666);
    this.add
      .text(400, totalY + 10, `TOTAL: ${data.totalStarPoints} ⭐`, {
        fontSize: '22px',
        color: '#ffd54f',
        fontStyle: 'bold',
        stroke: '#000',
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    const btnY = totalY + 55;
    this.createButton(240, btnY, 'Continue →', 0x4caf50, data.onContinue);
    this.createButton(400, btnY, '🔄 Replay', 0x2196f3, data.onReplay);
    this.createButton(560, btnY, '← Menu', 0x9e9e9e, data.onBack);
  }

  private createButton(
    x: number,
    y: number,
    text: string,
    color: number,
    callback: () => void
  ) {
    const bg = this.add
      .rectangle(x, y, 130, 42, color, 0.9)
      .setInteractive({ useHandCursor: true });
    this.add
      .text(x, y, text, {
        fontSize: '14px',
        color: '#ffffff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    bg.on('pointerover', () => bg.setAlpha(1));
    bg.on('pointerout', () => bg.setAlpha(0.9));
    bg.on('pointerdown', () => callback());
  }

  private spawnConfetti() {
    const colors = [0xff4444, 0xff9800, 0xffeb3b, 0x4caf50, 0x2196f3, 0x9c27b0];
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * 800;
      const conf = this.add.rectangle(
        x,
        -10,
        8,
        8,
        colors[Math.floor(Math.random() * colors.length)]
      );
      const targetX = x + (Math.random() - 0.5) * 200;
      const duration = 2000 + Math.random() * 2000;
      const delay = Math.random() * 1000;

      this.tweens.add({
        targets: conf,
        x: targetX,
        y: 520,
        rotation: Math.random() * Math.PI * 4,
        delay,
        duration,
        onComplete: () => conf.destroy(),
      });
    }
  }
}
