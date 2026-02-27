/**
 * Cosmic Streak System
 * 
 * Duolingo-style daily engagement tracking for HalfSpace.
 * Tracks consecutive days of exploration with milestones, badges, and celebrations.
 */

import { safeGetJSON, safeSetJSON } from './storage'

// ============================================================================
// Types
// ============================================================================

export interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisitDate: string // ISO date string (YYYY-MM-DD)
  totalDaysExplored: number
  streakFreezes: number
  usedFreezeToday: boolean
  milestonesUnlocked: string[]
  joinDate: string
  todayCompleted: boolean
}

export interface StreakMilestone {
  id: string
  days: number
  title: string
  title_ar: string
  badge: string
  description: string
  description_ar: string
  celebration: 'small' | 'medium' | 'large' | 'epic'
  reward?: {
    type: 'freeze' | 'badge' | 'title'
    value: string | number
  }
}

export interface StreakStatus {
  data: StreakData
  isNewDay: boolean
  streakAtRisk: boolean
  justBrokeStreak: boolean
  newMilestone: StreakMilestone | null
  daysUntilNextMilestone: number
  nextMilestone: StreakMilestone | null
}

// ============================================================================
// Constants
// ============================================================================

const STORAGE_KEY = 'halfspace_cosmic_streak'

export const STREAK_MILESTONES: StreakMilestone[] = [
  {
    id: 'first-step',
    days: 1,
    title: 'First Step',
    title_ar: 'الخطوة الأولى',
    badge: '🚀',
    description: 'You began your cosmic journey',
    description_ar: 'بدأت رحلتك الكونية',
    celebration: 'small'
  },
  {
    id: 'lunar-explorer',
    days: 7,
    title: 'Lunar Explorer',
    title_ar: 'مستكشف القمر',
    badge: '🌙',
    description: 'One week of daily exploration',
    description_ar: 'أسبوع من الاستكشاف اليومي',
    celebration: 'medium',
    reward: { type: 'freeze', value: 1 }
  },
  {
    id: 'mars-pioneer',
    days: 14,
    title: 'Mars Pioneer',
    title_ar: 'رائد المريخ',
    badge: '🔴',
    description: 'Two weeks of cosmic discovery',
    description_ar: 'أسبوعان من الاكتشاف الكوني',
    celebration: 'medium'
  },
  {
    id: 'asteroid-navigator',
    days: 21,
    title: 'Asteroid Navigator',
    title_ar: 'ملاح الكويكبات',
    badge: '☄️',
    description: 'Three weeks exploring the cosmos',
    description_ar: 'ثلاثة أسابيع في استكشاف الكون',
    celebration: 'medium',
    reward: { type: 'freeze', value: 1 }
  },
  {
    id: 'solar-voyager',
    days: 30,
    title: 'Solar Voyager',
    title_ar: 'مسافر شمسي',
    badge: '☀️',
    description: 'One month of daily wonder',
    description_ar: 'شهر من الدهشة اليومية',
    celebration: 'large',
    reward: { type: 'freeze', value: 2 }
  },
  {
    id: 'nebula-drifter',
    days: 50,
    title: 'Nebula Drifter',
    title_ar: 'طائف السديم',
    badge: '🌫️',
    description: '50 days adrift in the cosmos',
    description_ar: '50 يوماً طائفاً في الكون',
    celebration: 'large'
  },
  {
    id: 'stellar-guardian',
    days: 75,
    title: 'Stellar Guardian',
    title_ar: 'حارس النجوم',
    badge: '⭐',
    description: '75 days of stellar dedication',
    description_ar: '75 يوماً من التفاني النجمي',
    celebration: 'large',
    reward: { type: 'freeze', value: 2 }
  },
  {
    id: 'galactic-voyager',
    days: 100,
    title: 'Galactic Voyager',
    title_ar: 'مسافر مجري',
    badge: '🌌',
    description: '100 days crossing the galaxy',
    description_ar: '100 يوم عابراً المجرة',
    celebration: 'epic',
    reward: { type: 'freeze', value: 3 }
  },
  {
    id: 'cosmic-legend',
    days: 150,
    title: 'Cosmic Legend',
    title_ar: 'أسطورة كونية',
    badge: '🏆',
    description: '150 days of legendary exploration',
    description_ar: '150 يوماً من الاستكشاف الأسطوري',
    celebration: 'epic'
  },
  {
    id: 'universe-master',
    days: 200,
    title: 'Universe Master',
    title_ar: 'سيد الكون',
    badge: '👑',
    description: '200 days mastering the universe',
    description_ar: '200 يوم متقناً الكون',
    celebration: 'epic',
    reward: { type: 'freeze', value: 5 }
  },
  {
    id: 'eternal-explorer',
    days: 365,
    title: 'Eternal Explorer',
    title_ar: 'المستكشف الأبدي',
    badge: '♾️',
    description: 'One full year of daily cosmic exploration',
    description_ar: 'سنة كاملة من الاستكشاف الكوني اليومي',
    celebration: 'epic',
    reward: { type: 'freeze', value: 10 }
  },
  {
    id: 'cosmic-citizen',
    days: 500,
    title: 'Cosmic Citizen',
    title_ar: 'مواطن كوني',
    badge: '🌟',
    description: '500 days - You ARE the cosmos',
    description_ar: '500 يوم - أنت الكون',
    celebration: 'epic',
    reward: { type: 'freeze', value: 15 }
  }
]

