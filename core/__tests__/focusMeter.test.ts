import { FocusMeter } from '../engine/focusMeter';

describe('FocusMeter', () => {
  let focusMeter: FocusMeter;

  beforeEach(() => {
    focusMeter = new FocusMeter(100, 1.0);
  });

  test('initializes with correct values', () => {
    const state = focusMeter.getState();
    expect(state.current).toBe(100);
    expect(state.max).toBe(100);
    expect(state.drainRate).toBe(1.0);
    expect(state.isPaused).toBe(true);
  });

  test('starts paused and can be resumed', () => {
    expect(focusMeter.getState().isPaused).toBe(true);
    focusMeter.resume();
    expect(focusMeter.getState().isPaused).toBe(false);
  });

  test('drains over time when not paused', () => {
    focusMeter.initialize(100, 10); // Fast drain for testing
    const initial = focusMeter.getCurrent();

    // Wait a bit and update
    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    return wait(100).then(() => {
      focusMeter.update();
      expect(focusMeter.getCurrent()).toBeLessThan(initial);
    });
  });

  test('does not drain when paused', () => {
    focusMeter.initialize(100, 1.0);
    focusMeter.pause();
    const initial = focusMeter.getCurrent();

    focusMeter.update();
    expect(focusMeter.getCurrent()).toBe(initial);
  });

  test('refills focus correctly', () => {
    focusMeter.initialize(100, 1.0);
    focusMeter.drain(50);
    expect(focusMeter.getCurrent()).toBe(50);

    focusMeter.refill(25);
    expect(focusMeter.getCurrent()).toBe(75);
  });

  test('does not exceed max when refilling', () => {
    focusMeter.initialize(100, 1.0);
    focusMeter.refill(200);
    expect(focusMeter.getCurrent()).toBe(100);
  });

  test('does not go below zero when draining', () => {
    focusMeter.initialize(100, 1.0);
    focusMeter.drain(200);
    expect(focusMeter.getCurrent()).toBe(0);
  });

  test('isEmpty returns true when focus is zero', () => {
    focusMeter.initialize(100, 1.0);
    expect(focusMeter.isEmpty()).toBe(false);

    focusMeter.drain(100);
    expect(focusMeter.isEmpty()).toBe(true);
  });

  test('getPercentage returns correct value', () => {
    focusMeter.initialize(100, 1.0);
    expect(focusMeter.getPercentage()).toBe(100);

    focusMeter.drain(50);
    expect(focusMeter.getPercentage()).toBe(50);

    focusMeter.drain(25);
    expect(focusMeter.getPercentage()).toBe(25);
  });

  test('setState and getState work correctly', () => {
    const state = {
      current: 75,
      max: 100,
      drainRate: 1.5,
      lastUpdate: Date.now(),
      isPaused: false,
    };

    focusMeter.setState(state);
    const retrieved = focusMeter.getState();

    expect(retrieved.current).toBe(75);
    expect(retrieved.max).toBe(100);
    expect(retrieved.drainRate).toBe(1.5);
    expect(retrieved.isPaused).toBe(false);
  });
});
