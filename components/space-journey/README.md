# Space Journey Components

This directory contains all the React components for the Enhanced Space Journey experience.

## Components

### 1. **Planet3D.tsx**
3D planet renderer using Three.js

**Props:**
- `type`: 'terrestrial' | 'gas-giant' | 'ice-giant' | 'dwarf'
- `color`: Hex color string
- `rotationSpeed`: Number (default: 0.002)
- `hasRings`: Boolean (default: false)

**Features:**
- Procedural texture generation
- Auto-rotation
- Ring support for Saturn-like planets
- Atmospheric glow for gas giants
- Different textures per planet type

---

### 2. **ShootingStars.tsx**
Animated shooting star effects

**Props:**
- `speed`: Number (controls frequency and count)

**Features:**
- Dynamic star count based on speed
- Random trajectories
- Fade in/out animations
- Trail effects
- 3D positioning

---

### 3. **FactCard.tsx**
Educational facts display with navigation

**Props:**
- `facts`: String array

**Features:**
- Swipeable fact cards
- Dot indicators
- Previous/Next buttons
- Smooth transitions
- Minimum height to prevent layout shift

---

### 4. **AchievementPopup.tsx**
Achievement unlock notification

**Props:**
- `achievement`: Achievement object

**Features:**
- Animated entry/exit
- Glow effects
- Icon rotation
- Sparkle particles
- Auto-dismiss after 4 seconds
- Spring physics animations

---

### 5. **JourneyStats.tsx**
Real-time journey statistics display

**Props:**
- `distance`: String (AU)
- `time`: String (MM:SS format)
- `discoveries`: Number

**Features:**
- Compact HUD design
- Icon indicators
- Glass morphism style
- Responsive layout

---

### 6. **WormholeTransition.tsx**
Transition effect between stages

**Features:**
- Expanding rings animation
- Rotating portal
- Particle burst
- Loading text
- Full-screen overlay
- Infinite loop animation

---

### 7. **AudioController.tsx**
Audio enable/disable toggle

**Props:**
- `enabled`: Boolean
- `onToggle`: Function

**Features:**
- Visual state indicator
- Hover effects
- Volume icon toggle
- Green dot when active
- Tooltip support

---

### 8. **EnhancedStarfield.tsx**
Advanced starfield canvas renderer

**Props:**
- `speed`: Number (default: 1)
- `density`: Number (default: 1000)

**Features:**
- Multi-colored stars
- Size variation
- Glow effects for bright stars
- Responsive canvas
- 60 FPS performance

---

## Usage Example

```tsx
import Planet3D from '@/components/space-journey/Planet3D'
import { Canvas } from '@react-three/fiber'

<Canvas>
  <ambientLight intensity={0.5} />
  <pointLight position={[10, 10, 10]} />
  <Planet3D
    type="gas-giant"
    color="#f97316"
    rotationSpeed={0.004}
    hasRings={false}
  />
</Canvas>
```

## Dependencies

- React 18+
- Framer Motion
- Three.js
- @react-three/fiber
- @react-three/drei

## Performance Notes

- Planet3D uses canvas texture generation
- ShootingStars scales count with speed
- All animations use GPU acceleration
- Components are optimized for 60 FPS

## Styling

Components use:
- Tailwind CSS utility classes
- Glass morphism effects (`glass` class)
- Custom gradients
- CSS animations via Framer Motion
