/**
 * Enhanced Image fallback utilities with better error handling
 * Prevents layout breaking when images fail to load
 */

/**
 * Default fallback image (a beautiful space gradient)
 * This prevents broken images and maintains layout
 */
export const DEFAULT_FALLBACK_IMAGE =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIHZpZXdCb3g9IjAgMCAxMjAwIDYzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjAiIHkxPSIwIiB4Mj0iMTIwMCIgeTI9IjYzMCI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMwQTA4MjciLz4KICAgICAgPHN0b3Agb2Zmc2V0PSI1MCUiIHN0b3AtY29sb3I9IiM0MjIzMzYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMUUxQjJGIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIGZpbGw9InVybCgjYSkiLz4KICA8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSIjOEI1Q0Y2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiBvcGFjaXR5PSIwLjUiPvCfjIwgSGFsZlNQQUNFPC90ZXh0Pgo8L3N2Zz4='

/**
 * Generate a placeholder SVG with space theme
 */
export function generateSpacePlaceholder(width: number = 1200, height: number = 630): string {
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
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`
  } else {
    const Buffer = require('buffer').Buffer
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
  }
}

/**
 * Enhanced image error handler that prevents layout breaking
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackSrc?: string
): void {
  const img = event.currentTarget

  // Prevent infinite loop
  if (img.src === fallbackSrc || img.src === DEFAULT_FALLBACK_IMAGE) {
    return
  }

  // Set fallback image
  const finalFallback = fallbackSrc || DEFAULT_FALLBACK_IMAGE

  // Use requestAnimationFrame to prevent layout shift
  if (typeof requestAnimationFrame !== 'undefined') {
    requestAnimationFrame(() => {
      img.src = finalFallback
      img.onerror = null // Prevent infinite loop
      // Maintain aspect ratio
      if (!img.style.aspectRatio && img.width && img.height) {
        img.style.aspectRatio = `${img.width} / ${img.height}`
      }
    })
  } else {
    img.src = finalFallback
    img.onerror = null
  }
}

/**
 * Check if image URL is valid (enhanced validation)
 */
export function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url) return false
  // Check for data URLs
  if (url.startsWith('data:')) return true
  // Check for http/https
  if (url.startsWith('http://') || url.startsWith('https://')) return true
  // Check for relative paths
  if (url.startsWith('/')) return true
  // Check for blob URLs
  if (url.startsWith('blob:')) return true
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
 * Safe image loader with fallback handling
 * Returns the image src or fallback if invalid
 */
export function safeImageSrc(src: string | undefined | null, fallback?: string): string {
  if (!src || !isValidImageUrl(src)) {
    return fallback || DEFAULT_FALLBACK_IMAGE
  }
  return src
}

/**
 * Preload image and return promise
 * Useful for ensuring image is loaded before displaying
 */
export function preloadImage(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!isValidImageUrl(src)) {
      reject(new Error('Invalid image URL'))
      return
    }

    const img = new Image()
    img.onload = () => resolve(src)
    img.onerror = () => {
      // Return fallback on error
      resolve(DEFAULT_FALLBACK_IMAGE)
    }
    img.src = src
  })
}

/**
 * Create image with fallback handling
 * Returns an object with src and error handler
 */
export function createImageWithFallback(
  src: string | undefined | null,
  fallback?: string
): { src: string; onError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void } {
  const finalSrc = safeImageSrc(src, fallback)
  const finalFallback = fallback || DEFAULT_FALLBACK_IMAGE

  return {
    src: finalSrc,
    onError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      handleImageError(e, finalFallback)
    },
  }
}
