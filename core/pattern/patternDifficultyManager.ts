import { AgeRange } from '../types';

/**
 * Pattern Difficulty Manager
 * Adjusts speed, sequence length, and hint frequency based on age and performance
 */
export class PatternDifficultyManager {
  private ageRange: AgeRange;
  private baseSpeed: number; // milliseconds between colors
  private speedMultiplier: number;
  private hintAvailability: number; // hints per game

  constructor(ageRange: AgeRange = '7-8') {
    this.ageRange = ageRange;
    this.baseSpeed = this.getBaseSpeedForAge();
    this.speedMultiplier = 1.0;
    this.hintAvailability = this.getHintsForAge();
  }

  /**
   * Get playback speed for current round
   */
  getPlaybackSpeed(round: number, difficulty: number): number {
    const roundSpeedMultiplier = this.getRoundSpeedMultiplier(round);
    return Math.max(300, this.baseSpeed * roundSpeedMultiplier);
  }

  /**
   * Get base speed based on age range
   */
  private getBaseSpeedForAge(): number {
    switch (this.ageRange) {
      case '4-6':
        return 1200; // Very slow for young kids (1.2 seconds per color)
      case '7-8':
        return 900; // Moderate speed (0.9 seconds)
      case '9-10':
        return 600; // Faster for older kids (0.6 seconds)
      default:
        return 900;
    }
  }

  /**
   * Get speed multiplier based on round (gets faster as you progress)
   */
  private getRoundSpeedMultiplier(round: number): number {
    // Speed increases gradually, but not below 50% of base
    const speedIncrease = Math.min(0.5, (round - 1) * 0.05);
    return Math.max(0.5, 1.0 - speedIncrease);
  }

  /**
   * Get number of hints available based on age
   */
  private getHintsForAge(): number {
    switch (this.ageRange) {
      case '4-6':
        return 999; // Unlimited hints for young kids
      case '7-8':
        return 5; // 5 hints per game
      case '9-10':
        return 3; // 3 hints per game
      default:
        return 5;
    }
  }

  /**
   * Check if hints are available
   */
  hasHintsAvailable(hintsUsed: number): boolean {
    return hintsUsed < this.hintAvailability;
  }

  /**
   * Get remaining hints
   */
  getRemainingHints(hintsUsed: number): number {
    return Math.max(0, this.hintAvailability - hintsUsed);
  }

  /**
   * Adjust difficulty based on performance
   */
  adjustDifficultyBasedOnPerformance(
    successRate: number,
    averageRound: number
  ): void {
    if (successRate > 0.9 && averageRound > 5) {
      // Player is doing very well, increase challenge
      this.speedMultiplier = Math.min(1.3, this.speedMultiplier + 0.1);
    } else if (successRate < 0.5 && averageRound > 3) {
      // Player is struggling, ease up
      this.speedMultiplier = Math.max(0.7, this.speedMultiplier - 0.1);
    }
  }

  /**
   * Get tile count based on age and sensory profile
   */
  getTileCount(): number {
    switch (this.ageRange) {
      case '4-6':
        return 4; // 4 tiles for young kids
      case '7-8':
        return 4; // 4 tiles standard
      case '9-10':
        return 6; // 6 tiles for challenge
      default:
        return 4;
    }
  }

  /**
   * Get pause duration between playback and user input
   */
  getPauseDuration(): number {
    switch (this.ageRange) {
      case '4-6':
        return 1500; // Longer pause for young kids
      case '7-8':
        return 1000; // Standard pause
      case '9-10':
        return 800; // Shorter pause
      default:
        return 1000;
    }
  }

  /**
   * Update age range
   */
  setAgeRange(ageRange: AgeRange): void {
    this.ageRange = ageRange;
    this.baseSpeed = this.getBaseSpeedForAge();
    this.hintAvailability = this.getHintsForAge();
  }

  /**
   * Get current speed with all multipliers
   */
  getCurrentSpeed(round: number, difficulty: number): number {
    return this.getPlaybackSpeed(round, difficulty) * this.speedMultiplier;
  }

  /**
   * Should show encouragement based on round
   */
  shouldShowEncouragement(round: number): boolean {
    // Show encouragement every 3 rounds
    return round % 3 === 0;
  }
}
