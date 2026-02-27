'use client'

import { useEffect, useState } from 'react'

interface SpaceSectionSeparatorProps {
  variant?: 'subtle' | 'medium' | 'strong'
  className?: string
}

/**
 * Space-themed Section Separator
 * Subtle divider between sections with space aesthetic
 * ADDITIONS ONLY - New component
 */
export default function SpaceSectionSeparator({ 
  variant = 'subtle',
  className = '' 
}: SpaceSectionSeparatorProps) {
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

  const opacity = variant === 'strong' ? 0.4 : variant === 'medium' ? 0.25 : 0.15

  return (
    <div 
      className={`relative w-full py-8 space-section-separator ${className}`}
      aria-hidden="true"
    >
      <div className="relative flex items-center justify-center">
        {/* Central glow */}
        <div 
          className="absolute w-32 h-px"
          style={{
            background: `linear-gradient(to right, transparent, rgba(139, 92, 246, ${opacity}), transparent)`,
          }}
        />
        
        {/* Side lines */}
        <div className="absolute left-0 right-0 h-px flex items-center">
          <div 
            className="flex-1 h-px"
            style={{
              background: `linear-gradient(to right, transparent, rgba(139, 92, 246, ${opacity * 0.5}))`,
            }}
          />
          <div 
            className="w-32 h-px"
            style={{
              background: `linear-gradient(to right, rgba(139, 92, 246, ${opacity * 0.5}), rgba(59, 130, 246, ${opacity * 0.5}), rgba(139, 92, 246, ${opacity * 0.5}))`,
            }}
          />
          <div 
            className="flex-1 h-px"
            style={{
              background: `linear-gradient(to left, transparent, rgba(59, 130, 246, ${opacity * 0.5}))`,
            }}
          />
        </div>

        {/* Decorative stars */}
        {!reducedMotion && (
          <>
            <div 
              className="absolute left-1/4 w-1 h-1 bg-purple-400 rounded-full opacity-60"
              style={{
                animation: 'star-pulse 3s ease-in-out infinite',
                animationDelay: '0s',
              }}
            />
            <div 
              className="absolute right-1/4 w-1 h-1 bg-blue-400 rounded-full opacity-60"
              style={{
                animation: 'star-pulse 3s ease-in-out infinite',
                animationDelay: '1.5s',
              }}
            />
          </>
        )}
      </div>
    </div>
  )
}
