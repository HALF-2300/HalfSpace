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

export default function GlossaryMini({
  lang = 'en',
  showCount = 10,
}: {
  lang?: 'en' | 'ar' | 'es' | 'zh'
  showCount?: number
}) {
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null)
  const terms = (glossaryData.terms as GlossaryTerm[]).slice(0, showCount)

  return (
    <div className="glass rounded-xl border border-purple-500/30 p-6">
      <h3 className="text-xl font-bold text-gradient mb-4 flex items-center gap-2">
        <span>📚</span>
        <span>{lang === 'ar' ? 'قاموس مصغر' : 'Quick Glossary'}</span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {terms.map((term, index) => (
          <div
            key={index}
            onClick={() => setExpandedTerm(expandedTerm === term.term ? null : term.term)}
            className="group cursor-pointer glass rounded-lg border border-purple-500/20 hover:border-purple-500/50 transition-all p-3 hover-lift"
          >
            <div className="flex items-start gap-3">
              <span className="text-xl">{term.icon}</span>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all mb-1">
                  {lang === 'ar' ? term.term_ar : term.term}
                </h4>
                {expandedTerm === term.term ? (
                  <p className="text-xs text-gray-300 leading-relaxed mt-1">
                    {lang === 'ar' ? term.definition_ar : term.definition_en}
                  </p>
                ) : (
                  <p className="text-xs text-gray-400 line-clamp-1">
                    {lang === 'ar' ? term.definition_ar : term.definition_en}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
