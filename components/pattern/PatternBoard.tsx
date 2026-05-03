'use client';

import React from 'react';
import { PatternTile } from './PatternTile';
import { PatternColor, PatternTileState, SensoryProfile } from '@/core/types';

interface PatternBoardProps {
  tiles: PatternTileState[];
  onTileClick: (color: PatternColor) => void;
  disabled: boolean;
  sensoryProfile?: SensoryProfile;
  tileCount: number;
}

export function PatternBoard({
  tiles,
  onTileClick,
  disabled,
  sensoryProfile = 'adventure',
  tileCount,
}: PatternBoardProps) {
  // Arrange tiles in a grid
  const gridClass = tileCount === 4 ? 'grid-cols-2 grid-rows-2' : 'grid-cols-3 grid-rows-2';

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className={`grid ${gridClass} gap-4 aspect-square`}>
        {tiles.map((tile) => (
          <PatternTile
            key={tile.position}
            color={tile.color}
            position={tile.position}
            isActive={tile.isActive}
            isPlaying={tile.isPlaying}
            onClick={onTileClick}
            disabled={disabled}
            sensoryProfile={sensoryProfile}
          />
        ))}
      </div>
    </div>
  );
}
