# Galaxy Swim — The Ultimate Galaxy Experience

**"YOU ARE IN SPACE"** — An immersive 3D experience that puts you inside a spiral galaxy.

## 🌌 Overview

Galaxy Swim is a fully interactive 3D experience that allows users to explore a spiral galaxy in real-time. Built with Three.js and React Three Fiber, it provides an unprecedented level of immersion and scientific accuracy.

## ✨ Features

### Core Experience
- **3D Spiral Galaxy**: Rendered with 50,000-500,000 particles (quality-dependent)
- **Two Control Modes**:
  - **Auto Cruise**: Cinematic guided tour
  - **Free Swim**: Full manual control (WASD + Mouse)
- **Visual Effects**:
  - Depth-based parallax
  - Volumetric fog
  - Bloom post-processing
  - Nebula clouds
  - Twinkling stars
  - Shooting stars
  - Black hole with accretion disk

### Quality & Performance
- **4 Quality Presets**:
  - Low: 50K particles, 512px nebula
  - Medium: 150K particles, 1024px nebula
  - High: 300K particles, 2048px nebula
  - Ultra: 500K particles, 4096px nebula
- **Automatic Quality Adjustment**: FPS guard downgrades quality if performance drops
- **Motion Preferences**: Respects `prefers-reduced-motion`
- **WebGL Fallback**: Beautiful 2D canvas starfield if WebGL unavailable

### Educational Content
- **Moment Cards**: Pop up near interesting locations (Core, Nebula, Black Hole, etc.)
- **Learn More Modals**: Detailed scientific information
- **Deep Science Mode**: Contextual overlays with:
  - 8 scientific concepts
  - Real astronomical data
  - Key facts and measurements

### Navigation
- **Re-center**: Return to starting position
- **Teleport**: Jump to predefined locations:
  - Galactic Core
  - Spiral Arm
  - Nebula Region
  - Deep Space

## 📁 Project Structure

```
galaxy-swim/
├── data/
│   ├── hotspots.json           # Points of interest
│   └── scienceOverlay.json     # Educational content
├── engine/
│   ├── types.ts                # TypeScript definitions
│   ├── qualityManager.ts       # Quality presets & management
│   ├── fpsMonitor.ts           # Performance monitoring
│   └── controls.ts             # Camera & input handling
├── scene/
│   ├── Galaxy.tsx              # Main galaxy particle system
│   ├── Nebula.tsx              # Nebula clouds
│   ├── Stars.tsx               # Background stars & shooting stars
│   ├── BlackHoleEffect.tsx     # Black hole visualization
│   ├── GalaxyScene.tsx         # Main 3D scene
│   └── FallbackScene.tsx       # 2D canvas fallback
├── ui/
│   ├── HUD.tsx                 # Heads-up display
│   ├── MomentCard.tsx          # Hotspot cards
│   ├── LearnMoreModal.tsx      # Detailed info modals
│   ├── TeleportMenu.tsx        # Teleport destination menu
│   ├── ScienceOverlay.tsx      # Deep science mode overlay
│   └── Toast.tsx               # Notifications
├── utils/
│   └── webglDetect.ts          # WebGL detection
├── __tests__/
│   └── galaxy-swim.test.js     # Smoke tests
├── galaxy-swim.css             # Styles
├── page.tsx                    # Main page component
└── README.md                   # This file
```

## 🧪 Testing

### Run Smoke Tests
```bash
node app/space/galaxy-swim/__tests__/galaxy-swim.test.js
```

Tests verify:
- Data files are valid JSON
- Quality Manager functions correctly
- FPS Monitor tracks performance
- WebGL detection works
- Controls structure is valid

### Manual Testing Checklist

