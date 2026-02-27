/**
 * Explorer Profile System
 * 
 * Tracks user's journey through space, their preferences,
 * and creates a personalized experience.
 */

import { safeGetJSON, safeSetJSON } from './storage'
import contentIndex from '@/data/contentIndex.json'

// ============================================================================
// Types
// ============================================================================

export interface VisitedPage {
  id: string
  title: string
  url: string
  category: string
  visitedAt: string
  timeSpent: number // seconds
  icon: string
}

export interface ExplorerStats {
  totalPagesVisited: number
  totalTimeExplored: number // seconds
  favoriteCategory: string
  discoveryPercentage: number
  uniquePagesVisited: number
}

export interface ExplorerProfile {
  // Identity
  explorerName: string
  joinedAt: string
  
  // Journey tracking
  visitedPages: VisitedPage[]
  visitedIds: string[]
  bookmarkedIds: string[]
  
  // Preferences
  preferredCategories: string[]
  interests: string[]
  
  // Stats
  totalTimeExplored: number
  sessionsCount: number
  lastSessionAt: string
  
  // Achievements
  achievements: string[]
  
  // Settings
  showRecommendations: boolean
  language: 'en' | 'ar'
}

export interface Recommendation {
  id: string
  title: string
  url: string
  icon: string
  description: string
  category: string
  reason: string
}

// ============================================================================
// Constants
// ============================================================================

const STORAGE_KEY = 'halfspace_explorer_profile'
const SESSION_START_KEY = 'halfspace_session_start'

const ACHIEVEMENTS = [
  { id: 'first-visit', name: 'First Contact', icon: '🚀', description: 'Started your cosmic journey', condition: (p: ExplorerProfile) => p.visitedIds.length >= 1 },
  { id: 'explorer-5', name: 'Curious Mind', icon: '🔍', description: 'Visited 5 different pages', condition: (p: ExplorerProfile) => p.visitedIds.length >= 5 },
  { id: 'explorer-10', name: 'Space Enthusiast', icon: '⭐', description: 'Visited 10 different pages', condition: (p: ExplorerProfile) => p.visitedIds.length >= 10 },
  { id: 'explorer-25', name: 'Cosmic Explorer', icon: '🌟', description: 'Visited 25 different pages', condition: (p: ExplorerProfile) => p.visitedIds.length >= 25 },
  { id: 'explorer-50', name: 'Universe Master', icon: '👑', description: 'Visited 50 different pages', condition: (p: ExplorerProfile) => p.visitedIds.length >= 50 },
  { id: 'time-1h', name: 'Deep Diver', icon: '🏊', description: 'Spent 1 hour exploring', condition: (p: ExplorerProfile) => p.totalTimeExplored >= 3600 },
  { id: 'time-5h', name: 'Space Addict', icon: '💫', description: 'Spent 5 hours exploring', condition: (p: ExplorerProfile) => p.totalTimeExplored >= 18000 },
  { id: 'bookworm', name: 'Cosmic Bookworm', icon: '📚', description: 'Bookmarked 10 pages', condition: (p: ExplorerProfile) => p.bookmarkedIds.length >= 10 },
  { id: 'category-planets', name: 'Planet Hunter', icon: '🪐', description: 'Explored all planets', condition: (p: ExplorerProfile) => hasVisitedCategory(p, 'objects', 5) },
  { id: 'category-phenomena', name: 'Phenomenon Seeker', icon: '🌌', description: 'Explored cosmic phenomena', condition: (p: ExplorerProfile) => hasVisitedCategory(p, 'phenomena', 3) },
]

function hasVisitedCategory(profile: ExplorerProfile, category: string, count: number): boolean {
  const categoryVisits = profile.visitedPages.filter(p => p.category === category)
  return categoryVisits.length >= count
}

// ============================================================================
// Core Functions
// ============================================================================

