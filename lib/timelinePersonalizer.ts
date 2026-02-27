/**
 * Personalized Timeline Loader
 * Makes the cosmic timeline feel unique to each user
 * 
 * Same 12 epochs, but:
 * - Featured nodes adapt to user interests
 * - Next consequence links create personal causal paths
 * - Background presets adjust to visual tone
 */

import timelineData from '@/timeline.json'
import {
  createPersonalizationContext,
  selectWithConstraints,
  type PersonalizationContext,
  type SeedMode,
  type SelectionConstraints
} from './personalization'

// ============================================================================
// TYPES
// ============================================================================

export interface TimelineEpoch {
  id: string
  version: string
  title: string
  timeRangeLabel: string
  hook: string
  backgroundPreset: {
    type: string
    primaryColor: string
    secondaryColor: string
    density: number
    speed: number
    glow: boolean
  }
  featuredNodes: string[]
  primaryExperience: {
    type: string
    id: string
  }
  nextConsequence: {
    type: string
    targetId: string
    transitionLabel: string
  }
}

export interface PersonalizedTimeline {
  epochs: TimelineEpoch[]
  metadata: {
    title: string
    description: string
    totalEpochs: number
    personalizedFor: string
    mode: SeedMode
  }
}

export interface NodeMetadata {
  id: string
  category?: string
  type?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
}

// ============================================================================
// NODE POOLS (defined per epoch)
// ============================================================================

/**
 * Each epoch has a pool of allowed nodes to choose from
 * This ensures personalization stays within scientific accuracy
 */
