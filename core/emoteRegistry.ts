export interface EmoteDefinition {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  description: string;
}

export const EMOTE_DEFINITIONS: EmoteDefinition[] = [
  // Free emotes
  { id: 'wave', name: 'Wave', emoji: '👋', cost: 0, description: 'A friendly wave for everyone!' },
  { id: 'celebrate', name: 'Celebrate', emoji: '🎉', cost: 0, description: 'Throw a party — you earned it!' },
  { id: 'flex', name: 'Flex', emoji: '💪', cost: 0, description: 'Show off those spelling muscles.' },
  { id: 'heart', name: 'Heart', emoji: '❤️', cost: 0, description: 'Spread some love.' },
  // Unlockable emotes
  { id: 'dance', name: 'Dance', emoji: '💃', cost: 75, description: 'Bust a move on the platformer stage.' },
  { id: 'thumbs-up', name: 'Thumbs Up', emoji: '👍', cost: 50, description: 'A classic seal of approval.' },
  { id: 'star-eyes', name: 'Star Eyes', emoji: '🤩', cost: 50, description: 'You\'re a star — let everyone know.' },
  { id: 'cool', name: 'Cool', emoji: '😎', cost: 75, description: 'Stay cool under pressure.' },
  { id: 'rainbow', name: 'Rainbow', emoji: '🌈', cost: 100, description: 'Summon a rainbow celebration.' },
  { id: 'fireworks', name: 'Fireworks', emoji: '🎆', cost: 125, description: 'Light up the sky with victory fireworks.' },
  { id: 'superhero-pose', name: 'Superhero Pose', emoji: '🦸', cost: 150, description: 'Strike a heroic pose.' },
  { id: 'dragon-roar', name: 'Dragon Roar', emoji: '🐉', cost: 200, description: 'Unleash your inner dragon.' },
];

export const EMOTE_MAP: Record<string, EmoteDefinition> = Object.fromEntries(
  EMOTE_DEFINITIONS.map(e => [e.id, e])
);
