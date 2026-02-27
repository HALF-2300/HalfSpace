/**
 * Graph Personalizer
 * Makes the constellation graph feel unique to each user
 * 
 * Personalizes:
 * 1. Node layout clustering (pulls toward user interests)
 * 2. Constellation lines (based on traversal order)
 * 3. Suggested nodes (personalized recommendations)
 * 4. Visual weights and emphasis
 */

import type {
  GraphNode,
  GraphEdge,
  LayoutNode,
  NodeCategory,
  NodeCluster
} from './constellation.types'

import {
  createPersonalizationContext,
  getCosmicSignature,
  getPreferenceVector,
  type PersonalizationContext,
  type SeedMode
} from '../../personalization'

import { mulberry32 } from '../../seed'

// ============================================================================
// TYPES
// ============================================================================

export interface PersonalizedGraphLayout {
  nodes: LayoutNode[]
  clusters: NodeCluster[]
  suggestedNodes: string[]
  emphasisWeights: Map<string, number> // nodeId -> weight (0-1)
}

export interface ClusterPreferences {
  missions: number
  phenomena: number
  objects: number
  concepts: number
}

export interface LayoutForces {
  gravity: number // Pull to center
  repulsion: number // Push away from others
  categoryAttraction: number // Pull toward same category
  preferenceWeight: number // Weight of user preferences
}

// ============================================================================
// PERSONALIZED LAYOUT ENGINE
// ============================================================================

/**
 * Generate personalized graph layout
 */
export function generatePersonalizedLayout(
  nodes: GraphNode[],
  edges: GraphEdge[],
  mode: SeedMode = 'cosmic',
  options?: {
    width?: number
    height?: number
    shareCode?: string
  }
): PersonalizedGraphLayout {
  const ctx = createPersonalizationContext(mode, { shareCode: options?.shareCode })
  const width = options?.width || 1200
  const height = options?.height || 800
  
  // Calculate emphasis weights based on preferences
  const emphasisWeights = calculateEmphasisWeights(nodes, ctx)
  
  // Generate initial positions
  const layoutNodes = initializeNodePositions(nodes, width, height, ctx)
  
  // Apply force-directed layout with personalized forces
  const forces = calculatePersonalizedForces(ctx)
  applyForceLayout(layoutNodes, edges, forces, emphasisWeights, 100) // 100 iterations
  
  // Create clusters based on preferences
  const clusters = generateClusters(layoutNodes, ctx)
  
  // Generate suggested nodes
  const suggestedNodes = generateSuggestedNodes(nodes, ctx)
  
  return {
    nodes: layoutNodes,
    clusters,
    suggestedNodes,
    emphasisWeights
  }
}

/**
 * Calculate emphasis weights for nodes based on user preferences
 */
function calculateEmphasisWeights(
  nodes: GraphNode[],
  ctx: PersonalizationContext
): Map<string, number> {
  const weights = new Map<string, number>()
  const prefs = ctx.preferences
  
  for (const node of nodes) {
    let weight = 0.5 // Base weight
    
    // Category weight
    if (node.category) {
      const categoryWeight = prefs.categoryWeights[node.category] || 0
      weight += categoryWeight * 0.3
    }
    
    // Difficulty weight (prefer user's preferred difficulty)
    if (node.difficulty === prefs.difficultyPreference || prefs.difficultyPreference === 'mixed') {
      weight += 0.2
    }
    
    // Clamp to 0-1
    weight = Math.max(0, Math.min(1, weight))
    
    weights.set(node.id, weight)
  }
  
  return weights
}

/**
 * Initialize node positions with personalized clustering
 */
function initializeNodePositions(
  nodes: GraphNode[],
  width: number,
  height: number,
  ctx: PersonalizationContext
): LayoutNode[] {
  const seed = ctx.signature.cosmicSeed
  const rand = mulberry32(seed)
  const prefs = ctx.preferences
  
  // Group nodes by category
  const byCategory = new Map<NodeCategory, GraphNode[]>()
  for (const node of nodes) {
    const cat = node.category
    if (!byCategory.has(cat)) byCategory.set(cat, [])
    byCategory.get(cat)!.push(node)
  }
  
  // Calculate category cluster centers based on preferences
  const clusterCenters = calculateClusterCenters(
    Array.from(byCategory.keys()),
    width,
    height,
    prefs,
    seed
  )
  
  // Place nodes near their category cluster center with random jitter
  const layoutNodes: LayoutNode[] = []
  
  for (const [category, categoryNodes] of byCategory.entries()) {
    const center = clusterCenters.get(category) || { x: width / 2, y: height / 2 }
    const jitterRadius = 150
    
    for (const node of categoryNodes) {
      const angle = rand() * Math.PI * 2
      const distance = rand() * jitterRadius
      
      layoutNodes.push({
        ...node,
        x: center.x + Math.cos(angle) * distance,
        y: center.y + Math.sin(angle) * distance,
        vx: 0,
        vy: 0
      })
    }
  }
  
  return layoutNodes
}

