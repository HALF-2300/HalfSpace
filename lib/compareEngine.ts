/**
 * Compare Engine
 * 
 * Enables side-by-side comparison of celestial objects with visual data.
 * Generates insights like "Jupiter is 11x larger than Earth".
 */

import atlasData from '@/data/atlas.json'

// ============================================================================
// Types
// ============================================================================

export interface ComparableItem {
  id: string
  name: string
  nameAr?: string
  type: 'planet' | 'star' | 'moon' | 'galaxy' | 'other'
  image: string
  facts: string[]
  diameter?: number // in km
  mass?: number // relative to Earth or Sun
  distance?: number // in million km from Sun
  temperature?: number // in Celsius
  tags: string[]
  rawDiameter?: string
  rawMass?: string
  rawDistance?: string
}

export interface CompareMetric {
  name: string
  values: (number | null)[]
  unit: string
  displayValues: string[]
  maxValue: number
}

export interface CompareInsight {
  text: string
  type: 'size' | 'distance' | 'mass' | 'general'
}

export interface CompareResult {
  items: ComparableItem[]
  metrics: CompareMetric[]
  insights: CompareInsight[]
}

// ============================================================================
// Data Parsing
// ============================================================================

/**
 * Parse diameter string to number (in km)
 */
function parseDiameter(str?: string): number | null {
  if (!str) return null
  const match = str.replace(/,/g, '').match(/[\d.]+/)
  return match ? parseFloat(match[0]) : null
}

/**
 * Parse distance string to number (in million km)
 */
function parseDistance(str?: string): number | null {
  if (!str) return null
  const normalized = str.toLowerCase().replace(/,/g, '')
  
  if (normalized.includes('billion')) {
    const match = normalized.match(/[\d.]+/)
    return match ? parseFloat(match[0]) * 1000 : null
  }
  
  const match = normalized.match(/[\d.]+/)
  return match ? parseFloat(match[0]) : null
}

/**
 * Parse mass string to relative value
 */
function parseMass(str?: string): number | null {
  if (!str) return null
  const match = str.match(/[\d.]+/)
  if (!match) return null
  
  const base = parseFloat(match[0])
  const expMatch = str.match(/10[²³⁴⁵⁶⁷⁸⁹⁰]+/)
  
  if (expMatch) {
    const expMap: Record<string, number> = {
      '²': 2, '³': 3, '⁴': 4, '⁵': 5, '⁶': 6, '⁷': 7, '⁸': 8, '⁹': 9, '⁰': 0
    }
    let exp = 0
    for (const char of expMatch[0].replace('10', '')) {
      exp = exp * 10 + (expMap[char] || 0)
    }
    return base * Math.pow(10, exp)
  }
  
  return base
}

// ============================================================================
// Data Access
// ============================================================================

/**
 * Get all comparable items from atlas
 */
export function getAllComparableItems(): ComparableItem[] {
  const items: ComparableItem[] = []
  
  // Add planets
  if (atlasData.planets) {
    for (const planet of atlasData.planets) {
      items.push({
        id: planet.id,
        name: planet.name,
        nameAr: planet.nameAr,
        type: 'planet',
        image: planet.image,
        facts: planet.facts,
        diameter: parseDiameter(planet.diameter) || undefined,
        distance: parseDistance(planet.distance) || undefined,
        mass: parseMass(planet.mass) || undefined,
        tags: planet.tags,
        rawDiameter: planet.diameter,
        rawMass: planet.mass,
        rawDistance: planet.distance
      })
    }
  }
  
  // Add stars
  if (atlasData.stars) {
    for (const star of atlasData.stars) {
      items.push({
        id: star.id,
        name: star.name,
        nameAr: star.nameAr,
        type: 'star',
        image: star.image,
        facts: star.facts,
        tags: star.tags || [],
        rawDiameter: (star as any).diameter,
        rawMass: (star as any).mass
      })
    }
  }
  
  // Add moons
  const moons = (atlasData as any).moons as any[] | undefined
  if (moons) {
    for (const moon of moons) {
      items.push({
        id: moon.id,
        name: moon.name,
        nameAr: moon.nameAr,
        type: 'moon',
        image: moon.image,
        facts: moon.facts,
        tags: moon.tags || []
      })
    }
  }
  
  return items
}

/**
 * Get item by ID
 */
export function getComparableItemById(id: string): ComparableItem | undefined {
  return getAllComparableItems().find(item => item.id === id)
}

/**
 * Get items by type
 */
