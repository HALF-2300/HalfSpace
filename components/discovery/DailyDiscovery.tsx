'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './DailyDiscovery.module.css'
import {
  getDailyFact,
  getDailyJump,
  markFactViewed,
  toggleFavorite,
  isFavorite,
  getDiscoveryStats,
  DailyFact,
  DailyJump
} from '@/lib/dailyDiscovery'
import { markTodayComplete, checkStreak } from '@/lib/cosmicStreak'

interface DailyDiscoveryProps {
  onComplete?: () => void
  showJump?: boolean
  compact?: boolean
}

export default function DailyDiscovery({ onComplete, showJump = true, compact = false }: DailyDiscoveryProps) {
  const [fact, setFact] = useState<DailyFact | null>(null)
  const [jump, setJump] = useState<DailyJump | null>(null)
  const [isRevealed, setIsRevealed] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [stats, setStats] = useState({ totalFacts: 0, viewedFacts: 0, percentComplete: 0 })
  const [showExplanation, setShowExplanation] = useState(false)

  useEffect(() => {
    const todaysFact = getDailyFact()
    setFact(todaysFact)
    setIsFavorited(isFavorite(todaysFact.id))
    setStats(getDiscoveryStats())

    if (showJump) {
      setJump(getDailyJump())
    }
  }, [showJump])

  const handleReveal = () => {
    if (!fact) return
    
    setIsRevealed(true)
    markFactViewed(fact.id)
    
    // Mark streak as complete
    const status = markTodayComplete()
    setStats(getDiscoveryStats())
    
    onComplete?.()
  }

  const handleToggleFavorite = () => {
    if (!fact) return
    const newState = toggleFavorite(fact.id)
    setIsFavorited(newState)
  }

  if (!fact) {
    return (
      <div className={styles.loading}>
        <span className={styles.loadingIcon}>✨</span>
        <span>Loading today&apos;s discovery...</span>
      </div>
    )
  }

  if (compact) {
    return (
      <div className={styles.compactCard}>
        <div className={styles.compactHeader}>
          <span className={styles.compactIcon}>{fact.icon}</span>
          <span className={styles.compactLabel}>Today&apos;s Discovery</span>
        </div>
        <p className={styles.compactHook}>{fact.hook}</p>
        <button 
          className={styles.compactButton}
          onClick={() => setShowExplanation(!showExplanation)}
        >
          {showExplanation ? 'Hide' : 'Learn More'}
        </button>
        {showExplanation && (
          <p className={styles.compactExplanation}>{fact.explanation}</p>
        )}
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Daily Fact Card */}
      <div className={`${styles.factCard} ${isRevealed ? styles.revealed : ''}`}>
        <div className={styles.cardHeader}>
          <div className={styles.dateLabel}>
            <span className={styles.todayIcon}>📅</span>
            <span>Today&apos;s Discovery</span>
          </div>
          <div className={styles.category}>
            <span>{fact.categoryIcon}</span>
            <span>{fact.categoryName}</span>
          </div>
        </div>

        {!isRevealed ? (
          /* Mystery State */
          <div className={styles.mysteryContainer}>
            <div className={styles.mysteryIcon}>
              <span className={styles.questionMark}>?</span>
              <div className={styles.mysteryGlow} />
            </div>
            <h3 className={styles.mysteryTitle}>A new cosmic truth awaits</h3>
            <p className={styles.mysterySubtitle}>Tap to reveal today&apos;s mind-blowing discovery</p>
            <button className={styles.revealButton} onClick={handleReveal}>
              <span className={styles.revealIcon}>✨</span>
              <span>Reveal Discovery</span>
            </button>
          </div>
        ) : (
          /* Revealed State */
          <div className={styles.revealedContent}>
            <div className={styles.factIcon}>{fact.icon}</div>
            
            <h2 className={styles.factHook}>{fact.hook}</h2>
            
            <div className={styles.explanationContainer}>
              <p className={styles.explanation}>{fact.explanation}</p>
            </div>

            <div className={styles.impactBadge} data-impact={fact.impact}>
              <span>{fact.impact}</span>
            </div>

            <div className={styles.actionRow}>
              <button 
                className={`${styles.favoriteButton} ${isFavorited ? styles.favorited : ''}`}
                onClick={handleToggleFavorite}
              >
                <span>{isFavorited ? '❤️' : '🤍'}</span>
                <span>{isFavorited ? 'Saved' : 'Save'}</span>
              </button>
              
              <button className={styles.shareButton}>
                <span>📤</span>
                <span>Share</span>
              </button>
            </div>
          </div>
        )}

        {/* Progress Footer */}
        <div className={styles.progressFooter}>
          <div className={styles.progressInfo}>
            <span className={styles.progressText}>
              {stats.viewedFacts} of {stats.totalFacts} discoveries
            </span>
            <span className={styles.progressPercent}>{stats.percentComplete}%</span>
          </div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${stats.percentComplete}%` }}
            />
          </div>
        </div>
      </div>

      {/* Daily Jump Section */}
      {showJump && jump && isRevealed && (
        <div className={styles.jumpCard}>
          <div className={styles.jumpHeader}>
            <span className={styles.jumpIcon}>🎲</span>
            <span className={styles.jumpLabel}>Today&apos;s Random Jump</span>
          </div>
          
          <Link href={jump.url} className={styles.jumpDestination}>
            <span className={styles.destinationIcon}>{jump.icon}</span>
            <div className={styles.destinationInfo}>
              <h4 className={styles.destinationTitle}>{jump.title}</h4>
              <p className={styles.destinationDesc}>{jump.description}</p>
            </div>
            <span className={styles.jumpArrow}>→</span>
          </Link>
        </div>
      )}
    </div>
  )
}

// Minimal version for homepage
export function DailyDiscoveryMini() {
  const [fact, setFact] = useState<DailyFact | null>(null)

  useEffect(() => {
    setFact(getDailyFact())
  }, [])

  if (!fact) return null

  return (
    <div className={styles.miniCard}>
      <div className={styles.miniHeader}>
        <span className={styles.miniIcon}>{fact.icon}</span>
        <span className={styles.miniLabel}>Daily Discovery</span>
      </div>
      <p className={styles.miniHook}>{fact.hook}</p>
      <Link href="/today" className={styles.miniLink}>
        Learn more →
      </Link>
    </div>
  )
}

// Countdown to next discovery
export function NextDiscoveryCountdown() {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)
      
      const diff = tomorrow.getTime() - now.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={styles.countdown}>
      <span className={styles.countdownLabel}>Next discovery in</span>
      <span className={styles.countdownTime}>{timeLeft}</span>
    </div>
  )
}
