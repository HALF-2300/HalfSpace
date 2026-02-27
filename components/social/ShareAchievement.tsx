'use client'

import { useState, useEffect } from 'react'
import styles from './Social.module.css'
import { generateShareableAchievement, shareAchievement, ShareableAchievement } from '@/lib/socialLayer'

export default function ShareAchievement() {
  const [achievement, setAchievement] = useState<ShareableAchievement | null>(null)
  const [copied, setCopied] = useState(false)
  const [isSharing, setIsSharing] = useState(false)

  useEffect(() => {
    setAchievement(generateShareableAchievement())
  }, [])

  const handleShare = async () => {
    setIsSharing(true)
    const success = await shareAchievement()
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    }
    setIsSharing(false)
  }

  if (!achievement) return null

  return (
    <div className={styles.shareContainer}>
      <h3 className={styles.shareTitle}>Share Your Journey</h3>
      
      {/* Achievement Card Preview */}
      <div className={styles.achievementCard}>
        <div className={styles.achievementGlow} />
        <div className={styles.achievementBadge}>{achievement.badge}</div>
        <h4 className={styles.achievementTitle}>{achievement.title}</h4>
        
        <div className={styles.achievementStats}>
          <div className={styles.achievementStat}>
            <span className={styles.statValue}>{achievement.stats.streak}</span>
            <span className={styles.statLabel}>Day Streak</span>
          </div>
          <div className={styles.achievementStat}>
            <span className={styles.statValue}>{achievement.stats.discoveries}</span>
            <span className={styles.statLabel}>Discoveries</span>
          </div>
          <div className={styles.achievementStat}>
            <span className={styles.statValue}>{achievement.stats.daysActive}</span>
            <span className={styles.statLabel}>Days Active</span>
          </div>
        </div>

        <div className={styles.achievementBrand}>
          <span className={styles.brandIcon}>🌌</span>
          <span className={styles.brandName}>HalfSpace</span>
        </div>
      </div>

      {/* Share Button */}
      <button
        className={`${styles.shareButton} ${copied ? styles.shared : ''}`}
        onClick={handleShare}
        disabled={isSharing}
      >
        {copied ? (
          <>
            <span>✓</span>
            <span>Copied to clipboard!</span>
          </>
        ) : isSharing ? (
          <>
            <span>...</span>
            <span>Sharing</span>
          </>
        ) : (
          <>
            <span>📤</span>
            <span>Share Achievement</span>
          </>
        )}
      </button>

      <p className={styles.shareHint}>
        Share your cosmic journey with friends
      </p>
    </div>
  )
}

// Mini version for embedding
export function ShareAchievementMini() {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const success = await shareAchievement()
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      className={styles.shareMiniButton}
      onClick={handleShare}
    >
      {copied ? '✓ Copied!' : '📤 Share Journey'}
    </button>
  )
}