function createDefaultProfile(): ExplorerProfile {
  return {
    explorerName: '',
    joinedAt: new Date().toISOString(),
    visitedPages: [],
    visitedIds: [],
    bookmarkedIds: [],
    preferredCategories: [],
    interests: [],
    totalTimeExplored: 0,
    sessionsCount: 1,
    lastSessionAt: new Date().toISOString(),
    achievements: [],
    showRecommendations: true,
    language: 'en'
  }
}

/**
 * Load explorer profile
 */
export function loadProfile(): ExplorerProfile {
  return safeGetJSON<ExplorerProfile>(STORAGE_KEY, createDefaultProfile())
}

/**
 * Save explorer profile
 */
export function saveProfile(profile: ExplorerProfile): void {
  safeSetJSON(STORAGE_KEY, profile)
}

/**
 * Record a page visit
 */
export function recordVisit(pageId: string, pageTitle: string, pageUrl: string, category: string, icon: string): ExplorerProfile {
  const profile = loadProfile()
  const now = new Date().toISOString()
  
  // Add to visited pages
  profile.visitedPages.push({
    id: pageId,
    title: pageTitle,
    url: pageUrl,
    category,
    visitedAt: now,
    timeSpent: 0,
    icon
  })
  
  // Track unique visits
  if (!profile.visitedIds.includes(pageId)) {
    profile.visitedIds.push(pageId)
  }
  
  // Update category preferences
  if (!profile.preferredCategories.includes(category)) {
    profile.preferredCategories.push(category)
  }
  
  // Check for new achievements
  checkAchievements(profile)
  
  saveProfile(profile)
  return profile
}

/**
 * Update time spent on current page
 */
export function updateTimeSpent(seconds: number): void {
  const profile = loadProfile()
  profile.totalTimeExplored += seconds
  
  // Update last visited page time
  if (profile.visitedPages.length > 0) {
    profile.visitedPages[profile.visitedPages.length - 1].timeSpent += seconds
  }
  
  // Check time-based achievements
  checkAchievements(profile)
  
  saveProfile(profile)
}

/**
 * Toggle bookmark
 */
export function toggleBookmark(pageId: string): boolean {
  const profile = loadProfile()
  
  const index = profile.bookmarkedIds.indexOf(pageId)
  if (index > -1) {
    profile.bookmarkedIds.splice(index, 1)
    saveProfile(profile)
    return false
  } else {
    profile.bookmarkedIds.push(pageId)
    checkAchievements(profile)
    saveProfile(profile)
    return true
  }
}

/**
 * Check if page is bookmarked
 */
export function isBookmarked(pageId: string): boolean {
  const profile = loadProfile()
  return profile.bookmarkedIds.includes(pageId)
}

/**
 * Get bookmarked pages
 */
export function getBookmarks(): VisitedPage[] {
  const profile = loadProfile()
  return profile.visitedPages.filter(p => profile.bookmarkedIds.includes(p.id))
}

/**
 * Check and unlock achievements
 */
function checkAchievements(profile: ExplorerProfile): string[] {
  const newAchievements: string[] = []
  
  for (const achievement of ACHIEVEMENTS) {
    if (!profile.achievements.includes(achievement.id) && achievement.condition(profile)) {
      profile.achievements.push(achievement.id)
      newAchievements.push(achievement.id)
    }
  }
  
  return newAchievements
}

/**
 * Get unlocked achievements
 */
export function getUnlockedAchievements(): typeof ACHIEVEMENTS {
  const profile = loadProfile()
  return ACHIEVEMENTS.filter(a => profile.achievements.includes(a.id))
}

/**
 * Get all achievements with unlock status
 */
export function getAllAchievements(): Array<typeof ACHIEVEMENTS[0] & { unlocked: boolean }> {
  const profile = loadProfile()
  return ACHIEVEMENTS.map(a => ({
    ...a,
    unlocked: profile.achievements.includes(a.id)
  }))
}

/**
 * Get explorer stats
 */
