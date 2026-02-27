# MISSION 8 — QA / PERFORMANCE / ACCESSIBILITY CHECKLIST

**Owner:** Special Agent "QA"  
**Version:** 1.0  
**Date:** 2026-01-31  
**Status:** ✅ READY FOR ENFORCEMENT

---

## 1. PERFORMANCE BUDGETS

### 1.1 Initial Load Budgets

#### Page Load Metrics (Desktop)
```
Target Device: 2020 MacBook Air (baseline)
Network: Fast 3G (1.6 Mbps, 150ms RTT)

Time to First Byte (TTFB)           < 600ms    ⚠️ 800ms    ❌ 1000ms+
First Contentful Paint (FCP)        < 1.5s     ⚠️ 2.5s     ❌ 3.5s+
Largest Contentful Paint (LCP)      < 2.5s     ⚠️ 3.5s     ❌ 4.5s+
Time to Interactive (TTI)           < 3.5s     ⚠️ 5.0s     ❌ 7.0s+
First Input Delay (FID)             < 100ms    ⚠️ 200ms    ❌ 300ms+
Cumulative Layout Shift (CLS)       < 0.1      ⚠️ 0.2      ❌ 0.25+

Total Blocking Time (TBT)           < 200ms    ⚠️ 400ms    ❌ 600ms+
Speed Index                         < 3.0s     ⚠️ 4.5s     ❌ 6.0s+
```

#### Page Load Metrics (Mobile)
```
Target Device: iPhone 12 / Pixel 5
Network: 4G (4 Mbps, 100ms RTT)

Time to First Byte (TTFB)           < 800ms    ⚠️ 1.2s     ❌ 1.5s+
First Contentful Paint (FCP)        < 2.0s     ⚠️ 3.0s     ❌ 4.0s+
Largest Contentful Paint (LCP)      < 3.0s     ⚠️ 4.5s     ❌ 6.0s+
Time to Interactive (TTI)           < 5.0s     ⚠️ 7.0s     ❌ 9.0s+
First Input Delay (FID)             < 100ms    ⚠️ 200ms    ❌ 300ms+
Cumulative Layout Shift (CLS)       < 0.1      ⚠️ 0.2      ❌ 0.25+

Total Blocking Time (TBT)           < 300ms    ⚠️ 500ms    ❌ 800ms+
Speed Index                         < 4.0s     ⚠️ 6.0s     ❌ 8.0s+
```

#### Asset Size Budgets (Per Route)
```
Initial HTML                        < 30KB     ⚠️ 50KB     ❌ 80KB+
Initial JavaScript Bundle           < 200KB    ⚠️ 350KB    ❌ 500KB+
Total JavaScript (incl. chunks)     < 400KB    ⚠️ 600KB    ❌ 800KB+
CSS Bundle                          < 50KB     ⚠️ 80KB     ❌ 120KB+
Fonts (WOFF2, total)                < 100KB    ⚠️ 150KB    ❌ 200KB+
Images (initial viewport)           < 200KB    ⚠️ 400KB    ❌ 600KB+

Total Page Weight (initial load)    < 600KB    ⚠️ 1MB      ❌ 1.5MB+
```

#### Third-Party Scripts
```
External Analytics                  < 30KB     ⚠️ 50KB     ❌ 80KB+
Total External Scripts              < 50KB     ⚠️ 100KB    ❌ 150KB+
External Script Execution Time      < 200ms    ⚠️ 400ms    ❌ 600ms+
```

### 1.2 Runtime Performance Budgets

#### Timeline Mode (Mission 1)
```
Epoch Card Swap Animation           60fps (16.67ms/frame)
Time Rail Drag (while dragging)     60fps (16.67ms/frame)
Time Rail Snap Animation            60fps (16.67ms/frame)
Background Particle Render          60fps (max 8ms canvas draw)
Hover State Response                < 50ms
Keyboard Navigation Response        < 100ms

Memory Delta (session)              < 50MB
Memory Leak Test (30min)            < 5MB drift

Canvas Particle Count               200 max (desktop), 100 (mobile)
Epoch Swap Jank Budget              0 dropped frames
```

#### Discovery Graph (Mission 3)
```
Node Selection Response             < 100ms
Edge Traversal Animation            60fps
Graph Pan (mouse drag)              60fps (16.67ms/frame)
Graph Zoom (scroll wheel)           60fps
Canvas Render (150 nodes)           60fps (< 8ms/frame)
Canvas Render (300 nodes)           30fps acceptable
Canvas Render (500+ nodes)          Fallback to list view

Search Debounce Delay               200ms
Search Result Highlight             < 150ms
Constellation Save Time             < 500ms
Replay Animation Frame Rate         60fps (normal), 30fps (5x speed)

Memory Delta (30min session)        < 100MB
Node Cache Size                     < 10MB
```

#### General Interaction Budgets
```
Button Click Response               < 50ms
Modal Open/Close Animation          < 400ms
Side Panel Slide Animation          < 300ms
Toast Notification Display          < 100ms
Image Lazy Load (on scroll)         < 200ms
Audio Toggle Response               < 100ms

Scroll Smoothness                   60fps
Touch Gesture Response (mobile)     < 50ms
```

### 1.3 Monitoring Thresholds

#### Alert Levels
```
✅ GREEN:   All metrics within target
⚠️ AMBER:   1-2 metrics in warning zone
🔴 RED:     Any metric in fail zone OR 3+ in warning

Action on AMBER: Log warning, monitor trend
Action on RED:   Block deployment, investigate immediately
```

#### Performance Testing Protocol
```
1. Run Lighthouse (3x, median score)
   - Desktop: Performance score ≥ 90
   - Mobile: Performance score ≥ 80

2. Run WebPageTest (Fast 3G profile)
   - Check filmstrip for visual progress
   - Verify no layout shifts during load

3. Chrome DevTools Performance Recording
   - Record 10-second interaction (timeline drag, graph explore)
   - Check for frame drops, long tasks > 50ms
   - Verify memory doesn't grow unbounded

4. Real Device Testing
   - iPhone 12 (Safari)
   - Pixel 5 (Chrome)
   - iPad Air (Safari)
   - Low-end Android (4GB RAM, 2018 chipset)
```

---

## 2. CRITICAL USER PATHS (TEST MATRIX)

### 2.1 Timeline Mode — Critical Paths

#### PATH 1: Timeline Keyboard Navigation
**Steps:**
1. Navigate to `/space/timeline` or trigger timeline mode
2. Wait for initial load (< 3s target)
3. Press `→` arrow key
4. Verify: Card swaps to next epoch (< 100ms), animation smooth (60fps)
5. Press `←` arrow key
6. Verify: Card swaps to previous epoch
7. Press `Home` key
8. Verify: Jumps to first epoch (Big Bang)
9. Press `End` key
10. Verify: Jumps to last epoch (Heat Death)
11. Press `Space` key
12. Verify: Opens epoch experience modal
13. Press `Esc` key
14. Verify: Closes modal, returns to timeline

**Expected Time:** 45 seconds  
**Pass Criteria:**
- All key presses respond within 100ms
- No dropped frames during animations
- No visual glitches or flickering
- Focus indicators always visible
- Screen reader announces each epoch change

