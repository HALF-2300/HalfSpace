/**
 * Image fallback utilities for error handling
 */

/**
 * Some external sources block hotlinking for specific assets (403).
 * We normalize those URLs to reliable alternatives to avoid "missing images"
 * across the site.
 */
const RELIABLE_SPACE_FALLBACKS: string[] = [
  'https://images-assets.nasa.gov/image/PIA01341/PIA01341~orig.jpg',
  'https://images-assets.nasa.gov/image/PIA16853/PIA16853~orig.jpg',
  'https://images-assets.nasa.gov/image/PIA00271/PIA00271~orig.jpg',
  'https://images-assets.nasa.gov/image/PIA04591/PIA04591~orig.jpg',
  'https://images-assets.nasa.gov/image/PIA02873/PIA02873~orig.jpg',
  'https://images-assets.nasa.gov/image/PIA23122/PIA23122~orig.jpg',
  'https://images-assets.nasa.gov/image/PIA22914/PIA22914~orig.jpg',
  'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000136/GSFC_20171208_Archive_e000136~orig.jpg',
  'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001327/GSFC_20171208_Archive_e001327~orig.jpg',
  'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e002200/GSFC_20171208_Archive_e002200~orig.jpg',
  'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000282/GSFC_20171208_Archive_e000282~orig.jpg',
  'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000284/GSFC_20171208_Archive_e000284~orig.jpg',
]

function hashStringToIndex(input: string, modulo: number): number {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0
  }
  return modulo === 0 ? 0 : hash % modulo
}

function normalizeKnownBlockedImageSrc(src: string): string {
  // This specific NASA asset blocks ~orig and ~large but allows ~medium
  if (src.includes('GSFC_20171208_Archive_e000263') && src.endsWith('~orig.jpg')) {
    return src.replace('~orig.jpg', '~medium.jpg')
  }

  // STScI / Webb PRC images (as served via images-assets) are frequently 403 in some environments
  if (
    src.includes('images-assets.nasa.gov/image/STScI-PRC2022-') ||
    src.includes('images-assets.nasa.gov/image/STScI-') ||
    src.includes('images-assets.nasa.gov/image/KSC-20220901-PH-SPX01_0045') ||
    src.includes('images-assets.nasa.gov/image/black-hole-image-nasa_gsfc_20190410_archive_e000190')
  ) {
    const idx = hashStringToIndex(src, RELIABLE_SPACE_FALLBACKS.length)
    return RELIABLE_SPACE_FALLBACKS[idx]
  }

  return src
}

/**
 * Default fallback image (a beautiful space gradient)
 * This prevents broken images and maintains layout
 */
export const DEFAULT_FALLBACK_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIHZpZXdCb3g9IjAgMCAxMjAwIDYzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjAiIHkxPSIwIiB4Mj0iMTIwMCIgeTI9IjYzMCI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMwQTA4MjciLz4KICAgICAgPHN0b3Agb2Zmc2V0PSI1MCUiIHN0b3AtY29sb3I9IiM0MjIzMzYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMUUxQjJGIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjYSkiLz4KICA8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSIjOEI1Q0Y2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiBvcGFjaXR5PSIwLjUiPvCfjIwgSGFsZlNQQUNFPC90ZXh0Pgo8L3N2Zz4='

/**
 * Generate a placeholder SVG with space theme
 */
