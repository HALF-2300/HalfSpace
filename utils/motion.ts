'use client'

/**
 * Motion utilities respecting prefers-reduced-motion
 */

export function useReducedMotion() {
  if (typeof window === 'undefined') return false
  
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  return mediaQuery.matches
}

/**
 * Get parallax transform values respecting reduced motion
 */
export function getParallaxTransform(
  scrollY: number,
  speed: number = 0.5,
  maxOffset: number = 100
): string {
  if (useReducedMotion()) {
    return 'translateY(0)'
  }
  
  const offset = Math.min(scrollY * speed, maxOffset)
  return `translateY(${offset}px)`
}

/**
 * Get slow zoom transform respecting reduced motion
 */
export function getSlowZoomTransform(
  scrollY: number,
  scaleFactor: number = 0.00005,
  maxScale: number = 1.05
): string {
  if (useReducedMotion()) {
    return 'scale(1)'
  }
  
  const scale = Math.min(1 + scrollY * scaleFactor, maxScale)
  return `scale(${scale})`
}

/**
 * Combined parallax + zoom transform
 */
export function getCinematicTransform(
  scrollY: number,
  parallaxSpeed: number = 0.3,
  zoomFactor: number = 0.00005,
  maxParallax: number = 100,
  maxZoom: number = 1.05
): string {
  if (useReducedMotion()) {
    return 'translateY(0) scale(1)'
  }
  
  const parallax = Math.min(scrollY * parallaxSpeed, maxParallax)
  const zoom = Math.min(1 + scrollY * zoomFactor, maxZoom)
  
  return `translateY(${parallax}px) scale(${zoom})`
}
