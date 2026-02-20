export type CostumeRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface CostumeDefinition {
  id: string;
  name: string;
  emoji: string;
  rarity: CostumeRarity;
  cost: number;
  description: string;
}

export const COSTUME_DEFINITIONS: CostumeDefinition[] = [
  { id: 'green-dress', name: 'Green Dress', emoji: '👗', rarity: 'common', cost: 0, description: 'The classic green dress — always stylish!' },
  { id: 'casual-tshirt', name: 'Casual T-Shirt', emoji: '👕', rarity: 'common', cost: 0, description: 'Comfy everyday wear.' },
  { id: 'rainbow-tutu', name: 'Rainbow Tutu', emoji: '🌈', rarity: 'common', cost: 50, description: 'A sparkly rainbow tutu for the dancing adventurer.' },
  { id: 'space-suit', name: 'Space Suit', emoji: '🚀', rarity: 'rare', cost: 150, description: 'Blast off in style with this stellar space suit.' },
  { id: 'ninja-outfit', name: 'Ninja Outfit', emoji: '🥷', rarity: 'rare', cost: 150, description: 'Silent but speedy — perfect for a word ninja.' },
  { id: 'princess-gown', name: 'Princess Gown', emoji: '👸', rarity: 'rare', cost: 200, description: 'A royal gown fit for a bunny-rescuing princess.' },
  { id: 'pirate-costume', name: 'Pirate Costume', emoji: '🏴‍☠️', rarity: 'rare', cost: 200, description: 'Arrr, set sail for adventure and vocabulary!' },
  { id: 'wizard-robe', name: 'Wizard Robe', emoji: '🧙', rarity: 'epic', cost: 400, description: 'Channel magical spelling powers with this epic robe.' },
  { id: 'superhero-cape', name: 'Superhero Cape', emoji: '🦸', rarity: 'epic', cost: 400, description: 'Fly through levels with superhero speed.' },
  { id: 'dragon-costume', name: 'Dragon Costume', emoji: '🐉', rarity: 'epic', cost: 500, description: 'Transform into a mighty word dragon.' },
  { id: 'golden-armor', name: 'Golden Armor', emoji: '🛡️', rarity: 'legendary', cost: 1000, description: 'Forged from pure starlight, this legendary armor shines bright.' },
  { id: 'unicorn-outfit', name: 'Unicorn Outfit', emoji: '🦄', rarity: 'legendary', cost: 1200, description: 'The rarest of outfits — only true legends wear the unicorn.' },
];

export const COSTUME_MAP: Record<string, CostumeDefinition> = Object.fromEntries(
  COSTUME_DEFINITIONS.map(c => [c.id, c])
);