const EPOCH_NODE_POOLS: Record<string, NodeMetadata[]> = {
  'epoch-01-bigbang': [
    { id: 'content-bigbang-singularity', category: 'concepts', type: 'concept', difficulty: 'advanced' },
    { id: 'content-planck-epoch', category: 'concepts', type: 'concept', difficulty: 'advanced' },
    { id: 'content-inflation-theory', category: 'concepts', type: 'concept', difficulty: 'intermediate' },
    { id: 'content-quantum-fluctuations', category: 'phenomena', type: 'concept', difficulty: 'advanced' },
    { id: 'content-early-universe', category: 'concepts', type: 'concept', difficulty: 'beginner' }
  ],
  'epoch-02-cosmic-dawn': [
    { id: 'content-recombination', category: 'phenomena', type: 'concept', difficulty: 'intermediate' },
    { id: 'content-cmb-radiation', category: 'phenomena', type: 'concept', difficulty: 'intermediate' },
    { id: 'content-first-atoms', category: 'concepts', type: 'concept', difficulty: 'beginner' },
    { id: 'content-dark-ages', category: 'concepts', type: 'concept', difficulty: 'intermediate' },
    { id: 'content-photon-decoupling', category: 'phenomena', type: 'concept', difficulty: 'advanced' }
  ],
  'epoch-03-first-stars': [
    { id: 'content-pop3-stars', category: 'objects', type: 'concept', difficulty: 'intermediate' },
    { id: 'content-nucleosynthesis', category: 'phenomena', type: 'concept', difficulty: 'advanced' },
    { id: 'content-reionization', category: 'phenomena', type: 'concept', difficulty: 'advanced' },
    { id: 'content-stellar-death', category: 'phenomena', type: 'concept', difficulty: 'intermediate' },
    { id: 'content-heavy-elements', category: 'concepts', type: 'concept', difficulty: 'beginner' }
  ],
  'epoch-04-galaxy-formation': [
    { id: 'content-dark-matter-halos', category: 'phenomena', type: 'concept', difficulty: 'advanced' },
    { id: 'content-proto-galaxies', category: 'objects', type: 'concept', difficulty: 'intermediate' },
    { id: 'content-quasars', category: 'objects', type: 'concept', difficulty: 'intermediate' },
    { id: 'content-cosmic-web', category: 'concepts', type: 'concept', difficulty: 'intermediate' },
    { id: 'content-galaxy-mergers', category: 'phenomena', type: 'concept', difficulty: 'beginner' }
  ],
  'epoch-05-milky-way': [
    { id: 'content-milky-way-formation', category: 'objects', type: 'concept', difficulty: 'beginner' },
    { id: 'content-galactic-disk', category: 'concepts', type: 'concept', difficulty: 'intermediate' },
    { id: 'content-sagittarius-blackhole', category: 'objects', type: 'concept', difficulty: 'intermediate' },
    { id: 'content-spiral-arms', category: 'concepts', type: 'concept', difficulty: 'beginner' },
    { id: 'content-galactic-center', category: 'objects', type: 'concept', difficulty: 'intermediate' }
  ],
  'epoch-06-solar-system': [
    { id: 'content-solar-nebula', category: 'phenomena', type: 'concept', difficulty: 'beginner' },
    { id: 'content-planetary-accretion', category: 'phenomena', type: 'concept', difficulty: 'intermediate' },
    { id: 'content-late-heavy-bombardment', category: 'phenomena', type: 'concept', difficulty: 'intermediate' },
    { id: 'content-planet-migration', category: 'phenomena', type: 'concept', difficulty: 'advanced' },
    { id: 'content-asteroid-belt-formation', category: 'phenomena', type: 'concept', difficulty: 'beginner' }
  ],
  'epoch-07-early-earth': [
    { id: 'content-hadean-eon', category: 'concepts', type: 'concept', difficulty: 'intermediate' },
    { id: 'content-origin-of-life', category: 'phenomena', type: 'concept', difficulty: 'advanced' },
    { id: 'content-great-oxidation', category: 'phenomena', type: 'concept', difficulty: 'intermediate' },
    { id: 'content-stromatolites', category: 'objects', type: 'concept', difficulty: 'beginner' },
    { id: 'content-early-atmosphere', category: 'concepts', type: 'concept', difficulty: 'beginner' }
  ],
  'epoch-08-complex-life': [
    { id: 'content-cambrian-explosion', category: 'phenomena', type: 'concept', difficulty: 'beginner' },
    { id: 'content-mass-extinctions', category: 'phenomena', type: 'concept', difficulty: 'intermediate' },
    { id: 'content-dinosaurs', category: 'objects', type: 'concept', difficulty: 'beginner' },
    { id: 'content-photosynthesis', category: 'phenomena', type: 'concept', difficulty: 'intermediate' },
    { id: 'content-multicellular-life', category: 'concepts', type: 'concept', difficulty: 'intermediate' }
  ],
  'epoch-09-humanity': [
    { id: 'content-human-evolution', category: 'concepts', type: 'concept', difficulty: 'beginner' },
    { id: 'content-consciousness', category: 'concepts', type: 'concept', difficulty: 'advanced' },
    { id: 'content-civilization', category: 'concepts', type: 'concept', difficulty: 'beginner' },
    { id: 'content-language', category: 'concepts', type: 'concept', difficulty: 'intermediate' },
    { id: 'content-tool-use', category: 'concepts', type: 'concept', difficulty: 'beginner' }
  ],
  'epoch-10-space-age': [
    { id: 'content-first-satellite', category: 'missions', type: 'concept', difficulty: 'beginner' },
    { id: 'content-moon-landing', category: 'missions', type: 'concept', difficulty: 'beginner' },
    { id: 'content-voyager', category: 'missions', type: 'concept', difficulty: 'intermediate' },
    { id: 'content-hubble', category: 'missions', type: 'concept', difficulty: 'intermediate' },
    { id: 'content-iss', category: 'missions', type: 'concept', difficulty: 'beginner' }
  ],
  'epoch-11-near-future': [
    { id: 'content-mars-colonization', category: 'missions', type: 'concept', difficulty: 'intermediate' },
    { id: 'content-interstellar-probes', category: 'missions', type: 'concept', difficulty: 'advanced' },
    { id: 'content-asteroid-mining', category: 'concepts', type: 'concept', difficulty: 'intermediate' },
    { id: 'content-space-telescopes', category: 'missions', type: 'concept', difficulty: 'beginner' },
    { id: 'content-fusion-power', category: 'concepts', type: 'concept', difficulty: 'advanced' }
  ],
  'epoch-12-far-future': [
    { id: 'content-stellar-death-sun', category: 'phenomena', type: 'concept', difficulty: 'intermediate' },
    { id: 'content-galaxy-collision', category: 'phenomena', type: 'concept', difficulty: 'intermediate' },
    { id: 'content-heat-death', category: 'concepts', type: 'concept', difficulty: 'advanced' },
    { id: 'content-black-hole-era', category: 'concepts', type: 'concept', difficulty: 'advanced' },
    { id: 'content-proton-decay', category: 'phenomena', type: 'concept', difficulty: 'advanced' }
  ]
}

