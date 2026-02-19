# Livy's Bunny Rescue Adventure - Sight Words Learning Game 🐰

A wholesome, mobile-first literacy game for kids (Pre-K to Grade 8). Players rescue bunnies trapped under letter tiles by spelling sight words. Built with privacy and safety as top priorities—no accounts, no tracking, no external calls.

## 🎮 Features

### Core Gameplay
- **Letter-by-letter validation** with "Garden Focus" mechanic
- **4 difficulty tiers** (Sprout, Explorer, Ranger, Guardian) matched to grade levels
- **Review Basket system** for failed words
- **Master win condition**: Rescue all bunnies AND clear the review basket

### Game Modes
- **Solo Mode**: Single-player yard sessions
- **Co-op Mode**: Pass-and-play collaboration (coming soon)

### Profiles & Progress
- Local-only profiles (nickname + grade)
- Track stats: games played, bunnies rescued, words spelled, streaks
- Word performance tracking and mastery system
- Custom word lists and imports

### Themes
- **3 Free Themes**: Front Lawn, Flower Patch, Vegetable Garden
- **3 Premium Themes**: Enchanted Forest, Winter Wonderland, Beach Paradise (cosmetic only)
- Themes unlock based on achievement milestones

### Accessibility
- High contrast mode
- Dyslexia-friendly font option (OpenDyslexic)
- Web Speech API integration for word pronunciation
- ARIA labels throughout
- Mobile-first responsive design

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Cyberboost/kidgame.git
   cd kidgame
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

### Test Coverage

The project includes comprehensive unit tests for:
- ✅ Letter-by-letter validation logic
- ✅ Review basket enqueue/dequeue rules
- ✅ Win condition (bunnies rescued + review basket cleared)
- ✅ Word import parsing and validation
- ✅ Board generation with seeded randomness

## 📦 Project Structure

```
kidgame/
├── app/                    # Next.js App Router pages
│   ├── game/              # Main game page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home/profile selection
├── components/            # React components
│   ├── ActionBar.tsx      # Undo, Clear, Submit buttons
│   ├── Grid.tsx           # Letter tile grid
│   ├── Header.tsx         # Game stats header
│   ├── ProfilePicker.tsx  # Profile selection
│   ├── SettingsModal.tsx  # Settings modal
│   ├── Tile.tsx           # Individual tile component
│   ├── WordCard.tsx       # Target word display
│   └── __tests__/         # Component tests
├── core/                  # Game engine & logic
│   ├── boardGenerator.ts  # Board/trap generation
│   ├── difficultyConfig.ts # Tier definitions
│   ├── gameEngine.ts      # Core game logic
│   ├── persistence.ts     # IndexedDB layer
│   ├── reviewBasket.ts    # Failed word tracking
│   └── types.ts           # TypeScript definitions
├── words/                 # Word management
│   ├── starterLists.ts    # Built-in word lists
│   ├── importParser.ts    # Word import/validation
│   ├── performanceTracker.ts # Word mastery tracking
│   └── wordSelector.ts    # Word selection logic
├── profiles/              # Profile management
│   └── profileManager.ts  # Profile CRUD operations
├── themes/                # Theme system
│   └── themeRegistry.ts   # Theme definitions
└── public/                # Static assets
```

## 🎨 Adding New Themes

To add a new theme, edit `themes/themeRegistry.ts`:

```typescript
{
  id: 'my-new-theme',
  name: 'My Theme Name',
  description: 'A description of the theme',
  premium: false, // or true for premium
  unlockCondition: {
    type: 'accuracy', // or 'reviewBasketCleared', 'bunniesRescued', 'wordsSpelled'
    value: 75,
  },
  styles: {
    background: 'bg-gradient-to-b from-blue-300 to-green-200',
    tileNormal: 'bg-white border-gray-400 text-gray-800',
    tileSelected: 'bg-yellow-300 border-yellow-600 text-gray-900 ring-4 ring-yellow-400',
    tileCleared: 'bg-green-400 border-green-600 text-green-600',
    tileLocked: 'bg-gray-300 border-gray-500 text-gray-500 opacity-50',
    bunnyImage: '🐰',
    trapImage: '🕸️',
  },
}
```

