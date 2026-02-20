import { Profile, Grade, DifficultyTier } from '@/core/types';
import { saveProfile, getProfile, getAllProfiles, deleteProfile } from '@/core/persistence';

export function createProfile(
  nickname: string,
  grade: Grade,
  preferredDifficulty?: DifficultyTier
): Profile {
  return {
    id: `profile-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
    nickname,
    defaultGrade: grade,
    preferredDifficulty,
    createdAt: new Date(),
    stats: {
      totalGamesPlayed: 0,
      totalBunniesRescued: 0,
      totalWordsSpelled: 0,
      currentStreak: 0,
      bestStreak: 0,
      accuracy: 0,
    },
    unlockedThemes: ['front-lawn'], // Default theme unlocked
    wordLists: {},
    customWords: [],
    wordPerformance: {},
    starPoints: 0,
    totalStarPointsEarned: 0,
    unlockedCostumes: ['green-dress', 'casual-tshirt'],
    equippedCostume: 'green-dress',
    equippedPet: null,
    unlockedPets: [],
    unlockedEmotes: ['wave', 'celebrate', 'flex', 'heart'],
    unlockedDances: ['jump-for-joy'],
    characterCustomization: {
      skinTone: 'medium',
      hairStyle: 'ponytail',
      hairColor: 'blue-cyan',
      accessories: [],
    },
    achievements: {},
    dailyStreak: 0,
    lastPlayedDate: '',
  };
}

export async function saveProfileData(profile: Profile): Promise<void> {
  await saveProfile(profile);
}

export async function loadProfile(id: string): Promise<Profile | null> {
  const profile = await getProfile(id);
  return profile || null;
}

export async function loadAllProfiles(): Promise<Profile[]> {
  return await getAllProfiles();
}

export async function removeProfile(id: string): Promise<void> {
  await deleteProfile(id);
}

export function updateProfileStats(
  profile: Profile,
  bunniesRescued: number,
  wordsSpelled: number,
  accuracy: number,
  streakEnded: boolean
): void {
  profile.stats.totalGamesPlayed++;
  profile.stats.totalBunniesRescued += bunniesRescued;
  profile.stats.totalWordsSpelled += wordsSpelled;
  
  if (streakEnded) {
    if (profile.stats.currentStreak > profile.stats.bestStreak) {
      profile.stats.bestStreak = profile.stats.currentStreak;
    }
    profile.stats.currentStreak = 0;
  } else {
    profile.stats.currentStreak++;
    if (profile.stats.currentStreak > profile.stats.bestStreak) {
      profile.stats.bestStreak = profile.stats.currentStreak;
    }
  }

  // Update rolling accuracy
  const prevTotalWords = profile.stats.totalWordsSpelled;
  if (prevTotalWords > 0) {
    const totalWords = prevTotalWords + wordsSpelled;
    profile.stats.accuracy = ((profile.stats.accuracy * prevTotalWords) + (accuracy * wordsSpelled)) / totalWords;
  } else {
    profile.stats.accuracy = accuracy;
  }
}

export function unlockTheme(profile: Profile, themeId: string): boolean {
  if (!profile.unlockedThemes.includes(themeId)) {
    profile.unlockedThemes.push(themeId);
    return true;
  }
  return false;
}

export function addCustomWords(profile: Profile, words: string[]): void {
  const newWords = words.filter(w => !profile.customWords.includes(w.toUpperCase()));
  profile.customWords.push(...newWords.map(w => w.toUpperCase()));
}

/**
 * Updates the daily streak for the profile based on today's date.
 * Increments if played yesterday, resets to 1 if gap, skips if already played today.
 * Mutates the profile in memory — caller must persist with saveProfileData().
 */
export function updateDailyStreak(profile: Profile): void {
  const today = new Date().toISOString().split('T')[0];
  if (profile.lastPlayedDate === today) return;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (profile.lastPlayedDate === yesterdayStr) {
    profile.dailyStreak++;
  } else {
    profile.dailyStreak = 1;
  }
  profile.lastPlayedDate = today;
}
