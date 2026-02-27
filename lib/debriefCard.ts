/**
 * Debrief Card System
 * Creates shareable artifacts from each exploration session
 * 
 * Every session produces:
 * 1. Constellation thumbnail (visual representation)
 * 2. 3 insights discovered (templated from node metadata)
 * 3. Next 2 jumps (graph-based recommendations)
 * 4. Optional "Daily Relic" for automatic saving
 */

import type {
  GraphNode,
  LayoutNode,
  NodeCategory
} from './space/graph/constellation.types'

import {
  createShareCode,
  type CosmicSignature,
  type PreferenceVector
} from './personalization'

import { safeGetJSON, safeSetJSON } from './storage'
import { pickN } from './seed'

// ============================================================================
// TYPES
// ============================================================================

export interface DebriefCard {
  id: string
  createdAt: string
  
  // Session info
  duration: number // Seconds
  nodesVisited: number
  pathTaken: string[] // Node IDs in order
  
  // Constellation visual
  constellationData: ConstellationThumbnail
  
  // Insights (3 key learnings)
  insights: Insight[]
  
  // Next jumps (2 recommendations)
  nextJumps: NextJump[]
  
  // Share data
  shareCode: string
  shareUrl: string
  
  // User identity
  cosmicId: string
  
  // Optional daily relic
  isDailyRelic?: boolean
}

export interface ConstellationThumbnail {
  nodes: Array<{ x: number; y: number; category: NodeCategory }>
  lines: Array<{ from: { x: number; y: number }; to: { x: number; y: number } }>
  dominantColor: string
  style: 'sparse' | 'dense' | 'linear' | 'clustered'
}

export interface Insight {
  title: string
  description: string
  nodeId: string
  category: NodeCategory
  type: 'concept' | 'discovery' | 'connection' | 'mindBlow'
}

export interface NextJump {
  nodeId: string
  title: string
  reason: string
  category: NodeCategory
}

export interface DailyRelic {
  date: string // YYYY-MM-DD
  debriefCard: DebriefCard
  badge: string // Emoji badge for the day
  achievement?: string // Optional achievement unlocked
}

// ============================================================================
// STORAGE KEYS
// ============================================================================

const DEBRIEF_HISTORY_KEY = 'halfspace_debrief_history'
const DAILY_RELICS_KEY = 'halfspace_daily_relics'

// ============================================================================
// INSIGHT TEMPLATES
// ============================================================================

/**
 * Templates for generating insights based on node categories
 */
const INSIGHT_TEMPLATES: Record<NodeCategory, Array<{ title: string; description: string }>> = {
  concept: [
    { title: 'Core Understanding', description: 'You grasped a fundamental concept in {{topic}}' },
    { title: 'Conceptual Connection', description: 'You connected {{topic}} to your existing knowledge' },
    { title: 'Mental Model Built', description: 'You formed a new mental model around {{topic}}' }
  ],
  mission: [
    { title: 'Mission Objective', description: 'You understood the purpose of {{topic}}' },
    { title: 'Scientific Method', description: 'You learned how {{topic}} advances our knowledge' },
    { title: 'Engineering Marvel', description: 'You appreciated the technology behind {{topic}}' }
  ],
  telescope: [
    { title: 'Observational Tool', description: 'You discovered how {{topic}} helps us see the universe' },
    { title: 'Scientific Instrument', description: 'You learned what {{topic}} can detect' },
    { title: 'Discovery Machine', description: 'You explored what {{topic}} has revealed' }
  ],
  fact: [
    { title: 'Mind-Blowing Fact', description: 'You learned an amazing truth: {{topic}}' },
    { title: 'Surprising Detail', description: 'You discovered something unexpected about {{topic}}' },
    { title: 'Quick Knowledge', description: 'You added a fascinating fact to your collection' }
  ],
  term: [
    { title: 'Vocabulary Expanded', description: 'You learned the meaning of {{topic}}' },
    { title: 'Technical Term', description: 'You can now explain {{topic}} to others' },
    { title: 'Precise Language', description: 'You understand when to use the term {{topic}}' }
  ],
  realm: [
    { title: 'Domain Explored', description: 'You ventured into the realm of {{topic}}' },
    { title: 'Field Overview', description: 'You gained perspective on {{topic}}' },
    { title: 'Subject Mastery', description: 'You deepened your understanding of {{topic}}' }
  ]
}

// ============================================================================
// DEBRIEF CARD GENERATION
// ============================================================================

/**
 * Generate debrief card from session data
 */
