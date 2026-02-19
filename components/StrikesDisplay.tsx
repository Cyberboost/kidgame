'use client';

interface StrikesDisplayProps {
  strikes: number;
  maxStrikes: number;
}

export default function StrikesDisplay({ strikes, maxStrikes }: StrikesDisplayProps) {
  return (
    <div className="flex items-center gap-2" aria-label={`${maxStrikes - strikes} attempts remaining`}>
      <span className="text-sm font-semibold text-gray-700">Lives:</span>
      <div className="flex gap-1">
        {Array.from({ length: maxStrikes }).map((_, index) => {
          const isLost = index < strikes;
          return (
            <span
              key={index}
              className={`text-xl transition-all duration-200 ${isLost ? 'opacity-30 grayscale' : ''}`}
              aria-hidden="true"
            >
              {isLost ? '💔' : '❤️'}
            </span>
          );
        })}
      </div>
    </div>
  );
}
