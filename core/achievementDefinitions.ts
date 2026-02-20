export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'gameplay' | 'collection' | 'streak' | 'fashion' | 'special';
  threshold: number;
}

export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  // Gameplay basics
  { id: 'first-steps', name: 'First Steps', description: 'Play your first game', icon: '👣', category: 'gameplay', threshold: 1 },
  { id: 'first-word', name: 'First Word', description: 'Spell your first word', icon: '📝', category: 'gameplay', threshold: 1 },
  { id: 'bunny-friend', name: 'Bunny Friend', description: 'Rescue your first bunny', icon: '🐰', category: 'gameplay', threshold: 1 },
  { id: 'breaker', name: 'Breaker', description: 'Break your first block', icon: '💥', category: 'gameplay', threshold: 1 },
  { id: 'word-master', name: 'Word Master', description: 'Spell 50 words', icon: '🏆', category: 'gameplay', threshold: 50 },
  { id: 'century', name: 'Century', description: 'Spell 100 words', icon: '💯', category: 'gameplay', threshold: 100 },
  { id: 'bunny-rescuer', name: 'Bunny Rescuer', description: 'Rescue 10 bunnies', icon: '🐇', category: 'gameplay', threshold: 10 },
  { id: 'bunny-hero', name: 'Bunny Hero', description: 'Rescue 50 bunnies', icon: '🦸', category: 'gameplay', threshold: 50 },
  { id: 'speed-demon', name: 'Speed Demon', description: 'Complete a level under par time', icon: '⚡', category: 'gameplay', threshold: 1 },
  { id: 'explorer', name: 'Explorer', description: 'Complete 3 different levels', icon: '🗺️', category: 'gameplay', threshold: 3 },
  { id: 'treasure-hunter', name: 'Treasure Hunter', description: 'Collect 10 power-ups', icon: '💎', category: 'collection', threshold: 10 },
  { id: 'perfectionist', name: 'Perfectionist', description: 'Complete a level with no damage', icon: '✨', category: 'gameplay', threshold: 1 },
  // Streaks
  { id: 'hot-streak', name: 'Hot Streak', description: 'Collect 3 letters in a row', icon: '🔥', category: 'streak', threshold: 3 },
  { id: 'dedication', name: 'Dedication', description: 'Play 7 days in a row', icon: '📅', category: 'streak', threshold: 7 },
  { id: 'commitment', name: 'Commitment', description: 'Play 30 days in a row', icon: '🌟', category: 'streak', threshold: 30 },
  { id: 'legend', name: 'Legend', description: 'Play 100 days in a row', icon: '👑', category: 'streak', threshold: 100 },
  // Fashion
  { id: 'fashion-starter', name: 'Fashion Starter', description: 'Unlock your first costume', icon: '👗', category: 'fashion', threshold: 1 },
  { id: 'fashion-fan', name: 'Fashion Fan', description: 'Unlock 5 costumes', icon: '👠', category: 'fashion', threshold: 5 },
  { id: 'customizer', name: 'Customizer', description: 'Change your character appearance', icon: '🎨', category: 'fashion', threshold: 1 },
  { id: 'emote-master', name: 'Emote Master', description: 'Unlock all free emotes', icon: '🎭', category: 'fashion', threshold: 4 },
  // Special
  { id: 'combo-king', name: 'Combo King', description: 'Reach a 5x combo', icon: '🤴', category: 'special', threshold: 5 },
  { id: 'on-fire', name: 'On Fire', description: 'Reach a 10x combo', icon: '🌋', category: 'special', threshold: 10 },
  { id: 'no-damage', name: 'No Damage', description: 'Finish a level without losing a life', icon: '🛡️', category: 'special', threshold: 1 },
  { id: 'speedrunner', name: 'Speedrunner', description: 'Complete all 3 levels under par time', icon: '🏎️', category: 'special', threshold: 3 },
];

export const ACHIEVEMENT_MAP: Record<string, AchievementDefinition> = Object.fromEntries(
  ACHIEVEMENT_DEFINITIONS.map(a => [a.id, a])
);
