'use client'

import { useState, useEffect } from 'react'
import CanvasStarfield from '@/components/space/CanvasStarfield'
import '@/app/space/theme/space-theme.css'

interface SpaceStarfieldToggleProps {
  defaultIntensity?: 'off' | 'low' | 'medium' | 'high'
  showToggle?: boolean
  className?: string
}

export default function SpaceStarfieldToggle({
  defaultIntensity = 'medium',
  showToggle = true,
  className = '',
}: SpaceStarfieldToggleProps) {
  const [intensity, setIntensity] = useState<'off' | 'low' | 'medium' | 'high'>(defaultIntensity)

  const intensityMap = {
    off: null,
    low: 'low' as const,
    medium: 'medium' as const,
    high: 'high' as const,
  }

  const intensityLabels = {
    off: 'Off',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
  }

  return (
    <>
      {/* Starfield Background */}
      {intensity !== 'off' && (
        <div className={`space-starfield-container ${className}`}>
          <CanvasStarfield intensity={intensityMap[intensity]!} />
        </div>
      )}

      {/* Toggle Control */}
      {showToggle && (
        <div className="space-starfield-toggle">
          <div className="space-toggle-label">Starfield</div>
          <div className="space-toggle-buttons">
            {(['off', 'low', 'medium', 'high'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setIntensity(level)}
                className={`space-toggle-btn space-button-glow ${
                  intensity === level ? 'active' : ''
                }`}
                aria-label={`Set starfield intensity to ${intensityLabels[level]}`}
              >
                {level === 'off' ? '●' : '✦'}
              </button>
            ))}
          </div>
          <div className="space-toggle-intensity">
            {intensityLabels[intensity]}
          </div>
        </div>
      )}

      <style jsx>{`
        .space-starfield-container {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }

        .space-starfield-toggle {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 100;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          background: var(--space-bg-glass);
          backdrop-filter: var(--space-blur-md);
          -webkit-backdrop-filter: var(--space-blur-md);
          border: var(--space-border-width) solid var(--space-border-color);
          border-radius: var(--space-border-radius-lg);
          box-shadow: var(--space-shadow-lg);
        }

        .space-toggle-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--space-text-tertiary);
          font-weight: 600;
        }

        .space-toggle-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .space-toggle-btn {
          width: 2.5rem;
          height: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--space-border-color);
          border-radius: var(--space-border-radius-sm);
          color: var(--space-text-secondary);
          font-size: 1rem;
          cursor: pointer;
          transition: all var(--space-transition-base);
        }

        .space-toggle-btn:hover {
          background: rgba(139, 92, 246, 0.1);
          border-color: var(--space-border-color-hover);
          transform: scale(1.1);
        }

        .space-toggle-btn.active {
          background: rgba(139, 92, 246, 0.2);
          border-color: var(--space-purple);
          color: var(--space-purple-light);
          box-shadow: var(--space-shadow-glow);
        }

        .space-toggle-intensity {
          font-size: 0.75rem;
          color: var(--space-text-secondary);
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .space-starfield-toggle {
            bottom: 1rem;
            right: 1rem;
            padding: 0.75rem;
          }

          .space-toggle-btn {
            width: 2rem;
            height: 2rem;
            font-size: 0.875rem;
          }
        }
      `}</style>
    </>
  )
}
