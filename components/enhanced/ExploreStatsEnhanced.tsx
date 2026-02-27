'use client'

import { useEffect, useState } from 'react'
import { getButtonAriaLabel } from '@/utils/a11y'

interface ExploreStatsEnhancedProps {
  className?: string
  totalPages?: number
}

interface Stats {
  facts: number
  missions: number
  images: number
  pages: number
}

/**
 * Enhanced Explore Stats Component
 * Reads from exploreStats.json with fallbacks
 */
export default function ExploreStatsEnhanced({ 
  className = '', 
  totalPages 
}: ExploreStatsEnhancedProps) {
  const [stats, setStats] = useState<Stats>({
    facts: 0,
    missions: 0,
    images: 0,
    pages: 0
  })
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true)
        
        // Try to load from exploreStats.json first
        try {
          const exploreStats = await import('@/data/exploreStats.json')
          
          setStats({
            facts: exploreStats.facts?.total || 0,
            missions: exploreStats.missions?.total || 0,
            images: exploreStats.images?.total || 0,
            pages: totalPages || exploreStats.pages?.total || 60
          })
        } catch (jsonError) {
          // Fallback: Count from spaceContent.json and missions.json
          try {
            const [spaceContent, missions] = await Promise.all([
              import('@/data/spaceContent.json'),
              import('@/data/missions.json')
            ])
            
            // Count facts
            const facts = spaceContent.todayInSpace?.facts?.length || 0
            
            // Count missions
            const missionCount = missions.iconicMissions?.length || 0
            
            // Count images (sum all categories)
            const images = Object.values(spaceContent.spaceImages || {}).reduce(
              (total: number, category: any) => total + (category?.length || 0),
              0
            )

            // Count pages - use prop if provided, otherwise estimate
            const pages = totalPages || 60

            setStats({
              facts: facts || 150,
              missions: missionCount || 25,
              images: images || 120,
              pages
            })
          } catch (fallbackError) {
            // Final fallback: default values
            console.warn('Failed to load stats from JSON:', fallbackError)
            setStats({
              facts: 150,
              missions: 25,
              images: 120,
              pages: totalPages || 60
            })
          }
        }

        // Animate in after a short delay
        setTimeout(() => {
          setIsVisible(true)
          setIsLoading(false)
        }, 100)
      } catch (error) {
        console.warn('Failed to load stats:', error)
        // Set default values
        setStats({
          facts: 150,
          missions: 25,
          images: 120,
          pages: totalPages || 60
        })
        setIsVisible(true)
        setIsLoading(false)
      }
    }

    loadStats()
  }, [totalPages])

  const statItems = [
    { 
      label: 'Space Facts', 
      value: stats.facts, 
      icon: '✨', 
      suffix: '+',
      description: 'Amazing space facts to discover'
    },
    { 
      label: 'Missions', 
      value: stats.missions, 
      icon: '🚀', 
      suffix: '+',
      description: 'Historic and current space missions'
    },
    { 
      label: 'Images', 
      value: stats.images, 
      icon: '📸', 
      suffix: '+',
      description: 'Stunning space images from NASA and ESA'
    },
    { 
      label: 'Pages', 
      value: stats.pages, 
      icon: '📚', 
      suffix: '+',
      description: 'Comprehensive space exploration pages'
    },
  ]

  if (isLoading) {
    return (
      <div 
        className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}
        role="region"
        aria-label="Explore statistics"
        aria-busy="true"
      >
        {statItems.map((_, index) => (
          <div
            key={index}
            className="glass rounded-xl p-4 border border-purple-500/20 text-center animate-pulse"
          >
            <div className="h-8 w-8 bg-purple-500/20 rounded-full mx-auto mb-2" />
            <div className="h-8 bg-purple-500/20 rounded mx-auto mb-2 w-16" />
            <div className="h-4 bg-purple-500/10 rounded w-20 mx-auto" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div 
      className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}
      role="region"
      aria-label="Explore statistics"
    >
      {statItems.map((item, index) => (
        <div
          key={index}
          className={`
            glass rounded-xl p-4 border border-purple-500/20 text-center
            transition-all duration-500 enhanced-card-glow
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
          style={{ transitionDelay: `${index * 100}ms` }}
          aria-label={`${item.value}${item.suffix} ${item.label}`}
        >
          <div 
            className="text-3xl mb-2" 
            aria-hidden="true"
            role="img"
            aria-label={item.icon}
          >
            {item.icon}
          </div>
          <div className="text-2xl md:text-3xl font-bold text-gradient mb-1">
            {item.value}{item.suffix}
          </div>
          <div className="text-sm text-gray-400">{item.label}</div>
          <div className="text-xs text-gray-500 mt-1 hidden md:block">
            {item.description}
          </div>
        </div>
      ))}
    </div>
  )
}
