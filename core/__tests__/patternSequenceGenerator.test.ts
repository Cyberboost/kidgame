import { PatternSequenceGenerator } from '../pattern/patternSequenceGenerator';

describe('PatternSequenceGenerator', () => {
  let generator: PatternSequenceGenerator;

  beforeEach(() => {
    generator = new PatternSequenceGenerator('7-8', 'adventure');
  });

  test('generates initial sequence with correct length', () => {
    const sequence = generator.generateInitialSequence(1);
    expect(sequence.colors.length).toBe(3); // 7-8 age range starts with 3
    expect(sequence.round).toBe(1);
  });

  test('extends sequence correctly', () => {
    const initial = generator.generateInitialSequence(1);
    const extended = generator.extendSequence(initial.colors, 2);

    expect(extended.colors.length).toBe(initial.colors.length + 1);
    expect(extended.round).toBe(2);
    expect(extended.colors.slice(0, -1)).toEqual(initial.colors);
  });

  test('adjusts for different age ranges', () => {
    const youngGen = new PatternSequenceGenerator('4-6', 'adventure');
    const youngSeq = youngGen.generateInitialSequence(1);
    expect(youngSeq.colors.length).toBe(2); // 4-6 starts with 2

    const olderGen = new PatternSequenceGenerator('9-10', 'adventure');
    const olderSeq = olderGen.generateInitialSequence(1);
    expect(olderSeq.colors.length).toBe(4); // 9-10 starts with 4
  });

  test('uses appropriate colors for sensory profile', () => {
    const calmGen = new PatternSequenceGenerator('7-8', 'calm');
    const colors = calmGen.getAvailableColors();
    expect(colors.length).toBe(4); // Calm mode uses 4 colors

    const minimalGen = new PatternSequenceGenerator('7-8', 'minimal');
    const minimalColors = minimalGen.getAvailableColors();
    expect(minimalColors).toEqual(['red', 'blue', 'green', 'yellow']);
  });

  test('respects max sequence length', () => {
    const youngGen = new PatternSequenceGenerator('4-6', 'adventure');
    expect(youngGen.getMaxSequenceLength()).toBe(6);

    const olderGen = new PatternSequenceGenerator('9-10', 'adventure');
    expect(olderGen.getMaxSequenceLength()).toBe(15);
  });

  test('updates age range and sensory profile', () => {
    generator.setAgeRange('4-6');
    const seq = generator.generateInitialSequence(1);
    expect(seq.colors.length).toBe(2);

    generator.setSensoryProfile('minimal');
    const colors = generator.getAvailableColors();
    expect(colors.length).toBe(4);
  });
});
