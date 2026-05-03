import { PatternColor, SensoryProfile } from '../types';

/**
 * Pattern Playback Controller
 * Handles sequence playback with timing and animations
 */
export class PatternPlaybackController {
  private isPlaying: boolean = false;
  private currentColorIndex: number = 0;
  private playbackSpeed: number = 900;
  private sensoryProfile: SensoryProfile = 'adventure';
  private onColorActivate?: (color: PatternColor, index: number) => void;
  private onColorDeactivate?: (color: PatternColor, index: number) => void;
  private onPlaybackComplete?: () => void;
  private playbackTimeoutId?: NodeJS.Timeout;

  /**
   * Start playback of a sequence
   */
  async playSequence(
    sequence: PatternColor[],
    speed: number,
    callbacks: {
      onColorActivate?: (color: PatternColor, index: number) => void;
      onColorDeactivate?: (color: PatternColor, index: number) => void;
      onPlaybackComplete?: () => void;
    }
  ): Promise<void> {
    if (this.isPlaying) {
      this.stop();
    }

    this.isPlaying = true;
    this.currentColorIndex = 0;
    this.playbackSpeed = speed;
    this.onColorActivate = callbacks.onColorActivate;
    this.onColorDeactivate = callbacks.onColorDeactivate;
    this.onPlaybackComplete = callbacks.onPlaybackComplete;

    return this.playNextColor(sequence);
  }

  /**
   * Play next color in sequence
   */
  private async playNextColor(sequence: PatternColor[]): Promise<void> {
    if (!this.isPlaying || this.currentColorIndex >= sequence.length) {
      this.isPlaying = false;
      if (this.onPlaybackComplete) {
        this.onPlaybackComplete();
      }
      return;
    }

    const color = sequence[this.currentColorIndex];
    const index = this.currentColorIndex;

    // Activate color
    if (this.onColorActivate) {
      this.onColorActivate(color, index);
    }

    // Determine how long to show the color (active duration)
    const activeDuration = this.getActiveDuration();

    // Wait for active duration
    await this.wait(activeDuration);

    // Deactivate color
    if (this.onColorDeactivate && this.isPlaying) {
      this.onColorDeactivate(color, index);
    }

    // Wait for gap between colors
    const gapDuration = this.getGapDuration();
    await this.wait(gapDuration);

    // Move to next color
    this.currentColorIndex++;

    if (this.isPlaying) {
      return this.playNextColor(sequence);
    }
  }

  /**
   * Get active duration based on speed
   */
  private getActiveDuration(): number {
    // Active for 60% of playback speed
    return Math.floor(this.playbackSpeed * 0.6);
  }

  /**
   * Get gap duration between colors
   */
  private getGapDuration(): number {
    // Gap is 40% of playback speed
    return Math.floor(this.playbackSpeed * 0.4);
  }

  /**
   * Wait for specified duration
   */
  private wait(ms: number): Promise<void> {
    return new Promise(resolve => {
      this.playbackTimeoutId = setTimeout(resolve, ms);
    });
  }

  /**
   * Stop playback
   */
  stop(): void {
    this.isPlaying = false;
    this.currentColorIndex = 0;
    if (this.playbackTimeoutId) {
      clearTimeout(this.playbackTimeoutId);
    }
  }

  /**
   * Check if currently playing
   */
  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Set sensory profile
   */
  setSensoryProfile(profile: SensoryProfile): void {
    this.sensoryProfile = profile;
  }

  /**
   * Get animation class based on sensory profile
   */
  getAnimationClass(): string {
    switch (this.sensoryProfile) {
      case 'calm':
        return 'animate-pulse-slow';
      case 'minimal':
        return ''; // No animation
      case 'adventure':
      default:
        return 'animate-pulse';
    }
  }

  /**
   * Get sound effect name for color
   */
  getSoundForColor(color: PatternColor): string {
    // Map colors to musical notes
    const soundMap: Record<PatternColor, string> = {
      red: 'C4',
      blue: 'E4',
      green: 'G4',
      yellow: 'C5',
      purple: 'E5',
      orange: 'G5',
    };
    return soundMap[color];
  }
}
