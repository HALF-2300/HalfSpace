/**
 * Constellation Engine - Core logic for session recording, encoding, and replay
 * Part of MISSION-3: Discovery Graph UI
 */

import type {
  Constellation,
  ConstellationCompact,
  ConstellationShareData,
  GraphNode,
  GraphSession,
  GraphSessionMetadata,
  NodeCategory,
  JourneyBreadcrumb,
  JourneyStats,
  ConstellationStorage,
  PerformanceTier,
} from './constellation.types'
import type { RecordedSpaceEvent } from '../recorder/recorder'

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

export class ConstellationSessionManager {
  private currentSession: GraphSession | null = null
  private startTime: number = 0
  private visitedNodes: string[] = []
  private traversedEdges: string[] = []
  private events: RecordedSpaceEvent[] = []

  startSession(): string {
    const sessionId = this.generateId()
    this.startTime = Date.now()
    this.visitedNodes = []
    this.traversedEdges = []
    this.events = []

    this.currentSession = {
      sessionId,
      startedAt: this.startTime,
      events: [],
      nodes: [],
      edges: [],
      metadata: this.calculateMetadata([]),
    }

    return sessionId
  }

  recordNodeVisit(nodeId: string, event: RecordedSpaceEvent): void {
    if (!this.currentSession) return

    if (!this.visitedNodes.includes(nodeId)) {
      this.visitedNodes.push(nodeId)
    }
    this.events.push(event)
  }

  recordEdgeTraversal(edgeId: string, event: RecordedSpaceEvent): void {
    if (!this.currentSession) return

    this.traversedEdges.push(edgeId)
    this.events.push(event)
  }

  recordEvent(event: RecordedSpaceEvent): void {
    if (!this.currentSession) return
    this.events.push(event)
  }

  getSession(): GraphSession | null {
    if (!this.currentSession) return null

    return {
      ...this.currentSession,
      endedAt: Date.now(),
      events: [...this.events],
      nodes: [...this.visitedNodes],
      edges: [...this.traversedEdges],
      metadata: this.calculateMetadata(this.visitedNodes),
    }
  }

  endSession(): GraphSession | null {
    const session = this.getSession()
    this.currentSession = null
    return session
  }

  isActive(): boolean {
    return this.currentSession !== null
  }

  private calculateMetadata(nodes: string[]): GraphSessionMetadata {
    const duration = Math.floor((Date.now() - this.startTime) / 1000)
    const uniqueNodes = new Set(nodes).size
    const categories = this.categorizeNodes(nodes)
    const dominantCategory = this.findDominantCategory(categories)

    return {
      duration,
      uniqueNodes,
      totalNodeVisits: nodes.length,
      edgesTraversed: this.traversedEdges.length,
      deepestDepth: this.calculateDepth(nodes),
      dominantCategory,
      explorationScore: this.calculateExplorationScore(uniqueNodes, this.traversedEdges.length),
    }
  }

  private categorizeNodes(nodeIds: string[]): Map<NodeCategory, number> {
    const categories = new Map<NodeCategory, number>()
    // Simplified categorization based on ID prefixes
    nodeIds.forEach((id) => {
      const category = this.inferCategory(id)
      categories.set(category, (categories.get(category) || 0) + 1)
    })
    return categories
  }

  private inferCategory(nodeId: string): NodeCategory {
    if (nodeId.includes('mission')) return 'mission'
    if (nodeId.includes('telescope')) return 'telescope'
    if (nodeId.includes('fact')) return 'fact'
    if (nodeId.includes('term')) return 'term'
    if (nodeId.includes('realm')) return 'realm'
    return 'concept'
  }

  private findDominantCategory(categories: Map<NodeCategory, number>): NodeCategory {
    let max = 0
    let dominant: NodeCategory = 'concept'
    categories.forEach((count, category) => {
      if (count > max) {
        max = count
        dominant = category
      }
    })
    return dominant
  }

  private calculateDepth(nodes: string[]): number {
    // Simplified: just use number of unique nodes as proxy
    return new Set(nodes).size
  }

  private calculateExplorationScore(uniqueNodes: number, edges: number): number {
    // Score based on breadth (nodes) vs depth (edges)
    // Higher score = more exploratory (many nodes)
    // Lower score = more focused (few nodes, many revisits)
    const breadthScore = uniqueNodes * 5
    const depthScore = edges * 2
    return Math.min(100, breadthScore + depthScore)
  }

  private generateId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}

// ============================================================================
// CONSTELLATION ENCODING / DECODING
// ============================================================================

