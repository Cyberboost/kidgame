'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Profile } from '@/core/types';
import { getProfile } from '@/core/persistence';
import { ACHIEVEMENT_DEFINITIONS } from '@/core/achievementDefinitions';
import { COSTUME_MAP } from '@/core/costumeRegistry';

function ProfileContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const profileId = searchParams.get('id');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profileId) { router.push('/'); return; }
    getProfile(profileId).then(p => {
      if (!p) { router.push('/'); return; }
      setProfile(p);
    }).finally(() => setLoading(false));
  }, [profileId, router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl">Loading...</div>;
  if (!profile) return null;

  const unlockedCount = ACHIEVEMENT_DEFINITIONS.filter(a => profile.achievements[a.id]?.unlocked).length;
  const equippedCostume = profile.equippedCostume
    ? COSTUME_MAP[profile.equippedCostume]
    : null;

  const skinColors: Record<string, string> = {
    light: '#FDDBB4', 'medium-light': '#F0C27F', medium: '#C68642',
    tan: '#A0522D', brown: '#7B4F2E', dark: '#4A2C17',
    blue: '#4FC3F7', green: '#66BB6A', purple: '#AB47BC',
    pink: '#F48FB1', golden: '#FFD54F', silver: '#B0BEC5',
  };
  const skinBg = skinColors[profile.characterCustomization?.skinTone ?? 'medium'] ?? '#C68642';

  // Streak flame color
  const streakColor =
    profile.dailyStreak >= 30 ? 'text-yellow-500' :
    profile.dailyStreak >= 7  ? 'text-orange-500' :
    profile.dailyStreak >= 3  ? 'text-red-500'    : 'text-gray-500';

  const navTo = (path: string) => router.push(`${path}?profile=${profileId}`);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-purple-100 p-6">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-indigo-800">👤 Profile</h1>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Home
          </button>
        </div>

        {/* Identity card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-6">
          {/* Avatar */}
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-4xl border-4 border-indigo-300 shadow-md flex-shrink-0"
            style={{ backgroundColor: skinBg }}
          >
            {equippedCostume?.emoji ?? '👗'}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="text-2xl font-bold text-gray-800 truncate">{profile.nickname}</div>
            <div className="text-sm text-gray-500">Grade {profile.defaultGrade} · {profile.preferredDifficulty ?? 'Auto'} difficulty</div>

            <div className="flex flex-wrap gap-4 mt-3">
              <div className="text-center">
                <div className="text-xl font-bold text-yellow-500">⭐ {profile.starPoints.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Star Points</div>
              </div>
              <div className="text-center">
                <div className={`text-xl font-bold ${streakColor}`}>🔥 {profile.dailyStreak}</div>
                <div className="text-xs text-gray-500">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-500">📝 {profile.stats.totalWordsSpelled}</div>
                <div className="text-xs text-gray-500">Words Spelled</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-500">🐰 {profile.stats.totalBunniesRescued}</div>
                <div className="text-xs text-gray-500">Bunnies Rescued</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl shadow p-4">
            <div className="text-sm text-gray-500 mb-1">Best Word Streak</div>
            <div className="text-2xl font-bold text-purple-600">🏆 {profile.stats.bestStreak}</div>
          </div>
          <div className="bg-white rounded-2xl shadow p-4">
            <div className="text-sm text-gray-500 mb-1">Achievements</div>
            <div className="text-2xl font-bold text-orange-500">🏅 {unlockedCount}/{ACHIEVEMENT_DEFINITIONS.length}</div>
          </div>
          <div className="bg-white rounded-2xl shadow p-4">
            <div className="text-sm text-gray-500 mb-1">Costumes Owned</div>
            <div className="text-2xl font-bold text-pink-500">👗 {profile.unlockedCostumes.length}</div>
          </div>
          <div className="bg-white rounded-2xl shadow p-4">
            <div className="text-sm text-gray-500 mb-1">Total ⭐ Earned</div>
            <div className="text-2xl font-bold text-yellow-600">⭐ {profile.totalStarPointsEarned.toLocaleString()}</div>
          </div>
        </div>

        {/* Equipped costume */}
        {equippedCostume && (
          <div className="bg-white rounded-2xl shadow p-4 flex items-center gap-4">
            <span className="text-4xl">{equippedCostume.emoji}</span>
            <div>
              <div className="font-bold text-gray-700">Equipped: {equippedCostume.name}</div>
              <div className="text-sm text-gray-500 capitalize">{equippedCostume.rarity} rarity</div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <NavButton
            emoji="🎮"
            label="Play Platformer"
            color="bg-purple-600 hover:bg-purple-700"
            onClick={() => router.push(`/game?profile=${profileId}&mode=platformer`)}
          />
          <NavButton
            emoji="🃏"
            label="Word Game"
            color="bg-blue-600 hover:bg-blue-700"
            onClick={() => router.push(`/game?profile=${profileId}`)}
          />
          <NavButton
            emoji="🛍️"
            label="Costume Shop"
            color="bg-pink-600 hover:bg-pink-700"
            onClick={() => navTo('/shop')}
          />
          <NavButton
            emoji="🏆"
            label="Achievements"
            color="bg-orange-600 hover:bg-orange-700"
            onClick={() => navTo('/achievements')}
          />
          <NavButton
            emoji="🎨"
            label="Customize"
            color="bg-cyan-600 hover:bg-cyan-700"
            onClick={() => navTo('/customize')}
          />
          <NavButton
            emoji="📊"
            label="Stats"
            color="bg-green-600 hover:bg-green-700"
            onClick={() => { /* stats are shown inline above */ }}
            disabled
          />
        </div>

        {/* Recent achievements */}
        {unlockedCount > 0 && (
          <div className="bg-white rounded-2xl shadow p-5">
            <h2 className="font-bold text-gray-700 mb-3">Recent Achievements</h2>
            <div className="flex flex-wrap gap-3">
              {ACHIEVEMENT_DEFINITIONS.filter(a => profile.achievements[a.id]?.unlocked)
                .slice(-6)
                .map(a => (
                  <div key={a.id} className="flex items-center gap-1 bg-yellow-50 border border-yellow-300 rounded-full px-3 py-1 text-sm">
                    <span>{a.icon}</span>
                    <span className="font-semibold text-gray-700">{a.name}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function NavButton({
  emoji, label, color, onClick, disabled,
}: {
  emoji: string;
  label: string;
  color: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-3 px-4 py-4 rounded-xl text-white font-bold transition-colors ${color} ${
        disabled ? 'opacity-40 cursor-not-allowed' : ''
      }`}
    >
      <span className="text-2xl">{emoji}</span>
      <span>{label}</span>
    </button>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xl">Loading...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