// ============================================================================
// Helper Functions
// ============================================================================

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0]
}

function getYesterdayDate(): string {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return yesterday.toISOString().split('T')[0]
}

function createDefaultStreakData(): StreakData {
  const today = getTodayDate()
  return {
    currentStreak: 0,
    longestStreak: 0,
    lastVisitDate: '',
    totalDaysExplored: 0,
    streakFreezes: 1, // Start with one free freeze
    usedFreezeToday: false,
    milestonesUnlocked: [],
    joinDate: today,
    todayCompleted: false
  }
}

// ============================================================================
// Core Functions
// ============================================================================

/**
 * Load streak data from localStorage
 */
export function loadStreakData(): StreakData {
  return safeGetJSON<StreakData>(STORAGE_KEY, createDefaultStreakData())
}

/**
 * Save streak data to localStorage
 */
export function saveStreakData(data: StreakData): void {
  safeSetJSON(STORAGE_KEY, data)
}

/**
 * Check and update streak status on page visit
 * Returns the current status with any new milestones
 */
export function checkStreak(): StreakStatus {
  const data = loadStreakData()
  const today = getTodayDate()
  const yesterday = getYesterdayDate()
  
  let isNewDay = false
  let streakAtRisk = false
  let justBrokeStreak = false
  const newMilestone: StreakMilestone | null = null
  
  // First time visitor
  if (!data.lastVisitDate) {
    data.lastVisitDate = today
    data.joinDate = today
    saveStreakData(data)
    return {
      data,
      isNewDay: true,
      streakAtRisk: false,
      justBrokeStreak: false,
      newMilestone: null,
      daysUntilNextMilestone: 1,
      nextMilestone: STREAK_MILESTONES[0]
    }
  }
  
  // Already visited today
  if (data.lastVisitDate === today) {
    const next = getNextMilestone(data.currentStreak)
    return {
      data,
      isNewDay: false,
      streakAtRisk: false,
      justBrokeStreak: false,
      newMilestone: null,
      daysUntilNextMilestone: next ? next.days - data.currentStreak : 0,
      nextMilestone: next
    }
  }
  
  // It's a new day!
  isNewDay = true
  data.usedFreezeToday = false // Reset freeze usage
  
  // Visited yesterday - streak continues!
  if (data.lastVisitDate === yesterday) {
    // Will be extended when markTodayComplete is called
    streakAtRisk = !data.todayCompleted
  } else {
    // Missed a day - check if we can use a freeze
    const daysMissed = getDaysBetween(data.lastVisitDate, today)
    
    if (daysMissed === 2 && data.streakFreezes > 0) {
      // Missed exactly one day - can use freeze
      streakAtRisk = true
    } else {
      // Streak is broken
      if (data.currentStreak > 0) {
        justBrokeStreak = true
      }
      data.currentStreak = 0
    }
  }
  
  data.lastVisitDate = today
  data.todayCompleted = false
  saveStreakData(data)
  
  const next = getNextMilestone(data.currentStreak)
  
  return {
    data,
    isNewDay,
    streakAtRisk,
    justBrokeStreak,
    newMilestone,
    daysUntilNextMilestone: next ? next.days - data.currentStreak : 0,
    nextMilestone: next
  }
}

