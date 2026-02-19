'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Profile } from '@/core/types';
import { getProfile } from '@/core/persistence';
import GameMap from '@/components/GameMap';

function MapContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const profileId = searchParams.get('profile');

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!profileId) {
        router.push('/');
        return;
      }

      try {
        const loadedProfile = await getProfile(profileId);
        if (!loadedProfile) {
          router.push('/');
          return;
        }
        setProfile(loadedProfile);
      } catch (error) {
        console.error('Error loading profile:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [profileId, router]);

  const handleLevelSelect = (levelId: number) => {
    router.push(`/game?profile=${profileId}&level=${levelId}`);
  };

  const handleBack = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-300 to-grass-200">
        <div className="text-2xl font-bold text-gray-800">Loading map...</div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return <GameMap profile={profile} onLevelSelect={handleLevelSelect} onBack={handleBack} />;
}

export default function MapPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-300 to-grass-200">
        <div className="text-2xl font-bold text-gray-800">Loading...</div>
      </div>
    }>
      <MapContent />
    </Suspense>
  );
}
