import Phaser from 'phaser';
import type { Profile } from '@/core/types';

interface PreloadSceneData {
  profile: Profile;
  onGameComplete: (starPointsEarned: number) => void;
  onBack: () => void;
}

export class PreloadScene extends Phaser.Scene {
  private sceneData!: PreloadSceneData;

  constructor() {
    super({ key: 'PreloadScene' });
  }

  init(data: PreloadSceneData) {
    this.sceneData = data;
  }

  preload() {
    this.createTextures();
  }

  private createTextures() {
    // Player texture
    const playerGfx = this.make.graphics({ x: 0, y: 0 });
    playerGfx.fillStyle(0x4fc3f7);
    playerGfx.fillRect(0, 0, 32, 48);
    playerGfx.fillStyle(0x1a3fcc);
    playerGfx.fillRect(4, 0, 24, 16);
    playerGfx.fillStyle(0xffd5b8);
    playerGfx.fillRect(8, 16, 16, 14);
    playerGfx.fillStyle(0x4caf50);
    playerGfx.fillRect(4, 30, 24, 18);
    playerGfx.generateTexture('player', 32, 48);
    playerGfx.destroy();

    // Ground texture
    const groundGfx = this.make.graphics({ x: 0, y: 0 });
    groundGfx.fillStyle(0x4caf50);
    groundGfx.fillRect(0, 0, 64, 16);
    groundGfx.fillStyle(0x795548);
    groundGfx.fillRect(0, 16, 64, 16);
    groundGfx.generateTexture('ground', 64, 32);
    groundGfx.destroy();

    // Platform texture
    const platGfx = this.make.graphics({ x: 0, y: 0 });
    platGfx.fillStyle(0x8d6e63);
    platGfx.fillRect(0, 0, 96, 24);
    platGfx.fillStyle(0x4caf50);
    platGfx.fillRect(0, 0, 96, 8);
    platGfx.generateTexture('platform', 96, 24);
    platGfx.destroy();

    // Breakable crate
    const crateGfx = this.make.graphics({ x: 0, y: 0 });
    crateGfx.fillStyle(0x8d6e63);
    crateGfx.fillRect(0, 0, 32, 32);
    crateGfx.lineStyle(2, 0x5d4037);
    crateGfx.strokeRect(2, 2, 28, 28);
    crateGfx.generateTexture('breakable-crate', 32, 32);
    crateGfx.destroy();

    // Stone block
    const stoneGfx = this.make.graphics({ x: 0, y: 0 });
    stoneGfx.fillStyle(0x9e9e9e);
    stoneGfx.fillRect(0, 0, 32, 32);
    stoneGfx.lineStyle(2, 0x616161);
    stoneGfx.strokeRect(2, 2, 28, 28);
    stoneGfx.generateTexture('breakable-stone', 32, 32);
    stoneGfx.destroy();

    // Question block
    const qGfx = this.make.graphics({ x: 0, y: 0 });
    qGfx.fillStyle(0xffd54f);
    qGfx.fillRect(0, 0, 32, 32);
    qGfx.lineStyle(3, 0xf57f17);
    qGfx.strokeRect(2, 2, 28, 28);
    qGfx.generateTexture('question-block', 32, 32);
    qGfx.destroy();

    // Letter collectible
    const letterGfx = this.make.graphics({ x: 0, y: 0 });
    letterGfx.fillStyle(0xffffff);
    letterGfx.fillCircle(12, 12, 12);
    letterGfx.lineStyle(2, 0xffe082);
    letterGfx.strokeCircle(12, 12, 11);
    letterGfx.generateTexture('letter-collectible', 24, 24);
    letterGfx.destroy();

    // Bunny cage
    const cageGfx = this.make.graphics({ x: 0, y: 0 });
    cageGfx.fillStyle(0x9e9e9e);
    cageGfx.fillRect(0, 0, 32, 40);
    cageGfx.lineStyle(2, 0x757575);
    for (let i = 0; i <= 4; i++) {
      cageGfx.lineBetween(i * 8, 0, i * 8, 40);
    }
    cageGfx.strokeRect(0, 0, 32, 40);
    cageGfx.generateTexture('bunny-cage', 32, 40);
    cageGfx.destroy();

    // Power-up star
    const puGfx = this.make.graphics({ x: 0, y: 0 });
    puGfx.fillStyle(0xce93d8);
    puGfx.fillCircle(12, 12, 12);
    puGfx.generateTexture('power-up', 24, 24);
    puGfx.destroy();

    // Flag goal
    const flagGfx = this.make.graphics({ x: 0, y: 0 });
    flagGfx.fillStyle(0x78909c);
    flagGfx.fillRect(12, 0, 4, 80);
    flagGfx.fillStyle(0xf44336);
    flagGfx.fillTriangle(16, 0, 16, 24, 36, 12);
    flagGfx.generateTexture('flag-goal', 40, 80);
    flagGfx.destroy();

    // Spark particle
    const sparkGfx = this.make.graphics({ x: 0, y: 0 });
    sparkGfx.fillStyle(0xffd54f);
    sparkGfx.fillCircle(4, 4, 4);
    sparkGfx.generateTexture('spark', 8, 8);
    sparkGfx.destroy();

    // Star particle
    const starGfx = this.make.graphics({ x: 0, y: 0 });
    starGfx.fillStyle(0xffeb3b);
    starGfx.fillCircle(8, 8, 8);
    starGfx.generateTexture('star-particle', 16, 16);
    starGfx.destroy();
  }

  create() {
    this.scene.start('GameScene', this.sceneData);
  }
}
