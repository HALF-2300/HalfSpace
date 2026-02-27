'use client'

import { useEffect, useState } from 'react'
import odditiesData from '@/data/cosmicOddities.json'

interface Oddity {
  id: string
  name: string
  name_ar: string
  object: string
  icon: string
  weirdness: number
  summary_en: string
  summary_ar: string
  details_en: string
  details_ar: string
  distance: string
  distance_ar: string
  discovered: string
  mindblow: string
  mindblow_ar: string
}

interface Category {
  id: string
  name: string
  name_ar: string
  icon: string
  oddities: Oddity[]
}

interface CosmicOddityWidgetProps {
  lang?: 'en' | 'ar'
  className?: string
}

/**
 * Cosmic Oddity Widget
 * Shows a random weird space phenomenon
 */
export default function CosmicOddityWidget({ 
  lang = 'en', 
  className = '' 
}: CosmicOddityWidgetProps) {
  const [oddity, setOddity] = useState<Oddity | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const categories = odditiesData.categories as Category[]
    const randomCat = categories[Math.floor(Math.random() * categories.length)]
    const randomOddity = randomCat.oddities[Math.floor(Math.random() * randomCat.oddities.length)]
    
    setCategory(randomCat)
    setOddity(randomOddity)
    setIsLoading(false)
  }, [])

  const getNewOddity = () => {
    const categories = odditiesData.categories as Category[]
    const randomCat = categories[Math.floor(Math.random() * categories.length)]
    const randomOddity = randomCat.oddities[Math.floor(Math.random() * randomCat.oddities.length)]
    
    setCategory(randomCat)
    setOddity(randomOddity)
    setIsExpanded(false)
  }

  if (isLoading || !oddity || !category) {
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

  // Weirdness meter colors
  const getWeirdnessColor = (level: number) => {
    if (level >= 9) return 'from-red-500 to-pink-500'
    if (level >= 7) return 'from-orange-500 to-red-500'
    if (level >= 5) return 'from-yellow-500 to-orange-500'
    return 'from-green-500 to-yellow-500'
  }

  return (
    <div className={`glass rounded-xl border border-purple-500/30 overflow-hidden hover:border-purple-500/60 transition-all ${className}`}>
      {/* Header */}
      <div className="p-5 border-b border-purple-500/20">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{oddity.icon}</span>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-gray-400 uppercase tracking-wide">
                  {lang === 'ar' ? category.name_ar : category.name}
                </span>
                <span className="text-sm">{category.icon}</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                {lang === 'ar' ? oddity.name_ar : oddity.name}
              </h3>
              <p className="text-xs text-purple-400 font-mono mt-1">
                {oddity.object}
              </p>
            </div>
          </div>
        </div>

        {/* Weirdness Meter */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-400">{lang === 'ar' ? 'مقياس الغرابة' : 'Weirdness Level'}</span>
            <span className="text-purple-300">{oddity.weirdness}/10</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${getWeirdnessColor(oddity.weirdness)} transition-all duration-500`}
              style={{ width: `${oddity.weirdness * 10}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Summary */}
        <p className="text-sm text-gray-300 leading-relaxed mb-3">
          {lang === 'ar' ? oddity.summary_ar : oddity.summary_en}
        </p>

        {/* Details (expanded) */}
        {isExpanded && (
          <>
            <p className="text-sm text-gray-300 leading-relaxed mb-4">
              {lang === 'ar' ? oddity.details_ar : oddity.details_en}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <div className="text-xs text-gray-400 mb-1">
                  {lang === 'ar' ? 'المسافة' : 'Distance'}
                </div>
                <div className="text-sm text-purple-300 font-mono">
                  {lang === 'ar' ? oddity.distance_ar : oddity.distance}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <div className="text-xs text-gray-400 mb-1">
                  {lang === 'ar' ? 'اكتُشف' : 'Discovered'}
                </div>
                <div className="text-sm text-purple-300 font-mono">
                  {oddity.discovered}
                </div>
              </div>
            </div>

            {/* Mind-blow moment */}
            <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🤯</span>
                <span className="text-xs text-purple-400 uppercase tracking-wide">
                  {lang === 'ar' ? 'اللحظة المذهلة' : 'Mind-Blow Moment'}
                </span>
              </div>
              <p className="text-sm text-white font-medium">
                {lang === 'ar' ? oddity.mindblow_ar : oddity.mindblow}
              </p>
            </div>
          </>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-purple-500/20">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
          >
            {isExpanded 
              ? (lang === 'ar' ? 'إظهار أقل' : 'Show less') 
              : (lang === 'ar' ? 'اكتشف المزيد' : 'Discover more')}
          </button>
          
          <button 
            onClick={getNewOddity}
            className="text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
          >
            <span>🔄</span>
            {lang === 'ar' ? 'غرابة أخرى' : 'Another oddity'}
          </button>
        </div>
      </div>
    </div>
  )
}
