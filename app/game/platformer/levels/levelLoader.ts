// Level loader: creates Phaser objects from level data
import { LevelData, PlatformData } from './level1';
import { LetterHitBox } from '../entities/Letter';

export class LevelLoader {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  createGround(level: LevelData): Phaser.Physics.Arcade.StaticGroup {
    const group = this.scene.physics.add.staticGroup();
    level.platforms.forEach((p: PlatformData) => {
      const rect = this.scene.add.rectangle(
        p.x + p.width / 2,
        p.y + p.height / 2,
        p.width,
        p.height,
        p.color
      );
      group.add(rect);
    });
    return group;
  }

  spawnLetters(
    targetWord: string,
    startX: number,
    groundY: number
  ): Phaser.Physics.Arcade.StaticGroup {
    const group = this.scene.physics.add.staticGroup();
    const spacing = 160;
    const letters = targetWord.toUpperCase().split('');

    letters.forEach((letter, index) => {
      const x = startX + index * spacing;
      const y = groundY - 80;

      // Colored circle background
      const circle = this.scene.add.circle(x, y, 26, 0xffdf00, 1);
      const text = this.scene.add.text(x, y, letter, {
        fontSize: '28px',
        color: '#1a1a2e',
        fontStyle: 'bold',
        fontFamily: 'Arial, sans-serif',
      }).setOrigin(0.5);

      // Use invisible physics rectangle for collision
      const hitBox = this.scene.add.rectangle(x, y, 52, 52, 0xffffff, 0) as LetterHitBox;
      hitBox.letterValue = letter;
      hitBox.circleRef = circle;
      hitBox.textRef = text;
      hitBox.collected = false;
      group.add(hitBox);
    });

    return group;
  }
}