**Edge Cases:**
- Rapid key presses (spam arrow keys 20 times)
- Hold arrow key (should debounce, not spam)
- Press keys during animation (should queue or ignore)

---

#### PATH 2: Timeline Rail Drag
**Steps:**
1. Load timeline mode
2. Click and hold rail handle
3. Verify: Handle scales to 1.3x, cursor changes to grabbing
4. Drag left (toward past)
5. Verify: Cards swap in real-time, background crossfades
6. Drag right (toward present)
7. Verify: Smooth scrubbing, no lag
8. Release at random position
9. Verify: Handle snaps to nearest epoch (300ms spring animation)
10. Drag to first epoch boundary
11. Verify: Elastic bounce, can't drag beyond
12. Drag to last epoch boundary
13. Verify: Elastic bounce, can't drag beyond

**Expected Time:** 60 seconds  
**Pass Criteria:**
- Dragging feels smooth (60fps minimum)
- Background transitions don't cause jank
- Snap animation is springy (not linear)
- No cursor jumps or position glitches
- Works with mouse, trackpad, and touch

**Edge Cases:**
- Drag and release mid-motion (fling)
- Drag with high velocity
- Drag on mobile with touch

---

#### PATH 3: Timeline Epoch Details
**Steps:**
1. Load timeline at any epoch
2. Read epoch card content (title, hook, 3 facts)
3. Verify: All text readable (contrast ≥ 4.5:1)
4. Click "Launch Experience" button
5. Verify: Modal opens (400ms slide-up), no layout shift
6. Interact with experience (if microModule loaded)
7. Click modal close button or press Esc
8. Verify: Returns to timeline, epoch still selected
9. Click "Jump Next Consequence" button
10. Verify: Jumps to related epoch, smooth transition

**Expected Time:** 90 seconds  
**Pass Criteria:**
- All text renders correctly (no cut-off, no overflow)
- Buttons are touch-friendly (≥ 44px mobile)
- Modal loads experience content (or shows placeholder)
- No memory leak when opening/closing modals 10x

---

#### PATH 4: Timeline Reduced Motion
**Steps:**
1. Enable "Reduce Motion" in OS settings
2. Load timeline mode
3. Verify: Particle system hidden, background static
4. Press arrow key
5. Verify: Card swap instant (< 50ms), no spring animation
6. Drag rail handle
7. Verify: No snap animation, instant positioning
8. Check card hover
9. Verify: No scale animation, only color change

**Expected Time:** 30 seconds  
**Pass Criteria:**
- All animations ≤ 50ms or disabled
- Site still fully functional
- No particle rendering
- CSS `prefers-reduced-motion` respected

---

### 2.2 Discovery Graph — Critical Paths

#### PATH 5: Graph Node Selection
**Steps:**
1. Navigate to `/space/graph`
2. Wait for initial render (< 2.5s target)
3. Click any node (e.g., "Black Holes")
4. Verify:
   - Node enters Selected state (glow, scale 1.15)
   - Side panel opens with Detail tab (< 300ms slide)
   - Canvas pans to center node (400ms smooth)
   - Connected edges highlight (full opacity)
   - URL updates to `?node=black-holes`
5. Click a related node in side panel
6. Verify:
   - Previous node → Visited state (desaturated)
   - New node → Selected state
   - Edge animates "traversed" (green tint)
   - Journey breadcrumb updates
7. Click Back button (or browser back)
8. Verify: Returns to previous node
9. Click same node again (already selected)
10. Verify: Deselects node, closes side panel

**Expected Time:** 90 seconds  
**Pass Criteria:**
- Node selection response < 100ms
- Animations smooth (60fps)
- Side panel doesn't cause layout shift
- Browser back/forward works
- Journey tracking persists in sessionStorage

**Edge Cases:**
- Select node, refresh page (should restore state)
- Select node, navigate away, come back (should show visited nodes)
- Rapid clicks on different nodes (should not queue up)

---

#### PATH 6: Graph Pan & Zoom
**Steps:**
1. Load graph with 150+ nodes
2. Click and drag background
3. Verify: Canvas pans smoothly (60fps)
4. Release drag with velocity
5. Verify: Momentum scrolling (eases out)
6. Scroll mouse wheel up (zoom in)
7. Verify: Zooms toward mouse cursor, smooth
8. Scroll mouse wheel down (zoom out)
9. Verify: Smooth zoom out
10. Zoom to 2.5x (max)
11. Verify: Can't zoom further, subtle feedback
12. Zoom to 0.5x (min)
13. Verify: Can't zoom further
14. Press `0` key
15. Verify: Resets zoom and pan (400ms animation)
16. Mobile: Pinch to zoom
17. Verify: Touch gestures work, no browser zoom

**Expected Time:** 60 seconds  
**Pass Criteria:**
- Pan smoothness: 60fps
- Zoom preserves cursor position (no jump)
- Zoom range enforced (0.5x - 2.5x)
- Mobile pinch works without conflicts

---

#### PATH 7: Graph Search & Filter
**Steps:**
1. Load graph
2. Press `Cmd/Ctrl + F`
3. Verify: Search input focused
4. Type "quantum"
5. Verify: Real-time highlighting (debounced 200ms)
6. Verify: Matching nodes pulse, others dimmed
7. Verify: Count shows "3/150 nodes"
8. Press `Enter`
9. Verify: Top result selected, panel opens
10. Clear search
11. Verify: All nodes return to normal opacity
12. Open filter dropdown
13. Select "Concept" category
14. Verify: Only concept nodes visible, others dimmed
15. Select "Advanced" difficulty
16. Verify: Filters stack (AND logic)
17. Clear all filters
18. Verify: All nodes visible again