/**
 * Calculate cluster centers based on user preferences
 * Preferred categories are placed more centrally
 */
function calculateClusterCenters(
  categories: NodeCategory[],
  width: number,
  height: number,
  prefs: any,
  seed: number
): Map<NodeCategory, { x: number; y: number }> {
  const centers = new Map<NodeCategory, { x: number; y: number }>()
  const rand = mulberry32(seed + 1)
  
  const centerX = width / 2
  const centerY = height / 2
  const radius = Math.min(width, height) * 0.35
  
  categories.forEach((category, index) => {
    // Get preference weight for this category
    const weight = prefs.categoryWeights[category] || 0
    
    // Preferred categories stay closer to center
    const distanceFromCenter = radius * (1 - weight * 0.5)
    
    // Distribute around circle
    const angle = (index / categories.length) * Math.PI * 2 + rand() * 0.5
    
    centers.set(category, {
      x: centerX + Math.cos(angle) * distanceFromCenter,
      y: centerY + Math.sin(angle) * distanceFromCenter
    })
  })
  
  return centers
}

/**
 * Calculate personalized forces for layout
 */
function calculatePersonalizedForces(ctx: PersonalizationContext): LayoutForces {
  const prefs = ctx.preferences
  
  // Exploration style affects forces
  const depthPref = prefs.depthPreference
  
  return {
    gravity: 0.1,
    repulsion: 50,
    categoryAttraction: 0.3 + depthPref * 0.2, // Depth explorers cluster more
    preferenceWeight: 0.4
  }
}

/**
 * Apply force-directed layout with personalized forces
 */
function applyForceLayout(
  nodes: LayoutNode[],
  edges: GraphEdge[],
  forces: LayoutForces,
  emphasisWeights: Map<string, number>,
  iterations: number
): void {
  const { gravity, repulsion, categoryAttraction, preferenceWeight } = forces
  
  for (let iter = 0; iter < iterations; iter++) {
    // Reset velocities
    for (const node of nodes) {
      node.vx = 0
      node.vy = 0
    }
    
    // Repulsion between all nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i]
        const b = nodes[j]
        
        const dx = b.x - a.x
        const dy = b.y - a.y
        const dist = Math.sqrt(dx * dx + dy * dy) || 1
        
        const force = (repulsion * repulsion) / (dist * dist)
        const fx = (dx / dist) * force
        const fy = (dy / dist) * force
        
        a.vx -= fx
        a.vy -= fy
        b.vx += fx
        b.vy += fy
      }
    }
    
    // Attraction along edges
    for (const edge of edges) {
      const source = nodes.find(n => n.id === edge.source)
      const target = nodes.find(n => n.id === edge.target)
      
      if (!source || !target) continue
      
      const dx = target.x - source.x
      const dy = target.y - source.y
      const dist = Math.sqrt(dx * dx + dy * dy) || 1
      
      const force = dist * 0.01
      const fx = (dx / dist) * force
      const fy = (dy / dist) * force
      
      source.vx += fx
      source.vy += fy
      target.vx -= fx
      target.vy -= fy
    }
    
    // Category attraction (nodes of same category attract)
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i]
        const b = nodes[j]
        
        if (a.category === b.category) {
          const dx = b.x - a.x
          const dy = b.y - a.y
          const dist = Math.sqrt(dx * dx + dy * dy) || 1
          
          const force = categoryAttraction
          const fx = (dx / dist) * force
          const fy = (dy / dist) * force
          
          a.vx += fx
          a.vy += fy
          b.vx -= fx
          b.vy -= fy
        }
      }
    }
    
    // Gravity toward center (weighted by emphasis)
    for (const node of nodes) {
      const weight = emphasisWeights.get(node.id) || 0.5
      const gravityForce = gravity * (2 - weight) // Lower emphasis = stronger gravity
      
      node.vx -= node.x * gravityForce
      node.vy -= node.y * gravityForce
    }
    
    // Apply velocities with damping
    const damping = 0.5
    for (const node of nodes) {
      node.x += node.vx * damping
      node.y += node.vy * damping
    }
  }
}

/**
 * Generate clusters for visualization
 */
