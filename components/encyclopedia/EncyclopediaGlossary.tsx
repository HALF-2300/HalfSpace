'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import glossaryData from '@/data/glossary.json'
import { getRelatedEntries, slugify } from '@/utils/indexer/spaceIndexer'

interface Term {
  term: string
  term_ar: string
  definition_en: string
  definition_ar: string
  icon: string
}

export default function EncyclopediaGlossary({ lang = 'en', showCount = 60 }: { lang?: 'en' | 'ar'; showCount?: number }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null)

  const allTerms = glossaryData.terms as Term[]
  const relatedEntries = useMemo(() => {
    if (!expandedTerm) return []
    const slug = slugify(expandedTerm)
    return getRelatedEntries({ id: `term-${slug}`, type: 'term', limit: 3 })
  }, [expandedTerm])

  const toggleTerm = (term: Term) => {
    const isActive = expandedTerm === term.term
    setExpandedTerm(isActive ? null : term.term)
  }
  
  const filteredTerms = allTerms
    .filter(term => {
      if (!searchTerm) return true
      const search = searchTerm.toLowerCase()
      const termText = lang === 'ar' ? term.term_ar : term.term
      const defText = lang === 'ar' ? term.definition_ar : term.definition_en
      return termText.toLowerCase().includes(search) || defText.toLowerCase().includes(search)
    })
    .slice(0, showCount)

  return (
    <div className="glass rounded-xl border border-purple-500/30 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gradient flex items-center gap-2">
          <span>📚</span>
          <span>{lang === 'ar' ? 'قاموس الفضاء' : 'Space Glossary'}</span>
        </h3>
        <span className="text-sm text-gray-400">
          {filteredTerms.length} {lang === 'ar' ? 'مصطلح' : 'terms'}
        </span>
      </div>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={lang === 'ar' ? 'ابحث في المصطلحات...' : 'Search terms...'}
        className="w-full px-4 py-2 mb-4 glass rounded-lg border border-purple-500/30 focus:border-purple-500/60 focus:outline-none text-white placeholder-gray-400"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
        {filteredTerms.map((term, index) => (
          <div
            key={index}
            role="button"
            tabIndex={0}
            aria-expanded={expandedTerm === term.term}
            onClick={() => toggleTerm(term)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                toggleTerm(term)
              }
            }}
            className="group cursor-pointer glass rounded-lg border border-purple-500/20 hover:border-purple-500/50 transition-all p-3 hover-lift"
          >
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0">{term.icon}</span>
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

      {relatedEntries.length > 0 && (
        <div className="mt-4 rounded-lg border border-purple-500/30 bg-black/30 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-white">
              {lang === 'ar' ? 'محتوى مرتبط بالمصطلح' : 'Related to this term'}
            </span>
            <span className="text-xs text-gray-400">{relatedEntries.length}</span>
          </div>
          <div className="space-y-2">
            {relatedEntries.map(entry => (
              <Link
                key={entry.id}
                href={entry.href || '/space/encyclopedia'}
                className="block rounded-lg border border-purple-500/20 bg-purple-500/5 px-3 py-2 hover:border-purple-500/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/80"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm text-white font-semibold line-clamp-1">{entry.title}</div>
                  <span className="text-[11px] text-purple-300">{entry.type}</span>
                </div>
                {entry.summary && (
                  <p className="text-xs text-gray-300 line-clamp-2">{entry.summary}</p>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
