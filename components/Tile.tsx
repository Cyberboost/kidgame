'use client';

import { TileState } from '@/core/types';

interface TileProps {
  tile: TileState;
  onClick: () => void;
  disabled?: boolean;
  wobble?: boolean;
  tileStyles: {
    tileNormal: string;
    tileSelected: string;
    tileCleared: string;
    tileLocked: string;
  };
}

export default function Tile({ tile, onClick, disabled, wobble, tileStyles }: TileProps) {
  const getTileStyle = () => {
    if (tile.cleared) return tileStyles.tileCleared;
    if (tile.locked) return tileStyles.tileLocked;
    if (tile.selected) return tileStyles.tileSelected;
    return tileStyles.tileNormal;
  };

  const isClickable = !tile.cleared && !tile.locked && !disabled;

  return (
    <div className="relative">
      {/* Bush base - only show for non-cleared tiles */}
      {!tile.cleared && (
        <div 
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-full h-3 bg-green-400 rounded-full opacity-60 blur-sm"
          aria-hidden="true"
        />
      )}
      
      {/* Letter tile */}
      <button
        onClick={onClick}
        disabled={!isClickable}
        aria-label={`Letter ${tile.letter}${tile.cleared ? ' - cleared' : ''}${tile.selected ? ' - selected' : ''}`}
        className={`
          aspect-square rounded-lg border-2 font-bold text-2xl sm:text-3xl
          transition-all duration-200 transform relative
          ${getTileStyle()}
          ${isClickable ? 'hover:scale-105 active:scale-95 cursor-pointer' : 'cursor-not-allowed'}
          ${tile.selected ? 'scale-105' : ''}
          ${wobble ? 'tile-wobble' : ''}
          flex items-center justify-center
          shadow-md
        `}
      >
        {tile.letter}
        {tile.hasBunnyTrap && !tile.cleared && (
          <span className="absolute top-0 right-0 text-xs">🐰</span>
        )}
      </button>
      
      {/* Bush leaves decoration - only for non-cleared tiles */}
      {!tile.cleared && (
        <div 
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs opacity-70"
          aria-hidden="true"
        >
          🌿
        </div>
      )}
    </div>
  );
}
