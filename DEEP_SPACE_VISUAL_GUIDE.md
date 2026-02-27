# 🎨 Deep Space Visual Guide

## UI Element Locations

```
┌─────────────────────────────────────────────────────────────┐
│  NAVBAR (existing)                         [🎮] ← Console   │
│─────────────────────────────────────────────────────────────│
│                                                               │
│  ╔═══════════════════════════════════════╗                  │
│  ║  ENVIRONMENT LAYER (Background)       ║                  │
│  ║  • Deep space gradient                ║                  │
│  ║  • CSS stars (animated)               ║                  │
│  ║  • Noise texture overlay              ║                  │
│  ║  • Always visible, never blocks       ║                  │
│  ╚═══════════════════════════════════════╝                  │
│                                                               │
│  ┌───────────────────────────────────────┐                  │
│  │  PAGE CONTENT                         │                  │
│  │  • Homepage                           │                  │
│  │  • Enhanced with TodayInSpace card    │  ┌──────────────┐│
│  │  • Click card → /today page           │  │  CONSOLE     ││
│  │                                       │  │  PANEL       ││
│  └───────────────────────────────────────┘  │  (when open) ││
│                                              │              ││
│  FOOTER (existing)                           │  [Search]    ││
│                                              │  [Today]     ││
│                                              │  [Random]    ││
│                                              │  Saved (0)   ││
│                                              └──────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Global Search Modal (Ctrl+K)

```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│         ┌─────────────────────────────────────────┐         │
│         │ 🔍 [Search input...]           [ESC]    │         │
│         ├─────────────────────────────────────────┤         │
│         │ 📄 PAGES                                │         │
│         │   > Solar System                    →   │         │
│         │   > Planets                         →   │         │
│         │                                         │         │
│         │ 🪐 OBJECTS                              │         │
│         │   > Mars - The Red Planet          →   │         │
│         │   > Jupiter - King of planets      →   │         │
│         │                                         │         │
│         │ 🚀 MISSIONS                             │         │
│         │   > Apollo 11 - Moon landing       →   │         │
│         │                                         │         │
│         ├─────────────────────────────────────────┤         │
│         │ ↑↓ Navigate  ↵ Select  ESC Close       │         │
│         └─────────────────────────────────────────┘         │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Console Panel (Desktop)

```
Desktop View:
┌─────────────────────────────────────────────────────┐
│  Navbar                                    [🎮]     │
│                                         ┌──────────┐│
│  Content here                           │ Console  ││
│                                         │──────────││
│                                         │ 🔍 Search││
│                                         │          ││
│                                         │ Quick    ││
│                                         │ Actions: ││
│                                         │ [Today]  ││
│                                         │ [Random] ││
│                                         │          ││
│                                         │ Saved(0) ││
│                                         │          ││
│                                         └──────────┘│
└─────────────────────────────────────────────────────┘

Mobile View:
┌───────────────────────────┐
│  Navbar                   │
│                           │
│  Content                  │
│                           │
│                           │
│                           │
│        [🎮]               │
│──────────────────────────│
│ Console Panel            │
│ ━━━━━━━━━━━━━━━━━━━━━━ │
│ 🔍 Search...             │
│                          │
│ Quick Actions:           │
│ [Today]  [Random]        │
│                          │
│ Saved Items (0)          │
└──────────────────────────┘
```

---

## Today Page Layout

```
┌─────────────────────────────────────────────────────────┐
│  📅 Today in Space                                      │
│  Wednesday, January 29, 2026                            │
│─────────────────────────────────────────────────────────│
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  🖼️ IMAGE OF THE DAY                              │ │
│  │  ┌────────────────────────────────────────────┐   │ │
│  │  │                                            │   │ │
│  │  │      [Pillars of Creation Image]          │   │ │
│  │  │                                            │   │ │
│  │  └────────────────────────────────────────────┘   │ │
│  │  Pillars of Creation                              │ │
│  │  The iconic towers in Eagle Nebula...             │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌──────────────────────┐  ┌──────────────────────────┐ │
│  │ 📜 THIS DAY          │  │ ✨ TONIGHT'S SKY        │ │
│  │ IN HISTORY           │  │                          │ │
│  │                      │  │ • Jupiter (bright)       │ │
│  │ 1969                 │  │ • Mars (opposition)      │ │
│  │ Apollo 11 landed...  │  │ • Orion visible          │ │
│  └──────────────────────┘  └──────────────────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  🗓️ UPCOMING EVENTS                               │ │
│  │  [Mar 15]  [Jun 21]  [Aug 12]                     │ │
│  │  Artemis   Solstice  Perseids                     │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Explore: [Journey] [Timeline] [Missions]         │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## Color Palette (Design Tokens)

```
Backgrounds:
  --bg-0: #050810 ████ Deep space
  --bg-1: #0a0e27 ████ Dark blue
  --bg-2: #1a1f3a ████ Medium blue
  --bg-3: #2a2f4a ████ Light blue

Accents:
  --accent-0: #8b5cf6 ████ Purple
  --accent-1: #3b82f6 ████ Blue
  --accent-2: #ec4899 ████ Pink
  --accent-3: #a855f7 ████ Light purple

Text:
  --text-0: #ffffff ████ White
  --text-1: #e5e7eb ████ Light gray
  --text-2: #9ca3af ████ Medium gray
  --text-3: #6b7280 ████ Dark gray
```

---

## Glass Morphism Effects

```
┌─────────────────────┐
│ .glass-light        │
│ 40% opacity         │  Used for: subtle cards
│ 16px blur           │
└─────────────────────┘

┌─────────────────────┐
│ .glass-medium       │
│ 70% opacity         │  Used for: main cards, console
│ 16px blur           │
└─────────────────────┘

┌─────────────────────┐
│ .glass-heavy        │
│ 90% opacity         │  Used for: modals, important UI
│ 24px blur           │
└─────────────────────┘
```

---

## Button Variants

```
Primary:
[────────────────]  Purple→Blue gradient
  Click Me         Glow effect on hover

Secondary:
[────────────────]  Gray translucent
  Click Me         Subtle hover

Ghost:
[────────────────]  Transparent
  Click Me         Border on hover
```

---

## Star Animation

```
Static (prefers-reduced-motion):
  ✦ ✦  ✦   ✦
   ✦   ✦  ✦
  ✦  ✦   ✦  ✦

Animated (default):
  ✦→ ✦→  ✦→   ✦→
   ✦→   ✦→  ✦→
  ✦→  ✦→   ✦→  ✦→
  (Gentle drift, 60s cycle)
```

---

## Responsive Breakpoints

```
Mobile (<768px):
- Console: Bottom sheet
- Toggle: Bottom-right
- Full-width cards
- Stacked layout

Desktop (≥768px):
- Console: Side panel
- Toggle: Top-right
- Max-width cards
- Grid layouts
```

---

## Z-Index Layers

```
--z-background: -1    Environment Layer
--z-base: 1           Normal content
--z-elevated: 10      Cards, hover states
--z-modal: 100        Search modal
--z-console: 1000     Console panel (highest)
```

---

## Component Hierarchy

```
Layout (app/layout.tsx)
├── EnvironmentLayer (z: -1) ← Always visible
├── StarfieldCanvas (existing)
├── Navbar
├── Main Content
│   ├── Page content
│   └── TodayInSpace card (homepage)
├── Footer
├── GlobalSearch (z: 100)
└── DeepSpaceConsole (z: 1000)
```

---

**All visual elements follow the design tokens for consistency! 🎨**
