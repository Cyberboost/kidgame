import { GameSession, TileState, DifficultyConfig } from './types';
import { DIFFICULTY_CONFIGS } from './difficultyConfig';
import { ReviewBasket } from './reviewBasket';

export interface ValidationResult {
  valid: boolean;
  message?: string;
  focusReduced?: boolean;
  tileLocked?: boolean;
  turnEnded?: boolean;
}

export class GameEngine {
  validateLetterSelection(
    session: GameSession,
    tile: TileState,
    config: DifficultyConfig
  ): ValidationResult {
    // Cannot select cleared or locked tiles
    if (tile.cleared) {
      return { valid: false, message: 'This tile has already been used!' };
    }
    if (tile.locked) {
      return { valid: false, message: 'This tile is locked for this turn.' };
    }

    // Check if this letter matches the next expected letter in ANY of the target words
    const currentInput = session.currentInput.toUpperCase();
    
    // Support both new multi-word format and legacy single-word format
    const targetWords = session.targetWords 
      ? session.targetWords.map(w => w.toUpperCase())
      : [session.currentWord.toUpperCase()];
    const foundWords = session.foundWords 
      ? session.foundWords.map(w => w.toUpperCase())
      : [];
    
    // Filter out already found words
    const remainingWords = targetWords.filter(w => !foundWords.includes(w));
    
    // Check if the letter is valid for any remaining word
    let isValidForAnyWord = false;
    for (const word of remainingWords) {
      if (currentInput.length < word.length && tile.letter === word[currentInput.length]) {
        isValidForAnyWord = true;
        break;
      }
    }

    if (isValidForAnyWord) {
      // Correct letter
      return { valid: true };
    } else {
      // Incorrect letter - this is a strike
      const result: ValidationResult = {
        valid: false,
        message: `That letter doesn't match any target word. Strike!`,
        focusReduced: true,
      };

      // Check if this causes game over (3 strikes) - only if using new system
      if (typeof session.strikes === 'number') {
        const newStrikes = session.strikes + 1;
        if (newStrikes >= config.maxStrikes) {
          result.turnEnded = true;
          result.message = `3 strikes! Round over. Try again!`;
        }
      } else {
        // Legacy behavior - use garden focus
        const newFocus = session.gardenFocus - 1;
        if (newFocus <= 0) {
          result.turnEnded = true;
        }
      }

      // Guardian tier locks the tile on incorrect letter
      if (config.tier === 'Guardian' && config.consequences.onIncorrectLetter === 'lockTile') {
        result.tileLocked = true;
      }

      return result;
    }
  }

  submitWord(
    session: GameSession,
    config: DifficultyConfig
  ): {
    correct: boolean;
    bunniesRescued: number;
    message: string;
    consequence?: string;
    requireRetry?: boolean;
    wordCompleted?: string;
  } {
    const input = session.currentInput.toUpperCase();
    
    // Support both new multi-word format and legacy single-word format
    const targetWords = session.targetWords 
      ? session.targetWords.map(w => w.toUpperCase())
      : [session.currentWord.toUpperCase()];
    const foundWords = session.foundWords 
      ? session.foundWords.map(w => w.toUpperCase())
      : [];
    
    // Check if input matches any target word that hasn't been found yet
    const matchedWord = targetWords.find(w => w === input && !foundWords.includes(w));
    const correct = !!matchedWord;

    if (correct) {
      // Count bunnies rescued
      let bunniesRescued = 0;
      session.selectedTiles.forEach(pos => {
        const tile = session.board[pos.row][pos.col];
        if (tile.hasBunnyTrap) {
          const trap = session.bunnyTraps.find(
            t => t.row === pos.row && t.col === pos.col && !t.rescued
          );
          if (trap) {
            trap.rescued = true;
            bunniesRescued++;
          }
        }
      });

      // Clear selected tiles
      session.selectedTiles.forEach(pos => {
        session.board[pos.row][pos.col].cleared = true;
      });

      return {
        correct: true,
        bunniesRescued,
        wordCompleted: matchedWord,
        message: bunniesRescued > 0 
          ? `Perfect! You rescued ${bunniesRescued} ${bunniesRescued === 1 ? 'bunny' : 'bunnies'}!`
          : 'Great job spelling that word!',
      };
    } else {
      // Incorrect submit
      let consequence = '';
      let requireRetry = false;

      // Legacy behavior if not using new multi-word system
      if (!session.targetWords) {
        switch (config.consequences.onIncorrectSubmit) {
          case 'addToReview':
            consequence = 'Word added to review basket.';
            break;
          case 'immediateReset':
            consequence = 'Try another word.';
            break;
          case 'requireRetry':
            consequence = 'Try spelling this word again!';
            requireRetry = true;
            break;
          case 'blockProgress':
            consequence = 'You must spell this word correctly to continue.';
            requireRetry = true;
            break;
        }

        return {
          correct: false,
          bunniesRescued: 0,
          message: config.gentleMode 
            ? `Not quite. The word is "${session.currentWord}". Would you like to try again?`
            : `That's not correct. ${consequence}`,
          consequence,
          requireRetry,
        };
      }

      // New multi-word system: incorrect submit is just a failed attempt
      return {
        correct: false,
        bunniesRescued: 0,
        message: `That's not one of the target words. Try again!`,
      };
    }
  }

  /**
   * Check if all words in the current round have been found
   */
  checkRoundComplete(session: GameSession): boolean {
    if (!session.targetWords || session.targetWords.length === 0) return false;
    return session.foundWords.length >= session.targetWords.length;
  }

  checkWinCondition(session: GameSession, reviewBasket: ReviewBasket): boolean {
    // Win condition: all bunnies rescued AND review basket empty
    const allBunniesRescued = session.bunnyTraps.every(trap => trap.rescued);
    const reviewBasketEmpty = reviewBasket.isEmpty();
    return allBunniesRescued && reviewBasketEmpty;
  }

  applyFocusZeroConsequence(
    session: GameSession,
    config: DifficultyConfig
  ): void {
    switch (config.consequences.onFocusZero) {
      case 'endTurnResetStreak':
        session.streak = 0;
        break;
      case 'endTurnDisableHint':
        session.hintsDisabled = true;
        break;
      case 'endTurnLoseMultiplier':
        // In a future version with scoring multipliers, this would reset them
        session.streak = Math.floor(session.streak / 2);
        break;
      case 'endTurn':
      default:
        // Just end the turn, no additional penalty
        break;
    }
  }

  resetTurn(session: GameSession): void {
    session.currentInput = '';
    session.selectedTiles = [];
    session.gardenFocus = session.gardenFocusMax;
    session.turnStartTime = Date.now();
    
    // Unlock all locked tiles
    session.board.forEach(row => {
      row.forEach(tile => {
        tile.locked = false;
        tile.selected = false;
      });
    });
  }

  nextTurn(session: GameSession): void {
    this.resetTurn(session);
    
    // Move to next player in co-op mode
    if (session.mode === 'coop') {
      session.currentPlayerIndex = (session.currentPlayerIndex + 1) % session.profileIds.length;
    }
  }
}

export const gameEngine = new GameEngine();