export function encodeConstellation(constellation: Constellation): string {
  const compact: ConstellationCompact = {
    n: constellation.session.nodes,
    e: constellation.session.edges,
    t: constellation.createdAt,
    m: constellation.name,
    d: constellation.description,
  }

  const json = JSON.stringify(compact)
  const base64 = btoa(json)
  // Make URL-safe
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function decodeConstellation(encoded: string): ConstellationCompact | null {
  try {
    // Reverse URL-safe encoding
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/')
    const json = atob(base64)
    const compact = JSON.parse(json) as ConstellationCompact

    // Validate
    if (!Array.isArray(compact.n) || !Array.isArray(compact.e)) {
      return null
    }

    return compact
  } catch (error) {
    console.error('Failed to decode constellation:', error)
    return null
  }
}

export function constellationToUrl(constellation: Constellation, baseUrl: string): string {
  const encoded = encodeConstellation(constellation)
  return `${baseUrl}/space/graph?c=${encoded}`
}

export function urlToConstellation(url: string): ConstellationCompact | null {
  const urlObj = new URL(url)
  const encoded = urlObj.searchParams.get('c')
  if (!encoded) return null
  return decodeConstellation(encoded)
}

// ============================================================================
// CONSTELLATION STORAGE (localStorage)
// ============================================================================

const STORAGE_KEY = 'space:constellations'
const MAX_CONSTELLATIONS = 50
const STORAGE_VERSION = '1.0'

export function saveConstellation(constellation: Constellation): boolean {
  try {
    const storage = loadStorage()
    
    // Check if already exists (update)
    const existingIndex = storage.constellations.findIndex((c) => c.id === constellation.id)
    if (existingIndex >= 0) {
      storage.constellations[existingIndex] = constellation
    } else {
      // Add new, enforce max limit (FIFO)
      storage.constellations.push(constellation)
      if (storage.constellations.length > MAX_CONSTELLATIONS) {
        storage.constellations.shift() // Remove oldest
      }
    }

    storage.lastUpdated = Date.now()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storage))
    return true
  } catch (error) {
    console.error('Failed to save constellation:', error)
    return false
  }
}

export function loadConstellations(): Constellation[] {
  const storage = loadStorage()
  return storage.constellations
}

export function loadConstellation(id: string): Constellation | null {
  const storage = loadStorage()
  return storage.constellations.find((c) => c.id === id) || null
}

export function deleteConstellation(id: string): boolean {
  try {
    const storage = loadStorage()
    storage.constellations = storage.constellations.filter((c) => c.id !== id)
    storage.lastUpdated = Date.now()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storage))
    return true
  } catch (error) {
    console.error('Failed to delete constellation:', error)
    return false
  }
}

export function renameConstellation(id: string, newName: string): boolean {
  try {
    const storage = loadStorage()
    const constellation = storage.constellations.find((c) => c.id === id)
    if (!constellation) return false

    constellation.name = newName
    constellation.updatedAt = Date.now()
    storage.lastUpdated = Date.now()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storage))
    return true
  } catch (error) {
    console.error('Failed to rename constellation:', error)
    return false
  }
}

function loadStorage(): ConstellationStorage {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createEmptyStorage()

    const storage = JSON.parse(raw) as ConstellationStorage

    // Version migration (if needed in future)
    if (storage.version !== STORAGE_VERSION) {
      return createEmptyStorage()
    }

    return storage
  } catch (error) {
    console.error('Failed to load constellation storage:', error)
    return createEmptyStorage()
  }
}

function createEmptyStorage(): ConstellationStorage {
  return {
    version: STORAGE_VERSION,
    constellations: [],
    maxConstellations: MAX_CONSTELLATIONS,
    lastUpdated: Date.now(),
  }
}

// ============================================================================
// JOURNEY HELPERS
// ============================================================================

export function sessionToJourneyBreadcrumbs(
  session: GraphSession,
  nodes: Map<string, GraphNode>
): JourneyBreadcrumb[] {
  const breadcrumbs: JourneyBreadcrumb[] = []

  session.nodes.forEach((nodeId, index) => {
    const node = nodes.get(nodeId)
    if (!node) return

    // Find the event for this node visit
    const event = session.events.find(
      (e) => (e.type === 'custom' || e.type === 'nav') && (e.payload as any)?.nodeId === nodeId
    )

    breadcrumbs.push({
      nodeId,
      title: node.title,
      timestamp: event?.offsetMs || index * 1000,
      edgeRelation: index > 0 ? 'connected' : undefined,
    })
  })

  return breadcrumbs
}