export function generateSpacePlaceholder(width: number = 1200, height: number = 630): string {
  // Use encodeURIComponent instead of Buffer for browser compatibility
  const svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="spaceGrad" x1="0" y1="0" x2="${width}" y2="${height}">
          <stop offset="0%" stop-color="#0A0827"/>
          <stop offset="50%" stop-color="#422336"/>
          <stop offset="100%" stop-color="#1E1B2F"/>
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#spaceGrad)"/>
      <text x="50%" y="50%" font-family="Arial" font-size="24" fill="#8B5CF6" text-anchor="middle" dominant-baseline="middle" opacity="0.5">🌌 HalfSPACE</text>
    </svg>`
  
  if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
    // Browser: use btoa
    return `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(svg)))}`
  } else {
    // Node.js: use Buffer (for SSR)
    const Buffer = require('buffer').Buffer
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
  }
}

/**
 * Handle image load error and replace with fallback
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackSrc?: string
): void {
  const img = event.currentTarget
  if (img.src !== fallbackSrc && img.src !== DEFAULT_FALLBACK_IMAGE) {
    img.src = fallbackSrc || DEFAULT_FALLBACK_IMAGE
    // Prevent infinite loop
    img.onerror = null
  }
}

/**
 * Check if image URL is valid (basic check)
 */
export function isValidImageUrl(url: string): boolean {
  if (!url) return false
  // Check for data URLs
  if (url.startsWith('data:')) return true
  // Check for http/https
  if (url.startsWith('http://') || url.startsWith('https://')) return true
  // Check for relative paths
  if (url.startsWith('/')) return true
  return false
}

/**
 * Get fallback image URL based on context
 */
export function getFallbackImage(context?: 'hero' | 'section' | 'gallery'): string {
  switch (context) {
    case 'hero':
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIHZpZXdCb3g9IjAgMCAxMjAwIDYzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjAiIHkxPSIwIiB4Mj0iMTIwMCIgeTI9IjYzMCI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMwQTA4MjciLz4KICAgICAgPHN0b3Agb2Zmc2V0PSI1MCUiIHN0b3AtY29sb3I9IiM0MjIzMzYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMUUxQjJGIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjYSkiLz4KICA8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSIjOEI1Q0Y2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiBvcGFjaXR5PSIwLjUiPvCfjIwgSGFsZlNQQUNFPC90ZXh0Pgo8L3N2Zz4='
    case 'section':
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMCIgeTE9IjAiIHgyPSI4MDAiIHkyPSI2MDAiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMwQTA4MjciLz48c3RvcCBvZmZzZXQ9IjUwJSIgc3RvcC1jb2xvcj0iIzQyMjMzNiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzFFMUIyRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSJ1cmwoI2IpIi8+PC9zdmc+'
    case 'gallery':
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJjIiB4MT0iMCIgeTE9IjAiIHgyPSI2MDAiIHkyPSI0MDAiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMwQTA4MjciLz48c3RvcCBvZmZzZXQ9IjUwJSIgc3RvcC1jb2xvcj0iIzQyMjMzNiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzFFMUIyRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiBmaWxsPSJ1cmwoI2MpIi8+PC9zdmc+'
    default:
      return DEFAULT_FALLBACK_IMAGE
  }
}

/**
 * Generate a contextual placeholder image based on content keywords
 */
export function generateContextualPlaceholder(
  keywords: string,
  width: number = 800,
  height: number = 600
): string {
  // Generate space-themed placeholder with context
  const svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="spaceGrad" x1="0" y1="0" x2="${width}" y2="${height}">
          <stop offset="0%" stop-color="#0A0827"/>
          <stop offset="50%" stop-color="#422336"/>
          <stop offset="100%" stop-color="#1E1B2F"/>
        </linearGradient>
        <radialGradient id="starGrad" cx="50%" cy="50%">
          <stop offset="0%" stop-color="rgba(255,255,255,0.8)"/>
          <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
        </radialGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#spaceGrad)"/>
      ${Array.from({ length: 50 }).map((_, i) => {
        const x = Math.random() * width
        const y = Math.random() * height
        const size = Math.random() * 2 + 0.5
        return `<circle cx="${x}" cy="${y}" r="${size}" fill="white" opacity="${Math.random() * 0.6 + 0.2}"/>`
      }).join('')}
      <circle cx="${width * 0.5}" cy="${height * 0.5}" r="100" fill="url(#starGrad)" opacity="0.3"/>
      <text x="50%" y="55%" font-family="Arial" font-size="20" fill="#8B5CF6" text-anchor="middle" dominant-baseline="middle" opacity="0.6">${keywords.substring(0, 30)}</text>
    </svg>`
  
  if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
    return `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(svg)))}`
  } else {
    const Buffer = require('buffer').Buffer
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
  }
}

/**
 * Safe image loader with fallback handling
 * Returns the image src or fallback if invalid
 */
export function safeImageSrc(src: string | undefined | null, fallback?: string): string {
  if (!src || !isValidImageUrl(src)) {
    return fallback || DEFAULT_FALLBACK_IMAGE
  }
  return normalizeKnownBlockedImageSrc(src)
}

type UnsplashSizePreset = 'thumb' | 'card' | 'hero' | 'lightbox'

function unsplashTargetWidth(preset: UnsplashSizePreset): number {
  switch (preset) {
    case 'thumb':
      return 900
    case 'card':
      return 1400
    case 'hero':
      return 2200
    case 'lightbox':
      return 2600
    default:
      return 1400
  }
}

/**
 * Upgrade known low-res external image URLs (currently Unsplash) so they don't look blurry
 * when displayed in large containers (hero/lightbox).
 */
export function enhanceImageSrc(
  src: string | undefined | null,
  preset: UnsplashSizePreset = 'card',
  fallback?: string
): string {
  const safe = safeImageSrc(src, fallback)
  if (!safe || safe.startsWith('data:')) return safe

  // Unsplash images often come in as `?w=800` which looks blurry when stretched.
  if (safe.startsWith('https://images.unsplash.com/')) {
    try {
      const url = new URL(safe)
      const params = url.searchParams

      const targetW = unsplashTargetWidth(preset)
      const currentW = Number(params.get('w') || 0)
      if (!currentW || currentW < targetW) params.set('w', String(targetW))

      // Keep it sharp without forcing a crop.
      if (!params.get('auto')) params.set('auto', 'format')
      if (!params.get('fit')) params.set('fit', 'max')
      if (!params.get('q')) params.set('q', '80')

      // Preserve existing params (ixid/ixlib/etc)
      url.search = params.toString()
      return url.toString()
    } catch {
      return safe
    }
  }

  return safe
}
