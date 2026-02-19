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
    </main>
  );
}
