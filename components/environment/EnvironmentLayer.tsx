'use client'

import { useEffect, useState } from 'react'
import './Starfield.css'

/**
 * EnvironmentLayer - Always-on background environment
 * 
 * Features:
 * - Fixed position covering entire viewport
 * - Gradient + noise overlay + CSS stars
 * - Respects prefers-reduced-motion
 * - No pointer events blocking
 */
export default function EnvironmentLayer() {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    // Detect user's motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return (
    <div 
      className="environment-layer"
      data-reduced-motion={reducedMotion}
    >
      {/* Deep space gradient */}
      <div className="environment-gradient" />
      
      {/* CSS Starfield */}
      <div className={`environment-stars ${reducedMotion ? 'static' : 'animated'}`} />
      
      {/* Noise overlay for texture */}
      <div className="environment-noise" />
    </div>
  )
}