export function getComparableItemsByType(type: ComparableItem['type']): ComparableItem[] {
  return getAllComparableItems().filter(item => item.type === type)
}

// ============================================================================
// Comparison Logic
// ============================================================================

/**
 * Compare multiple items
 */
export function compare(ids: string[]): CompareResult {
  const items = ids
    .map(id => getComparableItemById(id))
    .filter((item): item is ComparableItem => item !== undefined)
  
  if (items.length === 0) {
    return { items: [], metrics: [], insights: [] }
  }
  
  const metrics = generateMetrics(items)
  const insights = generateInsights(items)
  
  return { items, metrics, insights }
}

/**
 * Generate comparison metrics
 */
function generateMetrics(items: ComparableItem[]): CompareMetric[] {
  const metrics: CompareMetric[] = []
  
  // Diameter metric
  const diameters = items.map(item => item.diameter ?? null)
  if (diameters.some(d => d !== null)) {
    const maxDiameter = Math.max(...diameters.filter((d): d is number => d !== null))
    metrics.push({
      name: 'Diameter',
      values: diameters,
      unit: 'km',
      displayValues: items.map(item => item.rawDiameter || 'Unknown'),
      maxValue: maxDiameter
    })
  }
  
  // Distance metric (for planets)
  const distances = items.map(item => item.distance ?? null)
  if (distances.some(d => d !== null)) {
    const maxDistance = Math.max(...distances.filter((d): d is number => d !== null))
    metrics.push({
      name: 'Distance from Sun',
      values: distances,
      unit: 'million km',
      displayValues: items.map(item => item.rawDistance || 'Unknown'),
      maxValue: maxDistance
    })
  }
  
  return metrics
}

/**
 * Generate comparison insights
 */
function generateInsights(items: ComparableItem[]): CompareInsight[] {
  const insights: CompareInsight[] = []
  
  if (items.length < 2) return insights
  
  // Size comparisons
  const withDiameter = items.filter(item => item.diameter)
  if (withDiameter.length >= 2) {
    const sorted = [...withDiameter].sort((a, b) => (b.diameter || 0) - (a.diameter || 0))
    const largest = sorted[0]
    const smallest = sorted[sorted.length - 1]
    
    if (largest.diameter && smallest.diameter) {
      const ratio = (largest.diameter / smallest.diameter).toFixed(1)
      insights.push({
        text: `${largest.name} is ${ratio}x larger than ${smallest.name}`,
        type: 'size'
      })
    }
    
    // Earth comparison if Earth is in the list
    const earth = items.find(i => i.id === 'earth')
    if (earth && earth.diameter) {
      for (const item of items) {
        if (item.id !== 'earth' && item.diameter) {
          const ratio = (item.diameter / earth.diameter).toFixed(1)
          if (parseFloat(ratio) > 1) {
            insights.push({
              text: `${item.name} is ${ratio}x the size of Earth`,
              type: 'size'
            })
          } else if (parseFloat(ratio) < 1) {
            const inverseRatio = (earth.diameter / item.diameter).toFixed(1)
            insights.push({
              text: `${item.name} is ${inverseRatio}x smaller than Earth`,
              type: 'size'
            })
          }
        }
      }
    }
  }
  
  // Distance comparisons
  const withDistance = items.filter(item => item.distance)
  if (withDistance.length >= 2) {
    const sorted = [...withDistance].sort((a, b) => (a.distance || 0) - (b.distance || 0))
    const closest = sorted[0]
    const farthest = sorted[sorted.length - 1]
    
    if (closest.distance && farthest.distance) {
      const ratio = (farthest.distance / closest.distance).toFixed(1)
      insights.push({
        text: `${farthest.name} is ${ratio}x farther from the Sun than ${closest.name}`,
        type: 'distance'
      })
    }
  }
  
  return insights.slice(0, 5) // Limit to 5 insights
}

/**
 * Get quick comparison suggestions
 */
export function getComparisonSuggestions(): { name: string; ids: string[] }[] {
  return [
    { name: 'Rocky Planets', ids: ['mercury', 'venus', 'earth', 'mars'] },
    { name: 'Gas Giants', ids: ['jupiter', 'saturn', 'uranus', 'neptune'] },
    { name: 'Earth vs Mars', ids: ['earth', 'mars'] },
    { name: 'Inner Planets', ids: ['mercury', 'venus', 'earth', 'mars'] },
    { name: 'Outer Planets', ids: ['jupiter', 'saturn', 'uranus', 'neptune'] }
  ]
}
