/**
 * Route Builder
 * 
 * Generates personalized journeys through space based on:
 * - User's interests and preferences
 * - What they've already seen
 * - Time available
 */

import contentIndex from '@/data/contentIndex.json'
import { loadProfile, ExplorerProfile } from './explorerProfile'
import { safeGetJSON, safeSetJSON } from './storage'

// ============================================================================
// Types
// ============================================================================

export interface RouteStop {
  pageId: string
  title: string
  url: string
  icon: string
  category: string
  duration: number // seconds
  highlight: string // Key fact to focus on
  completed?: boolean
}

export interface Route {
  id: string
  name: string
  description: string
  icon: string
  duration: number // total minutes
  stops: RouteStop[]
  type: 'nightly' | 'quick' | 'deep' | 'discovery' | 'custom'
  category?: string
  createdAt: string
  expiresAt?: string // For nightly routes
}

export interface RouteProgress {
  routeId: string
  currentStopIndex: number
  startedAt: string
  completedStops: string[]
  isComplete: boolean
}

// ============================================================================
// Constants
// ============================================================================

const STORAGE_KEY = 'halfspace_route_progress'
const NIGHTLY_ROUTE_KEY = 'halfspace_nightly_route'

const DEFAULT_STOP_DURATION = 45 // seconds
const HIGHLIGHTS = [
  'Look for the unique features',
  'Notice the scale comparison',
  'Think about what makes this special',
  'Consider how this relates to Earth',
  'Imagine visiting this place'
]

// ============================================================================
// Storage
// ============================================================================

function loadProgress(): RouteProgress | null {
  return safeGetJSON<RouteProgress | null>(STORAGE_KEY, null)
}

function saveProgress(progress: RouteProgress | null): void {
  safeSetJSON(STORAGE_KEY, progress)
}

function loadNightlyRoute(): Route | null {
  const route = safeGetJSON<Route | null>(NIGHTLY_ROUTE_KEY, null)
  if (!route) return null
  
  // Check if expired (routes are valid for 24 hours)
  if (route.expiresAt && new Date(route.expiresAt) < new Date()) {
    return null
  }
  
  return route
}

function saveNightlyRoute(route: Route): void {
  safeSetJSON(NIGHTLY_ROUTE_KEY, route)
}

// ============================================================================
// Route Generation
// ============================================================================

/**
 * Generate Tonight's Journey - personalized daily route
 */
export function generateNightlyRoute(): Route {
  // Check if we already have today's route
  const existing = loadNightlyRoute()
  if (existing) return existing

  const profile = loadProfile()
  const visitedIds = new Set(Object.keys(profile.visitedPages || {}))
  
  // Get preferred categories or default
  const preferredCategories = profile.preferredCategories?.length 
    ? profile.preferredCategories 
    : ['objects', 'phenomena']

  // Get items to include
  const items = contentIndex.items
  const stops: RouteStop[] = []

  // Add 3-4 items from preferred categories (prioritize unvisited)
  preferredCategories.forEach(category => {
    const categoryItems = items
      .filter(item => item.category === category)
      .sort((a, b) => {
        const aVisited = visitedIds.has(a.id) ? 1 : 0
        const bVisited = visitedIds.has(b.id) ? 1 : 0
        return aVisited - bVisited
      })
      .slice(0, 2)

    categoryItems.forEach(item => {
      if (stops.length < 5) {
        stops.push(createRouteStop(item))
      }
    })
  })

  // Add 1-2 "surprise" items from other categories
  const otherItems = items
    .filter(item => !preferredCategories.includes(item.category))
    .filter(item => !stops.some(s => s.pageId === item.id))
    .sort(() => Math.random() - 0.5)
    .slice(0, 2)

  otherItems.forEach(item => {
    if (stops.length < 7) {
      stops.push(createRouteStop(item, 'Surprise discovery!'))
    }
  })

  const tomorrow = new Date()
  tomorrow.setHours(tomorrow.getHours() + 24)

  const route: Route = {
    id: `nightly-${Date.now()}`,
    name: "Tonight's Journey",
    description: 'Your personalized cosmic adventure for today',
    icon: '🌙',
    duration: Math.ceil(stops.reduce((acc, s) => acc + s.duration, 0) / 60),
    stops,
    type: 'nightly',
    createdAt: new Date().toISOString(),
    expiresAt: tomorrow.toISOString()
  }

  saveNightlyRoute(route)
  return route
}

/**
 * Generate a quick 7-minute run
 */
export function generateQuickRun(minutes: number = 7): Route {
  const items = contentIndex.items
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.ceil(minutes / 1.5)) // ~1.5 min per stop

  const stops = items.map(item => createRouteStop(item))

  return {
    id: `quick-${Date.now()}`,
    name: `${minutes}-Minute Run`,
    description: `Quick cosmic sprint through ${stops.length} discoveries`,
    icon: '⚡',
    duration: minutes,
    stops,
    type: 'quick',
    createdAt: new Date().toISOString()
  }
}

