'use client'

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

export default function EncyclopediaTimeline({ lang = 'en' }: { lang?: 'en' | 'ar' }) {
  const milestones = timelineData.milestones as Milestone[]

  return (
    <div className="glass rounded-xl border border-purple-500/30 p-6">
      <h3 className="text-xl font-bold text-gradient mb-6 flex items-center gap-2">
        <span>📅</span>
        <span>{lang === 'ar' ? 'الخط الزمني الكوني' : 'Cosmic Timeline'}</span>
      </h3>
      <div className="space-y-4">
        {milestones.map((milestone, index) => (
          <div
            key={index}
            className="relative pl-8 border-l-2 border-purple-500/30 pb-4 last:pb-0"
          >
            <div className="absolute -left-2 top-0 w-4 h-4 bg-purple-500 rounded-full border-2 border-space-dark" />
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">{milestone.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-purple-400">
                    {milestone.year_short || milestone.year}
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mb-1">
                  {lang === 'ar' ? milestone.title_ar : milestone.title_en}
                </h4>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {lang === 'ar' ? milestone.description_ar : milestone.description_en}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