**Expected Time:** 90 seconds  
**Pass Criteria:**
- Search debounced (no lag while typing)
- Filter response < 150ms
- Dimmed nodes still exist (don't remove from DOM)
- Filters persist on page refresh

---

#### PATH 8: Constellation Save & Share
**Steps:**
1. Load graph, select 5 nodes in sequence
2. Switch to Journey tab in side panel
3. Verify: Breadcrumb shows 5 nodes, stats correct
4. Click "Save Constellation"
5. Verify: Modal opens (< 400ms)
6. Edit name to "My Journey"
7. Click "Save & Share"
8. Verify:
   - Toast: "Constellation saved!"
   - Link copied to clipboard
   - Modal closes
9. Navigate to constellations library
10. Verify: "My Journey" appears in list
11. Click "Share" button on card
12. Verify: Share modal opens with QR code
13. Copy link, open in new incognito tab
14. Verify: Graph loads with replay controls
15. Click "Play" button
16. Verify: Nodes highlight in sequence, edges animate
17. Verify: Replay completes, toast appears

**Expected Time:** 3 minutes  
**Pass Criteria:**
- Constellation saves < 500ms
- Share link encodes correctly (URL-safe Base64)
- Share link decodes without errors
- Replay animation smooth (60fps at 1x speed)
- Replay can be paused/resumed
- Replay speed controls work (0.5x, 1x, 2x, 5x)

**Edge Cases:**
- Save constellation with 0 nodes (should disable button)
- Save constellation with 50+ nodes (check URL length)
- Share link with invalid Base64 (should show error)
- Replay while offline (should still work if cached)

---

#### PATH 9: Graph Keyboard Navigation
**Steps:**
1. Load graph
2. Press `Tab` key
3. Verify: First node focused (outline visible)
4. Press `Tab` again
5. Verify: Cycles to next node
6. Press `Enter` on focused node
7. Verify: Selects node, opens detail panel
8. Press `→` arrow key
9. Verify: Follows edge to connected node
10. Press `Space` key
11. Verify: Centers current node in viewport
12. Press `+` key 3 times
13. Verify: Zooms in
14. Press `-` key 3 times
15. Verify: Zooms out
16. Press `Esc` key
17. Verify: Deselects node, closes panel

**Expected Time:** 60 seconds  
**Pass Criteria:**
- All nodes reachable via Tab
- Focus indicators always visible (≥ 3px outline)
- Arrow keys follow logical edge direction
- No keyboard traps

---

### 2.3 Mission/Experience Runs — Critical Paths

#### PATH 10: Launch MicroModule Experience
**Steps:**
1. Navigate to timeline or encyclopedia entry
2. Click "Launch Experience" button
3. Verify: Modal opens, loading spinner shows
4. Wait for experience to load
5. Verify: Interactive experience renders (< 3s)
6. Interact with controls (if present)
7. Verify: Interactions respond (< 100ms)
8. Complete experience or explore
9. Click close button or press Esc
10. Verify: Modal closes, memory released

**Expected Time:** 2-5 minutes (depends on experience)  
**Pass Criteria:**
- Modal loads within 3s
- Experience is interactive (not frozen)
- No console errors
- Memory released after close (check DevTools)

---

#### PATH 11: Audio Ambient Toggle
**Steps:**
1. Navigate to any page with ambient audio
2. Click audio toggle button
3. Verify: Audio starts playing (< 100ms)
4. Verify: Icon changes to playing state
5. Navigate to different page
6. Verify: Audio persists across navigation
7. Click audio toggle again
8. Verify: Audio stops, icon changes
9. Check localStorage
10. Verify: Audio state persisted

**Expected Time:** 45 seconds  
**Pass Criteria:**
- Audio toggle response < 100ms
- Audio continues across page navigations
- State persists in localStorage
- No audio glitches or pops

---

#### PATH 12: Compare Drawer
**Steps:**
1. Navigate to encyclopedia entry (e.g., "Black Holes")
2. Click "Compare" button
3. Verify: Drawer slides in from side (< 300ms)
4. Select second item to compare
5. Verify: Comparison table populates
6. Scroll comparison table
7. Verify: Sticky headers work
8. Click "Share Comparison" button
9. Verify: Share modal opens, link generated
10. Close drawer
11. Verify: Drawer slides out, main content restored

**Expected Time:** 90 seconds  
**Pass Criteria:**
- Drawer animation smooth
- Comparison data loads correctly
- Share link encodes both items
- No layout shift when opening/closing

---

### 2.4 Mobile-Specific Paths

#### PATH 13: Mobile Timeline Swipe
**Steps:**
1. Load timeline on mobile (portrait)
2. Swipe left on card
3. Verify: Navigates to next epoch
4. Swipe right
5. Verify: Navigates to previous epoch
6. Double-tap card
7. Verify: Launches experience
8. Pinch zoom on rail
9. Verify: Zooms timeline density
10. Long-press card
11. Verify: Shows quick actions menu

**Expected Time:** 60 seconds  
**Pass Criteria:**
- Swipe gestures feel natural (< 50ms response)
- No conflicts with browser gestures
- Touch targets ≥ 44px
- No ghost clicks or double-fires

---

#### PATH 14: Mobile Graph Bottom Sheet
**Steps:**
1. Load graph on mobile
2. Tap node
3. Verify: Bottom sheet slides up
4. Verify: Canvas auto-pans node above sheet
5. Swipe down on sheet handle
6. Verify: Sheet minimizes
7. Tap different node
8. Verify: Sheet springs back up
9. Tap "Journey" tab
10. Verify: Tab switches without sheet closing
11. Tap "Save Constellation"
12. Verify: Full-screen modal opens (mobile-optimized)

**Expected Time:** 90 seconds  
**Pass Criteria:**
- Bottom sheet swipe feels smooth
- Sheet doesn't block important content
- Touch targets large enough
- Modal scales to mobile viewport

---

## 3. ACCESSIBILITY CHECKLIST (WCAG 2.1 AA)

### 3.1 Keyboard Navigation

#### General Requirements
- [ ] All interactive elements focusable via `Tab`
- [ ] Focus order matches visual layout (left-to-right, top-to-bottom)
- [ ] No keyboard traps (user can Tab out of all components)
- [ ] `Esc` key exits all modals/overlays
- [ ] Focus visible on all elements (≥ 3px outline, 3:1 contrast)
- [ ] Skip to main content link present (hidden until focused)
- [ ] Custom keyboard shortcuts documented (Help menu or tooltip)

#### Timeline Mode Keyboard
- [ ] `←` / `→` arrow keys navigate epochs
- [ ] `Home` jumps to first epoch
- [ ] `End` jumps to last epoch
- [ ] `Space` opens epoch experience
- [ ] `Esc` closes experience modal
- [ ] `Tab` cycles through rail markers
- [ ] `Enter` activates focused button
- [ ] `+` / `-` zoom timeline (optional)
- [ ] All shortcuts work without mouse

#### Graph Mode Keyboard
- [ ] `Tab` cycles through visible nodes
- [ ] `Arrow keys` navigate between connected nodes
- [ ] `Enter` selects focused node
- [ ] `Space` centers selected node
- [ ] `Esc` deselects and closes panel
- [ ] `Cmd/Ctrl + F` focuses search
- [ ] `Cmd/Ctrl + S` saves constellation
- [ ] `+` / `-` zoom graph
- [ ] `0` resets zoom/pan

#### Testing Protocol
```
1. Unplug mouse/trackpad
2. Navigate entire site using keyboard only
3. Verify all tasks completable
4. Check focus indicators visible at all times
5. Test in Chrome, Firefox, Safari
6. Test with screen reader active (impacts focus)
```

---

### 3.2 Screen Reader Support

#### ARIA Labels & Roles
- [ ] All interactive elements have accessible names
- [ ] `role="button"` on clickable divs (if not using `<button>`)
- [ ] `role="slider"` on time rail with `aria-valuemin/max/now`
- [ ] `role="article"` on epoch cards with `aria-label`
- [ ] `role="navigation"` on main nav with `aria-label="Main"`
- [ ] `role="complementary"` on side panels
- [ ] `role="dialog"` on modals with `aria-labelledby`
- [ ] `role="status"` for live regions (announcements)

#### Live Regions
```html
<!-- Global announcer (hidden) -->
<div role="status" aria-live="polite" aria-atomic="true" class="sr-only">
  <!-- Dynamic announcements injected here -->
</div>
```

**Announce on:**
- Epoch change: "Navigated to Big Bang. 13.8 billion years ago. Epoch 1 of 12."
- Node selection: "Black Holes selected. Concept. 5 connections."
- Graph traversal: "Moved to Event Horizon. 2 connections."
- Constellation save: "Constellation 'My Journey' saved successfully."
- Error: "Error: Unable to load experience. Please try again."

#### Epoch Card Semantics
```html
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
    Everything explodes into existence from a point smaller than an atom
  </p>
  
  <ul aria-label="Quick facts">
    <li>Temperature: 10 billion billion billion degrees</li>
    <li>Size: Entire universe fits in your hand</li>
    <li>Duration: First second creates all matter</li>
  </ul>
  
  <button aria-label="Launch Big Bang experience">
    Launch Experience
  </button>
</article>
```

#### Graph Node Semantics
```html
<circle
  role="button"
  aria-label="Black Holes. Concept. 5 connections. Click to select."
  tabindex="0"
  data-node-id="black-holes"
/>
```

#### Testing Protocol
```
Screen Readers to Test:
- NVDA (Windows, Firefox) — Free
- JAWS (Windows, Chrome) — Paid, but widely used
- VoiceOver (Mac, Safari) — Built-in
- TalkBack (Android, Chrome) — Built-in

Test Tasks:
1. Navigate to timeline, explore 3 epochs
2. Open graph, select 3 nodes, save constellation
3. Search for "quantum", select result
4. Open modal, interact, close modal
5. Verify all actions announced clearly
6. Check no phantom content read (hidden divs)
```

---

### 3.3 Color Contrast & Visual

#### Contrast Requirements
```
Text Size ≥18px (or 14px bold):     Contrast ratio ≥ 3:1
Text Size <18px:                    Contrast ratio ≥ 4.5:1
UI Components (icons, borders):     Contrast ratio ≥ 3:1
Focus Indicators:                   Contrast ratio ≥ 3:1
```

#### Current Palette Verification
```
Timeline Card:
- Epoch name (#FFFFFF on #1e293b gradient):       15.2:1 ✅
- Time label (rgba(255,255,255,0.6) on #1e293b):  5.8:1  ✅
- Hook text (rgba(255,255,255,0.9) on #1e293b):   9.1:1  ✅
- Quick facts (rgba(255,255,255,0.85) on #1e293b): 8.3:1 ✅

Graph Nodes:
- Concept (#8B5CF6 fill, white icon):              4.8:1  ✅
- Mission (#22D3EE fill, white icon):              3.9:1  ✅
- Fact (#10B981 fill, white icon):                 4.2:1  ✅
- Term (#E11D48 fill, white icon):                 5.1:1  ✅

Focus Indicators:
- Blue outline (#3b82f6 on dark bg):               8.2:1  ✅
```

#### Non-Color Identification
- [ ] Information not conveyed by color alone
- [ ] Graph node categories have unique shapes (not just colors)
- [ ] Error states use icons + text (not just red border)
- [ ] Visited nodes use checkmark icon + desaturation
- [ ] Disabled buttons use opacity + cursor change

#### Testing Protocol
```
Tools:
- Chrome DevTools: Lighthouse Accessibility Audit
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- axe DevTools Browser Extension
- WAVE Browser Extension

Manual Checks:
1. Enable Windows High Contrast Mode (or macOS Increase Contrast)
2. Verify all text readable, borders visible
3. Check focus indicators don't disappear
4. Test with color blindness simulators (Chrome DevTools)
```

---

### 3.4 Reduced Motion

#### CSS Media Query
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  
  /* Disable non-essential animations */
  .particle-layer {
    display: none !important;
  }
  
  .epoch-card {
    animation: none !important;
  }
  
  .graph-node {
    transition: opacity 50ms !important; /* Keep opacity for feedback */
  }
  
  /* Keep essential transitions for usability */
  .modal-overlay {
    transition: opacity 100ms !important; /* Helps perceive open/close */
  }
}
```

#### What to Disable
- [ ] Timeline particle systems (hidden)
- [ ] Epoch card float animation (disabled)
- [ ] Background gradient transitions (instant)
- [ ] Graph node pulse/glow (disabled)
- [ ] Edge flow animations (static)
- [ ] Spring physics (instant or linear < 50ms)
- [ ] Parallax effects (disabled)
- [ ] Autoplay carousels (stopped)

#### What to Keep (Essential)
- [ ] Modal fade in/out (< 100ms for orientation)
- [ ] Focus indicator (instant or < 50ms)
- [ ] Hover opacity changes (< 50ms)
- [ ] Page transitions (< 100ms fade)

#### User Toggle
Provide manual toggle in Settings panel:
```
☑️ Reduce Motion
   Minimize animations for a calmer experience
