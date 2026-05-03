'use client';

import React from 'react';
import { PatternColor } from '@/core/types';

interface PatternHintButtonProps {
  onClick: () => void;
  disabled: boolean;
  hintsRemaining: number;
  nextColor?: PatternColor;
}

export function PatternHintButton({
  onClick,
  disabled,
  hintsRemaining,
  nextColor,
}: PatternHintButtonProps) {
  const isUnlimited = hintsRemaining === 999;

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <button
        onClick={onClick}
        disabled={disabled || hintsRemaining === 0}
        className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
        type="button"
      >
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl">💡</span>
          <span>
            {disabled
              ? 'Watch first!'
              : hintsRemaining === 0
              ? 'No hints left'
              : isUnlimited
              ? 'Get Hint'
              : `Get Hint (${hintsRemaining} left)`}
          </span>
        </div>
        {nextColor && !disabled && hintsRemaining > 0 && (
          <div className="mt-2 text-sm">
            Next color: <span className="font-bold capitalize">{nextColor}</span>
          </div>
        )}
      </button>
    </div>
  );
}