export function generateDebriefCard(
  visitedNodes: string[],
  layoutNodes: LayoutNode[],
  allNodes: GraphNode[],
  duration: number,
  cosmicSignature: CosmicSignature,
  preferences: PreferenceVector
): DebriefCard {
  const id = generateId()
  const createdAt = new Date().toISOString()
  
  // Generate constellation thumbnail
  const constellationData = generateConstellationThumbnail(
    visitedNodes,
    layoutNodes
  )
  
  // Generate insights
  const insights = generateInsights(visitedNodes, allNodes, 3)
  
  // Generate next jumps
  const nextJumps = generateNextJumps(
    visitedNodes,
    allNodes,
    preferences,
    2
  )
  
  // Generate share code
  const shareCode = createShareCode(cosmicSignature.cosmicSeed ^ hashString(id))
  const shareUrl = `${getBaseUrl()}/share/debrief/${shareCode}`
  
  return {
    id,
    createdAt,
    duration,
    nodesVisited: visitedNodes.length,
    pathTaken: visitedNodes,
    constellationData,
    insights,
    nextJumps,
    shareCode,
    shareUrl,
    cosmicId: cosmicSignature.userId.slice(0, 8).toUpperCase()
  }
}

/**
 * Generate constellation thumbnail for visual representation
 */
function generateConstellationThumbnail(
  visitedNodes: string[],
  layoutNodes: LayoutNode[]
): ConstellationThumbnail {
  // Get visited node positions
  const visitedPositions = visitedNodes
    .map(id => layoutNodes.find(n => n.id === id))
    .filter(Boolean) as LayoutNode[]
  
  if (visitedPositions.length === 0) {
    return {
      nodes: [],
      lines: [],
      dominantColor: '#8B5CF6',
      style: 'sparse'
    }
  }
  
  // Normalize positions to 0-100 range for thumbnail
  const xs = visitedPositions.map(n => n.x)
  const ys = visitedPositions.map(n => n.y)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)
  
  const rangeX = maxX - minX || 1
  const rangeY = maxY - minY || 1
  
  const nodes = visitedPositions.map(n => ({
    x: ((n.x - minX) / rangeX) * 100,
    y: ((n.y - minY) / rangeY) * 100,
    category: n.category
  }))
  
  // Generate lines between consecutive visited nodes
  const lines = []
  for (let i = 0; i < nodes.length - 1; i++) {
    lines.push({
      from: { x: nodes[i].x, y: nodes[i].y },
      to: { x: nodes[i + 1].x, y: nodes[i + 1].y }
    })
  }
  
  // Determine style based on layout
  let style: 'sparse' | 'dense' | 'linear' | 'clustered' = 'sparse'
  if (nodes.length > 10) style = 'dense'
  else if (calculateLinearity(nodes) > 0.7) style = 'linear'
  else if (calculateClustering(nodes) > 0.6) style = 'clustered'
  
  // Determine dominant color from categories
  const dominantColor = getDominantColor(visitedPositions)
  
  return {
    nodes,
    lines,
    dominantColor,
    style
  }
}

/**
 * Generate insights from visited nodes
 */
function generateInsights(
  visitedNodes: string[],
  allNodes: GraphNode[],
  count: number
): Insight[] {
  const insights: Insight[] = []
  
  // Get actual node objects
  const visited = visitedNodes
    .map(id => allNodes.find(n => n.id === id))
    .filter(Boolean) as GraphNode[]
  
  if (visited.length === 0) return []
  
  // Strategy: pick diverse nodes (different categories)
  const byCategory = new Map<NodeCategory, GraphNode[]>()
  for (const node of visited) {
    if (!byCategory.has(node.category)) byCategory.set(node.category, [])
    byCategory.get(node.category)!.push(node)
  }
  
  // Pick one from each category (up to count)
  const categories = Array.from(byCategory.keys())
  const selectedCategories = categories.slice(0, count)
  
  for (const category of selectedCategories) {
    const nodes = byCategory.get(category)!
    const node = nodes[Math.floor(Math.random() * nodes.length)]
    
    // Get template for this category
    const templates = INSIGHT_TEMPLATES[category]
    const template = templates[Math.floor(Math.random() * templates.length)]
    
    // Determine insight type
    let type: Insight['type'] = 'concept'
    if (node.tags?.includes('discovery')) type = 'discovery'
    if (node.tags?.includes('connection')) type = 'connection'
    if (node.tags?.includes('mindBlow') || node.metadata?.isMindBlow) type = 'mindBlow'
    
    insights.push({
      title: template.title,
      description: template.description.replace('{{topic}}', node.title),
      nodeId: node.id,
      category: node.category,
      type
    })
  }
  
  // If we don't have enough, fill with random visited nodes
  while (insights.length < count && insights.length < visited.length) {
    const remaining = visited.filter(n => !insights.find(i => i.nodeId === n.id))
    if (remaining.length === 0) break
    
    const node = remaining[Math.floor(Math.random() * remaining.length)]
    const templates = INSIGHT_TEMPLATES[node.category]
    const template = templates[Math.floor(Math.random() * templates.length)]
    
    insights.push({
      title: template.title,
      description: template.description.replace('{{topic}}', node.title),
      nodeId: node.id,
      category: node.category,
      type: 'concept'
    })
  }
  
  return insights.slice(0, count)
}

