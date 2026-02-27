'use client'

import Link from 'next/link'
import missionsData from '@/data/missions.json'

interface Mission {
  name: string
  name_ar: string
  year: string
  tagline_en: string
  tagline_ar: string
  icon: string
  link: string
  fact_en: string
  fact_ar: string
}

export default function MissionStrip({ lang = 'en' }: { lang?: 'en' | 'ar' | 'es' | 'zh' }) {
  const missions = missionsData.iconicMissions as Mission[]

  return (
    <div className="w-full overflow-x-auto py-4 scrollbar-hide">
      <div className="flex gap-4 min-w-max px-2">
        {missions.map((mission, index) => (
          <Link
            key={index}
            href={mission.link}
            className="group flex-shrink-0 glass rounded-lg border border-purple-500/30 hover:border-purple-500/60 transition-all hover-lift p-4 min-w-[220px] max-w-[240px] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-transparent to-blue-500/0 group-hover:from-purple-500/10 group-hover:to-blue-500/10 transition-all pointer-events-none rounded-lg" />
            <div className="relative z-10">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">{mission.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-base font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all">
                      {lang === 'ar' ? mission.name_ar : mission.name}
                    </h4>
                    <span className="text-xs text-gray-400">{mission.year}</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed mb-2">
                    {lang === 'ar' ? mission.tagline_ar : mission.tagline_en}
                  </p>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-purple-500/20">
                <p className="text-xs text-purple-300/80 italic">
                  {lang === 'ar' ? mission.fact_ar : mission.fact_en}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
