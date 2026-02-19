'use client';

interface HeaderProps {
  themeName: string;
  bunniesRemaining: number;
  totalBunnies: number;
  reviewBasketCount: number;
  streak: number;
  onSettings: () => void;
}

export default function Header({
  themeName,
  bunniesRemaining,
  totalBunnies,
  reviewBasketCount,
  streak,
  onSettings,
}: HeaderProps) {
  return (
    <header className="bg-white shadow-md p-4 mb-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold text-gray-800">
            🐰 Save the Bunnies
          </h1>
          <button
            onClick={onSettings}
            aria-label="Settings"
            className="bg-gray-200 hover:bg-gray-300 rounded-full p-2 transition-colors"
          >
            <span className="text-2xl">⚙️</span>
          </button>
        </div>

        <div className="flex gap-4 flex-wrap text-sm">
          <div className="flex items-center gap-2 bg-grass-100 px-3 py-2 rounded-lg">
            <span className="font-semibold">Theme:</span>
            <span>{themeName}</span>
          </div>
          
          <div className="flex items-center gap-2 bg-bunny-100 px-3 py-2 rounded-lg">
            <span className="text-lg">🐰</span>
            <span className="font-semibold">Bunnies:</span>
            <span>{bunniesRemaining} / {totalBunnies}</span>
          </div>

          {reviewBasketCount > 0 && (
            <div className="flex items-center gap-2 bg-yellow-100 px-3 py-2 rounded-lg">
              <span className="text-lg">📝</span>
              <span className="font-semibold">Review:</span>
              <span>{reviewBasketCount}</span>
            </div>
          )}

          {streak > 0 && (
            <div className="flex items-center gap-2 bg-green-100 px-3 py-2 rounded-lg">
              <span className="text-lg">🔥</span>
              <span className="font-semibold">Streak:</span>
              <span>{streak}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