/**
 * Mark today as completed (user did their daily discovery)
 */
export function markTodayComplete(): StreakStatus {
  const data = loadStreakData()
  const today = getTodayDate()
  
  if (data.todayCompleted) {
    // Already completed today
    const next = getNextMilestone(data.currentStreak)
    return {
      data,
      isNewDay: false,
      streakAtRisk: false,
      justBrokeStreak: false,
      newMilestone: null,
      daysUntilNextMilestone: next ? next.days - data.currentStreak : 0,
      nextMilestone: next
    }
  }
  
  // Extend the streak
  data.currentStreak += 1
  data.totalDaysExplored += 1
  data.todayCompleted = true
  data.lastVisitDate = today
  
  // Update longest streak
  if (data.currentStreak > data.longestStreak) {
    data.longestStreak = data.currentStreak
  }
  
  // Check for new milestone
  let newMilestone: StreakMilestone | null = null
  const milestone = getMilestoneForDay(data.currentStreak)
  
  if (milestone && !data.milestonesUnlocked.includes(milestone.id)) {
    newMilestone = milestone
    data.milestonesUnlocked.push(milestone.id)
    
    // Apply rewards
    if (milestone.reward?.type === 'freeze') {
      data.streakFreezes += milestone.reward.value as number
    }
  }
  
  saveStreakData(data)
  
  const next = getNextMilestone(data.currentStreak)
  
  return {
    data,
    isNewDay: true,
    streakAtRisk: false,
    justBrokeStreak: false,
    newMilestone,
    daysUntilNextMilestone: next ? next.days - data.currentStreak : 0,
    nextMilestone: next
  }
}

/**
 * Apply a streak freeze to protect the streak
 */
export function applyStreakFreeze(): boolean {
  const data = loadStreakData()
  
  if (data.streakFreezes <= 0 || data.usedFreezeToday) {
    return false
  }
  
  data.streakFreezes -= 1
  data.usedFreezeToday = true
  saveStreakData(data)
  
  return true
}

/**
 * Get the milestone for a specific day count
 */
export function getMilestoneForDay(days: number): StreakMilestone | null {
  return STREAK_MILESTONES.find(m => m.days === days) || null
}

/**
 * Get the next milestone to achieve
 */
export function getNextMilestone(currentDays: number): StreakMilestone | null {
  return STREAK_MILESTONES.find(m => m.days > currentDays) || null
}

/**
 * Get all unlocked milestones
 */
export function getUnlockedMilestones(data: StreakData): StreakMilestone[] {
  return STREAK_MILESTONES.filter(m => data.milestonesUnlocked.includes(m.id))
}

/**
 * Get the current title based on highest milestone
 */
export function getCurrentTitle(data: StreakData): StreakMilestone | null {
  const unlocked = getUnlockedMilestones(data)
  return unlocked.length > 0 ? unlocked[unlocked.length - 1] : null
}

/**
 * Calculate days between two date strings
 */
function getDaysBetween(date1: string, date2: string): number {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  const diffTime = Math.abs(d2.getTime() - d1.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * Get streak percentage to next milestone
 */
export function getProgressToNextMilestone(data: StreakData): number {
  const next = getNextMilestone(data.currentStreak)
  if (!next) return 100
  
  const prev = STREAK_MILESTONES
    .filter(m => m.days < next.days)
    .pop()
  
  const startDays = prev ? prev.days : 0
  const totalRange = next.days - startDays
  const progress = data.currentStreak - startDays
  
  return Math.min(100, Math.round((progress / totalRange) * 100))
}

/**
 * Reset streak data (for testing)
 */
export function resetStreakData(): void {
  safeSetJSON(STORAGE_KEY, createDefaultStreakData())
}
