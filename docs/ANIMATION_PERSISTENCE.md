# Animation Persistence System

This document explains the animation persistence system implemented to prevent animations from re-triggering on language changes and route navigation.

## Problem

Previously, animations in the hero section would re-trigger every time:

- User changed language (locale)
- User navigated away and back to the homepage
- Components re-rendered due to state changes

This created a poor user experience where users would see the same animations repeatedly.

## Solution

We implemented an animation persistence system using React Context and custom hooks.

## Architecture

### 1. Animation Provider (`lib/providers/animation-provider.tsx`)

- Provides global state for tracking which animations have played
- Uses a `Set<string>` to store animation keys that have completed
- Offers methods to check, mark, and reset animation states

### 2. Persistent Animation Hook (`lib/hooks/usePersistentAnimation.ts`)

- Custom hook that wraps animation state logic
- Returns appropriate `initial` and `animate` values for Framer Motion
- Automatically marks animations as played after a delay
- Supports granular control over reset behavior

### 3. Component Updates

All hero section components now use the persistent animation system:

- `HeroContent.tsx` - Badge, title, and subtitle animations
- `HeroButtons.tsx` - Call-to-action button animations
- `HeroFooter.tsx` - Footer text animation
- `HeroStats.tsx` - Statistics counter animations
- `HeroBackground.tsx` - Background shape animations
- `FloatingIcons.tsx` - Floating icon animations
- `Navbar.tsx` - Navigation bar animation

## Usage

### Basic Usage

```tsx
import { usePersistentAnimation } from "@/lib/hooks/usePersistentAnimation";

function MyComponent() {
  const { initial, animate } = usePersistentAnimation({
    animationKey: "my-unique-animation",
    resetOnLocaleChange: false, // Don't reset on language change
    resetOnRouteChange: false, // Don't reset on navigation
  });

  return (
    <motion.div
      initial={initial} // "hidden" or "visible" based on state
      animate={animate} // Always "visible"
      variants={fadeUpVariants}
    >
      Content
    </motion.div>
  );
}
```

### Advanced Usage

```tsx
function MyComponent() {
  const { hasPlayed, resetAnimation } = usePersistentAnimation({
    animationKey: "my-animation",
  });

  // Skip expensive operations if animation already played
  if (hasPlayed) {
    return <StaticVersion />;
  }

  return <AnimatedVersion onComplete={markAsComplete} />;
}
```

## Key Features

### 1. Granular Control

- Each animation can have its own persistence settings
- Control reset behavior per animation
- Support for checking animation state without triggering

### 2. Automatic Cleanup

- Animations are marked as played after completion
- Configurable delay to ensure animations finish

### 3. Development Tools

- Debug utilities for testing (in development mode)
- Console helpers to reset animations
- Clear logging for troubleshooting

## Configuration Options

| Option                | Type      | Default | Description                         |
| --------------------- | --------- | ------- | ----------------------------------- |
| `animationKey`        | `string`  | -       | Unique identifier for the animation |
| `resetOnRouteChange`  | `boolean` | `false` | Reset animation on navigation       |
| `resetOnLocaleChange` | `boolean` | `false` | Reset animation on language change  |

## Animation Keys Used

- `hero-background` - Background shapes
- `hero-floating-icons` - Floating study icons
- `hero-badge` - Trust badge animation
- `hero-title` - Main title animation
- `hero-subtitle` - Subtitle animation
- `hero-buttons` - CTA buttons animation
- `hero-footer` - Footer text animation
- `hero-stats-container` - Stats container animation
- `hero-stats-1/2/3` - Individual stat animations
- `navbar` - Navigation bar animation

## Benefits

1. **Better UX**: Animations only play once per session
2. **Performance**: Reduced re-renders and animation calculations
3. **Consistency**: Predictable behavior across language changes
4. **Maintainable**: Clear separation of concerns
5. **Flexible**: Easy to configure per-component

## Troubleshooting

### Animations Not Playing

- Check if animation key is unique
- Verify persistence provider is wrapped around component
- Check browser console for errors

### Animations Re-playing Unexpectedly

- Ensure component keys aren't causing remounts
- Check `resetOnLocaleChange` and `resetOnRouteChange` settings
- Verify animation timing doesn't conflict

### Development Testing

```javascript
// In browser console (development mode only)
resetAllAnimations(); // Reset all and reload
resetHeroAnimations(); // Reset hero section animations
```

## Migration Guide

To migrate an existing animated component:

1. Import the hook:

```tsx
import { usePersistentAnimation } from "@/lib/hooks/usePersistentAnimation";
```

2. Replace hardcoded initial/animate values:

```tsx
// Before
<motion.div initial="hidden" animate="visible">

// After
const { initial, animate } = usePersistentAnimation({
  animationKey: "unique-key"
});
<motion.div initial={initial} animate={animate}>
```

3. Remove component keys that cause remounting:

```tsx
// Before
<MyComponent key={`component-${locale}`} />

// After
<MyComponent />
```

This system ensures a smooth, professional user experience while maintaining the visual appeal of the animations.
