'use client'

import { useEffect, useState } from 'react'

interface CinematicHeroOverlayEnhancedProps {
  intensity?: 'light' | 'medium' | 'strong'
  className?: string
}

/**
 * Enhanced Cinematic Hero Overlay
 * Combines gradient, star haze, and subtle vignette for cinematic depth
 * ADDITIONS ONLY - New component
 */
export default function CinematicHeroOverlayEnhanced({ 
  intensity = 'medium',
  className = '' 
}: CinematicHeroOverlayEnhancedProps) {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Star haze count based on intensity
  const starCount = reducedMotion 
    ? 30 
    : intensity === 'strong' 
      ? 180 
      : intensity === 'medium' 
        ? 120 
        : 80

  return (
    <div className={`absolute inset-0 pointer-events-none cinematic-hero-overlay-enhanced ${className}`}>
      {/* Multi-layer Cinematic Gradient Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at top, rgba(139, 92, 246, 0.3) 0%, transparent 60%),
            radial-gradient(ellipse 80% 50% at bottom, rgba(59, 130, 246, 0.3) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at center, rgba(168, 85, 247, 0.2) 0%, transparent 70%),
            linear-gradient(to bottom, transparent 0%, rgba(10, 14, 39, 0.5) 50%, rgba(10, 14, 39, 0.7) 100%)
          `
        }}
      />

      {/* Subtle Vignette Effect - Dark edges for cinematic focus */}
      <div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 100% 100% at center, transparent 30%, rgba(0, 0, 0, 0.3) 100%)`
        }}
      />

      {/* Enhanced Star Haze Layer */}
      <div className="absolute inset-0 opacity-60">
        {[...Array(starCount)].map((_, i) => {
          const size = Math.random() * 1.5 + 0.5
          const delay = Math.random() * 5
          const duration = reducedMotion ? 0 : Math.random() * 3 + 2
          const glowSize = size * 3
          
          return (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${size}px`,
                height: `${size}px`,
                opacity: Math.random() * 0.6 + 0.4,
                animation: reducedMotion 
                  ? 'none' 
                  : `star-twinkle-enhanced ${duration}s ease-in-out infinite`,
                animationDelay: `${delay}s`,
                boxShadow: `0 0 ${glowSize}px rgba(255, 255, 255, 0.7)`,
              }}
            >
              <div className="w-full h-full bg-white rounded-full" />
            </div>
          )
        })}
      </div>

      {/* Atmospheric Haze - Subtle color layers for depth */}
      <div 
        className="absolute inset-0 opacity-25"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.08) 0%, transparent 60%)
          `
        }}
      />
    </div>
  )
}
