import { FocusMeterState } from '../types';

/**
 * Focus Meter System for ADHD-optimized gameplay
 * Provides gradual depletion mechanic with refill rewards
 */
export class FocusMeter {
  private state: FocusMeterState;

  constructor(maxFocus: number = 100, drainRate: number = 1) {
    this.state = {
      current: maxFocus,
      max: maxFocus,
      drainRate,
      lastUpdate: Date.now(),
      isPaused: true, // Start paused until game begins
    };
  }

  /**
   * Initialize or reset the focus meter
   */
  initialize(maxFocus: number, drainRate: number): void {
    this.state = {
      current: maxFocus,
      max: maxFocus,
      drainRate,
      lastUpdate: Date.now(),
      isPaused: false,
    };
  }

  /**
   * Update focus meter based on elapsed time
   * Call this frequently (e.g., in game loop)
   */
  update(): void {
    if (this.state.isPaused) {
      this.state.lastUpdate = Date.now();
      return;
    }

    const now = Date.now();
    const deltaSeconds = (now - this.state.lastUpdate) / 1000;
    this.state.lastUpdate = now;

    // Drain focus gradually
    const drainAmount = this.state.drainRate * deltaSeconds;
    this.state.current = Math.max(0, this.state.current - drainAmount);
  }

  /**
   * Manually drain focus (e.g., for incorrect actions)
   */
  drain(amount: number): void {
    this.state.current = Math.max(0, this.state.current - amount);
    this.state.lastUpdate = Date.now();
  }

  /**
   * Refill focus (reward for correct actions)
   */
  refill(amount: number): void {
    this.state.current = Math.min(this.state.max, this.state.current + amount);
    this.state.lastUpdate = Date.now();
  }

  /**
   * Pause focus meter (stops drain)
   */
  pause(): void {
    this.state.isPaused = true;
    this.state.lastUpdate = Date.now();
  }

  /**
   * Resume focus meter (starts drain)
   */
  resume(): void {
    this.state.isPaused = false;
    this.state.lastUpdate = Date.now();
  }

  /**
   * Check if focus meter is empty
   */
  isEmpty(): boolean {
    return this.state.current <= 0;
  }

  /**
   * Get current focus percentage (0-100)
   */
  getPercentage(): number {
    return (this.state.current / this.state.max) * 100;
  }

  /**
   * Get current state (for serialization/display)
   */
  getState(): FocusMeterState {
    return { ...this.state };
  }

  /**
   * Set state (for deserialization)
   */
  setState(state: FocusMeterState): void {
    this.state = { ...state };
  }

  /**
   * Get current focus value
   */
  getCurrent(): number {
    return this.state.current;
  }

  /**
   * Get max focus value
   */
  getMax(): number {
    return this.state.max;
  }
}
