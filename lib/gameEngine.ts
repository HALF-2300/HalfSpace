/**
 * Space Game Engine
 * Turns space exploration into an addictive game
 * 
 * Features:
 * - XP and Level system
 * - Daily challenges
 * - Quests and missions
 * - Collectibles (space badges, artifacts)
 * - Streaks (daily login)
 * - Leaderboards
 * - Unlockables
 */

import { safeGetJSON, safeSetJSON } from './storage'
import { daySeedUTC, pickOne, pickN } from './seed'

// ============================================================================
// TYPES
// ============================================================================

export interface PlayerStats {
  userId: string
  username: string
  level: number
  xp: number
  xpToNextLevel: number
  rank: PlayerRank
  
  // Totals
  totalPagesVisited: number
  totalMissionsCompleted: number
  totalTimeSpent: number // seconds
  totalXPEarned: number
  
  // Streaks
  currentStreak: number // consecutive days
  longestStreak: number
  lastLoginDate: string
  
  // Collections
  badges: string[]
  artifacts: string[]
  discoveries: string[]
  
  // Progress
  joinedAt: string
  lastActiveAt: string
}

export type PlayerRank = 
  | 'Stargazer'          // Level 1-4
  | 'Cosmic Cadet'       // Level 5-9
  | 'Space Explorer'     // Level 10-19
  | 'Stellar Navigator'  // Level 20-29
  | 'Galactic Pioneer'   // Level 30-49
  | 'Universe Master'    // Level 50-99
  | 'Cosmic Legend'      // Level 100+

export interface Quest {
  id: string
  title: string
  description: string
  category: 'exploration' | 'learning' | 'creative' | 'social' | 'challenge'
  difficulty: 'easy' | 'medium' | 'hard'
  xpReward: number
  requirements: QuestRequirement[]
  status: 'locked' | 'available' | 'in_progress' | 'completed'
  progress: number // 0-100
  unlockLevel?: number
  icon: string
}

export interface QuestRequirement {
  type: 'visit' | 'complete_mission' | 'collect' | 'create' | 'time' | 'streak'
  target: string | number
  current: number
}

export interface DailyChallenge {
  id: string
  date: string // YYYY-MM-DD
  title: string
  description: string
  tasks: ChallengeTask[]
  xpReward: number
  bonusReward?: string // Badge or artifact
  completed: boolean
  icon: string
}

export interface ChallengeTask {
  id: string
  description: string
  type: 'visit' | 'explore' | 'discover' | 'create' | 'share'
  target: number
  current: number
  completed: boolean
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  unlockedAt?: string
}

export interface Artifact {
  id: string
  name: string
  description: string
  icon: string
  type: 'telescope' | 'spacecraft' | 'discovery' | 'relic'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  discoveredAt?: string
  source: string // How it was obtained
}

export interface LeaderboardEntry {
  userId: string
  username: string
  level: number
  xp: number
  rank: PlayerRank
  badges: number
  artifacts: number
}

// ============================================================================
// CONSTANTS
// ============================================================================

const STORAGE_KEY_STATS = 'halfspace_player_stats'
const STORAGE_KEY_QUESTS = 'halfspace_quests'
const STORAGE_KEY_DAILY = 'halfspace_daily_challenge'
const STORAGE_KEY_BADGES = 'halfspace_badges'
const STORAGE_KEY_ARTIFACTS = 'halfspace_artifacts'

// XP required per level (exponential growth)
const XP_PER_LEVEL = (level: number) => Math.floor(100 * Math.pow(1.15, level - 1))

// XP rewards
const XP_REWARDS = {
  PAGE_VISIT: 10,
  PAGE_COMPLETE: 25,
  MISSION_EASY: 100,
  MISSION_MEDIUM: 200,
  MISSION_HARD: 400,
  QUEST_EASY: 150,
  QUEST_MEDIUM: 300,
  QUEST_HARD: 600,
  DAILY_CHALLENGE: 500,
  STREAK_BONUS: 50, // per day
  FIRST_TIME_BONUS: 100,
  DISCOVERY: 75,
  SHARE: 50,
  CREATIVE: 30
}

// ============================================================================
// PLAYER STATS
// ============================================================================

/**
 * Get or create player stats
 */
