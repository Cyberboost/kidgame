'use client';

import React from 'react';

interface PatternHUDProps {
  round: number;
  score: number;
  highScore: number;
  streak: number;
  hintsRemaining: number;
  focusPercentage?: number;
}

export function PatternHUD({
  round,
  score,
  highScore,
  streak,
  hintsRemaining,
  focusPercentage,
}: PatternHUDProps) {
  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          {/* Round */}
          <div>
            <div className="text-sm text-gray-600 font-medium">Round</div>
            <div className="text-3xl font-bold text-gray-900">{round}</div>
          </div>

          {/* Score */}
          <div>
            <div className="text-sm text-gray-600 font-medium">Score</div>
            <div className="text-3xl font-bold text-blue-600">{score}</div>
            {highScore > 0 && (
              <div className="text-xs text-gray-500">Best: {highScore}</div>
            )}
          </div>

          {/* Streak */}
          <div>
            <div className="text-sm text-gray-600 font-medium">Streak</div>
            <div className="text-3xl font-bold text-orange-600">
              {streak > 0 ? `🔥 ${streak}` : streak}
            </div>
          </div>
        </div>

        {/* Hints */}
        {hintsRemaining !== 999 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600 text-center">
              Hints remaining: <span className="font-bold text-purple-600">{hintsRemaining}</span>
            </div>
          </div>
        )}

        {/* Focus meter (optional) */}
        {focusPercentage !== undefined && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600 mb-2">Focus</div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${focusPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
