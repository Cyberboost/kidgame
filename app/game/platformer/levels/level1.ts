// Level data definitions

export interface PlatformData {
  x: number;
  y: number;
  width: number;
  height: number;
  color: number; // Phaser hex color
}

export interface LetterData {
  x: number;
  y: number;
  letter: string;
}

export interface BunnyData {
  x: number;
  y: number;
  name: string; // 'Rosie' | 'Chester' | 'Pip' | 'Violet'
  color: number;
}

export interface CheckpointData {
  x: number;
  y: number;
  wordIndex: number; // which word in the level's word list to require
}

export interface LevelData {
  id: string;
  name: string;
  worldWidth: number;
  worldHeight: number;
  playerStart: { x: number; y: number };
  platforms: PlatformData[];
  letters: LetterData[];
  bunnies: BunnyData[];
  checkpoints: CheckpointData[];
  goalX: number; // x position of the level end flag
  backgroundColor: number;
  groundColor: number;
}

// Level 1: Tutorial - flat terrain, one word, one bunny
export const LEVEL_1: LevelData = {
  id: 'level-1',
  name: 'Bunny Meadow',
  worldWidth: 3200,
  worldHeight: 600,
  playerStart: { x: 80, y: 460 },
  backgroundColor: 0x87ceeb,
  groundColor: 0x5a8a3c,
  platforms: [
    // Ground (full width)
    { x: 0, y: 530, width: 3200, height: 70, color: 0x5a8a3c },
    // Floating platforms
    { x: 400, y: 400, width: 120, height: 20, color: 0x7ab648 },
    { x: 600, y: 340, width: 120, height: 20, color: 0x7ab648 },
    { x: 800, y: 280, width: 120, height: 20, color: 0x7ab648 },
    { x: 1000, y: 380, width: 120, height: 20, color: 0x7ab648 },
    { x: 1200, y: 430, width: 120, height: 20, color: 0x7ab648 },
    { x: 1450, y: 360, width: 120, height: 20, color: 0x7ab648 },
    { x: 1650, y: 300, width: 120, height: 20, color: 0x7ab648 },
    { x: 1900, y: 400, width: 120, height: 20, color: 0x7ab648 },
    { x: 2100, y: 340, width: 120, height: 20, color: 0x7ab648 },
    { x: 2300, y: 430, width: 120, height: 20, color: 0x7ab648 },
    { x: 2600, y: 380, width: 120, height: 20, color: 0x7ab648 },
    { x: 2850, y: 440, width: 120, height: 20, color: 0x7ab648 },
  ],
  // Letters will be generated dynamically from the target word
  letters: [],
  bunnies: [
    { x: 2900, y: 490, name: 'Rosie', color: 0xff9eb5 },
  ],
  checkpoints: [
    { x: 1600, y: 490, wordIndex: 0 },
  ],
  goalX: 3100,
};