export function getPlayerStats(): PlayerStats {
  const existing = safeGetJSON<PlayerStats | null>(STORAGE_KEY_STATS, null)
  
  if (existing) {
    // Update streak
    return updateStreak(existing)
  }
  
  // Create new player
  const newPlayer: PlayerStats = {
    userId: generatePlayerId(),
    username: `Explorer${Math.floor(Math.random() * 9999)}`,
    level: 1,
    xp: 0,
    xpToNextLevel: XP_PER_LEVEL(1),
    rank: 'Stargazer',
    totalPagesVisited: 0,
    totalMissionsCompleted: 0,
    totalTimeSpent: 0,
    totalXPEarned: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastLoginDate: new Date().toISOString().split('T')[0],
    badges: [],
    artifacts: [],
    discoveries: [],
    joinedAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString()
  }
  
  savePlayerStats(newPlayer)
  return newPlayer
}

/**
 * Save player stats
 */
export function savePlayerStats(stats: PlayerStats): void {
  stats.lastActiveAt = new Date().toISOString()
  safeSetJSON(STORAGE_KEY_STATS, stats)
}

/**
 * Update login streak
 */
function updateStreak(stats: PlayerStats): PlayerStats {
  const today = new Date().toISOString().split('T')[0]
  const lastLogin = stats.lastLoginDate
  
  if (lastLogin === today) {
    return stats // Already logged in today
  }
  
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
  
  if (lastLogin === yesterday) {
    // Consecutive day!
    stats.currentStreak++
    if (stats.currentStreak > stats.longestStreak) {
      stats.longestStreak = stats.currentStreak
    }
    
    // Award streak bonus
    awardXP(stats.currentStreak * XP_REWARDS.STREAK_BONUS, 'Daily Login Streak!')
  } else {
    // Streak broken
    stats.currentStreak = 1
  }
  
  stats.lastLoginDate = today
  savePlayerStats(stats)
  
  return stats
}

// ============================================================================
// XP & LEVELING
// ============================================================================

/**
 * Award XP and check for level up
 */
export function awardXP(amount: number, reason: string): { 
  leveledUp: boolean
  newLevel?: number
  xpGained: number
  totalXP: number
} {
  const stats = getPlayerStats()
  
  stats.xp += amount
  stats.totalXPEarned += amount
  
  let leveledUp = false
  let newLevel = stats.level
  
  // Check for level up
  while (stats.xp >= stats.xpToNextLevel) {
    stats.xp -= stats.xpToNextLevel
    stats.level++
    newLevel = stats.level
    stats.xpToNextLevel = XP_PER_LEVEL(stats.level)
    stats.rank = calculateRank(stats.level)
    leveledUp = true
    
    // Unlock new quests
    unlockQuestsForLevel(stats.level)
  }
  
  savePlayerStats(stats)
  
  return {
    leveledUp,
    newLevel: leveledUp ? newLevel : undefined,
    xpGained: amount,
    totalXP: stats.totalXPEarned
  }
}

/**
 * Calculate player rank based on level
 */
function calculateRank(level: number): PlayerRank {
  if (level >= 100) return 'Cosmic Legend'
  if (level >= 50) return 'Universe Master'
  if (level >= 30) return 'Galactic Pioneer'
  if (level >= 20) return 'Stellar Navigator'
  if (level >= 10) return 'Space Explorer'
  if (level >= 5) return 'Cosmic Cadet'
  return 'Stargazer'
}

// ============================================================================
// QUESTS
// ============================================================================