export function sessionToJourneyStats(session: GraphSession): JourneyStats {
  const duration = formatDuration(session.metadata.duration)

  return {
    duration,
    nodesVisited: session.metadata.uniqueNodes,
    edgesTraversed: session.metadata.edgesTraversed,
    currentDepth: session.metadata.deepestDepth,
    explorationScore: session.metadata.explorationScore,
  }
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (minutes < 60) return `${minutes}m ${secs}s`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

// ============================================================================
// CONSTELLATION NAMING
// ============================================================================

export function generateConstellationName(session: GraphSession): string {
  const { dominantCategory, uniqueNodes } = session.metadata
  const categoryName = dominantCategory.charAt(0).toUpperCase() + dominantCategory.slice(1)
  return `Journey: ${categoryName} · ${uniqueNodes} nodes`
}

export function generateConstellationId(): string {
  return `constellation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// ============================================================================
// PERFORMANCE DETECTION
// ============================================================================

export function detectPerformanceTier(): PerformanceTier {
  if (typeof window === 'undefined') return 2

  const cores = navigator.hardwareConcurrency || 2
  const memory = (navigator as any).deviceMemory || 4
  const gpu = detectWebGLCapability()

  if (cores >= 4 && memory >= 8 && gpu === 'high') return 1
  if (cores >= 2 && memory >= 4 && gpu === 'medium') return 2
  if (cores >= 2 || gpu === 'basic') return 3
  return 4
}

export function detectWebGLCapability(): 'none' | 'basic' | 'medium' | 'high' {
  if (typeof window === 'undefined') return 'none'

  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')

    if (!gl) return 'none'

    const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info')
    if (!debugInfo) return 'basic'

    const renderer = (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
    const rendererLower = renderer.toLowerCase()

    if (rendererLower.includes('nvidia') || rendererLower.includes('amd')) {
      return 'high'
    }
    if (rendererLower.includes('intel')) {
      return 'medium'
    }

    return 'basic'
  } catch (error) {
    return 'none'
  }
}

export function shouldUseListFallback(nodeCount: number, tier: PerformanceTier): boolean {
  if (tier === 4) return nodeCount > 100
  if (tier === 3) return nodeCount > 300
  if (tier === 2) return nodeCount > 500
  return nodeCount > 1000
}

// ============================================================================
// QR CODE GENERATION (requires qr-code-styling library)
// ============================================================================

export async function generateQRCode(url: string, size: number = 256): Promise<string> {
  // This is a placeholder - actual implementation needs qr-code-styling
  // For now, return a data URL or use a simple QR library

  try {
    // Option 1: Use a simple library
    // const QRCode = await import('qrcode')
    // const dataUrl = await QRCode.toDataURL(url, { width: size })
    // return dataUrl

    // Option 2: Use external service (not recommended for production)
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}`
  } catch (error) {
    console.error('Failed to generate QR code:', error)
    return ''
  }
}

// ============================================================================
// THUMBNAIL GENERATION
// ============================================================================

export function generateThumbnail(
  canvas: HTMLCanvasElement,
  width: number = 200,
  height: number = 150
): string {
  try {
    const thumbnailCanvas = document.createElement('canvas')
    thumbnailCanvas.width = width
    thumbnailCanvas.height = height

    const ctx = thumbnailCanvas.getContext('2d')
    if (!ctx) return ''

    // Draw scaled version
    ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, width, height)

    return thumbnailCanvas.toDataURL('image/png')
  } catch (error) {
    console.error('Failed to generate thumbnail:', error)
    return ''
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function isValidConstellation(constellation: any): constellation is Constellation {
  return (
    constellation &&
    typeof constellation.id === 'string' &&
    typeof constellation.name === 'string' &&
    constellation.session &&
    Array.isArray(constellation.session.nodes) &&
    Array.isArray(constellation.session.edges)
  )
}

export function sortConstellations(
  constellations: Constellation[],
  sortBy: 'recent' | 'popular' | 'duration' | 'nodes'
): Constellation[] {
  const sorted = [...constellations]

  switch (sortBy) {
    case 'recent':
      sorted.sort((a, b) => b.createdAt - a.createdAt)
      break
    case 'popular':
      sorted.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      break
    case 'duration':
      sorted.sort((a, b) => b.session.metadata.duration - a.session.metadata.duration)
      break
    case 'nodes':
      sorted.sort((a, b) => b.session.metadata.uniqueNodes - a.session.metadata.uniqueNodes)
      break
  }

  return sorted
}

export function getConstellationStats(constellations: Constellation[]) {
  const totalJourneys = constellations.length
  const totalNodes = constellations.reduce((sum, c) => sum + c.session.metadata.uniqueNodes, 0)
  const avgNodesPerJourney = totalJourneys > 0 ? Math.round(totalNodes / totalJourneys) : 0
  const totalDuration = constellations.reduce((sum, c) => sum + c.session.metadata.duration, 0)
  const avgDuration = totalJourneys > 0 ? Math.round(totalDuration / totalJourneys) : 0

  return {
    totalJourneys,
    totalNodes,
    avgNodesPerJourney,
    totalDuration,
    avgDuration: formatDuration(avgDuration),
  }
}

// ============================================================================
// EXPORT SINGLETON INSTANCE
// ============================================================================

export const constellationSession = new ConstellationSessionManager()
