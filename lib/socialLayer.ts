/**
 * Social Layer System
 * 
 * Simulates social features like live explorer count, leaderboards,
 * and achievement sharing. Uses localStorage for demo purposes.
 * In production, this would connect to a real-time backend.
 */

import { safeGetJSON, safeSetJSON } from './storage'
import { loadStreakData } from './cosmicStreak'
import { getStats } from './explorerProfile'

// ============================================================================
// Types
// ============================================================================

export interface Explorer {
  id: string
  name: string
  badge: string
  streak: number
  discoveries: number
  joinedAt: string
  lastActive: string
}

export interface LeaderboardEntry {
  rank: number
  id: string
  name: string
  badge: string
  score: number
  category: 'streak' | 'discoveries' | 'time'
}

export interface ShareableAchievement {
  title: string
  description: string
  badge: string
  stats: {
    streak: number
    discoveries: number
    daysActive: number
  }
  shareUrl: string
  shareText: string
}

// ============================================================================
// Constants
// ============================================================================

const EXPLORERS_KEY = 'halfspace_explorers'
const LIVE_COUNT_KEY = 'halfspace_live_count'
const LAST_PING_KEY = 'halfspace_last_ping'

// Simulated explorer names for demo
const SIMULATED_NAMES = [
  'Cosmic Voyager', 'Star Seeker', 'Nebula Navigator', 'Galaxy Drifter',
  'Asteroid Hunter', 'Comet Chaser', 'Nova Scout', 'Pulsar Pioneer',
  'Quasar Quest', 'Eclipse Explorer', 'Meteor Mind', 'Orbit Observer',
  'Zenith Traveler', 'Aurora Adventurer', 'Cosmos Curator', 'Stellar Spirit',
  'Moon Walker', 'Sun Gazer', 'Planet Pilgrim', 'Space Wanderer'
]

const BADGES = ['🚀', '⭐', '🌟', '💫', '✨', '🌙', '☀️', '🪐', '🌌', '🔭']

// ============================================================================
// Live Explorer Count
// ============================================================================

/**
 * Get simulated live explorer count
 * In production, this would be a WebSocket connection
 */
export function getLiveExplorerCount(): number {
  // Base count with time-based variation
  const hour = new Date().getHours()
  const dayOfWeek = new Date().getDay()
  
  // More explorers during evenings and weekends
  let baseCount = 150
  
  if (hour >= 18 || hour < 2) {
    baseCount += 100 // Evening boost
  }
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    baseCount += 50 // Weekend boost
  }
  
  // Add some randomness
  const variance = Math.floor(Math.random() * 50) - 25
  
  return Math.max(50, baseCount + variance)
}

/**
 * Simulate live count updates
 */
export function subscribeLiveCount(callback: (count: number) => void): () => void {
  // Initial count
  callback(getLiveExplorerCount())
  
  // Update every 5 seconds with small variations
  let currentCount = getLiveExplorerCount()
  
  const interval = setInterval(() => {
    // Small random change
    const change = Math.floor(Math.random() * 11) - 5 // -5 to +5
    currentCount = Math.max(50, currentCount + change)
    callback(currentCount)
  }, 5000)
  
  return () => clearInterval(interval)
}

// ============================================================================
// Leaderboard
// ============================================================================

/**
 * Generate simulated leaderboard
 * In production, this would fetch from a backend
 */
export function getLeaderboard(category: 'streak' | 'discoveries' | 'time'): LeaderboardEntry[] {
  const entries: LeaderboardEntry[] = []
  
  // Add current user
  const streakData = loadStreakData()
  const stats = getStats()
  
  const userScore = 
    category === 'streak' ? streakData.currentStreak :
    category === 'discoveries' ? stats.uniquePagesVisited :
    Math.floor(stats.totalTimeExplored / 60) // minutes
  
  const userEntry: LeaderboardEntry = {
    rank: 0, // Will be set after sorting
    id: 'current-user',
    name: 'You',
    badge: '🌟',
    score: userScore,
    category
  }
  
  // Generate simulated entries
  const numEntries = 50
  for (let i = 0; i < numEntries; i++) {
    const baseScore = 
      category === 'streak' ? 200 :
      category === 'discoveries' ? 80 :
      500
    
    entries.push({
      rank: 0,
      id: `explorer-${i}`,
      name: SIMULATED_NAMES[i % SIMULATED_NAMES.length] + ` ${Math.floor(Math.random() * 99) + 1}`,
      badge: BADGES[i % BADGES.length],
      score: Math.floor(baseScore * Math.pow(0.92, i) + Math.random() * 10),
      category
    })
  }
  
  // Add user and sort
  entries.push(userEntry)
  entries.sort((a, b) => b.score - a.score)
  
  // Assign ranks
  entries.forEach((entry, index) => {
    entry.rank = index + 1
  })
  
  return entries
}