const ALL_QUESTS: Omit<Quest, 'status' | 'progress'>[] = [
  {
    id: 'first-steps',
    title: 'First Steps',
    description: 'Visit 5 different pages',
    category: 'exploration',
    difficulty: 'easy',
    xpReward: 150,
    requirements: [{ type: 'visit', target: 5, current: 0 }],
    icon: '👣'
  },
  {
    id: 'curious-mind',
    title: 'Curious Mind',
    description: 'Visit 25 different pages',
    category: 'exploration',
    difficulty: 'medium',
    xpReward: 300,
    requirements: [{ type: 'visit', target: 25, current: 0 }],
    unlockLevel: 5,
    icon: '🔍'
  },
  {
    id: 'mission-rookie',
    title: 'Mission Rookie',
    description: 'Complete your first mission',
    category: 'challenge',
    difficulty: 'easy',
    xpReward: 200,
    requirements: [{ type: 'complete_mission', target: 1, current: 0 }],
    icon: '🚀'
  },
  {
    id: 'mission-ace',
    title: 'Mission Ace',
    description: 'Complete 10 missions',
    category: 'challenge',
    difficulty: 'hard',
    xpReward: 600,
    requirements: [{ type: 'complete_mission', target: 10, current: 0 }],
    unlockLevel: 10,
    icon: '⭐'
  },
  {
    id: 'time-traveler',
    title: 'Time Traveler',
    description: 'Spend 1 hour exploring',
    category: 'exploration',
    difficulty: 'easy',
    xpReward: 150,
    requirements: [{ type: 'time', target: 3600, current: 0 }],
    icon: '⏰'
  },
  {
    id: 'week-warrior',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    category: 'challenge',
    difficulty: 'medium',
    xpReward: 500,
    requirements: [{ type: 'streak', target: 7, current: 0 }],
    icon: '🔥'
  },
  {
    id: 'collector',
    title: 'Cosmic Collector',
    description: 'Collect 5 artifacts',
    category: 'exploration',
    difficulty: 'medium',
    xpReward: 300,
    requirements: [{ type: 'collect', target: 5, current: 0 }],
    unlockLevel: 8,
    icon: '💎'
  },
  {
    id: 'creator',
    title: 'Cosmic Creator',
    description: 'Create 5 nebulas or music compositions',
    category: 'creative',
    difficulty: 'easy',
    xpReward: 200,
    requirements: [{ type: 'create', target: 5, current: 0 }],
    icon: '🎨'
  }
]

/**
 * Get active quests
 */
export function getActiveQuests(): Quest[] {
  const stats = getPlayerStats()
  const questsData = safeGetJSON<Record<string, any>>(STORAGE_KEY_QUESTS, {})
  
  return ALL_QUESTS.map(quest => {
    const saved = questsData[quest.id]
    const isLocked = quest.unlockLevel && stats.level < quest.unlockLevel
    
    return {
      ...quest,
      status: isLocked ? 'locked' : (saved?.status || 'available'),
      progress: saved?.progress || 0
    }
  })
}

/**
 * Update quest progress
 */
export function updateQuestProgress(questId: string, progress: number): Quest | null {
  const quests = getActiveQuests()
  const quest = quests.find(q => q.id === questId)
  
  if (!quest || quest.status === 'locked' || quest.status === 'completed') {
    return null
  }
  
  quest.progress = progress
  
  // Check if completed
  if (progress >= 100) {
    quest.status = 'completed'
    awardXP(quest.xpReward, `Quest Complete: ${quest.title}`)
    
    // Award badge for hard quests
    if (quest.difficulty === 'hard') {
      awardBadge({
        id: `quest-${questId}`,
        name: quest.title,
        description: quest.description,
        icon: quest.icon,
        rarity: 'rare'
      })
    }
  }
  
  // Save
  const questsData = safeGetJSON<Record<string, any>>(STORAGE_KEY_QUESTS, {})
  questsData[questId] = { status: quest.status, progress: quest.progress }
  safeSetJSON(STORAGE_KEY_QUESTS, questsData)
  
  return quest
}

/**
 * Unlock quests for level
 */
function unlockQuestsForLevel(level: number): void {
  const quests = getActiveQuests()
  let unlocked = false
  
  for (const quest of quests) {
    if (quest.unlockLevel === level && quest.status === 'locked') {
      updateQuestProgress(quest.id, 0) // Sets to available
      unlocked = true
    }
  }
  
  if (unlocked) {
    // Show notification (handled by UI)
  }
}

// ============================================================================
// DAILY CHALLENGES
// ============================================================================

/**
 * Generate daily challenge for today
 */
