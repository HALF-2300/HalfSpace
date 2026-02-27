/**
 * Visual Configuration for Discovery Graph UI
 * Centralized styling, colors, and visual rules
 * Part of MISSION-3: Discovery Graph UI
 */

import type {
  NodeCategory,
  NodeState,
  EdgeRelation,
  EdgeState,
  NodeVisualConfig,
  EdgeVisualConfig,
  NodeDifficulty,
} from './constellation.types'

// ============================================================================
// COLOR PALETTE
// ============================================================================

export const GRAPH_COLORS = {
  // Background
  background: '#0a0118',
  backgroundOverlay: 'rgba(10, 1, 24, 0.95)',

  // Node categories
  concept: '#8B5CF6',
  mission: '#22D3EE',
  telescope: '#F59E0B',
  fact: '#10B981',
  term: '#E11D48',
  realm: '#6366F1',

  // Node glow (lighter versions)
  conceptGlow: '#A78BFA',
  missionGlow: '#67E8F9',
  telescopeGlow: '#FCD34D',
  factGlow: '#6EE7B7',
  termGlow: '#FB7185',
  realmGlow: '#818CF8',

  // Edges
  edgeDefault: 'rgba(255, 255, 255, 0.18)',
  edgeHover: 'rgba(255, 255, 255, 0.6)',
  edgeActive: 'rgba(255, 255, 255, 0.8)',
  edgeDimmed: 'rgba(255, 255, 255, 0.08)',

  // Edge types
  edgeExplains: 'rgba(167, 139, 250, 0.4)', // Purple
  edgeDependsOn: 'rgba(103, 232, 249, 0.4)', // Cyan
  edgeExampleOf: 'rgba(252, 211, 77, 0.35)', // Amber
  edgeObservedBy: 'rgba(110, 231, 183, 0.4)', // Green
  edgeConnected: 'rgba(255, 255, 255, 0.18)', // White dim

  // UI elements
  panelBackground: 'rgba(0, 0, 0, 0.7)',
  panelBorder: 'rgba(139, 92, 246, 0.3)',
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textDimmed: 'rgba(255, 255, 255, 0.4)',

  // States
  selected: 'rgba(255, 255, 255, 0.9)',
  visited: 'rgba(255, 255, 255, 0.5)',
  locked: '#666666',
  dimmed: 'rgba(255, 255, 255, 0.25)',
} as const

// ============================================================================
// NODE VISUAL CONFIGURATION
// ============================================================================

export const NODE_BASE_RADIUS = 12
export const NODE_DIFFICULTY_BONUS = {
  beginner: 0,
  intermediate: 2,
  advanced: 4,
} as const

export const NODE_CONNECTION_BONUS_MULTIPLIER = 0.5
export const NODE_MAX_CONNECTION_BONUS = 6

export function calculateNodeRadius(
  difficulty: NodeDifficulty,
  connectionCount: number
): number {
  const difficultyBonus = NODE_DIFFICULTY_BONUS[difficulty]
  const connectionBonus = Math.min(
    NODE_MAX_CONNECTION_BONUS,
    connectionCount * NODE_CONNECTION_BONUS_MULTIPLIER
  )
  return NODE_BASE_RADIUS + difficultyBonus + connectionBonus
}

// ============================================================================
// NODE CATEGORY CONFIGS
// ============================================================================

export type NodeShape = 'circle' | 'square' | 'hexagon' | 'diamond' | 'triangle' | 'star'

export interface CategoryConfig {
  shape: NodeShape
  icon: string
  baseColor: string
  glowColor: string
}

