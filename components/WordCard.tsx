'use client';

import { useState } from 'react';

interface WordCardProps {
  word: string;
  currentInput: string;
  gardenFocus: number;
  gardenFocusMax: number;
  speechEnabled: boolean;
}

export default function WordCard({
  word,
  currentInput,
  gardenFocus,
  gardenFocusMax,
  speechEnabled,
}: WordCardProps) {
  const [speaking, setSpeaking] = useState(false);

  const speakWord = () => {
    if ('speechSynthesis' in window && speechEnabled) {
      setSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.8;
      utterance.onend = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const progress = (currentInput.length / word.length) * 100;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">Spell this word:</p>
          <h2 className="text-4xl font-bold text-gray-800">{word}</h2>
        </div>
        {speechEnabled && (
          <button
            onClick={speakWord}
            disabled={speaking}
            aria-label="Speak word"
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 transition-colors disabled:opacity-50"
          >
            <span className="text-2xl">{speaking ? '🔊' : '🔉'}</span>
          </button>
        )}
      </div>

      {/* Current input display */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Your spelling:</p>
        <div className="flex gap-2 flex-wrap">
          {currentInput.split('').map((letter, index) => (
            <span
              key={index}
              className="text-2xl font-bold bg-yellow-100 border-2 border-yellow-400 rounded px-3 py-1"
            >
              {letter}
            </span>
          ))}
          {currentInput.length === 0 && (
            <span className="text-xl text-gray-400 italic">
              Select letters from the grid...
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progress</span>
          <span>{currentInput.length} / {word.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-green-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Garden Focus indicator */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">Garden Focus:</span>
        <div className="flex gap-1">
          {Array.from({ length: gardenFocusMax }).map((_, index) => (
            <span
              key={index}
              className={`w-3 h-3 rounded-full ${
                index < gardenFocus ? 'bg-green-500' : 'bg-gray-300'
              }`}
              aria-label={`Focus point ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