export function getDailyChallenge(): DailyChallenge {
  const today = new Date().toISOString().split('T')[0]
  const cached = safeGetJSON<DailyChallenge | null>(STORAGE_KEY_DAILY, null)
  
  // Return cached if same day
  if (cached && cached.date === today) {
    return cached
  }
  
  // Generate new challenge
  const seed = daySeedUTC()
  const challenges = [
    {
      title: 'Planetary Tour',
      description: 'Visit 3 planet pages',
      tasks: [
        { id: 'task1', description: 'Visit a planet page', type: 'visit', target: 3, current: 0, completed: false }
      ],
      xpReward: 300,
      icon: '🪐'
    },
    {
      title: 'Mission Master',
      description: 'Complete 2 missions',
      tasks: [
        { id: 'task1', description: 'Complete missions', type: 'explore', target: 2, current: 0, completed: false }
      ],
      xpReward: 400,
      bonusReward: 'Golden Comet Badge',
      icon: '🚀'
    },
    {
      title: 'Knowledge Hunter',
      description: 'Read 5 fact cards',
      tasks: [
        { id: 'task1', description: 'Read facts', type: 'discover', target: 5, current: 0, completed: false }
      ],
      xpReward: 250,
      icon: '📚'
    },
    {
      title: 'Creative Cosmos',
      description: 'Create 2 nebulas or music pieces',
      tasks: [
        { id: 'task1', description: 'Create something', type: 'create', target: 2, current: 0, completed: false }
      ],
      xpReward: 350,
      bonusReward: 'Artist Badge',
      icon: '🎨'
    },
    {
      title: 'Social Star',
      description: 'Share 1 experience',
      tasks: [
        { id: 'task1', description: 'Share with others', type: 'share', target: 1, current: 0, completed: false }
      ],
      xpReward: 200,
      icon: '💫'
    }
  ]
  
  const selected = pickOne(challenges, seed)
  
  const dailyChallenge: DailyChallenge = {
    id: `daily-${today}`,
    date: today,
    title: selected.title,
    description: selected.description,
    tasks: selected.tasks as ChallengeTask[],
    xpReward: selected.xpReward,
    bonusReward: selected.bonusReward,
    completed: false,
    icon: selected.icon
  }
  
  safeSetJSON(STORAGE_KEY_DAILY, dailyChallenge)
  return dailyChallenge
}

/**
 * Update daily challenge progress
 */
export function updateDailyChallengeProgress(taskId: string, progress: number): DailyChallenge {
  const challenge = getDailyChallenge()
  
  const task = challenge.tasks.find(t => t.id === taskId)
  if (task) {
    task.current = progress
    task.completed = task.current >= task.target
  }
  
  // Check if all tasks completed
  challenge.completed = challenge.tasks.every(t => t.completed)
  
  if (challenge.completed && !challenge.tasks[0].completed) {
    // Just completed!
    awardXP(challenge.xpReward, `Daily Challenge: ${challenge.title}`)
    
    if (challenge.bonusReward) {
      // Award bonus badge
      awardBadge({
        id: `daily-${challenge.date}`,
        name: challenge.bonusReward,
        description: `Earned from daily challenge on ${challenge.date}`,
        icon: challenge.icon,
        rarity: 'rare'
      })
    }
  }
  
  safeSetJSON(STORAGE_KEY_DAILY, challenge)
  return challenge
}

// ============================================================================
// BADGES
// ============================================================================

const PREDEFINED_BADGES: Badge[] = [
  { id: 'first-visit', name: 'First Contact', description: 'Made your first visit', icon: '🌟', rarity: 'common' },
  { id: 'explorer-10', name: 'Space Enthusiast', description: 'Visited 10 pages', icon: '⭐', rarity: 'common' },
  { id: 'explorer-50', name: 'Cosmic Explorer', description: 'Visited 50 pages', icon: '💫', rarity: 'rare' },
  { id: 'explorer-100', name: 'Universe Master', description: 'Visited 100 pages', icon: '👑', rarity: 'epic' },
  { id: 'mission-1', name: 'Mission Rookie', description: 'First mission complete', icon: '🚀', rarity: 'common' },
  { id: 'mission-10', name: 'Mission Ace', description: '10 missions complete', icon: '🏆', rarity: 'rare' },
  { id: 'streak-7', name: 'Week Warrior', description: '7-day streak', icon: '🔥', rarity: 'rare' },
  { id: 'streak-30', name: 'Dedication Legend', description: '30-day streak', icon: '💎', rarity: 'legendary' },
  { id: 'level-10', name: 'Double Digits', description: 'Reached level 10', icon: '🔟', rarity: 'rare' },
  { id: 'level-50', name: 'Half Century', description: 'Reached level 50', icon: '5️⃣0️⃣', rarity: 'epic' },
  { id: 'level-100', name: 'Centurion', description: 'Reached level 100', icon: '💯', rarity: 'legendary' }
]

/**
 * Award badge to player
 */
export function awardBadge(badge: Badge): boolean {
  const stats = getPlayerStats()
  
  if (stats.badges.includes(badge.id)) {
    return false // Already has it
  }
  
  const fullBadge: Badge = {
    ...badge,
    unlockedAt: new Date().toISOString()
  }
  
  stats.badges.push(badge.id)
  savePlayerStats(stats)
  
  // Save badge details
  const badges = safeGetJSON<Record<string, Badge>>(STORAGE_KEY_BADGES, {})
  badges[badge.id] = fullBadge
  safeSetJSON(STORAGE_KEY_BADGES, badges)
  
  return true
}