// ============================================================================
// PERSONALIZATION FUNCTIONS
// ============================================================================

/**
 * Load personalized timeline
 */
export function loadPersonalizedTimeline(mode: SeedMode = 'cosmic', shareCode?: string): PersonalizedTimeline {
  const ctx = createPersonalizationContext(mode, { shareCode })
  const originalEpochs = timelineData.epochs as any[]
  
  // Personalize each epoch
  const personalizedEpochs = originalEpochs.map(epoch => 
    personalizeEpoch(epoch, ctx)
  )
  
  return {
    epochs: personalizedEpochs,
    metadata: {
      title: 'Your Cosmic Timeline',
      description: 'A personalized journey through space and time',
      totalEpochs: personalizedEpochs.length,
      personalizedFor: ctx.signature.userId.slice(0, 8),
      mode
    }
  }
}

/**
 * Personalize a single epoch
 */
function personalizeEpoch(epoch: any, ctx: PersonalizationContext): TimelineEpoch {
  // Get node pool for this epoch
  const nodePool = EPOCH_NODE_POOLS[epoch.id] || []
  
  if (nodePool.length === 0) {
    // No pool defined - use original nodes
    return epoch as TimelineEpoch
  }
  
  // Select featured nodes with constraints
  const constraints: SelectionConstraints = {
    allowedPool: nodePool.map(n => n.id),
    minDiversity: 2, // At least 2 different categories
    maxRepeats: 2, // Max 2 from same category
    guaranteedTypes: ['concept'] // Always include at least one concept
  }
  
  const selection = selectWithConstraints(
    nodePool,
    3, // Always 3 featured nodes
    constraints,
    ctx
  )
  
  // Adjust background preset based on visual tone
  const adjustedBackground = adjustBackgroundPreset(
    epoch.backgroundPreset,
    ctx.signature.visualTone
  )
  
  return {
    ...epoch,
    featuredNodes: selection.items.map(n => n.id),
    backgroundPreset: adjustedBackground
  }
}

/**
 * Adjust background preset based on user's visual tone
 */
function adjustBackgroundPreset(
  original: any,
  visualTone: any
): any {
  return {
    ...original,
    density: original.density * visualTone.nebulaDensity,
    speed: original.speed * visualTone.starfieldDrift,
    glow: original.glow && visualTone.glowStrength > 0.5
  }
}

/**
 * Get personalized "next consequence" for an epoch
 * Creates a causal path based on what user clicked before
 */
