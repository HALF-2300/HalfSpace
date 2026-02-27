'use client'

import { useEffect, useState } from 'react'

interface HeroOverlayProps {
  intensity?: 'light' | 'medium'
}

export default function HeroOverlay({ intensity = 'light' }: HeroOverlayProps) {
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

  // Star haze effect - subtle and performant
  const starCount = reducedMotion ? 50 : intensity === 'medium' ? 120 : 80

  return (
    <>
      {/* Enhanced Cinematic Gradient Overlay - Multi-layer depth */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at top, rgba(139, 92, 246, 0.25) 0%, transparent 60%),
            radial-gradient(ellipse 80% 50% at bottom, rgba(59, 130, 246, 0.25) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at center, rgba(168, 85, 247, 0.15) 0%, transparent 70%),
            linear-gradient(to bottom, transparent 0%, rgba(10, 14, 39, 0.4) 50%, rgba(10, 14, 39, 0.6) 100%)
          `
        }}
      />

      {/* Star Haze Layer - Enhanced with glow */}
      <div className="absolute inset-0 pointer-events-none opacity-50">
        {[...Array(starCount)].map((_, i) => {
          const size = Math.random() * 1.5 + 0.5
          const delay = Math.random() * 5
          const duration = reducedMotion ? 0 : Math.random() * 3 + 2
          const glowSize = size * 2
          
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
                  : `twinkle ${duration}s ease-in-out infinite`,
                animationDelay: `${delay}s`,
                boxShadow: `0 0 ${glowSize}px rgba(255, 255, 255, 0.5)`,
              }}
            >
              <div className="w-full h-full bg-white rounded-full" />
            </div>
          )
        })}
      </div>

      {/* Atmospheric Haze - Subtle color layers */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)
          `
        }}
      />
    </>
  )
}
