// Collectible letter entity

/** Extended Rectangle that carries letter metadata for the physics overlap system */
export type LetterHitBox = Phaser.GameObjects.Rectangle & {
  letterValue: string;
  circleRef: Phaser.GameObjects.Arc;
  textRef: Phaser.GameObjects.Text;
  collected: boolean;
};

export interface LetterObject {
  hitBox: LetterHitBox;
}

export function collectLetter(letterObj: LetterHitBox) {
  if (letterObj.collected) return false;
  letterObj.collected = true;

  // Hide all visuals
  letterObj.circleRef.setVisible(false);
  letterObj.textRef.setVisible(false);
  letterObj.setVisible(false);

  // Disable the static body
  const body = letterObj.body as Phaser.Physics.Arcade.StaticBody | null;
  if (body) {
    body.enable = false;
  }

  return true;
}
