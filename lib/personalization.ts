/**
 * Personalization Engine - Makes every user's journey unique but deterministic
 * 
 * The Uniqueness Stack:
 * 1. Cosmic Signature (identity seed)
 * 2. Preference Vector (behavior tracking)
 * 3. Constraint Router (bounded variability)
 * 
 * Goal: same data, different feel per user, always shareable
 */

import { mulberry32, pickN, pickOne, shuffle, daySeedUTC } from './seed'
import { safeGetJSON, safeSetJSON } from './storage'

// ============================================================================
// TYPES
// ============================================================================

/**
 * User's unique cosmic identity
 */
export interface CosmicSignature {
  userId: string // UUID v4
  cosmicSeed: number // Primary seed for this user
  createdAt: string
  visualTone: VisualTone
}

/**
 * Visual preferences derived from cosmic seed
 */
export interface VisualTone {
  nebulaDensity: number // 0-1
  starfieldDrift: number // 0-1
  grainIntensity: number // 0-1
  glowStrength: number // 0-1
  dominantHue: number // 0-360 (hue in HSL)
  secondaryHue: number // 0-360
}

/**
 * Tracks user's behavioral preferences (lightweight)
 */
export interface PreferenceVector {
  // Category weights (0-1, sum to 1)
  categoryWeights: Record<string, number>
  
  // Preferred difficulty level
  difficultyPreference: 'beginner' | 'intermediate' | 'advanced' | 'mixed'
  
  // Content type preferences
  typeWeights: {
    missions: number
    phenomena: number
    objects: number
    concepts: number
  }
  
  // Behavior signals
  averageDwellTime: number // seconds
  depthPreference: number // 0-1, where 1 = deep, 0 = breadth
  explainLevelUsage: Record<string, number> // '12' | 'college' | 'expert'
  
  // Micro-module launches
  microModuleLaunches: Record<string, number>
  
  // Last updated
  lastUpdated: string
}

/**
 * Seed modes for different types of randomness
 */
export type SeedMode = 
  | 'session' // Changes per session
  | 'daily'   // Changes daily
  | 'cosmic'  // Fixed to user's cosmic signature
  | 'share'   // Fixed from share link

/**
 * Context for generating personalized content
 */
export interface PersonalizationContext {
  signature: CosmicSignature
  preferences: PreferenceVector
  mode: SeedMode
  shareCode?: string // If in share mode
  timestamp?: number // Optional override
}

/**
 * Constraints for bounded variability
 */
export interface SelectionConstraints {
  allowedPool: string[] // IDs to choose from
  minDiversity?: number // Min unique categories
  maxRepeats?: number // Max same category in sequence
  guaranteedTypes?: string[] // Must include at least one of these types
  excludeIds?: string[] // Never pick these
}

/**
 * Result of personalized selection
 */
export interface PersonalizedSelection<T = any> {
  items: T[]
  seed: number
  mode: SeedMode
  reproducible: boolean
}

// ============================================================================
// CONSTANTS
// ============================================================================

const SIGNATURE_KEY = 'halfspace_cosmic_signature'
const PREFERENCES_KEY = 'halfspace_preference_vector'

// Seed variants for different modes
const SEED_MODES = {
  SESSION: 0x1a2b3c4d,
  DAILY: 0x5e6f7a8b,
  COSMIC: 0x9c0d1e2f,
  SHARE: 0x3f4a5b6c
} as const

// Default type weights
const DEFAULT_TYPE_WEIGHTS = {
  missions: 0.25,
  phenomena: 0.25,
  objects: 0.25,
  concepts: 0.25
}

// Category diversity settings
const MIN_CATEGORY_DIVERSITY = 3
const MAX_CATEGORY_REPEATS = 2

// ============================================================================
// SEED ENGINE - Deterministic Uniqueness
// ============================================================================

/**
 * Generate seed based on mode and context
 */
export function generateSeed(ctx: PersonalizationContext): number {
  const { signature, mode, shareCode, timestamp } = ctx
  
  switch (mode) {
    case 'cosmic':
      // Always same for this user
      return signature.cosmicSeed ^ SEED_MODES.COSMIC
      
    case 'session':
      // Changes per session (use performance.now as session variant)
      if (typeof window !== 'undefined') {
        const sessionVariant = Math.floor(performance.now() / 1000)
        return (signature.cosmicSeed ^ sessionVariant ^ SEED_MODES.SESSION) >>> 0
      }
      return signature.cosmicSeed ^ SEED_MODES.SESSION
      
    case 'daily':
      // Changes daily but consistent across users on same day
      const daySeed = daySeedUTC(timestamp ? new Date(timestamp) : undefined)
      return (signature.cosmicSeed ^ daySeed ^ SEED_MODES.DAILY) >>> 0
      
    case 'share':
      // Fixed from share code
      if (!shareCode) {
        throw new Error('Share mode requires shareCode')
      }
      return hashShareCode(shareCode)
      
    default:
      return signature.cosmicSeed
  }
}

