'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './Live.module.css'
import {
  getRecentDiscoveries,
  getUpcomingMissions,
  getThisWeekHighlights,
  getTodaysHighlight,
  formatMissionDate,
  getMissionStatusColor,
  Discovery,
  Mission,
  WeekHighlight,
  MISSIONS
} from '@/lib/liveUniverse'

// ============================================================================
// Live Universe Dashboard
// ============================================================================

export default function LiveUniverse() {
  const [discoveries, setDiscoveries] = useState<Discovery[]>([])
  const [missions, setMissions] = useState<Mission[]>([])
  const [highlights, setHighlights] = useState<WeekHighlight[]>([])
  const [todayHighlight, setTodayHighlight] = useState<Discovery | null>(null)

  useEffect(() => {
    setDiscoveries(getRecentDiscoveries(6))
    setMissions(getUpcomingMissions(6))
    setHighlights(getThisWeekHighlights())
    setTodayHighlight(getTodaysHighlight())
  }, [])

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className={styles.title}>🌌 Live Universe</h1>
        <p className={styles.subtitle}>The cosmos is always changing. Stay updated.</p>
      </div>

      {/* Today's Highlight */}
      {todayHighlight && (
        <div className={styles.todayCard}>
          <div className={styles.todayBadge}>✨ Today&apos;s Highlight</div>
          <h2 className={styles.todayTitle}>{todayHighlight.title}</h2>
          <p className={styles.todayDescription}>{todayHighlight.description}</p>
          <div className={styles.todayMeta}>
            <span className={styles.todaySource}>{todayHighlight.source}</span>
            <span className={`${styles.todayImportance} ${styles[todayHighlight.importance]}`}>
              {todayHighlight.importance}
            </span>
          </div>
        </div>
      )}

      {/* This Week */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>📅 This Week in Space</h2>
        <div className={styles.weekGrid}>
          {highlights.map((highlight, i) => (
            <WeekCard key={i} highlight={highlight} />
          ))}
        </div>
      </section>

      {/* Recent Discoveries */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>🔬 Recent Discoveries</h2>
          <Link href="/discoveries" className={styles.viewAll}>View all →</Link>
        </div>
        <div className={styles.discoveryList}>
          {discoveries.map(discovery => (
            <DiscoveryCard key={discovery.id} discovery={discovery} />
          ))}
        </div>
      </section>

      {/* Upcoming Missions */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>🚀 Upcoming Missions</h2>
          <Link href="/missions" className={styles.viewAll}>View timeline →</Link>
        </div>
        <div className={styles.missionList}>
          {missions.map(mission => (
            <MissionCard key={mission.id} mission={mission} />
          ))}
        </div>
      </section>
    </div>
  )
}

// ============================================================================
// Week Card
// ============================================================================

function WeekCard({ highlight }: { highlight: WeekHighlight }) {
  return (
    <div className={styles.weekCard}>
      <span className={styles.weekIcon}>{highlight.icon}</span>
      <div className={styles.weekContent}>
        <h3 className={styles.weekTitle}>{highlight.title}</h3>
        <p className={styles.weekSubtitle}>{highlight.subtitle}</p>
      </div>
      {highlight.linkUrl && (
        <Link href={highlight.linkUrl} className={styles.weekLink}>
          {highlight.linkText} →
        </Link>
      )}
    </div>
  )
}

// ============================================================================
// Discovery Card
// ============================================================================

function DiscoveryCard({ discovery }: { discovery: Discovery }) {
  const categoryIcons: Record<Discovery['category'], string> = {
    planet: '🪐',
    star: '⭐',
    galaxy: '🌌',
    mission: '🚀',
    technology: '⚙️',
    life: '🧬',
    physics: '⚛️'
  }

  return (
    <div className={styles.discoveryCard}>
      <div className={styles.discoveryIcon}>{categoryIcons[discovery.category]}</div>
      <div className={styles.discoveryContent}>
        <div className={styles.discoveryMeta}>
          <span className={styles.discoveryDate}>{discovery.date}</span>
          <span className={`${styles.discoveryImportance} ${styles[discovery.importance]}`}>
            {discovery.importance}
          </span>
        </div>
        <h3 className={styles.discoveryTitle}>{discovery.title}</h3>
        <p className={styles.discoveryDescription}>{discovery.description}</p>
        <span className={styles.discoverySource}>Source: {discovery.source}</span>
      </div>
    </div>
  )
}

// ============================================================================
// Mission Card
// ============================================================================

function MissionCard({ mission }: { mission: Mission }) {
  return (
    <div className={styles.missionCard}>
      <div className={styles.missionIcon}>{mission.icon}</div>
      <div className={styles.missionContent}>
        <div className={styles.missionHeader}>
          <h3 className={styles.missionName}>{mission.name}</h3>
          <span 
            className={styles.missionStatus}
            style={{ background: `${getMissionStatusColor(mission.status)}20`, color: getMissionStatusColor(mission.status) }}
          >
            {mission.status.replace('-', ' ')}
          </span>
        </div>
        <p className={styles.missionAgency}>{mission.agency} • {mission.destination}</p>
        <p className={styles.missionDescription}>{mission.description}</p>
        <div className={styles.missionDate}>
          <span>📅 {formatMissionDate(mission)}</span>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Missions Timeline Page Component
// ============================================================================

export function MissionsTimeline() {
  // Group missions by year
  const missionsByYear: Record<number, Mission[]> = {}
  MISSIONS.forEach(mission => {
    if (!missionsByYear[mission.launchYear]) {
      missionsByYear[mission.launchYear] = []
    }
    missionsByYear[mission.launchYear].push(mission)
  })

  const years = Object.keys(missionsByYear)
    .map(Number)
    .sort((a, b) => a - b)

  return (
    <div className={styles.timeline}>
      <div className={styles.timelineHeader}>
        <h1 className={styles.timelineTitle}>🚀 Space Missions Timeline</h1>
        <p className={styles.timelineSubtitle}>
          From lunar landings to Mars sample return — humanity&apos;s journey into the cosmos
        </p>
      </div>

      <div className={styles.timelineContent}>
        {years.map(year => (
          <div key={year} className={styles.yearSection}>
            <div className={styles.yearMarker}>
              <span className={styles.yearLabel}>{year}</span>
            </div>
            <div className={styles.yearMissions}>
              {missionsByYear[year].map(mission => (
                <div key={mission.id} className={styles.timelineMission}>
                  <div className={styles.timelineMissionHeader}>
                    <span className={styles.timelineMissionIcon}>{mission.icon}</span>
                    <div>
                      <h3 className={styles.timelineMissionName}>{mission.name}</h3>
                      <p className={styles.timelineMissionAgency}>{mission.agency}</p>
                    </div>
                    <span 
                      className={styles.timelineMissionStatus}
                      style={{ background: `${getMissionStatusColor(mission.status)}20`, color: getMissionStatusColor(mission.status) }}
                    >
                      {mission.status.replace('-', ' ')}
                    </span>
                  </div>
                  <p className={styles.timelineMissionDestination}>
                    🎯 {mission.destination}
                  </p>
                  <p className={styles.timelineMissionDescription}>
                    {mission.description}
                  </p>
                  <div className={styles.timelineMissionObjectives}>
                    <h4>Objectives:</h4>
                    <ul>
                      {mission.objectives.map((obj, i) => (
                        <li key={i}>{obj}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Mars 2026 Feature */}
      <div className={styles.mars2026}>
        <div className={styles.mars2026Content}>
          <span className={styles.mars2026Icon}>🔴</span>
          <h2>Mars 2026: The Next Giant Leap</h2>
          <p>
            2026 marks a pivotal year for Mars exploration. NASA&apos;s Mars Sample Return mission 
            launches to collect Perseverance&apos;s samples, while SpaceX plans uncrewed Starship 
            test flights to the Red Planet. The race to Mars is accelerating.
          </p>
          <Link href="/library/mars-exploration" className={styles.mars2026Link}>
            Read the full Mars story →
          </Link>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Compact Live Widget (for homepage)
// ============================================================================

export function LiveUniverseWidget() {
  const [highlight, setHighlight] = useState<Discovery | null>(null)
  const [nextMission, setNextMission] = useState<Mission | null>(null)

  useEffect(() => {
    setHighlight(getTodaysHighlight())
    const missions = getUpcomingMissions(1)
    if (missions.length > 0) setNextMission(missions[0])
  }, [])

  return (
    <div className={styles.widget}>
      <div className={styles.widgetHeader}>
        <span className={styles.widgetDot} />
        <span>Live Universe</span>
      </div>

      {highlight && (
        <div className={styles.widgetItem}>
          <span className={styles.widgetLabel}>Today&apos;s Discovery</span>
          <p className={styles.widgetText}>{highlight.title}</p>
        </div>
      )}

      {nextMission && (
        <div className={styles.widgetItem}>
          <span className={styles.widgetLabel}>Next Mission</span>
          <p className={styles.widgetText}>
            {nextMission.icon} {nextMission.name} ({formatMissionDate(nextMission)})
          </p>
        </div>
      )}

      <Link href="/live" className={styles.widgetLink}>
        See what&apos;s happening →
      </Link>
    </div>
  )
}
