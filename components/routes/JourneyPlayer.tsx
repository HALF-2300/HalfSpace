'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import styles from './Routes.module.css'
import {
  Route,
  RouteProgress,
  startRoute,
  getRouteProgress,
  completeStop,
  skipStop,
  clearProgress
} from '@/lib/routeBuilder'
import { markTodayComplete } from '@/lib/cosmicStreak'

interface JourneyPlayerProps {
  route: Route
}

export default function JourneyPlayer({ route }: JourneyPlayerProps) {
  const router = useRouter()
  const [progress, setProgress] = useState<RouteProgress | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [showComplete, setShowComplete] = useState(false)

  const currentStop = progress ? route.stops[progress.currentStopIndex] : null

  // Initialize or resume progress
  useEffect(() => {
    let existingProgress = getRouteProgress()
    
    if (!existingProgress || existingProgress.routeId !== route.id) {
      existingProgress = startRoute(route)
    }
    
    setProgress(existingProgress)
    
    if (existingProgress.isComplete) {
      setShowComplete(true)
    } else {
      const currentStop = route.stops[existingProgress.currentStopIndex]
      setTimeLeft(currentStop?.duration || 45)
    }
  }, [route])

  // Timer
  useEffect(() => {
    if (isPaused || !currentStop || showComplete) return

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Auto-advance
          handleComplete()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isPaused, currentStop, showComplete])

  const handleComplete = useCallback(() => {
    const newProgress = completeStop(route)
    if (newProgress) {
      setProgress(newProgress)
      
      if (newProgress.isComplete) {
        setShowComplete(true)
        // Update streak
        if (route.type === 'nightly') {
          markTodayComplete()
        }
      } else {
        const nextStop = route.stops[newProgress.currentStopIndex]
        setTimeLeft(nextStop?.duration || 45)
      }
    }
  }, [route])

  const handleSkip = () => {
    const newProgress = skipStop(route)
    if (newProgress) {
      setProgress(newProgress)
      
      if (newProgress.isComplete) {
        setShowComplete(true)
      } else {
        const nextStop = route.stops[newProgress.currentStopIndex]
        setTimeLeft(nextStop?.duration || 45)
      }
    }
  }

  const handleExit = () => {
    clearProgress()
    router.push('/journey')
  }

  const handleRestart = () => {
    clearProgress()
    const newProgress = startRoute(route)
    setProgress(newProgress)
    setShowComplete(false)
    setTimeLeft(route.stops[0]?.duration || 45)
  }

  if (showComplete) {
    return (
      <div className={styles.complete}>
        <div className={styles.completeContent}>
          <span className={styles.completeIcon}>🎉</span>
          <h1>Journey Complete!</h1>
          <p>You explored {progress?.completedStops.length || 0} cosmic destinations</p>
          
          <div className={styles.completeStats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{progress?.completedStops.length || 0}</span>
              <span className={styles.statLabel}>Stops Visited</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{route.duration}</span>
              <span className={styles.statLabel}>Minutes</span>
            </div>
          </div>

          {route.type === 'nightly' && (
            <div className={styles.streakBonus}>
              🔥 Streak bonus applied!
            </div>
          )}

          <div className={styles.completeActions}>
            <button onClick={handleRestart} className={styles.restartButton}>
              🔄 Play Again
            </button>
            <Link href="/journey" className={styles.exitButton}>
              Back to Hub
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!currentStop || !progress) {
    return (
      <div className={styles.loading}>
        <span>Loading journey...</span>
      </div>
    )
  }

  const progressPercent = ((progress.currentStopIndex + 1) / route.stops.length) * 100

  return (
    <div className={styles.player}>
      {/* Header */}
      <div className={styles.playerHeader}>
        <button onClick={handleExit} className={styles.exitPlayerButton}>
          ← Exit
        </button>
        <div className={styles.routeInfo}>
          <span className={styles.routeIconSmall}>{route.icon}</span>
          <span>{route.name}</span>
        </div>
        <div className={styles.stopCounter}>
          {progress.currentStopIndex + 1} / {route.stops.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill} 
          style={{ width: `${progressPercent}%` }}
        />
        {route.stops.map((_, i) => (
          <div 
            key={i}
            className={`${styles.progressDot} ${i <= progress.currentStopIndex ? styles.dotActive : ''}`}
            style={{ left: `${((i + 1) / route.stops.length) * 100}%` }}
          />
        ))}
      </div>

      {/* Current Stop */}
      <div className={styles.currentStop}>
        <span className={styles.currentIcon}>{currentStop.icon}</span>
        <h1 className={styles.currentTitle}>{currentStop.title}</h1>
        <span className={styles.currentCategory}>{currentStop.category}</span>
        
        <div className={styles.highlight}>
          <span className={styles.highlightIcon}>💡</span>
          <span>{currentStop.highlight}</span>
        </div>

        <Link href={currentStop.url} target="_blank" className={styles.viewButton}>
          Open in New Tab ↗
        </Link>
      </div>

      {/* Timer */}
      <div className={styles.timer}>
        <div className={styles.timerCircle}>
          <svg viewBox="0 0 100 100">
            <circle
              className={styles.timerBg}
              cx="50"
              cy="50"
              r="45"
            />
            <circle
              className={styles.timerProgress}
              cx="50"
              cy="50"
              r="45"
              strokeDasharray={`${(timeLeft / (currentStop.duration)) * 283} 283`}
            />
          </svg>
          <span className={styles.timerValue}>{timeLeft}s</span>
        </div>
        <button 
          onClick={() => setIsPaused(!isPaused)}
          className={styles.pauseButton}
        >
          {isPaused ? '▶️ Resume' : '⏸️ Pause'}
        </button>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <button onClick={handleSkip} className={styles.skipButton}>
          Skip →
        </button>
        <button onClick={handleComplete} className={styles.completeButton}>
          ✓ Done - Next Stop
        </button>
      </div>

      {/* Upcoming Stops */}
      <div className={styles.upcoming}>
        <h3>Coming Up</h3>
        <div className={styles.upcomingList}>
          {route.stops.slice(progress.currentStopIndex + 1, progress.currentStopIndex + 4).map((stop, i) => (
            <div key={stop.pageId} className={styles.upcomingStop}>
              <span className={styles.upcomingIcon}>{stop.icon}</span>
              <span className={styles.upcomingTitle}>{stop.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
