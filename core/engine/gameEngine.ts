import { GameSession, TileState, DifficultyConfig } from '../types';
import { DIFFICULTY_CONFIGS } from '../difficultyConfig';
import { ReviewBasket } from '../reviewBasket';
import { FocusMeter } from './focusMeter';
import { MomentumTracker } from './momentumSystem';

export interface ValidationResult {
  valid: boolean;
  message?: string;
  focusReduced?: boolean;
  tileLocked?: boolean;
  turnEnded?: boolean;
}

export class GameEngine {
  private focusMeter?: FocusMeter;
  private momentumTracker?: MomentumTracker;

  /**
   * Set focus meter instance (for Focus/Adventure modes)
   */
  setFocusMeter(focusMeter: FocusMeter | undefined): void {
    this.focusMeter = focusMeter;
  }

  /**
   * Set momentum tracker instance (for Focus/Adventure modes)
   */
  setMomentumTracker(momentumTracker: MomentumTracker | undefined): void {
    this.momentumTracker = momentumTracker;
  }

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

    // Check if this letter matches the next expected letter in the target word
    const targetWord = session.currentWord.toUpperCase();
    const currentInput = session.currentInput.toUpperCase();
    const expectedLetter = targetWord[currentInput.length];

    if (tile.letter === expectedLetter) {
      // Correct letter - reward momentum and focus meter
      if (this.momentumTracker) {
        this.momentumTracker.addCorrectAction('letter');
      }

      if (this.focusMeter) {
        const multiplier = this.momentumTracker?.getMultiplier() || 1.0;
        this.focusMeter.refill(5 * multiplier); // Refill with momentum bonus
      }

      return { valid: true };
    } else {
      // Incorrect letter - handle based on mode
      let newFocus = session.gardenFocus - 1;

      // For Focus/Adventure modes, also drain focus meter and break momentum
      if (this.focusMeter) {
        this.focusMeter.drain(10);
        newFocus = this.focusMeter.isEmpty() ? 0 : session.gardenFocus;
      }

      if (this.momentumTracker) {
        this.momentumTracker.breakStreak();
      }

      const result: ValidationResult = {
        valid: false,
        message: `That's not the next letter. Try again!`,
        focusReduced: true,
      };

      // Check if focus reached zero
      if (newFocus <= 0 || this.focusMeter?.isEmpty()) {
        result.turnEnded = true;
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
  } {
    const input = session.currentInput.toUpperCase();
    const target = session.currentWord.toUpperCase();
    const correct = input === target;

    if (correct) {
      // Add to momentum tracker
      if (this.momentumTracker) {
        this.momentumTracker.addCorrectAction('word');
      }

      // Reward focus meter for correct word
      if (this.focusMeter) {
        const multiplier = this.momentumTracker?.getMultiplier() || 1.0;
        this.focusMeter.refill(25 * multiplier); // Big refill with momentum bonus
      }

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

      // Get momentum message if available
      let message = bunniesRescued > 0
        ? `Perfect! You rescued ${bunniesRescued} ${bunniesRescued === 1 ? 'bunny' : 'bunnies'}!`
        : 'Great job spelling that word!';

      if (this.momentumTracker) {
        const encouragement = this.momentumTracker.getEncouragementMessage();
        if (encouragement) {
          message += ` ${encouragement}`;
        }
      }

      return {
        correct: true,
        bunniesRescued,
        message,
      };
    } else {
      // Incorrect submit - break momentum
      if (this.momentumTracker) {
        this.momentumTracker.breakStreak();
      }

      // Incorrect submit
      let consequence = '';
      let requireRetry = false;

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

    // Reset focus meter if in Focus/Adventure mode
    if (this.focusMeter && session.focusMeter) {
      this.focusMeter.refill(session.focusMeter.max);
      this.focusMeter.resume();
    }

    // Unlock all locked tiles
    session.board.forEach(row => {
      row.forEach(tile => {
        tile.locked = false;
        tile.selected = false;
      });
    });
  }

  /**
   * Update focus meter (call this in game loop)
   */
  updateFocusMeter(session: GameSession): void {
    if (this.focusMeter && session.focusMeter) {
      this.focusMeter.update();
      session.focusMeter = this.focusMeter.getState();
    }
  }

  /**
   * Sync momentum state to session
   */
  syncMomentumState(session: GameSession): void {
    if (this.momentumTracker && session.momentum) {
      session.momentum = this.momentumTracker.getState();
    }
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
