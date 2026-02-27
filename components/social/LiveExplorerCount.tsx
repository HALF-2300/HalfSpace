'use client'

import { useState, useEffect } from 'react'
import styles from './Social.module.css'
import { subscribeLiveCount } from '@/lib/socialLayer'

interface LiveExplorerCountProps {
  compact?: boolean
}

export default function LiveExplorerCount({ compact = false }: LiveExplorerCountProps) {
  const [count, setCount] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const unsubscribe = subscribeLiveCount((newCount) => {
      setIsAnimating(true)
      setCount(newCount)
      setTimeout(() => setIsAnimating(false), 300)
    })

    return unsubscribe
  }, [])

  if (compact) {
    return (
      <div className={styles.compactLive}>
        <span className={styles.liveDot} />
        <span className={`${styles.liveCount} ${isAnimating ? styles.pulse : ''}`}>
          {count.toLocaleString()}
        </span>
        <span className={styles.liveLabel}>exploring</span>
      </div>
    )
  }

  return (
    <div className={styles.liveContainer}>
      <div className={styles.liveHeader}>
        <span className={styles.liveDot} />
        <span className={styles.liveTitle}>Live Explorers</span>
      </div>
      <div className={styles.liveContent}>
        <span className={`${styles.liveNumber} ${isAnimating ? styles.pulse : ''}`}>
          {count.toLocaleString()}
        </span>
        <span className={styles.liveSubtext}>people exploring right now</span>
      </div>
      <div className={styles.liveActivity}>
        <div className={styles.activityBar}>
          <div className={styles.activityWave} />
        </div>
        <span className={styles.activityLabel}>Real-time activity</span>
      </div>
    </div>
  )
}
