/**
 * Daily Discovery System
 * 
 * Provides a new mind-blowing fact each day, creating a reason to return daily.
 * Uses deterministic seeding so everyone sees the same fact on the same day.
 */

import { safeGetJSON, safeSetJSON } from './storage'
import mindBlowingData from '@/data/mindBlowingSpace.json'

// ============================================================================
// Types
// ============================================================================

export interface DailyFact {
  id: string
  hook: string
  hook_ar: string
  explanation: string
  explanation_ar: string
  icon: string
  impact: string
  categoryId: string
  categoryName: string
  categoryIcon: string
}

export interface DailyDiscoveryData {
  lastViewedDate: string
  viewedFactIds: string[]
  totalFactsViewed: number
  favoriteFactIds: string[]
  streakFactIds: string[] // Facts seen during current streak
}

export interface DailyJump {
  id: string
  title: string
  url: string
  icon: string
  description: string
  category: string
}

// ============================================================================
// Constants
// ============================================================================

const STORAGE_KEY = 'halfspace_daily_discovery'
const JUMP_STORAGE_KEY = 'halfspace_daily_jump'

// ============================================================================
// Helper Functions
// ============================================================================

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0]
}

function createDefaultData(): DailyDiscoveryData {
  return {
    lastViewedDate: '',
    viewedFactIds: [],
    totalFactsViewed: 0,
    favoriteFactIds: [],
    streakFactIds: []
  }
}

/**
 * Deterministic random number generator based on seed
 * Same seed always produces same sequence
 */
function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
}

/**
 * Get a numeric seed from a date string
 */
function dateToSeed(dateStr: string): number {
  let hash = 0
  for (let i = 0; i < dateStr.length; i++) {
    const char = dateStr.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

// ============================================================================
// Core Functions
// ============================================================================

/**
 * Get all facts flattened from categories
 */
function getAllFacts(): DailyFact[] {
  const facts: DailyFact[] = []
  
  for (const category of mindBlowingData.categories) {
    for (const fact of category.facts) {
      facts.push({
        id: fact.id,
        hook: fact.hook,
        hook_ar: fact.hook_ar,
        explanation: fact.explanation,
        explanation_ar: fact.explanation_ar,
        icon: fact.icon,
        impact: fact.impact,
        categoryId: category.id,
        categoryName: category.name,
        categoryIcon: category.icon
      })
    }
  }
  
  return facts
}

/**
 * Get today's daily fact
 * Uses deterministic selection so everyone sees the same fact on the same day
 */
export function getDailyFact(date?: string): DailyFact {
  const targetDate = date || getTodayDate()
  const allFacts = getAllFacts()
  
  // Use date as seed for deterministic selection
  const seed = dateToSeed(targetDate)
  const random = seededRandom(seed)
  
  // Select fact based on seeded random
  const index = Math.floor(random() * allFacts.length)
  return allFacts[index]
}

/**
 * Get the fact for a specific number of days ago
 */
export function getHistoricalFact(daysAgo: number): DailyFact {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return getDailyFact(date.toISOString().split('T')[0])
}

/**
 * Load daily discovery data
 */
export function loadDailyData(): DailyDiscoveryData {
  return safeGetJSON<DailyDiscoveryData>(STORAGE_KEY, createDefaultData())
}

/**
 * Save daily discovery data
 */
export function saveDailyData(data: DailyDiscoveryData): void {
  safeSetJSON(STORAGE_KEY, data)
}

/**
 * Mark today's fact as viewed
 */
export function markFactViewed(factId: string): DailyDiscoveryData {
  const data = loadDailyData()
  const today = getTodayDate()
  
  if (data.lastViewedDate !== today) {
    data.lastViewedDate = today
  }
  
  if (!data.viewedFactIds.includes(factId)) {
    data.viewedFactIds.push(factId)
    data.totalFactsViewed += 1
  }
  
  saveDailyData(data)
  return data
}

/**
 * Toggle favorite status for a fact
 */
export function toggleFavorite(factId: string): boolean {
  const data = loadDailyData()
  
  const index = data.favoriteFactIds.indexOf(factId)
  if (index > -1) {
    data.favoriteFactIds.splice(index, 1)
    saveDailyData(data)
    return false
  } else {
    data.favoriteFactIds.push(factId)
    saveDailyData(data)
    return true
  }
}

/**
 * Check if a fact is favorited
 */
export function isFavorite(factId: string): boolean {
  const data = loadDailyData()
  return data.favoriteFactIds.includes(factId)
}

/**
 * Get all favorite facts
 */
export function getFavorites(): DailyFact[] {
  const data = loadDailyData()
  const allFacts = getAllFacts()
  return allFacts.filter(f => data.favoriteFactIds.includes(f.id))
}

/**
 * Get stats about discovery progress
 */
export function getDiscoveryStats(): {
  totalFacts: number
  viewedFacts: number
  favoriteFacts: number
  percentComplete: number
} {
  const data = loadDailyData()
  const allFacts = getAllFacts()
  
  return {
    totalFacts: allFacts.length,
    viewedFacts: data.viewedFactIds.length,
    favoriteFacts: data.favoriteFactIds.length,
    percentComplete: Math.round((data.viewedFactIds.length / allFacts.length) * 100)
  }
}

/**
 * Get upcoming facts for the week (for preview)
 */
export function getWeekPreview(): Array<{ date: string; fact: DailyFact; isToday: boolean }> {
  const today = new Date()
  const preview: Array<{ date: string; fact: DailyFact; isToday: boolean }> = []
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() + i)
    const dateStr = date.toISOString().split('T')[0]
    
    preview.push({
      date: dateStr,
      fact: getDailyFact(dateStr),
      isToday: i === 0
    })
  }
  
  return preview
}

/**
 * Get a random "Wait, What?" fact (for surprise moments)
 */
export function getRandomFact(): DailyFact {
  const allFacts = getAllFacts()
  const index = Math.floor(Math.random() * allFacts.length)
  return allFacts[index]
}

/**
 * Get facts by category
 */
export function getFactsByCategory(categoryId: string): DailyFact[] {
  const allFacts = getAllFacts()
  return allFacts.filter(f => f.categoryId === categoryId)
}

/**
 * Get all categories
 */
export function getCategories(): Array<{ id: string; name: string; icon: string; count: number }> {
  return mindBlowingData.categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    icon: cat.icon,
    count: cat.facts.length
  }))
}

// ============================================================================
// Daily Jump (Random Destination)
// ============================================================================

import contentIndex from '@/data/contentIndex.json'

/**
 * Get today's daily jump destination
 * Changes at midnight, same for all users
 */
export function getDailyJump(date?: string): DailyJump {
  const targetDate = date || getTodayDate()
  const seed = dateToSeed(targetDate + '_jump') // Different seed than facts
  const random = seededRandom(seed)
  
  const index = Math.floor(random() * contentIndex.items.length)
  const item = contentIndex.items[index]
  
  return {
    id: item.id,
    title: item.title,
    url: item.url,
    icon: item.icon,
    description: item.description,
    category: item.category
  }
}

/**
 * Check if user has visited today's jump
 */
export function hasVisitedDailyJump(): boolean {
  const today = getTodayDate()
  const data = safeGetJSON<{ date: string; visited: boolean }>(JUMP_STORAGE_KEY, { date: '', visited: false })
  return data.date === today && data.visited
}

/**
 * Mark daily jump as visited
 */
export function markDailyJumpVisited(): void {
  const today = getTodayDate()
  safeSetJSON(JUMP_STORAGE_KEY, { date: today, visited: true })
}
