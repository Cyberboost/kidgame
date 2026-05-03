import { PatternColor } from '../types';

/**
 * Pattern Input Controller
 * Captures and validates user input against the pattern sequence
 */
export class PatternInputController {
  private expectedSequence: PatternColor[] = [];
  private userInput: PatternColor[] = [];
  private isAcceptingInput: boolean = false;
  private onCorrectInput?: (color: PatternColor, index: number) => void;
  private onIncorrectInput?: (expected: PatternColor, actual: PatternColor) => void;
  private onSequenceComplete?: (success: boolean) => void;

  /**
   * Start accepting user input
   */
  startInput(
    expectedSequence: PatternColor[],
    callbacks: {
      onCorrectInput?: (color: PatternColor, index: number) => void;
      onIncorrectInput?: (expected: PatternColor, actual: PatternColor) => void;
      onSequenceComplete?: (success: boolean) => void;
    }
  ): void {
    this.expectedSequence = expectedSequence;
    this.userInput = [];
    this.isAcceptingInput = true;
    this.onCorrectInput = callbacks.onCorrectInput;
    this.onIncorrectInput = callbacks.onIncorrectInput;
    this.onSequenceComplete = callbacks.onSequenceComplete;
  }

  /**
   * Handle user color input
   */
  handleInput(color: PatternColor): boolean {
    if (!this.isAcceptingInput) {
      return false;
    }

    const currentIndex = this.userInput.length;
    const expectedColor = this.expectedSequence[currentIndex];

    // Add to user input
    this.userInput.push(color);

    // Check if correct
    if (color === expectedColor) {
      // Correct input
      if (this.onCorrectInput) {
        this.onCorrectInput(color, currentIndex);
      }

      // Check if sequence is complete
      if (this.userInput.length === this.expectedSequence.length) {
        this.isAcceptingInput = false;
        if (this.onSequenceComplete) {
          this.onSequenceComplete(true);
        }
        return true;
      }

      return true;
    } else {
      // Incorrect input
      this.isAcceptingInput = false;
      if (this.onIncorrectInput) {
        this.onIncorrectInput(expectedColor, color);
      }
      if (this.onSequenceComplete) {
        this.onSequenceComplete(false);
      }
      return false;
    }
  }

  /**
   * Get current user input
   */
  getUserInput(): PatternColor[] {
    return [...this.userInput];
  }

  /**
   * Get expected sequence
   */
  getExpectedSequence(): PatternColor[] {
    return [...this.expectedSequence];
  }

  /**
   * Get progress (percentage of sequence completed)
   */
  getProgress(): number {
    if (this.expectedSequence.length === 0) {
      return 0;
    }
    return (this.userInput.length / this.expectedSequence.length) * 100;
  }

  /**
   * Check if accepting input
   */
  getIsAcceptingInput(): boolean {
    return this.isAcceptingInput;
  }

  /**
   * Stop accepting input
   */
  stopInput(): void {
    this.isAcceptingInput = false;
  }

  /**
   * Reset controller
   */
  reset(): void {
    this.expectedSequence = [];
    this.userInput = [];
    this.isAcceptingInput = false;
  }

  /**
   * Get next expected color (for hints)
   */
  getNextExpectedColor(): PatternColor | null {
    if (this.userInput.length >= this.expectedSequence.length) {
      return null;
    }
    return this.expectedSequence[this.userInput.length];
  }

  /**
   * Get remaining sequence (for hints)
   */
  getRemainingSequence(): PatternColor[] {
    return this.expectedSequence.slice(this.userInput.length);
  }

  /**
   * Validate complete sequence (for retry scenarios)
   */
  validateSequence(userSequence: PatternColor[]): boolean {
    if (userSequence.length !== this.expectedSequence.length) {
      return false;
    }

    return userSequence.every((color, index) => color === this.expectedSequence[index]);
  }
}
