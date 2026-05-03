// Core type definitions for Livy's Bunny Rescue Adventure game

export type Grade = 'PreK' | 'K' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';

export type DifficultyTier = 'Sprout' | 'Explorer' | 'Ranger' | 'Guardian';

// ADHD-Optimized Game Modes
export type GameMode = 'classic' | 'focus' | 'adventure';

// Age-based groupings for adaptive difficulty
export type AgeRange = '4-6' | '7-8' | '9-10';

// Sensory profiles for ADHD-friendly customization
export type SensoryProfile = 'calm' | 'adventure' | 'minimal';

export interface DifficultyConfig {
  tier: DifficultyTier;
  grades: Grade[];
  gridSize: number;
  gardenFocusMax: number;
  gentleMode: boolean;
  allowRetry: boolean;
  timerEnabled: boolean;
  consequences: {
    onFocusZero: 'endTurn' | 'endTurnResetStreak' | 'endTurnDisableHint' | 'endTurnLoseMultiplier';
    onIncorrectSubmit: 'addToReview' | 'immediateReset' | 'requireRetry' | 'blockProgress';
    onIncorrectLetter?: 'lockTile';
  };
}

export interface TileState {
  letter: string;
  row: number;
  col: number;
  hasBunnyTrap: boolean;
  cleared: boolean;
  locked: boolean;
  selected: boolean;
}

export interface BunnyTrap {
  row: number;
  col: number;
  rescued: boolean;
}

export interface WordPerformance {
  word: string;
  attempts: number;
  letterMistakes: number;
  incorrectSubmits: number;
  timeToCorrect: number;
  mastered: boolean;
  lastAttempt: Date;
}

// Micro-mission for Focus Mode
export interface MicroMission {
  id: string;
  type: 'speed-spell' | 'bunny-rush' | 'focus-challenge' | 'letter-hunt';
  targetWord?: string;
  targetLetter?: string;
  targetCount?: number;
  timeLimit: number;
  focusReward: number;
  completed: boolean;
  startTime?: number;
}

// Focus Meter state for ADHD optimization
export interface FocusMeterState {
  current: number;
  max: number;
  drainRate: number; // points per second
  lastUpdate: number; // timestamp
  isPaused: boolean;
}

// Momentum/streak system for motivation
export interface MomentumState {
  level: 'warming-up' | 'on-fire' | 'unstoppable' | 'none';
  multiplier: number; // 1.0x to 3.0x
  consecutiveCorrect: number;
  streakBonus: number;
}

export interface Profile {
  id: string;
  nickname: string;
  defaultGrade: Grade;
  preferredDifficulty?: DifficultyTier;
  createdAt: Date;
  stats: {
    totalGamesPlayed: number;
    totalBunniesRescued: number;
    totalWordsSpelled: number;
    currentStreak: number;
    bestStreak: number;
    accuracy: number;
  };
  unlockedThemes: string[];
  wordLists: {
    [key in Grade]?: string[];
  };
  customWords: string[];
  wordPerformance: { [word: string]: WordPerformance };
  // ADHD-optimized profile fields
  ageRange?: AgeRange;
  sensoryProfile?: SensoryProfile;
  preferredMode?: GameMode;
  masteredWords?: string[];
}

export interface GameSession {
  id: string;
  mode: 'solo' | 'coop';
  profileIds: string[];
  currentPlayerIndex: number;
  difficulty: DifficultyTier;
  grade: Grade;
  themeId: string;
  gridSize: number;
  board: TileState[][];
  bunnyTraps: BunnyTrap[];
  activeWords: string[];
  reviewBasket: string[];
  currentWordIndex: number;
  currentWord: string;
  currentInput: string;
  selectedTiles: { row: number; col: number }[];
  gardenFocus: number;
  gardenFocusMax: number;
  streak: number;
  bunniesRescued: number;
  totalBunnies: number;
  wordsSpelled: number;
  hintsDisabled: boolean;
  turnStartTime: number;
  sessionStartTime: number;
  completed: boolean;
  stats: {
    [profileId: string]: {
      wordsSpelled: number;
      bunniesRescued: number;
      letterMistakes: number;
      incorrectSubmits: number;
      turnsTaken: number;
    };
  };
  // ADHD-optimized game mode fields
  gameMode?: GameMode;
  focusMeter?: FocusMeterState;
  momentum?: MomentumState;
  microMission?: MicroMission;
  ageRange?: AgeRange;
}

export interface YardTheme {
  id: string;
  name: string;
  description: string;
  premium: boolean;
  unlockCondition?: {
    type: 'accuracy' | 'reviewBasketCleared' | 'bunniesRescued' | 'wordsSpelled';
    value: number;
  };
  styles: {
    background: string;
    tileNormal: string;
    tileSelected: string;
    tileCleared: string;
    tileLocked: string;
    bunnyImage: string;
    trapImage: string;
  };
  // Sensory profile categorization
  sensoryProfile?: SensoryProfile;
  animationSpeed?: 'slow' | 'normal' | 'fast';
  particleEffects?: boolean;
  soundProfile?: 'quiet' | 'moderate' | 'energetic';
}

export interface GameAction {
  type: 
    | 'SELECT_TILE' 
    | 'UNDO_TILE' 
    | 'CLEAR_SELECTION' 
    | 'SUBMIT_WORD'
    | 'START_TURN'
    | 'END_TURN'
    | 'TOGGLE_HINT';
  payload?: any;
}

export interface GameSettings {
  highContrast: boolean;
  dyslexicFont: boolean;
  speechEnabled: boolean;
  soundEnabled: boolean;
  musicEnabled: boolean;
  // ADHD-optimized settings
  sensoryProfile?: SensoryProfile;
  particleEffects?: boolean;
  animationSpeed?: 'slow' | 'normal' | 'fast';
  reducedMotion?: boolean;
}
