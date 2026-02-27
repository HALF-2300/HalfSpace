/**
 * Adaptive Mission Control
 * Makes missions adapt to user skill and preferences without external APIs
 * 
 * Features:
 * 1. Skill score tracking (based on behavior)
 * 2. Adaptive difficulty ramping
 * 3. Personalized route stops (within mission templates)
 * 4. Guaranteed "mind-blow" moments
 */

import {
  createPersonalizationContext,
  selectWithConstraints,
  type PersonalizationContext,
  type SeedMode,
  type SelectionConstraints
} from './personalization'

import { safeGetJSON, safeSetJSON } from './storage'

// ============================================================================
// TYPES
// ============================================================================

export interface MissionTemplate {
  id: string
  name: string
  description: string
  category: 'exploration' | 'challenge' | 'story' | 'discovery'
  baselineStops: number // Number of stops
  estimatedDuration: number // Minutes
  difficulty: 'easy' | 'medium' | 'hard'
  stopPool: MissionStop[] // Pool of possible stops
  guaranteedStops: string[] // Must include these stop IDs
  mindBlowStop: string // Guaranteed mind-blow moment
}

export interface MissionStop {
  id: string
  title: string
  description: string
  type: 'concept' | 'quiz' | 'explore' | 'discover' | 'challenge'
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  duration: number // Seconds
  isMindBlow?: boolean
}

export interface AdaptiveMission {
  templateId: string
  name: string
  description: string
  stops: MissionStop[]
  adaptedDifficulty: 'easy' | 'medium' | 'hard'
  estimatedDuration: number
  personalizedFor: string
  seed: number
}

export interface SkillScore {
  overall: number // 0-100
  categories: Record<string, number> // Category-specific scores
  lastUpdated: string
}

export interface MissionResult {
  missionId: string
  templateId: string
  completedAt: string
  duration: number // Seconds
  stopsCompleted: number
  totalStops: number
  skipped: number
  averageTimePerStop: number
  difficulty: 'easy' | 'medium' | 'hard'
}

// ============================================================================
// STORAGE KEYS
// ============================================================================

const SKILL_SCORE_KEY = 'halfspace_skill_score'
const MISSION_HISTORY_KEY = 'halfspace_mission_history'

// ============================================================================
// MISSION TEMPLATES
// ============================================================================

/**
 * Pre-defined mission templates
 * Each template has a pool of stops that can be swapped out
 */
