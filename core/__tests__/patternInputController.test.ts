import { PatternInputController } from '../pattern/patternInputController';
import type { PatternColor } from '../types';

describe('PatternInputController', () => {
  let controller: PatternInputController;
  const testSequence: PatternColor[] = ['red', 'blue', 'green'];

  beforeEach(() => {
    controller = new PatternInputController();
  });

  test('accepts correct input sequence', () => {
    let sequenceComplete = false;
    let correctCount = 0;

    controller.startInput(testSequence, {
      onCorrectInput: () => correctCount++,
      onSequenceComplete: (success) => {
        sequenceComplete = true;
        expect(success).toBe(true);
      },
    });

    expect(controller.handleInput('red')).toBe(true);
    expect(controller.handleInput('blue')).toBe(true);
    expect(controller.handleInput('green')).toBe(true);

    expect(correctCount).toBe(3);
    expect(sequenceComplete).toBe(true);
  });

  test('rejects incorrect input', () => {
    let incorrect = false;

    controller.startInput(testSequence, {
      onIncorrectInput: (expected, actual) => {
        incorrect = true;
        expect(expected).toBe('blue');
        expect(actual).toBe('green');
      },
      onSequenceComplete: (success) => {
        expect(success).toBe(false);
      },
    });

    controller.handleInput('red');
    controller.handleInput('green'); // Wrong! Should be blue

    expect(incorrect).toBe(true);
    expect(controller.getIsAcceptingInput()).toBe(false);
  });

  test('tracks progress correctly', () => {
    controller.startInput(testSequence, {});

    expect(controller.getProgress()).toBe(0);
    controller.handleInput('red');
    expect(controller.getProgress()).toBeCloseTo(33.33, 1);
    controller.handleInput('blue');
    expect(controller.getProgress()).toBeCloseTo(66.67, 1);
  });

  test('provides next expected color for hints', () => {
    controller.startInput(testSequence, {});

    expect(controller.getNextExpectedColor()).toBe('red');
    controller.handleInput('red');
    expect(controller.getNextExpectedColor()).toBe('blue');
  });

  test('validates complete sequence', () => {
    controller.startInput(testSequence, {});

    expect(controller.validateSequence(['red', 'blue', 'green'])).toBe(true);
    expect(controller.validateSequence(['red', 'green', 'blue'])).toBe(false);
    expect(controller.validateSequence(['red', 'blue'])).toBe(false);
  });

  test('gets remaining sequence', () => {
    controller.startInput(testSequence, {});

    expect(controller.getRemainingSequence()).toEqual(['red', 'blue', 'green']);
    controller.handleInput('red');
    expect(controller.getRemainingSequence()).toEqual(['blue', 'green']);
  });

  test('can be reset', () => {
    controller.startInput(testSequence, {});
    controller.handleInput('red');

    controller.reset();

    expect(controller.getUserInput()).toEqual([]);
    expect(controller.getIsAcceptingInput()).toBe(false);
  });
});