/**
 * Get all earned badges
 */
export function getEarnedBadges(): Badge[] {
  const stats = getPlayerStats()
  const badgesData = safeGetJSON<Record<string, Badge>>(STORAGE_KEY_BADGES, {})
  
  return stats.badges
    .map(id => badgesData[id])
    .filter(Boolean)
    .sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime())
}

/**
 * Check and award automatic badges
 */
export function checkAutoBadges(): void {
  const stats = getPlayerStats()
  
  // Visit milestones
  if (stats.totalPagesVisited >= 10) awardBadge(PREDEFINED_BADGES[1])
  if (stats.totalPagesVisited >= 50) awardBadge(PREDEFINED_BADGES[2])
  if (stats.totalPagesVisited >= 100) awardBadge(PREDEFINED_BADGES[3])
  
  // Mission milestones
  if (stats.totalMissionsCompleted >= 1) awardBadge(PREDEFINED_BADGES[4])
  if (stats.totalMissionsCompleted >= 10) awardBadge(PREDEFINED_BADGES[5])
  
  // Streak milestones
  if (stats.currentStreak >= 7) awardBadge(PREDEFINED_BADGES[6])
  if (stats.currentStreak >= 30) awardBadge(PREDEFINED_BADGES[7])
  
  // Level milestones
  if (stats.level >= 10) awardBadge(PREDEFINED_BADGES[8])
  if (stats.level >= 50) awardBadge(PREDEFINED_BADGES[9])
  if (stats.level >= 100) awardBadge(PREDEFINED_BADGES[10])
}

// ============================================================================
// ARTIFACTS (Collectibles)
// ============================================================================

/**
 * Award random artifact
 */
export function awardRandomArtifact(): Artifact | null {
  const artifacts: Omit<Artifact, 'discoveredAt' | 'source'>[] = [
    { id: 'voyager-golden-record', name: 'Voyager Golden Record', description: 'A message to the cosmos', icon: '💿', type: 'relic', rarity: 'legendary' },
    { id: 'hubble-mirror', name: 'Hubble Mirror Shard', description: 'Fragment of the iconic telescope', icon: '🔭', type: 'telescope', rarity: 'epic' },
    { id: 'moon-rock', name: 'Moon Rock Sample', description: 'From Apollo 11 mission', icon: '🌙', type: 'relic', rarity: 'rare' },
    { id: 'mars-soil', name: 'Martian Soil', description: 'Red dust from Mars', icon: '🔴', type: 'discovery', rarity: 'rare' },
    { id: 'cosmic-dust', name: 'Cosmic Dust', description: 'Stardust from nebula', icon: '✨', type: 'discovery', rarity: 'common' },
    { id: 'asteroid-fragment', name: 'Asteroid Fragment', description: 'Ancient space rock', icon: '☄️', type: 'relic', rarity: 'common' },
    { id: 'jwst-lens', name: 'JWST Infrared Lens', description: 'See the invisible universe', icon: '🔬', type: 'telescope', rarity: 'legendary' },
    { id: 'sputnik-panel', name: 'Sputnik Solar Panel', description: 'First satellite piece', icon: '📡', type: 'spacecraft', rarity: 'epic' },
    { id: 'saturn-ring-ice', name: 'Saturn Ring Ice', description: 'Frozen particle from rings', icon: '💎', type: 'discovery', rarity: 'rare' }
  ]
  
  const stats = getPlayerStats()
  const chance = Math.random()
  
  // Rarity chances
  if (chance < 0.01) { // 1% legendary
    const legendary = artifacts.filter(a => a.rarity === 'legendary' && !stats.artifacts.includes(a.id))
    if (legendary.length === 0) return null
    return awardArtifact(pickOne(legendary, Date.now()))
  } else if (chance < 0.10) { // 9% epic
    const epic = artifacts.filter(a => a.rarity === 'epic' && !stats.artifacts.includes(a.id))
    if (epic.length === 0) return null
    return awardArtifact(pickOne(epic, Date.now()))
  } else if (chance < 0.35) { // 25% rare
    const rare = artifacts.filter(a => a.rarity === 'rare' && !stats.artifacts.includes(a.id))
    if (rare.length === 0) return null
    return awardArtifact(pickOne(rare, Date.now()))
  } else { // 65% common
    const common = artifacts.filter(a => a.rarity === 'common' && !stats.artifacts.includes(a.id))
    if (common.length === 0) return null
    return awardArtifact(pickOne(common, Date.now()))
  }
}