export const MISSION_TEMPLATES: MissionTemplate[] = [
  {
    id: 'black-hole-run',
    name: 'Black Hole Run',
    description: 'Explore the extreme physics of black holes',
    category: 'challenge',
    baselineStops: 7,
    estimatedDuration: 10,
    difficulty: 'medium',
    stopPool: [
      { id: 'bh-intro', title: 'What is a Black Hole?', description: 'Introduction to black holes', type: 'concept', category: 'objects', difficulty: 'easy', duration: 60 },
      { id: 'bh-eventhoriz', title: 'Event Horizon', description: 'The point of no return', type: 'concept', category: 'phenomena', difficulty: 'medium', duration: 90 },
      { id: 'bh-singularity', title: 'Singularity', description: 'Infinite density at the center', type: 'concept', category: 'phenomena', difficulty: 'hard', duration: 120 },
      { id: 'bh-hawking', title: 'Hawking Radiation', description: 'Black holes can evaporate', type: 'discover', category: 'phenomena', difficulty: 'hard', duration: 120, isMindBlow: true },
      { id: 'bh-spaghetti', title: 'Spaghettification', description: 'Stretched by tidal forces', type: 'explore', category: 'phenomena', difficulty: 'medium', duration: 90 },
      { id: 'bh-time', title: 'Time Dilation', description: 'Time slows near black holes', type: 'concept', category: 'phenomena', difficulty: 'hard', duration: 120 },
      { id: 'bh-types', title: 'Types of Black Holes', description: 'Stellar, supermassive, and more', type: 'concept', category: 'objects', difficulty: 'easy', duration: 60 },
      { id: 'bh-detection', title: 'Detecting Black Holes', description: 'How we find invisible objects', type: 'explore', category: 'missions', difficulty: 'medium', duration: 90 },
      { id: 'bh-merger', title: 'Black Hole Merger', description: 'When black holes collide', type: 'discover', category: 'phenomena', difficulty: 'medium', duration: 100, isMindBlow: true }
    ],
    guaranteedStops: ['bh-intro', 'bh-eventhoriz'],
    mindBlowStop: 'bh-hawking'
  },
  {
    id: 'planet-hunter',
    name: 'Planet Hunter',
    description: 'Discover exoplanets and learn detection methods',
    category: 'discovery',
    baselineStops: 8,
    estimatedDuration: 12,
    difficulty: 'easy',
    stopPool: [
      { id: 'exo-intro', title: 'What are Exoplanets?', description: 'Planets beyond our solar system', type: 'concept', category: 'objects', difficulty: 'easy', duration: 60 },
      { id: 'exo-transit', title: 'Transit Method', description: 'Detecting planets by dimming stars', type: 'concept', category: 'missions', difficulty: 'medium', duration: 90 },
      { id: 'exo-radial', title: 'Radial Velocity', description: 'Wobbling stars reveal planets', type: 'concept', category: 'missions', difficulty: 'medium', duration: 90 },
      { id: 'exo-direct', title: 'Direct Imaging', description: 'Actually seeing exoplanets', type: 'explore', category: 'missions', difficulty: 'hard', duration: 120 },
      { id: 'exo-habitable', title: 'Habitable Zone', description: 'Where life could exist', type: 'concept', category: 'concepts', difficulty: 'easy', duration: 70 },
      { id: 'exo-types', title: 'Types of Exoplanets', description: 'Hot Jupiters, super-Earths, and more', type: 'concept', category: 'objects', difficulty: 'easy', duration: 80 },
      { id: 'exo-kepler', title: 'Kepler Mission', description: 'The most successful planet hunter', type: 'explore', category: 'missions', difficulty: 'medium', duration: 100 },
      { id: 'exo-proxima', title: 'Proxima Centauri b', description: 'Our closest exoplanet neighbor', type: 'discover', category: 'objects', difficulty: 'medium', duration: 90, isMindBlow: true },
      { id: 'exo-life', title: 'Signs of Life', description: 'Biosignatures we look for', type: 'discover', category: 'concepts', difficulty: 'hard', duration: 120, isMindBlow: true }
    ],
    guaranteedStops: ['exo-intro', 'exo-transit'],
    mindBlowStop: 'exo-proxima'
  },
  {
    id: 'cosmic-time',
    name: 'Cosmic Time Machine',
    description: 'Journey through the history of the universe',
    category: 'story',
    baselineStops: 10,
    estimatedDuration: 15,
    difficulty: 'easy',
    stopPool: [
      { id: 'time-bigbang', title: 'The Big Bang', description: 'The beginning of everything', type: 'concept', category: 'concepts', difficulty: 'easy', duration: 80 },
      { id: 'time-inflation', title: 'Cosmic Inflation', description: 'The universe expands exponentially', type: 'concept', category: 'phenomena', difficulty: 'hard', duration: 120 },
      { id: 'time-firststars', title: 'First Stars', description: 'Light pierces the darkness', type: 'concept', category: 'objects', difficulty: 'medium', duration: 90 },
      { id: 'time-galaxies', title: 'Galaxy Formation', description: 'Islands of stars emerge', type: 'concept', category: 'objects', difficulty: 'medium', duration: 90 },
      { id: 'time-milkyway', title: 'Birth of Milky Way', description: 'Our home galaxy forms', type: 'concept', category: 'objects', difficulty: 'easy', duration: 70 },
      { id: 'time-sun', title: 'Sun Ignites', description: 'Our star is born', type: 'concept', category: 'objects', difficulty: 'easy', duration: 60 },
      { id: 'time-earth', title: 'Earth Forms', description: 'A special planet emerges', type: 'concept', category: 'objects', difficulty: 'easy', duration: 70 },
      { id: 'time-life', title: 'First Life', description: 'Biology begins', type: 'discover', category: 'concepts', difficulty: 'medium', duration: 100, isMindBlow: true },
      { id: 'time-humans', title: 'Rise of Humanity', description: 'Consciousness awakens', type: 'concept', category: 'concepts', difficulty: 'easy', duration: 80 },
      { id: 'time-future', title: 'Far Future', description: 'What lies ahead', type: 'discover', category: 'concepts', difficulty: 'medium', duration: 110, isMindBlow: true }
    ],
    guaranteedStops: ['time-bigbang', 'time-sun', 'time-earth'],
    mindBlowStop: 'time-life'
  },
  {
    id: 'quantum-weird',
    name: 'Quantum Weirdness',
    description: 'Explore the bizarre world of quantum mechanics',
    category: 'challenge',
    baselineStops: 6,
    estimatedDuration: 8,
    difficulty: 'hard',
    stopPool: [
      { id: 'q-intro', title: 'What is Quantum?', description: 'Introduction to the quantum world', type: 'concept', category: 'concepts', difficulty: 'medium', duration: 90 },
      { id: 'q-superpos', title: 'Superposition', description: 'Being in two states at once', type: 'concept', category: 'phenomena', difficulty: 'hard', duration: 120 },
      { id: 'q-entangle', title: 'Entanglement', description: 'Spooky action at a distance', type: 'concept', category: 'phenomena', difficulty: 'hard', duration: 130, isMindBlow: true },
      { id: 'q-uncertainty', title: 'Uncertainty Principle', description: 'Limits of knowing', type: 'concept', category: 'concepts', difficulty: 'hard', duration: 120 },
      { id: 'q-tunneling', title: 'Quantum Tunneling', description: 'Passing through walls', type: 'concept', category: 'phenomena', difficulty: 'hard', duration: 110 },
      { id: 'q-measurement', title: 'Measurement Problem', description: 'Observing changes reality', type: 'challenge', category: 'concepts', difficulty: 'hard', duration: 140, isMindBlow: true },
      { id: 'q-compute', title: 'Quantum Computing', description: 'Computing with qubits', type: 'explore', category: 'concepts', difficulty: 'medium', duration: 100 }
    ],
    guaranteedStops: ['q-intro', 'q-superpos'],
    mindBlowStop: 'q-entangle'
  }
]