/**
 * Generate a category deep dive
 */
export function generateDeepDive(category: string): Route {
  const items = contentIndex.items
    .filter(item => item.category === category)
    .slice(0, 10)

  const stops = items.map(item => createRouteStop(item))

  const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1)

  return {
    id: `deep-${category}-${Date.now()}`,
    name: `${categoryLabel} Deep Dive`,
    description: `Explore everything about ${categoryLabel.toLowerCase()}`,
    icon: '🔭',
    duration: Math.ceil(stops.reduce((acc, s) => acc + s.duration, 0) / 60),
    stops,
    type: 'deep',
    category,
    createdAt: new Date().toISOString()
  }
}

/**
 * Generate discovery path (unseen content)
 */
export function generateDiscoveryPath(): Route {
  const profile = loadProfile()
  const visitedIds = new Set(Object.keys(profile.visitedPages || {}))

  const unseenItems = contentIndex.items
    .filter(item => !visitedIds.has(item.id))
    .sort(() => Math.random() - 0.5)
    .slice(0, 8)

  const stops = unseenItems.map(item => createRouteStop(item, 'New discovery!'))

  return {
    id: `discovery-${Date.now()}`,
    name: 'Discovery Path',
    description: `${stops.length} places you haven't explored yet`,
    icon: '🗺️',
    duration: Math.ceil(stops.reduce((acc, s) => acc + s.duration, 0) / 60),
    stops,
    type: 'discovery',
    createdAt: new Date().toISOString()
  }
}

function createRouteStop(item: typeof contentIndex.items[0], customHighlight?: string): RouteStop {
  return {
    pageId: item.id,
    title: item.title,
    url: item.url,
    icon: item.icon,
    category: item.category,
    duration: DEFAULT_STOP_DURATION,
    highlight: customHighlight || HIGHLIGHTS[Math.floor(Math.random() * HIGHLIGHTS.length)]
  }
}

// ============================================================================
// Route Progress
// ============================================================================

/**
 * Start a route
 */
export function startRoute(route: Route): RouteProgress {
  const progress: RouteProgress = {
    routeId: route.id,
    currentStopIndex: 0,
    startedAt: new Date().toISOString(),
    completedStops: [],
    isComplete: false
  }

  saveProgress(progress)
  return progress
}

/**
 * Get current progress
 */
export function getRouteProgress(): RouteProgress | null {
  return loadProgress()
}

/**
 * Complete current stop and advance
 */
export function completeStop(route: Route): RouteProgress | null {
  const progress = loadProgress()
  if (!progress || progress.routeId !== route.id) return null

  const currentStop = route.stops[progress.currentStopIndex]
  if (currentStop) {
    progress.completedStops.push(currentStop.pageId)
  }

  if (progress.currentStopIndex < route.stops.length - 1) {
    progress.currentStopIndex++
  } else {
    progress.isComplete = true
  }

  saveProgress(progress)
  return progress
}

/**
 * Skip current stop
 */
export function skipStop(route: Route): RouteProgress | null {
  const progress = loadProgress()
  if (!progress || progress.routeId !== route.id) return null

  if (progress.currentStopIndex < route.stops.length - 1) {
    progress.currentStopIndex++
  } else {
    progress.isComplete = true
  }

  saveProgress(progress)
  return progress
}

/**
 * Clear progress
 */
export function clearProgress(): void {
  saveProgress(null)
}

// ============================================================================
// Available Routes
// ============================================================================

/**
 * Get all available route types
 */
export function getAvailableRoutes(): { type: string; name: string; icon: string; description: string }[] {
  const categories = contentIndex.metadata.categories || []
  
  return [
    { type: 'nightly', name: "Tonight's Journey", icon: '🌙', description: 'Personalized daily adventure' },
    { type: 'quick-5', name: '5-Minute Run', icon: '⚡', description: 'Quick cosmic sprint' },
    { type: 'quick-10', name: '10-Minute Run', icon: '⚡', description: 'Extended discovery' },
    { type: 'discovery', name: 'Discovery Path', icon: '🗺️', description: 'Explore the unknown' },
    ...categories.slice(0, 4).map(cat => ({
      type: `deep-${cat}`,
      name: `${cat.charAt(0).toUpperCase() + cat.slice(1)} Deep Dive`,
      icon: '🔭',
      description: `Master ${cat}`
    }))
  ]
}

/**
 * Generate route by type
 */
export function generateRouteByType(type: string): Route {
  if (type === 'nightly') return generateNightlyRoute()
  if (type === 'quick-5') return generateQuickRun(5)
  if (type === 'quick-10') return generateQuickRun(10)
  if (type === 'discovery') return generateDiscoveryPath()
  if (type.startsWith('deep-')) {
    const category = type.replace('deep-', '')
    return generateDeepDive(category)
  }
  return generateQuickRun(7)
}
