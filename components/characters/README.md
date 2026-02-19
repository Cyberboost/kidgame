# Rescue Bunny Characters

This directory contains the SVG components for the four rescue bunny friend characters that appear throughout the game.

## Characters

### 🌸 Rosie (Pink Bunny Girl)
- **Personality**: Sweet, gentle, loves carrots
- **Appearance**: Pink fur, yellow dress with white ruffle trim, yellow bow on ear, holding a carrot
- **Levels**: 1-3 (Meadow Zone)

### 🤙 Chester (Brown Bunny Boy)
- **Personality**: Confident, friendly, always encouraging
- **Appearance**: Tan/brown fur, teal t-shirt, blue denim overalls, thumbs up gesture
- **Levels**: 4-6 (Forest Zone)

### 📚 Professor Pip (White Bunny Bookworm)
- **Personality**: Smart, studious, loves learning and books
- **Appearance**: White/cream fur, round black-rimmed glasses, green/white striped polo, holding a blue book
- **Levels**: 7-8 (Cloud Zone)

### 💜 Violet (Dark Gray Bunny Girl)
- **Personality**: Cool, mysterious, stylish
- **Appearance**: Dark gray fur, purple dress with white trim, purple bow, sparkly purple eyes, holding a carrot
- **Levels**: 9-10 (Rainbow Zone)

## Usage

### Import individual characters:
```typescript
import { RosieCharacter, ChesterCharacter, PipCharacter, VioletCharacter } from '@/components/characters';

// Use in your component
<RosieCharacter size="medium" animated={true} pose="standing" />
```

### Use the generic selector:
```typescript
import { RescueBunny } from '@/components/characters';

// Index 0=Rosie, 1=Chester, 2=Pip, 3=Violet
<RescueBunny index={0} size="medium" animated={true} pose="standing" />
```

### Integration with Level Config:
```typescript
import { getBunnyIndexForLevel } from '@/core/levelConfig';
import { RescueBunny } from '@/components/characters';

const bunnyIndex = getBunnyIndexForLevel(levelId);
<RescueBunny index={bunnyIndex} size="small" pose="trapped" />
```

## Props

```typescript
interface RescueBunnyProps {
  size?: 'small' | 'medium' | 'large';   // Size of the character (default: 'medium')
  animated?: boolean;                      // Enable CSS animations (default: false)
  pose?: 'standing' | 'trapped' | 'rescued'; // Character pose (default: 'standing')
  className?: string;                      // Additional CSS classes
}
```

## Poses

- **standing**: Default upright standing pose (gentle sway animation when animated)
- **trapped**: Same character with cage bars overlay and sad expression (shiver animation)
- **rescued**: Celebrating with arms up, big smile (bouncing joy animation)

## Sizes

- **small**: 80x80 pixels
- **medium**: 120x120 pixels (default)
- **large**: 180x180 pixels

## Animations

When `animated={true}`:
- **standing pose**: Gentle left-right sway (`rescueBunnySway`)
- **trapped pose**: Slight shaking/trembling (`bunnyShiver`)
- **rescued pose**: Bouncing joy (`rescueBunnyJoy`)

All animations are defined in `app/globals.css`.

## Demo

Visit `/characters-test` to see all characters in all poses and sizes with animations.
