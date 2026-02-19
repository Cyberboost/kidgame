import { gameEngine } from '@/core/gameEngine';
import { GameSession } from '@/core/types';
import { ReviewBasket } from '@/core/reviewBasket';

describe('Win Condition', () => {
  let mockSession: GameSession;
  let reviewBasket: ReviewBasket;

  beforeEach(() => {
    reviewBasket = new ReviewBasket();
    
    mockSession = {
      id: 'test-session',
      mode: 'solo',
      profileIds: ['test-profile'],
      currentPlayerIndex: 0,
      difficulty: 'Explorer',
      grade: '1',
      themeId: 'front-lawn',
      gridSize: 5,
      board: [] as any,
      bunnyTraps: [
        { row: 0, col: 0, rescued: false },
        { row: 0, col: 1, rescued: false },
        { row: 0, col: 2, rescued: false },
      ],
      activeWords: [],
      reviewBasket: [],
      currentWordIndex: 0,
      currentWord: 'TEST',
      currentInput: '',
      selectedTiles: [],
      gardenFocus: 3,
      gardenFocusMax: 3,
      streak: 0,
      bunniesRescued: 0,
      totalBunnies: 3,
      wordsSpelled: 0,
      hintsDisabled: false,
      turnStartTime: Date.now(),
      sessionStartTime: Date.now(),
      completed: false,
      stats: {},
    };
  });

  test('should not win when bunnies remain', () => {
    // All bunnies not rescued
    mockSession.bunnyTraps[0].rescued = false;
    
    const won = gameEngine.checkWinCondition(mockSession, reviewBasket);
    expect(won).toBe(false);
  });

  test('should not win when review basket is not empty', () => {
    // All bunnies rescued but review basket has words
    mockSession.bunnyTraps.forEach(trap => trap.rescued = true);
    reviewBasket.add('FAILED_WORD');
    
    const won = gameEngine.checkWinCondition(mockSession, reviewBasket);
    expect(won).toBe(false);
  });

  test('should win when all bunnies rescued AND review basket empty', () => {
    // All bunnies rescued
    mockSession.bunnyTraps.forEach(trap => trap.rescued = true);
    
    // Review basket empty
    expect(reviewBasket.isEmpty()).toBe(true);
    
    const won = gameEngine.checkWinCondition(mockSession, reviewBasket);
    expect(won).toBe(true);
  });

  test('should not win when both conditions are not met', () => {
    // Bunnies not rescued
    mockSession.bunnyTraps.forEach(trap => trap.rescued = false);
    
    // Review basket not empty
    reviewBasket.add('FAILED_WORD');
    
    const won = gameEngine.checkWinCondition(mockSession, reviewBasket);
    expect(won).toBe(false);
  });

  test('should handle empty bunny trap list', () => {
    mockSession.bunnyTraps = [];
    
    const won = gameEngine.checkWinCondition(mockSession, reviewBasket);
    expect(won).toBe(true);
  });

  test('should require all bunnies to be rescued', () => {
    // Only some bunnies rescued
    mockSession.bunnyTraps[0].rescued = true;
    mockSession.bunnyTraps[1].rescued = true;
    mockSession.bunnyTraps[2].rescued = false;
    
    const won = gameEngine.checkWinCondition(mockSession, reviewBasket);
    expect(won).toBe(false);
  });
});