/**
 * Award specific artifact
 */
function awardArtifact(artifact: Omit<Artifact, 'discoveredAt' | 'source'>): Artifact {
  const stats = getPlayerStats()
  const fullArtifact: Artifact = {
    ...artifact,
    discoveredAt: new Date().toISOString(),
    source: 'Random Discovery'
  }
  
  stats.artifacts.push(artifact.id)
  stats.discoveries.push(artifact.id)
  savePlayerStats(stats)
  
  // Save artifact details
  const artifacts = safeGetJSON<Record<string, Artifact>>(STORAGE_KEY_ARTIFACTS, {})
  artifacts[artifact.id] = fullArtifact
  safeSetJSON(STORAGE_KEY_ARTIFACTS, artifacts)
  
  return fullArtifact
}

/**
 * Get collected artifacts
 */
export function getCollectedArtifacts(): Artifact[] {
  const stats = getPlayerStats()
  const artifactsData = safeGetJSON<Record<string, Artifact>>(STORAGE_KEY_ARTIFACTS, {})
  
  return stats.artifacts
    .map(id => artifactsData[id])
    .filter(Boolean)
    .sort((a, b) => new Date(b.discoveredAt!).getTime() - new Date(a.discoveredAt!).getTime())
}

// ============================================================================
// LEADERBOARD
// ============================================================================

/**
 * Get leaderboard (simulated for now)
 */
export function getLeaderboard(): LeaderboardEntry[] {
  const myStats = getPlayerStats()
  
  // In production, fetch from backend
  // For now, return player's own stats
  return [{
    userId: myStats.userId,
    username: myStats.username,
    level: myStats.level,
    xp: myStats.totalXPEarned,
    rank: myStats.rank,
    badges: myStats.badges.length,
    artifacts: myStats.artifacts.length
  }]
}

// ============================================================================
// ACTIONS (Award XP)
// ============================================================================

/**
 * Track page visit (awards XP)
 */
export function trackGamePageVisit(pageId: string, isFirstTime: boolean): void {
  const stats = getPlayerStats()
  stats.totalPagesVisited++
  
  const xp = isFirstTime ? XP_REWARDS.PAGE_VISIT + XP_REWARDS.FIRST_TIME_BONUS : XP_REWARDS.PAGE_VISIT
  const result = awardXP(xp, isFirstTime ? 'First Time Visit!' : 'Page Visit')
  
  // Check for random artifact drop (5% chance)
  if (Math.random() < 0.05) {
    awardRandomArtifact()
  }
  
  checkAutoBadges()
}

/**
 * Track mission completion (awards XP)
 */
export function trackGameMissionComplete(difficulty: 'easy' | 'medium' | 'hard'): void {
  const stats = getPlayerStats()
  stats.totalMissionsCompleted++
  
  const xpMap = {
    easy: XP_REWARDS.MISSION_EASY,
    medium: XP_REWARDS.MISSION_MEDIUM,
    hard: XP_REWARDS.MISSION_HARD
  }
  
  awardXP(xpMap[difficulty], `Mission Complete (${difficulty})`)
  
  // Chance for artifact (10% easy, 20% medium, 40% hard)
  const chance = difficulty === 'easy' ? 0.1 : difficulty === 'medium' ? 0.2 : 0.4
  if (Math.random() < chance) {
    awardRandomArtifact()
  }
  
  checkAutoBadges()
}

/**
 * Track creative action
 */
export function trackGameCreative(type: 'nebula' | 'music'): void {
  awardXP(XP_REWARDS.CREATIVE, `Created ${type}`)
}

/**
 * Track share action
 */
export function trackGameShare(): void {
  awardXP(XP_REWARDS.SHARE, 'Shared Experience')
}

// ============================================================================
// UTILITIES
// ============================================================================

function generatePlayerId(): string {
  return `player-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

/**
 * Get player's next milestone
 */
export function getNextMilestone(): {
  type: 'level' | 'rank' | 'badge' | 'artifact'
  description: string
  progress: number
  xpNeeded?: number
} | null {
  const stats = getPlayerStats()
  
  // Next level
  return {
    type: 'level',
    description: `Reach Level ${stats.level + 1}`,
    progress: (stats.xp / stats.xpToNextLevel) * 100,
    xpNeeded: stats.xpToNextLevel - stats.xp
  }
}