1. **Open Route**: Navigate to `/space/galaxy-swim`
2. **Initial Load**: Should see galaxy within 3 seconds
3. **Auto Cruise**: Should smoothly orbit around galaxy core
4. **Free Swim**: 
   - Click "Free Swim" button
   - Test WASD movement
   - Test Q/E for up/down
   - Test Shift for speed boost
   - Test mouse drag for camera rotation
5. **Quality Settings**:
   - Switch between Low/Medium/High/Ultra
   - Observe particle count changes
   - Monitor FPS
6. **Teleport**:
   - Click "Teleport" button
   - Select each destination
   - Verify camera moves to location
7. **Re-center**: Click and verify return to start
8. **Science Mode**:
   - Enable Deep Science Mode
   - Navigate near hotspots
   - Verify overlays appear with relevant content
9. **Moment Cards**:
   - Fly near hotspots (Core, Nebula, Arms)
   - Verify cards pop up
   - Click "Learn more"
   - Read detailed content
10. **Fallback Mode**:
    - Disable WebGL (browser dev tools or flag)
    - Verify 2D canvas starfield loads
    - Verify UI still functions

## ⚡ Performance Notes

### Particle Counts by Quality
- **Low**: 50,000 stars (mobile-friendly)
- **Medium**: 150,000 stars (recommended for most devices)
- **High**: 300,000 stars (gaming PCs)
- **Ultra**: 500,000 stars (high-end systems only)

### FPS Guard
- Monitors FPS continuously
- If FPS < 30 for 5+ seconds:
  - Automatically downgrades quality
  - Shows toast notification
  - Resets monitor to check new quality

### Optimization Techniques
- Additive blending for stars (GPU-friendly)
- Buffer geometries for particles
- Instanced meshes where possible
- Texture atlasing for nebulae
- Frustum culling
- Depth write disabled for transparent objects

## 🎨 Visual Design

### Color Palette
- **Core**: Yellow/Orange (#ff6b35)
- **Arms**: Blue/White (#00f5ff)
- **Nebulae**: Pink/Cyan/Purple
- **UI Primary**: Cyan (#00f5ff)
- **UI Accent**: Orange (#ff6b35)
- **Science Mode**: Purple (#a06cd5)

### Typography
- System fonts for performance
- Size hierarchy: 10px → 28px
- Text shadows for glow effects

## 🔧 Configuration

### Modifying Hotspots
Edit `data/hotspots.json`:
```json
{
  "id": "unique-id",
  "name": "Display Name",
  "position": [x, y, z],
  "radius": 50,
  "card": { ... },
  "learnMore": { ... }
}
```

### Adding Science Overlays
Edit `data/scienceOverlay.json`:
```json
{
  "id": "unique-id",
  "category": "Category",
  "title": "Title",
  "triggerConditions": {
    "zones": ["hotspot-id"],
    "minProximity": 150
  }
}
```

## 🌐 Browser Support

### Required
- WebGL 1.0+ (for full experience)
- ES6+ JavaScript support

### Recommended
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Fallback
- Any browser with Canvas 2D support

## 📊 Technical Specifications

- **Framework**: Next.js 14 (App Router)
- **3D Engine**: Three.js ^0.182.0
- **React Integration**: @react-three/fiber ^8.18.0
- **Post-processing**: postprocessing ^6.34.1
- **Helpers**: @react-three/drei ^9.122.0

## 🚀 Future Enhancements

Potential additions (not implemented):
- VR support
- Multi-player presence
- Custom galaxy parameters
- Save/share camera positions
- Screenshot capture
- Audio ambience
- More celestial objects (pulsars, quasars)

## 📝 Credits

Created as part of the Space Explorer project.

**Technology Stack**: Three.js, React Three Fiber, Next.js, TypeScript

**Scientific Content**: Based on current astronomical understanding of spiral galaxies, particularly the Milky Way.

---

**Done Definition Met**: ✓
- First 3 seconds deliver "I'm in space" feeling
- User can swim, control, and navigate
- Site doesn't crash on weak devices (quality downgrade + fallback)