export function getStats(): ExplorerStats {
  const profile = loadProfile()
  
  // Calculate favorite category
  const categoryCount: Record<string, number> = {}
  for (const page of profile.visitedPages) {
    categoryCount[page.category] = (categoryCount[page.category] || 0) + 1
  }
  
  const favoriteCategory = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'None yet'
  
  return {
    totalPagesVisited: profile.visitedPages.length,
    totalTimeExplored: profile.totalTimeExplored,
    favoriteCategory,
    discoveryPercentage: Math.round((profile.visitedIds.length / contentIndex.items.length) * 100),
    uniquePagesVisited: profile.visitedIds.length
  }
}

/**
 * Get personalized recommendations
 */
export function getRecommendations(count: number = 5): Recommendation[] {
  const profile = loadProfile()
  
  // Get unvisited pages
  const unvisitedItems = contentIndex.items.filter(
    item => !profile.visitedIds.includes(item.id)
  )
  
  // Score items based on preferences
  const scoredItems = unvisitedItems.map(item => {
    let score = 0
    
    // Prefer categories the user has explored
    if (profile.preferredCategories.includes(item.category)) {
      score += 10
    }
    
    // Random factor for variety
    score += Math.random() * 5
    
    return { item, score }
  })
  
  // Sort by score and take top N
  scoredItems.sort((a, b) => b.score - a.score)
  
  return scoredItems.slice(0, count).map(({ item }) => ({
    id: item.id,
    title: item.title,
    url: item.url,
    icon: item.icon,
    description: item.description,
    category: item.category,
    reason: profile.preferredCategories.includes(item.category)
      ? `Based on your interest in ${item.category}`
      : 'Recommended for you'
  }))
}

/**
 * Get discovery map data (for visualization)
 */
export function getDiscoveryMap(): {
  visited: Array<{ id: string; category: string; title: string }>
  unvisited: Array<{ id: string; category: string; title: string }>
  categories: Array<{ name: string; visitedCount: number; totalCount: number }>
} {
  const profile = loadProfile()
  
  const visited = contentIndex.items
    .filter(item => profile.visitedIds.includes(item.id))
    .map(item => ({ id: item.id, category: item.category, title: item.title }))
  
  const unvisited = contentIndex.items
    .filter(item => !profile.visitedIds.includes(item.id))
    .map(item => ({ id: item.id, category: item.category, title: item.title }))
  
  // Category breakdown
  const categoryStats: Record<string, { visited: number; total: number }> = {}
  for (const item of contentIndex.items) {
    if (!categoryStats[item.category]) {
      categoryStats[item.category] = { visited: 0, total: 0 }
    }
    categoryStats[item.category].total++
    if (profile.visitedIds.includes(item.id)) {
      categoryStats[item.category].visited++
    }
  }
  
  const categories = Object.entries(categoryStats).map(([name, stats]) => ({
    name,
    visitedCount: stats.visited,
    totalCount: stats.total
  }))
  
  return { visited, unvisited, categories }
}

/**
 * Set explorer name
 */
export function setExplorerName(name: string): void {
  const profile = loadProfile()
  profile.explorerName = name
  saveProfile(profile)
}

/**
 * Start a new session
 */
export function startSession(): void {
  if (typeof window === 'undefined') return
  
  const profile = loadProfile()
  const lastSession = new Date(profile.lastSessionAt)
  const now = new Date()
  
  // If last session was more than 30 minutes ago, count as new session
  if (now.getTime() - lastSession.getTime() > 30 * 60 * 1000) {
    profile.sessionsCount++
  }
  
  profile.lastSessionAt = now.toISOString()
  saveProfile(profile)
  
  // Store session start time
  safeSetJSON(SESSION_START_KEY, now.getTime())
}

/**
 * End session and record time
 */
export function endSession(): void {
  if (typeof window === 'undefined') return
  
  const startTime = safeGetJSON<number>(SESSION_START_KEY, 0)
  if (startTime) {
    const duration = Math.floor((Date.now() - startTime) / 1000)
    updateTimeSpent(duration)
  }
}

/**
 * Reset profile (for testing)
 */
export function resetProfile(): void {
  safeSetJSON(STORAGE_KEY, createDefaultProfile())
}
