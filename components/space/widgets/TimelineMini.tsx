'use client'

import { useState } from 'react'
import timelineData from '@/data/timelineMini.json'

interface TimelineMilestone {
  year: string
  year_short?: string
  title_en: string
  title_ar: string
  description_en: string
  description_ar: string
  icon: string
}

export default function TimelineMini({ lang = 'ar' }: { lang?: 'en' | 'ar' }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const milestones = timelineData.milestones as TimelineMilestone[]

  return (
    <div className="glass rounded-xl border border-purple-500/30 p-6">
      <h3 className="text-xl font-bold text-gradient mb-4 flex items-center gap-2">
        <span>📅</span>
        <span>{lang === 'ar' ? 'محطات تاريخية' : 'Historical Milestones'}</span>
      </h3>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-blue-500 to-purple-500 opacity-30" />
        
        <div className="space-y-4">
          {milestones.map((milestone, index) => (
            <div
              key={index}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              className="relative pl-12 group cursor-pointer"
            >
              {/* Dot */}
              <div className="absolute left-2 top-1.5 w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 border-2 border-space-dark transition-all duration-300 group-hover:scale-150 group-hover:shadow-lg group-hover:shadow-purple-500/50" />
              
              {/* Content card */}
              <div className={`glass rounded-lg p-3 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 ${
                activeIndex === index ? 'scale-105 glow-purple' : ''
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                    {milestone.year_short || milestone.year}
                  </span>
                  {milestone.icon && (
                    <span className="text-lg">{milestone.icon}</span>
                  )}
                  <h4 className="text-sm font-bold text-white flex-1">
                    {lang === 'ar' ? milestone.title_ar : milestone.title_en}
                  </h4>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {lang === 'ar' ? milestone.description_ar : milestone.description_en}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
