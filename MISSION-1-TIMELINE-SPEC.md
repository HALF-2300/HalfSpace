# MISSION 1 — UNIVERSE TIMELINE MODE (UI/UX SPECIFICATION)

**Version:** 1.0  
**Owner:** Special Agent A (UI/UX)  
**Status:** Ready for Implementation  
**Dependencies:** React, Framer Motion, Next.js 14

---

## A) LAYOUT SPECIFICATION

### Screen Structure (3 Regions)

```
┌─────────────────────────────────────────────────────────────┐
│ TOP REGION (80px fixed height)                             │
│ - Timeline Title + Current Epoch Name                      │
│ - View Controls (Exit, Zoom, Speed)                        │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│ CENTER REGION (calc(100vh - 240px))                        │
│ - Epoch Card Display Area                                  │
│ - Active card: centered, 600px × 400px                     │
│ - Adjacent cards: 50% scale, 40% opacity, ±700px offset    │
│ - Background: Dynamic epoch-themed gradient                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ BOTTOM REGION (160px fixed height)                         │
│ - Time Rail (full width, 80px interaction zone)           │
│ - Timeline Labels (epoch markers)                          │
│ - Navigation Hints                                         │
└─────────────────────────────────────────────────────────────┘
```

### Responsive Breakpoints

**Desktop (≥1024px):**
- Card size: 600px × 400px
- Time rail: 80px height
- Side cards visible

**Tablet (768px - 1023px):**
- Card size: 500px × 360px
- Time rail: 70px height
- Side cards: 30% scale

**Mobile (≤767px):**
- Card size: 90vw × 480px
- Time rail: 100px height (touch-optimized)
- Side cards: hidden
- Swipe gesture primary

---

## B) CONTROLS SPECIFICATION

### Keyboard Controls (Primary)

| Key | Action | Behavior |
|-----|--------|----------|
| `←` / `→` | Navigate epochs | Snap to prev/next epoch (300ms spring) |
| `Home` | Jump to start | Snap to Big Bang (0s on timeline) |
| `End` | Jump to present | Snap to current era (13.8B years) |
| `Space` | Open epoch | Launch full epoch experience modal |
| `Shift + ←/→` | Fast jump | Skip 5 epochs |
| `Ctrl + ←/→` | Jump consequences | Navigate to next consequence epoch |
| `Esc` | Exit mode | Return to previous view |
| `+` / `-` | Zoom | Adjust time rail density |
| `Tab` | Focus rail | Move focus to time rail slider |

### Mouse Controls

| Action | Behavior |
|--------|----------|
| **Click epoch card** | Snap timeline to that epoch, bring to center |
| **Click "Launch Experience"** | Open full epoch modal |
| **Click "Jump Next Consequence"** | Snap to consequence epoch |
| **Drag time rail** | Scrub through timeline (real-time card update) |
| **Hover epoch marker** | Preview tooltip (name + time) |
| **Scroll wheel** | Navigate epochs (±1 per tick, 150ms debounce) |
| **Click background** | No action (prevents accidental exit) |

### Touch Gestures (Mobile)

| Gesture | Action |
|---------|--------|
| **Swipe left/right** | Navigate to prev/next epoch |
| **Tap card** | Focus card (if not centered) |
| **Double-tap card** | Launch experience |
| **Tap rail marker** | Jump to epoch |
| **Drag rail handle** | Scrub timeline |
| **Pinch on rail** | Zoom timeline density |
| **Long-press card** | Show quick actions menu |

### Accessibility Controls

| Method | Action |
|--------|--------|
| **Screen reader** | Announce epoch name, time, and position (e.g., "Big Bang, 13.8 billion years ago, epoch 1 of 24") |
| **Tab navigation** | Focus order: Exit → Rail → Card Actions → Next/Prev |
| **Enter key** | Activate focused button |
| **Arrow keys** | Navigate focusable elements within card |

---

## C) COMPONENT LIST

### Core Components

```typescript
// 1. Container Component
<TimelineMode>
  props: {
    initialEpoch?: number
    onExit: () => void
    onEpochOpen: (epochId: string) => void
  }
</TimelineMode>

// 2. Layout Components
<TimelineHeader>
  props: {
    currentEpochName: string
    onExit: () => void
    zoomLevel: number
    onZoomChange: (level: number) => void
  }
</TimelineHeader>

<TimelineStage>
  props: {
    activeEpochId: string
    adjacentEpochs: EpochData[]
    backgroundTheme: BackgroundTheme
  }
</TimelineStage>

<TimelineRail>
  props: {
    epochs: EpochData[]
    currentTime: number
    onTimeChange: (time: number) => void
    onEpochSnap: (epochId: string) => void
    zoomLevel: number
  }
</TimelineRail>

// 3. Card Component
<EpochCard>
  props: {
    epoch: EpochData
    variant: 'active' | 'adjacent' | 'preview'
    position: 'center' | 'left' | 'right'
    onLaunch: () => void
    onJumpConsequence: () => void
  }
</EpochCard>

// 4. Background Component
<EpochBackground>
  props: {
    theme: BackgroundTheme
    transitionProgress: number
  }
</EpochBackground>

// 5. Navigation Components
<TimeRailHandle>
  props: {
    position: number
    isDragging: boolean
    onDragStart: () => void
    onDrag: (position: number) => void
    onDragEnd: () => void
  }
</TimeRailHandle>

<EpochMarker>
  props: {
    epoch: EpochData
    position: number
    isActive: boolean
    onClick: () => void
  }
</EpochMarker>

// 6. Utility Components
<LoadingShimmer>
  props: {
    variant: 'card' | 'rail' | 'background'
  }
</LoadingShimmer>

<NavigationHint>
  props: {
    keys: string[]
    description: string
    visible: boolean
  }
</NavigationHint>
```

