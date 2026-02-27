'use client'

import React from 'react'
import TwinSigil from './TwinSigil'

export default function TwinVerseSignature({ 
  position = 'bottom-right',
  minimal = true 
}: { 
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  minimal?: boolean 
}) {
  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
  }

  if (minimal) {
    return (
      <div 
        className={`fixed ${positionClasses[position]} z-40 pointer-events-none`}
        aria-hidden="true"
      >
        <div className="opacity-60 hover:opacity-100 transition-opacity duration-300">
          <TwinSigil size={40} />
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`fixed ${positionClasses[position]} z-40 pointer-events-none`}
      aria-hidden="true"
    >
      <div className="relative">
        {/* Minimal starfield effect around sigil */}
        <div className="absolute inset-0 -z-10">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 1.5 + 0.5}px`,
                height: `${Math.random() * 1.5 + 0.5}px`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 2 + 2}s`,
                opacity: 0.4,
              }}
            />
          ))}
        </div>
        <div className="opacity-70 hover:opacity-100 transition-opacity duration-300">
          <TwinSigil size={48} />
        </div>
      </div>
    </div>
  )
}
