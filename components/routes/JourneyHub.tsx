'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import styles from './Routes.module.css'
import {
  getAvailableRoutes,
  generateRouteByType,
  generateNightlyRoute,
  getRouteProgress,
  Route
} from '@/lib/routeBuilder'

export default function JourneyHub() {
  const router = useRouter()
  const [nightlyRoute, setNightlyRoute] = useState<Route | null>(null)
  const [availableRoutes, setAvailableRoutes] = useState<ReturnType<typeof getAvailableRoutes>>([])
  const [activeProgress, setActiveProgress] = useState<any>(null)

  useEffect(() => {
    setNightlyRoute(generateNightlyRoute())
    setAvailableRoutes(getAvailableRoutes())
    setActiveProgress(getRouteProgress())
  }, [])

  const handleStartRoute = (type: string) => {
    const route = generateRouteByType(type)
    // Store route in session for the player
    sessionStorage.setItem('halfspace_active_route', JSON.stringify(route))
    router.push(`/journey/play?type=${type}`)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>🚀 Journey Hub</h1>
        <p className={styles.subtitle}>Choose your adventure through the cosmos</p>
      </div>

      {/* Active Journey */}
      {activeProgress && !activeProgress.isComplete && (
        <div className={styles.activeJourney}>
          <div className={styles.activeHeader}>
            <span className={styles.activeIcon}>▶️</span>
            <div>
              <h3>Journey in Progress</h3>
              <p>Continue where you left off</p>
            </div>
          </div>
          <Link href="/journey/play" className={styles.continueButton}>
            Continue Journey
          </Link>
        </div>
      )}

      {/* Tonight's Journey - Featured */}
      {nightlyRoute && (
        <div className={styles.featuredRoute}>
          <div className={styles.featuredBadge}>✨ Today&apos;s Pick</div>
          <div className={styles.featuredContent}>
            <span className={styles.featuredIcon}>{nightlyRoute.icon}</span>
            <div className={styles.featuredInfo}>
              <h2 className={styles.featuredTitle}>{nightlyRoute.name}</h2>
              <p className={styles.featuredDescription}>{nightlyRoute.description}</p>
              <div className={styles.featuredMeta}>
                <span>🕐 {nightlyRoute.duration} min</span>
                <span>•</span>
                <span>📍 {nightlyRoute.stops.length} stops</span>
              </div>
            </div>
          </div>
          <div className={styles.featuredStops}>
            {nightlyRoute.stops.slice(0, 5).map((stop, i) => (
              <span key={stop.pageId} className={styles.stopPreview} title={stop.title}>
                {stop.icon}
              </span>
            ))}
            {nightlyRoute.stops.length > 5 && (
              <span className={styles.stopMore}>+{nightlyRoute.stops.length - 5}</span>
            )}
          </div>
          <button
            className={styles.featuredButton}
            onClick={() => handleStartRoute('nightly')}
          >
            Start Tonight&apos;s Journey
          </button>
        </div>
      )}

      {/* Other Routes */}
      <div className={styles.routesSection}>
        <h2 className={styles.sectionTitle}>More Adventures</h2>
        <div className={styles.routeGrid}>
          {availableRoutes
            .filter(r => r.type !== 'nightly')
            .map((route) => (
              <button
                key={route.type}
                className={styles.routeCard}
                onClick={() => handleStartRoute(route.type)}
              >
                <span className={styles.routeIcon}>{route.icon}</span>
                <div className={styles.routeInfo}>
                  <h3 className={styles.routeName}>{route.name}</h3>
                  <p className={styles.routeDescription}>{route.description}</p>
                </div>
                <span className={styles.routeArrow}>→</span>
              </button>
            ))}
        </div>
      </div>

      {/* Quick Tips */}
      <div className={styles.tips}>
        <h3>💡 Pro Tips</h3>
        <ul>
          <li>Complete Tonight&apos;s Journey daily to build your streak</li>
          <li>Discovery Path shows you content you haven&apos;t seen yet</li>
          <li>Deep Dives help you master specific topics</li>
        </ul>
      </div>
    </div>
  )
}

// Compact card for homepage
export function TonightsJourneyCard() {
  const router = useRouter()
  const [route, setRoute] = useState<Route | null>(null)

  useEffect(() => {
    setRoute(generateNightlyRoute())
  }, [])

  if (!route) return null

  return (
    <div 
      className={styles.compactCard}
      onClick={() => {
        sessionStorage.setItem('halfspace_active_route', JSON.stringify(route))
        router.push('/journey/play?type=nightly')
      }}
    >
      <div className={styles.compactHeader}>
        <span className={styles.compactIcon}>{route.icon}</span>
        <div>
          <h3 className={styles.compactTitle}>{route.name}</h3>
          <p className={styles.compactMeta}>
            {route.duration} min • {route.stops.length} stops
          </p>
        </div>
      </div>
      <div className={styles.compactStops}>
        {route.stops.slice(0, 4).map(stop => (
          <span key={stop.pageId} className={styles.compactStop}>{stop.icon}</span>
        ))}
      </div>
      <span className={styles.compactCta}>Start →</span>
    </div>
  )
}
