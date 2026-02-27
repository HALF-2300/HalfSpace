/**
 * Enhanced User Profile System
 * Integrates Cosmic Signature with Explorer Profile
 * 
 * This is the complete identity layer that makes each user's experience unique
 */

import { 
  getCosmicSignature, 
  getPreferenceVector, 
  updatePreferenceVector,
  recordCategoryInteraction,
  recordDifficultyPreference,
  recordExplainLevel,
  recordMicroModuleLaunch,
  calculateDepthPreference,
  type CosmicSignature,
  type PreferenceVector
} from './personalization'

import {
  loadProfile,
  saveProfile,
  recordVisit,
  updateTimeSpent,
  toggleBookmark,
  isBookmarked,
  getBookmarks,
  getStats,
  startSession,
  endSession,
  type ExplorerProfile,
  type ExplorerStats,
  type VisitedPage
} from './explorerProfile'

// ============================================================================
// UNIFIED USER PROFILE
// ============================================================================

/**
 * Complete user identity combining cosmic signature + explorer profile + preferences
 */
export interface UnifiedUserProfile {
  // Cosmic Identity
  cosmicSignature: CosmicSignature
  
  // Explorer Journey
  explorerProfile: ExplorerProfile
  
  // Behavioral Preferences
  preferences: PreferenceVector
  
  // Computed Stats
  stats: ExplorerStats
  
  // Session State
  currentSessionId?: string
  sessionStartTime?: number
}

// ============================================================================
// CORE FUNCTIONS
// ============================================================================

/**
 * Initialize user profile (call on app mount)
 */
export function initUserProfile(): UnifiedUserProfile {
  const cosmicSignature = getCosmicSignature()
  const explorerProfile = loadProfile()
  const preferences = getPreferenceVector()
  const stats = getStats()
  
  // Start session tracking
  startSession()
  
  return {
    cosmicSignature,
    explorerProfile,
    preferences,
    stats
  }
}

/**
 * Get current unified profile
 */
export function getUserProfile(): UnifiedUserProfile {
  return {
    cosmicSignature: getCosmicSignature(),
    explorerProfile: loadProfile(),
    preferences: getPreferenceVector(),
    stats: getStats()
  }
}

// ============================================================================
// TRACKING FUNCTIONS (combines both systems)
// ============================================================================

/**
 * Track page visit with full personalization updates
 */
export function trackPageVisit(
  pageId: string,
  pageTitle: string,
  pageUrl: string,
  category: string,
  icon: string,
  dwellTime: number = 0
): UnifiedUserProfile {
  // Record in explorer profile
  recordVisit(pageId, pageTitle, pageUrl, category, icon)
  
  // Update preferences
  if (dwellTime > 0) {
    recordCategoryInteraction(category, dwellTime)
  }
  
  // Update depth preference
  const profile = loadProfile()
  const depthPref = calculateDepthPreference(
    profile.visitedIds.length,
    profile.visitedPages.length
  )
  
  updatePreferenceVector({ depthPreference: depthPref })
  
  return getUserProfile()
}

/**
 * Track time spent on current page
 */
export function trackTimeSpent(seconds: number): void {
  updateTimeSpent(seconds)
}

/**
 * Track content difficulty interaction
 */
export function trackDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): void {
  recordDifficultyPreference(difficulty)
}

/**
 * Track explain level usage ("12" | "college" | "expert")
 */
export function trackExplainLevel(level: string): void {
  recordExplainLevel(level)
}

/**
 * Track micro-module interaction
 */
export function trackMicroModule(moduleId: string): void {
  recordMicroModuleLaunch(moduleId)
}

/**
 * Track category preference
 */
export function trackCategory(category: string, dwellTime: number): void {
  recordCategoryInteraction(category, dwellTime)
}

/**
 * Toggle bookmark
 */
export function togglePageBookmark(pageId: string): boolean {
  return toggleBookmark(pageId)
}

/**
 * Check if page is bookmarked
 */
export function isPageBookmarked(pageId: string): boolean {
  return isBookmarked(pageId)
}

/**
 * Get all bookmarks
 */
export function getBookmarkedPages(): VisitedPage[] {
  return getBookmarks()
}

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

/**
 * Start new session
 */
export function startUserSession(): void {
  startSession()
}

/**
 * End session
 */
export function endUserSession(): void {
  endSession()
}

// ============================================================================
// PROFILE QUERIES
// ============================================================================

/**
 * Get user's favorite categories (top 3)
 */
export function getFavoriteCategories(): string[] {
  const { preferences, explorerProfile } = getUserProfile()
  
  // Combine preference weights with visit counts
  const categoryCounts: Record<string, number> = {}
  
  for (const page of explorerProfile.visitedPages) {
    categoryCounts[page.category] = (categoryCounts[page.category] || 0) + 1
  }
  
  // Score categories by weight + count
  const scored = Object.entries(preferences.categoryWeights).map(([cat, weight]) => ({
    category: cat,
    score: weight * 10 + (categoryCounts[cat] || 0) * 0.1
  }))
  
  scored.sort((a, b) => b.score - a.score)
  
  return scored.slice(0, 3).map(s => s.category)
}

