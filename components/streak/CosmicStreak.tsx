'use client'

import { useState, useEffect } from 'react'
import styles from './CosmicStreak.module.css'
import {
  checkStreak,
  markTodayComplete,
  applyStreakFreeze,
  getProgressToNextMilestone,
  getCurrentTitle,
  StreakStatus,
  StreakMilestone,
  STREAK_MILESTONES
} from '@/lib/cosmicStreak'
import StreakCelebration from './StreakCelebration'

interface CosmicStreakProps {
  compact?: boolean
  showOnComplete?: boolean
  autoCheck?: boolean
  onStreakUpdate?: (status: StreakStatus) => void
}

export default function CosmicStreak({
  compact = false,
  showOnComplete = true,
  autoCheck = true,
  onStreakUpdate
}: CosmicStreakProps) {
  const [status, setStatus] = useState<StreakStatus | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationMilestone, setCelebrationMilestone] = useState<StreakMilestone | null>(null)
  const [showFreezePrompt, setShowFreezePrompt] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (autoCheck) {
      const streakStatus = checkStreak()
      setStatus(streakStatus)
      onStreakUpdate?.(streakStatus)

      // Show freeze prompt if streak is at risk
      if (streakStatus.streakAtRisk && streakStatus.data.streakFreezes > 0) {
        setShowFreezePrompt(true)
      }
    }
  }, [autoCheck, onStreakUpdate])

  const handleComplete = () => {
    setIsAnimating(true)
    
    setTimeout(() => {
      const newStatus = markTodayComplete()
      setStatus(newStatus)
      onStreakUpdate?.(newStatus)
      
      // Show celebration if new milestone
      if (newStatus.newMilestone && showOnComplete) {
        setCelebrationMilestone(newStatus.newMilestone)
        setShowCelebration(true)
      }
      
      setIsAnimating(false)
    }, 500)
  }

  const handleUseFreeze = () => {
    const success = applyStreakFreeze()
    if (success) {
      setShowFreezePrompt(false)
      const newStatus = checkStreak()
      setStatus(newStatus)
      onStreakUpdate?.(newStatus)
    }
  }

  const handleCloseCelebration = () => {
    setShowCelebration(false)
    setCelebrationMilestone(null)
  }

  if (!status) {
    return null
  }

  const progress = getProgressToNextMilestone(status.data)
  const currentTitle = getCurrentTitle(status.data)
  const { data, nextMilestone, daysUntilNextMilestone } = status

  if (compact) {
    return (
      <div className={styles.compactContainer}>
        <div className={`${styles.streakBadge} ${data.currentStreak > 0 ? styles.active : ''}`}>
          <span className={styles.cometIcon}>☄️</span>
          <span className={styles.streakCount}>{data.currentStreak}</span>
        </div>
        {!data.todayCompleted && (
          <button 
            className={styles.completeButtonCompact}
            onClick={handleComplete}
            disabled={isAnimating}
          >
            {isAnimating ? '...' : '+'}
          </button>
        )}
      </div>
    )
  }

  return (
    <>
      <div className={styles.container}>
        {/* Main Streak Display */}
        <div className={styles.streakCard}>
          <div className={styles.header}>
            <div className={`${styles.cometContainer} ${isAnimating ? styles.animating : ''}`}>
              <span className={styles.comet}>☄️</span>
              {data.currentStreak > 0 && (
                <div className={styles.streakFlame}>
                  {Array.from({ length: Math.min(data.currentStreak, 5) }).map((_, i) => (
                    <span key={i} className={styles.flameParticle} style={{ '--delay': i } as React.CSSProperties} />
                  ))}
                </div>
              )}
            </div>
            <div className={styles.streakInfo}>
              <span className={styles.streakNumber}>{data.currentStreak}</span>
              <span className={styles.streakLabel}>day streak</span>
            </div>
          </div>

          {/* Current Title */}
          {currentTitle && (
            <div className={styles.titleBadge}>
              <span className={styles.titleIcon}>{currentTitle.badge}</span>
              <span className={styles.titleText}>{currentTitle.title}</span>
            </div>
          )}

          {/* Progress to Next Milestone */}
          {nextMilestone && (
            <div className={styles.progressSection}>
              <div className={styles.progressHeader}>
                <span className={styles.progressLabel}>
                  {daysUntilNextMilestone} day{daysUntilNextMilestone !== 1 ? 's' : ''} to {nextMilestone.title}
                </span>
                <span className={styles.nextBadge}>{nextMilestone.badge}</span>
              </div>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Action Button */}
          {!data.todayCompleted ? (
            <button 
              className={`${styles.completeButton} ${isAnimating ? styles.loading : ''}`}
              onClick={handleComplete}
              disabled={isAnimating}
            >
              {isAnimating ? (
                <span className={styles.loadingDots}>
                  <span>.</span><span>.</span><span>.</span>
                </span>
              ) : (
                <>
                  <span className={styles.buttonIcon}>✨</span>
                  <span>Complete Today&apos;s Discovery</span>
                </>
              )}
            </button>
          ) : (
            <div className={styles.completedMessage}>
              <span className={styles.checkmark}>✓</span>
              <span>Today&apos;s exploration complete!</span>
            </div>
          )}

          {/* Stats Row */}
          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{data.totalDaysExplored}</span>
              <span className={styles.statLabel}>total days</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{data.longestStreak}</span>
              <span className={styles.statLabel}>longest streak</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>
                {data.streakFreezes}
                <span className={styles.freezeIcon}>❄️</span>
              </span>
              <span className={styles.statLabel}>freezes</span>
            </div>
          </div>
        </div>

        {/* Streak at Risk Warning */}
        {showFreezePrompt && (
          <div className={styles.freezePrompt}>
            <div className={styles.freezeContent}>
              <span className={styles.warningIcon}>⚠️</span>
              <p>Your streak is at risk! Use a freeze to protect it?</p>
              <div className={styles.freezeActions}>
                <button 
                  className={styles.freezeButton}
                  onClick={handleUseFreeze}
                >
                  ❄️ Use Freeze ({data.streakFreezes} left)
                </button>
                <button 
                  className={styles.skipButton}
                  onClick={() => setShowFreezePrompt(false)}
                >
                  Skip
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Broke Streak Notice */}
        {status.justBrokeStreak && (
          <div className={styles.brokeNotice}>
            <span className={styles.sadIcon}>😔</span>
            <p>Your streak was reset. Start fresh today!</p>
          </div>
        )}
      </div>

      {/* Celebration Modal */}
      {showCelebration && celebrationMilestone && (
        <StreakCelebration 
          milestone={celebrationMilestone}
          onClose={handleCloseCelebration}
        />
      )}
    </>
  )
}

// Compact inline version for navbar/headers
export function CosmicStreakBadge() {
  const [streak, setStreak] = useState(0)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    const status = checkStreak()
    setStreak(status.data.currentStreak)
    setCompleted(status.data.todayCompleted)
  }, [])

  return (
    <div className={styles.inlineBadge} title={`${streak} day streak`}>
      <span className={styles.inlineComet}>☄️</span>
      <span className={styles.inlineCount}>{streak}</span>
      {completed && <span className={styles.inlineCheck}>✓</span>}
    </div>
  )
}
