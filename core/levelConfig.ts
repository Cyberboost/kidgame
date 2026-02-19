import { Grade } from './types';

export type Zone = 'meadow' | 'forest' | 'clouds' | 'rainbow';

export interface LevelConfig {
  id: number;
  name: string;
  zone: Zone;
  grade: Grade;
  wordCount: number; // number of words to spell per round
  requiredStars: number; // stars needed to unlock
  position: { x: number; y: number }; // map position as percentage
}

export const LEVELS: LevelConfig[] = [
  { id: 1, name: 'Bunny Patch', zone: 'meadow', grade: 'PreK', wordCount: 3, requiredStars: 0, position: { x: 8, y: 75 } },
  { id: 2, name: 'Clover Field', zone: 'meadow', grade: 'PreK', wordCount: 3, requiredStars: 1, position: { x: 18, y: 60 } },
  { id: 3, name: 'Daisy Hill', zone: 'meadow', grade: 'K', wordCount: 3, requiredStars: 3, position: { x: 28, y: 70 } },
  { id: 4, name: 'Sunflower Path', zone: 'meadow', grade: 'K', wordCount: 4, requiredStars: 5, position: { x: 38, y: 55 } },
  { id: 5, name: 'Mushroom Ring', zone: 'forest', grade: '1', wordCount: 4, requiredStars: 8, position: { x: 48, y: 65 } },
  { id: 6, name: 'Forest Hollow', zone: 'forest', grade: '1', wordCount: 4, requiredStars: 11, position: { x: 57, y: 50 } },
  { id: 7, name: 'Tall Oak Trail', zone: 'forest', grade: '2', wordCount: 5, requiredStars: 14, position: { x: 67, y: 60 } },
  { id: 8, name: 'Cloud Bridge', zone: 'clouds', grade: '2', wordCount: 5, requiredStars: 17, position: { x: 77, y: 40 } },
  { id: 9, name: 'Sky Garden', zone: 'clouds', grade: '3', wordCount: 5, requiredStars: 20, position: { x: 87, y: 30 } },
  { id: 10, name: 'Rainbow Summit', zone: 'rainbow', grade: '3', wordCount: 5, requiredStars: 24, position: { x: 95, y: 20 } },
];

export function getLevelById(levelId: number): LevelConfig | undefined {
  return LEVELS.find(level => level.id === levelId);
}

export function getZoneLevels(zone: Zone): LevelConfig[] {
  return LEVELS.filter(level => level.zone === zone);
}

export function getZoneName(zone: Zone): string {
  const zoneNames: Record<Zone, string> = {
    meadow: '🌸 Meadow Meadows',
    forest: '🌲 Enchanted Forest',
    clouds: '☁️ Cloud Kingdom',
    rainbow: '🌈 Rainbow Valley',
  };
  return zoneNames[zone];
}
