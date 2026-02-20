'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Profile } from '@/core/types';
import { getProfile } from '@/core/persistence';
import { ACHIEVEMENT_DEFINITIONS } from '@/core/achievementDefinitions';

const CATEGORY_COLORS: Record<string, string> = {
  gameplay: 'bg-blue-100 border-blue-400',
  collection: 'bg-green-100 border-green-400',
  streak: 'bg-orange-100 border-orange-400',
  fashion: 'bg-pink-100 border-pink-400',
  special: 'bg-purple-100 border-purple-400',
};

function AchievementsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const profileId = searchParams.get('profile');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    if (!profileId) { router.push('/'); return; }
    getProfile(profileId).then(p => {
      if (!p) { router.push('/'); return; }
      setProfile(p);
    }).finally(() => setLoading(false));
  }, [profileId, router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!profile) return null;

  const categories = ['all', 'gameplay', 'collection', 'streak', 'fashion', 'special'];
  const filtered = filter === 'all'
    ? ACHIEVEMENT_DEFINITIONS
    : ACHIEVEMENT_DEFINITIONS.filter(a => a.category === filter);

  const unlocked = ACHIEVEMENT_DEFINITIONS.filter(a => profile.achievements[a.id]?.unlocked).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-orange-800">🏆 Achievements</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-gray-600">
              {unlocked}/{ACHIEVEMENT_DEFINITIONS.length} unlocked
            </span>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              ← Back
            </button>
          </div>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded-full text-sm font-semibold capitalize border transition-colors ${
                filter === cat
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-orange-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(achievement => {
            const data = profile.achievements[achievement.id];
            const isUnlocked = data?.unlocked ?? false;
            const progress = data?.progress ?? 0;
            const pct = Math.min(100, Math.round((progress / achievement.threshold) * 100));

            return (
              <div
                key={achievement.id}
                className={`rounded-xl border-2 p-4 shadow flex flex-col items-center gap-2 transition-opacity ${
                  CATEGORY_COLORS[achievement.category]
                } ${isUnlocked ? '' : 'opacity-60'}`}
              >
                <div className={`text-3xl ${isUnlocked ? '' : 'grayscale'}`}>
                  {achievement.icon}
                </div>
                <div className="font-bold text-sm text-center">{achievement.name}</div>
                <div className="text-xs text-center text-gray-600">{achievement.description}</div>
                {isUnlocked ? (
                  <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full font-bold">
                    ✓ Unlocked
                  </span>
                ) : (
                  <div className="w-full">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="text-xs text-center text-gray-500 mt-1">
                      {progress}/{achievement.threshold}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function AchievementsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AchievementsContent />
    </Suspense>
  );
}
