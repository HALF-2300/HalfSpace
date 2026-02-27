'use client'

import { useState, useEffect } from 'react'
import styles from './Social.module.css'
import { getLeaderboard, getUserRanks, LeaderboardEntry } from '@/lib/socialLayer'

type Category = 'streak' | 'discoveries' | 'time'

export default function Leaderboard() {
  const [category, setCategory] = useState<Category>('streak')
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [userRanks, setUserRanks] = useState({ streak: 0, discoveries: 0, time: 0 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    const data = getLeaderboard(category)
    setEntries(data.slice(0, 20)) // Top 20
    setUserRanks(getUserRanks())
    setIsLoading(false)
  }, [category])

  const categoryLabels = {
    streak: { name: 'Streak', icon: '☄️', unit: 'days' },
    discoveries: { name: 'Discoveries', icon: '🔭', unit: 'pages' },
    time: { name: 'Time Explored', icon: '⏱️', unit: 'minutes' }
  }

  const userEntry = entries.find(e => e.id === 'current-user')

  return (
    <div className={styles.leaderboardContainer}>
      <div className={styles.leaderboardHeader}>
        <h2 className={styles.leaderboardTitle}>
          🏆 Leaderboard
        </h2>
        <p className={styles.leaderboardSubtitle}>
          See how you rank among cosmic explorers
        </p>
      </div>

      {/* Category Tabs */}
      <div className={styles.categoryTabs}>
        {(Object.keys(categoryLabels) as Category[]).map((cat) => (
          <button
            key={cat}
            className={`${styles.categoryTab} ${category === cat ? styles.categoryActive : ''}`}
            onClick={() => setCategory(cat)}
          >
            <span>{categoryLabels[cat].icon}</span>
            <span>{categoryLabels[cat].name}</span>
          </button>
        ))}
      </div>

      {/* User's Rank Card */}
      {userEntry && (
        <div className={styles.userRankCard}>
          <div className={styles.userRankBadge}>#{userEntry.rank}</div>
          <div className={styles.userRankInfo}>
            <span className={styles.userRankLabel}>Your Rank</span>
            <span className={styles.userRankScore}>
              {userEntry.score} {categoryLabels[category].unit}
            </span>
          </div>
          <div className={styles.userRankPercentile}>
            Top {Math.max(1, Math.floor((userEntry.rank / 51) * 100))}%
          </div>
        </div>
      )}

      {/* Leaderboard List */}
      <div className={styles.leaderboardList}>
        {isLoading ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          entries.map((entry, index) => (
            <div
              key={entry.id}
              className={`${styles.leaderboardEntry} ${entry.id === 'current-user' ? styles.currentUser : ''}`}
            >
              <div className={styles.entryRank}>
                {entry.rank <= 3 ? (
                  <span className={styles.topRank}>
                    {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'}
                  </span>
                ) : (
                  <span className={styles.rankNumber}>#{entry.rank}</span>
                )}
              </div>
              <div className={styles.entryBadge}>{entry.badge}</div>
              <div className={styles.entryName}>
                {entry.name}
                {entry.id === 'current-user' && (
                  <span className={styles.youBadge}>You</span>
                )}
              </div>
              <div className={styles.entryScore}>
                {entry.score.toLocaleString()}
                <span className={styles.entryUnit}>{categoryLabels[category].unit}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
