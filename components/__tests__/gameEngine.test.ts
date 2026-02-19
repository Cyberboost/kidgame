import { gameEngine } from '@/core/gameEngine';
import { GameSession } from '@/core/types';
import { DIFFICULTY_CONFIGS } from '@/core/difficultyConfig';

describe('GameEngine - Letter Validation', () => {
  let mockSession: GameSession;

  beforeEach(() => {
    mockSession = {
      id: 'test-session',
      mode: 'solo',
      profileIds: ['test-profile'],
      currentPlayerIndex: 0,
      difficulty: 'Explorer',
      grade: '1',
      themeId: 'front-lawn',
      gridSize: 5,
      board: [
        [
          { letter: 'C', row: 0, col: 0, hasBunnyTrap: false, cleared: false, locked: false, selected: false },
          { letter: 'A', row: 0, col: 1, hasBunnyTrap: false, cleared: false, locked: false, selected: false },
          { letter: 'T', row: 0, col: 2, hasBunnyTrap: false, cleared: false, locked: false, selected: false },
        ],
      ] as any,
      bunnyTraps: [],
      activeWords: ['CAT'],
      reviewBasket: [],
      currentWordIndex: 0,
      currentWord: 'CAT',
      currentInput: '',
      selectedTiles: [],
      gardenFocus: 3,
      gardenFocusMax: 3,
      streak: 0,
      bunniesRescued: 0,
      totalBunnies: 0,
      wordsSpelled: 0,
      hintsDisabled: false,
      turnStartTime: Date.now(),
      sessionStartTime: Date.now(),
      completed: false,
      stats: {},
    };
  });

  test('should accept correct letter selection', () => {
    const config = DIFFICULTY_CONFIGS['Explorer'];
    const tile = mockSession.board[0][0]; // 'C'
    
    const result = gameEngine.validateLetterSelection(mockSession, tile, config);
    
    expect(result.valid).toBe(true);
    expect(result.message).toBeUndefined();
  });

  test('should reject incorrect letter selection', () => {
    const config = DIFFICULTY_CONFIGS['Explorer'];
    const tile = mockSession.board[0][1]; // 'A' but expecting 'C'
    
    const result = gameEngine.validateLetterSelection(mockSession, tile, config);
    
    expect(result.valid).toBe(false);
    expect(result.focusReduced).toBe(true);
    expect(result.message).toBeDefined();
  });

  test('should reject cleared tiles', () => {
    const config = DIFFICULTY_CONFIGS['Explorer'];
    const tile = { ...mockSession.board[0][0], cleared: true };
    
    const result = gameEngine.validateLetterSelection(mockSession, tile, config);
    
    expect(result.valid).toBe(false);
    expect(result.message).toContain('already been used');
  });

  test('should reject locked tiles', () => {
    const config = DIFFICULTY_CONFIGS['Explorer'];
    const tile = { ...mockSession.board[0][0], locked: true };
    
    const result = gameEngine.validateLetterSelection(mockSession, tile, config);
    
    expect(result.valid).toBe(false);
    expect(result.message).toContain('locked');
  });

  test('should end turn when focus reaches zero', () => {
    const config = DIFFICULTY_CONFIGS['Explorer'];
    mockSession.gardenFocus = 1;
    const tile = mockSession.board[0][1]; // Wrong letter
    
    const result = gameEngine.validateLetterSelection(mockSession, tile, config);
    
    expect(result.valid).toBe(false);
    expect(result.focusReduced).toBe(true);
    expect(result.turnEnded).toBe(true);
  });

  test('should validate letter-by-letter progression', () => {
    const config = DIFFICULTY_CONFIGS['Explorer'];
    
    // First letter: C
    let result = gameEngine.validateLetterSelection(
      mockSession, 
      mockSession.board[0][0], 
      config
    );
    expect(result.valid).toBe(true);
    
    // Update input
    mockSession.currentInput = 'C';
    
    // Second letter: A
    result = gameEngine.validateLetterSelection(
      mockSession,
      mockSession.board[0][1],
      config
    );
    expect(result.valid).toBe(true);
    
    // Update input
    mockSession.currentInput = 'CA';
    
    // Third letter: T
    result = gameEngine.validateLetterSelection(
      mockSession,
      mockSession.board[0][2],
      config
    );
    expect(result.valid).toBe(true);
  });
});

describe('GameEngine - Word Submission', () => {
  let mockSession: GameSession;

  beforeEach(() => {
    mockSession = {
      id: 'test-session',
      mode: 'solo',
      profileIds: ['test-profile'],
      currentPlayerIndex: 0,
      difficulty: 'Explorer',
      grade: '1',
      themeId: 'front-lawn',
      gridSize: 5,
      board: [
        [
          { letter: 'C', row: 0, col: 0, hasBunnyTrap: true, cleared: false, locked: false, selected: true },
          { letter: 'A', row: 0, col: 1, hasBunnyTrap: false, cleared: false, locked: false, selected: true },
          { letter: 'T', row: 0, col: 2, hasBunnyTrap: false, cleared: false, locked: false, selected: true },
        ],
      ] as any,
      bunnyTraps: [
        { row: 0, col: 0, rescued: false },
      ],
      activeWords: ['CAT'],
      reviewBasket: [],
      currentWordIndex: 0,
      currentWord: 'CAT',
      currentInput: 'CAT',
      selectedTiles: [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 },
      ],
      gardenFocus: 3,
      gardenFocusMax: 3,
      streak: 0,
      bunniesRescued: 0,
      totalBunnies: 1,
      wordsSpelled: 0,
      hintsDisabled: false,
      turnStartTime: Date.now(),
      sessionStartTime: Date.now(),
      completed: false,
      stats: {},
    };
  });

  test('should accept correct word submission', () => {
    const config = DIFFICULTY_CONFIGS['Explorer'];
    
    const result = gameEngine.submitWord(mockSession, config);
    
    expect(result.correct).toBe(true);
    expect(result.bunniesRescued).toBe(1);
  });

  test('should reject incorrect word submission', () => {
    const config = DIFFICULTY_CONFIGS['Explorer'];
    mockSession.currentInput = 'DOG';
    
    const result = gameEngine.submitWord(mockSession, config);
    
    expect(result.correct).toBe(false);
    expect(result.bunniesRescued).toBe(0);
  });

  test('should rescue bunnies on correct submission', () => {
    const config = DIFFICULTY_CONFIGS['Explorer'];
    
    const result = gameEngine.submitWord(mockSession, config);
    
    expect(result.bunniesRescued).toBe(1);
    expect(mockSession.bunnyTraps[0].rescued).toBe(true);
  });

  test('should not rescue already rescued bunnies', () => {
    const config = DIFFICULTY_CONFIGS['Explorer'];
    mockSession.bunnyTraps[0].rescued = true;
    
    const result = gameEngine.submitWord(mockSession, config);
    
    expect(result.bunniesRescued).toBe(0);
  });
});
