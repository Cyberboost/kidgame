'use client';

import { useEffect, useState } from 'react';
import ProfilePicker from '@/components/ProfilePicker';
import { Profile, Grade, DifficultyTier } from '@/core/types';
import {
  getAllProfiles,
  initializeSettings,
} from '@/core/persistence';
import {
  createProfile,
  saveProfileData,
  removeProfile,
} from '@/profiles/profileManager';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await initializeSettings();
      const loadedProfiles = await getAllProfiles();
      setProfiles(loadedProfiles);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProfile = (profileId: string) => {
    router.push(`/game?profile=${profileId}`);
  };

  const handleSelectPlatformer = (profileId: string) => {
    router.push(`/game?profile=${profileId}&mode=platformer`);
  };

  const handleCreateProfile = async (
    nickname: string,
    grade: Grade,
    difficulty?: DifficultyTier
  ) => {
    const newProfile = createProfile(nickname, grade, difficulty);
    await saveProfileData(newProfile);
    setProfiles([...profiles, newProfile]);
  };

  const handleDeleteProfile = async (profileId: string) => {
    if (confirm('Are you sure you want to delete this profile?')) {
      await removeProfile(profileId);
      setProfiles(profiles.filter((p) => p.id !== profileId));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-300 to-grass-200">
        <div className="text-2xl font-bold text-gray-800">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-300 to-grass-200 py-8">
      <ProfilePicker
        profiles={profiles}
        onSelectProfile={handleSelectProfile}
        onCreateProfile={handleCreateProfile}
        onDeleteProfile={handleDeleteProfile}
      />
      {profiles.length > 0 && (
        <div className="mt-6 flex flex-col items-center gap-4">
          <p className="text-gray-700 font-semibold text-lg">What would you like to do?</p>
          <div className="flex flex-wrap gap-3 justify-center max-w-2xl">
            {profiles.map(p => (
              <div key={p.id} className="flex flex-col items-center gap-2 bg-white bg-opacity-80 rounded-2xl p-4 shadow">
                <span className="font-bold text-gray-700">{p.nickname}</span>
                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={() => handleSelectPlatformer(p.id)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold text-sm shadow transition-colors"
                  >
                    🚀 Platformer
                  </button>
                  <button
                    onClick={() => handleSelectProfile(p.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm shadow transition-colors"
                  >
                    🃏 Word Game
                  </button>
                  <button
                    onClick={() => router.push(`/profile?id=${p.id}`)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold text-sm shadow transition-colors"
                  >
                    👤 Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
