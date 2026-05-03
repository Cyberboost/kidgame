import { MomentumState } from '../types';

/**
 * Momentum/Streak System for motivational feedback
 * Tracks consecutive correct actions and provides multipliers
 */
export class MomentumTracker {
  private state: MomentumState;

  constructor() {
    this.state = {
      level: 'none',
      multiplier: 1.0,
      consecutiveCorrect: 0,
      streakBonus: 0,
    };
  }

  /**
   * Add a correct action to the streak
   */
  addCorrectAction(actionType: 'letter' | 'word' = 'letter'): void {
    this.state.consecutiveCorrect++;

    // Award streak bonuses for words (more significant)
    if (actionType === 'word') {
      this.state.streakBonus += 10;
    } else {
      this.state.streakBonus += 2;
    }

    this.updateLevel();
  }

  /**
   * Break the streak (on error)
   */
  breakStreak(): void {
    this.state.consecutiveCorrect = 0;
    this.state.streakBonus = 0;
    this.state.level = 'none';
    this.state.multiplier = 1.0;
  }

  /**
   * Update momentum level based on streak
   */
  private updateLevel(): void {
    const streak = this.state.consecutiveCorrect;

    if (streak >= 10) {
      this.state.level = 'unstoppable';
      this.state.multiplier = 3.0;
    } else if (streak >= 5) {
      this.state.level = 'on-fire';
      this.state.multiplier = 2.0;
    } else if (streak >= 3) {
      this.state.level = 'warming-up';
      this.state.multiplier = 1.5;
    } else {
      this.state.level = 'none';
      this.state.multiplier = 1.0;
    }
  }

  /**
   * Get current multiplier (for focus refill, points, etc.)
   */
  getMultiplier(): number {
    return this.state.multiplier;
  }

  /**
   * Get current streak level
   */
  getLevel(): MomentumState['level'] {
    return this.state.level;
  }

  /**
   * Get consecutive correct count
   */
  getStreak(): number {
    return this.state.consecutiveCorrect;
  }

  /**
   * Get accumulated streak bonus
   */
  getStreakBonus(): number {
    return this.state.streakBonus;
  }

  /**
   * Get current state
   */
  getState(): MomentumState {
    return { ...this.state };
  }

  /**
   * Set state (for deserialization)
   */
  setState(state: MomentumState): void {
    this.state = { ...state };
  }

  /**
   * Get encouragement message based on level
   */
  getEncouragementMessage(): string {
    switch (this.state.level) {
      case 'unstoppable':
        return "🔥 UNSTOPPABLE! You're a spelling champion!";
      case 'on-fire':
        return "⚡ ON FIRE! Keep that streak going!";
      case 'warming-up':
        return "✨ Nice! You're warming up!";
      default:
        return '';
    }
  }
}
