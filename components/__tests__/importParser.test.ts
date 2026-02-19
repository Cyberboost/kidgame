import { parseWordImport, validateWord } from '@/words/importParser';

describe('Word Import Parser', () => {
  test('should parse comma-separated words', () => {
    const input = 'CAT, DOG, BIRD';
    const result = parseWordImport(input);
    
    expect(result.valid).toEqual(['CAT', 'DOG', 'BIRD']);
    expect(result.invalid).toHaveLength(0);
    expect(result.duplicates).toHaveLength(0);
  });

  test('should parse newline-separated words', () => {
    const input = 'CAT\nDOG\nBIRD';
    const result = parseWordImport(input);
    
    expect(result.valid).toEqual(['CAT', 'DOG', 'BIRD']);
    expect(result.invalid).toHaveLength(0);
    expect(result.duplicates).toHaveLength(0);
  });

  test('should parse mixed comma and newline', () => {
    const input = 'CAT, DOG\nBIRD, FISH\nMOUSE';
    const result = parseWordImport(input);
    
    expect(result.valid).toEqual(['CAT', 'DOG', 'BIRD', 'FISH', 'MOUSE']);
  });

  test('should convert to uppercase', () => {
    const input = 'cat, dog, bird';
    const result = parseWordImport(input);
    
    expect(result.valid).toEqual(['CAT', 'DOG', 'BIRD']);
  });

  test('should trim whitespace', () => {
    const input = '  CAT  ,  DOG  ,  BIRD  ';
    const result = parseWordImport(input);
    
    expect(result.valid).toEqual(['CAT', 'DOG', 'BIRD']);
  });

  test('should detect duplicates', () => {
    const input = 'CAT, DOG, CAT, BIRD';
    const result = parseWordImport(input);
    
    expect(result.valid).toEqual(['CAT', 'DOG', 'BIRD']);
    expect(result.duplicates).toEqual(['CAT']);
  });

  test('should detect case-insensitive duplicates', () => {
    const input = 'CAT, dog, Cat, BIRD';
    const result = parseWordImport(input);
    
    expect(result.valid).toEqual(['CAT', 'DOG', 'BIRD']);
    expect(result.duplicates).toHaveLength(1);
    expect(result.duplicates).toContain('CAT');
  });

  test('should reject words with numbers', () => {
    const input = 'CAT, DOG123, BIRD';
    const result = parseWordImport(input);
    
    expect(result.valid).toEqual(['CAT', 'BIRD']);
    expect(result.invalid).toEqual(['DOG123']);
  });

  test('should reject words with special characters', () => {
    const input = 'CAT, DO-G, BIRD!';
    const result = parseWordImport(input);
    
    expect(result.valid).toEqual(['CAT']);
    expect(result.invalid).toEqual(['DO-G', 'BIRD!']);
  });

  test('should reject words longer than 20 characters', () => {
    const input = 'CAT, VERYLONGWORDTHATISTOOLONGTOBEVALID, DOG';
    const result = parseWordImport(input);
    
    expect(result.valid).toEqual(['CAT', 'DOG']);
    expect(result.invalid).toContain('VERYLONGWORDTHATISTOOLONGTOBEVALID');
  });

  test('should reject empty words', () => {
    const input = 'CAT,,DOG';
    const result = parseWordImport(input);
    
    expect(result.valid).toEqual(['CAT', 'DOG']);
  });

  test('should handle empty input', () => {
    const input = '';
    const result = parseWordImport(input);
    
    expect(result.valid).toHaveLength(0);
    expect(result.invalid).toHaveLength(0);
    expect(result.duplicates).toHaveLength(0);
  });
});

describe('validateWord', () => {
  test('should validate correct words', () => {
    expect(validateWord('CAT')).toBe(true);
    expect(validateWord('DOG')).toBe(true);
    expect(validateWord('ELEPHANT')).toBe(true);
  });

  test('should validate case-insensitive', () => {
    expect(validateWord('cat')).toBe(true);
    expect(validateWord('Dog')).toBe(true);
    expect(validateWord('ELEPHANT')).toBe(true);
  });

  test('should reject words with numbers', () => {
    expect(validateWord('CAT123')).toBe(false);
    expect(validateWord('1DOG')).toBe(false);
  });

  test('should reject words with special characters', () => {
    expect(validateWord('CAT-DOG')).toBe(false);
    expect(validateWord('DOG!')).toBe(false);
    expect(validateWord('CAT_DOG')).toBe(false);
  });

  test('should reject words longer than 20 characters', () => {
    expect(validateWord('VERYLONGWORDTHATISTOOLONGTOBEVALID')).toBe(false);
  });

  test('should reject empty words', () => {
    expect(validateWord('')).toBe(false);
  });

  test('should accept single letter words', () => {
    expect(validateWord('A')).toBe(true);
    expect(validateWord('I')).toBe(true);
  });
});
