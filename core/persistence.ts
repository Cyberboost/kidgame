import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Profile, GameSession, GameSettings, LevelProgress } from '@/core/types';

interface BunniesDB extends DBSchema {
  profiles: {
    key: string;
    value: Profile;
  };
  sessions: {
    key: string;
    value: GameSession;
  };
  settings: {
    key: string;
    value: GameSettings;
  };
  platformerProgress: {
    key: string;
    value: LevelProgress;
  };
  starPointsLog: {
    key: number;
    value: { timestamp: number; amount: number; reason: string };
    autoIncrement: true;
  };
}

const DB_NAME = 'save-the-bunnies-db';
const DB_VERSION = 2;

let dbPromise: Promise<IDBPDatabase<BunniesDB>> | null = null;

async function getDB(): Promise<IDBPDatabase<BunniesDB>> {
  if (!dbPromise) {
    dbPromise = openDB<BunniesDB>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        // Create object stores
        if (!db.objectStoreNames.contains('profiles')) {
          db.createObjectStore('profiles', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('sessions')) {
          db.createObjectStore('sessions', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings');
        }
        // Version 2 additions
        if (oldVersion < 2) {
          if (!db.objectStoreNames.contains('platformerProgress')) {
            db.createObjectStore('platformerProgress', { keyPath: 'levelId' });
          }
          if (!db.objectStoreNames.contains('starPointsLog')) {
            db.createObjectStore('starPointsLog', { autoIncrement: true });
          }
        }
      },
    });
  }
  return dbPromise;
}

// Profile operations
export async function saveProfile(profile: Profile): Promise<void> {
  const db = await getDB();
  await db.put('profiles', profile);
}

export async function getProfile(id: string): Promise<Profile | undefined> {
  const db = await getDB();
  return db.get('profiles', id);
}

export async function getAllProfiles(): Promise<Profile[]> {
  const db = await getDB();
  return db.getAll('profiles');
}

export async function deleteProfile(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('profiles', id);
}

// Session operations
export async function saveSession(session: GameSession): Promise<void> {
  const db = await getDB();
  await db.put('sessions', session);
}

export async function getSession(id: string): Promise<GameSession | undefined> {
  const db = await getDB();
  return db.get('sessions', id);
}

export async function deleteSession(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('sessions', id);
}

// Settings operations
export async function saveSettings(settings: GameSettings): Promise<void> {
  const db = await getDB();
  await db.put('settings', settings, 'global');
}

export async function getSettings(): Promise<GameSettings | undefined> {
  const db = await getDB();
  return db.get('settings', 'global');
}

// Utility operations
export async function resetAllData(): Promise<void> {
  const db = await getDB();
  await db.clear('profiles');
  await db.clear('sessions');
  await db.clear('settings');
}

export async function exportData(): Promise<string> {
  const db = await getDB();
  const profiles = await db.getAll('profiles');
  const sessions = await db.getAll('sessions');
  const settings = await db.get('settings', 'global');
  
  return JSON.stringify({
    profiles,
    sessions,
    settings,
    exportDate: new Date().toISOString(),
  }, null, 2);
}

// Level progress operations
export async function saveLevelProgress(progress: LevelProgress): Promise<void> {
  const db = await getDB();
  await db.put('platformerProgress', progress);
}

export async function getLevelProgress(levelId: string): Promise<LevelProgress | undefined> {
  const db = await getDB();
  return db.get('platformerProgress', levelId);
}

export async function getAllLevelProgress(): Promise<LevelProgress[]> {
  const db = await getDB();
  return db.getAll('platformerProgress');
}

// Default settings
export const DEFAULT_SETTINGS: GameSettings = {
  highContrast: false,
  dyslexicFont: false,
  speechEnabled: true,
  soundEnabled: true,
  musicEnabled: true,
};

// Initialize default settings if none exist
export async function initializeSettings(): Promise<GameSettings> {
  let settings = await getSettings();
  if (!settings) {
    settings = DEFAULT_SETTINGS;
    await saveSettings(settings);
  }
  return settings;
}