export const CATEGORY_CONFIGS: Record<NodeCategory, CategoryConfig> = {
  concept: {
    shape: 'circle',
    icon: '🔭',
    baseColor: GRAPH_COLORS.concept,
    glowColor: GRAPH_COLORS.conceptGlow,
  },
  mission: {
    shape: 'square',
    icon: '🚀',
    baseColor: GRAPH_COLORS.mission,
    glowColor: GRAPH_COLORS.missionGlow,
  },
  telescope: {
    shape: 'hexagon',
    icon: '📡',
    baseColor: GRAPH_COLORS.telescope,
    glowColor: GRAPH_COLORS.telescopeGlow,
  },
  fact: {
    shape: 'diamond',
    icon: '✨',
    baseColor: GRAPH_COLORS.fact,
    glowColor: GRAPH_COLORS.factGlow,
  },
  term: {
    shape: 'triangle',
    icon: '📖',
    baseColor: GRAPH_COLORS.term,
    glowColor: GRAPH_COLORS.termGlow,
  },
  realm: {
    shape: 'star',
    icon: '🌌',
    baseColor: GRAPH_COLORS.realm,
    glowColor: GRAPH_COLORS.realmGlow,
  },
}

// ============================================================================
// NODE STATE CONFIGS
// ============================================================================

export interface NodeStateStyle {
  fillOpacity: number
  strokeWidth: number
  strokeOpacity: number
  glowRadius: number
  glowOpacity: number
  scale: number
  cursor: string
  showCheckmark?: boolean
  animated?: boolean
}

export const NODE_STATE_STYLES: Record<NodeState, NodeStateStyle> = {
  default: {
    fillOpacity: 0.8,
    strokeWidth: 2,
    strokeOpacity: 0.2,
    glowRadius: 0,
    glowOpacity: 0,
    scale: 1.0,
    cursor: 'pointer',
  },
  hover: {
    fillOpacity: 1.0,
    strokeWidth: 2,
    strokeOpacity: 0.4,
    glowRadius: 12,
    glowOpacity: 0.6,
    scale: 1.05,
    cursor: 'pointer',
  },
  selected: {
    fillOpacity: 1.0,
    strokeWidth: 3,
    strokeOpacity: 0.8,
    glowRadius: 20,
    glowOpacity: 0.8,
    scale: 1.15,
    cursor: 'pointer',
    animated: true,
  },
  visited: {
    fillOpacity: 0.85,
    strokeWidth: 2,
    strokeOpacity: 0.3,
    glowRadius: 0,
    glowOpacity: 0,
    scale: 1.0,
    cursor: 'pointer',
    showCheckmark: true,
  },
  locked: {
    fillOpacity: 0.5,
    strokeWidth: 2,
    strokeOpacity: 0.2,
    glowRadius: 0,
    glowOpacity: 0,
    scale: 1.0,
    cursor: 'not-allowed',
  },
  dimmed: {
    fillOpacity: 0.25,
    strokeWidth: 1,
    strokeOpacity: 0.1,
    glowRadius: 0,
    glowOpacity: 0,
    scale: 1.0,
    cursor: 'default',
  },
}

// ============================================================================
// EDGE VISUAL CONFIGURATION
// ============================================================================

export interface EdgeRelationConfig {
  style: 'solid' | 'dashed' | 'dotted'
  color: string
  thickness: number
  dashPattern?: number[]
  animated?: boolean
  animationType?: 'arrow-flow' | 'pulse' | 'glow'
}

export const EDGE_RELATION_CONFIGS: Record<EdgeRelation, EdgeRelationConfig> = {
  explains: {
    style: 'solid',
    color: GRAPH_COLORS.edgeExplains,
    thickness: 2,
    animated: true,
    animationType: 'arrow-flow',
  },
  depends_on: {
    style: 'dashed',
    color: GRAPH_COLORS.edgeDependsOn,
    thickness: 2,
    dashPattern: [4, 2],
    animated: true,
    animationType: 'pulse',
  },
  example_of: {
    style: 'dotted',
    color: GRAPH_COLORS.edgeExampleOf,
    thickness: 1.5,
    dashPattern: [2, 3],
    animated: false,
  },
  observed_by: {
    style: 'solid',
    color: GRAPH_COLORS.edgeObservedBy,
    thickness: 2,
    animated: true,
    animationType: 'glow',
  },
  connected: {
    style: 'solid',
    color: GRAPH_COLORS.edgeConnected,
    thickness: 1,
    animated: false,
  },
}

