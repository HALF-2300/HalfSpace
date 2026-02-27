/**
 * Share Card System
 * 
 * Generate beautiful shareable cards for space objects.
 * Each card includes: Title + 1 killer fact + image + link
 */

import atlasData from '@/data/atlas.json'
import { getItemById } from './jumpEngine'

// ============================================================================
// Types
// ============================================================================

export interface ShareCardData {
  id: string
  title: string
  titleAr?: string
  type: string
  image: string
  fact: string
  factAr?: string
  url: string
  tags: string[]
}

// ============================================================================
// Card Generation
// ============================================================================

/**
 * Get share card data for an object
 */
export function getShareCardData(id: string): ShareCardData | null {
  // Try planets
  const planet = atlasData.planets?.find(p => p.id === id)
  if (planet) {
    return {
      id: planet.id,
      title: planet.name,
      titleAr: planet.nameAr,
      type: 'Planet',
      image: planet.image,
      fact: planet.facts[0] || `${planet.name} is a fascinating planet in our solar system.`,
      url: `/space/planets/${planet.id}`,
      tags: planet.tags
    }
  }

  // Try stars
  const star = atlasData.stars?.find(s => s.id === id)
  if (star) {
    return {
      id: star.id,
      title: star.name,
      titleAr: star.nameAr,
      type: 'Star',
      image: star.image,
      fact: star.facts?.[0] || `${star.name} is a remarkable star in the cosmos.`,
      url: `/space/stars/${star.id}`,
      tags: star.tags || []
    }
  }

  // Try moons
  const moon = (atlasData as any).moons?.find((m: any) => m.id === id)
  if (moon) {
    return {
      id: moon.id,
      title: moon.name,
      titleAr: moon.nameAr,
      type: 'Moon',
      image: moon.image,
      fact: moon.facts?.[0] || `${moon.name} is an intriguing moon.`,
      url: `/space/moons/${moon.id}`,
      tags: moon.tags || []
    }
  }

  // Try content index
  const item = getItemById(id)
  if (item) {
    return {
      id: item.id,
      title: item.title,
      type: item.category,
      image: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000136/GSFC_20171208_Archive_e000136~orig.jpg',
      fact: item.description,
      url: item.url,
      tags: []
    }
  }

  return null
}

/**
 * Generate share URL
 */
export function generateShareUrl(data: ShareCardData): string {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://halfspace.space'
  return `${baseUrl}${data.url}`
}

/**
 * Generate share text
 */
export function generateShareText(data: ShareCardData): string {
  return `${data.title} - ${data.fact}\n\nExplore more at HalfSpace 🚀`
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Fallback
    const textarea = document.createElement('textarea')
    textarea.value = text
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    return true
  }
}

/**
 * Share via Web Share API
 */
export async function shareViaWebShare(data: ShareCardData): Promise<boolean> {
  if (!navigator.share) return false

  try {
    await navigator.share({
      title: `${data.title} - HalfSpace`,
      text: data.fact,
      url: generateShareUrl(data)
    })
    return true
  } catch {
    return false
  }
}

/**
 * Generate Twitter share URL
 */
export function getTwitterShareUrl(data: ShareCardData): string {
  const text = encodeURIComponent(`${data.title}: ${data.fact}`)
  const url = encodeURIComponent(generateShareUrl(data))
  return `https://twitter.com/intent/tweet?text=${text}&url=${url}`
}

/**
 * Generate Facebook share URL
 */
export function getFacebookShareUrl(data: ShareCardData): string {
  const url = encodeURIComponent(generateShareUrl(data))
  return `https://www.facebook.com/sharer/sharer.php?u=${url}`
}

/**
 * Generate WhatsApp share URL
 */
export function getWhatsAppShareUrl(data: ShareCardData): string {
  const text = encodeURIComponent(`${data.title}: ${data.fact}\n\n${generateShareUrl(data)}`)
  return `https://wa.me/?text=${text}`
}
