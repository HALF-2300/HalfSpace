'use client'

import { useEffect, useState } from 'react'
import { useStarfieldIntensity } from './EasterEggStarMode'

interface StarfieldProps {
  intensity?: 'light' | 'medium'
  className?: string
  useStarMode?: boolean
}

export default function Starfield({ intensity, className = '', useStarMode = true }: StarfieldProps) {
  const starModeIntensity = useStarfieldIntensity()
  const effectiveIntensity: 'light' | 'medium' = useStarMode ? starModeIntensity : intensity || 'light'
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Performance-optimized star count
  const starCount = reducedMotion ? 80 : effectiveIntensity === 'medium' ? 200 : 150

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {[...Array(starCount)].map((_, i) => {
        const size = Math.random() * 2 + 0.5
        const delay = Math.random() * 5
        const duration = reducedMotion ? 0 : Math.random() * 4 + 3
        const x = Math.random() * 100
        const y = Math.random() * 100
        
        return (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${size}px`,
              height: `${size}px`,
              opacity: Math.random() * 0.4 + 0.2,
              animation: reducedMotion 
                ? 'none' 
                : `starfield-twinkle ${duration}s ease-in-out infinite`,
              animationDelay: `${delay}s`,
              willChange: reducedMotion ? 'auto' : 'opacity',
            }}
          />
        )
      })}
    </div>
  )
}
