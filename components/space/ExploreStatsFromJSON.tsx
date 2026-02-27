'use client'

import { useEffect, useState } from 'react'
import exploreStatsData from '@/data/exploreStats.json'
import SimpleTooltip from '@/components/SimpleTooltip'

interface ExploreStatsFromJSONProps {
  className?: string
}

interface Stats {
  facts: number
  missions: number
  images: number
  pages: number
}

export default function ExploreStatsFromJSON({ className = '' }: ExploreStatsFromJSONProps) {
  const [stats, setStats] = useState<Stats>({
    facts: 0,
    missions: 0,
    images: 0,
    pages: 0,
  })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Read directly from exploreStats.json
    try {
      setStats({
        facts: exploreStatsData.facts?.total || 0,
        missions: exploreStatsData.missions?.total || 0,
        images: exploreStatsData.images?.total || 0,
        pages: exploreStatsData.pages?.total || 60,
      })
      // Animate in after a short delay
      setTimeout(() => setIsVisible(true), 100)
    } catch (error) {
      console.warn('Failed to load stats from JSON:', error)
      // Set default values
      setStats({
        facts: 150,
        missions: 25,
        images: 120,
        pages: 60,
      })
      setIsVisible(true)
    }
  }, [])

  const statItems = [
    { label: 'Space Facts', value: stats.facts, icon: '✨', suffix: '+' },
    { label: 'Missions', value: stats.missions, icon: '🚀', suffix: '+' },
    { label: 'Images', value: stats.images, icon: '📸', suffix: '+' },
    { label: 'Pages', value: stats.pages, icon: '📚', suffix: '+' },
  ]

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
            transition-all duration-500
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <SimpleTooltip content={`${item.value} ${item.label.toLowerCase()}`} position="top">
            <div className="text-3xl mb-2 cursor-help" aria-hidden="true">
              {item.icon}
            </div>
          </SimpleTooltip>
          <div className="text-2xl md:text-3xl font-bold text-gradient mb-1">
            {item.value}
            {item.suffix}
          </div>
          <div className="text-sm text-gray-400">{item.label}</div>
        </div>
      ))}
    </div>
  )
}
