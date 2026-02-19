import { DifficultyConfig, DifficultyTier, Grade } from './types';

export const DIFFICULTY_CONFIGS: Record<DifficultyTier, DifficultyConfig> = {
  Sprout: {
    tier: 'Sprout',
    grades: ['PreK', 'K'],
    gridSize: 4,
    gardenFocusMax: 999, // Effectively unlimited for young kids
    gentleMode: true,
    allowRetry: true,
    timerEnabled: false,
    consequences: {
      onFocusZero: 'endTurn',
      onIncorrectSubmit: 'addToReview',
    },
  },
  Explorer: {
    tier: 'Explorer',
    grades: ['1', '2'],
    gridSize: 5,
    gardenFocusMax: 3,
    gentleMode: false,
    allowRetry: false,
    timerEnabled: false,
    consequences: {
      onFocusZero: 'endTurnResetStreak',
      onIncorrectSubmit: 'immediateReset',
    },
  },
  Ranger: {
    tier: 'Ranger',
    grades: ['3', '4', '5'],
    gridSize: 6,
    gardenFocusMax: 3,
    gentleMode: false,
    allowRetry: true,
    timerEnabled: false,
    consequences: {
      onFocusZero: 'endTurnDisableHint',
      onIncorrectSubmit: 'requireRetry',
    },
  },
  Guardian: {
    tier: 'Guardian',
    grades: ['6', '7', '8'],
    gridSize: 7,
    gardenFocusMax: 2,
    gentleMode: false,
    allowRetry: false,
    timerEnabled: true,
    consequences: {
      onFocusZero: 'endTurnLoseMultiplier',
      onIncorrectSubmit: 'blockProgress',
      onIncorrectLetter: 'lockTile',
    },
  },
};

export function getDifficultyForGrade(grade: Grade): DifficultyTier {
  for (const [tier, config] of Object.entries(DIFFICULTY_CONFIGS)) {
    if (config.grades.includes(grade)) {
      return tier as DifficultyTier;
    }
  }
  return 'Explorer'; // Default fallback
}

export function getBunnyTrapCount(gridSize: number): number {
  // Scale bunny traps based on grid size
  // Aim for roughly 20-30% of tiles to have traps
  const totalTiles = gridSize * gridSize;
  return Math.floor(totalTiles * 0.25);
}
