'use client'

import { useState } from 'react'
import glossaryData from '@/data/glossary.json'

interface GlossaryTerm {
  term: string
  term_ar: string
  definition_en: string
  definition_ar: string
  icon: string
}

export default function GlossaryMini({ lang = 'ar', showCount = 40 }: { lang?: 'en' | 'ar'; showCount?: number }) {
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null)
  const terms = (glossaryData.terms as GlossaryTerm[]).slice(0, showCount)

  return (
    <div className="w-full">
      <h3 className="text-3xl md:text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
        {lang === 'ar' ? 'قاموس مصغر' : 'Mini Glossary'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {terms.map((term, index) => (
          <div
            key={index}
            onClick={() => setExpandedTerm(expandedTerm === term.term ? null : term.term)}
            className="group cursor-pointer glass rounded-lg border border-purple-500/30 hover:border-purple-500/60 transition-all p-4 hover-lift"
          >
            <div className="flex items-start gap-3">
              <span className="text-xl group-hover:scale-110 transition-transform">{term.icon}</span>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all mb-1">
                  {lang === 'ar' ? term.term_ar : term.term}
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {lang === 'ar' ? term.definition_ar : term.definition_en}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
