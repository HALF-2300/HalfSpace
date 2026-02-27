# MISSION 3 — VISUAL REFERENCE GUIDE

Quick visual reference for implementing the Discovery Graph UI node shapes, states, and layouts.

---

## 🔷 NODE SHAPES

### Circle (Concept)
```
     ●●●●●
   ●●     ●●
  ●●   🔭   ●●
  ●●       ●●
   ●●     ●●
     ●●●●●

Default: #8B5CF6
Glow: #A78BFA
```

### Rounded Square (Mission)
```
  ┌─────────┐
  │         │
  │    🚀    │
  │         │
  └─────────┘

Default: #22D3EE
Glow: #67E8F9
```

### Hexagon (Telescope)
```
     ┌───┐
   ╱       ╲
  ╱    📡   ╲
  ╲         ╱
   ╲       ╱
     └───┘

Default: #F59E0B
Glow: #FCD34D
```

### Diamond (Fact)
```
      ▲
     ╱ ╲
    ╱   ╲
   ╱  ✨  ╲
   ╲     ╱
    ╲   ╱
     ╲ ╱
      ▼

Default: #10B981
Glow: #6EE7B7
```

### Triangle (Term)
```
       ▲
      ╱ ╲
     ╱   ╲
    ╱  📖  ╲
   ╱       ╲
  ───────────

Default: #E11D48
Glow: #FB7185
```

### Star (Realm)
```
       ★
      ╱│╲
     ╱ │ ╲
    ╱  🌌  ╲
   ╱   │   ╲
  ╱    │    ╲
 ──────┴──────

Default: #6366F1
Glow: #818CF8
```

---

## 🎨 NODE STATES

### Default State
```
    ●●●●●
  ●●     ●●
 ●●   🔭   ●●
  ●●     ●●
    ●●●●●
   Black Holes

Opacity: 80%
Stroke: 2px white 20%
No glow
Label: Below, white 90%
```

### Hover State
```
    ●●●●●
  ●●╔═══╗●●
 ●●║ 🔭 ║●●
  ●●╚═══╝●●
    ●●●●●✨  ← glow 12px
   Black Holes

Opacity: 100%
Stroke: 2px white 40%
Glow: 12px
Scale: 1.05x
Connected edges highlight
```

### Selected State
```
      ●●●●●
    ●●╔═══╗●●
   ●●║ 🔭 ║●●
    ●●╚═══╝●●    ✨
      ●●●●●    ✨ ← pulsing glow 20px
    ✨       ✨
   Black Holes (bold)

Opacity: 100%
Stroke: 3px white 80%
Glow: 20px pulsing
Scale: 1.15x
Label: Bold, 14px
Connected edges full opacity + animated
```

### Visited State
```
    ●●●●●  ✓ ← checkmark
  ●▪     ▪●
 ●▪   🔭   ▪●
  ●▪     ▪●
    ●●●●●
   Black Holes

Opacity: 85%
Desaturated -30%
Border: Dotted instead of solid
Checkmark overlay (✓) in corner
```

### Locked State
```
    ●●●●●
  ●●     ●●
 ●●   🔒   ●● ← lock icon
  ●●     ●●
    ●●●●●
   ????????

Grayscale: #666
Opacity: 50%
Cursor: not-allowed
Tooltip: "Complete X to unlock"
```

### Dimmed State (Filtered)
```
    ░░░░░
  ░░     ░░
 ░░   🔭   ░░
  ░░     ░░
    ░░░░░
   Black Holes

Opacity: 25%
No hover effects
Cursor: default
```

---

## 🔗 EDGE TYPES

### Explains (Solid with Arrow Flow)
```
Node A ────────→ Node B
       explains
       
       (arrow flows right)

Color: #A78BFA 40%
Thickness: 2px
Animated: Arrow flow →
```

### Depends On (Dashed with Pulse)
```
Node A ─ ─ ─ ─ ─ Node B
       depends on
       
       (pulses slowly)

Color: #67E8F9 40%
Thickness: 2px
Dash: [4, 2]
Animated: Pulse
```

### Example Of (Dotted)
```
Node A · · · · · Node B
       example of

Color: #FCD34D 35%
Thickness: 1.5px
Dash: [2, 3]
No animation
```

### Observed By (Solid with Glow)
```
Node A ━━━━━━━━ Node B
       observed by
       
       (glowing)

Color: #6EE7B7 40%
Thickness: 2px
Animated: Glow pulse
```

### Connected (Thin Solid)
```
Node A ──────── Node B
       connected

Color: #FFF 18%
Thickness: 1px
No animation
```

---

## 📐 LAYOUT EXAMPLES

