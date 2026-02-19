import { WordPerformance } from '@/core/types';

export class PerformanceTracker {
  private performances: Map<string, WordPerformance>;

  constructor(initialData: Record<string, WordPerformance> = {}) {
    this.performances = new Map(Object.entries(initialData));
  }

  recordAttempt(
    word: string,
    success: boolean,
    letterMistakes: number = 0,
    timeMs: number = 0
  ): void {
    const key = word.toLowerCase();
    const existing = this.performances.get(key);

    if (existing) {
      existing.attempts++;
      existing.letterMistakes += letterMistakes;
      if (!success) {
        existing.incorrectSubmits++;
      }
      existing.timeToCorrect = timeMs;
      existing.lastAttempt = new Date();
      
      // Mark as mastered if: 3+ correct attempts, accuracy > 80%, recent success
      if (
        existing.attempts >= 3 &&
        success &&
        existing.incorrectSubmits / existing.attempts < 0.2
      ) {
        existing.mastered = true;
      }
    } else {
      this.performances.set(key, {
        word,
        attempts: 1,
        letterMistakes,
        incorrectSubmits: success ? 0 : 1,
        timeToCorrect: timeMs,
        mastered: false,
        lastAttempt: new Date(),
      });
    }
  }

  getPerformance(word: string): WordPerformance | undefined {
    return this.performances.get(word.toLowerCase());
  }

  getAllPerformances(): Record<string, WordPerformance> {
    return Object.fromEntries(this.performances);
  }

  getAccuracy(): number {
    let totalAttempts = 0;
    let totalIncorrect = 0;

    for (const perf of this.performances.values()) {
      totalAttempts += perf.attempts;
      totalIncorrect += perf.incorrectSubmits;
    }

    if (totalAttempts === 0) return 0;
    return ((totalAttempts - totalIncorrect) / totalAttempts) * 100;
  }

  getMasteredCount(): number {
    return Array.from(this.performances.values()).filter(p => p.mastered).length;
  }
}