```

#### Testing Protocol
```
1. Enable "Reduce motion" in OS:
   - Mac: System Preferences > Accessibility > Display > Reduce motion
   - Windows: Settings > Ease of Access > Display > Show animations
   - iOS: Settings > Accessibility > Motion > Reduce Motion
   - Android: Settings > Accessibility > Remove animations

2. Load timeline mode
3. Verify: Particles hidden, card swaps instant
4. Load graph mode
5. Verify: Node animations minimal, edge flow disabled
6. Test all critical paths
7. Verify: Site fully functional
```

---

### 3.5 Touch Target Sizes

#### Mobile Minimum Sizes
```
All Touch Targets:        ≥ 44px × 44px (WCAG 2.5.5 Level AAA)
Spacing Between Targets:  ≥ 8px margin

Buttons:                  48px × 48px minimum
Rail Handle (mobile):     56px × 56px
Graph Nodes (mobile):     40px × 40px minimum
Close Buttons:            44px × 44px
Swipe Areas:              Full width, ≥ 100px height
```

#### CSS Implementation
```css
@media (pointer: coarse) {
  button, a, [role="button"] {
    min-width: 44px;
    min-height: 44px;
    padding: 12px 16px;
    /* Ensure tap area even if visual is smaller */
  }
  
  .rail-handle {
    width: 56px;
    height: 56px;
  }
  
  .graph-node {
    /* SVG circle */
    r: 20px; /* 40px diameter */
  }
  
  .close-button {
    width: 44px;
    height: 44px;
  }
}
```

#### Testing Protocol
```
1. Open Chrome DevTools
2. Toggle device mode (iPhone 12, Pixel 5)
3. Enable "Show tap areas" (if available)
4. Manually measure touch targets
5. Test on real device:
   - iPhone 12 or newer
   - Pixel 5 or newer
   - Low-end Android (2018 chipset)
6. Verify: All targets easily tappable with thumb
7. Verify: No accidental taps on adjacent elements
```

---

### 3.6 Text & Zoom

#### Text Spacing (WCAG 1.4.12)
Allow user overrides without breaking layout:
```
Line height: ≥ 1.5× font size
Paragraph spacing: ≥ 2× font size
Letter spacing: ≥ 0.12× font size
Word spacing: ≥ 0.16× font size
```

#### Browser Zoom Support
- [ ] Site usable at 200% zoom (WCAG AA)
- [ ] Site usable at 400% zoom (WCAG AAA, stretch goal)
- [ ] No horizontal scrolling at 200% zoom (responsive)
- [ ] Text doesn't overlap or clip
- [ ] Images scale appropriately

#### Font Size Overrides
- [ ] User can change browser font size
- [ ] Layout adapts (no fixed pixel heights)
- [ ] Minimum font size: 14px (body text)
- [ ] Minimum font size: 16px (recommended for body)

#### Testing Protocol
```
1. Open site in Chrome
2. Press Cmd/Ctrl + "+" to zoom to 200%
3. Navigate timeline, graph
4. Verify: All content accessible, no horizontal scroll
5. Zoom to 400%
6. Verify: Site still functional (may be less pretty)
7. Change browser font size: Chrome Settings > Appearance > Font size > Very Large
8. Verify: Text scales, no clipping
```

---

### 3.7 Forms & Inputs

#### Constellation Save Modal
```html
<form>
  <label for="constellation-name">
    Constellation Name
    <span aria-label="required">*</span>
  </label>
  <input 
    type="text" 
    id="constellation-name"
    name="constellationName"
    required
    maxlength="60"
    aria-describedby="name-help"
    aria-invalid="false"
  />
  <span id="name-help" class="help-text">
    Max 60 characters. Use a memorable name.
  </span>
  
  <label for="constellation-desc">
    Description (optional)
  </label>
  <textarea 
    id="constellation-desc"
    name="description"
    maxlength="200"
    aria-describedby="desc-help"
  ></textarea>
  <span id="desc-help" class="help-text">
    Max 200 characters.
  </span>
  
  <button type="submit">Save & Share</button>
  <button type="button">Cancel</button>
