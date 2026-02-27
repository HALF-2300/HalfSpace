'use client'

import { useEffect, useState } from 'react'
import styles from './StreakCelebration.module.css'
import { StreakMilestone } from '@/lib/cosmicStreak'

interface StreakCelebrationProps {
  milestone: StreakMilestone
  onClose: () => void
}

export default function StreakCelebration({ milestone, onClose }: StreakCelebrationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])

  useEffect(() => {
    // Generate particles based on celebration level
    const particleCount = 
      milestone.celebration === 'epic' ? 50 :
      milestone.celebration === 'large' ? 30 :
      milestone.celebration === 'medium' ? 20 : 10

    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 0.5
    }))
    setParticles(newParticles)

    // Trigger entrance animation
    requestAnimationFrame(() => {
      setIsVisible(true)
    })

    // Play celebration sound
    playSound(milestone.celebration)
  }, [milestone])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  const playSound = (level: string) => {
    // Create a simple tone based on celebration level
    if (typeof window === 'undefined') return
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      // Different tones for different celebration levels
      const baseFreq = level === 'epic' ? 523.25 : level === 'large' ? 440 : level === 'medium' ? 392 : 349.23
      
      oscillator.frequency.setValueAtTime(baseFreq, audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, audioContext.currentTime + 0.1)
      oscillator.frequency.exponentialRampToValueAtTime(baseFreq * 2, audioContext.currentTime + 0.2)

      gainNode.gain.setValueAtTime(0.15, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

      oscillator.start()
      oscillator.stop(audioContext.currentTime + 0.5)
    } catch {
      // Silently fail if audio context not available
    }
  }

  return (
    <div className={`${styles.overlay} ${isVisible ? styles.visible : ''}`} onClick={handleClose}>
      <div className={styles.particleContainer}>
        {particles.map((p) => (
          <span 
            key={p.id}
            className={styles.particle}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              animationDelay: `${p.delay}s`
            }}
          >
            {['✨', '⭐', '🌟', '💫'][Math.floor(Math.random() * 4)]}
          </span>
        ))}
      </div>

      <div 
        className={`${styles.card} ${styles[milestone.celebration]}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.badgeContainer}>
          <div className={styles.badgeGlow} />
          <span className={styles.badge}>{milestone.badge}</span>
          <div className={styles.badgeRing} />
        </div>

        <h2 className={styles.title}>{milestone.title}</h2>
        <p className={styles.description}>{milestone.description}</p>
        
        <div className={styles.daysCount}>
          <span className={styles.daysNumber}>{milestone.days}</span>
          <span className={styles.daysLabel}>day streak</span>
        </div>

        {milestone.reward && (
          <div className={styles.reward}>
            <span className={styles.rewardLabel}>Reward:</span>
            {milestone.reward.type === 'freeze' && (
              <span className={styles.rewardValue}>
                +{milestone.reward.value} ❄️ Streak Freeze{milestone.reward.value !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}

        <button className={styles.continueButton} onClick={handleClose}>
          Continue Exploring
        </button>

        <p className={styles.shareHint}>
          Share your achievement with the cosmos
        </p>
      </div>
    </div>
  )
}