export interface EdgeStateStyle {
  opacityMultiplier: number
  thicknessBonus: number
  showLabel: boolean
  highlighted: boolean
}

export const EDGE_STATE_STYLES: Record<EdgeState, EdgeStateStyle> = {
  default: {
    opacityMultiplier: 1.0,
    thicknessBonus: 0,
    showLabel: false,
    highlighted: false,
  },
  hover: {
    opacityMultiplier: 2.2,
    thicknessBonus: 1,
    showLabel: true,
    highlighted: true,
  },
  active: {
    opacityMultiplier: 2.5,
    thicknessBonus: 1,
    showLabel: false,
    highlighted: true,
  },
  traversed: {
    opacityMultiplier: 1.3,
    thicknessBonus: 0.5,
    showLabel: false,
    highlighted: false,
  },
  dimmed: {
    opacityMultiplier: 0.4,
    thicknessBonus: 0,
    showLabel: false,
    highlighted: false,
  },
}

// ============================================================================
// ANIMATION TIMINGS
// ============================================================================

export const ANIMATION_DURATIONS = {
  fast: 150,
  medium: 300,
  slow: 600,
  nodePulse: 400,
  nodeTransition: 300,
  panToNode: 600,
  zoomTransition: 400,
  edgeFlow: 2000,
  edgePulse: 1500,
  glowPulse: 2000,
} as const

export const ANIMATION_EASINGS = {
  default: 'ease-out',
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  linear: 'linear',
} as const

// ============================================================================
// LAYOUT CONFIGURATION
// ============================================================================

export const LAYOUT_CONFIG = {
  // Viewport
  minZoom: 0.5,
  maxZoom: 2.5,
  defaultZoom: 1.0,
  zoomStep: 0.1,

  // Culling
  cullingMargin: 150, // pixels
  enableCulling: true,

  // Clustering
  clusterDistanceThreshold: 80, // world coordinates
  maxNodesPerCluster: 20,
  clusterMinRadius: 20,
  clusterMaxRadius: 40,

  // Performance
  targetFPS: 60,
  performanceCheckInterval: 1000, // ms

  // Canvas
  canvasMinWidth: 480,
  canvasMinHeight: 400,

  // Touch
  minTouchTargetSize: 44, // pixels
} as const

// ============================================================================
// PANEL CONFIGURATION
// ============================================================================

export const PANEL_CONFIG = {
  widthDesktop: 360,
  widthTablet: 320,
  widthMobile: '100vw',
  topBarHeight: 64,
  transitionDuration: ANIMATION_DURATIONS.medium,
} as const

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const TYPOGRAPHY = {
  nodeLabelDefault: {
    fontSize: 12,
    fontWeight: 400,
    fontFamily: 'Inter, sans-serif',
    color: GRAPH_COLORS.textPrimary,
  },
  nodeLabelSelected: {
    fontSize: 14,
    fontWeight: 700,
    fontFamily: 'Inter, sans-serif',
    color: GRAPH_COLORS.textPrimary,
  },
  edgeLabel: {
    fontSize: 10,
    fontWeight: 400,
    fontFamily: 'Inter, sans-serif',
    color: GRAPH_COLORS.textSecondary,
  },
  nodeIcon: {
    fontSize: 14,
    color: '#FFFFFF',
  },
} as const

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getNodeVisualConfig(
  category: NodeCategory,
  state: NodeState,
  difficulty: NodeDifficulty,
  connectionCount: number
): NodeVisualConfig {
  const categoryConfig = CATEGORY_CONFIGS[category]
  const stateStyle = NODE_STATE_STYLES[state]
  const radius = calculateNodeRadius(difficulty, connectionCount)

  return {
    category,
    shape: categoryConfig.shape,
    icon: categoryConfig.icon,
    baseColor: categoryConfig.baseColor,
    glowColor: categoryConfig.glowColor,
    radius,
    state,
  }
}

