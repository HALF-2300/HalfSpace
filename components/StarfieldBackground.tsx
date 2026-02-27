'use client'

import { useEffect, useState, useRef } from 'react'

interface StarfieldBackgroundProps {
  intensity?: 'very-light' | 'light' | 'medium'
  className?: string
}

/**
 * Light Starfield Background with Intensity Toggle
 * ADDITIONS ONLY - New component
 */
export default function StarfieldBackground({ 
  intensity = 'very-light',
  className = '' 
}: StarfieldBackgroundProps) {
  const [reducedMotion, setReducedMotion] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

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

  // Star count based on intensity
  const starCount = reducedMotion 
    ? 20 
    : intensity === 'medium' 
      ? 100 
      : intensity === 'light' 
        ? 60 
        : 40

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none starfield-background ${className}`}
      aria-hidden="true"
    >
      {[...Array(starCount)].map((_, i) => {
        const size = Math.random() * 1 + 0.3
        const delay = Math.random() * 5
        const duration = reducedMotion ? 0 : Math.random() * 4 + 3
        
        return (
          <div
            key={i}
            className="absolute rounded-full starfield-star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${size}px`,
              height: `${size}px`,
              opacity: Math.random() * 0.4 + 0.2,
              animation: reducedMotion 
                ? 'none' 
                : `starfield-twinkle ${duration}s ease-in-out infinite`,
              animationDelay: `${delay}s`,
            }}
          >
            <div className="w-full h-full bg-white rounded-full" />
          </div>
        )
      })}
    </div>
  )
}