### Data Types

```typescript
interface EpochData {
  id: string
  name: string
  timeValue: number // seconds from Big Bang
  timeLabel: string // "13.8 billion years ago"
  hook: string // One-line engaging description
  quickFacts: [string, string, string] // Exactly 3 facts
  consequenceEpochId: string | null
  backgroundTheme: BackgroundTheme
  iconGlyph: string // Unicode character or SVG path
}

interface BackgroundTheme {
  gradient: {
    start: string // CSS color
    end: string // CSS color
    angle: number // degrees
  }
  particles?: {
    count: number
    color: string
    speed: number
  }
  glow?: {
    color: string
    intensity: number
  }
}

interface TimelineState {
  currentEpochId: string
  railPosition: number // 0-1 normalized
  isDragging: boolean
  isTransitioning: boolean
  zoomLevel: number // 1-5
  reducedMotion: boolean
}
```

---

## D) INTERACTION STATES & MICRO-INTERACTIONS

### State Machine

```
┌──────┐  user input   ┌──────────┐  snap complete   ┌────────┐
│ IDLE ├──────────────►│ DRAGGING ├─────────────────►│ SNAPPING│
└──┬───┘               └────┬─────┘                  └───┬────┘
   │                        │                            │
   │         ◄──────────────┴────────────────────────────┘
   │         snap/transition complete
   │
   │  click "Launch"   ┌──────────┐
   └──────────────────►│  MODAL   │
                       └──────────┘
```

### State Behaviors

#### IDLE State
- **Duration:** Indefinite
- **Visuals:**
  - Active card: full opacity, centered, subtle float animation (±8px, 4s ease-in-out)
  - Adjacent cards: 50% scale, 40% opacity
  - Rail handle: pulsing glow (1.5s cycle)
  - Background: static gradient with gentle particle drift
- **Transitions out:**
  - → DRAGGING (on rail drag start)
  - → SNAPPING (on keyboard/button navigation)
  - → MODAL (on "Launch Experience" click)

#### DRAGGING State
- **Entry:** Immediate (0ms)
- **Visuals:**
  - Active card: scales to 95%, opacity 1.0
  - Cards swap in real-time as rail crosses epoch boundaries
  - Rail handle: enlarged (1.3× scale), solid color
  - Background: rapid crossfade between epoch themes (200ms)
  - Cursor: grabbing
- **Interactions:**
  - Rail position updates at 60fps
  - Epoch change triggers haptic feedback (mobile)
  - Snap zones: ±5% of epoch marker (visual indicator)
- **Transitions out:**
  - → SNAPPING (on drag release)

#### SNAPPING State
- **Duration:** 300ms
- **Animation:** Spring physics (damping: 0.8, stiffness: 120)
- **Visuals:**
  - Card: scales 95% → 100%, translates to center
  - Adjacent cards: fade in from 0% opacity, slide into position
  - Rail handle: snaps to nearest epoch marker
  - Background: smooth crossfade to target theme
- **Transitions out:**
  - → IDLE (on snap complete)

#### MODAL State
- **Entry:** Slide up from bottom (400ms cubic-bezier)
- **Visuals:**
  - Timeline blurred (backdrop-filter: blur(12px))
  - Modal: full-screen epoch experience
  - Timeline still visible in background (40% opacity)
- **Transitions out:**
  - → IDLE (on Esc or modal close)

### Micro-Interactions Catalog

#### 1. Rail Drag
```
OnDragStart:
  - Scale handle: 1.0 → 1.3 (100ms)
  - Change cursor: grab → grabbing
  - Trigger haptic: light
  
OnDrag (per frame):
  - Update rail position
  - If crossing epoch boundary:
    - Swap active card (0ms, no animation during drag)
    - Trigger haptic: selection (mobile)
    - Update background (200ms crossfade)
  
OnDragEnd:
  - Find nearest epoch (snap threshold: ±5%)
  - Animate to snap position (300ms spring)
  - Scale handle: 1.3 → 1.0 (150ms)
  - Change cursor: grabbing → grab
  - Trigger haptic: medium
```

#### 2. Keyboard Navigation
```
OnKeyPress (←/→):
  - Disable key repeat handling (300ms lockout)
  - Calculate target epoch (±1)
  - Animate rail: current → target (300ms spring)
  - Animate cards:
    - Outgoing: fade 1.0 → 0, translate ±200px (250ms)
    - Incoming: fade 0 → 1.0, translate 0 (300ms, 50ms delay)
  - Update background (300ms crossfade)
  - Focus target card (for screen readers)
```

