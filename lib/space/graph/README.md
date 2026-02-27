# Discovery Graph UI - Implementation Guide

This directory contains the core infrastructure for the **Discovery Graph UI + Constellation Collections** system (Mission 3).

## 📁 File Structure

```
lib/space/graph/
├── constellation.types.ts      # All TypeScript type definitions
├── constellationEngine.ts      # Core logic (sessions, encoding, storage)
├── visualConfig.ts             # Visual styling and configuration
├── graphBuilder.ts             # Graph data builder (existing)
└── README.md                   # This file

components/space/graph/
├── GraphCanvas.tsx             # Canvas renderer (existing, needs updates)
├── GraphListFallback.tsx       # List view fallback (existing)
└── (new components needed - see below)
```

## 🚀 Quick Start

### 1. Session Recording

```typescript
import { constellationSession } from '@/lib/space/graph/constellationEngine'

// Start recording when user enters graph
const sessionId = constellationSession.startSession()

// Record node visits
constellationSession.recordNodeVisit(nodeId, event)

// Record edge traversals
constellationSession.recordEdgeTraversal(edgeId, event)

// Get current session
const session = constellationSession.getSession()

// End session
const finalSession = constellationSession.endSession()
```

### 2. Save Constellation

```typescript
import { 
  generateConstellationId, 
  generateConstellationName,
  saveConstellation 
} from '@/lib/space/graph/constellationEngine'

const session = constellationSession.getSession()
if (!session) return

const constellation: Constellation = {
  id: generateConstellationId(),
  name: generateConstellationName(session),
  description: 'Optional description',
  session,
  createdAt: Date.now(),
}

const saved = saveConstellation(constellation)
```

### 3. Generate Share Link

```typescript
import { 
  encodeConstellation, 
  constellationToUrl 
} from '@/lib/space/graph/constellationEngine'

const shareUrl = constellationToUrl(constellation, 'https://yoursite.com')
// Example: https://yoursite.com/space/graph?c=eyJuIjpbIm...

// Copy to clipboard
navigator.clipboard.writeText(shareUrl)
```

### 4. Load from Share Link

```typescript
import { urlToConstellation } from '@/lib/space/graph/constellationEngine'

const compactData = urlToConstellation(window.location.href)
if (compactData) {
  // Reconstruct constellation and replay
  const { n: nodes, e: edges, m: name } = compactData
  // Start replay with nodes/edges
}
```

### 5. Visual Configuration

```typescript
import { 
  getNodeVisualConfig, 
  getEdgeVisualConfig,
  GRAPH_COLORS,
  drawNodeShape
} from '@/lib/space/graph/visualConfig'

// Get node visual config
const nodeConfig = getNodeVisualConfig(
  'concept',      // category
  'selected',     // state
  'intermediate', // difficulty
  5               // connection count
)

// Draw node on canvas
const ctx = canvas.getContext('2d')
ctx.fillStyle = nodeConfig.baseColor
drawNodeShape(ctx, nodeConfig.shape, x, y, nodeConfig.radius)
ctx.fill()
```

## 🔧 Component Integration

### Update GraphCanvas Component

Enhance the existing `GraphCanvas.tsx` with constellation features:

```typescript
// Add to GraphCanvas.tsx
import { constellationSession } from '@/lib/space/graph/constellationEngine'
import { getNodeVisualConfig, drawNodeShape } from '@/lib/space/graph/visualConfig'

function GraphCanvas({ nodes, edges, onNodeClick }) {
  // ... existing code ...

  const handleNodeClick = (node: GraphNode) => {
    // Record in session
    constellationSession.recordNodeVisit(node.id, {
      type: 'node-visited',
      payload: { nodeId: node.id },
      offsetMs: performance.now(),
    })

    // Trigger callback
    onNodeClick?.(node)
  }

  // Update rendering to use visual configs
  const renderNode = (node: GraphNode, state: NodeState) => {
    const config = getNodeVisualConfig(
      node.category,
      state,
      node.difficulty,
      node.connections.length
    )

    ctx.fillStyle = config.baseColor
    drawNodeShape(ctx, config.shape, x, y, config.radius)
    ctx.fill()

    // Add glow for selected state
    if (state === 'selected') {
      ctx.shadowColor = config.glowColor
      ctx.shadowBlur = 20
    }
  }
}
```

### Create Side Panel Component

New component: `components/space/graph/GraphSidePanel.tsx`

