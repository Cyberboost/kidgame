'use client';

import React from 'react';
import { PatternColor } from '@/core/types';

interface PatternTileProps {
  color: PatternColor;
  position: number;
  isActive: boolean;
  isPlaying: boolean;
  onClick: (color: PatternColor) => void;
  disabled: boolean;
  sensoryProfile?: 'calm' | 'adventure' | 'minimal';
}

export function PatternTile({
  color,
  position,
  isActive,
  isPlaying,
  onClick,
  disabled,
  sensoryProfile = 'adventure',
}: PatternTileProps) {
  const getColorClasses = (): string => {
    const baseClasses = 'w-full h-full rounded-2xl transition-all duration-200';
    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105';

    const colorMap: Record<PatternColor, { normal: string; active: string }> = {
      red: {
        normal: 'bg-red-500',
        active: 'bg-red-300 shadow-2xl shadow-red-500/50 ring-4 ring-red-300',
      },
      blue: {
        normal: 'bg-blue-500',
        active: 'bg-blue-300 shadow-2xl shadow-blue-500/50 ring-4 ring-blue-300',
      },
      green: {
        normal: 'bg-green-500',
        active: 'bg-green-300 shadow-2xl shadow-green-500/50 ring-4 ring-green-300',
      },
      yellow: {
        normal: 'bg-yellow-400',
        active: 'bg-yellow-200 shadow-2xl shadow-yellow-400/50 ring-4 ring-yellow-200',
      },
      purple: {
        normal: 'bg-purple-500',
        active: 'bg-purple-300 shadow-2xl shadow-purple-500/50 ring-4 ring-purple-300',
      },
      orange: {
        normal: 'bg-orange-500',
        active: 'bg-orange-300 shadow-2xl shadow-orange-500/50 ring-4 ring-orange-300',
      },
    };

    const activeState = isActive ? colorMap[color].active : colorMap[color].normal;

    // Adjust animation based on sensory profile
    let animationClass = '';
    if (isActive) {
      if (sensoryProfile === 'calm') {
        animationClass = 'animate-pulse-slow';
      } else if (sensoryProfile === 'adventure') {
        animationClass = 'animate-pulse';
      }
      // minimal has no animation
    }

    return `${baseClasses} ${activeState} ${disabledClasses} ${animationClass}`;
  };

  const handleClick = () => {
    if (!disabled && !isPlaying) {
      onClick(color);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={getColorClasses()}
      aria-label={`${color} tile`}
      type="button"
    >
      <span className="sr-only">{color}</span>
    </button>
  );
}