/**
 * Get preferred difficulty level
 */
export function getPreferredDifficulty(): 'beginner' | 'intermediate' | 'advanced' | 'mixed' {
  const { preferences } = getUserProfile()
  return preferences.difficultyPreference
}

/**
 * Get exploration style (depth vs breadth)
 */
export function getExplorationStyle(): 'depth' | 'breadth' | 'balanced' {
  const { preferences } = getUserProfile()
  
  if (preferences.depthPreference > 0.7) return 'depth'
  if (preferences.depthPreference < 0.3) return 'breadth'
  return 'balanced'
}

/**
 * Get most used explain level
 */
export function getMostUsedExplainLevel(): string {
  const { preferences } = getUserProfile()
  
  const entries = Object.entries(preferences.explainLevelUsage)
  if (entries.length === 0) return 'college' // Default
  
  entries.sort((a, b) => b[1] - a[1])
  return entries[0][0]
}

/**
 * Get visual tone for UI theming
 */
export function getVisualTone() {
  const { cosmicSignature } = getUserProfile()
  return cosmicSignature.visualTone
}

/**
 * Get cosmic identity (for display/sharing)
 */
export function getCosmicIdentity(): {
  userId: string
  visualTone: any
  joinedDate: string
  exploreCount: number
  favoriteCategory: string
} {
  const profile = getUserProfile()
  
  return {
    userId: profile.cosmicSignature.userId.slice(0, 8), // Short ID for display
    visualTone: profile.cosmicSignature.visualTone,
    joinedDate: profile.explorerProfile.joinedAt,
    exploreCount: profile.explorerProfile.visitedIds.length,
    favoriteCategory: profile.stats.favoriteCategory
  }
}

// ============================================================================
// PROFILE EXPORT / IMPORT
// ============================================================================

/**
 * Export complete profile for backup/transfer
 */
export function exportProfile(): string {
  const profile = getUserProfile()
  return JSON.stringify({
    version: '1.0',
    cosmicSignature: profile.cosmicSignature,
    explorerProfile: profile.explorerProfile,
    preferences: profile.preferences,
    exportedAt: new Date().toISOString()
  })
}

/**
 * Import profile from backup
 * NOTE: This overwrites current profile - use with caution
 */
export function importProfile(data: string): UnifiedUserProfile {
  try {
    const parsed = JSON.parse(data)
    
    if (parsed.version !== '1.0') {
      throw new Error('Unsupported profile version')
    }
    
    // Save all components
    if (parsed.cosmicSignature) {
      localStorage.setItem('halfspace_cosmic_signature', JSON.stringify(parsed.cosmicSignature))
    }
    
    if (parsed.explorerProfile) {
      saveProfile(parsed.explorerProfile)
    }
    
    if (parsed.preferences) {
      updatePreferenceVector(parsed.preferences)
    }
    
    return getUserProfile()
  } catch (error) {
    console.error('Failed to import profile:', error)
    throw error
  }
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Get profile summary for display
 */
export function getProfileSummary(): {
  cosmicId: string
  explorerLevel: string
  pagesExplored: number
  timeExplored: string
  favoriteCategory: string
  explorationStyle: string
} {
  const profile = getUserProfile()
  const stats = profile.stats
  
  // Calculate explorer level
  let level = 'Newcomer'
  if (stats.uniquePagesVisited >= 50) level = 'Cosmic Master'
  else if (stats.uniquePagesVisited >= 25) level = 'Space Explorer'
  else if (stats.uniquePagesVisited >= 10) level = 'Curious Mind'
  else if (stats.uniquePagesVisited >= 5) level = 'Stargazer'
  
  // Format time
  const hours = Math.floor(stats.totalTimeExplored / 3600)
  const minutes = Math.floor((stats.totalTimeExplored % 3600) / 60)
  const timeExplored = hours > 0 
    ? `${hours}h ${minutes}m` 
    : `${minutes}m`
  
  return {
    cosmicId: profile.cosmicSignature.userId.slice(0, 8).toUpperCase(),
    explorerLevel: level,
    pagesExplored: stats.uniquePagesVisited,
    timeExplored,
    favoriteCategory: stats.favoriteCategory,
    explorationStyle: getExplorationStyle()
  }
}

/**
 * Check if this is user's first visit
 */
export function isFirstVisit(): boolean {
  const profile = loadProfile()
  return profile.visitedIds.length === 0
}

/**
 * Get journey milestone
 */
export function getJourneyMilestone(): {
  current: number
  next: number
  label: string
  progress: number
} | null {
  const stats = getStats()
  const visited = stats.uniquePagesVisited
  
  const milestones = [
    { count: 5, label: 'Stargazer' },
    { count: 10, label: 'Curious Mind' },
    { count: 25, label: 'Space Explorer' },
    { count: 50, label: 'Cosmic Master' },
    { count: 100, label: 'Universe Legend' }
  ]
  
  for (const milestone of milestones) {
    if (visited < milestone.count) {
      return {
        current: visited,
        next: milestone.count,
        label: milestone.label,
        progress: visited / milestone.count
      }
    }
  }
  
  return null // Already at max
}
