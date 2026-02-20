'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { Profile, GameSettings } from '@/core/types';
import type { GameScene as GameSceneType } from './scenes/GameScene';

interface SpellingChallenge {
  collectedLetters: string[];
  targetWord: string;
  checkpoint: { x: number; y: number; wordIndex: number };
}

interface PhaserGameProps {
  profile: Profile;
  targetWord: string;
  settings: GameSettings;
  onLevelComplete: (stats: { wordsSpelled: number; bunniesRescued: number }) => void;
  onBack: () => void;
}

export default function PhaserGame({
  profile,
  targetWord,
  settings,
  onLevelComplete,
  onBack,
}: PhaserGameProps) {
  const gameRef = useRef<import('phaser').Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const gameSceneRef = useRef<GameSceneType | null>(null);

  const [spellingChallenge, setSpellingChallenge] = useState<SpellingChallenge | null>(null);
  const [spellingInput, setSpellingInput] = useState('');
  const [spellingMessage, setSpellingMessage] = useState('');
  const [levelDone, setLevelDone] = useState(false);
  const [levelStats, setLevelStats] = useState<{ wordsSpelled: number; bunniesRescued: number } | null>(null);
  const [collectedLetters, setCollectedLetters] = useState<string[]>([]);
  const [bunniesRescued, setBunniesRescued] = useState(0);

  const speakWord = useCallback((word: string) => {
    if (settings.speechEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utt = new SpeechSynthesisUtterance(word);
      utt.rate = 0.85;
      window.speechSynthesis.speak(utt);
    }
  }, [settings.speechEnabled]);

  useEffect(() => {
    if (typeof window === 'undefined' || gameRef.current || !containerRef.current) return;

    let game: import('phaser').Game;

    (async () => {
      const Phaser = (await import('phaser')).default;
      const { GameScene } = await import('./scenes/GameScene');
      const { UIScene } = await import('./scenes/UIScene');

      const config: import('phaser').Types.Core.GameConfig = {
        type: Phaser.AUTO,
        parent: containerRef.current!,
        width: 800,
        height: 530,
        backgroundColor: '#87ceeb',
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { x: 0, y: 0 },
            debug: false,
          },
        },
        scene: [GameScene, UIScene],
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
      };

      game = new Phaser.Game(config);
      gameRef.current = game;

      game.events.once('ready', () => {
        const sceneData = { targetWord: targetWord.toUpperCase(), profileId: profile.id };
        game.scene.start('GameScene', sceneData);
        game.scene.start('UIScene', { targetWord: targetWord.toUpperCase() });

        const gs = game.scene.getScene('GameScene') as GameSceneType;
        gameSceneRef.current = gs;

        gs.events.on('letterCollected', (_letter: string, collected: string[]) => {
          setCollectedLetters([...collected]);
        });

        gs.events.on('checkpointReached', (
          checkpoint: { x: number; y: number; wordIndex: number },
          collected: string[],
          word: string
        ) => {
          setSpellingChallenge({ collectedLetters: collected, targetWord: word, checkpoint });
          setSpellingInput(collected.join(''));
          setSpellingMessage('');
          speakWord(word);
        });

        gs.events.on('bunnyFreed', (_name: string, count: number) => {
          setBunniesRescued(count);
        });

        gs.events.on('levelComplete', (stats: { wordsSpelled: number; bunniesRescued: number }) => {
          setLevelDone(true);
          setLevelStats(stats);
          onLevelComplete(stats);
        });
      });
    })();

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSpellingSubmit = () => {
    const input = spellingInput.trim().toUpperCase();
    const target = (spellingChallenge?.targetWord || '').toUpperCase();
    if (input === target) {
      setSpellingMessage('✅ Correct! Bunny rescued!');
      gameSceneRef.current?.events.emit('spellingResult', true);
      setTimeout(() => {
        setSpellingChallenge(null);
        setSpellingInput('');
        setSpellingMessage('');
      }, 1500);
    } else {
      setSpellingMessage(`❌ Not quite! The word is "${target}". Try again!`);
      speakWord(target);
    }
  };

  // Touch controls
  const emitTouch = (event: string, active: boolean) => {
    gameSceneRef.current?.events.emit(event, active);
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gradient-to-b from-sky-300 to-green-300 select-none">
      {/* HUD bar above game canvas */}
      <div className="w-full max-w-[800px] bg-black bg-opacity-50 text-white flex items-center justify-between px-4 py-2 text-sm font-bold">
        <button onClick={onBack} className="text-white hover:text-yellow-300 mr-4">← Back</button>
        <div>
          Spell: <span className="text-yellow-300 text-lg">{targetWord.toUpperCase()}</span>
        </div>
        <div>
          Got: <span className="text-white tracking-widest">
            {collectedLetters.join('')}
            <span className="text-gray-400">{' _'.repeat(Math.max(0, targetWord.length - collectedLetters.length))}</span>
          </span>
        </div>
        <div>🐰 {bunniesRescued}</div>
      </div>

      {/* Phaser canvas container */}
      <div
        ref={containerRef}
        className="w-full max-w-[800px]"
        style={{ aspectRatio: '800/530' }}
      />

      {/* Mobile touch controls */}
      <div className="w-full max-w-[800px] flex justify-between items-center px-6 py-3 bg-black bg-opacity-30">
        <div className="flex gap-2">
          <button
            className="bg-white bg-opacity-30 text-white font-bold text-2xl rounded-full w-14 h-14 flex items-center justify-center active:bg-opacity-60 touch-none"
            onPointerDown={() => emitTouch('touchLeft', true)}
            onPointerUp={() => emitTouch('touchLeft', false)}
            onPointerLeave={() => emitTouch('touchLeft', false)}
            aria-label="Move left"
          >◀</button>
          <button
            className="bg-white bg-opacity-30 text-white font-bold text-2xl rounded-full w-14 h-14 flex items-center justify-center active:bg-opacity-60 touch-none"
            onPointerDown={() => emitTouch('touchRight', true)}
            onPointerUp={() => emitTouch('touchRight', false)}
            onPointerLeave={() => emitTouch('touchRight', false)}
            aria-label="Move right"
          >▶</button>
        </div>
        <button
          className="bg-yellow-400 bg-opacity-80 text-gray-900 font-bold text-lg rounded-full w-16 h-16 flex items-center justify-center active:bg-opacity-100 shadow-lg touch-none"
          onPointerDown={() => emitTouch('touchJump', true)}
          onPointerUp={() => emitTouch('touchJump', false)}
          onPointerLeave={() => emitTouch('touchJump', false)}
          aria-label="Jump"
        >JUMP</button>
      </div>

      {/* Spelling challenge modal */}
      {spellingChallenge && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center">
            <div className="text-2xl font-bold text-gray-800 mb-2">🏁 Spelling Checkpoint!</div>
            <p className="text-gray-600 mb-4">
              You collected: <span className="font-bold text-blue-600">{spellingChallenge.collectedLetters.join(' ')}</span>
            </p>
            <p className="text-gray-700 mb-2">Arrange them to spell the word:</p>
            <div className="text-3xl font-bold text-purple-700 mb-4 tracking-widest">
              {spellingChallenge.targetWord}
            </div>
            <input
              type="text"
              value={spellingInput}
              onChange={(e) => setSpellingInput(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && handleSpellingSubmit()}
              className="border-2 border-purple-400 rounded-lg px-4 py-2 text-xl text-center w-full mb-3 tracking-widest font-bold uppercase"
              placeholder="Type the word..."
              autoFocus
              aria-label="Spell the word"
            />
            {spellingMessage && (
              <div className={`mb-3 font-semibold ${spellingMessage.startsWith('✅') ? 'text-green-600' : 'text-red-500'}`}>
                {spellingMessage}
              </div>
            )}
            <button
              onClick={handleSpellingSubmit}
              className="bg-purple-600 text-white font-bold py-2 px-6 rounded-full text-lg hover:bg-purple-700 active:scale-95 transition"
            >
              Submit ✓
            </button>
            <button
              onClick={() => speakWord(spellingChallenge.targetWord)}
              className="ml-3 bg-blue-100 text-blue-700 font-bold py-2 px-4 rounded-full text-lg hover:bg-blue-200"
              aria-label="Hear the word"
            >
              🔊
            </button>
          </div>
        </div>
      )}

      {/* Level complete overlay */}
      {levelDone && levelStats && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="text-4xl mb-2">🏆</div>
            <div className="text-2xl font-bold text-gray-800 mb-4">Level Complete!</div>
            <div className="text-gray-700 mb-2">Words spelled: <strong>{levelStats.wordsSpelled}</strong></div>
            <div className="text-gray-700 mb-6">Bunnies rescued: <strong>{levelStats.bunniesRescued}</strong></div>
            <button
              onClick={onBack}
              className="bg-green-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-green-600 active:scale-95 transition"
            >
              Continue 🌟
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
