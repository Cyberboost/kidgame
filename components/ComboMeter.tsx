'use client';
import { getComboLabel } from '@/core/starPointsManager';

interface ComboMeterProps {
  combo: number;
  multiplier: number;
}

export default function ComboMeter({ combo, multiplier }: ComboMeterProps) {
  if (combo < 2) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-orange-500 rounded-full shadow text-white font-bold">
      <span className="text-sm">{getComboLabel(combo)}</span>
      <span className="text-lg">{combo}x</span>
      {multiplier > 1 && (
        <span className="text-xs bg-orange-700 px-1 rounded">{multiplier}x pts</span>
      )}
    </div>
  );
}
