// Core type definitions for Livy's Bunny Rescue Adventure game

export type Grade = 'PreK' | 'K' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';

export type DifficultyTier = 'Sprout' | 'Explorer' | 'Ranger' | 'Guardian';

export interface DifficultyConfig {
  tier: DifficultyTier;
  grades: Grade[];
  gridSize: number;
  gardenFocusMax: number;
  gentleMode: boolean;
  allowRetry: boolean;
  timerEnabled: boolean;
  timerDuration: number; // seconds per round
  shuffleInterval: number; // seconds between shuffles
  wordsPerRound: number; // number of target words per round
  maxStrikes: number; // wrong letter attempts before round reset
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
  // Multi-word round support
  targetWords: string[]; // Words to find in this round
  foundWords: string[]; // Words already found in this round
  strikes: number; // Wrong letter selections count
  roundTimeRemaining: number; // Time left in round (seconds)
  roundStartTime: number; // When current round started
  lastShuffleTime: number; // When letters were last shuffled
  stats: {
    [profileId: string]: {
      wordsSpelled: number;
      bunniesRescued: number;
      letterMistakes: number;
      incorrectSubmits: number;
      turnsTaken: number;
    };
  };
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
}