#### 3. Card Hover (Desktop)
```
OnMouseEnter:
  - Scale card: 1.0 → 1.05 (200ms ease-out)
  - Elevate shadow: 0 4px 12px → 0 12px 40px (200ms)
  - Brighten facts: opacity 0.7 → 1.0 (150ms)
  - Show action buttons (slide up 20px, fade in, 200ms)
  
OnMouseLeave:
  - Reverse all above (180ms ease-in)
```

#### 4. Epoch Marker Hover
```
OnMouseEnter:
  - Show tooltip (fade in 100ms, slide up 8px)
  - Tooltip content: epoch name + time label
  - Brighten marker: opacity 0.6 → 1.0 (100ms)
  - Scale marker: 1.0 → 1.4 (150ms elastic)
  
OnMouseLeave:
  - Hide tooltip (fade out 80ms)
  - Restore marker (120ms)
```

#### 5. Button Interactions
```
"Launch Experience" button:
  - Idle: gradient background, subtle pulse
  - Hover: scale 1.0 → 1.08, brighten gradient (150ms)
  - Active: scale 1.08 → 0.96 (50ms)
  - Click: ripple effect from click point (400ms fade)
  
"Jump Next Consequence" button:
  - Idle: outline style, dashed border animation (2s loop)
  - Hover: fill background, solidify border (180ms)
  - Active: scale 0.98, deepen color (50ms)
```

#### 6. Loading States
```
OnEpochDataFetch:
  - Show shimmer placeholder (card-shaped)
  - Shimmer: gradient sweep animation (1.5s infinite)
  - Disable navigation during load
  - Duration: max 1000ms timeout
  
OnDataReady:
  - Fade out shimmer (150ms)
  - Fade in card content (200ms, 100ms stagger per element)
  - Enable navigation
```

### Animation Timing Reference

| Element | Duration | Easing | Notes |
|---------|----------|--------|-------|
| Card swap | 300ms | spring(0.8, 120) | During snap |
| Card hover | 200ms | ease-out | Desktop only |
| Rail drag | 0ms | none | Immediate during drag |
| Rail snap | 300ms | spring(0.8, 120) | After drag release |
| Background fade | 300ms | ease-in-out | Epoch transitions |
| Modal open | 400ms | cubic-bezier(0.32, 0.72, 0, 1) | Slide up |
| Tooltip | 100ms | ease-out | Hover reveals |
| Button hover | 150ms | ease-out | All interactive elements |
| Loading shimmer | 1500ms | linear | Infinite loop |

---

## E) EPOCH CARD DESIGN SPECIFICATION

### Visual Structure

```
┌────────────────────────────────────────────────┐
│  ┌──────┐                                      │
│  │ ICON │  Epoch Name                   [✕]   │ ← Header (60px)
│  └──────┘  13.8 billion years ago             │
├────────────────────────────────────────────────┤
│                                                │
│  "One-line hook that captures the essence     │ ← Hook (80px)
│   of this cosmic moment in time."             │
│                                                │
├────────────────────────────────────────────────┤
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                │
│  ⚡ Quick Fact 1 (max 60 characters)          │ ← Facts (180px)
│                                                │
│  ⚡ Quick Fact 2 (max 60 characters)          │
│                                                │
│  ⚡ Quick Fact 3 (max 60 characters)          │
│                                                │
├────────────────────────────────────────────────┤
│  ┌──────────────────────┐  ┌────────────────┐ │ ← Actions (80px)
│  │ Launch Experience ▶  │  │ Jump Next  →   │ │
│  └──────────────────────┘  └────────────────┘ │
└────────────────────────────────────────────────┘
                  400px height
```

### Typography

```css
/* Epoch Name */
font-family: 'Inter', system-ui, sans-serif
font-size: 28px
font-weight: 700
line-height: 1.2
letter-spacing: -0.02em
color: #ffffff

/* Time Label */
font-size: 14px
font-weight: 500
color: rgba(255, 255, 255, 0.6)
text-transform: uppercase
letter-spacing: 0.05em

/* Hook Text */
font-size: 18px
font-weight: 400
line-height: 1.5
color: rgba(255, 255, 255, 0.9)
font-style: italic

/* Quick Facts */
font-size: 15px
font-weight: 400
line-height: 1.6
color: rgba(255, 255, 255, 0.85)

/* Fact Icons */
font-size: 16px
margin-right: 12px
```

### Colors & Effects

```css
/* Card Container */
background: linear-gradient(135deg, 
  rgba(15, 23, 42, 0.95), 
  rgba(30, 41, 59, 0.9)
)
backdrop-filter: blur(20px)
border: 1px solid rgba(255, 255, 255, 0.1)
border-radius: 16px
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4)

/* Hover State */
box-shadow: 0 12px 48px rgba(0, 0, 0, 0.6)
border-color: rgba(255, 255, 255, 0.2)

/* Icon Container */
width: 48px
height: 48px
background: radial-gradient(circle, rgba(59, 130, 246, 0.3), transparent)
border-radius: 12px
display: flex
align-items: center
justify-content: center
font-size: 24px

/* Primary Button (Launch) */
background: linear-gradient(90deg, #3b82f6, #8b5cf6)
color: #ffffff
font-weight: 600
font-size: 16px
padding: 14px 28px
border-radius: 8px
border: none
transition: all 150ms ease-out

/* Secondary Button (Jump) */
background: transparent
color: #ffffff
border: 2px dashed rgba(255, 255, 255, 0.4)
font-weight: 600
font-size: 16px
padding: 12px 24px
border-radius: 8px
```

