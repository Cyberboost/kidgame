import type { Profile } from '@/core/types';

export function awardPoints(profile: Profile, amount: number): void {
  profile.starPoints += amount;
  profile.totalStarPointsEarned += amount;
}

/**
 * Deducts star points from the profile. Returns false if insufficient balance.
 * Note: This mutates the profile object in memory only.
 * Callers must persist the change with saveProfileData() after a successful spend.
 */
export function spendPoints(profile: Profile, amount: number): boolean {
  if (profile.starPoints < amount) return false;
  profile.starPoints -= amount;
  return true;
}

export function getComboMultiplier(comboCount: number): number {
  if (comboCount >= 15) return 10;
  if (comboCount >= 10) return 5;
  if (comboCount >= 5) return 3;
  if (comboCount >= 2) return 2;
  return 1;
}

export function getComboLabel(comboCount: number): string {
  if (comboCount >= 15) return '💥 ON FIRE!';
  if (comboCount >= 10) return '🌈 AMAZING!';
  if (comboCount >= 5) return '✨ NICE!';
  return '🔥 Combo!';
}

export function calculateLevelReward(
  lettersCollected: number,
  wordComplete: boolean,
  speedBonus: boolean,
  perfectRun: boolean,
  bunniesRescued: number,
  comboMultiplier: number
): number {
  let points = lettersCollected * 10 * comboMultiplier;
  if (wordComplete) points += 50;
  if (speedBonus) points += 25;
  if (perfectRun) points += 40;
  points += bunniesRescued * 30;
  return Math.round(points);
}

/**
 * Increments or unlocks an achievement on the profile.
 * Mutates in memory; caller must persist with saveProfileData().
 * Returns true if the achievement was newly unlocked by this call.
 */
export function progressAchievement(
  profile: Profile,
  achievementId: string,
  increment: number,
  threshold: number
): boolean {
  const current = profile.achievements[achievementId] ?? { unlocked: false, progress: 0 };
  if (current.unlocked) return false;

  const newProgress = current.progress + increment;
  const nowUnlocked = newProgress >= threshold;
  profile.achievements[achievementId] = {
    unlocked: nowUnlocked,
    progress: newProgress,
    unlockedAt: nowUnlocked ? new Date().toISOString() : current.unlockedAt,
  };
  return nowUnlocked;
}