/**
 * Generate next jump recommendations
 */
function generateNextJumps(
  visitedNodes: string[],
  allNodes: GraphNode[],
  preferences: PreferenceVector,
  count: number
): NextJump[] {
  // Get unvisited nodes
  const unvisited = allNodes.filter(n => !visitedNodes.includes(n.id))
  
  if (unvisited.length === 0) return []
  
  // Score nodes based on:
  // 1. Category preference
  // 2. Difficulty match
  // 3. Connected to visited nodes (if graph data available)
  
  const scored = unvisited.map(node => {
    let score = 0
    
    // Category preference
    const catWeight = preferences.categoryWeights[node.category] || 0
    score += catWeight * 10
    
    // Difficulty match
    if (node.difficulty === preferences.difficultyPreference) {
      score += 5
    }
    
    // Connection bonus (if node is connected to visited nodes)
    const hasConnection = node.connections?.some(connId => visitedNodes.includes(connId))
    if (hasConnection) {
      score += 8
    }
    
    // Random factor for variety
    score += Math.random() * 3
    
    return { node, score }
  })
  
  // Sort by score and take top N
  scored.sort((a, b) => b.score - a.score)
  
  return scored.slice(0, count).map(({ node }) => ({
    nodeId: node.id,
    title: node.title,
    reason: generateJumpReason(node, visitedNodes, preferences),
    category: node.category
  }))
}

/**
 * Generate reason for recommending a jump
 */
function generateJumpReason(
  node: GraphNode,
  visitedNodes: string[],
  preferences: PreferenceVector
): string {
  const reasons = []
  
  // Category interest
  const catWeight = preferences.categoryWeights[node.category] || 0
  if (catWeight > 0.3) {
    reasons.push(`Based on your interest in ${node.category}`)
  }
  
  // Connected to visited
  const hasConnection = node.connections?.some(connId => visitedNodes.includes(connId))
  if (hasConnection) {
    reasons.push('Builds on what you just explored')
  }
  
  // Difficulty match
  if (node.difficulty === preferences.difficultyPreference) {
    reasons.push('Matches your preferred difficulty level')
  }
  
  // Default
  if (reasons.length === 0) {
    reasons.push('Recommended for you')
  }
  
  return reasons[0]
}

// ============================================================================
// DAILY RELIC SYSTEM
// ============================================================================

/**
 * Save debrief card as today's daily relic
 */
export function saveDailyRelic(debriefCard: DebriefCard): DailyRelic {
  const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
  
  const relic: DailyRelic = {
    date: today,
    debriefCard: { ...debriefCard, isDailyRelic: true },
    badge: getDailyBadge(today),
    achievement: checkDailyAchievement(debriefCard)
  }
  
  // Load existing relics
  const relics = safeGetJSON<Record<string, DailyRelic>>(DAILY_RELICS_KEY, {})
  relics[today] = relic
  
  // Keep last 30 days only
  const dates = Object.keys(relics).sort().reverse()
  if (dates.length > 30) {
    const toDelete = dates.slice(30)
    toDelete.forEach(date => delete relics[date])
  }
  
  safeSetJSON(DAILY_RELICS_KEY, relics)
  
  return relic
}

/**
 * Get daily relic for a specific date
 */
export function getDailyRelic(date: string): DailyRelic | null {
  const relics = safeGetJSON<Record<string, DailyRelic>>(DAILY_RELICS_KEY, {})
  return relics[date] || null
}

/**
 * Get all daily relics
 */