```typescript
import { useState } from 'react'
import type { GraphNode, JourneyBreadcrumb, JourneyStats } from '@/lib/space/graph/constellation.types'

interface GraphSidePanelProps {
  selectedNode?: GraphNode
  journey: JourneyBreadcrumb[]
  stats: JourneyStats
  onSave: () => void
  onShare: () => void
}

export function GraphSidePanel({ selectedNode, journey, stats, onSave, onShare }: GraphSidePanelProps) {
  const [activeTab, setActiveTab] = useState<'detail' | 'journey' | 'share'>('detail')

  return (
    <div className="w-[360px] h-full bg-black/70 border-l border-purple-500/30">
      {/* Tab buttons */}
      <div className="flex border-b border-white/10">
        <button onClick={() => setActiveTab('detail')}>Detail</button>
        <button onClick={() => setActiveTab('journey')}>Journey</button>
        <button onClick={() => setActiveTab('share')}>Share</button>
      </div>

      {/* Tab content */}
      {activeTab === 'detail' && selectedNode && (
        <DetailTab node={selectedNode} />
      )}

      {activeTab === 'journey' && (
        <JourneyTab journey={journey} stats={stats} onSave={onSave} />
      )}

      {activeTab === 'share' && (
        <ShareTab onShare={onShare} />
      )}
    </div>
  )
}
```

### Create Constellation Library Component

New component: `components/space/graph/ConstellationLibrary.tsx`

```typescript
import { useState, useEffect } from 'react'
import { loadConstellations, deleteConstellation } from '@/lib/space/graph/constellationEngine'
import type { Constellation } from '@/lib/space/graph/constellation.types'

export function ConstellationLibrary({ onReplay }: { onReplay: (c: Constellation) => void }) {
  const [constellations, setConstellations] = useState<Constellation[]>([])

  useEffect(() => {
    setConstellations(loadConstellations())
  }, [])

  return (
    <div className="grid grid-cols-2 gap-4 p-6">
      {constellations.map((constellation) => (
        <ConstellationCard
          key={constellation.id}
          constellation={constellation}
          onReplay={() => onReplay(constellation)}
          onDelete={() => {
            deleteConstellation(constellation.id)
            setConstellations(loadConstellations())
          }}
        />
      ))}
    </div>
  )
}
```

### Create Replay Controls Component

New component: `components/space/graph/ReplayControls.tsx`

```typescript
import type { ReplayProgress, ReplaySpeed } from '@/lib/space/graph/constellation.types'

interface ReplayControlsProps {
  progress: ReplayProgress
  speed: ReplaySpeed
  onPlay: () => void
  onPause: () => void
  onStop: () => void
  onSpeedChange: (speed: ReplaySpeed) => void
}

export function ReplayControls({ progress, speed, onPlay, onPause, onStop, onSpeedChange }: ReplayControlsProps) {
  const isPlaying = progress.state === 'playing'

  return (
    <div className="fixed top-16 left-0 right-0 bg-black/90 border-b border-purple-500/30 p-4">
      <div className="max-w-4xl mx-auto flex items-center gap-4">
        <span className="text-sm">🎬 Replaying</span>
        
        {/* Progress bar */}
        <div className="flex-1">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-purple-500 transition-all"
              style={{ width: `${(progress.currentIndex / progress.totalEvents) * 100}%` }}
            />
          </div>
          <p className="text-xs text-white/60 mt-1">
            {progress.currentIndex} / {progress.totalEvents} events
          </p>
        </div>

        {/* Controls */}
        <button onClick={isPlaying ? onPause : onPlay}>
          {isPlaying ? '❚❚ Pause' : '▶ Play'}
        </button>
        <button onClick={onStop}>⏹ Stop</button>

        {/* Speed selector */}
        <select value={speed} onChange={(e) => onSpeedChange(Number(e.target.value) as ReplaySpeed)}>
          <option value={0.5}>0.5x</option>
          <option value={1}>1x</option>
          <option value={2}>2x</option>
          <option value={5}>5x</option>
        </select>
      </div>
    </div>
  )
}
```

## 📊 Data Flow

```
User Action
    ↓
GraphCanvas (click node)
    ↓
constellationSession.recordNodeVisit()
    ↓
Session updated (nodes[], edges[], events[])
    ↓
User clicks "Save Constellation"
    ↓
generateConstellationId() + generateConstellationName()
    ↓
saveConstellation() → localStorage
    ↓
User clicks "Share"
    ↓
encodeConstellation() → URL
    ↓
Copy to clipboard / Generate QR code
```

## 🎨 Styling Examples

### Node with Glow Effect

```typescript
// In canvas rendering
const config = getNodeVisualConfig('concept', 'selected', 'beginner', 3)

ctx.shadowColor = config.glowColor
ctx.shadowBlur = 20
ctx.fillStyle = config.baseColor
drawNodeShape(ctx, config.shape, x, y, config.radius)
ctx.fill()
ctx.shadowBlur = 0 // Reset
```

