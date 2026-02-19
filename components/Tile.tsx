'use client';

import { TileState } from '@/core/types';

interface TileProps {
  tile: TileState;
  onClick: () => void;
  disabled?: boolean;
  tileStyles: {
    tileNormal: string;
    tileSelected: string;
    tileCleared: string;
    tileLocked: string;
  };
}

export default function Tile({ tile, onClick, disabled, tileStyles }: TileProps) {
  const getTileStyle = () => {
    if (tile.cleared) return tileStyles.tileCleared;
    if (tile.locked) return tileStyles.tileLocked;
    if (tile.selected) return tileStyles.tileSelected;
    return tileStyles.tileNormal;
  };

  const isClickable = !tile.cleared && !tile.locked && !disabled;

  return (
    <button
      onClick={onClick}
      disabled={!isClickable}
      aria-label={`Letter ${tile.letter}${tile.cleared ? ' - cleared' : ''}${tile.selected ? ' - selected' : ''}`}
      className={`
        aspect-square rounded-lg border-2 font-bold text-2xl sm:text-3xl
        transition-all duration-200 transform
        ${getTileStyle()}
        ${isClickable ? 'hover:scale-105 active:scale-95 cursor-pointer' : 'cursor-not-allowed'}
        ${tile.selected ? 'scale-105' : ''}
        flex items-center justify-center relative
        shadow-md
      `}
    >
      {tile.letter}
      {tile.hasBunnyTrap && !tile.cleared && (
        <span className="absolute top-0 right-0 text-xs">🐰</span>
      )}
    </button>
  );
}
