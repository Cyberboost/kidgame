import { updateDailyStreak } from '@/profiles/profileManager';
import { progressAchievement, awardPoints, spendPoints } from '@/core/starPointsManager';
import type { Profile } from '@/core/types';

function makeProfile(overrides: Partial<Profile> = {}): Profile {
  return {
    id: 'test-id',
    nickname: 'Tester',
    defaultGrade: 'K',
    createdAt: new Date(),
    stats: {
      totalGamesPlayed: 0,
      totalBunniesRescued: 0,
      totalWordsSpelled: 0,
      currentStreak: 0,
      bestStreak: 0,
      accuracy: 0,
    },
    unlockedThemes: ['front-lawn'],
    wordLists: {},
    customWords: [],
    wordPerformance: {},
    starPoints: 100,
    totalStarPointsEarned: 100,
    unlockedCostumes: ['green-dress'],
    equippedCostume: 'green-dress',
    equippedPet: null,
    unlockedPets: [],
    unlockedEmotes: ['wave'],
    unlockedDances: ['jump-for-joy'],
    characterCustomization: { skinTone: 'medium', hairStyle: 'ponytail', hairColor: 'blue-cyan', accessories: [] },
    achievements: {},
    dailyStreak: 0,
    lastPlayedDate: '',
    ...overrides,
  };
}

// ─── updateDailyStreak ────────────────────────────────────────────────────────

describe('updateDailyStreak', () => {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  })();
  const twoDaysAgo = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 2);
    return d.toISOString().split('T')[0];
  })();

  test('sets streak to 1 for first-time player', () => {
    const profile = makeProfile({ lastPlayedDate: '', dailyStreak: 0 });
    updateDailyStreak(profile);
    expect(profile.dailyStreak).toBe(1);
    expect(profile.lastPlayedDate).toBe(today);
  });

  test('increments streak when played yesterday', () => {
    const profile = makeProfile({ lastPlayedDate: yesterday, dailyStreak: 4 });
    updateDailyStreak(profile);
    expect(profile.dailyStreak).toBe(5);
    expect(profile.lastPlayedDate).toBe(today);
  });

  test('resets streak when gap > 1 day', () => {
    const profile = makeProfile({ lastPlayedDate: twoDaysAgo, dailyStreak: 10 });
    updateDailyStreak(profile);
    expect(profile.dailyStreak).toBe(1);
    expect(profile.lastPlayedDate).toBe(today);
  });

  test('does not change streak if already played today', () => {
    const profile = makeProfile({ lastPlayedDate: today, dailyStreak: 7 });
    updateDailyStreak(profile);
    expect(profile.dailyStreak).toBe(7);
    expect(profile.lastPlayedDate).toBe(today);
  });
});

// ─── progressAchievement ──────────────────────────────────────────────────────

describe('progressAchievement', () => {
  test('unlocks achievement when threshold reached', () => {
    const profile = makeProfile();
    const unlocked = progressAchievement(profile, 'first-word', 1, 1);
    expect(unlocked).toBe(true);
    expect(profile.achievements['first-word'].unlocked).toBe(true);
    expect(profile.achievements['first-word'].progress).toBe(1);
  });

  test('increments progress without unlocking when below threshold', () => {
    const profile = makeProfile();
    const unlocked = progressAchievement(profile, 'word-master', 10, 50);
    expect(unlocked).toBe(false);
    expect(profile.achievements['word-master'].unlocked).toBe(false);
    expect(profile.achievements['word-master'].progress).toBe(10);
  });

  test('accumulates progress over multiple calls', () => {
    const profile = makeProfile();
    progressAchievement(profile, 'bunny-rescuer', 5, 10);
    progressAchievement(profile, 'bunny-rescuer', 5, 10);
    expect(profile.achievements['bunny-rescuer'].unlocked).toBe(true);
    expect(profile.achievements['bunny-rescuer'].progress).toBe(10);
  });

  test('does not double-unlock an already unlocked achievement', () => {
    const profile = makeProfile({
      achievements: {
        'first-word': { unlocked: true, progress: 1, unlockedAt: '2025-01-01' },
      },
    });
    const unlocked = progressAchievement(profile, 'first-word', 1, 1);
    expect(unlocked).toBe(false);
    // unlockedAt should remain unchanged
    expect(profile.achievements['first-word'].unlockedAt).toBe('2025-01-01');
  });

  test('sets unlockedAt timestamp when newly unlocked', () => {
    const profile = makeProfile();
    progressAchievement(profile, 'breaker', 1, 1);
    expect(profile.achievements['breaker'].unlockedAt).toBeDefined();
    expect(typeof profile.achievements['breaker'].unlockedAt).toBe('string');
  });
});

// ─── awardPoints / spendPoints ────────────────────────────────────────────────

describe('awardPoints', () => {
  test('increases starPoints and totalStarPointsEarned', () => {
    const profile = makeProfile({ starPoints: 50, totalStarPointsEarned: 200 });
    awardPoints(profile, 100);
    expect(profile.starPoints).toBe(150);
    expect(profile.totalStarPointsEarned).toBe(300);
  });
});

describe('spendPoints', () => {
  test('deducts points and returns true when sufficient balance', () => {
    const profile = makeProfile({ starPoints: 200 });
    const result = spendPoints(profile, 100);
    expect(result).toBe(true);
    expect(profile.starPoints).toBe(100);
  });

  test('returns false and does not deduct when insufficient balance', () => {
    const profile = makeProfile({ starPoints: 50 });
    const result = spendPoints(profile, 100);
    expect(result).toBe(false);
    expect(profile.starPoints).toBe(50);
  });

  test('allows spending exact balance', () => {
    const profile = makeProfile({ starPoints: 100 });
    const result = spendPoints(profile, 100);
    expect(result).toBe(true);
    expect(profile.starPoints).toBe(0);
  });
});
