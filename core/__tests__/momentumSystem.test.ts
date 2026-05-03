import { MomentumTracker } from '../engine/momentumSystem';

describe('MomentumTracker', () => {
  let momentum: MomentumTracker;

  beforeEach(() => {
    momentum = new MomentumTracker();
  });

  test('initializes with no momentum', () => {
    const state = momentum.getState();
    expect(state.level).toBe('none');
    expect(state.multiplier).toBe(1.0);
    expect(state.consecutiveCorrect).toBe(0);
    expect(state.streakBonus).toBe(0);
  });

  test('builds momentum with correct actions', () => {
    momentum.addCorrectAction('letter');
    expect(momentum.getStreak()).toBe(1);
    expect(momentum.getLevel()).toBe('none');

    momentum.addCorrectAction('letter');
    momentum.addCorrectAction('letter');
    expect(momentum.getStreak()).toBe(3);
    expect(momentum.getLevel()).toBe('warming-up');
    expect(momentum.getMultiplier()).toBe(1.5);
  });

  test('reaches on-fire level', () => {
    for (let i = 0; i < 5; i++) {
      momentum.addCorrectAction('letter');
    }

    expect(momentum.getLevel()).toBe('on-fire');
    expect(momentum.getMultiplier()).toBe(2.0);
  });

  test('reaches unstoppable level', () => {
    for (let i = 0; i < 10; i++) {
      momentum.addCorrectAction('letter');
    }

    expect(momentum.getLevel()).toBe('unstoppable');
    expect(momentum.getMultiplier()).toBe(3.0);
  });

  test('word actions give more streak bonus', () => {
    momentum.addCorrectAction('letter');
    const letterBonus = momentum.getStreakBonus();

    momentum.addCorrectAction('word');
    const wordBonus = momentum.getStreakBonus();

    expect(wordBonus).toBeGreaterThan(letterBonus + 2);
  });

  test('breakStreak resets all values', () => {
    // Build up momentum
    for (let i = 0; i < 10; i++) {
      momentum.addCorrectAction('letter');
    }

    expect(momentum.getLevel()).toBe('unstoppable');

    // Break streak
    momentum.breakStreak();

    expect(momentum.getLevel()).toBe('none');
    expect(momentum.getMultiplier()).toBe(1.0);
    expect(momentum.getStreak()).toBe(0);
    expect(momentum.getStreakBonus()).toBe(0);
  });

  test('getEncouragementMessage returns correct messages', () => {
    expect(momentum.getEncouragementMessage()).toBe('');

    for (let i = 0; i < 3; i++) {
      momentum.addCorrectAction('letter');
    }
    expect(momentum.getEncouragementMessage()).toContain('warming up');

    for (let i = 0; i < 2; i++) {
      momentum.addCorrectAction('letter');
    }
    expect(momentum.getEncouragementMessage()).toContain('ON FIRE');

    for (let i = 0; i < 5; i++) {
      momentum.addCorrectAction('letter');
    }
    expect(momentum.getEncouragementMessage()).toContain('UNSTOPPABLE');
  });

  test('setState and getState work correctly', () => {
    const state = {
      level: 'on-fire' as const,
      multiplier: 2.0,
      consecutiveCorrect: 7,
      streakBonus: 20,
    };

    momentum.setState(state);
    const retrieved = momentum.getState();

    expect(retrieved.level).toBe('on-fire');
    expect(retrieved.multiplier).toBe(2.0);
    expect(retrieved.consecutiveCorrect).toBe(7);
    expect(retrieved.streakBonus).toBe(20);
  });
});
