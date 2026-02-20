export interface PowerUpDefinition {
  id: string;
  name: string;
  emoji: string;
  description: string;
  duration: number; // seconds, 0 = instant
}

export const POWER_UP_DEFINITIONS: PowerUpDefinition[] = [
  { id: 'star-power', name: 'Star Power', emoji: '⭐', description: 'Temporary invincibility! Nothing can hurt you.', duration: 10 },
  { id: 'rocket-boots', name: 'Rocket Boots', emoji: '🚀', description: 'Jump extra high to reach hidden platforms.', duration: 20 },
  { id: 'speed-boost', name: 'Speed Boost', emoji: '💨', description: 'Run faster to cover ground quickly.', duration: 15 },
  { id: 'x-ray-glasses', name: 'X-Ray Glasses', emoji: '🔍', description: 'Reveal hidden letters and secrets.', duration: 20 },
  { id: 'time-freeze', name: 'Time Freeze', emoji: '⏰', description: 'Freeze the timer for bonus time.', duration: 0 },
  { id: 'letter-magnet', name: 'Letter Magnet', emoji: '🧲', description: 'Automatically attract nearby letters.', duration: 15 },
  { id: 'rainbow-bridge', name: 'Rainbow Bridge', emoji: '🌈', description: 'Summon a bridge to cross impossible gaps.', duration: 10 },
];

export const POWER_UP_MAP: Record<string, PowerUpDefinition> = Object.fromEntries(
  POWER_UP_DEFINITIONS.map(p => [p.id, p])
);
