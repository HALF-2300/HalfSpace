'use client'

import { useEffect, useRef, useState } from 'react'

interface HeroCinematicOverlayProps {
  children: React.ReactNode
  className?: string
  intensity?: 'light' | 'medium' | 'heavy'
  showStarHaze?: boolean
}

export default function HeroCinematicOverlay({
  children,
  className = '',
  intensity = 'medium',
  showStarHaze = true
}: HeroCinematicOverlayProps) {
  const [reducedMotion, setReducedMotion] = useState(false)
  const starHazeRef = useRef<HTMLDivElement>(null)

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

  // Generate star haze stars
  useEffect(() => {
    if (!showStarHaze || reducedMotion || !starHazeRef.current) return

    const starCount = 30
    const stars: HTMLDivElement[] = []

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div')
      star.className = 'star-haze-star'
      star.style.left = `${Math.random() * 100}%`
      star.style.top = `${Math.random() * 100}%`
      star.style.animationDelay = `${Math.random() * 3}s`
      star.style.opacity = `${Math.random() * 0.6 + 0.2}`
      stars.push(star)
      starHazeRef.current.appendChild(star)
    }

    return () => {
      stars.forEach(star => star.remove())
    }
  }, [showStarHaze, reducedMotion])

  const overlayIntensity = {
    light: {
      gradient: 'rgba(10, 14, 39, 0.3)',
      vignette: 'rgba(0, 0, 0, 0.15)'
    },
    medium: {
      gradient: 'rgba(10, 14, 39, 0.5)',
      vignette: 'rgba(0, 0, 0, 0.3)'
    },
    heavy: {
      gradient: 'rgba(10, 14, 39, 0.7)',
      vignette: 'rgba(0, 0, 0, 0.5)'
    }
  }

  const currentIntensity = overlayIntensity[intensity]

  return (
    <div className={`relative ${className}`}>
      {/* Multi-layer gradient overlay */}
      <div 
        className="hero-cinematic-gradient absolute inset-0 pointer-events-none z-10"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at top, rgba(139, 92, 246, 0.3) 0%, transparent 60%),
            radial-gradient(ellipse 80% 50% at bottom, rgba(59, 130, 246, 0.3) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at center, rgba(168, 85, 247, 0.2) 0%, transparent 70%),
            linear-gradient(to bottom, transparent 0%, ${currentIntensity.gradient} 50%, ${currentIntensity.gradient} 100%)
          `
        }}
      />

      {/* Star haze layer */}
      {showStarHaze && !reducedMotion && (
        <div 
          ref={starHazeRef}
          className="hero-star-haze absolute inset-0 pointer-events-none z-10"
          style={{ opacity: 0.6 }}
        />
      )}

      {/* Vignette effect */}
      <div 
        className="hero-vignette absolute inset-0 pointer-events-none z-10"
        style={{
          background: `radial-gradient(
            ellipse 100% 100% at center,
            transparent 0%,
            transparent 40%,
            ${currentIntensity.vignette} 100%
          )`
        }}
      />

      {/* Content with enhanced readability */}
      <div className="relative z-20 space-text-readable-strong">
        {children}
      </div>
    </div>
  )
}
