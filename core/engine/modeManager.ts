import { GameMode, GameSession, DifficultyConfig, AgeRange } from '../types';
import { FocusMeter } from './focusMeter';
import { MomentumTracker } from './momentumSystem';
import { MicroMissionGenerator } from './microMissionGenerator';
import { getAgeAdaptiveSettings } from '../data/ageAdaptiveConfig';

/**
 * Mode Manager - Handles game mode initialization and switching
 * Supports Classic, Focus, and Adventure modes
 */
export class ModeManager {
  private currentMode: GameMode = 'classic';
  private focusMeter?: FocusMeter;
  private momentumTracker?: MomentumTracker;
  private missionGenerator?: MicroMissionGenerator;

  /**
   * Initialize a game mode
   */
  initializeMode(
    mode: GameMode,
    session: GameSession,
    config: DifficultyConfig,
    ageRange?: AgeRange
  ): void {
    this.currentMode = mode;
    session.gameMode = mode;
    session.ageRange = ageRange;

    switch (mode) {
      case 'classic':
        this.initializeClassicMode(session);
        break;
      case 'focus':
        this.initializeFocusMode(session, ageRange);
        break;
      case 'adventure':
        this.initializeAdventureMode(session, ageRange);
        break;
    }
  }

  /**
   * Initialize Classic Mode (existing gameplay)
   */
  private initializeClassicMode(session: GameSession): void {
    // Classic mode uses existing Garden Focus mechanic
    // No additional initialization needed
    session.focusMeter = undefined;
    session.momentum = undefined;
    session.microMission = undefined;
  }

  /**
   * Initialize Focus Mode (ADHD-optimized)
   */
  private initializeFocusMode(session: GameSession, ageRange?: AgeRange): void {
    const settings = ageRange ? getAgeAdaptiveSettings(ageRange) : undefined;

    // Initialize focus meter
    this.focusMeter = new FocusMeter(
      settings?.focusMeterMax || 100,
      settings?.focusMeterDrainRate || 1.0
    );
    session.focusMeter = this.focusMeter.getState();

    // Initialize momentum tracker
    this.momentumTracker = new MomentumTracker();
    session.momentum = this.momentumTracker.getState();

    // Initialize mission generator
    this.missionGenerator = new MicroMissionGenerator();

    // Generate first mission
    if (session.activeWords.length > 0) {
      const mission = this.missionGenerator.generate(
        session.activeWords,
        ageRange,
        session.difficulty
      );
      session.microMission = mission;
    }
  }

  /**
   * Initialize Adventure Mode (progression-based)
   */
  private initializeAdventureMode(session: GameSession, ageRange?: AgeRange): void {
    // Adventure mode includes focus meter and momentum
    this.initializeFocusMode(session, ageRange);

    // Additional adventure-specific initialization
    // (e.g., progression map, character state, etc.)
    // To be expanded in future phases
  }

  /**
   * Switch to a different mode
   */
  switchMode(newMode: GameMode, session: GameSession, ageRange?: AgeRange): void {
    if (this.currentMode === newMode) {
      return; // Already in this mode
    }

    // Save current state before switching
    this.saveCurrentModeState(session);

    // Initialize new mode
    this.currentMode = newMode;
    this.initializeMode(
      newMode,
      session,
      { tier: session.difficulty } as DifficultyConfig,
      ageRange
    );
  }

  /**
   * Save current mode state to session
   */
  private saveCurrentModeState(session: GameSession): void {
    if (this.focusMeter) {
      session.focusMeter = this.focusMeter.getState();
    }
    if (this.momentumTracker) {
      session.momentum = this.momentumTracker.getState();
    }
  }

  /**
   * Get mode-specific rules
   */
  getModeRules(mode: GameMode): {
    usesFocusMeter: boolean;
    usesMomentum: boolean;
    hasMissions: boolean;
    hasProgression: boolean;
  } {
    switch (mode) {
      case 'classic':
        return {
          usesFocusMeter: false,
          usesMomentum: false,
          hasMissions: false,
          hasProgression: false,
        };
      case 'focus':
        return {
          usesFocusMeter: true,
          usesMomentum: true,
          hasMissions: true,
          hasProgression: false,
        };
      case 'adventure':
        return {
          usesFocusMeter: true,
          usesMomentum: true,
          hasMissions: true,
          hasProgression: true,
        };
      case 'pattern':
        return {
          usesFocusMeter: false,
          usesMomentum: true,
          hasMissions: false,
          hasProgression: false,
        };
      default:
        return {
          usesFocusMeter: false,
          usesMomentum: false,
          hasMissions: false,
          hasProgression: false,
        };
    }
  }

  /**
   * Validate mode requirements (for mode unlocking)
   */
  validateModeRequirements(mode: GameMode, profile: any): boolean {
    switch (mode) {
      case 'classic':
        return true; // Always available
      case 'focus':
        return true; // Always available
      case 'adventure':
        // Adventure mode might require certain achievements
        // For now, always available
        return true;
      case 'pattern':
        return true; // Always available
      default:
        return false;
    }
  }

  /**
   * Get current mode
   */
  getCurrentMode(): GameMode {
    return this.currentMode;
  }

  /**
   * Get focus meter instance
   */
  getFocusMeter(): FocusMeter | undefined {
    return this.focusMeter;
  }

  /**
   * Get momentum tracker instance
   */
  getMomentumTracker(): MomentumTracker | undefined {
    return this.momentumTracker;
  }

  /**
   * Get mission generator instance
   */
  getMissionGenerator(): MicroMissionGenerator | undefined {
    return this.missionGenerator;
  }
}