### Desktop Layout (1920x1080)
```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ [🌌] [Search...] [Filter] [Graph ▼] [Save] [Share]      ┃ 64px
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┯━━━━━━━━━━━━━━━━━┫
┃                                       │ Side Panel      ┃
┃                                       │ 360px           ┃
┃                                       ├─────────────────┤
┃          GRAPH CANVAS                 │ [Detail|Journey]┃
┃          1560x1016                    │                 ┃
┃                                       │ ┌─────────────┐ ┃
┃     ●──────●                          │ │ Black Holes │ ┃
┃     │       ╲                         │ │ Category:   │ ┃
┃     │        ●──────●                 │ │ Concept     │ ┃
┃     ●         │       ╲               │ │             │ ┃
┃                ●       ●              │ │ Related:    │ ┃
┃                         │             │ │ • Event H.  │ ┃
┃                         ●             │ │ • Stars     │ ┃
┃                                       │ └─────────────┘ ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┷━━━━━━━━━━━━━━━━━┛
```

### Mobile Layout (375x667)
```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ [🌌] [Search] [☰]                 ┃ 64px
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                   ┃
┃      GRAPH CANVAS                 ┃
┃      375x400                      ┃
┃                                   ┃
┃   ●────●                          ┃
┃   │     ╲                         ┃
┃   ●      ●──●                     ┃
┃           │  │                    ┃
┃           ●──●                    ┃
┃                                   ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ ▲ Swipe up for details            ┃ 40px
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ Bottom Sheet (overlay)            ┃ 
┃ ┌───────────────────────────────┐ ┃
┃ │ Black Holes                   │ ┃
┃ │ A region of spacetime...      │ ┃
┃ │                               │ ┃
┃ │ [Visit Page] [Add to Journey] │ ┃
┃ └───────────────────────────────┘ ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

## 🎬 REPLAY MODE

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 🎬 REPLAYING: "Black Hole Journey"              [Exit]  ┃
┃ ━━━━━━━━━━━━━━━━━○━━━━━━━━  Node 8/15                   ┃
┃ [◄◄] [❚❚ Pause] [►►] [Speed: 1x ▼]                     ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                          ┃
┃           ●────────●  ← animated path                   ┃
┃                    ╲                                     ┃
┃                     ●────────●  ← current node           ┃
┃                              ╲   (pulsing)               ┃
┃                               ●                          ┃
┃                                                          ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

Timeline:
• Past nodes: Visited state (checkmark)
• Current node: Selected state (pulsing glow)
• Future nodes: Default state (dimmed)
• Traversed edges: Animated flow
```

---

## 🔢 SIZE REFERENCE

### Node Radii by Difficulty + Connections

```
Beginner (0 connections):   ●  12px
Beginner (5 connections):   ●● 14.5px
Beginner (12+ connections): ●●● 18px

Intermediate (0 connections):  ●● 14px
Intermediate (5 connections):  ●●● 16.5px
Intermediate (12+ connections): ●●●● 20px

Advanced (0 connections):    ●●● 16px
Advanced (5 connections):    ●●●● 18.5px
Advanced (12+ connections):   ●●●●● 22px
```

### Edge Thickness

```
Thin (example_of):      ───  1.5px
Normal (default):       ━━━  2px
Active (+1px bonus):    ━━━━ 3px
Hovered (+1px bonus):   ━━━━ 3px
```

---

## 🌈 COLOR PALETTE (Hex Values)

### Node Categories
```
Concept:    #8B5CF6  ████ (Purple)
Mission:    #22D3EE  ████ (Cyan)
Telescope:  #F59E0B  ████ (Amber)
Fact:       #10B981  ████ (Green)
Term:       #E11D48  ████ (Rose)
Realm:      #6366F1  ████ (Indigo)
```

### Glow Colors (Lighter)
```
Concept:    #A78BFA  ✨ (Light Purple)
Mission:    #67E8F9  ✨ (Light Cyan)
Telescope:  #FCD34D  ✨ (Light Amber)
Fact:       #6EE7B7  ✨ (Light Green)
Term:       #FB7185  ✨ (Light Rose)
Realm:      #818CF8  ✨ (Light Indigo)
```

### Edge Colors
```
Explains:    rgba(167,139,250, 0.4)  ──── (Purple 40%)
Depends On:  rgba(103,232,249, 0.4)  ──── (Cyan 40%)
Example Of:  rgba(252,211,77,  0.35) ──── (Amber 35%)
Observed By: rgba(110,231,183, 0.4)  ──── (Green 40%)
Connected:   rgba(255,255,255, 0.18) ──── (White 18%)
```

### UI Elements
```
Background:       #0a0118  ████ (Deep Purple)
Panel BG:         rgba(0,0,0,0.7)  ████ (Black 70%)
Panel Border:     rgba(139,92,246,0.3)  ──── (Purple 30%)
Text Primary:     #FFFFFF  (White)
Text Secondary:   rgba(255,255,255,0.7)  (White 70%)
Text Dimmed:      rgba(255,255,255,0.4)  (White 40%)
```

