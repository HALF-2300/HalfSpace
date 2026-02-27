/**
 * Type definitions for Constellation Collections system
 * Part of MISSION-3: Discovery Graph UI
 */

import type { RecordedSpaceEvent } from '../recorder/recorder'

// ============================================================================
// GRAPH VISUAL TYPES
// ============================================================================

export type NodeCategory = 'concept' | 'mission' | 'telescope' | 'fact' | 'term' | 'realm'

export type NodeDifficulty = 'beginner' | 'intermediate' | 'advanced'

export type NodeState = 'default' | 'hover' | 'selected' | 'visited' | 'locked' | 'dimmed'

export type EdgeRelation = 'explains' | 'depends_on' | 'example_of' | 'observed_by' | 'connected'

export type EdgeState = 'default' | 'hover' | 'active' | 'traversed' | 'dimmed'

export interface NodeVisualConfig {
  category: NodeCategory
  shape: 'circle' | 'square' | 'hexagon' | 'diamond' | 'triangle' | 'star'
  icon: string
  baseColor: string
  glowColor: string
  radius: number
  state: NodeState
}

export interface EdgeVisualConfig {
  relation: EdgeRelation
  style: 'solid' | 'dashed' | 'dotted'
  color: string
  thickness: number
  opacity: number
  animated: boolean
  state: EdgeState
}

// ============================================================================
// GRAPH NODE & EDGE TYPES
// ============================================================================

export interface GraphNode {
  id: string
  category: NodeCategory
  title: string
  summary?: string
  tags: string[]
  difficulty: NodeDifficulty
  link?: string
  connections: string[] // IDs of connected nodes
  metadata?: Record<string, any>
}

export interface GraphEdge {
  id: string
  source: string // Node ID
  target: string // Node ID
  relation: EdgeRelation
  bidirectional?: boolean
}

export interface LayoutNode extends GraphNode {
  x: number
  y: number
  vx: number // Velocity x (for force simulation)
  vy: number // Velocity y
}

// ============================================================================
// CONSTELLATION SESSION TYPES
// ============================================================================

export interface GraphSessionMetadata {
  duration: number // Seconds
  uniqueNodes: number
  totalNodeVisits: number
  edgesTraversed: number
  deepestDepth: number // Max distance from start node
  dominantCategory: NodeCategory
  explorationScore: number // 0-100, based on breadth vs depth
}

export interface GraphSession {
  sessionId: string
  startedAt: number // Unix timestamp ms
  endedAt?: number
  events: RecordedSpaceEvent[]
  nodes: string[] // Visited node IDs (ordered)
  edges: string[] // Traversed edge IDs (ordered)
  metadata: GraphSessionMetadata
}

export interface Constellation {
  id: string
  name: string
  description?: string
  session: GraphSession
  createdAt: number
  updatedAt?: number
  thumbnailData?: string // Base64 encoded mini-preview
  isPublic?: boolean
  shareCount?: number
  viewCount?: number
}

// ============================================================================
// CONSTELLATION ENCODING (for share links)
// ============================================================================

export interface ConstellationCompact {
  n: string[] // Node IDs
  e: string[] // Edge IDs
  t: number // Timestamp
  m: string // Name
  d?: string // Description
}

export interface ConstellationShareData {
  constellation: Constellation
  url: string
  shortUrl?: string
  qrCodeDataUrl?: string
}

// ============================================================================
// REPLAY TYPES
// ============================================================================

export type ReplaySpeed = 0.5 | 1 | 2 | 5

export type ReplayState = 'idle' | 'playing' | 'paused' | 'completed'

export interface ReplayControls {
  play: () => void
  pause: () => void
  stop: () => void
  seek: (index: number) => void
  setSpeed: (speed: ReplaySpeed) => void
  skipForward: (seconds: number) => void
  skipBackward: (seconds: number) => void
}

export interface ReplayProgress {
  currentIndex: number
  totalEvents: number
  currentTime: number // Seconds elapsed
  totalTime: number // Total duration
  currentNode?: GraphNode
  state: ReplayState
}

// ============================================================================
// GRAPH INTERACTION TYPES
// ============================================================================

export interface GraphViewport {
  offsetX: number
  offsetY: number
  scale: number
  width: number
  height: number
}

export interface GraphInteractionEvent {
  type: 'node-click' | 'node-hover' | 'edge-click' | 'edge-hover' | 'pan' | 'zoom' | 'search'
  target?: GraphNode | GraphEdge
  position?: { x: number; y: number }
  viewport?: GraphViewport
  timestamp: number
}

export interface GraphSelectionState {
  selectedNode?: GraphNode
  hoveredNode?: GraphNode
  hoveredEdge?: GraphEdge
  visitedNodes: Set<string>
  traversedEdges: Set<string>
}