// ============================================================================
// SKILL SCORE MANAGEMENT
// ============================================================================

/**
 * Get user's current skill score
 */
export function getSkillScore(): SkillScore {
  const defaults: SkillScore = {
    overall: 50, // Start at medium
    categories: {},
    lastUpdated: new Date().toISOString()
  }
  
  return safeGetJSON<SkillScore>(SKILL_SCORE_KEY, defaults)
}

/**
 * Update skill score based on mission result
 */
export function updateSkillScore(result: MissionResult): SkillScore {
  const score = getSkillScore()
  
  // Calculate performance score (0-100)
  const completionRate = result.stopsCompleted / result.totalStops
  const speedBonus = result.averageTimePerStop < 60 ? 10 : 0 // Fast completion bonus
  const skipPenalty = result.skipped * 5 // Penalty for skipping
  
  let performance = (completionRate * 70) + speedBonus - skipPenalty
  
  // Difficulty multiplier
  const difficultyMultiplier = {
    easy: 0.8,
    medium: 1.0,
    hard: 1.3
  }[result.difficulty]
  
  performance *= difficultyMultiplier
  performance = Math.max(0, Math.min(100, performance))
  
  // Update overall score (exponential moving average)
  const alpha = 0.2
  score.overall = score.overall * (1 - alpha) + performance * alpha
  
  score.lastUpdated = new Date().toISOString()
  
  safeSetJSON(SKILL_SCORE_KEY, score)
  return score
}

/**
 * Determine appropriate difficulty for user
 */
export function getRecommendedDifficulty(): 'easy' | 'medium' | 'hard' {
  const score = getSkillScore()
  
  if (score.overall < 40) return 'easy'
  if (score.overall < 70) return 'medium'
  return 'hard'
}

// ============================================================================
// MISSION HISTORY
// ============================================================================

/**
 * Record mission completion
 */
export function recordMissionCompletion(result: MissionResult): void {
  const history = safeGetJSON<MissionResult[]>(MISSION_HISTORY_KEY, [])
  history.push(result)
  
  // Keep last 50 missions
  if (history.length > 50) {
    history.shift()
  }
  
  safeSetJSON(MISSION_HISTORY_KEY, history)
  
  // Update skill score
  updateSkillScore(result)
}

/**
 * Get mission history
 */
export function getMissionHistory(): MissionResult[] {
  return safeGetJSON<MissionResult[]>(MISSION_HISTORY_KEY, [])
}

/**
 * Check if user has completed a mission
 */
export function hasCompletedMission(templateId: string): boolean {
  const history = getMissionHistory()
  return history.some(m => m.templateId === templateId)
}

// ============================================================================
// ADAPTIVE MISSION GENERATION
// ============================================================================

/**
 * Generate adaptive mission from template
 */
export function generateAdaptiveMission(
  templateId: string,
  mode: SeedMode = 'session',
  options?: { shareCode?: string }
): AdaptiveMission | null {
  const template = MISSION_TEMPLATES.find(t => t.id === templateId)
  if (!template) return null
  
  const ctx = createPersonalizationContext(mode, options)
  const skillScore = getSkillScore()
  
  // Determine adapted difficulty
  const adaptedDifficulty = adaptDifficulty(template.difficulty, skillScore.overall)
  
  // Select stops from pool
  const stops = selectMissionStops(template, adaptedDifficulty, ctx)
  
  return {
    templateId: template.id,
    name: template.name,
    description: template.description,
    stops,
    adaptedDifficulty,
    estimatedDuration: Math.ceil(stops.reduce((sum, s) => sum + s.duration, 0) / 60),
    personalizedFor: ctx.signature.userId.slice(0, 8),
    seed: ctx.signature.cosmicSeed
  }
}