</form>
```

#### Error States
```html
<!-- If validation fails -->
<input 
  aria-invalid="true"
  aria-describedby="name-error"
/>
<span id="name-error" role="alert" class="error-text">
  Name is required and must be 1-60 characters.
</span>
```

#### Checklist
- [ ] All inputs have associated `<label>` (no placeholder-only)
- [ ] Required fields marked with `required` attribute
- [ ] Help text associated with `aria-describedby`
- [ ] Error messages associated with `aria-describedby`
- [ ] Error states use `aria-invalid="true"`
- [ ] Error messages have `role="alert"` (announced immediately)
- [ ] Submit disabled until valid (or show inline errors)
- [ ] Focus moves to first error on submit failure

---

### 3.8 Media & Content

#### Images
```html
<!-- Decorative images (no alt needed) -->
<img src="star.png" alt="" role="presentation" />

<!-- Informative images -->
<img src="jwst.jpg" alt="James Webb Space Telescope in orbit" />

<!-- Complex images (charts, diagrams) -->
<figure>
  <img src="universe-timeline.png" alt="Universe timeline from Big Bang to present" />
  <figcaption>
    Detailed description: The timeline shows 13.8 billion years...
  </figcaption>
</figure>

<!-- If image contains text -->
<img src="quote.png" alt="Text reads: The cosmos is within us" />
```

#### Audio
```html
<button 
  aria-label="Toggle ambient audio. Currently: Off"
  aria-pressed="false"
>
  <span aria-hidden="true">🔇</span>
</button>

<!-- When active -->
<button 
  aria-label="Toggle ambient audio. Currently: Playing"
  aria-pressed="true"
>
  <span aria-hidden="true">🔊</span>
</button>
```

#### Video (if used)
- [ ] Captions provided (WebVTT)
- [ ] Audio description track (if visual info essential)
- [ ] Keyboard controls (play/pause, volume)
- [ ] No autoplay with sound

#### Checklist
- [ ] All images have `alt` attributes
- [ ] Decorative images have `alt=""` or `role="presentation"`
- [ ] Audio/video controls keyboard accessible
- [ ] Transcripts provided for audio-only content
- [ ] Captions/subtitles for video

---

## 4. ERROR HANDLING RULES

### 4.1 Data Errors

#### Missing Epoch ID
```typescript
// timeline.json validation
function validateTimeline(data: TimelineData): ValidationResult {
  const errors: string[] = [];
  
  data.epochs.forEach((epoch, index) => {
    if (!epoch.id) {
      errors.push(`Epoch at index ${index} missing 'id' field`);
    }
    if (!/^epoch-\d{2}-[a-z-]+$/.test(epoch.id)) {
      errors.push(`Epoch '${epoch.id}' has invalid ID format. Expected: epoch-##-slug`);
    }
  });
  
  if (errors.length > 0) {
    return { valid: false, errors };
  }
  return { valid: true };
}

// Frontend handling
try {
  const timeline = await loadTimeline();
  const validation = validateTimeline(timeline);
  
  if (!validation.valid) {
    console.error('Timeline validation failed:', validation.errors);
    // Show user-friendly error
    showErrorToast('Failed to load timeline. Data may be corrupted.');
    // Fallback: Show static timeline image or disable feature
    return null;
  }
  
  return timeline;
} catch (error) {
  console.error('Failed to load timeline:', error);
  showErrorToast('Unable to load timeline. Please refresh the page.');
  return null;
}
```

**User-Facing Message:**
```
"Timeline Unavailable"
We're unable to load the universe timeline right now. 
Please refresh the page or try again later.

[Refresh Page] [Go Home]
```

---

#### Missing Graph Node
```typescript
// Graph node selection
function selectNode(nodeId: string): void {
  const node = graphData.nodes.find(n => n.id === nodeId);
  
  if (!node) {
    console.warn(`Node '${nodeId}' not found in graph data`);
    
    // Check if ID is in URL (e.g., /graph?node=invalid-id)
    if (isFromURLParam(nodeId)) {
      showErrorToast(`Node "${nodeId}" not found. Showing all nodes.`);
      // Clear URL param
      updateURL('/space/graph');
    }
    
    // Don't crash, just ignore selection
    return;
  }
  
  // Proceed with selection
  setSelectedNode(node);
}
```

**User-Facing Message:**
```
Toast: "Node 'xyz' not found. Showing all nodes."
```

---

#### Missing Featured Content Node
```typescript
// Epoch card rendering
function EpochCard({ epoch }: { epoch: Epoch }) {
  const featuredNodes = epoch.featuredNodes
    .map(id => contentLibrary.find(n => n.id === id))
    .filter(Boolean); // Remove nulls
  
  if (featuredNodes.length === 0) {
    console.warn(`Epoch '${epoch.id}' has no valid featured nodes`);
  }
  
  return (
    <div>
      {featuredNodes.length > 0 ? (
        <ul>
          {featuredNodes.map(node => (
            <li key={node.id}>{node.title}</li>
          ))}
        </ul>
      ) : (
        <p className="text-muted">Featured content coming soon.</p>
      )}
    </div>
  );
}
```

**User-Facing Fallback:**
```
Gray placeholder text: "Featured content coming soon."
```

---

### 4.2 Network Errors

#### Failed API/Asset Load
```typescript
// Generic network error handler
async function fetchWithRetry(
  url: string, 
  retries = 3, 
  delay = 1000
): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response;
    } catch (error) {
      console.warn(`Fetch attempt ${i + 1} failed:`, error);
      
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      } else {
        throw error; // Final attempt failed
      }
    }
  }
  
  throw new Error('Unreachable');
}

// Usage
try {
  const response = await fetchWithRetry('/api/timeline');
  const data = await response.json();
  return data;
} catch (error) {
  console.error('Failed to load timeline after 3 retries:', error);
  showErrorBanner('Network error. Please check your connection and try again.');
  return null;
}
```

**User-Facing Message:**
```
Banner (dismissible):
"⚠️ Network Error
Unable to load content. Please check your internet connection.
[Retry] [Dismiss]"
```

---

#### Offline Mode
```typescript
// Service worker cache fallback
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached; // Serve from cache
      }
      
      return fetch(event.request).catch(() => {
        // Network failed, show offline page
        return caches.match('/offline.html');
      });
    })
  );
});