/**
 * Hash a share code to a deterministic seed
 */
export function hashShareCode(code: string): number {
  let hash = 2166136261
  for (let i = 0; i < code.length; i++) {
    hash ^= code.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

/**
 * Generate a share code from seed
 */
export function createShareCode(seed: number): string {
  // Base36 encoding for compact URLs
  const encoded = seed.toString(36).toUpperCase()
  return encoded.padStart(7, '0')
}

// ============================================================================
// COSMIC SIGNATURE - Identity Layer
// ============================================================================

/**
 * Generate or retrieve user's cosmic signature
 */
export function getCosmicSignature(): CosmicSignature {
  // Check if signature exists
  const existing = safeGetJSON<CosmicSignature | null>(SIGNATURE_KEY, null)
  if (existing && existing.userId && existing.cosmicSeed) {
    return existing
  }
  
  // Generate new signature
  const signature = generateCosmicSignature()
  safeSetJSON(SIGNATURE_KEY, signature)
  return signature
}

/**
 * Generate a new cosmic signature
 */
function generateCosmicSignature(): CosmicSignature {
  // Generate UUID v4
  const userId = generateUUID()
  
  // Generate cosmic seed from UUID
  const cosmicSeed = hashString(userId)
  
  // Generate visual tone from seed
  const visualTone = generateVisualTone(cosmicSeed)
  
  return {
    userId,
    cosmicSeed,
    createdAt: new Date().toISOString(),
    visualTone
  }
}

/**
 * Generate UUID v4 (client-side)
 */
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  
  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

/**
 * Hash string to number
 */
function hashString(str: string): number {
  let hash = 2166136261
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

/**
 * Generate visual tone from cosmic seed
 */
function generateVisualTone(seed: number): VisualTone {
  const rand = mulberry32(seed)
  
  return {
    nebulaDensity: 0.3 + rand() * 0.5, // 0.3-0.8
    starfieldDrift: 0.2 + rand() * 0.6, // 0.2-0.8
    grainIntensity: 0.1 + rand() * 0.3, // 0.1-0.4
    glowStrength: 0.4 + rand() * 0.4, // 0.4-0.8
    dominantHue: Math.floor(rand() * 360), // 0-360
    secondaryHue: Math.floor(rand() * 360) // 0-360
  }
}

/**
 * Reset cosmic signature (for testing only)
 */
export function resetCosmicSignature(): CosmicSignature {
  const signature = generateCosmicSignature()
  safeSetJSON(SIGNATURE_KEY, signature)
  return signature
}

// ============================================================================
// PREFERENCE VECTOR - Behavior Layer
// ============================================================================

/**
 * Get user's preference vector
 */
export function getPreferenceVector(): PreferenceVector {
  const defaults: PreferenceVector = {
    categoryWeights: {},
    difficultyPreference: 'mixed',
    typeWeights: { ...DEFAULT_TYPE_WEIGHTS },
    averageDwellTime: 0,
    depthPreference: 0.5,
    explainLevelUsage: {},
    microModuleLaunches: {},
    lastUpdated: new Date().toISOString()
  }
  
  return safeGetJSON<PreferenceVector>(PREFERENCES_KEY, defaults)
}

/**
 * Update preference vector with new signal
 */
export function updatePreferenceVector(signal: Partial<PreferenceVector>): PreferenceVector {
  const current = getPreferenceVector()
  const updated: PreferenceVector = {
    ...current,
    ...signal,
    lastUpdated: new Date().toISOString()
  }
  
  safeSetJSON(PREFERENCES_KEY, updated)
  return updated
}

/**
 * Record category interaction
 */
export function recordCategoryInteraction(category: string, dwellTime: number): void {
  const prefs = getPreferenceVector()
  
  // Update category weight (exponential moving average)
  const alpha = 0.1
  const currentWeight = prefs.categoryWeights[category] || 0
  prefs.categoryWeights[category] = currentWeight * (1 - alpha) + alpha
  
  // Normalize weights
  const total = Object.values(prefs.categoryWeights).reduce((sum, w) => sum + w, 0)
  if (total > 0) {
    for (const key in prefs.categoryWeights) {
      prefs.categoryWeights[key] /= total
    }
  }
  
  // Update average dwell time
  const count = Object.keys(prefs.categoryWeights).length
  prefs.averageDwellTime = (prefs.averageDwellTime * (count - 1) + dwellTime) / count
  
  updatePreferenceVector(prefs)
}

/**
 * Record difficulty preference
 */
export function recordDifficultyPreference(difficulty: 'beginner' | 'intermediate' | 'advanced'): void {
  const prefs = getPreferenceVector()
  prefs.difficultyPreference = difficulty
  updatePreferenceVector(prefs)
}

/**
 * Record explain level usage
 */
export function recordExplainLevel(level: string): void {
  const prefs = getPreferenceVector()
  prefs.explainLevelUsage[level] = (prefs.explainLevelUsage[level] || 0) + 1
  updatePreferenceVector(prefs)
}

/**
 * Record micro-module launch
 */
export function recordMicroModuleLaunch(moduleId: string): void {
  const prefs = getPreferenceVector()
  prefs.microModuleLaunches[moduleId] = (prefs.microModuleLaunches[moduleId] || 0) + 1
  updatePreferenceVector(prefs)
}

/**
 * Calculate exploration depth preference (0-1)
 * Based on breadth vs depth of navigation
 */
export function calculateDepthPreference(uniquePages: number, totalVisits: number): number {
  if (totalVisits === 0) return 0.5
  const ratio = totalVisits / uniquePages
  // High ratio = revisiting pages = depth preference
  return Math.min(1, ratio / 3)
}

// ============================================================================
// CONSTRAINT ROUTER - Bounded Variability
// ============================================================================

/**
 * Select items from pool with constraints
 */
export function selectWithConstraints<T extends { id: string; category?: string; type?: string }>(
  pool: T[],
  count: number,
  constraints: SelectionConstraints,
  ctx: PersonalizationContext
): PersonalizedSelection<T> {
  const seed = generateSeed(ctx)
  const rand = mulberry32(seed)
  
  // Filter by allowed pool
  const candidates = pool.filter(item => 
    constraints.allowedPool.includes(item.id) &&
    !constraints.excludeIds?.includes(item.id)
  )
  
  if (candidates.length === 0) {
    return { items: [], seed, mode: ctx.mode, reproducible: true }
  }
  
  // Apply preference-based scoring
  const scored = candidates.map(item => ({
    item,
    score: calculateItemScore(item, ctx.preferences, rand())
  }))
  
  // Sort by score
  scored.sort((a, b) => b.score - a.score)
  
  // Select top items while maintaining constraints
  const selected: T[] = []
  const categoryCount: Record<string, number> = {}
  const typesSeen = new Set<string>()
  
  for (const { item } of scored) {
    if (selected.length >= count) break
    
    // Check category repeats
    if (item.category) {
      const catCount = categoryCount[item.category] || 0
      if (constraints.maxRepeats && catCount >= constraints.maxRepeats) {
        continue
      }
      categoryCount[item.category] = catCount + 1
    }
    
    // Track types
    if (item.type) {
      typesSeen.add(item.type)
    }
    
    selected.push(item)
  }
  
  // Ensure guaranteed types are present
  if (constraints.guaranteedTypes && constraints.guaranteedTypes.length > 0) {
    const missingTypes = constraints.guaranteedTypes.filter(t => !typesSeen.has(t))
    
    if (missingTypes.length > 0) {
      // Replace lowest scored items with items of missing types
      for (const type of missingTypes) {
        const typeItem = candidates.find(c => 
          c.type === type && 
          !selected.find(s => s.id === c.id)
        )
        
        if (typeItem && selected.length > 0) {
          selected[selected.length - 1] = typeItem
        }
      }
    }
  }
  
  // Check diversity constraint
  if (constraints.minDiversity) {
    const categories = new Set(selected.map(s => s.category).filter(Boolean))
    if (categories.size < constraints.minDiversity) {
      // Need more diversity - re-select with diversity enforcement
      return selectWithDiversityEnforcement(
        pool,
        count,
        constraints,
        ctx,
        seed
      )
    }
  }
  
  return {
    items: selected,
    seed,
    mode: ctx.mode,
    reproducible: true
  }
}

/**
 * Calculate item score based on preferences and randomness
 */
function calculateItemScore<T extends { category?: string; type?: string }>(
  item: T,
  preferences: PreferenceVector,
  randomFactor: number
): number {
  let score = 0
  
  // Category preference (0-10)
  if (item.category) {
    const categoryWeight = preferences.categoryWeights[item.category] || 0
    score += categoryWeight * 10
  }
  
  // Type preference (0-10)
  if (item.type) {
    const typeWeight = preferences.typeWeights[item.type as keyof typeof preferences.typeWeights] || 0.25
    score += typeWeight * 10
  }
  
  // Random factor for variety (0-5)
  score += randomFactor * 5
  
  return score
}

/**
 * Select with diversity enforcement (fallback)
 */
function selectWithDiversityEnforcement<T extends { id: string; category?: string }>(
  pool: T[],
  count: number,
  constraints: SelectionConstraints,
  ctx: PersonalizationContext,
  seed: number
): PersonalizedSelection<T> {
  const rand = mulberry32(seed + 1) // Use variant seed
  
  const candidates = pool.filter(item => 
    constraints.allowedPool.includes(item.id) &&
    !constraints.excludeIds?.includes(item.id)
  )
  
  // Group by category
  const byCategory: Record<string, T[]> = {}
  for (const item of candidates) {
    const cat = item.category || 'uncategorized'
    if (!byCategory[cat]) byCategory[cat] = []
    byCategory[cat].push(item)
  }
  
  // Pick from different categories in round-robin
  const categories = Object.keys(byCategory)
  const selected: T[] = []
  let categoryIndex = 0
  
  while (selected.length < count && selected.length < candidates.length) {
    const cat = categories[categoryIndex % categories.length]
    const available = byCategory[cat].filter(item => 
      !selected.find(s => s.id === item.id)
    )
    
    if (available.length > 0) {
      const index = Math.floor(rand() * available.length)
      selected.push(available[index])
    }
    
    categoryIndex++
    
    // Safety: break if we've cycled through all categories
    if (categoryIndex > categories.length * count) break
  }
  
  return {
    items: selected,
    seed,
    mode: ctx.mode,
    reproducible: true
  }
}

/**
 * Pick N items deterministically with preference weighting
 */
export function pickNPersonalized<T extends { id: string; category?: string }>(
  items: T[],
  count: number,
  ctx: PersonalizationContext
): PersonalizedSelection<T> {
  const seed = generateSeed(ctx)
  const scored = items.map(item => ({
    item,
    score: calculateItemScore(item, ctx.preferences, mulberry32(seed)())
  }))
  
  scored.sort((a, b) => b.score - a.score)
  
  return {
    items: scored.slice(0, count).map(s => s.item),
    seed,
    mode: ctx.mode,
    reproducible: true
  }
}

/**
 * Shuffle items deterministically with preference influence
 */
export function shufflePersonalized<T extends { id: string; category?: string }>(
  items: T[],
  ctx: PersonalizationContext
): PersonalizedSelection<T> {
  const seed = generateSeed(ctx)
  
  // Weight shuffle by preferences (items with higher scores bubble up)
  const scored = items.map(item => ({
    item,
    score: calculateItemScore(item, ctx.preferences, mulberry32(seed)())
  }))
  
  // Sort by score but add random jitter
  const rand = mulberry32(seed + 1)
  scored.sort((a, b) => {
    const scoreDiff = b.score - a.score
    const jitter = (rand() - 0.5) * 3 // Random jitter ±1.5
    return scoreDiff + jitter
  })
  
  return {
    items: scored.map(s => s.item),
    seed,
    mode: ctx.mode,
    reproducible: true
  }
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Create personalization context from current state
 */
export function createPersonalizationContext(
  mode: SeedMode,
  options?: { shareCode?: string; timestamp?: number }
): PersonalizationContext {
  return {
    signature: getCosmicSignature(),
    preferences: getPreferenceVector(),
    mode,
    shareCode: options?.shareCode,
    timestamp: options?.timestamp
  }
}

/**
 * Export personalization state for sharing
 */
export function exportPersonalizationState(): {
  signature: CosmicSignature
  preferences: PreferenceVector
  shareCode: string
} {
  const signature = getCosmicSignature()
  const preferences = getPreferenceVector()
  const shareCode = createShareCode(signature.cosmicSeed)
  
  return { signature, preferences, shareCode }
}

/**
 * Import personalization state from share link
 */
export function importPersonalizationState(shareCode: string): PersonalizationContext {
  const seed = hashShareCode(shareCode)
  
  // Create temporary signature from share code
  const signature: CosmicSignature = {
    userId: `shared-${shareCode}`,
    cosmicSeed: seed,
    createdAt: new Date().toISOString(),
    visualTone: generateVisualTone(seed)
  }
  
  // Use default preferences for shared views
  const preferences = getPreferenceVector()
  
  return {
    signature,
    preferences,
    mode: 'share',
    shareCode
  }
}