/**
 * Adapt mission difficulty based on skill
 */
function adaptDifficulty(
  baseDifficulty: 'easy' | 'medium' | 'hard',
  skillLevel: number
): 'easy' | 'medium' | 'hard' {
  const difficultyMap = {
    easy: 0,
    medium: 1,
    hard: 2
  }
  
  let level = difficultyMap[baseDifficulty]
  
  // Adjust based on skill
  if (skillLevel > 70 && level < 2) level++
  if (skillLevel < 40 && level > 0) level--
  
  const reversMap: Record<number, 'easy' | 'medium' | 'hard'> = {
    0: 'easy',
    1: 'medium',
    2: 'hard'
  }
  
  return reversMap[level]
}

/**
 * Select mission stops with constraints
 */
function selectMissionStops(
  template: MissionTemplate,
  adaptedDifficulty: 'easy' | 'medium' | 'hard',
  ctx: PersonalizationContext
): MissionStop[] {
  const { stopPool, guaranteedStops, mindBlowStop, baselineStops } = template
  
  // Start with guaranteed stops
  const selected: MissionStop[] = []
  
  for (const stopId of guaranteedStops) {
    const stop = stopPool.find(s => s.id === stopId)
    if (stop) selected.push(stop)
  }
  
  // Ensure mind-blow stop is included
  const mindBlow = stopPool.find(s => s.id === mindBlowStop)
  if (mindBlow && !selected.includes(mindBlow)) {
    selected.push(mindBlow)
  }
  
  // Calculate how many more stops needed
  const remaining = baselineStops - selected.length
  
  if (remaining > 0) {
    // Filter available stops (not already selected)
    const available = stopPool.filter(s => !selected.find(sel => sel.id === s.id))
    
    // Filter by adapted difficulty
    const appropriateStops = available.filter(s => {
      if (adaptedDifficulty === 'easy') return s.difficulty === 'easy' || s.difficulty === 'medium'
      if (adaptedDifficulty === 'medium') return true // All difficulties
      return s.difficulty === 'medium' || s.difficulty === 'hard' // Hard missions
    })
    
    // Select additional stops with constraints
    const constraints: SelectionConstraints = {
      allowedPool: appropriateStops.map(s => s.id),
      minDiversity: Math.min(2, remaining), // At least 2 categories if possible
      maxRepeats: 2
    }
    
    const selection = selectWithConstraints(
      appropriateStops,
      remaining,
      constraints,
      ctx
    )
    
    selected.push(...selection.items)
  }
  
  // Ensure mind-blow stop is not last (place in middle-to-end range)
  const mindBlowIndex = selected.findIndex(s => s.id === mindBlowStop)
  if (mindBlowIndex !== -1) {
    const mindBlowItem = selected[mindBlowIndex]
    selected.splice(mindBlowIndex, 1)
    
    // Place 60-80% through the mission
    const targetIndex = Math.floor(selected.length * 0.7)
    selected.splice(targetIndex, 0, mindBlowItem)
  }
  
  return selected
}

/**
 * Get available missions for user (filtered by skill)
 */
export function getAvailableMissions(): MissionTemplate[] {
  const recommendedDiff = getRecommendedDifficulty()
  
  // Show all missions but sort by recommended difficulty
  return MISSION_TEMPLATES.sort((a, b) => {
    const aMatch = a.difficulty === recommendedDiff ? 0 : 1
    const bMatch = b.difficulty === recommendedDiff ? 0 : 1
    return aMatch - bMatch
  })
}

/**
 * Get mission progress stats
 */
export function getMissionStats(): {
  totalCompleted: number
  averageScore: number
  favoriteDifficulty: 'easy' | 'medium' | 'hard'
  totalTime: number
} {
  const history = getMissionHistory()
  
  if (history.length === 0) {
    return {
      totalCompleted: 0,
      averageScore: 0,
      favoriteDifficulty: 'medium',
      totalTime: 0
    }
  }
  
  const totalTime = history.reduce((sum, m) => sum + m.duration, 0)
  
  // Count by difficulty
  const diffCount = { easy: 0, medium: 0, hard: 0 }
  for (const mission of history) {
    diffCount[mission.difficulty]++
  }
  
  const favoriteDifficulty = Object.entries(diffCount)
    .sort((a, b) => b[1] - a[1])[0][0] as 'easy' | 'medium' | 'hard'
  
  return {
    totalCompleted: history.length,
    averageScore: getSkillScore().overall,
    favoriteDifficulty,
    totalTime
  }
}
