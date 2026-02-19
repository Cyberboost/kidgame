import { Grade } from './types';

export type Zone = 'meadow' | 'forest' | 'clouds' | 'rainbow';
export type RescueBunnyType = 'rosie' | 'chester' | 'pip' | 'violet';

export interface LevelConfig {
  id: number;
  name: string;
  zone: Zone;
  grade: Grade;
  wordCount: number;
  requiredStars: number;
  position: { x: number; y: number };
  rescueBunny: RescueBunnyType;
  rescueBunnyName: string;
}

export const LEVEL_CONFIGS: LevelConfig[] = [
  // Meadow Zone - Rosie (Levels 1-3)
  {
    id: 1,
    name: 'Daisy Field',
    zone: 'meadow',
    grade: 'PreK',
    wordCount: 5,
    requiredStars: 0,
    position: { x: 100, y: 500 },
    rescueBunny: 'rosie',
    rescueBunnyName: 'Rosie',
  },
  {
    id: 2,
    name: 'Clover Patch',
    zone: 'meadow',
    grade: 'K',
    wordCount: 6,
    requiredStars: 3,
    position: { x: 200, y: 450 },
    rescueBunny: 'rosie',
    rescueBunnyName: 'Rosie',
  },
  {
    id: 3,
    name: 'Butterfly Garden',
    zone: 'meadow',
    grade: '1',
    wordCount: 7,
    requiredStars: 6,
    position: { x: 300, y: 400 },
    rescueBunny: 'rosie',
    rescueBunnyName: 'Rosie',
  },
  // Forest Zone - Chester (Levels 4-6)
  {
    id: 4,
    name: 'Oak Grove',
    zone: 'forest',
    grade: '2',
    wordCount: 8,
    requiredStars: 9,
    position: { x: 400, y: 350 },
    rescueBunny: 'chester',
    rescueBunnyName: 'Chester',
  },
  {
    id: 5,
    name: 'Mossy Hollow',
    zone: 'forest',
    grade: '3',
    wordCount: 9,
    requiredStars: 12,
    position: { x: 500, y: 300 },
    rescueBunny: 'chester',
    rescueBunnyName: 'Chester',
  },
  {
    id: 6,
    name: 'Willow Creek',
    zone: 'forest',
    grade: '4',
    wordCount: 10,
    requiredStars: 15,
    position: { x: 600, y: 250 },
    rescueBunny: 'chester',
    rescueBunnyName: 'Chester',
  },
  // Cloud Zone - Professor Pip (Levels 7-8)
  {
    id: 7,
    name: 'Cumulus Peaks',
    zone: 'clouds',
    grade: '5',
    wordCount: 11,
    requiredStars: 18,
    position: { x: 700, y: 200 },
    rescueBunny: 'pip',
    rescueBunnyName: 'Professor Pip',
  },
  {
    id: 8,
    name: 'Sky Library',
    zone: 'clouds',
    grade: '6',
    wordCount: 12,
    requiredStars: 21,
    position: { x: 800, y: 150 },
    rescueBunny: 'pip',
    rescueBunnyName: 'Professor Pip',
  },
  // Rainbow Zone - Violet (Levels 9-10)
  {
    id: 9,
    name: 'Prism Falls',
    zone: 'rainbow',
    grade: '7',
    wordCount: 13,
    requiredStars: 24,
    position: { x: 900, y: 100 },
    rescueBunny: 'violet',
    rescueBunnyName: 'Violet',
  },
  {
    id: 10,
    name: 'Rainbow Summit',
    zone: 'rainbow',
    grade: '8',
    wordCount: 15,
    requiredStars: 27,
    position: { x: 1000, y: 50 },
    rescueBunny: 'violet',
    rescueBunnyName: 'Violet',
  },
];

/**
 * Get level configuration by level ID
 */
export function getLevelConfig(levelId: number): LevelConfig | undefined {
  return LEVEL_CONFIGS.find(level => level.id === levelId);
}

/**
 * Get rescue bunny for a specific level
 */
export function getRescueBunnyForLevel(levelId: number): RescueBunnyType | undefined {
  const level = getLevelConfig(levelId);
  return level?.rescueBunny;
}

/**
 * Get all levels for a specific zone
 */
export function getLevelsByZone(zone: Zone): LevelConfig[] {
  return LEVEL_CONFIGS.filter(level => level.zone === zone);
}

/**
 * Map of bunny types to indices for RescueBunny component
 */
const BUNNY_TYPE_TO_INDEX_MAP: Record<RescueBunnyType, number> = {
  rosie: 0,
  chester: 1,
  pip: 2,
  violet: 3,
};

/**
 * Get bunny index (0-3) for use with RescueBunny component
 */
export function getBunnyIndexForLevel(levelId: number): number {
  const bunnyType = getRescueBunnyForLevel(levelId);
  return bunnyType ? BUNNY_TYPE_TO_INDEX_MAP[bunnyType] : 0;
}
