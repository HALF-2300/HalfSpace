'use client'

import { useEffect, useState } from 'react'
import SimpleTooltip from './SimpleTooltip'
import type { Locale } from '@/data/sitemap'

interface ExploreStatsProps {
  className?: string
  totalPages?: number
  locale?: Locale
}

interface Stats {
  facts: number
  missions: number
  images: number
  pages: number
}

const labels: Record<Locale, { spaceFacts: string; missions: string; images: string; pages: string }> = {
  en: { spaceFacts: 'Space Facts', missions: 'Missions', images: 'Images', pages: 'Pages' },
  ar: { spaceFacts: 'حقائق فضائية', missions: 'مهمات', images: 'صور', pages: 'صفحات' },
  es: { spaceFacts: 'Datos espaciales', missions: 'Misiones', images: 'Imágenes', pages: 'Páginas' },
  zh: { spaceFacts: '太空知识', missions: '任务', images: '图片', pages: '页面' },
}

export default function ExploreStats({ className = '', totalPages, locale = 'en' }: ExploreStatsProps) {
  const [stats, setStats] = useState<Stats>({
    facts: 0,
    missions: 0,
    images: 0,
    pages: 0
  })
  const [isVisible, setIsVisible] = useState(false)
  const L = labels[locale] || labels.en

  useEffect(() => {
    // Load stats from JSON/data
    const loadStats = async () => {
      try {
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
          // Fallback: Count from spaceContent.json
          const spaceContent = await import('@/data/spaceContent.json')
          
          // Count facts
          const facts = spaceContent.todayInSpace?.facts?.length || 0
          
          // Count missions
          const missions = spaceContent.iconicMissions?.length || 0
          
          // Count images (sum all categories)
          const images = Object.values(spaceContent.spaceImages || {}).reduce(
            (total: number, category: any) => total + (category?.length || 0),
            0
          )

          // Count pages - use prop if provided, otherwise estimate
          const pages = totalPages || 60

          setStats({
            facts,
            missions,
            images,
            pages
          })
        }

        // Animate in after a short delay
        setTimeout(() => setIsVisible(true), 100)
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
      }
    }

    loadStats()
  }, [totalPages])

  const statItems = [
    { label: L.spaceFacts, value: stats.facts, icon: '✨', suffix: '+' },
    { label: L.missions, value: stats.missions, icon: '🚀', suffix: '+' },
    { label: L.images, value: stats.images, icon: '📸', suffix: '+' },
    { label: L.pages, value: stats.pages, icon: '📚', suffix: '+' },
  ]

  return (
    <div 
      className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}
      role="region"
      aria-label={locale === 'ar' ? 'إحصائيات الاستكشاف' : 'Explore statistics'}
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
            {item.value}{item.suffix}
          </div>
          <div className="text-sm text-gray-400">{item.label}</div>
        </div>
      ))}
    </div>
  )
}
