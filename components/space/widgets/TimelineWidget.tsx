'use client'

import { useEffect, useState } from 'react'
import timelineData from '@/data/timeline.json'

interface Milestone {
  year: string
  year_short?: string
  title_en: string
  title_ar: string
  description_en: string
  description_ar: string
  icon: string
}

interface TimelineWidgetProps {
  lang?: 'en' | 'ar'
  className?: string
  showCount?: number
}

/**
 * Timeline Widget
 * Shows 15 key milestones in cosmic history
 * ADDITIONS ONLY - New component
 */
export default function TimelineWidget({ lang = 'en', className = '', showCount = 15 }: TimelineWidgetProps) {
  const [milestones, setMilestones] = useState<Milestone[]>([])

  useEffect(() => {
    setMilestones(timelineData.milestones.slice(0, showCount))
  }, [showCount])

  return (
    <div className={`glass rounded-xl border border-purple-500/30 p-6 ${className}`}>
      <h3 className="text-lg font-bold text-gradient mb-4">
        {lang === 'ar' ? 'الخط الزمني الكوني' : 'Cosmic Timeline'}
      </h3>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {milestones.map((milestone, index) => (
          <div key={index} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="text-2xl">{milestone.icon}</div>
              {index < milestones.length - 1 && (
                <div className="w-0.5 h-full bg-purple-500/30 mt-2"></div>
              )}
            </div>
            <div className="flex-1 pb-4">
              <div className="text-xs text-purple-400 mb-1">
                {milestone.year_short || milestone.year}
              </div>
              <h4 className="text-sm font-semibold text-white mb-1">
                {lang === 'ar' ? milestone.title_ar : milestone.title_en}
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                {lang === 'ar' ? milestone.description_ar : milestone.description_en}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