## 🌐 Deployment

### Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Or use GitHub integration**
   - Connect your GitHub repository to Vercel
   - Vercel will auto-deploy on push to main branch

### Deploy to Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy via Netlify CLI**
   ```bash
   npm i -g netlify-cli
   netlify deploy --prod
   ```

### Environment Variables

No environment variables are required! This is a fully client-side application.

## 🔒 Privacy & Security

This game is designed with children's privacy in mind:

- ✅ **No accounts or authentication**
- ✅ **No email collection**
- ✅ **No analytics or tracking**
- ✅ **No external network calls** (except OpenDyslexic font when enabled)
- ✅ **No chat or user-generated content**
- ✅ **Local-only data storage** (IndexedDB)
- ✅ **Data export/reset functionality**

**Note on External Resources**: The dyslexia-friendly font option loads OpenDyslexic from a CDN only when explicitly enabled by the user. All other functionality works completely offline.

## 🎓 Educational Design

### Difficulty Tiers

**Sprout (Pre-K/K)**
- 4×4 grid
- Unlimited Garden Focus
- Gentle mode with hints
- No timer

**Explorer (Grades 1–2)**
- 5×5 grid
- Garden Focus: 3
- Streak resets on focus depletion
- Immediate reset on wrong submit

**Ranger (Grades 3–5)**
- 6×6 grid
- Garden Focus: 3
- Hints disabled on focus depletion
- Requires retry on wrong submit

**Guardian (Grades 6–8)**
- 7×7 grid
- Garden Focus: 2
- Tiles lock on incorrect letter
- Must spell correctly to progress
- Optional timer

### Word Lists

Pre-loaded sight word lists for all grade levels:
- **PreK**: 20 words (I, A, THE, TO, AND...)
- **K**: 30 words (AM, AT, ATE, ALL...)
- **Grade 1**: 40 words (AFTER, AGAIN, AN...)
- **Grade 2**: 40 words (ALWAYS, AROUND, BECAUSE...)
- **Grade 3**: 40 words (ABOUT, BETTER, BRING...)
- **Grade 4**: 40 words (ANSWER, APPLE, AWAY...)
- **Grade 5**: 40 words (ABOVE, ACROSS, AGAINST...)
- **Grade 6**: 40 words (ABILITY, ACCEPT, ACCORDING...)
- **Grade 7**: 40 words (ABSOLUTELY, ACADEMIC...)
- **Grade 8**: 40 words (ABBREVIATION, ACCELERATION...)

Custom words can be added via Settings.

## 🛠 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Storage**: IndexedDB (via `idb` library)
- **Speech**: Web Speech API
- **Testing**: Jest + React Testing Library

## 📝 License

This project is provided as-is for educational purposes.

## 🤝 Contributing

This is an MVP implementation. Future enhancements:
- Co-op mode completion
- Theme picker UI
- End summary screen
- Mobile app packaging (React Native/Capacitor)
- Teacher dashboard (future SaaS version)

## 🐛 Troubleshooting

### Browser Compatibility

- **IndexedDB**: Supported in all modern browsers
- **Web Speech API**: Works in Chrome, Edge, Safari (iOS 7+)

If you encounter issues:
1. Clear browser cache and IndexedDB
2. Try in Chrome/Edge for best compatibility
3. Ensure JavaScript is enabled

### Data Reset

To reset all data:
1. Open the game
2. Click ⚙️ Settings
3. Click "Reset All Data"

Or manually clear IndexedDB via browser DevTools → Application → Storage.

## 📞 Support

For questions or issues, please open an issue on GitHub.

---

**Made with ❤️ for kids who love learning and bunnies!** 🐰📚
