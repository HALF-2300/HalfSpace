/**
 * Share System
 * Enables sharing of personalized experiences with exact reproduction
 * 
 * Share links encode:
 * 1. Cosmic seed (for visual tone)
 * 2. Content selections (timeline nodes, graph layout, mission stops)
 * 3. Session state (if sharing a constellation)
 * 4. Debrief cards
 * 
 * Anyone visiting a share link sees the EXACT same experience
 */

import {
  createShareCode,
  hashShareCode,
  importPersonalizationState,
  type PersonalizationContext
} from './personalization'

import type { DebriefCard } from './debriefCard'
import type { AdaptiveMission } from './missionAdapter'
import type { PersonalizedTimeline } from './timelinePersonalizer'

// ============================================================================
// TYPES
// ============================================================================

export type ShareableContentType = 
  | 'timeline'
  | 'constellation'
  | 'mission'
  | 'debrief'
  | 'discovery'

export interface ShareLinkData {
  version: string
  type: ShareableContentType
  shareCode: string
  seed: number
  createdAt: string
  
  // Content-specific data
  content: ShareableContent
  
  // Metadata
  metadata: {
    creatorId: string
    title: string
    description?: string
    tags?: string[]
  }
}

export type ShareableContent = 
  | TimelineShareContent
  | ConstellationShareContent
  | MissionShareContent
  | DebriefShareContent
  | DiscoveryShareContent

export interface TimelineShareContent {
  type: 'timeline'
  epochs: Array<{
    id: string
    featuredNodes: string[]
  }>
  visualTone: any
}

export interface ConstellationShareContent {
  type: 'constellation'
  visitedNodes: string[]
  layoutData: string // Encoded layout positions
  sessionDuration: number
  insights?: string[]
}

