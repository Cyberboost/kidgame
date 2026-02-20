'use client';
import { useEffect, useRef } from 'react';
import type { Profile } from '@/core/types';

interface PhaserGameProps {
  profile: Profile;
  onGameComplete: (starPointsEarned: number) => void;
  onBack: () => void;
}

// Minimal interface for the Phaser.Game instance we need at cleanup time
interface PhaserGameInstance {
  destroy: (removeCanvas: boolean) => void;
  events: { once: (event: string, callback: () => void) => void };
  scene: { start: (key: string, data: unknown) => void };
}

export default function PhaserGame({ profile, onGameComplete, onBack }: PhaserGameProps) {
  const gameRef = useRef<PhaserGameInstance | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initGame = async () => {
      const Phaser = (await import('phaser')).default;
      const { PreloadScene } = await import('./scenes/PreloadScene');
      const { GameScene } = await import('./scenes/GameScene');
      const { UIScene } = await import('./scenes/UIScene');
      const { LevelCompleteScene } = await import('./scenes/LevelCompleteScene');

      if (gameRef.current) {
        gameRef.current.destroy(true);
      }

      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        parent: 'phaser-game-container',
        width: 800,
        height: 500,
        backgroundColor: '#87CEEB',
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { x: 0, y: 800 },
            debug: false,
          },
        },
        scene: [PreloadScene, GameScene, UIScene, LevelCompleteScene],
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        render: {
          pixelArt: false,
          antialias: true,
        },
      };

      const game = new Phaser.Game(config) as unknown as PhaserGameInstance;
      gameRef.current = game;

      game.events.once('ready', () => {
        game.scene.start('PreloadScene', { profile, onGameComplete, onBack });
      });
    };

    initGame();

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // Intentionally empty: game is initialized once on mount. Prop callbacks are
    // forwarded into the Phaser scene via the scene's init data on first start and
    // are stable references from the parent page, so re-running on every render
    // would cause the game to be destroyed and recreated unnecessarily.
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div id="phaser-game-container" ref={containerRef} className="w-full max-w-4xl" />
      <button
        onClick={onBack}
        className="mt-4 px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
      >
        ← Back to Menu
      </button>
    </div>
  );
}
