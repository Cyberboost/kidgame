'use client';

import React from 'react';

export interface LevelNodeProps {
  level: number;
  state: 'locked' | 'available' | 'completed';
  stars: number; // 0-3
  position: { x: number; y: number }; // percentage-based position on map
  isCurrent: boolean;
  onClick: () => void;
}

export default function LevelNode({
  level,
  state,
  stars,
  position,
  isCurrent,
  onClick,
}: LevelNodeProps) {
  const isLocked = state === 'locked';
  const isAvailable = state === 'available';
  const isCompleted = state === 'completed';

  return (
    <div
      className="absolute"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Level Node Button */}
      <button
        onClick={onClick}
        disabled={isLocked}
        aria-label={`Level ${level} - ${state}`}
        aria-disabled={isLocked}
        className={`
          relative w-20 h-20 rounded-full font-extrabold text-2xl
          border-4 shadow-lg transition-all duration-300
          ${isLocked ? 'bg-gray-400 border-gray-600 text-gray-600 cursor-not-allowed opacity-60' : ''}
          ${isAvailable ? 'bg-gradient-to-b from-yellow-300 to-yellow-500 border-yellow-600 text-white hover:scale-110' : ''}
          ${isCompleted ? 'bg-gradient-to-b from-green-300 to-green-500 border-green-600 text-white hover:scale-105' : ''}
          ${isCurrent && isAvailable ? 'animate-[level-pulse_2s_infinite]' : ''}
        `}
        style={{
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Glossy shine effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/40 to-transparent opacity-50" />
        
        {/* Lock icon for locked levels */}
        {isLocked && (
          <span className="relative z-10 text-3xl">🔒</span>
        )}

        {/* Level number */}
        {!isLocked && (
          <span className="relative z-10">{level}</span>
        )}
      </button>

      {/* Stars for completed levels */}
      {isCompleted && stars > 0 && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-0.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <span
              key={i}
              className={`text-xl ${i < stars ? 'opacity-100' : 'opacity-20'}`}
            >
              ⭐
            </span>
          ))}
        </div>
      )}

      {/* Bunny character on current level */}
      {isCurrent && isAvailable && (
        <div
          className="absolute -top-8 left-1/2 -translate-x-1/2 text-4xl"
          style={{
            animation: 'bunny-hop 2s infinite ease-in-out',
          }}
        >
          🐰
        </div>
      )}

      {/* Sparkle effect for available levels */}
      {isAvailable && !isCurrent && (
        <div className="absolute -inset-2 pointer-events-none">
          <div className="absolute top-0 right-0 text-yellow-300 animate-[star-twinkle_1.5s_infinite]">✨</div>
        </div>
      )}
    </div>
  );
}
