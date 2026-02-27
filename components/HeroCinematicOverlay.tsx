'use client'

import { useEffect, useState } from 'react'

interface HeroCinematicOverlayProps {
  intensity?: 'light' | 'medium'
  className?: string
}

/**
 * Enhanced Cinematic Hero Overlay
 * Combines gradient, star haze, and subtle vignette for cinematic depth
 */
export default function HeroCinematicOverlay({ 
  intensity = 'medium',
  className = '' 
}: HeroCinematicOverlayProps) {
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
  const starCount = reducedMotion ? 50 : intensity === 'medium' ? 150 : 100

  return (
    <div className={`absolute inset-0 pointer-events-none hero-cinematic-overlay ${className}`}>
      {/* Multi-layer Cinematic Gradient Overlay */}
      <div className="hero-cinematic-gradient" />

      {/* Subtle Vignette Effect - Dark edges for cinematic focus */}
      <div className="hero-vignette" />

      {/* Enhanced Star Haze Layer - More stars with subtle glow */}
      <div className="absolute inset-0 hero-star-haze">
        {[...Array(starCount)].map((_, i) => {
          const size = Math.random() * 1.5 + 0.5
          const delay = Math.random() * 5
          const duration = reducedMotion ? 0 : Math.random() * 3 + 2
          const glowSize = size * 2.5
          
          return (
            <div
              key={i}
              className="star absolute rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${size}px`,
                height: `${size}px`,
                opacity: Math.random() * 0.6 + 0.4,
                animation: reducedMotion 
                  ? 'none' 
                  : `star-twinkle ${duration}s ease-in-out infinite`,
                animationDelay: `${delay}s`,
                boxShadow: `0 0 ${glowSize}px rgba(255, 255, 255, 0.6)`,
              }}
            >
              <div className="w-full h-full bg-white rounded-full" />
            </div>
          )
        })}
      </div>

      {/* Atmospheric Haze - Subtle color layers for depth */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, var(--space-aurora-purple) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, var(--space-aurora-blue) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.05) 0%, transparent 60%)
          `
        }}
      />
    </div>
  )
}
