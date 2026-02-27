'use client'

import React, { useEffect, useState } from 'react'
import './jumpToast.css'

export interface JumpToastProps {
  title: string
  icon: string
  category: string
  isVisible: boolean
  onHide: () => void
}

/**
 * JumpToast - "Arrived at..." notification
 * 
 * Shows when user jumps to a random destination.
 * Creates a sense of discovery and place.
 */
export default function JumpToast({ title, icon, category, isVisible, onHide }: JumpToastProps) {
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true)
      // Auto-hide after 3.5 seconds
      const timer = setTimeout(() => {
        onHide()
      }, 3500)
      return () => clearTimeout(timer)
    } else {
      // Delay unmounting to allow exit animation
      const timer = setTimeout(() => {
        setShouldRender(false)
      }, 400)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onHide])

  if (!shouldRender) return null

  return (
    <div 
      className={`jump-toast ${isVisible ? 'jump-toast-enter' : 'jump-toast-exit'}`}
      role="status"
      aria-live="polite"
    >
      <div className="jump-toast-content">
        {/* Icon with pulse effect */}
        <div className="jump-toast-icon">
          <span className="jump-toast-icon-pulse" />
          <span className="jump-toast-icon-emoji">{icon}</span>
        </div>

        {/* Text content */}
        <div className="jump-toast-text">
          <div className="jump-toast-label">Arrived at</div>
          <div className="jump-toast-title">{title}</div>
          <div className="jump-toast-category">{category}</div>
        </div>

        {/* Warp lines animation */}
        <div className="jump-toast-warp-lines">
          <div className="jump-toast-warp-line" style={{ animationDelay: '0ms' }} />
          <div className="jump-toast-warp-line" style={{ animationDelay: '50ms' }} />
          <div className="jump-toast-warp-line" style={{ animationDelay: '100ms' }} />
        </div>
      </div>
    </div>
  )
}
