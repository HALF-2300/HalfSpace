'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './ExplorerProfile.module.css'
import {
  loadProfile,
  getStats,
  getDiscoveryMap,
  getRecommendations,
  getAllAchievements,
  getBookmarks,
  setExplorerName,
  ExplorerProfile as ProfileType,
  ExplorerStats,
  Recommendation
} from '@/lib/explorerProfile'
import { loadStreakData, getCurrentTitle, StreakData } from '@/lib/cosmicStreak'

interface ExplorerProfileProps {
  compact?: boolean
}

export default function ExplorerProfile({ compact = false }: ExplorerProfileProps) {
  const [profile, setProfile] = useState<ProfileType | null>(null)
  const [stats, setStats] = useState<ExplorerStats | null>(null)
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [achievements, setAchievements] = useState<Array<{ id: string; name: string; icon: string; description: string; unlocked: boolean }>>([])
  const [discoveryMap, setDiscoveryMap] = useState<{ categories: Array<{ name: string; visitedCount: number; totalCount: number }> } | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'map' | 'bookmarks'>('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [nameInput, setNameInput] = useState('')

  useEffect(() => {
    const p = loadProfile()
    setProfile(p)
    setNameInput(p.explorerName)
    setStats(getStats())
    setStreak(loadStreakData())
    setRecommendations(getRecommendations(4))
    setAchievements(getAllAchievements())
    setDiscoveryMap(getDiscoveryMap())
  }, [])

  const handleSaveName = () => {
    setExplorerName(nameInput)
    setProfile(loadProfile())
    setIsEditing(false)
  }

  const currentTitle = streak ? getCurrentTitle(streak) : null

  if (!profile || !stats) {
    return (
      <div className={styles.loading}>
        <span>Loading your profile...</span>
      </div>
    )
  }

  if (compact) {
    return (
      <div className={styles.compactCard}>
        <div className={styles.compactHeader}>
          <div className={styles.compactAvatar}>
            {currentTitle?.badge || '🚀'}
          </div>
          <div className={styles.compactInfo}>
            <span className={styles.compactName}>
              {profile.explorerName || 'Space Explorer'}
            </span>
            <span className={styles.compactTitle}>
              {currentTitle?.title || 'Beginner'}
            </span>
          </div>
        </div>
        <div className={styles.compactStats}>
          <div className={styles.compactStat}>
            <span className={styles.compactValue}>{stats.uniquePagesVisited}</span>
            <span className={styles.compactLabel}>discoveries</span>
          </div>
          <div className={styles.compactStat}>
            <span className={styles.compactValue}>{streak?.currentStreak || 0}</span>
            <span className={styles.compactLabel}>day streak</span>
          </div>
        </div>
        <Link href="/profile" className={styles.compactLink}>
          View Full Profile →
        </Link>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Profile Header */}
      <div className={styles.header}>
        <div className={styles.avatarSection}>
          <div className={styles.avatar}>
            {currentTitle?.badge || '🚀'}
          </div>
          <div className={styles.levelBadge}>
            Level {Math.floor(stats.uniquePagesVisited / 5) + 1}
          </div>
        </div>
        
        <div className={styles.headerInfo}>
          {isEditing ? (
            <div className={styles.nameEdit}>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Enter your explorer name"
                className={styles.nameInput}
                autoFocus
              />
              <button onClick={handleSaveName} className={styles.saveButton}>
                Save
              </button>
              <button onClick={() => setIsEditing(false)} className={styles.cancelButton}>
                Cancel
              </button>
            </div>
          ) : (
            <div className={styles.nameDisplay}>
              <h1 className={styles.name}>
                {profile.explorerName || 'Space Explorer'}
              </h1>
              <button onClick={() => setIsEditing(true)} className={styles.editButton}>
                ✏️
              </button>
            </div>
          )}
          <p className={styles.title}>{currentTitle?.title || 'Cosmic Beginner'}</p>
          <p className={styles.joinDate}>
            Exploring since {new Date(profile.joinedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>🔭</span>
          <span className={styles.statValue}>{stats.uniquePagesVisited}</span>
          <span className={styles.statLabel}>Discoveries</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>☄️</span>
          <span className={styles.statValue}>{streak?.currentStreak || 0}</span>
          <span className={styles.statLabel}>Day Streak</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>⏱️</span>
          <span className={styles.statValue}>
            {Math.floor(stats.totalTimeExplored / 3600)}h {Math.floor((stats.totalTimeExplored % 3600) / 60)}m
          </span>
          <span className={styles.statLabel}>Time Explored</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>📊</span>
          <span className={styles.statValue}>{stats.discoveryPercentage}%</span>
          <span className={styles.statLabel}>Complete</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'overview' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'achievements' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          Achievements
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'map' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('map')}
        >
          Discovery Map
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'bookmarks' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('bookmarks')}
        >
          Bookmarks
        </button>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {activeTab === 'overview' && (
          <div className={styles.overviewTab}>
            {/* Recommendations */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span>✨</span> Recommended for You
              </h2>
              <div className={styles.recommendationGrid}>
                {recommendations.map((rec) => (
                  <Link key={rec.id} href={rec.url} className={styles.recommendationCard}>
                    <span className={styles.recIcon}>{rec.icon}</span>
                    <div className={styles.recInfo}>
                      <span className={styles.recTitle}>{rec.title}</span>
                      <span className={styles.recReason}>{rec.reason}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Favorite Category */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span>❤️</span> Your Interests
              </h2>
              <div className={styles.interestPills}>
                {profile.preferredCategories.slice(0, 5).map((cat) => (
                  <span key={cat} className={styles.interestPill}>
                    {cat}
                  </span>
                ))}
                {profile.preferredCategories.length === 0 && (
                  <p className={styles.emptyState}>Start exploring to discover your interests!</p>
                )}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className={styles.achievementsTab}>
            <div className={styles.achievementGrid}>
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`${styles.achievementCard} ${achievement.unlocked ? styles.unlocked : styles.locked}`}
                >
                  <span className={styles.achievementIcon}>
                    {achievement.unlocked ? achievement.icon : '🔒'}
                  </span>
                  <div className={styles.achievementInfo}>
                    <span className={styles.achievementName}>{achievement.name}</span>
                    <span className={styles.achievementDesc}>{achievement.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'map' && discoveryMap && (
          <div className={styles.mapTab}>
            <div className={styles.categoryGrid}>
              {discoveryMap.categories.map((cat) => (
                <div key={cat.name} className={styles.categoryCard}>
                  <div className={styles.categoryHeader}>
                    <span className={styles.categoryName}>{cat.name}</span>
                    <span className={styles.categoryCount}>
                      {cat.visitedCount}/{cat.totalCount}
                    </span>
                  </div>
                  <div className={styles.categoryProgress}>
                    <div
                      className={styles.categoryFill}
                      style={{ width: `${(cat.visitedCount / cat.totalCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'bookmarks' && (
          <div className={styles.bookmarksTab}>
            <BookmarksList />
          </div>
        )}
      </div>
    </div>
  )
}

function BookmarksList() {
  const [bookmarks, setBookmarks] = useState<Array<{ id: string; title: string; url: string; icon: string; category: string }>>([])

  useEffect(() => {
    const bm = getBookmarks()
    setBookmarks(bm)
  }, [])

  if (bookmarks.length === 0) {
    return (
      <div className={styles.emptyBookmarks}>
        <span className={styles.emptyIcon}>📚</span>
        <p>No bookmarks yet</p>
        <p className={styles.emptyHint}>Bookmark pages to save them for later</p>
      </div>
    )
  }

  return (
    <div className={styles.bookmarkGrid}>
      {bookmarks.map((bookmark) => (
        <Link key={bookmark.id} href={bookmark.url} className={styles.bookmarkCard}>
          <span className={styles.bookmarkIcon}>{bookmark.icon}</span>
          <div className={styles.bookmarkInfo}>
            <span className={styles.bookmarkTitle}>{bookmark.title}</span>
            <span className={styles.bookmarkCategory}>{bookmark.category}</span>
          </div>
        </Link>
      ))}
    </div>
  )
}
