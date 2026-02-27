/**
 * Enhanced Performance Utilities
 * Lazy-loading, preloading, and CLS prevention
 */

/**
 * Preload hero image for faster initial render
 * Enhanced version with error handling
 */
export function preloadHeroImageEnhanced(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      resolve()
      return
    }

    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = src
    link.fetchPriority = 'high'
    
    link.onload = () => resolve()
    link.onerror = () => reject(new Error(`Failed to preload image: ${src}`))
    
    document.head.appendChild(link)
  })
}

/**
 * Preload multiple images with priority
 */
export function preloadImages(srcs: string[]): Promise<void[]> {
  return Promise.all(srcs.map(src => preloadHeroImageEnhanced(src).catch(() => {})))
}

/**
 * Get fixed dimensions to prevent CLS (Cumulative Layout Shift)
 */
export function getFixedImageDimensions(
  containerWidth: number,
  containerHeight: number,
  aspectRatio?: number
): { width: number; height: number } {
  const defaultAspectRatio = 16 / 9
  const ratio = aspectRatio || defaultAspectRatio

  let width = containerWidth
  let height = containerWidth / ratio

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
 * Determine if image should be lazy loaded based on position
 */
export function shouldLazyLoadEnhanced(
  index: number,
  isHero: boolean = false,
  aboveFoldCount: number = 8
): boolean {
  if (isHero) return false
  return index >= aboveFoldCount
}

/**
 * Get loading attribute for image
 */
export function getLoadingAttribute(
  index: number,
  isHero: boolean = false,
  aboveFoldCount: number = 8
): 'lazy' | 'eager' {
  return shouldLazyLoadEnhanced(index, isHero, aboveFoldCount) ? 'lazy' : 'eager'
}

/**
 * Get priority for Next.js Image component
 */
export function getImagePriorityEnhanced(
  index: number,
  isHero: boolean = false,
  aboveFoldCount: number = 8
): boolean {
  if (isHero) return true
  return index < aboveFoldCount
}

/**
 * Get optimized sizes attribute for responsive images
 * Enhanced with more breakpoints
 */
export function getImageSizesEnhanced(
  columns: {
    mobile?: number
    tablet?: number
    desktop?: number
    wide?: number
  } = {}
): string {
  const { 
    mobile = 100, 
    tablet = 50, 
    desktop = 33,
    wide = 25
  } = columns

  return `(max-width: 640px) ${mobile}vw, (max-width: 1024px) ${tablet}vw, (max-width: 1536px) ${desktop}vw, ${wide}vw`
}

/**
 * Intersection Observer for lazy loading
 */
export function createLazyLoadObserver(
  callback: (entry: IntersectionObserverEntry) => void,
  options?: IntersectionObserverInit
): IntersectionObserver {
  const defaultOptions: IntersectionObserverInit = {
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  }

  return new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(entry)
      }
    })
  }, defaultOptions)
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