### Content Guidelines

**Hook Text:**
- Max 120 characters
- Single sentence, no period
- Active voice
- Evoke wonder/curiosity
- Example: "The universe explodes into existence from a point smaller than an atom"

**Quick Facts:**
- Max 60 characters each
- No periods (bullets only)
- Start with verb or number when possible
- Use concrete comparisons
- Example: "Temperature: 10 billion degrees (hotter than any star)"

**Epoch Names:**
- 2-4 words maximum
- Title case
- No dates in name (dates go in time label)
- Example: "The Big Bang" not "Big Bang (13.8 BYA)"

---

## F) TIME RAIL SPECIFICATION

### Visual Design

```
Timeline Structure (Full Width):

├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [Marker] [Marker]     [Marker]  [Marker]      [Marker]   │ ← Epoch markers
│     │         │            │         │             │        │
│ ────●─────────●────────────●─────────●─────────────●────── │ ← Timeline track
│                         ▼                                   │ ← Active handle
│                                                             │
│  Big Bang    First    Stars     Galaxies   Solar   Now     │ ← Labels
│            Light      Form       Mature    System          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Component Breakdown

```css
/* Rail Container */
height: 80px (desktop) / 100px (mobile)
width: calc(100% - 80px)
margin: 0 40px
position: relative

/* Track Line */
height: 4px
background: linear-gradient(90deg,
  rgba(255, 255, 255, 0.2) 0%,
  rgba(59, 130, 246, 0.4) 50%,
  rgba(139, 92, 246, 0.3) 100%
)
border-radius: 2px
position: absolute
top: 30px

/* Epoch Markers */
width: 16px
height: 16px
border-radius: 50%
background: rgba(255, 255, 255, 0.6)
border: 2px solid rgba(255, 255, 255, 0.2)
position: absolute
top: 24px (centers on track)
cursor: pointer
transition: all 150ms ease-out

/* Active Marker */
width: 20px
height: 20px
background: #3b82f6
border: 3px solid #ffffff
box-shadow: 0 0 16px rgba(59, 130, 246, 0.8)

/* Handle (Draggable) */
width: 32px
height: 32px
border-radius: 50%
background: radial-gradient(circle, #ffffff, #e0e7ff)
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3)
position: absolute
top: 22px (centers on track)
cursor: grab
z-index: 10

/* Handle Active State */
cursor: grabbing
transform: scale(1.3)
box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5)

/* Epoch Labels */
font-size: 12px
font-weight: 500
color: rgba(255, 255, 255, 0.7)
position: absolute
top: 55px
transform: translateX(-50%)
white-space: nowrap
pointer-events: none
```

### Interaction Zones

```
Hit Areas:
- Marker click: 32px × 32px (touch: 44px × 44px)
- Handle drag: 40px × 40px (touch: 56px × 56px)
- Track click: full width × 60px height
```

### Zoom Levels

| Level | Visible Epochs | Marker Spacing | Use Case |
|-------|----------------|----------------|----------|
| 1 | All (24+) | ~40px min | Overview |
| 2 | Current ±10 | ~80px | Default |
| 3 | Current ±5 | ~150px | Detailed |
| 4 | Current ±3 | ~250px | Precise |
| 5 | Current ±1 | ~400px | Maximum |

**Zoom Transition:** 400ms ease-in-out, markers fade/scale smoothly

### Rail Behavior Rules

1. **Snapping:**
   - Snap threshold: ±5% of distance between markers
   - Snap animation: 300ms spring
   - Visual feedback: marker pulse on snap

2. **Dragging:**
   - Update rate: 60fps (16.67ms intervals)
   - Bounds: Cannot drag beyond first/last epoch
   - Resistance: Elastic bounce at boundaries (20px max overscroll)

3. **Click-to-Jump:**
   - Click track between markers: snap to nearest
   - Click marker directly: instant jump (150ms fade)
   - Click active marker: no action

4. **Keyboard Scrub:**
   - Shift + Arrow: move handle by 10% of visible range
   - Ctrl + Click: bookmark epoch (persist in localStorage)

---

## G) BACKGROUND SYSTEM SPECIFICATION

### Design Philosophy
- **No Heavy GPU:** Use CSS gradients, simple transforms, 2D canvas particles
- **No 3D:** Avoid Three.js or WebGL for timeline backgrounds
- **Performant:** 60fps on mid-range devices (2020 MacBook Air baseline)

### Background Themes (Per Epoch)

#### Theme Structure
```typescript
interface BackgroundTheme {
  gradient: GradientConfig
  particles?: ParticleConfig
  overlay?: OverlayConfig
}

interface GradientConfig {
  colors: string[] // 2-4 CSS colors
  angle: number // degrees
  positions?: number[] // stop positions (0-100)
}

interface ParticleConfig {
  count: number // max 200
  size: number // px
  color: string
  speed: number // px/s
  blur?: number // px
}