---

## 📱 TOUCH TARGETS (Mobile)

Minimum touch target: 44x44px

```
Before optimization:
●  12px radius = 24x24 clickable (TOO SMALL ❌)

After optimization:
  ┌──────────────┐
  │              │
  │      ●       │  44x44 touch area
  │              │
  └──────────────┘
  
Invisible padding added around small nodes
```

---

## ⌨️ KEYBOARD NAVIGATION VISUAL

```
Current node: ●  (white outline)

Press → (right arrow):

●────→ ◉  (follows edge, selects connected node)

Arrow keys always follow edges
Tab cycles through all visible nodes
```

---

## 🎯 CONSTELLATION CARD

```
┌─────────────────────────────────────┐
│ ╔════════════════════════════════╗  │
│ ║                                ║  │
│ ║    Mini Graph Preview          ║  │ 200x150
│ ║    (thumbnail)                 ║  │
│ ╚════════════════════════════════╝  │
├─────────────────────────────────────┤
│ Black Hole Journey                  │
│ 15 nodes · 12m 34s                  │
│ 2 hours ago                         │
├─────────────────────────────────────┤
│ [▶ Replay] [🔗 Share] [✏ Rename]    │
└─────────────────────────────────────┘
```

---

## 🎨 ANIMATION KEYFRAMES

### Glow Pulse (Selected Node)
```
Frame 1:  ●    (glow 15px)
Frame 2:  ◉    (glow 20px)  ← peak
Frame 3:  ●    (glow 15px)

Duration: 2s
Easing: ease-in-out
Loop: infinite
```

### Edge Arrow Flow
```
Frame 1:  ────→────────────
Frame 2:  ───────→─────────
Frame 3:  ──────────→──────
Frame 4:  ─────────────→───

Duration: 2s
Easing: linear
Loop: infinite
```

### Zoom Transition
```
Scale 1.0 ──────────→ Scale 1.5
         (600ms ease-out)
```

---

## 🔍 SEARCH HIGHLIGHT

```
Matching node:
   ●●●●●
 ●●╔═══╗●●
●●║ 🔭 ║●●  ← rapid pulse
 ●●╚═══╝●●
   ●●●●●

Non-matching nodes:
   ░░░░░
 ░░     ░░
░░   🔭   ░░  ← 25% opacity
 ░░     ░░
   ░░░░░
```

---

## 📊 CLUSTERING VISUAL

### Before Clustering (200+ nodes)
```
● ● ● ● ● ● ●
● ● ● ● ● ● ●
● ● ● ● ● ● ●  ← too dense, laggy
● ● ● ● ● ● ●
```

### After Clustering
```
  ╔═════════════╗
  ║   ●  ●  ●  ║
  ║  ●  ●  ●   ║
  ║   ●  ●  ●  ║  ← cluster (dashed border)
  ╚═════════════╝
   "8 Concepts"

Click to expand:
● ──→ ●
  ╲    ╱
    ●    ← nodes spread out
  ╱    ╲
● ──→ ●
```

---

## ✅ CHECKLIST FOR DEVELOPERS

When implementing, ensure:

- [ ] Node shapes match categories (6 distinct shapes)
- [ ] Icons centered in nodes (14px)
- [ ] State transitions smooth (300ms)
- [ ] Glow effects render (shadowBlur)
- [ ] Edge labels appear on hover only
- [ ] Visited nodes show checkmark overlay
- [ ] Touch targets ≥44px on mobile
- [ ] Keyboard focus visible (outline)
- [ ] Animations can be disabled (reduced motion)
- [ ] Colors match hex values exactly

---

## 🎓 CSS EQUIVALENT (For Reference)

While this is canvas-based, here's the CSS equivalent for comparison:

```css
/* Node (default state) */
.node-concept {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #8B5CF6;
  opacity: 0.8;
  border: 2px solid rgba(255,255,255,0.2);
  transition: all 300ms ease-out;
}

/* Node (hover state) */
.node-concept:hover {
  opacity: 1;
  border: 2px solid rgba(255,255,255,0.4);
  box-shadow: 0 0 12px #A78BFA;
  transform: scale(1.05);
}

/* Node (selected state) */
.node-concept.selected {
  opacity: 1;
  border: 3px solid rgba(255,255,255,0.8);
  box-shadow: 0 0 20px #A78BFA;
  transform: scale(1.15);
  animation: glow-pulse 2s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 15px #A78BFA; }
  50% { box-shadow: 0 0 25px #A78BFA; }
}
```

---

**This visual reference should be used alongside the main specification document for accurate implementation.**

**Last Updated**: 2026-01-31  
**For**: MISSION-3 Discovery Graph UI