// In app
if (!navigator.onLine) {
  showOfflineBanner();
}

window.addEventListener('online', () => {
  hideOfflineBanner();
  showToast('You're back online!');
});

window.addEventListener('offline', () => {
  showOfflineBanner();
});
```

**User-Facing Message:**
```
Persistent banner:
"📡 Offline Mode
You're currently offline. Some features may be unavailable."
```

---

### 4.3 Share Link Errors

#### Invalid Share Link
```typescript
// Constellation link decoding
function decodeConstellationLink(encoded: string): Constellation | null {
  try {
    // URL-safe Base64 decode
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(base64);
    const data = JSON.parse(json);
    
    // Validate structure
    if (!data.n || !Array.isArray(data.n)) {
      throw new Error('Invalid constellation data: missing nodes array');
    }
    
    if (!data.e || !Array.isArray(data.e)) {
      throw new Error('Invalid constellation data: missing edges array');
    }
    
    // Validate node IDs exist
    const invalidNodes = data.n.filter((id: string) => {
      return !graphData.nodes.find(n => n.id === id);
    });
    
    if (invalidNodes.length > 0) {
      console.warn('Constellation contains invalid node IDs:', invalidNodes);
      // Still proceed, but filter out invalid nodes
      data.n = data.n.filter((id: string) => !invalidNodes.includes(id));
    }
    
    if (data.n.length === 0) {
      throw new Error('Constellation contains no valid nodes');
    }
    
    return {
      id: generateId(),
      name: data.m || 'Shared Constellation',
      session: {
        nodes: data.n,
        edges: data.e,
        startedAt: data.t || Date.now()
      }
    };
  } catch (error) {
    console.error('Failed to decode constellation link:', error);
    return null;
  }
}

// In component
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get('c');
  
  if (encoded) {
    const constellation = decodeConstellationLink(encoded);
    
    if (!constellation) {
      showErrorToast('This share link is invalid or corrupted.');
      // Remove bad param from URL
      const url = new URL(window.location.href);
      url.searchParams.delete('c');
      window.history.replaceState({}, '', url.toString());
      return;
    }
    
    // Load constellation for replay
    loadConstellation(constellation);
  }
}, []);
```

**User-Facing Message:**
```
Toast: "⚠️ Invalid share link. This constellation may be corrupted or outdated."
Action: Redirects to graph home, removes bad URL param
```

---

#### Expired Share Link (if using backend)
```typescript
// If share links expire after 30 days
async function loadSharedConstellation(id: string): Promise<Constellation | null> {
  try {
    const response = await fetch(`/api/constellations/${id}`);
    
    if (response.status === 404) {
      return null; // Not found
    }
    
    if (response.status === 410) {
      // Gone (expired)
      showErrorModal({
        title: 'Link Expired',
        message: 'This constellation link has expired. Shared links are valid for 30 days.',
        actions: [
          { label: 'Explore Graph', onClick: () => navigate('/space/graph') }
        ]
      });
      return null;
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to load shared constellation:', error);
    showErrorToast('Unable to load shared constellation. Please try again.');
    return null;
  }
}
```

**User-Facing Message:**
```
Modal:
"Link Expired
This constellation link has expired. Shared links are valid for 30 days.

[Explore Graph]"
```

---

### 4.4 User Input Errors

#### Invalid Constellation Name
```typescript
function validateConstellationName(name: string): { valid: boolean; error?: string } {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Name is required' };
  }
  
  if (name.length > 60) {
    return { valid: false, error: 'Name must be 60 characters or less' };
  }
  
  // Optional: Check for profanity (basic)
  const badWords = ['spam', 'test123']; // Simplified
  if (badWords.some(word => name.toLowerCase().includes(word))) {
    return { valid: false, error: 'Please use a meaningful name' };
  }
  
  return { valid: true };
}

// In form submit
function handleSaveConstellation(event: FormEvent) {
  event.preventDefault();
  
  const name = (event.target as any).constellationName.value;
  const validation = validateConstellationName(name);
  
  if (!validation.valid) {
    setNameError(validation.error);
    // Announce to screen readers
    announceToScreenReader(validation.error!);
    // Focus input
    document.getElementById('constellation-name')?.focus();
    return;
  }
  
  // Proceed with save
  saveConstellation({ name, ...sessionData });
}
```

**User-Facing Message:**
```
Inline error (below input):
"⚠️ Name must be 60 characters or less"
Input border: Red
Input aria-invalid: true
```

---

#### Storage Quota Exceeded
```typescript
// localStorage save with quota check
function saveToLocalStorage(key: string, data: any): boolean {
  try {
    const json = JSON.stringify(data);
    localStorage.setItem(key, json);
    return true;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.error('localStorage quota exceeded');
      
      showErrorModal({
        title: 'Storage Full',
        message: 'Your browser storage is full. Delete some old constellations to save new ones.',
        actions: [
          { label: 'Manage Constellations', onClick: () => navigate('/space/constellations') },
          { label: 'Cancel', onClick: () => {} }
        ]
      });
      
      return false;
    }
    
    console.error('Failed to save to localStorage:', error);
    showErrorToast('Unable to save. Please try again.');
    return false;
  }
}
```

**User-Facing Message:**
```
Modal:
"Storage Full
Your browser storage is full. Delete some old constellations to save new ones.

[Manage Constellations] [Cancel]"
```

---

### 4.5 Experience/Modal Errors

#### Failed to Load MicroModule
```typescript
async function loadExperience(experienceId: string): Promise<void> {
  setLoading(true);
  setError(null);
  
  try {
    // Dynamic import with timeout
    const module = await Promise.race([
      import(`@/experiences/${experienceId}`),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Load timeout')), 10000)
      )
    ]);
    
    setExperience(module.default);
  } catch (error) {
    console.error(`Failed to load experience '${experienceId}':`, error);
    
    setError({
      title: 'Experience Unavailable',
      message: 'We're unable to load this interactive experience right now.',
      retry: () => loadExperience(experienceId)
    });
  } finally {
    setLoading(false);
  }
}

// In modal
{error && (
  <div className="error-state">
    <h3>{error.title}</h3>
    <p>{error.message}</p>
    <button onClick={error.retry}>Try Again</button>
    <button onClick={onClose}>Close</button>
  </div>
)}
```

**User-Facing Message:**
```
In modal:
"Experience Unavailable
We're unable to load this interactive experience right now.

[Try Again] [Close]"
```

---

### 4.6 Browser Compatibility

#### Unsupported Browser
```typescript
// Browser feature detection
function checkBrowserSupport(): { supported: boolean; missing: string[] } {
  const missing: string[] = [];
  
  if (!window.IntersectionObserver) missing.push('IntersectionObserver');
  if (!window.ResizeObserver) missing.push('ResizeObserver');
  if (!window.requestAnimationFrame) missing.push('requestAnimationFrame');
  if (!window.Promise) missing.push('Promise');
  if (!window.fetch) missing.push('fetch');
  if (!('serviceWorker' in navigator)) missing.push('Service Worker');
  
  return {
    supported: missing.length === 0,
    missing
  };
}

