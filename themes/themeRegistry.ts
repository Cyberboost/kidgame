import { YardTheme } from '@/core/types';

export const YARD_THEMES: YardTheme[] = [
  {
    id: 'front-lawn',
    name: 'Front Lawn',
    description: 'A sunny front lawn perfect for learning!',
    premium: false,
    styles: {
      background: 'bg-gradient-to-b from-sky-300 to-grass-200',
      tileNormal: 'bg-grass-100 border-grass-400 text-gray-800',
      tileSelected: 'bg-yellow-300 border-yellow-600 text-gray-900 ring-4 ring-yellow-400',
      tileCleared: 'bg-grass-400 border-grass-600 text-grass-600',
      tileLocked: 'bg-gray-300 border-gray-500 text-gray-500 opacity-50',
      bunnyImage: '🐰',
      trapImage: '🕸️',
    },
  },
  {
    id: 'flower-patch',
    name: 'Flower Patch',
    description: 'A colorful garden full of blooming flowers!',
    premium: false,
    unlockCondition: {
      type: 'accuracy',
      value: 80,
    },
    styles: {
      background: 'bg-gradient-to-b from-pink-200 to-grass-300',
      tileNormal: 'bg-pink-100 border-pink-400 text-gray-800',
      tileSelected: 'bg-fuchsia-300 border-fuchsia-600 text-gray-900 ring-4 ring-fuchsia-400',
      tileCleared: 'bg-grass-400 border-grass-600 text-grass-600',
      tileLocked: 'bg-gray-300 border-gray-500 text-gray-500 opacity-50',
      bunnyImage: '🐇',
      trapImage: '🌸',
    },
  },
  {
    id: 'vegetable-garden',
    name: 'Vegetable Garden',
    description: 'Help bunnies in the veggie garden!',
    premium: false,
    unlockCondition: {
      type: 'reviewBasketCleared',
      value: 1,
    },
    styles: {
      background: 'bg-gradient-to-b from-amber-200 to-grass-400',
      tileNormal: 'bg-amber-100 border-amber-500 text-gray-800',
      tileSelected: 'bg-orange-300 border-orange-600 text-gray-900 ring-4 ring-orange-400',
      tileCleared: 'bg-grass-500 border-grass-700 text-grass-700',
      tileLocked: 'bg-gray-300 border-gray-500 text-gray-500 opacity-50',
      bunnyImage: '🐰',
      trapImage: '🥕',
    },
  },
  {
    id: 'enchanted-forest',
    name: 'Enchanted Forest',
    description: '✨ Premium: A magical forest adventure!',
    premium: true,
    styles: {
      background: 'bg-gradient-to-b from-purple-400 to-emerald-600',
      tileNormal: 'bg-purple-200 border-purple-500 text-gray-800',
      tileSelected: 'bg-violet-400 border-violet-700 text-white ring-4 ring-violet-500',
      tileCleared: 'bg-emerald-600 border-emerald-800 text-emerald-800',
      tileLocked: 'bg-gray-400 border-gray-600 text-gray-600 opacity-50',
      bunnyImage: '🐇',
      trapImage: '✨',
    },
  },
  {
    id: 'winter-wonderland',
    name: 'Winter Wonderland',
    description: '✨ Premium: A snowy winter scene!',
    premium: true,
    styles: {
      background: 'bg-gradient-to-b from-blue-200 to-blue-50',
      tileNormal: 'bg-blue-50 border-blue-300 text-gray-800',
      tileSelected: 'bg-cyan-300 border-cyan-600 text-gray-900 ring-4 ring-cyan-400',
      tileCleared: 'bg-blue-200 border-blue-400 text-blue-400',
      tileLocked: 'bg-gray-200 border-gray-400 text-gray-400 opacity-50',
      bunnyImage: '🐰',
      trapImage: '❄️',
    },
  },
  {
    id: 'beach-paradise',
    name: 'Beach Paradise',
    description: '✨ Premium: Sunny beach vibes!',
    premium: true,
    styles: {
      background: 'bg-gradient-to-b from-yellow-200 to-blue-400',
      tileNormal: 'bg-yellow-100 border-yellow-400 text-gray-800',
      tileSelected: 'bg-amber-300 border-amber-600 text-gray-900 ring-4 ring-amber-400',
      tileCleared: 'bg-blue-300 border-blue-500 text-blue-500',
      tileLocked: 'bg-gray-300 border-gray-500 text-gray-500 opacity-50',
      bunnyImage: '🐇',
      trapImage: '🏖️',
    },
  },
];

export function getThemeById(themeId: string): YardTheme | undefined {
  return YARD_THEMES.find(theme => theme.id === themeId);
}

export function getAvailableThemes(unlockedThemeIds: string[]): YardTheme[] {
  return YARD_THEMES.filter(theme => 
    !theme.premium || unlockedThemeIds.includes(theme.id)
  );
}

export function checkThemeUnlock(
  theme: YardTheme,
  stats: {
    accuracy: number;
    reviewBasketClearedCount: number;
    bunniesRescued: number;
    wordsSpelled: number;
  }
): boolean {
  if (!theme.unlockCondition) return true;

  const { type, value } = theme.unlockCondition;

  switch (type) {
    case 'accuracy':
      return stats.accuracy >= value;
    case 'reviewBasketCleared':
      return stats.reviewBasketClearedCount >= value;
    case 'bunniesRescued':
      return stats.bunniesRescued >= value;
    case 'wordsSpelled':
      return stats.wordsSpelled >= value;
    default:
      return false;
  }
}
