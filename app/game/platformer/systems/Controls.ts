// Input handling for keyboard and touch controls

export interface ControlState {
  left: boolean;
  right: boolean;
  jump: boolean;
}

export class Controls {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
  private wasd: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  } | null = null;

  // Touch control state (set from UI buttons)
  public touchLeft = false;
  public touchRight = false;
  public touchJump = false;

  constructor(scene: Phaser.Scene) {
    if (scene.input.keyboard) {
      this.cursors = scene.input.keyboard.createCursorKeys();
      this.wasd = {
        up: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        down: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        left: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        right: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      };
    }
  }

  getState(): ControlState {
    const left =
      this.touchLeft ||
      (this.cursors?.left.isDown ?? false) ||
      (this.wasd?.left.isDown ?? false);
    const right =
      this.touchRight ||
      (this.cursors?.right.isDown ?? false) ||
      (this.wasd?.right.isDown ?? false);
    const jump =
      this.touchJump ||
      (this.cursors?.up.isDown ?? false) ||
      (this.cursors?.space.isDown ?? false) ||
      (this.wasd?.up.isDown ?? false);

    return { left, right, jump };
  }
}