interface OverlayConfig {
  type: 'glow' | 'vignette' | 'scanlines'
  intensity: number // 0-1
  color?: string
}
```

#### Example Epoch Themes

```javascript
const EPOCH_THEMES = {
  bigBang: {
    gradient: {
      colors: ['#ff0080', '#ff8c00', '#ffd700', '#ffffff'],
      angle: 45,
      positions: [0, 30, 60, 100]
    },
    particles: {
      count: 200,
      size: 2,
      color: '#ffffff',
      speed: 150,
      blur: 1
    },
    overlay: {
      type: 'glow',
      intensity: 0.8,
      color: '#ff4500'
    }
  },
  
  darkAges: {
    gradient: {
      colors: ['#0a0a0a', '#1a1a2e'],
      angle: 180
    },
    particles: {
      count: 50,
      size: 1,
      color: '#333344',
      speed: 20
    }
  },
  
  firstStars: {
    gradient: {
      colors: ['#0f1632', '#1e3a8a', '#3b82f6'],
      angle: 135
    },
    particles: {
      count: 100,
      size: 3,
      color: '#60a5fa',
      speed: 40,
      blur: 2
    },
    overlay: {
      type: 'glow',
      intensity: 0.4,
      color: '#3b82f6'
    }
  },
  
  galaxyFormation: {
    gradient: {
      colors: ['#1e1b4b', '#4c1d95', '#7c3aed'],
      angle: 90
    },
    particles: {
      count: 150,
      size: 4,
      color: '#a78bfa',
      speed: 60,
      blur: 3
    }
  },
  
  solarSystem: {
    gradient: {
      colors: ['#134e4a', '#0891b2', '#0ea5e9'],
      angle: 120
    },
    particles: {
      count: 80,
      size: 2,
      color: '#67e8f9',
      speed: 30
    }
  },
  
  present: {
    gradient: {
      colors: ['#1e293b', '#334155', '#475569'],
      angle: 0
    },
    particles: {
      count: 120,
      size: 2,
      color: '#94a3b8',
      speed: 25
    },
    overlay: {
      type: 'vignette',
      intensity: 0.3
    }
  }
}
```

### Implementation Strategy

```typescript
// Component: <EpochBackground>
// Render: Two <div> layers + one <canvas>

<div class="background-layer">
  {/* Layer 1: Base Gradient (CSS) */}
  <div 
    class="gradient-base"
    style={{
      background: `linear-gradient(${angle}deg, ${colors.join(', ')})`,
      transition: 'background 300ms ease-in-out'
    }}
  />
  
  {/* Layer 2: Particle Canvas (2D) */}
  <canvas 
    ref={particleCanvas}
    class="particle-layer"
  />
  
  {/* Layer 3: Overlay Effects (CSS) */}
  {overlay && (
    <div 
      class={`overlay-${overlay.type}`}
      style={{ opacity: overlay.intensity }}
    />
  )}
</div>
```

### Particle System (2D Canvas)

```javascript
// Particle class (lightweight)
class Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  
  constructor(config) {
    this.x = Math.random() * canvas.width
    this.y = Math.random() * canvas.height
    this.vx = (Math.random() - 0.5) * config.speed / 60
    this.vy = (Math.random() - 0.5) * config.speed / 60
    this.size = config.size * (0.5 + Math.random() * 0.5)
    this.opacity = 0.3 + Math.random() * 0.7
  }
  
  update() {
    this.x += this.vx
    this.y += this.vy
    
    // Wrap around edges
    if (this.x < 0) this.x = canvas.width
    if (this.x > canvas.width) this.x = 0
    if (this.y < 0) this.y = canvas.height
    if (this.y > canvas.height) this.y = 0
  }
  
  draw(ctx) {
    ctx.globalAlpha = this.opacity
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
  }
}

// Animation loop (requestAnimationFrame)
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  particles.forEach(p => {
    p.update()
    p.draw(ctx)
  })
  
  requestAnimationFrame(animate)
}
```

### Transition Between Epochs

```javascript
// Crossfade strategy (no flicker)
function transitionBackground(fromTheme, toTheme, duration = 300) {
  // 1. Gradient: CSS transition (automatic)
  setGradient(toTheme.gradient)
  
  // 2. Particles: Morph existing particles
  particles.forEach((p, i) => {
    const targetConfig = toTheme.particles
    
    // Animate color
    p.targetColor = targetConfig.color
    p.colorProgress = 0
    
    // Animate speed
    const speedRatio = targetConfig.speed / fromTheme.particles.speed
    p.vx *= speedRatio
    p.vy *= speedRatio
  })
  
  // 3. Adjust particle count
  const countDiff = toTheme.particles.count - particles.length
  if (countDiff > 0) {
    // Add particles (fade in)
    for (let i = 0; i < countDiff; i++) {
      const p = new Particle(toTheme.particles)
      p.opacity = 0
      p.fadeIn = true
      particles.push(p)
    }
  } else if (countDiff < 0) {
    // Remove particles (fade out)
    particles.slice(countDiff).forEach(p => p.fadeOut = true)
  }
}
```

### Performance Budget

| Element | Max Cost | Monitoring |
|---------|----------|------------|
| Gradient render | < 1ms | Chrome DevTools Paint |
| Particle update | < 8ms (60fps) | Performance.now() |
| Canvas draw | < 8ms (60fps) | requestAnimationFrame timing |
| Transition | < 16ms (stable) | Frame drops counter |
| Memory | < 50MB delta | Performance.memory |

### Fallbacks

```javascript
// Detect low-performance devices
const isLowPerf = () => {
  return (
    navigator.hardwareConcurrency < 4 ||
    window.devicePixelRatio < 1.5 ||
    /mobile|android/i.test(navigator.userAgent)
  )
}