export function getPersonalizedNextConsequence(
  currentEpochId: string,
  visitedNodes: string[]
): { targetId: string; transitionLabel: string } {
  const epochs = timelineData.epochs as any[]
  const currentIndex = epochs.findIndex(e => e.id === currentEpochId)
  
  if (currentIndex === -1 || currentIndex >= epochs.length - 1) {
    // Last epoch or not found - return default
    return epochs[currentIndex]?.nextConsequence || {
      targetId: '',
      transitionLabel: 'The journey continues...'
    }
  }
  
  // For now, return next epoch (can be enhanced with branching logic)
  const nextEpoch = epochs[currentIndex + 1]
  
  // Personalize transition label based on visited nodes
  const transitionLabel = generateTransitionLabel(
    currentEpochId,
    nextEpoch.id,
    visitedNodes
  )
  
  return {
    targetId: nextEpoch.id,
    transitionLabel
  }
}

/**
 * Generate personalized transition label
 */
function generateTransitionLabel(
  fromEpochId: string,
  toEpochId: string,
  visitedNodes: string[]
): string {
  // Default transitions
  const transitions: Record<string, string> = {
    'epoch-01-bigbang_epoch-02-cosmic-dawn': 'As the universe cools...',
    'epoch-02-cosmic-dawn_epoch-03-first-stars': 'Gravity begins to pull matter together...',
    'epoch-03-first-stars_epoch-04-galaxy-formation': 'Stars cluster into larger structures...',
    'epoch-04-galaxy-formation_epoch-05-milky-way': 'One galaxy will become our home...',
    'epoch-05-milky-way_epoch-06-solar-system': 'In one spiral arm, a new star will form...',
    'epoch-06-solar-system_epoch-07-early-earth': 'One planet will harbor something special...',
    'epoch-07-early-earth_epoch-08-complex-life': 'Life grows more complex...',
    'epoch-08-complex-life_epoch-09-humanity': 'Intelligence emerges...',
    'epoch-09-humanity_epoch-10-space-age': 'We look to the stars...',
    'epoch-10-space-age_epoch-11-near-future': 'The next chapter begins...',
    'epoch-11-near-future_epoch-12-far-future': 'The far future awaits...'
  }
  
  const key = `${fromEpochId}_${toEpochId}`
  return transitions[key] || 'The journey continues...'
}

/**
 * Get featured node details for display
 */
export function getFeaturedNodeDetails(nodeId: string): NodeMetadata | null {
  // Search all epoch pools
  for (const pool of Object.values(EPOCH_NODE_POOLS)) {
    const node = pool.find(n => n.id === nodeId)
    if (node) return node
  }
  return null
}

/**
 * Get alternative nodes for an epoch (for "explore more" feature)
 */
export function getAlternativeNodes(
  epochId: string,
  excludeIds: string[],
  ctx: PersonalizationContext,
  count: number = 3
): NodeMetadata[] {
  const pool = EPOCH_NODE_POOLS[epochId] || []
  
  const constraints: SelectionConstraints = {
    allowedPool: pool.map(n => n.id),
    excludeIds,
    minDiversity: 1
  }
  
  const selection = selectWithConstraints(
    pool,
    count,
    constraints,
    ctx
  )
  
  return selection.items
}

/**
 * Check if timeline has personalized content
 */
export function hasPersonalization(epochId: string): boolean {
  return !!EPOCH_NODE_POOLS[epochId]
}

// ============================================================================
// EXPORT UTILITIES
// ============================================================================

/**
 * Export current timeline configuration for sharing
 */
export function exportTimelineConfig(epochs: TimelineEpoch[]): string {
  const config = {
    version: '1.0',
    epochs: epochs.map(e => ({
      id: e.id,
      featuredNodes: e.featuredNodes
    }))
  }
  
  return JSON.stringify(config)
}

/**
 * Import timeline configuration from share link
 */
export function importTimelineConfig(configStr: string): Map<string, string[]> {
  try {
    const config = JSON.parse(configStr)
    const map = new Map<string, string[]>()
    
    for (const epoch of config.epochs) {
      map.set(epoch.id, epoch.featuredNodes)
    }
    
    return map
  } catch (error) {
    console.error('Failed to import timeline config:', error)
    return new Map()
  }
}