export function getAllDailyRelics(): DailyRelic[] {
  const relics = safeGetJSON<Record<string, DailyRelic>>(DAILY_RELICS_KEY, {})
  return Object.values(relics).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

/**
 * Get daily badge (emoji) based on date
 */
function getDailyBadge(date: string): string {
  const badges = ['🌟', '⭐', '✨', '💫', '🌠', '🪐', '🌙', '☄️', '🔭', '🚀']
  const hash = hashString(date)
  return badges[hash % badges.length]
}

/**
 * Check if debrief card unlocks an achievement
 */
function checkDailyAchievement(debriefCard: DebriefCard): string | undefined {
  if (debriefCard.nodesVisited >= 20) return 'Explorer Marathon'
  if (debriefCard.duration >= 600) return 'Deep Dive'
  if (debriefCard.insights.some(i => i.type === 'mindBlow')) return 'Mind Blown'
  return undefined
}

// ============================================================================
// DEBRIEF HISTORY
// ============================================================================

/**
 * Save debrief card to history
 */
export function saveDebriefCard(card: DebriefCard): void {
  const history = safeGetJSON<DebriefCard[]>(DEBRIEF_HISTORY_KEY, [])
  history.unshift(card) // Add to front
  
  // Keep last 50
  if (history.length > 50) {
    history.pop()
  }
  
  safeSetJSON(DEBRIEF_HISTORY_KEY, history)
}

/**
 * Get debrief history
 */
export function getDebriefHistory(): DebriefCard[] {
  return safeGetJSON<DebriefCard[]>(DEBRIEF_HISTORY_KEY, [])
}

/**
 * Get debrief card by share code
 */
export function getDebriefByShareCode(shareCode: string): DebriefCard | null {
  const history = getDebriefHistory()
  return history.find(c => c.shareCode === shareCode) || null
}

// ============================================================================
// UTILITIES
// ============================================================================

function generateId(): string {
  return `debrief-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return 'https://halfspace.app' // Default
}

/**
 * Calculate linearity of constellation (0-1)
 * 1 = perfectly linear path
 */
function calculateLinearity(nodes: Array<{ x: number; y: number }>): number {
  if (nodes.length < 3) return 1
  
  // Calculate average angle change between consecutive segments
  let totalAngleChange = 0
  
  for (let i = 1; i < nodes.length - 1; i++) {
    const v1 = {
      x: nodes[i].x - nodes[i - 1].x,
      y: nodes[i].y - nodes[i - 1].y
    }
    const v2 = {
      x: nodes[i + 1].x - nodes[i].x,
      y: nodes[i + 1].y - nodes[i].y
    }
    
    const angle1 = Math.atan2(v1.y, v1.x)
    const angle2 = Math.atan2(v2.y, v2.x)
    let angleDiff = Math.abs(angle2 - angle1)
    
    // Normalize to 0-π
    if (angleDiff > Math.PI) angleDiff = 2 * Math.PI - angleDiff
    
    totalAngleChange += angleDiff
  }
  
  const avgAngleChange = totalAngleChange / (nodes.length - 2)
  
  // Low angle change = high linearity
  return 1 - (avgAngleChange / Math.PI)
}

/**
 * Calculate clustering (0-1)
 * 1 = highly clustered
 */
function calculateClustering(nodes: Array<{ x: number; y: number }>): number {
  if (nodes.length < 3) return 0
  
  // Calculate average distance from centroid
  const centroidX = nodes.reduce((sum, n) => sum + n.x, 0) / nodes.length
  const centroidY = nodes.reduce((sum, n) => sum + n.y, 0) / nodes.length
  
  const avgDistance = nodes.reduce((sum, n) => 
    sum + Math.sqrt((n.x - centroidX) ** 2 + (n.y - centroidY) ** 2), 0
  ) / nodes.length
  
  // Normalize (assume max distance is 50 in 0-100 range)
  return 1 - Math.min(1, avgDistance / 50)
}

/**
 * Get dominant color from node categories
 */
function getDominantColor(nodes: Array<{ category: NodeCategory }>): string {
  const colorMap: Record<NodeCategory, string> = {
    concept: '#8B5CF6',
    mission: '#3B82F6',
    telescope: '#10B981',
    fact: '#F59E0B',
    term: '#EC4899',
    realm: '#6366F1'
  }
  
  // Count categories
  const counts = new Map<NodeCategory, number>()
  for (const node of nodes) {
    counts.set(node.category, (counts.get(node.category) || 0) + 1)
  }
  
  // Find most common
  let maxCount = 0
  let dominant: NodeCategory = 'concept'
  
  for (const [cat, count] of counts.entries()) {
    if (count > maxCount) {
      maxCount = count
      dominant = cat
    }
  }
  
  return colorMap[dominant]
}