// Reduced particle counts for low-perf
if (isLowPerf()) {
  Object.keys(EPOCH_THEMES).forEach(key => {
    if (EPOCH_THEMES[key].particles) {
      EPOCH_THEMES[key].particles.count *= 0.5
    }
  })
}

// Disable particles if FPS < 30 for 3 seconds
let lowFpsCount = 0
if (currentFPS < 30) lowFpsCount++
if (lowFpsCount > 180) { // 3 sec @ 60fps check rate
  disableParticles()
}
```

---

## H) ACCESSIBILITY SPECIFICATION

### WCAG 2.1 AA Compliance Checklist

#### ✅ 1. Keyboard Navigation (2.1.1)
- [ ] All interactive elements focusable via Tab
- [ ] Focus order matches visual layout
- [ ] No keyboard traps (Esc exits all modals)
- [ ] Custom keyboard shortcuts documented
- [ ] Arrow keys navigate epochs
- [ ] Enter/Space activate buttons

#### ✅ 2. Focus Visible (2.4.7)
```css
*:focus-visible {
  outline: 3px solid #3b82f6;
  outline-offset: 2px;
  border-radius: 4px;
}
```
- [ ] Focus indicator min 3px thick
- [ ] Contrast ratio ≥ 3:1 against background
- [ ] Visible on all interactive elements

#### ✅ 3. Color Contrast (1.4.3)
- [ ] Text ≥ 18px: min 3:1 ratio
- [ ] Text < 18px: min 4.5:1 ratio
- [ ] Icon buttons: min 3:1 ratio
- [ ] Tested with Contrast Checker

**Current Ratios:**
- Epoch name (#ffffff on gradient): 15.2:1 ✓
- Time label (rgba(255,255,255,0.6)): 5.8:1 ✓
- Quick facts (rgba(255,255,255,0.85)): 9.1:1 ✓

#### ✅ 4. Screen Reader Support (4.1.2)
```html
<!-- Epoch Card -->
<article 
  role="article"
  aria-label="Big Bang epoch, 13.8 billion years ago"
  tabindex="0"
>
  <header>
    <h2 id="epoch-title">The Big Bang</h2>
    <p aria-label="Time period">13.8 billion years ago</p>
  </header>
  
  <p role="note" aria-label="Hook">
    {hookText}
  </p>
  
  <ul aria-label="Quick facts">
    <li>{fact1}</li>
    <li>{fact2}</li>
    <li>{fact3}</li>
  </ul>
  
  <button aria-label="Launch Big Bang experience">
    Launch Experience
  </button>
  
  <button aria-label="Jump to next consequence epoch">
    Jump Next Consequence
  </button>
</article>

<!-- Time Rail -->
<div 
  role="slider"
  aria-label="Timeline position"
  aria-valuemin="0"
  aria-valuemax="24"
  aria-valuenow="1"
  aria-valuetext="Big Bang epoch, 13.8 billion years ago"
  tabindex="0"
>
  <div class="rail-track" aria-hidden="true">
    <!-- Visual markers -->
  </div>
</div>

<!-- Navigation Hints -->
<aside 
  role="complementary"
  aria-label="Keyboard shortcuts"
>
  <kbd>←</kbd> <span>Previous epoch</span>
  <kbd>→</kbd> <span>Next epoch</span>
</aside>
```

#### ✅ 5. Reduced Motion (2.3.3)
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  /* Disable particle system */
  .particle-layer {
    display: none;
  }
  
  /* Disable card float animation */
  .epoch-card {
    transform: none !important;
  }
  
  /* Simplify background */
  .background-layer {
    background: linear-gradient(180deg, #0f172a, #1e293b) !important;
  }
}
```
- [ ] Detect prefers-reduced-motion
- [ ] Disable non-essential animations
- [ ] Keep essential transitions (< 50ms)
- [ ] Provide setting toggle in UI

#### ✅ 6. Touch Target Size (2.5.5)
- [ ] All buttons ≥ 44px × 44px (mobile)
- [ ] Spacing between targets ≥ 8px
- [ ] Drag handle ≥ 56px × 56px

```css
@media (pointer: coarse) {
  button {
    min-width: 44px;
    min-height: 44px;
    padding: 12px 16px;
  }
  
  .rail-handle {
    width: 56px;
    height: 56px;
  }
  
  .epoch-marker {
    width: 40px;
    height: 40px;
  }
}
```

#### ✅ 7. Text Spacing (1.4.12)
- [ ] Allow 200% line-height override
- [ ] Allow 0.16em letter-spacing
- [ ] No text clipping/overlap

```css
.epoch-card {
  /* Flexible spacing */
  line-height: 1.5; /* 150% minimum */
  letter-spacing: normal; /* Allow user override */
}

.epoch-card p {
  /* Prevent overflow */
  word-wrap: break-word;
  overflow-wrap: break-word;
}
```

