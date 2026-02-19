import { generateBoard, SeededRandom, countRemainingBunnies } from '@/core/boardGenerator';

describe('Board Generation', () => {
  test('should generate board of correct size', () => {
    const gridSize = 5;
    const { board, bunnyTraps } = generateBoard(gridSize);
    
    expect(board).toHaveLength(gridSize);
    expect(board[0]).toHaveLength(gridSize);
  });

  test('should generate board with letters', () => {
    const { board } = generateBoard(5);
    
    board.forEach(row => {
      row.forEach(tile => {
        expect(tile.letter).toMatch(/^[A-Z]$/);
        expect(tile.cleared).toBe(false);
        expect(tile.locked).toBe(false);
        expect(tile.selected).toBe(false);
      });
    });
  });

  test('should place bunny traps', () => {
    const gridSize = 5;
    const { board, bunnyTraps } = generateBoard(gridSize);
    
    expect(bunnyTraps.length).toBeGreaterThan(0);
    expect(bunnyTraps.length).toBeLessThanOrEqual(gridSize * gridSize);
    
    bunnyTraps.forEach(trap => {
      expect(trap.row).toBeGreaterThanOrEqual(0);
      expect(trap.row).toBeLessThan(gridSize);
      expect(trap.col).toBeGreaterThanOrEqual(0);
      expect(trap.col).toBeLessThan(gridSize);
      expect(trap.rescued).toBe(false);
      expect(board[trap.row][trap.col].hasBunnyTrap).toBe(true);
    });
  });

  test('should have sufficient vowels', () => {
    const { board } = generateBoard(6);
    const vowels = ['A', 'E', 'I', 'O', 'U'];
    
    let vowelCount = 0;
    let totalTiles = 0;
    
    board.forEach(row => {
      row.forEach(tile => {
        totalTiles++;
        if (vowels.includes(tile.letter)) {
          vowelCount++;
        }
      });
    });
    
    const vowelPercentage = (vowelCount / totalTiles) * 100;
    expect(vowelPercentage).toBeGreaterThanOrEqual(25); // At least 25% vowels
  });

  test('should generate different boards', () => {
    const { board: board1 } = generateBoard(5);
    const { board: board2 } = generateBoard(5);
    
    let different = false;
    for (let i = 0; i < 5 && !different; i++) {
      for (let j = 0; j < 5 && !different; j++) {
        if (board1[i][j].letter !== board2[i][j].letter) {
          different = true;
        }
      }
    }
    
    expect(different).toBe(true);
  });

  test('should generate same board with same seed', () => {
    const seed = 12345;
    const { board: board1 } = generateBoard(5, seed);
    const { board: board2 } = generateBoard(5, seed);
    
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        expect(board1[i][j].letter).toBe(board2[i][j].letter);
        expect(board1[i][j].hasBunnyTrap).toBe(board2[i][j].hasBunnyTrap);
      }
    }
  });
});

describe('SeededRandom', () => {
  test('should generate consistent random numbers with seed', () => {
    const random1 = new SeededRandom(42);
    const random2 = new SeededRandom(42);
    
    expect(random1.next()).toBe(random2.next());
    expect(random1.next()).toBe(random2.next());
    expect(random1.next()).toBe(random2.next());
  });

  test('should generate different sequences with different seeds', () => {
    const random1 = new SeededRandom(42);
    const random2 = new SeededRandom(43);
    
    expect(random1.next()).not.toBe(random2.next());
  });

  test('should generate numbers between 0 and 1', () => {
    const random = new SeededRandom(123);
    
    for (let i = 0; i < 100; i++) {
      const num = random.next();
      expect(num).toBeGreaterThanOrEqual(0);
      expect(num).toBeLessThan(1);
    }
  });

  test('should generate integers in range', () => {
    const random = new SeededRandom(456);
    
    for (let i = 0; i < 100; i++) {
      const num = random.nextInt(10);
      expect(num).toBeGreaterThanOrEqual(0);
      expect(num).toBeLessThan(10);
      expect(Number.isInteger(num)).toBe(true);
    }
  });

  test('should shuffle array consistently', () => {
    const array = [1, 2, 3, 4, 5];
    const random1 = new SeededRandom(789);
    const random2 = new SeededRandom(789);
    
    const shuffled1 = random1.shuffle(array);
    const shuffled2 = random2.shuffle(array);
    
    expect(shuffled1).toEqual(shuffled2);
  });
});

describe('countRemainingBunnies', () => {
  test('should count unrescued bunnies', () => {
    const bunnyTraps = [
      { row: 0, col: 0, rescued: false },
      { row: 0, col: 1, rescued: true },
      { row: 0, col: 2, rescued: false },
    ];
    
    expect(countRemainingBunnies(bunnyTraps)).toBe(2);
  });

  test('should return 0 when all rescued', () => {
    const bunnyTraps = [
      { row: 0, col: 0, rescued: true },
      { row: 0, col: 1, rescued: true },
    ];
    
    expect(countRemainingBunnies(bunnyTraps)).toBe(0);
  });

  test('should handle empty array', () => {
    expect(countRemainingBunnies([])).toBe(0);
  });
});
