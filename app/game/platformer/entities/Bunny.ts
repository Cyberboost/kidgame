// Trapped bunny NPC entity

export class Bunny {
  private scene: Phaser.Scene;
  public x: number;
  public y: number;
  public name: string;
  public freed = false;

  private cageGraphic: Phaser.GameObjects.Graphics;
  private bunnyGraphic: Phaser.GameObjects.Graphics;
  private label: Phaser.GameObjects.Text;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    name: string,
    color: number
  ) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.name = name;

    // Draw cage
    this.cageGraphic = scene.add.graphics();
    this.drawCage(this.cageGraphic);
    this.cageGraphic.setPosition(x, y);

    // Draw bunny inside cage
    this.bunnyGraphic = scene.add.graphics();
    this.drawBunny(this.bunnyGraphic, color);
    this.bunnyGraphic.setPosition(x, y - 10);

    // Name label
    this.label = scene.add.text(x, y + 30, name, {
      fontSize: '12px',
      color: '#ffffff',
      backgroundColor: '#00000066',
      padding: { x: 4, y: 2 },
    }).setOrigin(0.5);
  }

  private drawCage(g: Phaser.GameObjects.Graphics) {
    g.clear();
    // Cage bars
    g.lineStyle(3, 0x888888);
    g.strokeRect(-18, -28, 36, 40);
    // Vertical bars
    for (let bx = -9; bx <= 9; bx += 9) {
      g.beginPath();
      g.moveTo(bx, -28);
      g.lineTo(bx, 12);
      g.strokePath();
    }
    // Top handle
    g.fillStyle(0x888888);
    g.fillRect(-4, -34, 8, 8);
  }

  private drawBunny(g: Phaser.GameObjects.Graphics, color: number) {
    g.clear();
    // Body
    g.fillStyle(color);
    g.fillEllipse(0, 0, 22, 18);
    // Head
    g.fillCircle(0, -12, 9);
    // Ears
    g.fillEllipse(-5, -24, 6, 14);
    g.fillEllipse(5, -24, 6, 14);
    // Eyes
    g.fillStyle(0x1a237e);
    g.fillCircle(-3, -13, 2);
    g.fillCircle(3, -13, 2);
    // Nose
    g.fillStyle(0xff69b4);
    g.fillCircle(0, -10, 1.5);
  }

  free() {
    if (this.freed) return;
    this.freed = true;

    // Animate freedom - bounce up and fade
    this.scene.tweens.add({
      targets: [this.cageGraphic, this.bunnyGraphic, this.label],
      y: '-=80',
      alpha: 0,
      duration: 800,
      ease: 'Power2',
      onComplete: () => {
        this.cageGraphic.destroy();
        this.bunnyGraphic.destroy();
        this.label.destroy();
      },
    });

    // Show freed particle emitter or star burst
    const stars = this.scene.add.text(this.x, this.y - 40, '⭐🐰⭐', {
      fontSize: '24px',
    }).setOrigin(0.5);
    this.scene.tweens.add({
      targets: stars,
      y: '-=60',
      alpha: 0,
      duration: 1200,
      ease: 'Power1',
      onComplete: () => stars.destroy(),
    });
  }
}
