'use client'

import { useEffect, useState } from 'react'
import glossaryData from '@/data/glossary.json'

interface Term {
  term: string
  term_ar: string
  definition_en: string
  definition_ar: string
  icon: string
}

interface GlossaryWidgetProps {
  lang?: 'en' | 'ar'
  className?: string
  showCount?: number
  searchable?: boolean
}

/**
 * Glossary Widget
 * Shows space terms with definitions (120 terms available)
 * ADDITIONS ONLY - New component
 */
export default function GlossaryWidget({ 
  lang = 'en', 
  className = '', 
  showCount = 20,
  searchable = true 
}: GlossaryWidgetProps) {
  const [terms, setTerms] = useState<Term[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [displayedTerms, setDisplayedTerms] = useState<Term[]>([])

  useEffect(() => {
    setTerms(glossaryData.terms.slice(0, 120)) // Use first 120 terms
    setDisplayedTerms(glossaryData.terms.slice(0, showCount))
  }, [showCount])

  useEffect(() => {
    if (!searchTerm) {
      setDisplayedTerms(terms.slice(0, showCount))
      return
    }

    const filtered = terms.filter(term => {
      const searchLower = searchTerm.toLowerCase()
      return (
        term.term.toLowerCase().includes(searchLower) ||
        term.term_ar.includes(searchTerm) ||
        term.definition_en.toLowerCase().includes(searchLower) ||
        term.definition_ar.includes(searchTerm)
      )
    })
    setDisplayedTerms(filtered.slice(0, showCount))
  }, [searchTerm, terms, showCount])

  return (
    <div className={`glass rounded-xl border border-purple-500/30 p-6 ${className}`}>
      <h3 className="text-lg font-bold text-gradient mb-4">
        {lang === 'ar' ? 'قاموس المصطلحات' : 'Glossary'}
      </h3>
      
      {searchable && (
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={lang === 'ar' ? 'ابحث عن مصطلح...' : 'Search for a term...'}
          className="w-full px-4 py-2 mb-4 bg-space-dark/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
        />
      )}

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {displayedTerms.map((term, index) => (
          <div key={index} className="pb-3 border-b border-purple-500/10 last:border-0">
            <div className="flex items-start gap-2 mb-1">
              <span className="text-lg">{term.icon}</span>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-white">
                  {lang === 'ar' ? term.term_ar : term.term}
                </h4>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  {lang === 'ar' ? term.definition_ar : term.definition_en}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {displayedTerms.length === 0 && searchTerm && (
        <div className="text-center text-gray-400 text-sm py-4">
          {lang === 'ar' ? 'لم يتم العثور على مصطلحات' : 'No terms found'}
        </div>
      )}
    </div>
  )
}