export interface MissionShareContent {
  type: 'mission'
  templateId: string
  stops: string[] // Stop IDs in order
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface DebriefShareContent {
  type: 'debrief'
  debriefCard: DebriefCard
}

export interface DiscoveryShareContent {
  type: 'discovery'
  nodeIds: string[]
  title: string
  notes?: string
}

export interface ShareResult {
  shareCode: string
  shortUrl: string
  fullUrl: string
  qrCodeUrl?: string
}

// ============================================================================
// STORAGE
// ============================================================================

const SHARE_CACHE_KEY = 'halfspace_share_cache'
const MAX_CACHED_SHARES = 20

// ============================================================================
// SHARE LINK CREATION
// ============================================================================

/**
 * Create a shareable link from timeline
 */
export function createTimelineShare(
  timeline: PersonalizedTimeline,
  seed: number,
  visualTone: any,
  creatorId: string
): ShareResult {
  const shareCode = createShareCode(seed)
  
  const shareData: ShareLinkData = {
    version: '1.0',
    type: 'timeline',
    shareCode,
    seed,
    createdAt: new Date().toISOString(),
    content: {
      type: 'timeline',
      epochs: timeline.epochs.map(e => ({
        id: e.id,
        featuredNodes: e.featuredNodes
      })),
      visualTone
    },
    metadata: {
      creatorId,
      title: 'Cosmic Timeline Journey',
      description: `Personalized journey through ${timeline.epochs.length} cosmic epochs`
    }
  }
  
  return createShareResult(shareData)
}

/**
 * Create a shareable link from constellation
 */
export function createConstellationShare(
  visitedNodes: string[],
  layoutData: string,
  sessionDuration: number,
  seed: number,
  creatorId: string,
  title?: string
): ShareResult {
  const shareCode = createShareCode(seed ^ hashString(visitedNodes.join(',')))
  
  const shareData: ShareLinkData = {
    version: '1.0',
    type: 'constellation',
    shareCode,
    seed,
    createdAt: new Date().toISOString(),
    content: {
      type: 'constellation',
      visitedNodes,
      layoutData,
      sessionDuration
    },
    metadata: {
      creatorId,
      title: title || `Constellation (${visitedNodes.length} nodes)`,
      description: `A ${Math.floor(sessionDuration / 60)}min exploration through space`
    }
  }
  
  return createShareResult(shareData)
}

/**
 * Create a shareable link from mission
 */
export function createMissionShare(
  mission: AdaptiveMission,
  creatorId: string
): ShareResult {
  const shareCode = createShareCode(mission.seed)
  
  const shareData: ShareLinkData = {
    version: '1.0',
    type: 'mission',
    shareCode,
    seed: mission.seed,
    createdAt: new Date().toISOString(),
    content: {
      type: 'mission',
      templateId: mission.templateId,
      stops: mission.stops.map(s => s.id),
      difficulty: mission.adaptedDifficulty
    },
    metadata: {
      creatorId,
      title: mission.name,
      description: mission.description,
      tags: [mission.adaptedDifficulty, 'mission']
    }
  }
  
  return createShareResult(shareData)
}

/**
 * Create a shareable link from debrief card
 */
export function createDebriefShare(
  debriefCard: DebriefCard
): ShareResult {
  // Debrief cards already have share codes
  const shareCode = debriefCard.shareCode
  
  const shareData: ShareLinkData = {
    version: '1.0',
    type: 'debrief',
    shareCode,
    seed: hashShareCode(shareCode),
    createdAt: debriefCard.createdAt,
    content: {
      type: 'debrief',
      debriefCard
    },
    metadata: {
      creatorId: debriefCard.cosmicId,
      title: 'Exploration Debrief',
      description: `${debriefCard.nodesVisited} nodes explored in ${Math.floor(debriefCard.duration / 60)}min`
    }
  }
  
  return createShareResult(shareData)
}

/**
 * Create a shareable link from discovery collection
 */
export function createDiscoveryShare(
  nodeIds: string[],
  title: string,
  notes: string | undefined,
  seed: number,
  creatorId: string
): ShareResult {
  const shareCode = createShareCode(seed ^ hashString(nodeIds.join(',')))
  
  const shareData: ShareLinkData = {
    version: '1.0',
    type: 'discovery',
    shareCode,
    seed,
    createdAt: new Date().toISOString(),
    content: {
      type: 'discovery',
      nodeIds,
      title,
      notes
    },
    metadata: {
      creatorId,
      title,
      description: `Collection of ${nodeIds.length} discoveries`
    }
  }
  
  return createShareResult(shareData)
}

/**
 * Create share result with URLs
 */
function createShareResult(shareData: ShareLinkData): ShareResult {
  // Cache share data
  cacheShareData(shareData)
  
  const baseUrl = getBaseUrl()
  const shareCode = shareData.shareCode
  
  // Generate URLs based on content type
  const pathMap: Record<ShareableContentType, string> = {
    timeline: 'timeline',
    constellation: 'constellation',
    mission: 'missions',
    debrief: 'debrief',
    discovery: 'discovery'
  }
  
  const path = pathMap[shareData.type]
  const fullUrl = `${baseUrl}/share/${path}/${shareCode}`
  const shortUrl = `${baseUrl}/s/${shareCode}`
  
  // Generate QR code URL (could be implemented with a QR generation service)
  const qrCodeUrl = `${baseUrl}/api/qr?url=${encodeURIComponent(fullUrl)}`
  
  return {
    shareCode,
    shortUrl,
    fullUrl,
    qrCodeUrl
  }
}

// ============================================================================
// SHARE LINK LOADING
// ============================================================================

/**
 * Load shared content from share code
 */
export function loadSharedContent(shareCode: string): ShareLinkData | null {
  // Try cache first
  const cached = getCachedShareData(shareCode)
  if (cached) return cached
  
  // In a real implementation, this would fetch from backend
  // For now, only cached shares are available
  return null
}

/**
 * Create personalization context from share link
 * This ensures the recipient sees the exact same experience
 */
export function createContextFromShare(shareCode: string): PersonalizationContext {
  return importPersonalizationState(shareCode)
}

/**
 * Validate share code format
 */
export function isValidShareCode(code: string): boolean {
  // Share codes are base36 encoded, 7 characters
  return /^[0-9A-Z]{7}$/.test(code)
}

// ============================================================================
// SHARE ANALYTICS (Optional)
// ============================================================================

export interface ShareAnalytics {
  shareCode: string
  views: number
  lastViewed: string
  viewerLocations?: string[]
}

/**
 * Record share view (for creator analytics)
 */
export function recordShareView(shareCode: string): void {
  const key = `halfspace_share_analytics_${shareCode}`
  const analytics = safeGetJSON<ShareAnalytics>(key, {
    shareCode,
    views: 0,
    lastViewed: new Date().toISOString()
  })
  
  analytics.views++
  analytics.lastViewed = new Date().toISOString()
  
  safeSetJSON(key, analytics)
}

/**
 * Get share analytics
 */
export function getShareAnalytics(shareCode: string): ShareAnalytics | null {
  const key = `halfspace_share_analytics_${shareCode}`
  const analytics = safeGetJSON<ShareAnalytics | null>(key, null)
  return analytics
}

// ============================================================================
// SHARE CACHE (Client-side)
// ============================================================================

/**
 * Cache share data in localStorage
 */
function cacheShareData(shareData: ShareLinkData): void {
  const cache = safeGetJSON<Record<string, ShareLinkData>>(SHARE_CACHE_KEY, {})
  
  cache[shareData.shareCode] = shareData
  
  // Limit cache size
  const codes = Object.keys(cache)
  if (codes.length > MAX_CACHED_SHARES) {
    // Remove oldest
    const sorted = codes.sort((a, b) => 
      new Date(cache[a].createdAt).getTime() - new Date(cache[b].createdAt).getTime()
    )
    delete cache[sorted[0]]
  }
  
  safeSetJSON(SHARE_CACHE_KEY, cache)
}

/**
 * Get cached share data
 */
function getCachedShareData(shareCode: string): ShareLinkData | null {
  const cache = safeGetJSON<Record<string, ShareLinkData>>(SHARE_CACHE_KEY, {})
  return cache[shareCode] || null
}

/**
 * Get all cached shares
 */
export function getAllCachedShares(): ShareLinkData[] {
  const cache = safeGetJSON<Record<string, ShareLinkData>>(SHARE_CACHE_KEY, {})
  return Object.values(cache).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

/**
 * Clear share cache
 */
export function clearShareCache(): void {
  safeSetJSON(SHARE_CACHE_KEY, {})
}

// ============================================================================
// SHARE COLLECTIONS
// ============================================================================

const SHARE_COLLECTIONS_KEY = 'halfspace_share_collections'

export interface ShareCollection {
  id: string
  name: string
  description?: string
  shares: string[] // Share codes
  createdAt: string
  updatedAt: string
}

/**
 * Create a collection of shares
 */
export function createShareCollection(
  name: string,
  description: string | undefined,
  shareCodes: string[]
): ShareCollection {
  const collection: ShareCollection = {
    id: generateId(),
    name,
    description,
    shares: shareCodes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  const collections = safeGetJSON<ShareCollection[]>(SHARE_COLLECTIONS_KEY, [])
  collections.push(collection)
  safeSetJSON(SHARE_COLLECTIONS_KEY, collections)
  
  return collection
}

/**
 * Get all share collections
 */
export function getShareCollections(): ShareCollection[] {
  return safeGetJSON<ShareCollection[]>(SHARE_COLLECTIONS_KEY, [])
}

/**
 * Add share to collection
 */
export function addToShareCollection(collectionId: string, shareCode: string): void {
  const collections = getShareCollections()
  const collection = collections.find(c => c.id === collectionId)
  
  if (collection && !collection.shares.includes(shareCode)) {
    collection.shares.push(shareCode)
    collection.updatedAt = new Date().toISOString()
    safeSetJSON(SHARE_COLLECTIONS_KEY, collections)
  }
}

// ============================================================================
// UTILITIES
// ============================================================================

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return hash >>> 0
}

function generateId(): string {
  return `col-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return 'https://halfspace.app'
}

// Import safeGetJSON, safeSetJSON from storage
import { safeGetJSON, safeSetJSON } from './storage'

// ============================================================================
// SHARE BUTTON HELPERS
// ============================================================================

/**
 * Copy share link to clipboard
 */
export async function copyShareLink(shareResult: ShareResult): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.clipboard) {
    return false
  }
  
  try {
    await navigator.clipboard.writeText(shareResult.shortUrl)
    return true
  } catch {
    return false
  }
}

/**
 * Share via Web Share API (mobile-friendly)
 */
export async function nativeShare(
  shareResult: ShareResult,
  title: string,
  text: string
): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.share) {
    return false
  }
  
  try {
    await navigator.share({
      title,
      text,
      url: shareResult.shortUrl
    })
    return true
  } catch {
    return false
  }
}

/**
 * Generate shareable image (for social media)
 * Returns data URL of generated image
 */
export function generateShareImage(
  shareData: ShareLinkData,
  width: number = 1200,
  height: number = 630
): string {
  // This would generate an Open Graph image
  // For now, return placeholder
  const canvas = typeof document !== 'undefined' ? document.createElement('canvas') : null
  if (!canvas) return ''
  
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''
  
  // Draw background
  ctx.fillStyle = '#0a0a0f'
  ctx.fillRect(0, 0, width, height)
  
  // Draw title
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 48px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(shareData.metadata.title, width / 2, height / 2 - 50)
  
  // Draw description
  if (shareData.metadata.description) {
    ctx.fillStyle = '#a0a0a0'
    ctx.font = '32px sans-serif'
    ctx.fillText(shareData.metadata.description, width / 2, height / 2 + 20)
  }
  
  // Draw share code
  ctx.fillStyle = '#666666'
  ctx.font = '24px monospace'
  ctx.fillText(`Code: ${shareData.shareCode}`, width / 2, height / 2 + 80)
  
  return canvas.toDataURL('image/png')
}

/**
 * Export share data as JSON (for backup/transfer)
 */
export function exportShareData(shareCode: string): string | null {
  const shareData = loadSharedContent(shareCode)
  if (!shareData) return null
  
  return JSON.stringify(shareData, null, 2)
}

/**
 * Import share data from JSON
 */
export function importShareData(jsonStr: string): ShareLinkData | null {
  try {
    const shareData = JSON.parse(jsonStr) as ShareLinkData
    
    // Validate structure
    if (!shareData.version || !shareData.type || !shareData.shareCode) {
      return null
    }
    
    // Cache it
    cacheShareData(shareData)
    
    return shareData
  } catch {
    return null
  }
}