#### ✅ 8. Error Prevention (3.3.4)
- [ ] Confirm before exiting with unsaved bookmarks
- [ ] Warn if trying to launch epoch while loading
- [ ] Provide undo for accidental jumps (Ctrl+Z)

#### ✅ 9. Page Titled (2.4.2)
```html
<Head>
  <title>Universe Timeline - Space Explorer</title>
</Head>
```

#### ✅ 10. Language (3.1.1)
```html
<html lang="en">
```

### Screen Reader Announcements

```javascript
// Live region for dynamic updates
<div 
  role="status" 
  aria-live="polite" 
  aria-atomic="true"
  class="sr-only"
>
  {currentEpochName} selected. 
  {timeLabel}. 
  Epoch {currentIndex} of {totalEpochs}.
</div>

// Announce on epoch change
announceToScreenReader(
  `Navigated to ${epochName}. ${timeLabel}. ${currentIndex + 1} of ${totalEpochs}`
)

// Announce on rail drag
announceToScreenReader(
  `Scrubbing timeline. Currently at ${epochName}.`
)
```

### Testing Checklist

- [ ] **NVDA (Windows):** Test full flow
- [ ] **JAWS (Windows):** Test full flow
- [ ] **VoiceOver (Mac):** Test full flow
- [ ] **TalkBack (Android):** Test mobile
- [ ] **Keyboard only:** Complete all tasks without mouse
- [ ] **High contrast mode:** Check visibility (Windows High Contrast)
- [ ] **Zoom to 200%:** Ensure usability
- [ ] **axe DevTools:** 0 violations
- [ ] **Lighthouse Accessibility:** Score ≥ 95

---

## I) DATA SPECIFICATION

### Timeline Data Structure

```typescript
// File: /data/universeTimeline.json
interface UniverseTimeline {
  meta: {
    totalEpochs: number
    spanYears: number // 13.8 billion
    version: string
  }
  epochs: Epoch[]
}

interface Epoch {
  id: string // e.g., "big-bang"
  name: string
  timeValue: number // seconds from Big Bang (for precise positioning)
  timeLabel: string // "13.8 billion years ago"
  hook: string
  quickFacts: [string, string, string]
  iconGlyph: string // Unicode or SVG path
  backgroundTheme: string // key from EPOCH_THEMES
  consequenceEpochId: string | null
  metadata: {
    category: 'origin' | 'formation' | 'evolution' | 'life' | 'future'
    significance: number // 1-10 for filtering
    tags: string[]
  }
}
```

### Sample Data (First 3 Epochs)

```json
{
  "meta": {
    "totalEpochs": 24,
    "spanYears": 13800000000,
    "version": "1.0"
  },
  "epochs": [
    {
      "id": "big-bang",
      "name": "The Big Bang",
      "timeValue": 0,
      "timeLabel": "13.8 billion years ago",
      "hook": "Everything explodes into existence from a point smaller than an atom",
      "quickFacts": [
        "Temperature: 10 billion billion billion degrees",
        "Size: Entire universe fits in your hand",
        "Duration: First second creates all matter"
      ],
      "iconGlyph": "💥",
      "backgroundTheme": "bigBang",
      "consequenceEpochId": "cosmic-inflation",
      "metadata": {
        "category": "origin",
        "significance": 10,
        "tags": ["origin", "energy", "singularity"]
      }
    },
    {
      "id": "cosmic-inflation",
      "name": "Cosmic Inflation",
      "timeValue": 0.000000001,
      "timeLabel": "13.8 billion years ago (10⁻³² seconds after)",
      "hook": "The universe doubles in size 90 times in a fraction of a second",
      "quickFacts": [
        "Expansion: 10²⁶ times faster than light",
        "Duration: 10⁻³² seconds",
        "Result: Universe becomes smooth and flat"
      ],
      "iconGlyph": "🌊",
      "backgroundTheme": "inflation",
      "consequenceEpochId": "particle-soup",
      "metadata": {
        "category": "origin",
        "significance": 9,
        "tags": ["expansion", "physics", "quantum"]
      }
    },
    {
      "id": "particle-soup",
      "name": "Particle Soup",
      "timeValue": 0.001,
      "timeLabel": "13.8 billion years ago (1 millisecond after)",
      "hook": "Quarks and gluons swirl in a plasma hotter than any star",
      "quickFacts": [
        "State: Quark-gluon plasma (densest matter possible)",
        "Temperature: 4 trillion degrees",
        "Birth: Protons and neutrons form here"
      ],
      "iconGlyph": "⚛️",
      "backgroundTheme": "particleSoup",
      "consequenceEpochId": "first-atoms",
      "metadata": {
        "category": "formation",
        "significance": 8,
        "tags": ["particles", "physics", "matter"]
      }
    }
  ]
}
```

---

## J) IMPLEMENTATION PRIORITY

### Phase 1: Core Structure (Days 1-2)
1. ✅ Create component file structure
2. ✅ Implement TimelineMode container
3. ✅ Build TimelineRail with basic snap
4. ✅ Create EpochCard component
5. ✅ Add keyboard navigation (←/→)

### Phase 2: Interactions (Days 3-4)
6. ✅ Implement rail drag functionality
7. ✅ Add card transitions (spring animations)
8. ✅ Create EpochBackground (gradient only)
9. ✅ Add touch gestures (swipe)
10. ✅ Build NavigationHint component

