import { PatternColor, PatternSequence, AgeRange, SensoryProfile } from '../types';

/**
 * Pattern Sequence Generator for Simon-style memory game
 * Generates random color sequences with adaptive difficulty
 */
export class PatternSequenceGenerator {
  private availableColors: PatternColor[];
  private ageRange: AgeRange;
  private sensoryProfile: SensoryProfile;

  constructor(ageRange: AgeRange = '7-8', sensoryProfile: SensoryProfile = 'adventure') {
    this.ageRange = ageRange;
    this.sensoryProfile = sensoryProfile;
    this.availableColors = this.getColorsForProfile(sensoryProfile);
  }

  /**
   * Get appropriate colors based on sensory profile
   */
  private getColorsForProfile(profile: SensoryProfile): PatternColor[] {
    switch (profile) {
      case 'calm':
        // Softer, fewer colors for calm mode
        return ['blue', 'green', 'purple', 'yellow'];
      case 'minimal':
        // High contrast, minimal set
        return ['red', 'blue', 'green', 'yellow'];
      case 'adventure':
      default:
        // Full spectrum for adventure mode
        return ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
    }
  }

  /**
   * Generate initial sequence for a new game
   */
  generateInitialSequence(round: number = 1): PatternSequence {
    const length = this.getSequenceLengthForRound(round);
    const colors: PatternColor[] = [];

    for (let i = 0; i < length; i++) {
      colors.push(this.getRandomColor());
    }

    return {
      colors,
      round,
      difficulty: this.getDifficultyForRound(round),
    };
  }

  /**
   * Extend sequence by one color for next round
   */
  extendSequence(currentSequence: PatternColor[], round: number): PatternSequence {
    const newColor = this.getRandomColor();
    const colors = [...currentSequence, newColor];

    return {
      colors,
      round,
      difficulty: this.getDifficultyForRound(round),
    };
  }

  /**
   * Get sequence length based on round and age range
   */
  private getSequenceLengthForRound(round: number): number {
    const baseLength = this.getBaseLengthForAge();
    return baseLength + Math.floor((round - 1) / 2); // Grow every 2 rounds
  }

  /**
   * Get base sequence length for age range
   */
  private getBaseLengthForAge(): number {
    switch (this.ageRange) {
      case '4-6':
        return 2; // Start with 2 colors
      case '7-8':
        return 3; // Start with 3 colors
      case '9-10':
        return 4; // Start with 4 colors
      default:
        return 3;
    }
  }

  /**
   * Get random color from available set
   */
  private getRandomColor(): PatternColor {
    const index = Math.floor(Math.random() * this.availableColors.length);
    return this.availableColors[index];
  }

  /**
   * Get difficulty level for round
   */
  private getDifficultyForRound(round: number): number {
    // Difficulty increases every 3 rounds
    return Math.min(10, Math.floor((round - 1) / 3) + 1);
  }

  /**
   * Get max sequence length based on age
   */
  getMaxSequenceLength(): number {
    switch (this.ageRange) {
      case '4-6':
        return 6; // Max 6 colors for young kids
      case '7-8':
        return 10; // Max 10 colors
      case '9-10':
        return 15; // Max 15 colors for older kids
      default:
        return 10;
    }
  }

  /**
   * Update age range
   */
  setAgeRange(ageRange: AgeRange): void {
    this.ageRange = ageRange;
  }

  /**
   * Update sensory profile
   */
  setSensoryProfile(profile: SensoryProfile): void {
    this.sensoryProfile = profile;
    this.availableColors = this.getColorsForProfile(profile);
  }

  /**
   * Get available colors
   */
  getAvailableColors(): PatternColor[] {
    return [...this.availableColors];
  }
}
