import { AgeRange } from '../types';

/**
 * Age-adaptive configuration for ADHD-friendly gameplay
 * Adjusts difficulty parameters based on age range
 */

export interface AgeAdaptiveSettings {
  focusMeterDrainRate: number; // points per second
  focusMeterMax: number;
  hintFrequency: 'abundant' | 'moderate' | 'limited';
  missionTimeMultiplier: number;
  visualComplexity: 'simple' | 'moderate' | 'full';
  allowUnlimitedRetries: boolean;
  showTimers: boolean;
  encouragementFrequency: 'high' | 'medium' | 'low';
}

export const AGE_CONFIGS: Record<AgeRange, AgeAdaptiveSettings> = {
  '4-6': {
    focusMeterDrainRate: 0.5, // Very slow drain (0.5 per second)
    focusMeterMax: 150, // Higher max for more cushion
    hintFrequency: 'abundant',
    missionTimeMultiplier: 2.0, // Double time
    visualComplexity: 'simple',
    allowUnlimitedRetries: true,
    showTimers: false, // No pressure for young kids
    encouragementFrequency: 'high',
  },
  '7-8': {
    focusMeterDrainRate: 1.0, // Standard drain (1 per second)
    focusMeterMax: 100,
    hintFrequency: 'moderate',
    missionTimeMultiplier: 1.5, // 50% more time
    visualComplexity: 'moderate',
    allowUnlimitedRetries: true,
    showTimers: true, // Show timers but not strict
    encouragementFrequency: 'medium',
  },
  '9-10': {
    focusMeterDrainRate: 1.5, // Faster drain for challenge
    focusMeterMax: 100,
    hintFrequency: 'limited',
    missionTimeMultiplier: 1.0, // Standard time
    visualComplexity: 'full',
    allowUnlimitedRetries: false,
    showTimers: true,
    encouragementFrequency: 'low', // More self-directed
  },
};

/**
 * Get age-adaptive settings for a given age range
 */
export function getAgeAdaptiveSettings(ageRange: AgeRange): AgeAdaptiveSettings {
  return AGE_CONFIGS[ageRange];
}

/**
 * Derive age range from grade
 */
export function getAgeRangeFromGrade(grade: string): AgeRange {
  if (grade === 'PreK' || grade === 'K' || grade === '1') {
    return '4-6';
  } else if (grade === '2' || grade === '3') {
    return '7-8';
  } else {
    return '9-10';
  }
}

/**
 * Get recommended words per session based on age
 */
export function getRecommendedWordsPerSession(ageRange: AgeRange): number {
  switch (ageRange) {
    case '4-6':
      return 5; // Short sessions for young kids
    case '7-8':
      return 8; // Moderate sessions
    case '9-10':
      return 12; // Longer sessions for older kids
    default:
      return 8;
  }
}
