'use client'

import Link from 'next/link'
import spaceContent from '@/data/spaceContent.json'

// Type assertion for the imported JSON
const missionsData = spaceContent as {
  iconicMissions: Array<{
    name: string
    name_ar?: string
    year: string
    tagline: string
    tagline_ar?: string
    icon: string
    link: string
  }>
}

export default function IconicMissionsStrip({ lang = 'ar' }: { lang?: 'en' | 'ar' }) {
  const missions = missionsData.iconicMissions

  return (
    <div className="w-full overflow-x-auto py-4 scrollbar-hide">
      <div className="flex gap-4 min-w-max px-2">
        {missions.map((mission, index) => (
          <Link
            key={index}
            href={mission.link}
            className="group flex-shrink-0 glass rounded-lg border border-purple-500/30 hover:border-purple-500/60 transition-all hover-lift p-4 min-w-[200px] max-w-[220px]"
          >
            <div className="flex items-start gap-3 mb-2">
              <span className="text-2xl">{mission.icon}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-base font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all">
                    {lang === 'ar' && mission.name_ar ? mission.name_ar : mission.name}
                  </h4>
                  <span className="text-xs text-gray-400">{mission.year}</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {lang === 'ar' && mission.tagline_ar ? mission.tagline_ar : mission.tagline}
                </p>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-transparent to-blue-500/0 group-hover:from-purple-500/10 group-hover:to-blue-500/10 transition-all pointer-events-none rounded-lg" />
          </Link>
        ))}
      </div>
    </div>
  )
}