function generateClusters(
  nodes: LayoutNode[],
  ctx: PersonalizationContext
): NodeCluster[] {
  // Group by category
  const byCategory = new Map<NodeCategory, LayoutNode[]>()
  for (const node of nodes) {
    if (!byCategory.has(node.category)) byCategory.set(node.category, [])
    byCategory.get(node.category)!.push(node)
  }
  
  const clusters: NodeCluster[] = []
  const prefs = ctx.preferences
  
  for (const [category, categoryNodes] of byCategory.entries()) {
    // Calculate cluster center
    const centerX = categoryNodes.reduce((sum, n) => sum + n.x, 0) / categoryNodes.length
    const centerY = categoryNodes.reduce((sum, n) => sum + n.y, 0) / categoryNodes.length
    
    // Calculate radius (max distance from center)
    const radius = Math.max(
      ...categoryNodes.map(n => 
        Math.sqrt((n.x - centerX) ** 2 + (n.y - centerY) ** 2)
      )
    ) + 50 // Padding
    
    // Determine if cluster should be expanded (based on preference)
    const categoryWeight = prefs.categoryWeights[category] || 0
    const expanded = categoryWeight > 0.3
    
    clusters.push({
      id: `cluster-${category}`,
      nodes: categoryNodes,
      center: { x: centerX, y: centerY },
      radius,
      label: getCategoryLabel(category),
      color: getCategoryColor(category),
      expanded
    })
  }
  
  return clusters
}

/**
 * Generate suggested nodes based on preferences
 */
function generateSuggestedNodes(
  nodes: GraphNode[],
  ctx: PersonalizationContext
): string[] {
  const prefs = ctx.preferences
  
  // Score all nodes
  const scored = nodes.map(node => {
    let score = 0
    
    // Category preference
    if (node.category) {
      score += (prefs.categoryWeights[node.category] || 0) * 10
    }
    
    // Difficulty match
    if (node.difficulty === prefs.difficultyPreference) {
      score += 5
    }
    
    // Random factor for variety
    const rand = mulberry32(ctx.signature.cosmicSeed + hashString(node.id))
    score += rand() * 3
    
    return { node, score }
  })
  
  // Sort and take top 5
  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, 5).map(s => s.node.id)
}

/**
 * Generate constellation lines based on traversal order
 * This creates "your constellation" - unique path through the graph
 */
export function generateConstellationLines(
  visitedNodes: string[],
  allNodes: LayoutNode[]
): Array<{ from: string; to: string; order: number }> {
  const lines: Array<{ from: string; to: string; order: number }> = []
  
  for (let i = 0; i < visitedNodes.length - 1; i++) {
    const from = visitedNodes[i]
    const to = visitedNodes[i + 1]
    
    // Only create line if both nodes exist in layout
    if (allNodes.find(n => n.id === from) && allNodes.find(n => n.id === to)) {
      lines.push({ from, to, order: i })
    }
  }
  
  return lines
}

/**
 * Calculate personalized node size based on importance
 */
export function getPersonalizedNodeSize(
  nodeId: string,
  emphasisWeights: Map<string, number>,
  baseSize: number = 10
): number {
  const weight = emphasisWeights.get(nodeId) || 0.5
  return baseSize * (0.7 + weight * 0.6) // Range: 0.7x to 1.3x base size
}

/**
 * Calculate personalized node opacity
 */
export function getPersonalizedNodeOpacity(
  nodeId: string,
  emphasisWeights: Map<string, number>
): number {
  const weight = emphasisWeights.get(nodeId) || 0.5
  return 0.5 + weight * 0.5 // Range: 0.5 to 1.0
}

// ============================================================================
// UTILITIES
// ============================================================================

function getCategoryLabel(category: NodeCategory): string {
  const labels: Record<NodeCategory, string> = {
    concept: 'Concepts',
    mission: 'Missions',
    telescope: 'Telescopes',
    fact: 'Facts',
    term: 'Terms',
    realm: 'Realms'
  }
  return labels[category] || category
}

function getCategoryColor(category: NodeCategory): string {
  const colors: Record<NodeCategory, string> = {
    concept: '#8B5CF6',
    mission: '#3B82F6',
    telescope: '#10B981',
    fact: '#F59E0B',
    term: '#EC4899',
    realm: '#6366F1'
  }
  return colors[category] || '#6B7280'
}

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return hash >>> 0
}

// ============================================================================
// EXPORT LAYOUT
// ============================================================================

/**
 * Export layout for sharing
 */
export function exportLayout(layout: PersonalizedGraphLayout): string {
  return JSON.stringify({
    version: '1.0',
    nodes: layout.nodes.map(n => ({ id: n.id, x: n.x, y: n.y })),
    suggested: layout.suggestedNodes
  })
}

/**
 * Import layout from share link
 */
export function importLayout(
  layoutStr: string,
  nodes: GraphNode[]
): LayoutNode[] | null {
  try {
    const data: { nodes?: Array<{ id: string; x: number; y: number }> } = JSON.parse(layoutStr)
    const positionMap = new Map<string, { x: number; y: number }>((data.nodes || []).map((n) => [n.id, { x: n.x, y: n.y }]))
    
    return nodes.map(node => {
      const pos = positionMap.get(node.id) || { x: 0, y: 0 }
      return {
        ...node,
        x: pos.x,
        y: pos.y,
        vx: 0,
        vy: 0
      }
    })
  } catch (error) {
    console.error('Failed to import layout:', error)
    return null
  }
}
