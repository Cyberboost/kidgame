import { ReviewBasket } from '@/core/reviewBasket';

describe('ReviewBasket', () => {
  let basket: ReviewBasket;

  beforeEach(() => {
    basket = new ReviewBasket();
  });

  test('should start empty', () => {
    expect(basket.isEmpty()).toBe(true);
    expect(basket.size()).toBe(0);
  });

  test('should add words', () => {
    basket.add('CAT');
    expect(basket.isEmpty()).toBe(false);
    expect(basket.size()).toBe(1);
    expect(basket.has('CAT')).toBe(true);
  });

  test('should handle case-insensitive words', () => {
    basket.add('CAT');
    expect(basket.has('cat')).toBe(true);
    expect(basket.has('Cat')).toBe(true);
  });

  test('should not duplicate words', () => {
    basket.add('CAT');
    basket.add('cat');
    basket.add('Cat');
    expect(basket.size()).toBe(1);
  });

  test('should remove words', () => {
    basket.add('CAT');
    basket.add('DOG');
    
    const removed = basket.remove('CAT');
    expect(removed).toBe(true);
    expect(basket.size()).toBe(1);
    expect(basket.has('CAT')).toBe(false);
    expect(basket.has('DOG')).toBe(true);
  });

  test('should return false when removing non-existent word', () => {
    const removed = basket.remove('CAT');
    expect(removed).toBe(false);
  });

  test('should get all words', () => {
    basket.add('CAT');
    basket.add('DOG');
    basket.add('BIRD');
    
    const words = basket.getAll();
    expect(words).toHaveLength(3);
    expect(words).toContain('cat');
    expect(words).toContain('dog');
    expect(words).toContain('bird');
  });

  test('should clear all words', () => {
    basket.add('CAT');
    basket.add('DOG');
    
    basket.clear();
    expect(basket.isEmpty()).toBe(true);
    expect(basket.size()).toBe(0);
  });

  test('should get random word', () => {
    basket.add('CAT');
    basket.add('DOG');
    basket.add('BIRD');
    
    const word = basket.getRandomWord();
    expect(word).toBeDefined();
    expect(['cat', 'dog', 'bird']).toContain(word!);
  });

  test('should return null when getting random word from empty basket', () => {
    const word = basket.getRandomWord();
    expect(word).toBeNull();
  });

  test('should initialize with words', () => {
    const initialWords = ['CAT', 'DOG', 'BIRD'];
    const basket = new ReviewBasket(initialWords);
    
    expect(basket.size()).toBe(3);
    expect(basket.has('CAT')).toBe(true);
    expect(basket.has('DOG')).toBe(true);
    expect(basket.has('BIRD')).toBe(true);
  });

  test('should handle enqueue/dequeue correctly', () => {
    // Add words
    basket.add('FIRST');
    basket.add('SECOND');
    basket.add('THIRD');
    
    expect(basket.size()).toBe(3);
    
    // Remove one
    basket.remove('FIRST');
    expect(basket.size()).toBe(2);
    expect(basket.has('FIRST')).toBe(false);
    
    // Add it back
    basket.add('FIRST');
    expect(basket.size()).toBe(3);
    expect(basket.has('FIRST')).toBe(true);
  });
});
