'use client'

import { useEffect, useState } from 'react'
import stardustData from '@/data/youAreStardust.json'

interface Element {
  element: string
  element_ar: string
  percent: string
  origin: string
  origin_ar: string
  age: string
  age_ar: string
  story_en: string
  story_ar: string
  bodyFunction: string
  bodyFunction_ar: string
  icon: string
}

interface YouAreStardustWidgetProps {
  lang?: 'en' | 'ar'
  className?: string
}

/**
 * You Are Stardust Widget
 * Shows your cosmic origins - which elements in your body came from stars
 */
export default function YouAreStardustWidget({ 
  lang = 'en', 
  className = '' 
}: YouAreStardustWidgetProps) {
  const [element, setElement] = useState<Element | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const cosmicBody = stardustData.sections.find(s => s.id === 'your-cosmic-body')
    if (cosmicBody && 'elements' in cosmicBody) {
      const elements = cosmicBody.elements as Element[]
      const randomElement = elements[Math.floor(Math.random() * elements.length)]
      setElement(randomElement)
    }
    setIsLoading(false)
  }, [])

  const getNewElement = () => {
    const cosmicBody = stardustData.sections.find(s => s.id === 'your-cosmic-body')
    if (cosmicBody && 'elements' in cosmicBody) {
      const elements = cosmicBody.elements as Element[]
      const randomElement = elements[Math.floor(Math.random() * elements.length)]
      setElement(randomElement)
      setIsExpanded(false)
    }
  }

  if (isLoading || !element) {
    return (
      <div className={`glass rounded-xl border border-purple-500/30 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-purple-500/20 rounded w-1/3 mb-4"></div>
          <div className="h-6 bg-purple-500/20 rounded w-full"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={`glass rounded-xl border border-purple-500/30 overflow-hidden hover:border-purple-500/60 transition-all ${className}`}>
      {/* Cosmic header */}
      <div className="bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 p-4 border-b border-purple-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✨</span>
            <span className="text-xs text-purple-400 uppercase tracking-wide">
              {lang === 'ar' ? 'أنت غبار النجوم' : 'You Are Stardust'}
            </span>
          </div>
          <span className="text-3xl">{element.icon}</span>
        </div>
      </div>

      {/* Element info */}
      <div className="p-5">
        <div className="flex items-baseline gap-3 mb-3">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {lang === 'ar' ? element.element_ar : element.element}
          </h3>
          <span className="text-lg text-purple-300 font-mono">{element.percent}</span>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
          <div className="flex items-center gap-1">
            <span>🌟</span>
            <span>{lang === 'ar' ? element.origin_ar : element.origin}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>⏳</span>
            <span>{lang === 'ar' ? element.age_ar : element.age}</span>
          </div>
        </div>

        {/* Story */}
        <p className={`text-sm text-gray-300 leading-relaxed ${isExpanded ? '' : 'line-clamp-3'}`}>
          {lang === 'ar' ? element.story_ar : element.story_en}
        </p>

        {/* Body function (expanded) */}
        {isExpanded && (
          <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
            <h4 className="text-xs text-purple-400 uppercase tracking-wide mb-2">
              {lang === 'ar' ? 'الوظيفة في جسمك' : 'Role in Your Body'}
            </h4>
            <p className="text-sm text-gray-300">
              {lang === 'ar' ? element.bodyFunction_ar : element.bodyFunction}
            </p>
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
              : (lang === 'ar' ? 'قصتي الكونية' : 'My cosmic story')}
          </button>
          
          <button 
            onClick={getNewElement}
            className="text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
          >
            <span>🔄</span>
            {lang === 'ar' ? 'عنصر آخر' : 'Another element'}
          </button>
        </div>
      </div>

      {/* Quote footer */}
      <div className="px-5 py-3 bg-[#0a0e27]/50 border-t border-purple-500/10">
        <p className="text-xs text-gray-500 italic text-center">
          "{stardustData.tagline}" — Carl Sagan
        </p>
      </div>
    </div>
  )
}
