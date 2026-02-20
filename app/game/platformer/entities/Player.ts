// Player (Livy) entity - handles movement and physics
import { PHYSICS_CONFIG } from '../systems/Physics';
import { Controls } from '../systems/Controls';

export type PlayerState = 'idle' | 'running' | 'jumping' | 'falling' | 'landing';

export class Player {
  public sprite: Phaser.GameObjects.Container;
  public body: Phaser.Physics.Arcade.Body;
  public state: PlayerState = 'idle';

  private controls: Controls;
  private isOnGround = false;
  private canJump = true;
  private landingTimer = 0;
  private facingRight = true;

  // Livy visual parts
  private bodyGraphic: Phaser.GameObjects.Graphics;
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, x: number, y: number, controls: Controls) {
    this.scene = scene;
    this.controls = controls;

    // Build the Livy sprite using graphics (SVG-inspired colored shapes)
    this.bodyGraphic = scene.add.graphics();
    this.drawLivy(this.bodyGraphic);

    this.sprite = scene.add.container(x, y, [this.bodyGraphic]);
    scene.physics.add.existing(this.sprite);

    this.body = this.sprite.body as Phaser.Physics.Arcade.Body;
    this.body.setSize(32, 56);
    this.body.setOffset(-16, -28);
    this.body.setGravityY(PHYSICS_CONFIG.gravity.y);
    this.body.setMaxVelocityY(PHYSICS_CONFIG.playerMaxFallSpeed);
    this.body.setCollideWorldBounds(true);
  }

  private drawLivy(g: Phaser.GameObjects.Graphics) {
    g.clear();

    // Dress (green)
    g.fillStyle(0x4caf50);
    g.fillEllipse(0, 10, 30, 28);

    // Body torso
    g.fillStyle(0x81d4fa); // light blue shirt
    g.fillRect(-9, -10, 18, 18);

    // Head (skin tone)
    g.fillStyle(0xffd54f);
    g.fillCircle(0, -22, 14);

    // Hair (cyan/blue gradient approximated as blue)
    g.fillStyle(0x29b6f6);
    g.fillEllipse(0, -32, 28, 16);
    // Side hair strands
    g.fillRect(-14, -30, 5, 12);
    g.fillRect(9, -30, 5, 12);

    // Eyes
    g.fillStyle(0x1a237e);
    g.fillCircle(-4, -22, 3);
    g.fillCircle(4, -22, 3);

    // Smile
    g.lineStyle(1.5, 0x5d4037);
    g.beginPath();
    g.arc(0, -18, 4, 0.2, Math.PI - 0.2);
    g.strokePath();

    // Legs
    g.fillStyle(0xffd54f);
    g.fillRect(-9, 22, 7, 14);
    g.fillRect(2, 22, 7, 14);

    // Shoes
    g.fillStyle(0x5d4037);
    g.fillRect(-11, 34, 10, 5);
    g.fillRect(1, 34, 10, 5);

    // Arms
    g.fillStyle(0x81d4fa);
    g.fillRect(-18, -8, 8, 14);
    g.fillRect(10, -8, 8, 14);
  }

  private drawLivyRunning(g: Phaser.GameObjects.Graphics, frame: number) {
    // Slightly different leg positions for running animation
    g.clear();

    const legOffset = Math.sin(frame * 0.3) * 6;

    // Dress
    g.fillStyle(0x4caf50);
    g.fillEllipse(0, 10, 30, 28);

    // Torso
    g.fillStyle(0x81d4fa);
    g.fillRect(-9, -10, 18, 18);

    // Head
    g.fillStyle(0xffd54f);
    g.fillCircle(0, -22, 14);

    // Hair
    g.fillStyle(0x29b6f6);
    g.fillEllipse(0, -32, 28, 16);
    g.fillRect(-14, -30, 5, 12);
    g.fillRect(9, -30, 5, 12);

    // Eyes
    g.fillStyle(0x1a237e);
    g.fillCircle(-4, -22, 3);
    g.fillCircle(4, -22, 3);

    // Legs (animated)
    g.fillStyle(0xffd54f);
    g.fillRect(-9, 22, 7, 14 + legOffset);
    g.fillRect(2, 22, 7, 14 - legOffset);

    // Shoes
    g.fillStyle(0x5d4037);
    g.fillRect(-11, 34 + legOffset, 10, 5);
    g.fillRect(1, 34 - legOffset, 10, 5);

    // Arms (swinging)
    g.fillStyle(0x81d4fa);
    g.fillRect(-18, -8 - legOffset / 2, 8, 14);
    g.fillRect(10, -8 + legOffset / 2, 8, 14);
  }

  private animFrame = 0;

  update(delta: number) {
    const ctrl = this.controls.getState();
    const onGround = this.body.blocked.down;
    this.isOnGround = onGround;

    if (onGround && !this.canJump) {
      this.canJump = true;
    }

    // Horizontal movement
    if (ctrl.left) {
      this.body.setAccelerationX(-PHYSICS_CONFIG.acceleration);
      this.body.setDragX(0);
      this.facingRight = false;
      this.sprite.setScale(-1, 1);
    } else if (ctrl.right) {
      this.body.setAccelerationX(PHYSICS_CONFIG.acceleration);
      this.body.setDragX(0);
      this.facingRight = true;
      this.sprite.setScale(1, 1);
    } else {
      this.body.setAccelerationX(0);
      this.body.setDragX(PHYSICS_CONFIG.deceleration);
    }

    // Clamp horizontal speed
    if (Math.abs(this.body.velocity.x) > PHYSICS_CONFIG.playerSpeed) {
      this.body.setVelocityX(
        Math.sign(this.body.velocity.x) * PHYSICS_CONFIG.playerSpeed
      );
    }

    // Jump
    if (ctrl.jump && onGround && this.canJump) {
      this.body.setVelocityY(PHYSICS_CONFIG.playerJumpVelocity);
      this.canJump = false;
    }

    // Update state
    if (!onGround) {
      this.state = this.body.velocity.y < 0 ? 'jumping' : 'falling';
    } else if (Math.abs(this.body.velocity.x) > 10) {
      this.state = 'running';
    } else {
      this.state = 'idle';
    }

    // Animate
    this.animFrame += delta;
    if (this.state === 'running') {
      this.drawLivyRunning(this.bodyGraphic, this.animFrame);
    } else {
      this.drawLivy(this.bodyGraphic);
    }

    // Bobbing while jumping/falling
    if (this.state === 'jumping') {
      this.bodyGraphic.setY(-4);
    } else if (this.state === 'falling') {
      this.bodyGraphic.setY(4);
    } else {
      this.bodyGraphic.setY(0);
    }
  }

  getPosition(): { x: number; y: number } {
    return { x: this.sprite.x, y: this.sprite.y };
  }
}
