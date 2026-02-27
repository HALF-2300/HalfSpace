'use client'

import { useState, ReactNode } from 'react'

interface SimpleTooltipProps {
  content: string
  children: ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

export default function SimpleTooltip({
  content,
  children,
  position = 'top',
  className = ''
}: SimpleTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={`
            absolute z-50 px-3 py-2 text-sm text-white bg-space-dark/95 
            border border-purple-500/50 rounded-lg shadow-lg
            pointer-events-none whitespace-nowrap
            backdrop-blur-sm
            ${positionClasses[position]}
            animate-fade-in
          `}
          role="tooltip"
          aria-hidden="true"
        >
          {content}
          {/* Arrow */}
          <div
            className={`
              absolute w-2 h-2 bg-space-dark/95 border-purple-500/50
              ${position === 'top' ? 'top-full left-1/2 -translate-x-1/2 border-r border-b' : ''}
              ${position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 border-l border-t' : ''}
              ${position === 'left' ? 'left-full top-1/2 -translate-y-1/2 border-r border-t' : ''}
              ${position === 'right' ? 'right-full top-1/2 -translate-y-1/2 border-l border-b' : ''}
              rotate-45
            `}
          />
        </div>
      )}
    </div>
  )
}
