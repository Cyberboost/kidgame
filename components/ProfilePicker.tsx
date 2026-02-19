'use client';

import { Profile, Grade, DifficultyTier } from '@/core/types';
import { useState } from 'react';
import { LivyCharacter } from '@/components/characters';

interface ProfilePickerProps {
  profiles: Profile[];
  onSelectProfile: (profileId: string) => void;
  onCreateProfile: (nickname: string, grade: Grade, difficulty?: DifficultyTier) => void;
  onDeleteProfile: (profileId: string) => void;
}

const GRADES: Grade[] = ['PreK', 'K', '1', '2', '3', '4', '5', '6', '7', '8'];
const DIFFICULTIES: DifficultyTier[] = ['Sprout', 'Explorer', 'Ranger', 'Guardian'];

const DIFFICULTY_LABELS: Record<DifficultyTier, string> = {
  Sprout: 'Sprout – Pre-K/K: 4×4 grid, gentle mode with hints',
  Explorer: 'Explorer – Grades 1–2: 5×5 grid, limited hints',
  Ranger: 'Ranger – Grades 3–5: 6×6 grid, hints disabled on mistakes',
  Guardian: 'Guardian – Grades 6–8: 7×7 grid, tiles lock on errors',
};

export default function ProfilePicker({
  profiles,
  onSelectProfile,
  onCreateProfile,
  onDeleteProfile,
}: ProfilePickerProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newNickname, setNewNickname] = useState('');
  const [newGrade, setNewGrade] = useState<Grade>('1');
  const [newDifficulty, setNewDifficulty] = useState<DifficultyTier | ''>('');

  const handleCreate = () => {
    if (newNickname.trim()) {
      onCreateProfile(
        newNickname.trim(),
        newGrade,
        newDifficulty || undefined
      );
      setNewNickname('');
      setNewGrade('1');
      setNewDifficulty('');
      setShowCreateForm(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex flex-col items-center mb-6">
        <LivyCharacter pose="waving" size="hero" animated={true} />
        <h1 className="text-4xl font-bold text-center mt-4 text-gray-800">
          Livy&apos;s Bunny Rescue Adventure
        </h1>
        <h2 className="text-2xl font-semibold text-center mt-2 text-gray-700">
          Choose Your Profile
        </h2>
      </div>

      {/* Existing Profiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className="bg-white rounded-xl shadow-lg p-6 relative hover:shadow-xl transition-shadow"
          >
            <button
              onClick={() => onDeleteProfile(profile.id)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl"
              aria-label="Delete profile"
            >
              ×
            </button>
            
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {profile.nickname}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Grade: {profile.defaultGrade}
              {profile.preferredDifficulty && ` • ${profile.preferredDifficulty}`}
            </p>

            <div className="text-sm text-gray-700 space-y-1 mb-4">
              <div>🎮 Games: {profile.stats.totalGamesPlayed}</div>
              <div>🐰 Bunnies: {profile.stats.totalBunniesRescued}</div>
              <div>📝 Words: {profile.stats.totalWordsSpelled}</div>
              <div>🔥 Streak: {profile.stats.currentStreak}</div>
            </div>

            <button
              onClick={() => onSelectProfile(profile.id)}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              Play
            </button>
          </div>
        ))}
      </div>

      {/* Create New Profile */}
      {!showCreateForm ? (
        <div className="text-center">
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-xl text-lg transition-colors shadow-lg"
          >
            + Create New Profile
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Create New Profile
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nickname
              </label>
              <input
                type="text"
                value={newNickname}
                onChange={(e) => setNewNickname(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                maxLength={20}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Grade Level
              </label>
              <select
                value={newGrade}
                onChange={(e) => setNewGrade(e.target.value as Grade)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-gray-800"
              >
                {GRADES.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade === 'PreK' ? 'Pre-K' : `Grade ${grade}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Difficulty (Optional)
              </label>
              <select
                value={newDifficulty}
                onChange={(e) => setNewDifficulty(e.target.value as DifficultyTier | '')}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-gray-800"
              >
                <option value="">Auto (based on grade)</option>
                {DIFFICULTIES.map((diff) => (
                  <option key={diff} value={diff}>
                    {DIFFICULTY_LABELS[diff]}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                disabled={!newNickname.trim()}
                className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setNewNickname('');
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
