'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PatternBoard } from '@/components/pattern/PatternBoard';
import { PatternHUD } from '@/components/pattern/PatternHUD';
import { PatternHintButton } from '@/components/pattern/PatternHintButton';
import { PatternSuccessAnimation } from '@/components/pattern/PatternSuccessAnimation';
import { PatternSequenceGenerator } from '@/core/pattern/patternSequenceGenerator';
import { PatternDifficultyManager } from '@/core/pattern/patternDifficultyManager';
import { PatternPlaybackController } from '@/core/pattern/patternPlaybackController';
import { PatternInputController } from '@/core/pattern/patternInputController';
import type { PatternColor, PatternTileState, AgeRange, SensoryProfile } from '@/core/types';

export default function PatternModePage() {
  const router = useRouter();

  // Game state
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [currentSequence, setCurrentSequence] = useState<PatternColor[]>([]);
  const [tiles, setTiles] = useState<PatternTileState[]>([]);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [isUserTurn, setIsUserTurn] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [gameStarted, setGameStarted] = useState(false);

  // Settings (could come from profile)
  const ageRange: AgeRange = '7-8';
  const sensoryProfile: SensoryProfile = 'adventure';

  // Controllers
  const [generator] = useState(() => new PatternSequenceGenerator(ageRange, sensoryProfile));
  const [difficultyManager] = useState(() => new PatternDifficultyManager(ageRange));
  const [playbackController] = useState(() => new PatternPlaybackController());
  const [inputController] = useState(() => new PatternInputController());

  // Initialize tiles
  useEffect(() => {
    const tileCount = difficultyManager.getTileCount();
    const colors: PatternColor[] =
      tileCount === 4
        ? ['red', 'blue', 'green', 'yellow']
        : ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

    const initialTiles: PatternTileState[] = colors.map((color, index) => ({
      color,
      position: index,
      isActive: false,
      isPlaying: false,
    }));

    setTiles(initialTiles);
  }, [difficultyManager]);

  // Start new game
  const startGame = useCallback(() => {
    const sequence = generator.generateInitialSequence(1);
    setCurrentSequence(sequence.colors);
    setRound(1);
    setScore(0);
    setStreak(0);
    setHintsUsed(0);
    setGameStarted(true);
    playSequence(sequence.colors, 1);
  }, [generator]);

  // Play sequence
  const playSequence = useCallback(
    (sequence: PatternColor[], currentRound: number) => {
      setIsPlayingSequence(true);
      setIsUserTurn(false);

      const speed = difficultyManager.getPlaybackSpeed(currentRound, 1);

      playbackController.playSequence(sequence, speed, {
        onColorActivate: (color) => {
          setTiles((prev) =>
            prev.map((tile) =>
              tile.color === color ? { ...tile, isActive: true, isPlaying: true } : tile
            )
          );
        },
        onColorDeactivate: (color) => {
          setTiles((prev) =>
            prev.map((tile) =>
              tile.color === color ? { ...tile, isActive: false, isPlaying: false } : tile
            )
          );
        },
        onPlaybackComplete: () => {
          setIsPlayingSequence(false);
          // Pause before user turn
          setTimeout(() => {
            setIsUserTurn(true);
            startUserInput(sequence);
          }, difficultyManager.getPauseDuration());
        },
      });
    },
    [difficultyManager, playbackController]
  );

  // Start user input phase
  const startUserInput = useCallback(
    (sequence: PatternColor[]) => {
      inputController.startInput(sequence, {
        onCorrectInput: (color) => {
          // Flash the tile
          setTiles((prev) =>
            prev.map((tile) =>
              tile.color === color ? { ...tile, isActive: true } : tile
            )
          );
          setTimeout(() => {
            setTiles((prev) =>
              prev.map((tile) =>
                tile.color === color ? { ...tile, isActive: false } : tile
              )
            );
          }, 200);
        },
        onIncorrectInput: () => {
          // Handle incorrect
          setStreak(0);
          setShowError(true);
          setSuccessMessage('Almost! Try again');
          setIsUserTurn(false);

          // Replay sequence
          setTimeout(() => {
            setShowError(false);
            playSequence(currentSequence, round);
          }, 2000);
        },
        onSequenceComplete: (success) => {
          if (success) {
            handleRoundComplete();
          }
        },
      });
    },
    [inputController, currentSequence, round, playSequence]
  );

  // Handle tile click
  const handleTileClick = useCallback(
    (color: PatternColor) => {
      if (!isUserTurn || isPlayingSequence) return;
      inputController.handleInput(color);
    },
    [isUserTurn, isPlayingSequence, inputController]
  );

  // Handle round complete
  const handleRoundComplete = useCallback(() => {
    setIsUserTurn(false);
    const newScore = score + (round * 10) + (streak * 5);
    const newStreak = streak + 1;
    setScore(newScore);
    setStreak(newStreak);
    setHighScore((prev) => Math.max(prev, newScore));

    // Show success message
    setSuccessMessage(
      newStreak >= 5
        ? `🔥 ${newStreak} in a row! Unstoppable!`
        : `Great job! Round ${round} complete!`
    );
    setShowSuccess(true);

    // Next round
    setTimeout(() => {
      setShowSuccess(false);
      const nextRound = round + 1;
      const extendedSequence = generator.extendSequence(currentSequence, nextRound);
      setCurrentSequence(extendedSequence.colors);
      setRound(nextRound);
      playSequence(extendedSequence.colors, nextRound);
    }, 2000);
  }, [score, streak, round, currentSequence, generator, playSequence]);

  // Handle hint
  const handleHint = useCallback(() => {
    if (!isUserTurn) return;
    const nextColor = inputController.getNextExpectedColor();
    if (nextColor) {
      setHintsUsed((prev) => prev + 1);
      // Flash the correct tile
      setTiles((prev) =>
        prev.map((tile) =>
          tile.color === nextColor ? { ...tile, isActive: true } : tile
        )
      );
      setTimeout(() => {
        setTiles((prev) =>
          prev.map((tile) =>
            tile.color === nextColor ? { ...tile, isActive: false } : tile
          )
        );
      }, 1000);
    }
  }, [isUserTurn, inputController]);

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-100 to-blue-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8">
          <h1 className="text-4xl font-bold text-center mb-6 text-purple-600">
            Pattern Memory Game
          </h1>
          <div className="text-center mb-8">
            <p className="text-xl text-gray-700 mb-4">
              Watch the pattern, then repeat it!
            </p>
            <p className="text-gray-600">
              The pattern gets longer each round. How far can you go?
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <button
              onClick={startGame}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-6 px-8 rounded-2xl shadow-lg transition-all duration-200 hover:scale-105 text-2xl"
              type="button"
            >
              Start Game
            </button>
            <button
              onClick={() => router.push('/game')}
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-4 px-8 rounded-2xl transition-all duration-200"
              type="button"
            >
              Back to Game Selection
            </button>
          </div>
        </div>
      </div>
    );
  }

  const hintsRemaining = difficultyManager.getRemainingHints(hintsUsed);
  const nextColor = isUserTurn ? inputController.getNextExpectedColor() : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4 text-center">
          <h1 className="text-3xl font-bold text-purple-600 mb-2">Pattern Memory</h1>
          <p className="text-gray-700">
            {isPlayingSequence
              ? 'Watch carefully...'
              : isUserTurn
              ? 'Your turn! Repeat the pattern'
              : 'Get ready...'}
          </p>
        </div>

        <PatternHUD
          round={round}
          score={score}
          highScore={highScore}
          streak={streak}
          hintsRemaining={hintsRemaining}
        />

        <PatternBoard
          tiles={tiles}
          onTileClick={handleTileClick}
          disabled={!isUserTurn}
          sensoryProfile={sensoryProfile}
          tileCount={difficultyManager.getTileCount()}
        />

        <PatternHintButton
          onClick={handleHint}
          disabled={!isUserTurn}
          hintsRemaining={hintsRemaining}
          nextColor={nextColor ?? undefined}
        />

        <div className="mt-4 text-center">
          <button
            onClick={() => router.push('/game')}
            className="text-gray-600 hover:text-gray-800 underline"
            type="button"
          >
            Exit Game
          </button>
        </div>
      </div>

      <PatternSuccessAnimation
        show={showSuccess}
        message={successMessage}
        onComplete={() => setShowSuccess(false)}
      />

      <PatternSuccessAnimation
        show={showError}
        message={successMessage}
        isError
        onComplete={() => setShowError(false)}
      />
    </div>
  );
}
