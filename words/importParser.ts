// Parse and validate imported word lists

export interface ImportResult {
  valid: string[];
  invalid: string[];
  duplicates: string[];
}

export function parseWordImport(input: string): ImportResult {
  const lines = input
    .split(/[\n,]+/)
    .map(line => line.trim().toUpperCase())
    .filter(line => line.length > 0);

  const valid: string[] = [];
  const invalid: string[] = [];
  const seen = new Set<string>();
  const duplicates: string[] = [];

  for (const word of lines) {
    // Validate: only letters, 1-20 characters
    if (!/^[A-Z]{1,20}$/.test(word)) {
      invalid.push(word);
      continue;
    }

    // Check for duplicates
    if (seen.has(word)) {
      duplicates.push(word);
      continue;
    }

    seen.add(word);
    valid.push(word);
  }

  return { valid, invalid, duplicates };
}

export function validateWord(word: string): boolean {
  return /^[A-Z]{1,20}$/i.test(word);
}