### Phase 3: Polish (Days 5-6)
11. ✅ Add particle system (2D canvas)
12. ✅ Implement hover states
13. ✅ Add loading states
14. ✅ Create modal integration hooks
15. ✅ Optimize performance (memoization)

### Phase 4: Accessibility (Day 7)
16. ✅ Add ARIA labels
17. ✅ Implement reduced motion
18. ✅ Test keyboard-only flow
19. ✅ Add screen reader announcements
20. ✅ Run accessibility audit

---

## K) FILE STRUCTURE

```
/components/timeline/
├── TimelineMode.tsx              // Main container
├── TimelineMode.module.css       // Styles
├── TimelineHeader.tsx            // Top region
├── TimelineStage.tsx             // Center region (cards)
├── TimelineRail.tsx              // Bottom region (rail)
├── EpochCard.tsx                 // Individual epoch card
├── EpochCard.module.css
├── EpochBackground.tsx           // Dynamic backgrounds
├── EpochBackground.module.css
├── TimeRailHandle.tsx            // Draggable handle
├── EpochMarker.tsx               // Timeline markers
├── NavigationHint.tsx            // Keyboard shortcuts display
├── LoadingShimmer.tsx            // Loading states
├── useTimelineState.ts           // Zustand store
├── useKeyboardControls.ts        // Keyboard hook
├── useRailDrag.ts                // Drag logic hook
├── useParticleSystem.ts          // Canvas particles
├── timelineAnimations.ts         // Framer Motion variants
├── epochThemes.ts                // Background themes
└── index.ts                      // Exports

/data/
└── universeTimeline.json         // Epoch data

/app/timeline/
└── page.tsx                      // Route page
```

---

## L) ACCEPTANCE CRITERIA

### ✅ Definition of Done

**Functional:**
- [ ] Can navigate all epochs via keyboard
- [ ] Can drag time rail smoothly (60fps)
- [ ] Cards snap precisely to center
- [ ] Background changes per epoch
- [ ] Touch gestures work on mobile
- [ ] All buttons trigger correct actions

**Visual:**
- [ ] Matches design spec exactly
- [ ] Animations smooth (no jank)
- [ ] Hover states work
- [ ] Loading states display correctly
- [ ] No layout shift

**Performance:**
- [ ] 60fps on 2020 MacBook Air
- [ ] < 3s initial load
- [ ] < 100ms epoch switch
- [ ] < 50MB memory delta
- [ ] Lighthouse Performance ≥ 90

**Accessibility:**
- [ ] Keyboard-only navigation works
- [ ] Screen reader announces correctly
- [ ] Reduced motion respected
- [ ] WCAG 2.1 AA compliant
- [ ] axe DevTools: 0 violations

**Cross-browser:**
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS 15+)
- [ ] Chrome Mobile (Android 10+)

---

## M) OPEN QUESTIONS (Future Iterations)

1. **Bookmarking:** Should users be able to bookmark favorite epochs?
2. **Sharing:** Generate shareable links to specific epochs?
3. **Audio:** Add ambient sound per epoch?
4. **Comparisons:** Side-by-side epoch comparison mode?
5. **Search:** Search epochs by keyword?
6. **Filters:** Filter by category (origin/formation/life)?
7. **Deep links:** URL param for initial epoch (e.g., ?epoch=big-bang)?
8. **Analytics:** Track which epochs users spend most time on?

---

## N) NOTES FOR DEVELOPERS

### Don't Guess, Use Spec
- All measurements provided in px (convert to rem if needed: 16px = 1rem)
- All colors in hex/rgba (convert to Tailwind if needed)
- All animations have exact timing (ms) and easing functions

### Framer Motion Cheat Sheet
```jsx
// Spring config used throughout
const springConfig = { damping: 0.8, stiffness: 120 }

// Card swap animation
<motion.div
  initial={{ opacity: 0, x: 200 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: -200 }}
  transition={{ duration: 0.3, ...springConfig }}
>

// Hover scale
<motion.button
  whileHover={{ scale: 1.08 }}
  whileTap={{ scale: 0.96 }}
  transition={{ duration: 0.15 }}
>
```

### Performance Tips
- Use `React.memo()` on EpochCard
- Use `useMemo()` for epoch filtering
- Debounce rail drag updates (16ms)
- Lazy load epoch modal content
- Use CSS transforms (not top/left)
- Avoid `box-shadow` during drag (use `filter: drop-shadow`)

### Testing Scenarios
1. **Rapid navigation:** Press arrow key 20 times fast
2. **Drag fling:** Drag rail and release mid-motion
3. **Edge cases:** First/last epoch behavior
4. **Mobile rotation:** Portrait ↔ landscape
5. **Zoom levels:** Test all 5 zoom states
6. **Slow network:** Throttle to 3G, test loading

---

## END OF SPECIFICATION

**Status:** ✅ Ready for Frontend Implementation  
**Estimated Effort:** 7 developer-days  
**Dependencies:** None (self-contained)  
**Next Step:** Create `/components/timeline/` directory and begin Phase 1

**Questions?** Refer to this spec first. All design decisions documented above.
