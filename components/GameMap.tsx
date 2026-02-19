'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Profile } from '@/core/types';
import { LEVELS, LevelConfig, Zone, getZoneName } from '@/core/levelConfig';
import LevelNode from './LevelNode';
import LevelDetailPopup from './LevelDetailPopup';
import MapBackground from './MapBackground';

interface GameMapProps {
  profile: Profile;
  onLevelSelect: (levelId: number) => void;
  onBack: () => void;
}

export default function GameMap({ profile, onLevelSelect, onBack }: GameMapProps) {
  const [selectedLevel, setSelectedLevel] = useState<LevelConfig | null>(null);
  const [currentZone, setCurrentZone] = useState<Zone>('meadow');
  const mapRef = useRef<HTMLDivElement>(null);
  const totalStars = profile.totalStars || 0;

  // Calculate level states
  const getLevelState = (level: LevelConfig): 'locked' | 'available' | 'completed' => {
    const progress = profile.levelProgress?.[level.id];
    if (progress?.completed) return 'completed';
    if (totalStars >= level.requiredStars) return 'available';
    return 'locked';
  };

  const getLevelStars = (levelId: number): number => {
    return profile.levelProgress?.[levelId]?.stars || 0;
  };

  // Find current level (first unlocked but not completed)
  const currentLevelId = LEVELS.find(
    (level) => getLevelState(level) === 'available' && !profile.levelProgress?.[level.id]?.completed
  )?.id || 1;

  useEffect(() => {
    // Scroll to current level on mount
    const currentLevel = LEVELS.find((l) => l.id === currentLevelId);
    if (currentLevel && mapRef.current) {
      const scrollPosition = (currentLevel.position.x / 100) * mapRef.current.scrollWidth - window.innerWidth / 2;
      mapRef.current.scrollTo({
        left: Math.max(0, scrollPosition),
        behavior: 'smooth',
      });

      // Update current zone based on level
      setCurrentZone(currentLevel.zone);
    }
  }, [currentLevelId]);

  const handleLevelClick = (level: LevelConfig) => {
    const state = getLevelState(level);
    if (state === 'locked') return;
    setSelectedLevel(level);
  };

  const handlePlay = () => {
    if (selectedLevel) {
      onLevelSelect(selectedLevel.id);
    }
  };

  // Group levels by zone for banners
  const zones: Zone[] = ['meadow', 'forest', 'clouds', 'rainbow'];
  const zoneBanners = zones.map((zone) => {
    const zoneLevels = LEVELS.filter((l) => l.zone === zone);
    if (zoneLevels.length === 0) return null;
    const firstLevel = zoneLevels[0];
    return { zone, position: firstLevel.position.x - 5 };
  }).filter(Boolean) as { zone: Zone; position: number }[];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <MapBackground currentZone={currentZone} />

      {/* Header Bar */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-md border-b-2 border-grass-300 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-gray-700 transition-colors"
          >
            ← Back
          </button>
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold text-gray-700">{profile.nickname}</span>
            <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full border-2 border-yellow-400">
              <span className="text-2xl">⭐</span>
              <span className="text-xl font-extrabold text-yellow-700">{totalStars}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Map Container */}
      <div
        ref={mapRef}
        className="absolute inset-0 top-20 overflow-x-auto overflow-y-hidden scroll-smooth"
        style={{
          scrollSnapType: 'x proximity',
        }}
      >
        <div className="relative min-w-[300vw] h-full">
          {/* SVG Path */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="none"
          >
            <defs>
              <filter id="path-roughness">
                <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
              </filter>
            </defs>
            <path
              d={LEVELS.map((level, i) => {
                if (i === 0) return `M ${level.position.x}% ${level.position.y}%`;
                return `L ${level.position.x}% ${level.position.y}%`;
              }).join(' ')}
              stroke="#8B4513"
              strokeWidth="6"
              strokeDasharray="20 10"
              fill="none"
              opacity="0.6"
              filter="url(#path-roughness)"
              strokeLinecap="round"
            />
          </svg>

          {/* Zone Banners */}
          {zoneBanners.map(({ zone, position }) => (
            <div
              key={zone}
              className="absolute"
              style={{
                left: `${position}%`,
                top: '10%',
                transform: 'translateX(-50%)',
              }}
            >
              <div className="bg-gradient-to-b from-amber-700 to-amber-900 text-white px-6 py-3 rounded-lg border-4 border-amber-950 shadow-xl font-extrabold text-xl whitespace-nowrap">
                {getZoneName(zone)}
              </div>
            </div>
          ))}

          {/* Level Nodes */}
          {LEVELS.map((level) => {
            const state = getLevelState(level);
            const stars = getLevelStars(level.id);
            const isCurrent = level.id === currentLevelId;

            return (
              <LevelNode
                key={level.id}
                level={level.id}
                state={state}
                stars={stars}
                position={level.position}
                isCurrent={isCurrent}
                onClick={() => handleLevelClick(level)}
              />
            );
          })}

          {/* Decorative bunnies hopping around */}
          <div
            className="absolute text-3xl"
            style={{
              left: '15%',
              bottom: '20%',
              animation: 'bunny-hop 3s infinite ease-in-out',
              animationDelay: '0.5s',
            }}
          >
            🐰
          </div>
          <div
            className="absolute text-3xl"
            style={{
              left: '45%',
              bottom: '25%',
              animation: 'bunny-hop 2.5s infinite ease-in-out',
              animationDelay: '1s',
            }}
          >
            🐇
          </div>
          <div
            className="absolute text-3xl"
            style={{
              left: '75%',
              bottom: '15%',
              animation: 'bunny-hop 3.5s infinite ease-in-out',
              animationDelay: '1.5s',
            }}
          >
            🐰
          </div>
        </div>
      </div>

      {/* Level Detail Popup */}
      {selectedLevel && (
        <LevelDetailPopup
          level={selectedLevel}
          stars={getLevelStars(selectedLevel.id)}
          maxStars={3}
          onPlay={handlePlay}
          onClose={() => setSelectedLevel(null)}
        />
      )}
    </div>
  );
}
