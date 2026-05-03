import { ModeManager } from '../engine/modeManager';
import { GameSession, DifficultyConfig } from '../types';

describe('ModeManager', () => {
  let modeManager: ModeManager;
  let mockSession: GameSession;
  let mockConfig: DifficultyConfig;

  beforeEach(() => {
    modeManager = new ModeManager();
    mockSession = {
      id: 'test-session',
      mode: 'solo',
      profileIds: ['test-profile'],
      currentPlayerIndex: 0,
      difficulty: 'Explorer',
      grade: '2',
      themeId: 'front-lawn',
      gridSize: 5,
      board: [],
      bunnyTraps: [],
      activeWords: ['CAT', 'DOG', 'HAPPY'],
      reviewBasket: [],
      currentWordIndex: 0,
      currentWord: 'CAT',
      currentInput: '',
      selectedTiles: [],
      gardenFocus: 3,
      gardenFocusMax: 3,
      streak: 0,
      bunniesRescued: 0,
      totalBunnies: 5,
      wordsSpelled: 0,
      hintsDisabled: false,
      turnStartTime: Date.now(),
      sessionStartTime: Date.now(),
      completed: false,
      stats: {},
    };
    mockConfig = {
      tier: 'Explorer',
      grades: ['1', '2'],
      gridSize: 5,
      gardenFocusMax: 3,
      gentleMode: false,
      allowRetry: false,
      timerEnabled: false,
      consequences: {
        onFocusZero: 'endTurnResetStreak',
        onIncorrectSubmit: 'immediateReset',
      },
    };
  });

  test('initializes classic mode', () => {
    modeManager.initializeMode('classic', mockSession, mockConfig);

    expect(mockSession.gameMode).toBe('classic');
    expect(mockSession.focusMeter).toBeUndefined();
    expect(mockSession.momentum).toBeUndefined();
    expect(mockSession.microMission).toBeUndefined();
  });

  test('initializes focus mode with focus meter', () => {
    modeManager.initializeMode('focus', mockSession, mockConfig, '7-8');

    expect(mockSession.gameMode).toBe('focus');
    expect(mockSession.focusMeter).toBeDefined();
    expect(mockSession.momentum).toBeDefined();
    expect(mockSession.microMission).toBeDefined();
  });

  test('initializes adventure mode', () => {
    modeManager.initializeMode('adventure', mockSession, mockConfig, '7-8');

    expect(mockSession.gameMode).toBe('adventure');
    expect(mockSession.focusMeter).toBeDefined();
    expect(mockSession.momentum).toBeDefined();
  });

  test('getModeRules returns correct rules for classic', () => {
    const rules = modeManager.getModeRules('classic');

    expect(rules.usesFocusMeter).toBe(false);
    expect(rules.usesMomentum).toBe(false);
    expect(rules.hasMissions).toBe(false);
    expect(rules.hasProgression).toBe(false);
  });

  test('getModeRules returns correct rules for focus', () => {
    const rules = modeManager.getModeRules('focus');

    expect(rules.usesFocusMeter).toBe(true);
    expect(rules.usesMomentum).toBe(true);
    expect(rules.hasMissions).toBe(true);
    expect(rules.hasProgression).toBe(false);
  });

  test('getModeRules returns correct rules for adventure', () => {
    const rules = modeManager.getModeRules('adventure');

    expect(rules.usesFocusMeter).toBe(true);
    expect(rules.usesMomentum).toBe(true);
    expect(rules.hasMissions).toBe(true);
    expect(rules.hasProgression).toBe(true);
  });

  test('switchMode changes mode correctly', () => {
    modeManager.initializeMode('classic', mockSession, mockConfig);
    expect(modeManager.getCurrentMode()).toBe('classic');

    modeManager.switchMode('focus', mockSession, '7-8');
    expect(modeManager.getCurrentMode()).toBe('focus');
    expect(mockSession.gameMode).toBe('focus');
  });

  test('validateModeRequirements returns true for all modes', () => {
    const mockProfile = { id: 'test' };

    expect(modeManager.validateModeRequirements('classic', mockProfile)).toBe(true);
    expect(modeManager.validateModeRequirements('focus', mockProfile)).toBe(true);
    expect(modeManager.validateModeRequirements('adventure', mockProfile)).toBe(true);
  });

  test('getFocusMeter returns instance after focus mode init', () => {
    modeManager.initializeMode('focus', mockSession, mockConfig, '7-8');

    const focusMeter = modeManager.getFocusMeter();
    expect(focusMeter).toBeDefined();
  });

  test('getMomentumTracker returns instance after focus mode init', () => {
    modeManager.initializeMode('focus', mockSession, mockConfig, '7-8');

    const momentum = modeManager.getMomentumTracker();
    expect(momentum).toBeDefined();
  });

  test('getMissionGenerator returns instance after focus mode init', () => {
    modeManager.initializeMode('focus', mockSession, mockConfig, '7-8');

    const generator = modeManager.getMissionGenerator();
    expect(generator).toBeDefined();
  });
});
