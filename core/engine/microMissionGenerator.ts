import { MicroMission, AgeRange, DifficultyTier } from '../types';

/**
 * Generates micro-missions for Focus Mode
 * Missions are short (20-60 seconds), age-adaptive challenges
 */
export class MicroMissionGenerator {
  /**
   * Generate a random micro-mission
   */
  generate(
    words: string[],
    ageRange: AgeRange = '7-8',
    difficulty: DifficultyTier = 'Explorer'
  ): MicroMission {
    const missionTypes: MicroMission['type'][] = [
      'speed-spell',
      'bunny-rush',
      'focus-challenge',
      'letter-hunt',
    ];

    const randomType = missionTypes[Math.floor(Math.random() * missionTypes.length)];
    return this.generateByType(randomType, words, ageRange, difficulty);
  }

  /**
   * Generate a specific type of mission
   */
  generateByType(
    type: MicroMission['type'],
    words: string[],
    ageRange: AgeRange,
    difficulty: DifficultyTier
  ): MicroMission {
    const id = `mission-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const timeMultiplier = this.getTimeMultiplier(ageRange);

    switch (type) {
      case 'speed-spell':
        return this.generateSpeedSpell(id, words, timeMultiplier);
      case 'bunny-rush':
        return this.generateBunnyRush(id, words, timeMultiplier);
      case 'focus-challenge':
        return this.generateFocusChallenge(id, words, timeMultiplier);
      case 'letter-hunt':
        return this.generateLetterHunt(id, words, timeMultiplier);
      default:
        return this.generateSpeedSpell(id, words, timeMultiplier);
    }
  }

  /**
   * Speed Spell: Spell a word quickly
   */
  private generateSpeedSpell(
    id: string,
    words: string[],
    timeMultiplier: number
  ): MicroMission {
    const targetWord = words[Math.floor(Math.random() * words.length)];
    const baseTime = 30; // 30 seconds base
    const timeLimit = Math.floor(baseTime * timeMultiplier);

    return {
      id,
      type: 'speed-spell',
      targetWord,
      timeLimit,
      focusReward: 25,
      completed: false,
    };
  }

  /**
   * Bunny Rush: Rescue N bunnies in one word
   */
  private generateBunnyRush(
    id: string,
    words: string[],
    timeMultiplier: number
  ): MicroMission {
    const targetWord = words[Math.floor(Math.random() * words.length)];
    const targetCount = Math.min(3, Math.ceil(targetWord.length / 2));
    const baseTime = 45;
    const timeLimit = Math.floor(baseTime * timeMultiplier);

    return {
      id,
      type: 'bunny-rush',
      targetWord,
      targetCount,
      timeLimit,
      focusReward: 30,
      completed: false,
    };
  }

  /**
   * Focus Challenge: Complete word without losing focus
   */
  private generateFocusChallenge(
    id: string,
    words: string[],
    timeMultiplier: number
  ): MicroMission {
    const targetWord = words[Math.floor(Math.random() * words.length)];
    const baseTime = 60;
    const timeLimit = Math.floor(baseTime * timeMultiplier);

    return {
      id,
      type: 'focus-challenge',
      targetWord,
      timeLimit,
      focusReward: 40,
      completed: false,
    };
  }

  /**
   * Letter Hunt: Find all instances of a letter
   */
  private generateLetterHunt(
    id: string,
    words: string[],
    timeMultiplier: number
  ): MicroMission {
    // Pick a common letter
    const commonLetters = ['A', 'E', 'I', 'O', 'T', 'N', 'S', 'R'];
    const targetLetter = commonLetters[Math.floor(Math.random() * commonLetters.length)];
    const baseTime = 40;
    const timeLimit = Math.floor(baseTime * timeMultiplier);

    return {
      id,
      type: 'letter-hunt',
      targetLetter,
      targetCount: 5, // Find 5 instances
      timeLimit,
      focusReward: 20,
      completed: false,
    };
  }

  /**
   * Get time multiplier based on age range
   * Younger kids get more time
   */
  private getTimeMultiplier(ageRange: AgeRange): number {
    switch (ageRange) {
      case '4-6':
        return 2.0; // Double time for young kids
      case '7-8':
        return 1.5; // 50% more time
      case '9-10':
        return 1.0; // Standard time
      default:
        return 1.5;
    }
  }

  /**
   * Get mission description for display
   */
  getMissionDescription(mission: MicroMission): string {
    switch (mission.type) {
      case 'speed-spell':
        return `⚡ Speed Spell: Spell "${mission.targetWord}" quickly!`;
      case 'bunny-rush':
        return `🐰 Bunny Rush: Rescue ${mission.targetCount} bunnies in "${mission.targetWord}"!`;
      case 'focus-challenge':
        return `🎯 Focus Challenge: Spell "${mission.targetWord}" without mistakes!`;
      case 'letter-hunt':
        return `🔍 Letter Hunt: Find ${mission.targetCount} "${mission.targetLetter}" letters!`;
      default:
        return 'Complete the mission!';
    }
  }
}
