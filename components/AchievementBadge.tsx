'use client';

interface AchievementBadgeProps {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  threshold: number;
  unlockedAt?: string;
}

export default function AchievementBadge({
  name,
  description,
  icon,
  unlocked,
  progress,
  threshold,
  unlockedAt,
}: AchievementBadgeProps) {
  const pct = Math.min(100, Math.round((progress / threshold) * 100));

  return (
    <div
      className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 shadow transition-opacity ${
        unlocked ? 'border-yellow-400 bg-yellow-50' : 'border-gray-300 bg-gray-50 opacity-60'
      }`}
    >
      <span className={`text-3xl ${unlocked ? '' : 'grayscale'}`}>{icon}</span>
      <span className="font-bold text-sm text-center">{name}</span>
      <span className="text-xs text-gray-600 text-center">{description}</span>
      {unlocked ? (
        <span className="text-xs text-green-600 font-semibold">
          ✓ {unlockedAt ? new Date(unlockedAt).toLocaleDateString() : 'Unlocked'}
        </span>
      ) : (
        <div className="w-full">
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
          </div>
          <div className="text-xs text-center text-gray-500 mt-0.5">
            {progress}/{threshold}
          </div>
        </div>
      )}
    </div>
  );
}
