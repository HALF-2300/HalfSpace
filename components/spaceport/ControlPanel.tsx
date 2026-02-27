'use client'

import { useState } from 'react'
import styles from './spaceport.module.css'

interface ControlPanelProps {
  quality: 'low' | 'medium' | 'high'
  animationEnabled: boolean
  starDensity: number
  onQualityChange: (quality: 'low' | 'medium' | 'high') => void
  onAnimationToggle: (enabled: boolean) => void
  onDensityChange: (density: number) => void
}

export default function ControlPanel({
  quality,
  animationEnabled,
  starDensity,
  onQualityChange,
  onAnimationToggle,
  onDensityChange
}: ControlPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Toggle Button */}
      <button 
        className={styles.controlToggle}
        onClick={() => setIsOpen(!isOpen)}
        title="Control Panel"
      >
        ⚙️
      </button>

      {/* Control Panel */}
      <div className={`${styles.controlPanel} ${isOpen ? styles.controlPanelOpen : ''}`}>
        <div className={styles.controlHeader}>
          <h3>⚙️ Control Panel</h3>
          <button 
            className={styles.controlClose}
            onClick={() => setIsOpen(false)}
          >
            ×
          </button>
        </div>

        <div className={styles.controlBody}>
          {/* Quality Setting */}
          <div className={styles.controlGroup}>
            <label className={styles.controlLabel}>
              🎨 Visual Quality
              <span className={styles.controlSubtext}>Affects performance</span>
            </label>
            <div className={styles.controlButtons}>
              <button
                className={`${styles.controlButton} ${quality === 'low' ? styles.controlButtonActive : ''}`}
                onClick={() => onQualityChange('low')}
              >
                Low
              </button>
              <button
                className={`${styles.controlButton} ${quality === 'medium' ? styles.controlButtonActive : ''}`}
                onClick={() => onQualityChange('medium')}
              >
                Medium
              </button>
              <button
                className={`${styles.controlButton} ${quality === 'high' ? styles.controlButtonActive : ''}`}
                onClick={() => onQualityChange('high')}
              >
                High
              </button>
            </div>
          </div>

          {/* Animation Toggle */}
          <div className={styles.controlGroup}>
            <label className={styles.controlLabel}>
              ✨ Animations
              <span className={styles.controlSubtext}>Star twinkling & motion</span>
            </label>
            <button
              className={`${styles.controlToggleButton} ${animationEnabled ? styles.toggleOn : styles.toggleOff}`}
              onClick={() => onAnimationToggle(!animationEnabled)}
            >
              <span className={styles.toggleSlider} />
              <span className={styles.toggleLabel}>
                {animationEnabled ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>

          {/* Star Density */}
          <div className={styles.controlGroup}>
            <label className={styles.controlLabel}>
              🌟 Star Density
              <span className={styles.controlSubtext}>Current: {Math.round(starDensity * 100)}%</span>
            </label>
            <input
              type="range"
              min="0.3"
              max="2"
              step="0.1"
              value={starDensity}
              onChange={(e) => onDensityChange(parseFloat(e.target.value))}
              className={styles.controlSlider}
            />
            <div className={styles.sliderLabels}>
              <span>Sparse</span>
              <span>Dense</span>
            </div>
          </div>

          {/* Performance Hint */}
          <div className={styles.controlHint}>
            <strong>💡 Performance Tip:</strong>
            <p>Lower quality and disable animations for better performance on slower devices.</p>
          </div>

          {/* Quick Presets */}
          <div className={styles.controlGroup}>
            <label className={styles.controlLabel}>
              ⚡ Quick Presets
            </label>
            <div className={styles.controlButtons}>
              <button
                className={styles.controlPreset}
                onClick={() => {
                  onQualityChange('low')
                  onAnimationToggle(false)
                  onDensityChange(0.5)
                }}
              >
                🚀 Performance
              </button>
              <button
                className={styles.controlPreset}
                onClick={() => {
                  onQualityChange('medium')
                  onAnimationToggle(true)
                  onDensityChange(1)
                }}
              >
                ⚖️ Balanced
              </button>
              <button
                className={styles.controlPreset}
                onClick={() => {
                  onQualityChange('high')
                  onAnimationToggle(true)
                  onDensityChange(1.5)
                }}
              >
                ✨ Cinematic
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className={styles.controlOverlay}
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