### Animated Edge

```typescript
// In canvas rendering
const edgeConfig = getEdgeVisualConfig('explains', 'active')

if (edgeConfig.animated) {
  // Draw animated arrow flow
  const dashOffset = (Date.now() % 2000) / 2000 * 20
  ctx.setLineDash([10, 10])
  ctx.lineDashOffset = -dashOffset
}

ctx.strokeStyle = edgeConfig.color
ctx.lineWidth = edgeConfig.thickness
ctx.stroke()
```

### Visited Node Checkmark

```typescript
// In canvas rendering
if (nodeState === 'visited') {
  // Draw checkmark overlay
  ctx.fillStyle = '#10B981'
  ctx.font = '8px Arial'
  ctx.fillText('✓', x + radius * 0.6, y - radius * 0.6)
}
```

## 🔑 Key Events to Emit

```typescript
// When user visits a node
emitSpaceEvent('node-visited', { nodeId, timestamp })

// When user traverses an edge
emitSpaceEvent('edge-traversed', { edgeId, sourceId, targetId, timestamp })

// When user saves constellation
emitSpaceEvent('constellation-saved', { constellationId, nodeCount })

// When user shares constellation
emitSpaceEvent('constellation-shared', { constellationId, shareUrl })

// During replay
emitSpaceEvent('replay-started', { constellationId })
emitSpaceEvent('replay-progress', { currentIndex, totalEvents })
emitSpaceEvent('replay-completed', { constellationId })
```

## 🚨 Error Handling

```typescript
try {
  const saved = saveConstellation(constellation)
  if (!saved) {
    toast.error('Failed to save constellation')
  }
} catch (error) {
  console.error('Constellation save error:', error)
  toast.error('Storage quota exceeded')
}

// Check localStorage availability
if (typeof localStorage === 'undefined') {
  console.warn('localStorage not available, constellations will not persist')
}

// Validate constellation before encoding
import { isValidConstellation } from '@/lib/space/graph/constellationEngine'

if (!isValidConstellation(data)) {
  throw new Error('Invalid constellation data')
}
```

## 📱 Responsive Considerations

```typescript
// Detect device type
const isMobile = window.innerWidth < 768
const isTablet = window.innerWidth >= 768 && window.innerWidth < 1280

// Adjust panel behavior
const panelMode = isMobile ? 'overlay' : isTablet ? 'collapsible' : 'side-by-side'

// Touch target size
const minTouchSize = 44 // pixels
const nodeRadius = Math.max(minTouchSize / 2, calculateNodeRadius(...))
```

## ⚡ Performance Optimization

```typescript
// Viewport culling
const visibleNodes = nodes.filter(node => isNodeVisible(node, viewport))

// Only render visible nodes and their edges
visibleNodes.forEach(node => renderNode(node))

// Debounce heavy operations
import { debounce } from 'lodash-es'

const debouncedRecalculate = debounce(() => {
  recalculateLayout()
}, 150)

// Use requestAnimationFrame for smooth animations
let animationFrameId: number

function animate() {
  renderGraph()
  animationFrameId = requestAnimationFrame(animate)
}

// Cleanup
onUnmount(() => cancelAnimationFrame(animationFrameId))
```

## 🧪 Testing Utilities

```typescript
// Generate mock constellation for testing
export function createMockConstellation(): Constellation {
  return {
    id: 'test-constellation-1',
    name: 'Test Journey',
    session: {
      sessionId: 'test-session-1',
      startedAt: Date.now() - 60000,
      events: [],
      nodes: ['node-1', 'node-2', 'node-3'],
      edges: ['edge-1-2', 'edge-2-3'],
      metadata: {
        duration: 60,
        uniqueNodes: 3,
        totalNodeVisits: 3,
        edgesTraversed: 2,
        deepestDepth: 3,
        dominantCategory: 'concept',
        explorationScore: 25,
      },
    },
    createdAt: Date.now(),
  }
}
```

## 📚 Further Reading

- [MISSION-3-DISCOVERY-GRAPH-SPEC.md](../../../MISSION-3-DISCOVERY-GRAPH-SPEC.md) - Full specification
- [recorder/](../recorder/) - Session recording system
- [visualConfig.ts](./visualConfig.ts) - Visual styling guide

## 🤝 Contributing

When adding new features:

1. Update type definitions in `constellation.types.ts`
2. Add core logic to `constellationEngine.ts`
3. Update visual configs in `visualConfig.ts` if needed
4. Update this README with usage examples
5. Add tests for new functionality

## 📝 License

Part of the Space Discovery Platform project.