// ============================================================================
// PERFORMANCE & CLUSTERING TYPES
// ============================================================================

export type RenderMode = 'canvas' | 'webgl' | 'list'

export type PerformanceTier = 1 | 2 | 3 | 4

export interface PerformanceConfig {
  tier: PerformanceTier
  renderMode: RenderMode
  maxNodes: number
  enableAnimations: boolean
  enableShadows: boolean
  enableGlow: boolean
  enableCulling: boolean
  enableClustering: boolean
  targetFPS: number
}

export interface NodeCluster {
  id: string
  nodes: GraphNode[]
  center: { x: number; y: number }
  radius: number
  label: string
  color: string
  expanded: boolean
}

// ============================================================================
// GRAPH FILTER & SEARCH TYPES
// ============================================================================

export interface GraphFilters {
  categories: NodeCategory[]
  difficulties: NodeDifficulty[]
  realms?: string[] // For halfspace integration
  visited?: boolean
  searchQuery?: string
}

export interface SearchResult {
  node: GraphNode
  score: number // Relevance 0-1
  matchedFields: string[] // 'title' | 'tags' | 'summary'
}

// ============================================================================
// JOURNEY PANEL TYPES
// ============================================================================

export interface JourneyBreadcrumb {
  nodeId: string
  title: string
  timestamp: number
  edgeRelation?: EdgeRelation
}

export interface JourneyStats {
  duration: string // Formatted "5m 23s"
  nodesVisited: number
  edgesTraversed: number
  currentDepth: number
  explorationScore: number
}

// ============================================================================
// KEYBOARD NAVIGATION TYPES
// ============================================================================

export type GraphKeyboardCommand =
  | 'select-node'
  | 'navigate-up'
  | 'navigate-down'
  | 'navigate-left'
  | 'navigate-right'
  | 'zoom-in'
  | 'zoom-out'
  | 'reset-view'
  | 'center-node'
  | 'toggle-search'
  | 'save-constellation'
  | 'deselect'
  | 'next-node'
  | 'previous-node'

export interface KeyboardBinding {
  key: string
  modifiers?: ('ctrl' | 'shift' | 'alt' | 'meta')[]
  command: GraphKeyboardCommand
  description: string
}

// ============================================================================
// COMPONENT PROPS TYPES
// ============================================================================

export interface GraphCanvasProps {
  nodes: GraphNode[]
  edges: GraphEdge[]
  selection: GraphSelectionState
  viewport: GraphViewport
  filters?: GraphFilters
  performanceConfig?: PerformanceConfig
  onNodeClick?: (node: GraphNode) => void
  onNodeHover?: (node: GraphNode | null) => void
  onEdgeClick?: (edge: GraphEdge) => void
  onViewportChange?: (viewport: GraphViewport) => void
  onSessionEvent?: (event: RecordedSpaceEvent) => void
}

export interface SidePanelProps {
  activeTab: 'detail' | 'journey' | 'share'
  selectedNode?: GraphNode
  relatedNodes: GraphNode[]
  journey: JourneyBreadcrumb[]
  stats: JourneyStats
  constellation?: Constellation
  onTabChange: (tab: 'detail' | 'journey' | 'share') => void
  onNodeClick: (node: GraphNode) => void
  onSaveConstellation: () => void
  onShareConstellation: () => void
}

export interface ConstellationLibraryProps {
  constellations: Constellation[]
  onReplay: (constellation: Constellation) => void
  onShare: (constellation: Constellation) => void
  onRename: (id: string, newName: string) => void
  onDelete: (id: string) => void
  sortBy?: 'recent' | 'popular' | 'duration' | 'nodes'
}

export interface ReplayControlsProps {
  progress: ReplayProgress
  controls: ReplayControls
  speed: ReplaySpeed
  onSpeedChange: (speed: ReplaySpeed) => void
  onSeek: (index: number) => void
  onExit: () => void
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface Point {
  x: number
  y: number
}

export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

export interface BoundingBox {
  minX: number
  minY: number
  maxX: number
  maxY: number
}

// ============================================================================
// STORAGE TYPES
// ============================================================================

export interface ConstellationStorage {
  version: string
  constellations: Constellation[]
  maxConstellations: number
  lastUpdated: number
}

// ============================================================================
// API TYPES (Future backend integration)
// ============================================================================

export interface ConstellationApiCreate {
  name: string
  description?: string
  session: GraphSession
  isPublic?: boolean
}

export interface ConstellationApiResponse {
  success: boolean
  constellation?: Constellation
  error?: string
  shortUrl?: string
}

// ============================================================================
// EXPORT ALL
// ============================================================================

export type {
  // Re-export for convenience
  RecordedSpaceEvent,
}
