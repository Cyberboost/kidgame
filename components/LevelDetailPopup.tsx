'use client';

import React from 'react';
import { LevelConfig, getZoneName } from '@/core/levelConfig';

interface LevelDetailPopupProps {
  level: LevelConfig;
  stars: number;
  maxStars: number;
  onPlay: () => void;
  onClose: () => void;
}

export default function LevelDetailPopup({
  level,
  stars,
  maxStars,
  onPlay,
  onClose,
}: LevelDetailPopupProps) {
  const zoneName = getZoneName(level.zone);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Popup Card */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 p-6 max-w-2xl mx-auto"
        style={{
          animation: 'slide-up-bounce 0.5s ease-out',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Level Info */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-2">{level.id}</div>
          <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
            {level.name}
          </h2>
          <div className="text-lg text-gray-600 mb-4">{zoneName}</div>

          {/* Star Rating */}
          <div className="flex justify-center items-center gap-2 mb-4">
            {Array.from({ length: maxStars }).map((_, i) => (
              <span
                key={i}
                className={`text-3xl ${i < stars ? 'opacity-100' : 'opacity-20'}`}
              >
                ⭐
              </span>
            ))}
          </div>

          {/* Level Details */}
          <div className="flex justify-center gap-6 text-sm text-gray-700 mb-6">
            <div className="flex items-center gap-1">
              <span className="text-xl">📚</span>
              <span>Grade: {level.grade}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xl">🎯</span>
              <span>{level.wordCount} words</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 px-6 rounded-xl font-bold text-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
          <button
            onClick={onPlay}
            className="flex-1 py-4 px-6 rounded-xl font-extrabold text-xl bg-gradient-to-b from-green-400 to-green-600 text-white hover:from-green-500 hover:to-green-700 transition-all shadow-lg hover:shadow-xl border-b-4 border-green-700"
          >
            PLAY! 🐰
          </button>
        </div>
      </div>
    </>
  );
}
