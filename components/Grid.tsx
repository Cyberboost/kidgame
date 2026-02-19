'use client';

import { TileState } from '@/core/types';
import Tile from './Tile';

interface GridProps {
  board: TileState[][];
  onTileClick: (row: number, col: number) => void;
  disabled?: boolean;
  tileStyles: {
    tileNormal: string;
    tileSelected: string;
    tileCleared: string;
    tileLocked: string;
  };
}

export default function Grid({ board, onTileClick, disabled, tileStyles }: GridProps) {
  const gridSize = board.length;
  
  // Calculate grid template columns based on size
  const gridCols = {
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    7: 'grid-cols-7',
    8: 'grid-cols-8',
  }[gridSize] || 'grid-cols-5';

  return (
    <div 
      className={`grid ${gridCols} gap-2 sm:gap-3 p-4 max-w-2xl mx-auto`}
      role="grid"
      aria-label="Letter grid"
    >
      {board.map((row, rowIndex) =>
        row.map((tile, colIndex) => (
          <Tile
            key={`${rowIndex}-${colIndex}`}
            tile={tile}
            onClick={() => onTileClick(rowIndex, colIndex)}
            disabled={disabled}
            tileStyles={tileStyles}
          />
        ))
      )}
    </div>
  );
}
