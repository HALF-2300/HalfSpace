'use client'

import { useEffect, useState } from 'react'
import mysteriesData from '@/data/cosmicMysteries.json'
import Link from 'next/link'

interface Theory {
  name: string
  name_ar: string
  description_en: string
  description_ar: string
  likelihood: number
}

interface Mystery {
  id: string
  title: string
  title_ar: string
  question: string
  question_ar: string
  icon: string
  status: string
  importance: string
  summary_en: string
  summary_ar: string
  why_it_matters_en: string
  why_it_matters_ar: string
  leading_theories: Theory[]
  related_links: string[]
}

interface CosmicMysteryWidgetProps {
  lang?: 'en' | 'ar'
  className?: string
  showTheories?: boolean
}

/**
 * Cosmic Mystery Widget
 * Shows a random unsolved cosmic mystery
 */
export default function CosmicMysteryWidget({ 
  lang = 'en', 
  className = '',
  showTheories = true 
}: CosmicMysteryWidgetProps) {
  const [mystery, setMystery] = useState<Mystery | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const mysteries = mysteriesData.mysteries as Mystery[]
    const randomMystery = mysteries[Math.floor(Math.random() * mysteries.length)]
    setMystery(randomMystery)
    setIsLoading(false)
  }, [])

  const getNewMystery = () => {
    const mysteries = mysteriesData.mysteries as Mystery[]
    const randomMystery = mysteries[Math.floor(Math.random() * mysteries.length)]
    setMystery(randomMystery)
    setIsExpanded(false)
  }

  if (isLoading || !mystery) {
    return (
      <div className={`glass rounded-xl border border-purple-500/30 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-purple-500/20 rounded w-1/3 mb-4"></div>
          <div className="h-6 bg-purple-500/20 rounded w-full mb-2"></div>
          <div className="h-4 bg-purple-500/20 rounded w-3/4"></div>
        </div>
      </div>
    )
  }

  const importanceColors: Record<string, string> = {
    'critical': 'border-red-500/50 bg-red-500/10',
    'fundamental': 'border-purple-500/50 bg-purple-500/10',
    'existential': 'border-orange-500/50 bg-orange-500/10',
    'speculative': 'border-blue-500/50 bg-blue-500/10',
  }

  const statusColors: Record<string, string> = {
    'unsolved': 'text-red-400',
    'philosophical': 'text-purple-400',
  }

  return (
    <div className={`glass rounded-xl border border-purple-500/30 overflow-hidden hover:border-purple-500/60 transition-all ${className}`}>
      {/* Header */}
      <div className="p-5 border-b border-purple-500/20">
        <div className="flex items-start gap-3">
          <span className="text-4xl">{mystery.icon}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs uppercase tracking-wide ${statusColors[mystery.status] || 'text-purple-400'}`}>
                {mystery.status === 'unsolved' 
                  ? (lang === 'ar' ? 'لم يُحل' : 'Unsolved') 
                  : (lang === 'ar' ? 'فلسفي' : 'Philosophical')}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${importanceColors[mystery.importance] || 'border-purple-500/50'}`}>
                {lang === 'ar' ? mystery.importance : mystery.importance}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">
              {lang === 'ar' ? mystery.title_ar : mystery.title}
            </h3>
          </div>
        </div>
        
        {/* The Question */}
        <p className="mt-3 text-purple-300 italic text-sm">
          "{lang === 'ar' ? mystery.question_ar : mystery.question}"
        </p>
      </div>

      {/* Summary */}
      <div className="p-5">
        <p className={`text-sm text-gray-300 leading-relaxed ${isExpanded ? '' : 'line-clamp-3'}`}>
          {lang === 'ar' ? mystery.summary_ar : mystery.summary_en}
        </p>

        {/* Why it matters (expanded) */}
        {isExpanded && (
          <div className="mt-4 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <h4 className="text-xs text-purple-400 uppercase tracking-wide mb-2">
              {lang === 'ar' ? 'لماذا هذا مهم' : 'Why This Matters'}
            </h4>
            <p className="text-sm text-gray-300">
              {lang === 'ar' ? mystery.why_it_matters_ar : mystery.why_it_matters_en}
            </p>
          </div>
        )}

        {/* Leading Theories (expanded) */}
        {isExpanded && showTheories && mystery.leading_theories.length > 0 && (
          <div className="mt-4">
            <h4 className="text-xs text-purple-400 uppercase tracking-wide mb-3">
              {lang === 'ar' ? 'النظريات الرائدة' : 'Leading Theories'}
            </h4>
            <div className="space-y-2">
              {mystery.leading_theories.slice(0, 3).map((theory, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="text-sm text-white font-medium">
                      {lang === 'ar' ? theory.name_ar : theory.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {lang === 'ar' ? theory.description_ar : theory.description_en}
                    </div>
                  </div>
                  <div className="text-xs text-purple-400">
                    {Math.round(theory.likelihood * 100)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Links */}
        {isExpanded && mystery.related_links.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {mystery.related_links.map((link, idx) => (
              <Link 
                key={idx}
                href={`/${link}`}
                className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors"
              >
                {link.replace(/-/g, ' ')}
              </Link>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-purple-500/20">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
          >
            {isExpanded 
              ? (lang === 'ar' ? 'إظهار أقل' : 'Show less') 
              : (lang === 'ar' ? 'استكشف هذا اللغز' : 'Explore this mystery')}
          </button>
          
          <button 
            onClick={getNewMystery}
            className="text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
          >
            <span>🔄</span>
            {lang === 'ar' ? 'لغز آخر' : 'Another mystery'}
          </button>
        </div>
      </div>
    </div>
  )
}
