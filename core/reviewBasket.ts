// Review Basket manages failed words that need to be re-attempted

export class ReviewBasket {
  private basket: Set<string>;

  constructor(initialWords: string[] = []) {
    this.basket = new Set(initialWords.map(w => w.toLowerCase()));
  }

  add(word: string): void {
    this.basket.add(word.toLowerCase());
  }

  remove(word: string): boolean {
    return this.basket.delete(word.toLowerCase());
  }

  has(word: string): boolean {
    return this.basket.has(word.toLowerCase());
  }

  isEmpty(): boolean {
    return this.basket.size === 0;
  }

  size(): number {
    return this.basket.size;
  }

  getAll(): string[] {
    return Array.from(this.basket);
  }

  clear(): void {
    this.basket.clear();
  }

  // Get a random word from the basket for review
  getRandomWord(): string | null {
    if (this.isEmpty()) return null;
    const words = this.getAll();
    return words[Math.floor(Math.random() * words.length)];
  }
}

export function shouldInterleaveReviewWord(
  turnNumber: number,
  reviewBasket: ReviewBasket
): boolean {
  // Every 3rd word should come from the review basket if available
  return turnNumber % 3 === 0 && !reviewBasket.isEmpty();
}
