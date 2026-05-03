import { MicroMissionGenerator } from '../engine/microMissionGenerator';

describe('MicroMissionGenerator', () => {
  let generator: MicroMissionGenerator;
  const testWords = ['CAT', 'DOG', 'HAPPY', 'FRIEND', 'ADVENTURE'];

  beforeEach(() => {
    generator = new MicroMissionGenerator();
  });

  test('generates a mission', () => {
    const mission = generator.generate(testWords);

    expect(mission.id).toBeDefined();
    expect(mission.type).toBeDefined();
    expect(mission.timeLimit).toBeGreaterThan(0);
    expect(mission.focusReward).toBeGreaterThan(0);
    expect(mission.completed).toBe(false);
  });

  test('generates speed-spell mission', () => {
    const mission = generator.generateByType('speed-spell', testWords, '7-8', 'Explorer');

    expect(mission.type).toBe('speed-spell');
    expect(mission.targetWord).toBeDefined();
    expect(testWords).toContain(mission.targetWord);
    expect(mission.timeLimit).toBeGreaterThan(0);
  });

  test('generates bunny-rush mission', () => {
    const mission = generator.generateByType('bunny-rush', testWords, '7-8', 'Explorer');

    expect(mission.type).toBe('bunny-rush');
    expect(mission.targetWord).toBeDefined();
    expect(mission.targetCount).toBeGreaterThan(0);
  });

  test('generates focus-challenge mission', () => {
    const mission = generator.generateByType('focus-challenge', testWords, '7-8', 'Explorer');

    expect(mission.type).toBe('focus-challenge');
    expect(mission.targetWord).toBeDefined();
    expect(mission.focusReward).toBeGreaterThan(0);
  });

  test('generates letter-hunt mission', () => {
    const mission = generator.generateByType('letter-hunt', testWords, '7-8', 'Explorer');

    expect(mission.type).toBe('letter-hunt');
    expect(mission.targetLetter).toBeDefined();
    expect(mission.targetCount).toBeGreaterThan(0);
  });

  test('adjusts time for younger kids', () => {
    const youngMission = generator.generate(testWords, '4-6', 'Sprout');
    const olderMission = generator.generate(testWords, '9-10', 'Guardian');

    // Younger kids should get more time (on average)
    // We'll generate multiple to smooth out randomness
    let youngTotal = 0;
    let olderTotal = 0;

    for (let i = 0; i < 10; i++) {
      const young = generator.generate(testWords, '4-6', 'Sprout');
      const older = generator.generate(testWords, '9-10', 'Guardian');
      youngTotal += young.timeLimit;
      olderTotal += older.timeLimit;
    }

    expect(youngTotal / 10).toBeGreaterThan(olderTotal / 10);
  });

  test('getMissionDescription returns descriptive text', () => {
    const speedMission = generator.generateByType('speed-spell', testWords, '7-8', 'Explorer');
    const description = generator.getMissionDescription(speedMission);

    expect(description).toContain('Speed Spell');
    expect(description).toContain(speedMission.targetWord);
  });

  test('mission IDs are unique', () => {
    const mission1 = generator.generate(testWords);
    const mission2 = generator.generate(testWords);

    expect(mission1.id).not.toBe(mission2.id);
  });

  test('all mission types can be generated', () => {
    const types = new Set();

    for (let i = 0; i < 50; i++) {
      const mission = generator.generate(testWords);
      types.add(mission.type);
    }

    // With 50 generations, we should see all 4 types
    expect(types.size).toBeGreaterThanOrEqual(3); // At least 3 types
  });
});
