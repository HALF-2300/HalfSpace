'use client'

import { useState } from 'react'
import bigBangTimelineData from '@/data/bigBangTimeline.json'

interface TimelineEvent {
  time: string
  time_ar: string
  title_ar: string
  title_en: string
  description_ar: string
  description_en: string
  icon: string
}

export default function BigBangTimelineMini({ lang = 'ar' }: { lang?: 'en' | 'ar' }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const events = bigBangTimelineData?.timeline as TimelineEvent[]

  if (!events || events.length === 0) return null

  return (
    <div className="w-full">
      <h3 className="text-3xl md:text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
        {lang === 'ar' ? 'جدول زمني مصغر للانفجار العظيم' : 'Big Bang Mini Timeline'}
      </h3>
      <div className="relative py-4">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-blue-500 to-purple-500 opacity-30" />
        <div className="space-y-6">
          {events.map((event, index) => (
            <div
              key={index}
              className="relative pl-16 group cursor-pointer"
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div className="absolute left-4 top-2 w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 border-2 border-space-dark transition-all duration-300 group-hover:scale-150 group-hover:shadow-lg group-hover:shadow-purple-500/50" />
              <div className={`glass rounded-lg p-4 transition-all duration-300 ${activeIndex === index ? 'scale-105 glow-purple' : ''}`}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                    {lang === 'ar' ? event.time_ar : event.time}
                  </span>
                  {event.icon && <span className="text-2xl">{event.icon}</span>}
                </div>
                <h4 className="text-base font-bold text-white mb-1">
                  {lang === 'ar' ? event.title_ar : event.title_en}
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {lang === 'ar' ? event.description_ar : event.description_en}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
