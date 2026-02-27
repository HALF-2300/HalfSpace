'use client'

import { useState, useEffect, useRef } from 'react'

interface StarfieldToggleProps {
  defaultIntensity?: 'light' | 'medium' | 'high'
  className?: string
}

/**
 * Starfield Background Component with Intensity Toggle
 * Very light starfield background with toggle control
 */
export default function StarfieldToggle({ 
  defaultIntensity = 'light',
  className = '' 
}: StarfieldToggleProps) {
  const [intensity, setIntensity] = useState<'light' | 'medium' | 'high'>(defaultIntensity)
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

  // Generate stars - performance optimized
  useEffect(() => {
    if (!containerRef.current) return

    // Clear existing stars
    containerRef.current.innerHTML = ''

    // Star count based on intensity
    const starCount = reducedMotion ? 50 : intensity === 'high' ? 200 : intensity === 'medium' ? 150 : 100

    // Create stars
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div')
      star.className = 'star'
      
      const size = Math.random() * 1.5 + 0.5
      const x = Math.random() * 100
      const y = Math.random() * 100
      const delay = Math.random() * 5
      const duration = reducedMotion ? 0 : Math.random() * 3 + 2
      
      star.style.left = `${x}%`
      star.style.top = `${y}%`
      star.style.width = `${size}px`
      star.style.height = `${size}px`
      star.style.opacity = `${Math.random() * 0.4 + 0.2}`
      star.style.animationDelay = `${delay}s`
      
      if (!reducedMotion) {
        star.style.animation = `starfield-drift ${duration}s ease-in-out infinite`
      }
      
      containerRef.current.appendChild(star)
    }
  }, [intensity, reducedMotion])

  const cycleIntensity = () => {
    setIntensity(prev => {
      if (prev === 'light') return 'medium'
      if (prev === 'medium') return 'high'
      return 'light'
    })
  }

  return (
    <>
      <div 
        ref={containerRef}
        className={`starfield-background intensity-${intensity} ${className}`}
      />
      {/* Toggle Button - Fixed position, subtle */}
      <button
        onClick={cycleIntensity}
        className="fixed bottom-4 right-4 z-50 px-3 py-2 bg-space-dark/80 backdrop-blur-sm border border-purple-500/30 rounded-lg text-xs text-gray-300 hover:border-purple-500/60 hover:bg-space-dark transition-all enhanced-button-glow"
        aria-label={`Starfield intensity: ${intensity}. Click to change.`}
        title={`Starfield: ${intensity} (click to cycle)`}
      >
        ⭐ {intensity}
      </button>
    </>
  )
}