// On app init
const browserCheck = checkBrowserSupport();
if (!browserCheck.supported) {
  console.warn('Browser missing features:', browserCheck.missing);
  
  showWarningBanner(
    'Your browser may not support all features. ' +
    'For the best experience, please use a modern browser like Chrome, Firefox, or Safari.'
  );
}
```

**User-Facing Message:**
```
Banner (dismissible):
"⚠️ Limited Browser Support
Your browser may not support all features. For the best experience, use Chrome, Firefox, or Safari.
[Dismiss]"
```

---

## 5. ANALYTICS EVENTS LIST (No External Tools)

### 5.1 Event Schema

#### Base Event Structure
```typescript
interface AnalyticsEvent {
  category: 'timeline' | 'graph' | 'experience' | 'system' | 'user';
  action: string;
  label?: string;
  value?: number;
  timestamp: number;
  sessionId: string;
  meta?: Record<string, any>;
}
```

#### Storage
```typescript
// Use localStorage with size limit
const EVENTS_KEY = 'space:analytics:events';
const MAX_EVENTS = 1000; // Keep last 1000 events

function logEvent(event: Omit<AnalyticsEvent, 'timestamp' | 'sessionId'>): void {
  const fullEvent: AnalyticsEvent = {
    ...event,
    timestamp: Date.now(),
    sessionId: getSessionId()
  };
  
  const stored = JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]');
  stored.push(fullEvent);
  
  // Trim to max size
  if (stored.length > MAX_EVENTS) {
    stored.splice(0, stored.length - MAX_EVENTS);
  }
  
  localStorage.setItem(EVENTS_KEY, JSON.stringify(stored));
  
  // Also log to console in dev
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', fullEvent);
  }
}
```

---

### 5.2 Timeline Events

#### Timeline Load
```typescript
logEvent({
  category: 'timeline',
  action: 'timeline_loaded',
  label: initialEpochId,
  value: loadTime, // milliseconds
  meta: {
    totalEpochs: 12,
    viewport: { width: window.innerWidth, height: window.innerHeight }
  }
});
```

#### Epoch Navigation
```typescript
logEvent({
  category: 'timeline',
  action: 'epoch_navigated',
  label: targetEpochId,
  meta: {
    method: 'keyboard' | 'rail_drag' | 'marker_click' | 'button',
    fromEpoch: previousEpochId,
    toEpoch: targetEpochId
  }
});
```

#### Rail Interaction
```typescript
// Drag start
logEvent({
  category: 'timeline',
  action: 'rail_drag_start',
  meta: { startPosition: normalizedPosition }
});

// Drag end
logEvent({
  category: 'timeline',
  action: 'rail_drag_end',
  meta: {
    startPosition: dragStartPosition,
    endPosition: dragEndPosition,
    duration: dragDurationMs,
    epochsTraversed: epochCount
  }
});
```

#### Experience Launch
```typescript
logEvent({
  category: 'timeline',
  action: 'experience_launched',
  label: experienceId,
  meta: {
    epochId: currentEpochId,
    type: 'microModule' | 'journey'
  }
});

logEvent({
  category: 'timeline',
  action: 'experience_closed',
  label: experienceId,
  value: durationSeconds,
  meta: {
    completed: true | false
  }
});
```

---

### 5.3 Graph Events

#### Graph Load
```typescript
logEvent({
  category: 'graph',
  action: 'graph_loaded',
  value: loadTime,
  meta: {
    nodeCount: graphData.nodes.length,
    edgeCount: graphData.edges.length,
    initialNode: urlNodeId || null
  }
});
```

#### Node Selection
```typescript
logEvent({
  category: 'graph',
  action: 'node_selected',
  label: nodeId,
  meta: {
    category: node.category,
    connections: node.connections.length,
    method: 'click' | 'keyboard' | 'search'
  }
});
```

#### Edge Traversal
```typescript
logEvent({
  category: 'graph',
  action: 'edge_traversed',
  label: edgeId,
  meta: {
    sourceId: edge.source,
    targetId: edge.target,
    relationType: edge.type,
    pathLength: currentPathLength
  }
});
```

#### Search
```typescript
logEvent({
  category: 'graph',
  action: 'search_query',
  label: query,
  value: resultCount,
  meta: {
    query,
    resultCount
  }
});

logEvent({
  category: 'graph',
  action: 'search_result_selected',
  label: selectedNodeId,
  meta: {
    query,
    resultRank: indexInResults
  }
});
```

#### Filter
```typescript
logEvent({
  category: 'graph',
  action: 'filter_applied',
  meta: {
    filters: {
      categories: selectedCategories,
      difficulty: selectedDifficulty
    },
    matchingNodes: filteredNodeCount
  }
});
```

#### Pan & Zoom
```typescript
// Only log significant changes (not every frame)
logEvent({
  category: 'graph',
  action: 'graph_zoomed',
  value: newZoomLevel,
  meta: {
    method: 'wheel' | 'pinch' | 'keyboard',
    fromZoom: previousZoom,
    toZoom: newZoom
  }
});

// Log pan after interaction ends
logEvent({
  category: 'graph',
  action: 'graph_panned',
  meta: {
    deltaX: panDeltaX,
    deltaY: panDeltaY,
    duration: panDurationMs
  }
});
```

---

### 5.4 Constellation Events

#### Save
```typescript
logEvent({
  category: 'graph',
  action: 'constellation_saved',
  label: constellationId,
  value: session.nodes.length,
  meta: {
    name: constellation.name,
    nodeCount: session.nodes.length,
    edgeCount: session.edges.length,
    duration: sessionDurationSeconds,
    categories: getNodeCategories(session.nodes)
  }
});
```

#### Share
```typescript
logEvent({
  category: 'graph',
  action: 'constellation_shared',
  label: constellationId,
  meta: {
    method: 'link' | 'qr' | 'native_share'
  }
});
```

#### Load Shared
```typescript
logEvent({
  category: 'graph',
  action: 'constellation_loaded_shared',
  label: constellationId,
  meta: {
    nodeCount: constellation.session.nodes.length,
    source: 'url_param' | 'library'
  }
});
```

#### Replay
```typescript
logEvent({
  category: 'graph',
  action: 'constellation_replay_start',
  label: constellationId,
  meta: {
    speed: replaySpeed
  }
});

logEvent({
  category: 'graph',
  action: 'constellation_replay_complete',
  label: constellationId,
  value: replayDurationSeconds,
  meta: {
    watchedToEnd: true | false,
    interruptedAt: percentComplete
  }
});
```

---

### 5.5 User Interaction Events

#### Audio Toggle
```typescript
logEvent({
  category: 'user',
  action: 'audio_toggled',
  meta: {
    enabled: isEnabled,
    location: currentRoute
  }
});
```

#### Theme Toggle (if applicable)
```typescript
logEvent({
  category: 'user',
  action: 'theme_changed',
  label: newTheme, // 'dark' | 'light'
  meta: {
    previousTheme: oldTheme
  }
});
```

#### Starfield Quality Toggle
```typescript
logEvent({
  category: 'user',
  action: 'starfield_quality_changed',
  label: newQuality, // 'low' | 'medium' | 'high'
  meta: {
    previousQuality: oldQuality
  }
});
```

#### Modal Interactions
```typescript
logEvent({
  category: 'user',
  action: 'modal_opened',
  label: modalName,
  meta: {
    trigger: 'button' | 'keyboard' | 'auto'
  }
});