/**
 * Get user's rank in each category
 */
export function getUserRanks(): { streak: number; discoveries: number; time: number } {
  const streakLeaderboard = getLeaderboard('streak')
  const discoveriesLeaderboard = getLeaderboard('discoveries')
  const timeLeaderboard = getLeaderboard('time')
  
  return {
    streak: streakLeaderboard.find(e => e.id === 'current-user')?.rank || 0,
    discoveries: discoveriesLeaderboard.find(e => e.id === 'current-user')?.rank || 0,
    time: timeLeaderboard.find(e => e.id === 'current-user')?.rank || 0
  }
}

// ============================================================================
// Achievement Sharing
// ============================================================================

/**
 * Generate shareable achievement card data
 */
export function generateShareableAchievement(): ShareableAchievement {
  const streakData = loadStreakData()
  const stats = getStats()
  
  // Determine the most impressive stat
  let title = 'Space Explorer'
  let badge = '🚀'
  
  if (streakData.currentStreak >= 30) {
    title = 'Cosmic Legend'
    badge = '👑'
  } else if (streakData.currentStreak >= 7) {
    title = 'Streak Master'
    badge = '☄️'
  } else if (stats.uniquePagesVisited >= 25) {
    title = 'Universe Navigator'
    badge = '🌌'
  } else if (stats.uniquePagesVisited >= 10) {
    title = 'Star Collector'
    badge = '⭐'
  }
  
  const description = `${streakData.currentStreak} day streak | ${stats.uniquePagesVisited} discoveries`
  
  const shareText = `${badge} I'm a ${title} on HalfSpace!\n\n` +
    `🔥 ${streakData.currentStreak} day streak\n` +
    `🔭 ${stats.uniquePagesVisited} cosmic discoveries\n` +
    `📊 Top ${Math.max(1, Math.floor(100 - (stats.uniquePagesVisited / 85) * 100))}% of explorers\n\n` +
    `Join me exploring the universe!`
  
  return {
    title,
    description,
    badge,
    stats: {
      streak: streakData.currentStreak,
      discoveries: stats.uniquePagesVisited,
      daysActive: streakData.totalDaysExplored
    },
    shareUrl: typeof window !== 'undefined' ? window.location.origin : 'https://halfspace.app',
    shareText
  }
}

/**
 * Share achievement to clipboard or social
 */
export async function shareAchievement(): Promise<boolean> {
  const achievement = generateShareableAchievement()
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: `I'm a ${achievement.title} on HalfSpace!`,
        text: achievement.shareText,
        url: achievement.shareUrl
      })
      return true
    } catch {
      // User cancelled or error
    }
  }
  
  // Fallback to clipboard
  try {
    await navigator.clipboard.writeText(achievement.shareText + '\n' + achievement.shareUrl)
    return true
  } catch {
    return false
  }
}

// ============================================================================
// Visitor Echoes (Anonymous Traces)
// ============================================================================

export interface VisitorEcho {
  id: string
  x: number
  y: number
  timestamp: number
  action: 'click' | 'scroll' | 'hover'
}

/**
 * Record a visitor echo (anonymous trace)
 */
export function recordEcho(action: 'click' | 'scroll' | 'hover', x: number, y: number): void {
  const echoes = safeGetJSON<VisitorEcho[]>('halfspace_echoes', [])
  
  echoes.push({
    id: `echo-${Date.now()}`,
    x,
    y,
    timestamp: Date.now(),
    action
  })
  
  // Keep only last 100 echoes
  if (echoes.length > 100) {
    echoes.shift()
  }
  
  safeSetJSON('halfspace_echoes', echoes)
}

/**
 * Get recent visitor echoes
 */
export function getRecentEchoes(maxAge: number = 60000): VisitorEcho[] {
  const echoes = safeGetJSON<VisitorEcho[]>('halfspace_echoes', [])
  const now = Date.now()
  return echoes.filter(e => now - e.timestamp < maxAge)
}

// ============================================================================
// Presence Indicators
// ============================================================================

/**
 * Get simulated active explorers on current page
 */
export function getPageExplorers(pageId: string): number {
  // Simulate 0-5 other explorers on this page
  const hash = pageId.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return hash % 6
}
