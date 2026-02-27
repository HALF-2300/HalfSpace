/**
 * Performance utilities for images and assets
 */

/**
 * Preload a hero image for faster initial render
 */
export function preloadHeroImage(src: string): void {
  if (typeof window === 'undefined') return

  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'image'
  link.href = src
  link.fetchPriority = 'high'
  document.head.appendChild(link)
}

/**
 * Get optimized image dimensions to prevent CLS
 * Returns width and height based on container size
 */
export function getImageDimensions(
  containerWidth: number,
  containerHeight: number,
  aspectRatio?: number
): { width: number; height: number } {
  // Default aspect ratio (16:9)
  const defaultAspectRatio = 16 / 9
  const ratio = aspectRatio || defaultAspectRatio

  // Calculate dimensions maintaining aspect ratio
  let width = containerWidth
  let height = containerWidth / ratio

  // If height exceeds container, adjust
  if (height > containerHeight) {
    height = containerHeight
    width = containerHeight * ratio
  }

  return {
    width: Math.round(width),
    height: Math.round(height)
  }
}

/**
 * Check if image should be lazy loaded
 * Hero images and above-the-fold images should not be lazy loaded
 */
export function shouldLazyLoad(
  isAboveFold: boolean = false,
  isHero: boolean = false
): boolean {
  return !isAboveFold && !isHero
}

/**
 * Get loading priority for image
 */
export function getImagePriority(
  isHero: boolean = false,
  isAboveFold: boolean = false
): 'high' | 'low' | undefined {
  if (isHero) return 'high'
  if (isAboveFold) return 'high'
  return undefined // Default is 'auto' which means lazy
}

/**
 * Get optimized sizes attribute for responsive images
 */
export function getImageSizes(
  breakpoints: {
    mobile?: number
    tablet?: number
    desktop?: number
  } = {}
): string {
  const { mobile = 100, tablet = 50, desktop = 33 } = breakpoints

  return `(max-width: 640px) ${mobile}vw, (max-width: 1024px) ${tablet}vw, ${desktop}vw`
}

/**
 * Calculate image quality based on viewport size
 */
export function getImageQuality(
  isHero: boolean = false,
  viewportWidth?: number
): number {
  if (isHero) return 95
  if (viewportWidth && viewportWidth < 640) return 75
  return 85
}

/**
 * Get loading strategy for images (lazy or eager)
 * Returns 'lazy' for below-fold images, 'eager' for hero/above-fold
 */
export function getImageLoadingStrategy(
  isHero: boolean = false,
  isAboveFold: boolean = false
): 'lazy' | 'eager' {
  if (isHero || isAboveFold) {
    return 'eager'
  }
  return 'lazy'
}
