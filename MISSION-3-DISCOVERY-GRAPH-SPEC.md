# MISSION 3 — DISCOVERY GRAPH UI + CONSTELLATION COLLECTIONS
**Owner: Special Agent B "Frontend Visual"**

---

## A) LAYOUT

### Graph Screen Structure
```
┌─────────────────────────────────────────────────────────────────┐
│ TOP CONTROLS BAR (fixed, 64px height)                          │
│ [Logo] [Search] [Filter] [View: Graph|List] [Save] [Share]    │
└─────────────────────────────────────────────────────────────────┘
┌───────────────────────────┬─────────────────────────────────────┐
│                           │ SIDE PANEL (collapsible)            │
│                           │ Width: 360px (desktop)              │
│                           │ Overlay on mobile                   │
│                           ├─────────────────────────────────────┤
│                           │ [Tabs: Detail | Journey | Share]   │
│                           │                                     │
│  GRAPH CANVAS             │ --- DETAIL TAB ---                  │
│  (responsive, fills       │ • Node title + category icon       │
│   remaining space)        │ • Description                       │
│                           │ • Tags                              │
│  Minimum: 480px wide      │ • Related nodes (clickable)         │
│  Recommended: 800px+      │ • Actions: Visit | Add to Journey   │
│                           │                                     │
│  - Pan: click + drag      │ --- JOURNEY TAB ---                 │
│  - Zoom: scroll / pinch   │ • Session timer                     │
│  - Select: click node     │ • Path breadcrumbs (5 most recent)  │
│  - Keyboard nav enabled   │ • Stats: nodes visited, edges        │
│                           │   traversed                         │
│                           │ • Actions: Save Constellation       │
│                           │                                     │
│                           │ --- SHARE TAB ---                   │
│                           │ • Constellation name (editable)     │
│                           │ • Generated share link              │
│                           │ • QR code                           │
│                           │ • Replay controls                   │
│                           │                                     │
└───────────────────────────┴─────────────────────────────────────┘
```

### Responsive Behavior
- **Desktop (≥1280px)**: Side panel open by default, canvas + panel side-by-side
- **Tablet (768-1279px)**: Side panel collapsible, icon button to toggle
- **Mobile (<768px)**: Side panel as bottom sheet / modal overlay, swipe up to open

### Keyboard Navigation Map
```
Arrow Keys       → Navigate between connected nodes (follows edges)
Enter            → Open selected node detail
Escape           → Deselect / Close panel
Tab              → Cycle through visible nodes
Shift + Tab      → Cycle backwards
Space            → Center selected node in viewport
+/=              → Zoom in
-                → Zoom out
0                → Reset zoom & pan
S                → Save constellation (with Ctrl/Cmd)
F                → Focus search bar (with Ctrl/Cmd)
```

---

## B) VISUAL RULES

### Node Visual System

#### Category Shapes & Icons
Each node category has a distinct shape + icon marker:

| Category      | Shape          | Icon   | Base Color | Glow Color    |
|---------------|----------------|--------|------------|---------------|
| **Concept**   | Circle         | 🔭     | #8B5CF6    | #A78BFA       |
| **Mission**   | Rounded Square | 🚀     | #22D3EE    | #67E8F9       |
| **Telescope** | Hexagon        | 📡     | #F59E0B    | #FCD34D       |
| **Fact**      | Diamond        | ✨     | #10B981    | #6EE7B7       |
| **Term**      | Triangle       | 📖     | #E11D48    | #FB7185       |
| **Realm**     | Star (5-point) | 🌌     | #6366F1    | #818CF8       |

#### Node States & Visual Feedback

**1. Default State**
- Fill: Category base color at 80% opacity
- Stroke: 2px solid white/20%
- Icon: Centered, 14px, white
- Label: Below node, 12px, white/90%
- Drop shadow: 0 2px 8px rgba(0,0,0,0.3)

**2. Hover State**
- Fill: Category base color at 100% opacity
- Stroke: 2px solid white/40%
- Glow: 0 0 12px glow color
- Scale: 1.05 transform
- Cursor: pointer
- Connected edges: Highlight at 60% opacity

