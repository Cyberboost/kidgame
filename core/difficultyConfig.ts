import { DifficultyConfig, DifficultyTier, Grade } from './types';

export const DIFFICULTY_CONFIGS: Record<DifficultyTier, DifficultyConfig> = {
  Sprout: {
    tier: 'Sprout',
    grades: ['PreK', 'K'],
    gridSize: 4,
    gardenFocusMax: 999, // Effectively unlimited for young kids
    gentleMode: true,
    allowRetry: true,
    timerEnabled: true,
    timerDuration: 15, // 15 seconds per round
    shuffleInterval: 5, // Shuffle every 5 seconds
    wordsPerRound: 3, // 3 words per round
    maxStrikes: 3, // 3 wrong letter attempts
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
    timerEnabled: true,
    timerDuration: 14, // 14 seconds per round
    shuffleInterval: 4, // Shuffle every 4 seconds
    wordsPerRound: 3, // 3-4 words per round (will use 3 here)
    maxStrikes: 3,
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
    timerEnabled: true,
    timerDuration: 12, // 12 seconds per round
    shuffleInterval: 4, // Shuffle every 4 seconds
    wordsPerRound: 4, // 4 words per round
    maxStrikes: 3,
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
    timerDuration: 10, // 10 seconds per round
    shuffleInterval: 3, // Shuffle every 3 seconds
    wordsPerRound: 5, // 5 words per round
    maxStrikes: 3,
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
