// HUD overlay scene - runs on top of GameScene
export interface UISceneData {
  targetWord: string;
}

export class UIScene extends Phaser.Scene {
  private targetWordText!: Phaser.GameObjects.Text;
  private collectedText!: Phaser.GameObjects.Text;
  private bunnyCountText!: Phaser.GameObjects.Text;
  private targetWord = '';
  private bunniesRescued = 0;

  constructor() {
    super({ key: 'UIScene' });
  }

  init(data: UISceneData) {
    this.targetWord = (data.targetWord || '').toUpperCase();
    this.bunniesRescued = 0;
  }

  create() {
    const width = this.scale.width;

    // HUD background bar
    const bar = this.add.rectangle(0, 0, width, 50, 0x000000, 0.45);
    bar.setOrigin(0, 0);

    // Target word label
    this.add.text(10, 8, 'Spell:', {
      fontSize: '14px',
      color: '#aaffaa',
      fontFamily: 'Arial, sans-serif',
    });

    this.targetWordText = this.add.text(70, 8, this.targetWord, {
      fontSize: '20px',
      color: '#ffff44',
      fontStyle: 'bold',
      fontFamily: 'Arial, sans-serif',
    });

    // Collected letters
    this.add.text(10, 28, 'Got:', {
      fontSize: '14px',
      color: '#aaffaa',
      fontFamily: 'Arial, sans-serif',
    });

    this.collectedText = this.add.text(50, 28, '_'.repeat(this.targetWord.length), {
      fontSize: '16px',
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif',
    });

    // Bunnies rescued
    this.bunnyCountText = this.add.text(width - 10, 10, '🐰 0', {
      fontSize: '18px',
      color: '#ffccee',
      fontFamily: 'Arial, sans-serif',
    }).setOrigin(1, 0);

    // Listen to game events via scene manager
    const gameScene = this.scene.get('GameScene');
    gameScene.events.on('letterCollected', (_letter: string, collected: string[]) => {
      this.updateCollected(collected);
    });
    gameScene.events.on('bunnyFreed', (_name: string, count: number) => {
      this.bunniesRescued = count;
      this.bunnyCountText.setText(`🐰 ${count}`);
    });
  }

  updateCollected(letters: string[]) {
    const display = letters.join('') + '_'.repeat(
      Math.max(0, this.targetWord.length - letters.length)
    );
    this.collectedText.setText(display);
  }
}
