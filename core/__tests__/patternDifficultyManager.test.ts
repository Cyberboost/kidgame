import { PatternDifficultyManager } from '../pattern/patternDifficultyManager';

describe('PatternDifficultyManager', () => {
  let manager: PatternDifficultyManager;

  beforeEach(() => {
    manager = new PatternDifficultyManager('7-8');
  });

  test('returns appropriate playback speed for age range', () => {
    const youngManager = new PatternDifficultyManager('4-6');
    expect(youngManager.getPlaybackSpeed(1, 1)).toBe(1200);

    const olderManager = new PatternDifficultyManager('9-10');
    expect(olderManager.getPlaybackSpeed(1, 1)).toBeLessThan(1200);
  });

  test('speed increases with rounds', () => {
    const round1Speed = manager.getPlaybackSpeed(1, 1);
    const round5Speed = manager.getPlaybackSpeed(5, 1);
    expect(round5Speed).toBeLessThan(round1Speed);
  });

  test('manages hints appropriately by age', () => {
    const youngManager = new PatternDifficultyManager('4-6');
    expect(youngManager.hasHintsAvailable(100)).toBe(true); // Unlimited

    const olderManager = new PatternDifficultyManager('9-10');
    expect(olderManager.getRemainingHints(0)).toBe(3);
    expect(olderManager.hasHintsAvailable(3)).toBe(false);
  });

  test('adjusts tile count based on age', () => {
    const youngManager = new PatternDifficultyManager('4-6');
    expect(youngManager.getTileCount()).toBe(4);

    const olderManager = new PatternDifficultyManager('9-10');
    expect(olderManager.getTileCount()).toBe(6);
  });

  test('provides age-appropriate pause duration', () => {
    const youngManager = new PatternDifficultyManager('4-6');
    expect(youngManager.getPauseDuration()).toBe(1500);

    const olderManager = new PatternDifficultyManager('9-10');
    expect(olderManager.getPauseDuration()).toBeLessThan(1500);
  });

  test('shows encouragement at intervals', () => {
    expect(manager.shouldShowEncouragement(3)).toBe(true);
    expect(manager.shouldShowEncouragement(6)).toBe(true);
    expect(manager.shouldShowEncouragement(4)).toBe(false);
  });
});
