# 🚀 Spaceport Components

## Overview

This folder contains all components for the **Galaxy City Spaceport** experience - an immersive, cinematic journey through space featuring:

- 🌌 **Spaceport Lobby**: A cinematic entrance with animated starfield and HUD
- 🔭 **Planetarium Dome**: Interactive 3D/2D space exploration
- ⚙️ **Control Panel**: Performance and visual quality controls

---

## Components

### 1. SpaceportLobby.tsx

**Purpose**: The entry point/lobby for the spaceport experience.

**Features**:
- Animated canvas starfield
- HUD display with system status
- Gateway entrance with glow effects
- Random cosmic quotes
- Statistics display
- Responsive design

**Props**:
```typescript
{
  onEnterPlanetarium: () => void  // Callback when entering planetarium
  quality: 'low' | 'medium' | 'high'  // Visual quality level
  animationEnabled: boolean  // Toggle animations
}
```

**Usage**:
```tsx
<SpaceportLobby
  onEnterPlanetarium={() => setScene('planetarium')}
  quality="medium"
  animationEnabled={true}
/>
```

---

### 2. PlanetariumDome.tsx

**Purpose**: Interactive dome displaying celestial objects with pan/zoom/rotate controls.

**Features**:
- Canvas-based 2D/3D rendering
- Mouse interactions (drag to pan/rotate, wheel to zoom)
- Clickable celestial objects
- Information cards on click
- "Take me somewhere" random scene teleport
- WebGL detection + 2D fallback
- Coordinate display

**Props**:
```typescript
{
  quality: 'low' | 'medium' | 'high'
  animationEnabled: boolean
  starDensity: number  // 0.3 - 2.0
  onBack: () => void
  spaceportData: {
    constellations: Array
    nebulae: Array
    deepSpaceObjects: Array
    scenes: Array
  }
}
```

**Data Structure**:
```typescript
CelestialObject {
  id: string
  name: string
  name_ar: string
  description: string
  description_ar: string
  position: { x, y, z }
  color: string
  type: 'constellation' | 'nebula' | 'deepspace'
  data: any  // Extra info (facts, distance, size, etc.)
}
```

**Usage**:
```tsx
<PlanetariumDome
  quality="high"
  animationEnabled={true}
  starDensity={1.2}
  onBack={() => setScene('lobby')}
  spaceportData={data}
/>
```

---

### 3. ControlPanel.tsx

**Purpose**: Floating control panel for adjusting visual settings.

**Features**:
- Quality presets (Low/Medium/High)
- Animation toggle
- Star density slider
- Quick presets (Performance/Balanced/Cinematic)
- Performance hints
- Slide-in panel with overlay

**Props**:
```typescript
{
  quality: 'low' | 'medium' | 'high'
  animationEnabled: boolean
  starDensity: number
  onQualityChange: (quality) => void
  onAnimationToggle: (enabled) => void
  onDensityChange: (density) => void
}
```

**Presets**:
- 🚀 **Performance**: low + no animations + 50% density
- ⚖️ **Balanced**: medium + animations + 100% density
- ✨ **Cinematic**: high + animations + 150% density

**Usage**:
```tsx
<ControlPanel
  quality={quality}
  animationEnabled={animationEnabled}
  starDensity={starDensity}
  onQualityChange={setQuality}
  onAnimationToggle={setAnimationEnabled}
  onDensityChange={setStarDensity}
/>
```

---

## Styles

### spaceport.module.css

All styles are scoped using CSS modules. Main sections:

1. **Lobby Styles** (`.lobby`, `.gateway`, `.hud`)
2. **Planetarium Styles** (`.planetarium`, `.objectCard`)
3. **Control Panel Styles** (`.controlPanel`, `.controlToggle`)

**Key animations**:
- `pulse` - Status dot pulsing
- `glowPulse` - Gateway glow effect
- `titleFloat` - Floating title
- `fadeInOut` - Scene banner
- `slideUp` - Object card entrance

---

## Performance Considerations

### Quality Levels

| Setting | Stars (Lobby) | Stars (Dome) | Impact |
|---------|---------------|--------------|--------|
| Low     | 50            | 100 × density | Best performance |
| Medium  | 100           | 300 × density | Balanced |
| High    | 200           | 600 × density | Best visuals |

### Automatic Detection

The page component automatically detects:
- Mobile devices
- CPU cores (< 4 = low-end)
- Available RAM (< 4GB = low-end)

And adjusts settings accordingly.

### Fallback System

1. **WebGL Check**: Detects if WebGL is available
2. **2D Fallback**: Uses Canvas 2D API if WebGL fails
3. **Performance Mode**: Reduces quality on slow devices
4. **Error Handling**: Graceful loading states and error screens

---

## Data Structure

The spaceport uses `public/data/spaceportData.json`:

```json
{
  "constellations": [
    {
      "id": "orion",
      "name": "Orion",
      "name_ar": "الجبّار",
      "description": "...",
      "description_ar": "...",
      "position": { "x": 0.3, "y": 0.4, "z": 0.2 },
      "color": "#4a9eff",
      "facts": ["...", "..."]
    }
  ],
  "nebulae": [...],
  "deepSpaceObjects": [...],
  "scenes": [
    {
      "id": "nebula-garden",
      "name": "Nebula Garden",
      "name_ar": "حديقة السدم",
      "description": "..."
    }
  ]
}
```

---

## Testing

### Manual Testing Checklist

**Lobby**:
- [ ] Stars animate smoothly
- [ ] HUD displays correctly
- [ ] Enter button responds
- [ ] Quote displays
- [ ] Stats show correct values

**Planetarium**:
- [ ] Stars render
- [ ] Can drag to pan/rotate
- [ ] Can zoom with mouse wheel
- [ ] Celestial objects are visible
- [ ] Clicking objects shows cards
- [ ] "Take me somewhere" works
- [ ] Exit button returns to lobby

**Control Panel**:
- [ ] Panel opens/closes
- [ ] Quality settings apply
- [ ] Animation toggle works
- [ ] Density slider updates
- [ ] Presets work

**Fallback**:
- [ ] Works on mobile
- [ ] Works without WebGL
- [ ] Auto-detects performance
- [ ] Error states display

---

## Browser Compatibility

**Tested on**:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

**Requires**:
- Canvas API (mandatory)
- WebGL (optional, has fallback)
- ES6+ JavaScript

---

## Future Enhancements

Potential improvements:
- [ ] Three.js integration for true 3D
- [ ] More celestial objects (galaxies, clusters)
- [ ] Sound effects (ambient space sounds)
- [ ] VR/AR mode
- [ ] Save favorite locations
- [ ] Guided tours
- [ ] Real astronomical data integration

---

## Credits

Built for the Space Explorer project.

**Technologies**:
- React
- TypeScript
- Canvas API
- CSS Modules
- Next.js