export function getEdgeVisualConfig(
  relation: EdgeRelation,
  state: EdgeState
): EdgeVisualConfig {
  const relationConfig = EDGE_RELATION_CONFIGS[relation]
  const stateStyle = EDGE_STATE_STYLES[state]

  const opacity = parseFloat(relationConfig.color.match(/[\d.]+\)$/)?.[0] || '0.4') * stateStyle.opacityMultiplier

  return {
    relation,
    style: relationConfig.style,
    color: relationConfig.color.replace(/[\d.]+\)$/, `${Math.min(1, opacity)})`),
    thickness: relationConfig.thickness + stateStyle.thicknessBonus,
    opacity: Math.min(1, opacity),
    animated: Boolean(relationConfig.animated) && state !== 'dimmed',
    state,
  }
}

export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function desaturateColor(color: string, amount: number): string {
  // Simple desaturation (grayscale blend)
  // This is a simplified version - full HSL conversion would be better
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)
    const gray = Math.round(r * 0.299 + g * 0.587 + b * 0.114)
    const newR = Math.round(r + (gray - r) * amount)
    const newG = Math.round(g + (gray - g) * amount)
    const newB = Math.round(b + (gray - b) * amount)
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
  }
  return color
}

// ============================================================================
// SHAPE DRAWING HELPERS (for Canvas rendering)
// ============================================================================

export function drawNodeShape(
  ctx: CanvasRenderingContext2D,
  shape: NodeShape,
  x: number,
  y: number,
  radius: number
): void {
  ctx.beginPath()

  switch (shape) {
    case 'circle':
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      break

    case 'square':
      const halfSize = radius * 0.85
      ctx.rect(x - halfSize, y - halfSize, halfSize * 2, halfSize * 2)
      break

    case 'hexagon':
      drawPolygon(ctx, x, y, radius, 6)
      break

    case 'diamond':
      ctx.moveTo(x, y - radius)
      ctx.lineTo(x + radius, y)
      ctx.lineTo(x, y + radius)
      ctx.lineTo(x - radius, y)
      ctx.closePath()
      break

    case 'triangle':
      drawPolygon(ctx, x, y, radius, 3)
      break

    case 'star':
      drawStar(ctx, x, y, radius, 5, 0.5)
      break
  }
}

function drawPolygon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  sides: number
): void {
  const angle = (Math.PI * 2) / sides
  ctx.moveTo(x + radius * Math.cos(-Math.PI / 2), y + radius * Math.sin(-Math.PI / 2))
  for (let i = 1; i <= sides; i++) {
    ctx.lineTo(
      x + radius * Math.cos(angle * i - Math.PI / 2),
      y + radius * Math.sin(angle * i - Math.PI / 2)
    )
  }
  ctx.closePath()
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  points: number,
  innerRadiusRatio: number
): void {
  const outerRadius = radius
  const innerRadius = radius * innerRadiusRatio
  const angle = Math.PI / points

  ctx.moveTo(x, y - outerRadius)

  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerRadius : innerRadius
    const a = angle * i - Math.PI / 2
    ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a))
  }

  ctx.closePath()
}

// ============================================================================
// EXPORT ALL
// ============================================================================

export default {
  GRAPH_COLORS,
  CATEGORY_CONFIGS,
  NODE_STATE_STYLES,
  EDGE_RELATION_CONFIGS,
  EDGE_STATE_STYLES,
  ANIMATION_DURATIONS,
  ANIMATION_EASINGS,
  LAYOUT_CONFIG,
  PANEL_CONFIG,
  TYPOGRAPHY,
}
