'use client'

import { useState } from 'react'
import didYouKnowData from '@/data/didYouKnowMini.json'

interface QuickFact {
  id: string
  text_en: string
  text_ar: string
  icon: string
}

export default function DidYouKnowGridMini({ lang = 'ar' }: { lang?: 'en' | 'ar' }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const facts = didYouKnowData.facts as QuickFact[]

  return (
    <div className="glass rounded-xl border border-purple-500/30 p-6">
      <h3 className="text-xl font-bold text-gradient mb-4 flex items-center gap-2">
        <span>✨</span>
        <span>{lang === 'ar' ? 'هل تعلم؟' : 'Did You Know?'}</span>
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {facts.map((fact, index) => (
          <div
            key={fact.id}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="group glass rounded-lg border border-purple-500/20 hover:border-purple-500/50 transition-all p-2.5 hover-lift cursor-pointer"
          >
            <div className="flex items-start gap-2">
              {fact.icon && (
                <span className="text-base flex-shrink-0 mt-0.5">
                  {fact.icon}
                </span>
              )}
              <p className="text-xs text-gray-300 leading-tight group-hover:text-white transition-colors">
                {lang === 'ar' ? fact.text_ar : fact.text_en}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
