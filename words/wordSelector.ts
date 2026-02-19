import { ReviewBasket } from '@/core/reviewBasket';

export class WordSelector {
  private availableWords: string[];
  private usedWords: Set<string>;
  private shuffledWords: string[];
  private currentIndex: number;

  constructor(wordList: string[]) {
    this.availableWords = wordList.map(w => w.toUpperCase());
    this.usedWords = new Set();
    this.shuffledWords = this.shuffle([...this.availableWords]);
    this.currentIndex = 0;
  }

  private shuffle(array: string[]): string[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  getNextWord(turnNumber: number, reviewBasket: ReviewBasket): string {
    // Every 3rd turn, try to get a word from the review basket
    if (turnNumber > 0 && turnNumber % 3 === 0 && !reviewBasket.isEmpty()) {
      const reviewWord = reviewBasket.getRandomWord();
      if (reviewWord) {
        return reviewWord.toUpperCase();
      }
    }

    // Get next word from shuffled list
    if (this.currentIndex >= this.shuffledWords.length) {
      // Re-shuffle if we've used all words
      this.shuffledWords = this.shuffle([...this.availableWords]);
      this.currentIndex = 0;
      this.usedWords.clear();
    }

    const word = this.shuffledWords[this.currentIndex];
    this.currentIndex++;
    this.usedWords.add(word);
    return word;
  }

  reset(): void {
    this.usedWords.clear();
    this.shuffledWords = this.shuffle([...this.availableWords]);
    this.currentIndex = 0;
  }

  addWords(words: string[]): void {
    const newWords = words.map(w => w.toUpperCase()).filter(w => !this.availableWords.includes(w));
    this.availableWords.push(...newWords);
    this.shuffledWords = this.shuffle([...this.availableWords]);
    this.currentIndex = 0;
  }
}
