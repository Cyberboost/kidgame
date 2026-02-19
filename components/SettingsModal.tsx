'use client';

import { GameSettings } from '@/core/types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onSettingsChange: (settings: GameSettings) => void;
  onResetData: () => void;
  onExportData: () => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
  onResetData,
  onExportData,
}: SettingsModalProps) {
  if (!isOpen) return null;

  const toggleSetting = (key: keyof GameSettings) => {
    onSettingsChange({ ...settings, [key]: !settings[key] });
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
          <button
            onClick={onClose}
            aria-label="Close settings"
            className="text-gray-500 hover:text-gray-700 text-3xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {/* Accessibility Settings */}
          <div className="border-b pb-4">
            <h3 className="font-semibold text-gray-700 mb-3">Accessibility</h3>
            
            <label className="flex items-center justify-between py-2 cursor-pointer">
              <span className="text-gray-700">High Contrast Mode</span>
              <input
                type="checkbox"
                checked={settings.highContrast}
                onChange={() => toggleSetting('highContrast')}
                className="w-6 h-6 rounded"
              />
            </label>

            <label className="flex items-center justify-between py-2 cursor-pointer">
              <span className="text-gray-700">Dyslexia-Friendly Font</span>
              <input
                type="checkbox"
                checked={settings.dyslexicFont}
                onChange={() => toggleSetting('dyslexicFont')}
                className="w-6 h-6 rounded"
              />
            </label>
          </div>

          {/* Audio Settings */}
          <div className="border-b pb-4">
            <h3 className="font-semibold text-gray-700 mb-3">Audio</h3>
            
            <label className="flex items-center justify-between py-2 cursor-pointer">
              <span className="text-gray-700">Speech (Read Words Aloud)</span>
              <input
                type="checkbox"
                checked={settings.speechEnabled}
                onChange={() => toggleSetting('speechEnabled')}
                className="w-6 h-6 rounded"
              />
            </label>

            <label className="flex items-center justify-between py-2 cursor-pointer">
              <span className="text-gray-700">Sound Effects</span>
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={() => toggleSetting('soundEnabled')}
                className="w-6 h-6 rounded"
              />
            </label>

            <label className="flex items-center justify-between py-2 cursor-pointer">
              <span className="text-gray-700">Music</span>
              <input
                type="checkbox"
                checked={settings.musicEnabled}
                onChange={() => toggleSetting('musicEnabled')}
                className="w-6 h-6 rounded"
              />
            </label>
          </div>

          {/* Data Management */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Data</h3>
            
            <button
              onClick={onExportData}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg mb-2 transition-colors"
            >
              Export Data
            </button>

            <button
              onClick={() => {
                if (confirm('Are you sure? This will delete all profiles and progress!')) {
                  onResetData();
                }
              }}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Reset All Data
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg mt-6 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
