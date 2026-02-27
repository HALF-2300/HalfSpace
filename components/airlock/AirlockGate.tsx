'use client'

import React, { useEffect, useMemo, useState } from 'react'
import './airlock.css'

/**
 * AirlockGate - Entry ritual component
 * 
 * Creates a memorable "arrival" experience on first visit:
 * - Shows 900-1200ms overlay transition
 * - Only plays once per session (uses sessionStorage)
 * - Respects prefers-reduced-motion (200ms fade or skip)
 * - No layout shift, non-blocking
 * 
 * Philosophy: Users expect a website, discover a station.
 */

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
}

interface AirlockGateProps {
  children: React.ReactNode
}

export default function AirlockGate({ children }: AirlockGateProps) {
  const [showOverlay, setShowOverlay] = useState(false)
  const reducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false
    return prefersReducedMotion()
  }, [])

  useEffect(() => {
    // Skip if user prefers reduced motion
    if (reducedMotion) {
      return
    }

    // Check if airlock has been seen this session
    const seen = sessionStorage.getItem('hs_airlock_seen')
    if (seen) {
      return
    }

    // Mark as seen and show the overlay
    sessionStorage.setItem('hs_airlock_seen', '1')
    setShowOverlay(true)

    // Hide after 1100ms
    const timer = setTimeout(() => {
      setShowOverlay(false)
    }, 1100)

    return () => clearTimeout(timer)
  }, [reducedMotion])

  return (
    <>
      {showOverlay && <AirlockOverlay />}
      {children}
    </>
  )
}

/**
 * The actual overlay that creates the "airlock" effect
 */
function AirlockOverlay() {
  return (
    <div
      className="airlock-overlay"
      aria-hidden="true"
      role="presentation"
    >
      {/* Scanning lines effect */}
      <div className="airlock-scan-line" />
      
      {/* Central glow */}
      <div className="airlock-glow" />
      
      {/* Station initialization text */}
      <div className="airlock-text">
        <div className="airlock-text-line">INITIALIZING</div>
        <div className="airlock-text-line airlock-text-line-delayed">HALFSPACE SYSTEMS</div>
      </div>
    </div>
  )
}
