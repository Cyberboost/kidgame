import { TileState, BunnyTrap } from './types';

// Weighted letter frequencies for English (optimized for sight words)
const LETTER_FREQUENCIES: Record<string, number> = {
  A: 8.2, B: 1.5, C: 2.8, D: 4.3, E: 12.7, F: 2.2, G: 2.0, H: 6.1, I: 7.0,
  J: 0.15, K: 0.77, L: 4.0, M: 2.4, N: 6.7, O: 7.5, P: 1.9, Q: 0.1, R: 6.0,
  S: 6.3, T: 9.1, U: 2.8, V: 0.98, W: 2.4, X: 0.15, Y: 2.0, Z: 0.07,
};

// Enhanced vowel distribution for better word-building
const VOWELS = ['A', 'E', 'I', 'O', 'U'];

export class SeededRandom {
  private seed: number;

  constructor(seed?: number) {
    this.seed = seed ?? Math.floor(Math.random() * 1000000);
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  nextInt(max: number): number {
    return Math.floor(this.next() * max);
  }

  shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.nextInt(i + 1);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}

export function generateBoard(
  gridSize: number,
  seed?: number
): { board: TileState[][]; bunnyTraps: BunnyTrap[] } {
  const random = new SeededRandom(seed);
  const totalTiles = gridSize * gridSize;

  // Create weighted letter pool
  const letterPool: string[] = [];
  for (const [letter, frequency] of Object.entries(LETTER_FREQUENCIES)) {
    const count = Math.max(1, Math.round((frequency / 100) * totalTiles * 1.2));
    for (let i = 0; i < count; i++) {
      letterPool.push(letter);
    }
  }

  // Ensure sufficient vowels (at least 30% of the board)
  const minVowels = Math.floor(totalTiles * 0.3);
  let vowelCount = letterPool.filter(l => VOWELS.includes(l)).length;
  while (vowelCount < minVowels) {
    const vowel = VOWELS[random.nextInt(VOWELS.length)];
    letterPool.push(vowel);
    vowelCount++;
  }

  // Shuffle and pick letters
  const shuffledPool = random.shuffle(letterPool);
  const selectedLetters = shuffledPool.slice(0, totalTiles);

  // Create board
  const board: TileState[][] = [];
  let letterIndex = 0;
  for (let row = 0; row < gridSize; row++) {
    const rowTiles: TileState[] = [];
    for (let col = 0; col < gridSize; col++) {
      rowTiles.push({
        letter: selectedLetters[letterIndex++],
        row,
        col,
        hasBunnyTrap: false,
        cleared: false,
        locked: false,
        selected: false,
      });
    }
    board.push(rowTiles);
  }

  // Place bunny traps randomly
  const trapCount = Math.floor(totalTiles * 0.25);
  const bunnyTraps: BunnyTrap[] = [];
  const trapPositions = new Set<string>();

  while (trapPositions.size < trapCount) {
    const row = random.nextInt(gridSize);
    const col = random.nextInt(gridSize);
    const key = `${row},${col}`;
    if (!trapPositions.has(key)) {
      trapPositions.add(key);
      board[row][col].hasBunnyTrap = true;
      bunnyTraps.push({ row, col, rescued: false });
    }
  }

  return { board, bunnyTraps };
}

export function countRemainingBunnies(bunnyTraps: BunnyTrap[]): number {
  return bunnyTraps.filter(trap => !trap.rescued).length;
}

export function getTile(
  board: TileState[][],
  row: number,
  col: number
): TileState | null {
  if (row < 0 || row >= board.length || col < 0 || col >= board[0].length) {
    return null;
  }
  return board[row][col];
}

/**
 * Shuffles the letters on the board while preserving tile states (cleared, locked, selected, bunnyTraps)
 */
export function shuffleBoard(board: TileState[][]): TileState[][] {
  // Extract all letters and their current positions
  const letters: string[] = [];
  const availablePositions: { row: number; col: number }[] = [];
  
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const tile = board[row][col];
      // Only shuffle non-cleared tiles
      if (!tile.cleared) {
        letters.push(tile.letter);
        availablePositions.push({ row, col });
      }
    }
  }
  
  // Shuffle letters using Fisher-Yates
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  
  // Create new board with shuffled letters
  const newBoard = board.map(row => row.map(tile => ({ ...tile })));
  
  // Assign shuffled letters back to available positions
  let letterIndex = 0;
  for (const pos of availablePositions) {
    newBoard[pos.row][pos.col].letter = letters[letterIndex++];
    // Clear the selected state on shuffle but preserve other states
    newBoard[pos.row][pos.col].selected = false;
  }
  
  return newBoard;
}
