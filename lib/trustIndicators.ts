/**
 * Trust Indicators System
 * 
 * Provides credibility through:
 * - Source chips (NASA, ESA, etc.)
 * - Last updated dates
 * - Confidence levels (Observed / Inferred / Unknown)
 */

// ============================================================================
// Types
// ============================================================================

export type ConfidenceLevel = 'observed' | 'measured' | 'inferred' | 'theoretical' | 'unknown'

export interface Source {
  id: string
  name: string
  abbrev: string
  url: string
  type: 'space-agency' | 'observatory' | 'research' | 'encyclopedia'
  color: string
}

export interface TrustInfo {
  sources: Source[]
  lastUpdated: string
  confidence: ConfidenceLevel
  confidenceNote?: string
}

// ============================================================================
// Source Definitions
// ============================================================================

export const SOURCES: Record<string, Source> = {
  nasa: {
    id: 'nasa',
    name: 'NASA',
    abbrev: 'NASA',
    url: 'https://www.nasa.gov',
    type: 'space-agency',
    color: '#0B3D91'
  },
  esa: {
    id: 'esa',
    name: 'European Space Agency',
    abbrev: 'ESA',
    url: 'https://www.esa.int',
    type: 'space-agency',
    color: '#003247'
  },
  jpl: {
    id: 'jpl',
    name: 'Jet Propulsion Laboratory',
    abbrev: 'JPL',
    url: 'https://www.jpl.nasa.gov',
    type: 'research',
    color: '#E4002B'
  },
  hubble: {
    id: 'hubble',
    name: 'Hubble Space Telescope',
    abbrev: 'Hubble',
    url: 'https://hubblesite.org',
    type: 'observatory',
    color: '#8B5CF6'
  },
  jwst: {
    id: 'jwst',
    name: 'James Webb Space Telescope',
    abbrev: 'JWST',
    url: 'https://webbtelescope.org',
    type: 'observatory',
    color: '#D97706'
  },
  wikipedia: {
    id: 'wikipedia',
    name: 'Wikipedia',
    abbrev: 'Wiki',
    url: 'https://en.wikipedia.org',
    type: 'encyclopedia',
    color: '#636363'
  },
  arxiv: {
    id: 'arxiv',
    name: 'arXiv',
    abbrev: 'arXiv',
    url: 'https://arxiv.org',
    type: 'research',
    color: '#B31B1B'
  },
  stsci: {
    id: 'stsci',
    name: 'Space Telescope Science Institute',
    abbrev: 'STScI',
    url: 'https://www.stsci.edu',
    type: 'research',
    color: '#1D4ED8'
  }
}

// ============================================================================
// Confidence Definitions
// ============================================================================

export const CONFIDENCE_INFO: Record<ConfidenceLevel, { label: string; color: string; description: string }> = {
  observed: {
    label: 'Observed',
    color: '#22C55E',
    description: 'Directly measured or photographed by instruments'
  },
  measured: {
    label: 'Measured',
    color: '#3B82F6',
    description: 'Calculated from direct observations with high accuracy'
  },
  inferred: {
    label: 'Inferred',
    color: '#F59E0B',
    description: 'Derived from indirect observations or models'
  },
  theoretical: {
    label: 'Theoretical',
    color: '#A855F7',
    description: 'Based on scientific theory, awaiting confirmation'
  },
  unknown: {
    label: 'Unknown',
    color: '#6B7280',
    description: 'Current scientific understanding is uncertain'
  }
}

// ============================================================================
// Topic Trust Mappings
// ============================================================================

// Default trust info for topics
const TOPIC_TRUST: Record<string, TrustInfo> = {
  // Planets
  mercury: { sources: [SOURCES.nasa, SOURCES.jpl], lastUpdated: '2024-01', confidence: 'observed' },
  venus: { sources: [SOURCES.nasa, SOURCES.esa], lastUpdated: '2024-01', confidence: 'observed' },
  earth: { sources: [SOURCES.nasa], lastUpdated: '2024-01', confidence: 'observed' },
  mars: { sources: [SOURCES.nasa, SOURCES.jpl], lastUpdated: '2024-06', confidence: 'observed' },
  jupiter: { sources: [SOURCES.nasa, SOURCES.jpl], lastUpdated: '2024-01', confidence: 'observed' },
  saturn: { sources: [SOURCES.nasa, SOURCES.jpl], lastUpdated: '2024-01', confidence: 'observed' },
  uranus: { sources: [SOURCES.nasa], lastUpdated: '2023-06', confidence: 'observed' },
  neptune: { sources: [SOURCES.nasa], lastUpdated: '2023-06', confidence: 'observed' },
  
  // Phenomena
  'black-holes': { 
    sources: [SOURCES.nasa, SOURCES.hubble], 
    lastUpdated: '2024-03', 
    confidence: 'inferred',
    confidenceNote: 'Black holes are observed through their effects on surrounding matter'
  },
  'dark-matter': { 
    sources: [SOURCES.nasa, SOURCES.arxiv], 
    lastUpdated: '2023-12', 
    confidence: 'theoretical',
    confidenceNote: 'Dark matter is inferred from gravitational effects but never directly observed'
  },
  'dark-energy': { 
    sources: [SOURCES.nasa, SOURCES.hubble], 
    lastUpdated: '2023-12', 
    confidence: 'theoretical',
    confidenceNote: 'Dark energy explains accelerating universe expansion but remains mysterious'
  },
  supernovas: { sources: [SOURCES.nasa, SOURCES.hubble], lastUpdated: '2024-01', confidence: 'observed' },
  nebulae: { sources: [SOURCES.nasa, SOURCES.hubble, SOURCES.jwst], lastUpdated: '2024-06', confidence: 'observed' },
  pulsars: { sources: [SOURCES.nasa], lastUpdated: '2023-09', confidence: 'observed' },
  quasars: { sources: [SOURCES.nasa, SOURCES.hubble], lastUpdated: '2024-01', confidence: 'observed' }
}

// ============================================================================
// Functions
// ============================================================================

/**
 * Get trust info for a topic
 */
export function getTrustInfo(topicId: string): TrustInfo {
  const info = TOPIC_TRUST[topicId]
  
  if (info) return info
  
  // Default trust info
  return {
    sources: [SOURCES.nasa, SOURCES.wikipedia],
    lastUpdated: '2024-01',
    confidence: 'measured'
  }
}

/**
 * Get sources for a topic
 */
export function getSources(topicId: string): Source[] {
  return getTrustInfo(topicId).sources
}

/**
 * Get confidence level for a topic
 */
export function getConfidence(topicId: string): { level: ConfidenceLevel; info: typeof CONFIDENCE_INFO[ConfidenceLevel]; note?: string } {
  const trust = getTrustInfo(topicId)
  return {
    level: trust.confidence,
    info: CONFIDENCE_INFO[trust.confidence],
    note: trust.confidenceNote
  }
}

/**
 * Format last updated date
 */
export function formatLastUpdated(date: string): string {
  const [year, month] = date.split('-')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[parseInt(month) - 1]} ${year}`
}
