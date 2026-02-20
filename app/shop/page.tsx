'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Profile } from '@/core/types';
import { getProfile } from '@/core/persistence';
import { saveProfileData } from '@/profiles/profileManager';
import { COSTUME_DEFINITIONS, CostumeDefinition } from '@/core/costumeRegistry';
import { spendPoints } from '@/core/starPointsManager';

const RARITY_COLORS: Record<string, string> = {
  common: 'border-gray-400 bg-gray-50',
  rare: 'border-blue-400 bg-blue-50',
  epic: 'border-purple-400 bg-purple-50',
  legendary: 'border-yellow-400 bg-yellow-50',
};

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const profileId = searchParams.get('profile');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!profileId) { router.push('/'); return; }
    getProfile(profileId).then(p => {
      if (!p) { router.push('/'); return; }
      setProfile(p);
    }).finally(() => setLoading(false));
  }, [profileId, router]);

  const handleBuy = async (costume: CostumeDefinition) => {
    if (!profile) return;
    if (profile.unlockedCostumes.includes(costume.id)) {
      // Equip it
      profile.equippedCostume = costume.id;
      await saveProfileData(profile);
      setProfile({ ...profile });
      setMessage(`Equipped ${costume.name}!`);
    } else {
      const ok = spendPoints(profile, costume.cost);
      if (!ok) { setMessage('Not enough ⭐ Star Points!'); return; }
      profile.unlockedCostumes.push(costume.id);
      profile.equippedCostume = costume.id;
      await saveProfileData(profile);
      setProfile({ ...profile });
      setMessage(`Purchased and equipped ${costume.name}!`);
    }
    setTimeout(() => setMessage(''), 2000);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-purple-800">🛍️ Costume Shop</h1>
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold text-yellow-600">⭐ {profile.starPoints}</span>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              ← Back
            </button>
          </div>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 rounded-lg text-center text-green-800 font-semibold">
            {message}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {COSTUME_DEFINITIONS.map(costume => {
            const owned = profile.unlockedCostumes.includes(costume.id);
            const equipped = profile.equippedCostume === costume.id;
            return (
              <div
                key={costume.id}
                className={`rounded-xl border-2 p-4 shadow flex flex-col items-center gap-2 ${RARITY_COLORS[costume.rarity]}`}
              >
                <div className="text-4xl">{costume.emoji}</div>
                <div className="font-bold text-center text-sm">{costume.name}</div>
                <div className="text-xs text-center text-gray-600">{costume.description}</div>
                <div className="text-xs font-semibold capitalize text-purple-700">{costume.rarity}</div>
                {equipped ? (
                  <span className="px-3 py-1 bg-green-500 text-white text-xs rounded-full font-bold">✓ Equipped</span>
                ) : owned ? (
                  <button
                    onClick={() => handleBuy(costume)}
                    className="px-3 py-1 bg-blue-500 text-white text-xs rounded-full hover:bg-blue-600 font-bold"
                  >
                    Equip
                  </button>
                ) : (
                  <button
                    onClick={() => handleBuy(costume)}
                    className={`px-3 py-1 text-white text-xs rounded-full font-bold ${
                      profile.starPoints >= costume.cost
                        ? 'bg-purple-600 hover:bg-purple-700'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                    disabled={profile.starPoints < costume.cost}
                  >
                    {costume.cost === 0 ? 'Free' : `⭐ ${costume.cost}`}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}
