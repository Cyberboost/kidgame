'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Profile } from '@/core/types';
import { getProfile } from '@/core/persistence';
import { saveProfileData } from '@/profiles/profileManager';
import { progressAchievement } from '@/core/starPointsManager';

// ─── Data ─────────────────────────────────────────────────────────────────────

const SKIN_TONES = [
  { id: 'light', label: 'Light', color: '#FDDBB4' },
  { id: 'medium-light', label: 'Medium Light', color: '#F0C27F' },
  { id: 'medium', label: 'Medium', color: '#C68642' },
  { id: 'tan', label: 'Tan', color: '#A0522D' },
  { id: 'brown', label: 'Brown', color: '#7B4F2E' },
  { id: 'dark', label: 'Dark', color: '#4A2C17' },
  { id: 'blue', label: 'Blue', color: '#4FC3F7' },
  { id: 'green', label: 'Green', color: '#66BB6A' },
  { id: 'purple', label: 'Purple', color: '#AB47BC' },
  { id: 'pink', label: 'Pink', color: '#F48FB1' },
  { id: 'golden', label: 'Golden', color: '#FFD54F' },
  { id: 'silver', label: 'Silver', color: '#B0BEC5' },
];

const HAIR_STYLES = [
  { id: 'ponytail', label: 'Ponytail', emoji: '👧' },
  { id: 'long-straight', label: 'Long Straight', emoji: '💇' },
  { id: 'short-pixie', label: 'Short Pixie', emoji: '✂️' },
  { id: 'curly', label: 'Curly / Afro', emoji: '🌀' },
  { id: 'braids', label: 'Braids', emoji: '🎀' },
  { id: 'space-buns', label: 'Space Buns', emoji: '🔵' },
  { id: 'bob', label: 'Bob Cut', emoji: '💈' },
  { id: 'mohawk', label: 'Mohawk', emoji: '⚡' },
];

const HAIR_COLORS = [
  { id: 'black', label: 'Black', color: '#212121' },
  { id: 'brown', label: 'Brown', color: '#5D4037' },
  { id: 'blonde', label: 'Blonde', color: '#FFD54F' },
  { id: 'red', label: 'Red', color: '#E53935' },
  { id: 'gray', label: 'Gray', color: '#9E9E9E' },
  { id: 'blue-cyan', label: 'Blue Cyan', color: '#29ABE2' },
  { id: 'pink', label: 'Pink', color: '#F48FB1' },
  { id: 'purple', label: 'Purple', color: '#9C27B0' },
  { id: 'green', label: 'Green', color: '#4CAF50' },
  { id: 'orange', label: 'Orange', color: '#FF9800' },
];

const ACCESSORIES = [
  { id: 'glasses-round', label: 'Round Glasses', emoji: '🔵' },
  { id: 'glasses-star', label: 'Star Glasses', emoji: '⭐' },
  { id: 'hat-cap', label: 'Baseball Cap', emoji: '🧢' },
  { id: 'hat-crown', label: 'Crown', emoji: '👑' },
  { id: 'hat-wizard', label: 'Wizard Hat', emoji: '🧙' },
  { id: 'wings-fairy', label: 'Fairy Wings', emoji: '🧚' },
  { id: 'wings-dragon', label: 'Dragon Wings', emoji: '🐉' },
  { id: 'backpack-rainbow', label: 'Rainbow Backpack', emoji: '🌈' },
];

// ─── Component ────────────────────────────────────────────────────────────────

function CustomizeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const profileId = searchParams.get('profile');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [skinTone, setSkinTone] = useState('medium');
  const [hairStyle, setHairStyle] = useState('ponytail');
  const [hairColor, setHairColor] = useState('blue-cyan');
  const [accessories, setAccessories] = useState<string[]>([]);

  useEffect(() => {
    if (!profileId) { router.push('/'); return; }
    getProfile(profileId).then(p => {
      if (!p) { router.push('/'); return; }
      setProfile(p);
      const c = p.characterCustomization;
      setSkinTone(c.skinTone);
      setHairStyle(c.hairStyle);
      setHairColor(c.hairColor);
      setAccessories(c.accessories ?? []);
    }).finally(() => setLoading(false));
  }, [profileId, router]);

  const handleSave = async () => {
    if (!profile) return;
    profile.characterCustomization = { skinTone, hairStyle, hairColor, accessories };
    progressAchievement(profile, 'customizer', 1, 1);
    await saveProfileData(profile);
    setProfile({ ...profile });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleAccessory = (id: string) => {
    setAccessories(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!profile) return null;

  const currentSkin = SKIN_TONES.find(s => s.id === skinTone) ?? SKIN_TONES[2];
  const currentHairColor = HAIR_COLORS.find(h => h.id === hairColor) ?? HAIR_COLORS[5];
  const currentHairStyle = HAIR_STYLES.find(h => h.id === hairStyle) ?? HAIR_STYLES[0];
  const equippedCostume = profile.equippedCostume ?? 'green-dress';

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-blue-100 p-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-cyan-800">🎨 Character Customization</h1>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Back
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Preview Panel */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center gap-4 sticky top-4">
              <h2 className="text-lg font-bold text-gray-700">Preview</h2>

              {/* Character avatar preview */}
              <div
                className="w-32 h-32 rounded-full flex items-center justify-center text-6xl border-4 border-gray-200 shadow"
                style={{ backgroundColor: currentSkin.color }}
              >
                {currentHairStyle.emoji}
              </div>

              <div className="text-center space-y-1">
                <div className="text-sm font-semibold text-gray-600">
                  {profile.nickname}
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <span
                    className="inline-block w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: currentSkin.color }}
                  />
                  <span>{currentSkin.label} skin</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <span
                    className="inline-block w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: currentHairColor.color }}
                  />
                  <span>{currentHairColor.label} {currentHairStyle.label}</span>
                </div>
                {accessories.length > 0 && (
                  <div className="text-sm">
                    {accessories.map(id => ACCESSORIES.find(a => a.id === id)?.emoji).join(' ')}
                  </div>
                )}
                <div className="text-xs text-gray-500 mt-1">Costume: {equippedCostume.replace(/-/g, ' ')}</div>
              </div>

              <button
                onClick={handleSave}
                className={`w-full py-3 rounded-xl font-bold text-white transition-colors ${
                  saved ? 'bg-green-500' : 'bg-cyan-600 hover:bg-cyan-700'
                }`}
              >
                {saved ? '✓ Saved!' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Customization Options */}
          <div className="md:col-span-2 space-y-6">

            {/* Skin Tone */}
            <section className="bg-white rounded-2xl shadow p-5">
              <h3 className="font-bold text-lg text-gray-700 mb-3">Skin Tone</h3>
              <div className="flex flex-wrap gap-3">
                {SKIN_TONES.map(tone => (
                  <button
                    key={tone.id}
                    title={tone.label}
                    onClick={() => setSkinTone(tone.id)}
                    className={`w-10 h-10 rounded-full border-4 transition-transform ${
                      skinTone === tone.id
                        ? 'border-cyan-500 scale-110'
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: tone.color }}
                    aria-label={tone.label}
                    aria-pressed={skinTone === tone.id}
                  />
                ))}
              </div>
            </section>

            {/* Hair Style */}
            <section className="bg-white rounded-2xl shadow p-5">
              <h3 className="font-bold text-lg text-gray-700 mb-3">Hair Style</h3>
              <div className="grid grid-cols-4 gap-2">
                {HAIR_STYLES.map(style => (
                  <button
                    key={style.id}
                    onClick={() => setHairStyle(style.id)}
                    className={`flex flex-col items-center p-2 rounded-xl border-2 transition-colors ${
                      hairStyle === style.id
                        ? 'border-cyan-500 bg-cyan-50'
                        : 'border-gray-200 hover:border-cyan-300'
                    }`}
                  >
                    <span className="text-2xl">{style.emoji}</span>
                    <span className="text-xs text-center mt-1 text-gray-600">{style.label}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Hair Color */}
            <section className="bg-white rounded-2xl shadow p-5">
              <h3 className="font-bold text-lg text-gray-700 mb-3">Hair Color</h3>
              <div className="flex flex-wrap gap-3">
                {HAIR_COLORS.map(hc => (
                  <button
                    key={hc.id}
                    title={hc.label}
                    onClick={() => setHairColor(hc.id)}
                    className={`w-10 h-10 rounded-full border-4 transition-transform ${
                      hairColor === hc.id
                        ? 'border-cyan-500 scale-110'
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: hc.color }}
                    aria-label={hc.label}
                    aria-pressed={hairColor === hc.id}
                  />
                ))}
              </div>
            </section>

            {/* Accessories */}
            <section className="bg-white rounded-2xl shadow p-5">
              <h3 className="font-bold text-lg text-gray-700 mb-3">Accessories</h3>
              <div className="grid grid-cols-4 gap-2">
                {ACCESSORIES.map(acc => (
                  <button
                    key={acc.id}
                    onClick={() => toggleAccessory(acc.id)}
                    className={`flex flex-col items-center p-2 rounded-xl border-2 transition-colors ${
                      accessories.includes(acc.id)
                        ? 'border-cyan-500 bg-cyan-50'
                        : 'border-gray-200 hover:border-cyan-300'
                    }`}
                    aria-pressed={accessories.includes(acc.id)}
                  >
                    <span className="text-2xl">{acc.emoji}</span>
                    <span className="text-xs text-center mt-1 text-gray-600">{acc.label}</span>
                  </button>
                ))}
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}

export default function CustomizePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <CustomizeContent />
    </Suspense>
  );
}