**3. Selected State**
- Fill: Category base color at 100%
- Stroke: 3px solid white/80%
- Glow: 0 0 20px glow color + pulse animation
- Scale: 1.15 transform
- Label: Bold, 14px
- Connected edges: Full opacity + animated flow

**4. Visited State**
- Fill: Desaturated category color (-30% saturation)
- Icon: Checkmark overlay (✓) in corner, 8px
- Border: Dotted instead of solid
- Opacity: 85%
- Persists across session

**5. Locked State** (future feature)
- Fill: Grayscale (#666)
- Icon: Lock (🔒)
- Opacity: 50%
- Cursor: not-allowed
- Tooltip: "Complete X to unlock"

**6. Dimmed State** (when filtering)
- Opacity: 25%
- No hover effects
- Cursor: default

#### Node Sizing Rules
```javascript
// Base radius calculation
const baseRadius = 12;
const difficultyBonus = {
  beginner: 0,
  intermediate: 2,
  advanced: 4
};
const connectionBonus = Math.min(6, node.connections.length * 0.5);

const finalRadius = baseRadius + difficultyBonus[node.difficulty] + connectionBonus;
// Range: 12px (simple beginner) to 22px (highly connected advanced)
```

### Edge Visual System

#### Edge Types & Styling

| Relation        | Style          | Color       | Thickness | Animation      |
|-----------------|----------------|-------------|-----------|----------------|
| **explains**    | Solid          | #A78BFA 40% | 2px       | Arrow flow →   |
| **depends_on**  | Dashed (4-2)   | #67E8F9 40% | 2px       | Pulse slow     |
| **example_of**  | Dotted (2-3)   | #FCD34D 35% | 1.5px     | None           |
| **observed_by** | Solid          | #6EE7B7 40% | 2px       | Glow pulse     |
| **connected**   | Solid (thin)   | #FFF 18%    | 1px       | None           |

#### Edge States

**Default**
- Baseline opacity and thickness as above
- Straight line (or slight curve if nodes close)
- Label at midpoint (10px font, category color, fade in on hover)

**Hover** (when hovering over edge)
- Opacity: +40%
- Thickness: +1px
- Label: Always visible, white background pill
- Highlight connected nodes (slight glow)

**Active Path** (when node selected)
- Edges connected to selected node:
  - Opacity: 100%
  - Thickness: +1px
  - Animated: Flow direction (explains), pulse (depends_on)
- Other edges: Opacity 15%

**Traversed** (user jumped along this edge)
- Color shift: Add 20% green tint
- Thickness: +0.5px permanently
- Dotted trail effect fades after 2 seconds

#### Edge Rendering Order
1. Dimmed edges (filtered out)
2. Default edges
3. Hovered edges
4. Active path edges
5. Selected edge (top layer)

---

## C) INTERACTIONS

### Primary Interactions

#### 1. Node Selection
**Trigger**: Click node | Press Enter when focused | Tap (mobile)

**Result**:
- Node enters Selected state (visual changes)
- Side panel opens Detail tab
- Canvas pans to center selected node (smooth animation, 400ms)
- Connected edges animate
- URL updates: `/space/graph?node={id}`

**Edge case**: If clicking already-selected node → deselect and close panel

#### 2. Edge Traversal (Jump)
**Trigger**: Click connected node from detail panel | Arrow keys

**Result**:
- Previous node → Visited state
- New node → Selected state
- Edge gets "traversed" visual
- Journey panel updates breadcrumb
- Record event in session (for constellation)
- Emit event: `space:node-traversed`

**Smooth transition**:
```typescript
// Pseudo animation
const jumpDuration = 600;
1. Fade out old detail panel (200ms)
2. Pan canvas to new node (600ms ease-out)
3. Pulse new node (400ms, starts at 300ms)
4. Fade in new detail panel (200ms, starts at 400ms)
```

#### 3. Graph Navigation (Pan/Zoom)
**Pan**:
- Click + drag background
- Touch + drag (mobile)
- Arrow keys (when no node focused)
- Smooth momentum scroll (ease-out)

**Zoom**:
- Mouse wheel: ±10% per tick, range 0.5x to 2.5x
- Pinch gesture (mobile)
- Keyboard: +/- keys
- Zoom preserves cursor position (zoom toward mouse)

**Reset**:
- Keyboard: 0
- UI button: "Reset View"
- Double-click background (optional)

#### 4. Search & Filter
**Search**:
- Input field in top bar (Cmd/Ctrl+F to focus)
- Real-time fuzzy search on: title, tags, summary
- Results: highlight matching nodes (pulse), dim others
- Up/Down arrows cycle through results
- Enter selects top result

**Filter**:
- Dropdown/pills for:
  - Category (concept, mission, telescope, fact, term)
  - Difficulty (beginner, intermediate, advanced)
  - Realm (known, unseen, human) [if using halfspace graph]
- Multi-select allowed
- Filtered nodes: Dimmed state
- Filtered edges: Hidden if both nodes dimmed
- Show count: "Showing 23/150 nodes"

#### 5. Return to Previous Node
**Trigger**: Browser back button | Escape key | "Back" button in panel

**Result**:
- Pop last node from journey stack
- Select previous node
- Journey breadcrumb updates
- Does NOT mark edge as traversed (only forward jumps do)

---

## D) COLLECTION MODEL (Constellation System)

### What is a Constellation?

A **Constellation** is a saved journey session — the path a user took through the knowledge graph, preserved for replay, sharing, and reflection.

**Metaphor**: Just as ancient astronomers connected stars into constellations to tell stories, users connect knowledge nodes into their own narrative paths.

### Session → Constellation Flow

#### 1. Session Recording (Automatic)

Session starts when:
- User first clicks a node
- Or when user navigates to `/space/graph`

Session captures:
```typescript
interface GraphSession {
  sessionId: string;              // UUID
  startedAt: number;              // Unix timestamp
  events: RecordedSpaceEvent[];   // From existing recorder
  nodes: string[];                // Visited node IDs (ordered)
  edges: string[];                // Traversed edge IDs (ordered)
  metadata: {
    duration: number;             // Seconds
    uniqueNodes: number;
    deepestDepth: number;         // Max connections from start
    dominantCategory: string;     // Most visited type
  };
}
```

**Events recorded**:
- `node-visited`: { nodeId, timestamp }
- `node-selected`: { nodeId, previousId, timestamp }
- `edge-traversed`: { edgeId, sourceId, targetId, timestamp }
- `graph-zoomed`: { scale, timestamp } [optional]
- `graph-panned`: { offsetX, offsetY, timestamp } [optional]

#### 2. Save Constellation

**Trigger**: "Save Constellation" button in Journey tab

**UI Flow**:
```
1. Show modal: "Save Your Constellation"
2. Pre-filled name: "Journey: {dominantCategory} · {uniqueNodes} nodes"
3. Editable text input (max 60 chars)
4. Optional: Add description (textarea, max 200 chars)
5. Button: "Save & Share" (primary) | "Cancel"
```

**Result**:
```typescript
interface Constellation {
  id: string;                     // Unique ID
  name: string;                   // User-provided
  description?: string;
  session: GraphSession;
  createdAt: number;
  thumbnailData?: string;         // Base64 mini-preview of graph
}
```

**Storage**:
- localStorage: `space:constellations` (array of Constellation objects)
- Max 50 constellations per browser (FIFO eviction)
- Optional future: Backend API for persistent storage + accounts

#### 3. Share Link Generation

**Format**: `/space/graph/constellation/{id}` or `/space/graph?c={id}`

**Encoding**:
```typescript
// Compact URL-safe encoding
function encodeConstellation(c: Constellation): string {
  const compact = {
    n: c.session.nodes,           // Visited node IDs
    e: c.session.edges,           // Edge IDs
    t: c.session.startedAt,
    m: c.name
  };
  const json = JSON.stringify(compact);
  const base64 = btoa(json);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
```

**Max URL length**: 2048 chars (browser safe)
- Average node path (10 nodes): ~150 chars
- Safe for up to ~50 nodes in path

**Fallback**: If URL too long, generate short ID and store on backend (future)

#### 4. Constellation Library UI

**Location**: `/space/graph/constellations` or side panel tab

**Layout**:
```
┌─────────────────────────────────────────────────┐
│ Your Constellations (12)                [+ New] │
├─────────────────────────────────────────────────┤
│ ┌─────────────────┐  ┌─────────────────┐       │
│ │ Thumbnail       │  │ Thumbnail       │       │
│ │ (mini graph)    │  │ (mini graph)    │       │
│ ├─────────────────┤  ├─────────────────┤       │
│ │ Journey Name    │  │ Journey Name    │       │
│ │ 15 nodes · 12m  │  │ 8 nodes · 5m    │       │
│ │ 2 hours ago     │  │ Yesterday       │       │
│ │ [Replay] [Share]│  │ [Replay] [Share]│       │
│ └─────────────────┘  └─────────────────┘       │
│ ...                                             │
└─────────────────────────────────────────────────┘
```

**Card Actions**:
- Click card → Replay constellation
- Share button → Copy link + show QR code
- Rename (pencil icon)
- Delete (trash icon, with confirmation)

---

### Replay Constellation Mode

**Trigger**: Click "Replay" on constellation card | Visit shared link

**UI Changes**:
```
┌─────────────────────────────────────────────────┐
│ 🎬 REPLAYING: "Journey Name"          [Exit]   │
│ ━━━━━━━━━━━━━━━━━━━○━━━━━━━━  8/15 nodes      │
│ [◄◄ -10s] [❚❚ Pause] [►► +10s]  Speed: [1x ▼]│
└─────────────────────────────────────────────────┘
```

**Replay Behavior**:
1. Graph resets to initial state
2. Nodes highlight/select in sequence
3. Edges animate as traversed
4. Side panel shows detail for each node (with delay)
5. User can pause/resume, scrub timeline
6. Speed options: 0.5x, 1x, 2x, 5x
7. User can interrupt: Click any node → exit replay, start new session

**Timeline scrubbing**:
- Click progress bar → Jump to that point in replay
- Hover progress bar → Show preview tooltip (node name)

**Event emission during replay**:
```typescript
// All events tagged with meta.replay = true
emitSpaceEvent('node-visited', { nodeId, meta: { replay: true } });
```

---

## E) PERFORMANCE CHECKLIST

### Max Nodes on Screen

**Limits**:
- **Ideal**: 150 nodes, 300 edges (smooth 60fps)
- **Max hard cap**: 500 nodes, 1000 edges (acceptable 30fps)
- **Emergency fallback**: List view at 1000+ nodes

**Detection**:
```typescript
function chooseRenderMode(nodeCount: number): 'canvas' | 'webgl' | 'list' {
  if (nodeCount <= 150) return 'canvas';      // Canvas 2D (current)
  if (nodeCount <= 500) return 'webgl';       // WebGL (future)
  return 'list';                              // Fallback list (current)
}
```

### Clustering Strategy

**Trigger**: When nodes exceed 200 on screen

**Approach**: Hierarchical clustering by category + proximity
```typescript
interface Cluster {
  id: string;
  nodes: KnowledgeNode[];
  center: { x: number; y: number };
  radius: number;
  label: string; // e.g., "8 Concepts"
}

// Visual for cluster
- Circle with dashed border
- Size proportional to node count (max radius: 40px)
- Label shows count + dominant category
- Hover: Show node list tooltip
- Click: Expand cluster (animate nodes out)
- Zoom in: Auto-expand clusters below threshold size
```

**Cluster distance threshold**:
- Nodes within 80px (world coords) → Same cluster
- Max 20 nodes per cluster (split if exceeded)

**Clustering disable**:
- User searches (show all matches)
- User selects node (expand cluster if needed)
- Zoom level > 1.5x (too close to cluster)

### Degrade Gracefully

**Performance Budget**:
- 60fps target on mid-range devices (2020 laptop)
- 30fps acceptable on weak devices (old tablet)

**Progressive degradation tiers**:

**Tier 1** (Full fidelity, <150 nodes):
- All animations (glow, pulse, flow)
- Drop shadows
- Real-time edge labels
- Smooth zoom/pan (60fps)

**Tier 2** (Reduced, 150-300 nodes):
- Disable edge animations
- No drop shadows
- Edge labels on hover only
- Zoom/pan still smooth

**Tier 3** (Minimal, 300-500 nodes):
- No glow effects
- Solid fills only (no gradients)
- Edges as thin lines (no thickness variation)
- Snap zoom (no smooth animation)
- Culling: Only render nodes in viewport + 100px margin

**Tier 4** (Emergency, 500+ nodes):
- Force list view (GraphListFallback)
- OR: WebGL renderer (if available)

**Auto-detection**:
```typescript
function detectPerformanceTier(): 1 | 2 | 3 | 4 {
  const cores = navigator.hardwareConcurrency ?? 2;
  const memory = (navigator as any).deviceMemory ?? 4; // GB
  const gpu = detectWebGLCapability();

  if (cores >= 4 && memory >= 8 && gpu === 'high') return 1;
  if (cores >= 2 && memory >= 4 && gpu === 'medium') return 2;
  if (cores >= 2 || gpu === 'basic') return 3;
  return 4;
}
```

### Viewport Culling

**Strategy**: Only render nodes visible in viewport + margin

```typescript
const CULLING_MARGIN = 150; // pixels

function isNodeVisible(node: LayoutNode, viewport: Viewport): boolean {
  const { sx, sy } = getScreenPos(node.x, node.y, canvas);
  return (
    sx > -CULLING_MARGIN &&
    sy > -CULLING_MARGIN &&
    sx < viewport.width + CULLING_MARGIN &&
    sy < viewport.height + CULLING_MARGIN
  );
}

// During render
const visibleNodes = layoutNodes.filter(n => isNodeVisible(n, viewport));
// Only draw visibleNodes and their edges
```

**Benefit**: 150 nodes → ~30-50 visible at zoom 1x (5x fewer draws)

### Debouncing & Throttling

**Pan/Zoom**:
- Throttle canvas redraw: Max 60fps (16.67ms)
- Debounce layout recalculation: 150ms after zoom/pan stops

**Search**:
- Debounce input: 200ms after typing stops

**Resize**:
- Debounce canvas resize: 150ms after window resize

### Canvas Optimization

**Re-use patterns**:
```typescript
// Cache for repeated draws
const nodeShapeCache = new Map<string, Path2D>();

function getNodeShape(type: string, radius: number): Path2D {
  const key = `${type}-${radius}`;
  if (!nodeShapeCache.has(key)) {
    const path = new Path2D();
    // Draw shape...
    nodeShapeCache.set(key, path);
  }
  return nodeShapeCache.get(key)!;
}
```

**Layered rendering** (future):
- Layer 1: Static edges (redraw only on data change)
- Layer 2: Static nodes (redraw only on data change)
- Layer 3: Interactive (hover, selection) — redraws every frame
- Use 3 stacked canvases

---

## F) EXACT USER FLOWS

### Flow 1: Open Graph → Explore → Save Constellation

**Steps**:
1. User navigates to `/space/graph`
2. Graph loads with default view (all nodes, zoom 1x, centered)
3. Side panel shows "Journey" tab (empty)
4. User clicks "Black Holes" node
   - Node animates to Selected state
   - Side panel switches to Detail tab
   - Canvas pans to center node
   - Connected nodes (Event Horizon, Stars, EHT) highlight
5. User clicks "Event Horizon" in Related Nodes
   - Black Holes → Visited state
   - Event Horizon → Selected state
   - Edge animates "traversed"
   - Journey tab updates: "Black Holes → Event Horizon"
6. User clicks "Stars" from Related Nodes
   - Journey: "Black Holes → Event Horizon → Stars"
7. User switches to Journey tab (side panel)
   - Sees breadcrumb, stats: "3 nodes, 2 connections, 1m 23s"
8. User clicks "Save Constellation"
   - Modal opens with name: "Journey: Concept · 3 nodes"
   - User edits name: "Black Hole Basics"
   - Clicks "Save & Share"
9. Toast: "Constellation saved!" + link copied
10. Constellation appears in library

**Time**: ~2 minutes  
**Events recorded**: 3 × node-visited, 2 × edge-traversed

---

### Flow 2: Share Constellation → Friend Opens Link

**Steps**:
1. User clicks "Share" button in Journey tab (or on constellation card)
2. Modal opens: "Share Your Constellation"
   - Shows: Link, QR code, Copy button
   - Preview: Mini graph thumbnail
3. User clicks "Copy Link"
   - Copies: `https://yoursite.com/space/graph?c=eyJuIjpbIm...`
   - Toast: "Link copied!"
4. User sends link to friend via message
5. Friend opens link in browser
6. Graph page loads with special header: "🎬 Viewing: Black Hole Basics"
   - Play button prominent
   - "Start Your Own Journey" button
7. Friend clicks Play
   - Replay starts automatically
   - Nodes highlight in sequence: Black Holes → Event Horizon → Stars
   - Friend watches the path animate (takes ~15 seconds at 1x speed)
8. Replay ends
   - Toast: "Replay complete. Start your own journey?"
   - Graph remains interactive
9. Friend clicks "Start Your Own Journey"
   - Clears replay state
   - New session begins
   - Friend can now click any node

**Time**: ~1 minute  
**Result**: Knowledge shared, engagement increased

---

### Flow 3: Keyboard Navigation Power User

**Steps**:
1. User opens `/space/graph`
2. Presses `Tab` → First node focused (glow + outline)
3. Presses `Enter` → Node selected, detail opens
4. Presses `→` (right arrow)
   - Navigates to first connected node (follows edge)
5. Presses `→` again
   - Navigates to next connected node
6. Presses `Space`
   - Canvas centers on current node (smooth pan)
7. Presses `+` (zoom in) × 3
   - Zooms to 1.3x
8. Presses `Escape`
   - Deselects node, closes detail panel
9. Presses `Cmd+F` (or Ctrl+F)
   - Search input focused
10. Types "quantum"
    - Real-time: Matching nodes pulse
11. Presses `Enter`
    - Top result selected
12. Presses `Cmd+S` (or Ctrl+S)
    - Save constellation modal opens
13. Types name, presses `Enter`
    - Saved

**Time**: ~45 seconds  
**Efficiency**: 3x faster than mouse-only

---

### Flow 4: Mobile Touch Experience

**Steps**:
1. User opens `/space/graph` on phone (portrait)
2. Canvas fills screen (top bar + mini bottom controls)
3. User taps "Black Holes" node
   - Bottom sheet slides up with Detail tab
   - Canvas auto-pans node above bottom sheet (60% visible)
4. User swipes down on bottom sheet
   - Sheet minimizes (tab indicators only)
5. User pinch-zooms graph
   - Canvas zooms 1.5x, smooth
6. User drags with one finger
   - Canvas pans around
7. User taps "Event Horizon" node
   - Bottom sheet springs back up
   - Detail updates
8. User taps "Journey" tab in bottom sheet
   - Shows breadcrumb, stats
9. User taps "Save Constellation"
   - Full-screen modal (mobile-optimized)
   - Large touch targets
10. User taps "Share" button
    - Mobile share sheet opens (native)
    - Can share via WhatsApp, SMS, etc.

**Time**: ~1-2 minutes  
**Optimizations**: Large touch targets (44px min), swipe gestures, native share

---

### Flow 5: Return from External Link → Resume Session

**Steps**:
1. User is exploring graph, visits 5 nodes
2. User clicks "Visit Page" button on "JWST" node
   - Opens `/space/encyclopedia/jwst` in same tab
3. User reads article for 2 minutes
4. User clicks "Back to Graph" link in article header
   - Returns to `/space/graph?node=jwst`
5. Graph loads with:
   - JWST node pre-selected
   - Previous 4 nodes in Visited state
   - Journey tab shows full breadcrumb
   - Session still active (not reset)
6. User can continue exploring or save

**Time**: ~3-4 minutes total  
**Key**: Session persists across page navigations via sessionStorage

---

## IMPLEMENTATION CHECKLIST

### Phase 1: Core Visuals (Week 1)
- [ ] Implement node shape system (circle, square, hexagon, diamond, triangle, star)
- [ ] Add category icons to nodes
- [ ] Create node state styles (default, hover, selected, visited, dimmed)
- [ ] Implement edge type rendering (solid, dashed, dotted)
- [ ] Add edge labels on hover

### Phase 2: Interactions (Week 1-2)
- [ ] Node selection with side panel integration
- [ ] Edge traversal tracking
- [ ] Keyboard navigation (arrow keys, tab, enter)
- [ ] Search with real-time highlighting
- [ ] Filter by category/difficulty

### Phase 3: Session Recording (Week 2)
- [ ] Integrate existing recorder with graph events
- [ ] Track node visits, edge traversals
- [ ] Journey tab UI (breadcrumbs, stats)
- [ ] Session metadata calculation

### Phase 4: Constellation System (Week 2-3)
- [ ] Save constellation modal
- [ ] localStorage persistence
- [ ] Share link encoding/decoding
- [ ] Constellation library UI
- [ ] QR code generation

### Phase 5: Replay Engine (Week 3)
- [ ] Replay controls UI
- [ ] Timeline scrubbing
- [ ] Speed controls (0.5x, 1x, 2x, 5x)
- [ ] Event replay with animation
- [ ] Shared link handling

### Phase 6: Performance (Week 4)
- [ ] Viewport culling
- [ ] Performance tier detection
- [ ] Clustering system (200+ nodes)
- [ ] Canvas optimization (shape caching)
- [ ] Fallback to list view

### Phase 7: Polish (Week 4)
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Touch gestures (pinch zoom, swipe)
- [ ] Animations and transitions
- [ ] Loading states
- [ ] Error handling

---

## TECHNICAL DEPENDENCIES

### Required Libraries (Light)
```json
{
  "qr-code-styling": "^1.6.0",  // QR code generation
  "eventemitter3": "^5.0.0"     // Event bus (if not using custom)
}
```

### Optional (If Scaling)
```json
{
  "pixi.js": "^7.0.0"            // WebGL rendering for 500+ nodes
  // OR
  "d3-force": "^3.0.0"           // Force-directed layout (advanced)
}
```

### No Heavy Graph Library Required
- Current canvas implementation is sufficient for <300 nodes
- Custom implementation gives full control over performance
- Can add WebGL layer later if needed

---

## SUCCESS METRICS

### Performance
- [ ] 60fps on 2020 laptop (150 nodes)
- [ ] <3s initial load time
- [ ] <100ms node selection response
- [ ] <500ms constellation save time

### User Engagement
- [ ] Avg session: >3 minutes
- [ ] Avg nodes visited: >10
- [ ] Constellation save rate: >20%
- [ ] Share rate: >5% of saved constellations

### Accessibility
- [ ] Full keyboard navigation
- [ ] Screen reader support (aria labels on nodes)
- [ ] High contrast mode support
- [ ] Touch target size: ≥44px (mobile)

---

## DESIGN TOKENS (For Reference)

```css
/* Graph Colors */
--graph-bg: #0a0118;
--graph-node-concept: #8B5CF6;
--graph-node-mission: #22D3EE;
--graph-node-telescope: #F59E0B;
--graph-node-fact: #10B981;
--graph-node-term: #E11D48;
--graph-edge-default: rgba(255,255,255,0.18);
--graph-edge-active: rgba(255,255,255,0.6);

/* Interactions */
--transition-fast: 150ms;
--transition-medium: 300ms;
--transition-slow: 600ms;

/* Spacing */
--node-base-radius: 12px;
--edge-base-thickness: 2px;
--panel-width-desktop: 360px;
--panel-width-mobile: 100vw;
--topbar-height: 64px;
```

---

## END OF SPECIFICATION

**Status**: Ready for implementation  
**Estimated effort**: 3-4 weeks (1 developer)  
**Dependencies**: Existing recorder system ✅, Canvas component ✅  
**Blockers**: None

**Next steps**:
1. Review & approve this spec
2. Create implementation tasks (GitHub issues)
3. Begin Phase 1 (Core Visuals)

---

**Document version**: 1.0  
**Last updated**: 2026-01-31  
**Author**: Special Agent B "Frontend Visual"
