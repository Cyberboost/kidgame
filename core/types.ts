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
  starPoints: number;
  totalStarPointsEarned: number;
  unlockedCostumes: string[];
  equippedCostume: string | null;
  equippedPet: string | null;
  unlockedPets: string[];
  unlockedEmotes: string[];
  unlockedDances: string[];
  characterCustomization: {
    skinTone: string;
    hairStyle: string;
    hairColor: string;
    accessories: string[];
  };
  achievements: {
    [achievementId: string]: {
      unlocked: boolean;
      progress: number;
      unlockedAt?: string;
    };
  };
  dailyStreak: number;
  lastPlayedDate: string;
}

export interface LevelProgress {
  levelId: string;
  completed: boolean;
  bestTime: number;
  starsEarned: number;
  lettersFound: number;
  secretsFound: number;
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