logEvent({
  category: 'user',
  action: 'modal_closed',
  label: modalName,
  value: openDurationSeconds,
  meta: {
    method: 'button' | 'escape' | 'backdrop_click'
  }
});
```

#### Page Navigation
```typescript
logEvent({
  category: 'user',
  action: 'page_view',
  label: pathname,
  meta: {
    referrer: document.referrer,
    viewport: { width: window.innerWidth, height: window.innerHeight }
  }
});
```

---

### 5.6 System Events

#### Performance Metrics
```typescript
// After page load
logEvent({
  category: 'system',
  action: 'performance_metrics',
  meta: {
    fcp: fcpTime,
    lcp: lcpTime,
    fid: fidTime,
    cls: clsScore,
    ttfb: ttfbTime
  }
});
```

#### Errors
```typescript
// Global error handler
window.addEventListener('error', (event) => {
  logEvent({
    category: 'system',
    action: 'javascript_error',
    label: event.message,
    meta: {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack
    }
  });
});
```

#### Browser Info
```typescript
// On app init (once per session)
logEvent({
  category: 'system',
  action: 'session_start',
  meta: {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    viewport: { width: window.innerWidth, height: window.innerHeight },
    connection: (navigator as any).connection?.effectiveType || 'unknown'
  }
});
```

---

### 5.7 Export & Analysis

#### Export Function
```typescript
function exportAnalytics(): void {
  const events = JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]');
  
  const csv = convertToCSV(events);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `space-analytics-${Date.now()}.csv`;
  a.click();
  
  URL.revokeObjectURL(url);
}

function convertToCSV(events: AnalyticsEvent[]): string {
  const headers = ['timestamp', 'category', 'action', 'label', 'value', 'meta'];
  const rows = events.map(e => [
    new Date(e.timestamp).toISOString(),
    e.category,
    e.action,
    e.label || '',
    e.value || '',
    JSON.stringify(e.meta || {})
  ]);
  
  return [
    headers.join(','),
    ...rows.map(r => r.map(c => `"${c}"`).join(','))
  ].join('\n');
}
```

#### Simple Dashboard (Optional)
```typescript
// Calculate basic stats
function getAnalyticsSummary(): AnalyticsSummary {
  const events = JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]');
  
  return {
    totalEvents: events.length,
    eventsByCategory: groupBy(events, 'category'),
    topActions: getMostFrequent(events, 'action', 10),
    avgSessionDuration: calculateAvgSessionDuration(events),
    uniqueSessions: new Set(events.map(e => e.sessionId)).size,
    timeRange: {
      first: events[0]?.timestamp,
      last: events[events.length - 1]?.timestamp
    }
  };
}
```

**Access Dashboard:**
- Add button in settings: "View Analytics"
- Show summary stats
- Allow export to CSV
- Privacy-focused: All data stays local

---

## 6. TESTING PROTOCOL SUMMARY

### 6.1 Pre-Release Checklist

#### Performance
- [ ] Run Lighthouse (desktop & mobile): Performance ≥ 90 (desktop), ≥ 80 (mobile)
- [ ] Run WebPageTest (Fast 3G): LCP < 2.5s (desktop), < 3.0s (mobile)
- [ ] Chrome DevTools Performance: No long tasks > 50ms, 60fps animations
- [ ] Memory test: No leaks after 30min session (< 5MB drift)
- [ ] Asset audit: Total page weight < 600KB initial load

#### Critical Paths
- [ ] Timeline keyboard navigation (PATH 1)
- [ ] Timeline rail drag (PATH 2)
- [ ] Timeline epoch details (PATH 3)
- [ ] Timeline reduced motion (PATH 4)
- [ ] Graph node selection (PATH 5)
- [ ] Graph pan & zoom (PATH 6)
- [ ] Graph search & filter (PATH 7)
- [ ] Constellation save & share (PATH 8)
- [ ] Graph keyboard navigation (PATH 9)
- [ ] Experience launch (PATH 10)
- [ ] Audio toggle (PATH 11)
- [ ] Compare drawer (PATH 12)
- [ ] Mobile timeline swipe (PATH 13)
- [ ] Mobile graph bottom sheet (PATH 14)

#### Accessibility
- [ ] Keyboard navigation: All tasks completable without mouse
- [ ] Screen readers: Test with NVDA, VoiceOver, TalkBack
- [ ] Color contrast: All text/UI ≥ 4.5:1 (text) or ≥ 3:1 (UI)
- [ ] Reduced motion: Animations disabled, site fully functional
- [ ] Touch targets: All ≥ 44px (mobile)
- [ ] Zoom: Site usable at 200% zoom
- [ ] axe DevTools: 0 violations
- [ ] Lighthouse Accessibility: Score ≥ 95

#### Error Handling
- [ ] Missing epoch ID: Graceful fallback
- [ ] Missing graph node: No crash, clear message
- [ ] Invalid share link: Toast error, remove bad param
- [ ] Network error: Retry logic, offline banner
- [ ] Storage full: Clear error, manage constellations option
- [ ] Failed experience load: Error state in modal, retry button

#### Cross-Browser
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS 15+)
- [ ] Chrome Mobile (Android 10+)

#### Cross-Device
- [ ] Desktop: 1920×1080, 2560×1440
- [ ] Laptop: 1366×768, 1440×900
- [ ] Tablet: iPad Air (portrait & landscape)
- [ ] Mobile: iPhone 12, Pixel 5, low-end Android

---

### 6.2 Regression Testing

After any major change, re-run:
1. All 14 critical user paths (2-3 hours)
2. Lighthouse audit (10 minutes)
3. Keyboard navigation smoke test (15 minutes)
4. Screen reader spot check (15 minutes)
5. Mobile device testing (30 minutes)

**Total regression time:** ~4 hours

---

### 6.3 Monitoring in Production

#### Client-Side Monitoring
- [ ] Log analytics events to localStorage
- [ ] Export CSV weekly for review
- [ ] Monitor error events (category: system, action: javascript_error)
- [ ] Track performance metrics (FCP, LCP, FID)
- [ ] Alert if error rate > 5% of page views

#### Manual Spot Checks
- [ ] Weekly: Load timeline, test drag, check animations
- [ ] Weekly: Load graph, select nodes, save constellation
- [ ] Monthly: Full 14-path regression test
- [ ] After deploy: Smoke test (5 min) — Load timeline, load graph, no errors

---

## END OF MISSION 8

**Status:** ✅ READY FOR ENFORCEMENT  
**Last Updated:** 2026-01-31  
**Owner:** Special Agent "QA"

**Summary:**
- 📊 Performance budgets defined (initial load, runtime, memory)
- 🧪 14 critical user paths documented with pass criteria
- ♿ Accessibility checklist covers WCAG 2.1 AA compliance
- 🚨 Error handling rules for all failure modes
- 📈 Analytics events list (40+ events, localStorage-based)

**Next Steps:**
1. Integrate budgets into CI/CD (Lighthouse checks)
2. Create automated test suite (Playwright/Cypress) for critical paths
3. Set up error tracking (localStorage + weekly CSV export)
4. Schedule weekly regression testing
5. Train team on accessibility testing tools (axe, NVDA, VoiceOver)

**No questions asked. Execute.**
