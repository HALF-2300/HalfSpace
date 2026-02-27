'use client'

import { useEffect, useState } from 'react'
import mindBlowingData from '@/data/mindBlowingSpace.json'

interface Fact {
  id: string
  hook: string
  hook_ar: string
  explanation: string
  explanation_ar: string
  icon: string
  impact: string
}

interface Category {
  id: string
  name: string
  name_ar: string
  icon: string
  facts: Fact[]
}

interface MindBlowingFactWidgetProps {
  lang?: 'en' | 'ar'
  className?: string
  showExplanation?: boolean
}

/**
 * Mind-Blowing Fact Widget
 * Shows a random mind-blowing fact with hook and explanation
 */
export default function MindBlowingFactWidget({ 
  lang = 'en', 
  className = '',
  showExplanation = true 
}: MindBlowingFactWidgetProps) {
  const [fact, setFact] = useState<Fact | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get a random fact
    const categories = mindBlowingData.categories as Category[]
    const randomCat = categories[Math.floor(Math.random() * categories.length)]
    const randomFact = randomCat.facts[Math.floor(Math.random() * randomCat.facts.length)]
    
    setCategory(randomCat)
    setFact(randomFact)
    setIsLoading(false)
  }, [])

  const getNewFact = () => {
    const categories = mindBlowingData.categories as Category[]
    const randomCat = categories[Math.floor(Math.random() * categories.length)]
    const randomFact = randomCat.facts[Math.floor(Math.random() * randomCat.facts.length)]
    
    setCategory(randomCat)
    setFact(randomFact)
    setIsExpanded(false)
  }

  if (isLoading || !fact || !category) {
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

  const impactColors: Record<string, string> = {
    'mind-bending': 'from-purple-500 to-pink-500',
    'philosophical': 'from-blue-500 to-purple-500',
    'scientific': 'from-cyan-500 to-blue-500',
    'mathematical': 'from-green-500 to-cyan-500',
    'temporal': 'from-orange-500 to-yellow-500',
    'existential': 'from-red-500 to-orange-500',
    'personal': 'from-pink-500 to-purple-500',
    'quantum': 'from-violet-500 to-purple-500',
    'scale': 'from-blue-500 to-cyan-500',
    'historical': 'from-amber-500 to-orange-500',
  }

  const gradientClass = impactColors[fact.impact] || 'from-purple-500 to-blue-500'

  return (
    <div className={`glass rounded-xl border border-purple-500/30 overflow-hidden hover:border-purple-500/60 transition-all ${className}`}>
      {/* Header with gradient */}
      <div className={`bg-gradient-to-r ${gradientClass} p-1`}>
        <div className="bg-[#0a0e27] p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{fact.icon}</span>
              <span className="text-xs text-purple-400 uppercase tracking-wide">
                {lang === 'ar' ? category.name_ar : category.name}
              </span>
            </div>
            <span className="text-xl">{category.icon}</span>
          </div>
          
          {/* The Hook */}
          <h3 className={`text-lg font-bold bg-gradient-to-r ${gradientClass} bg-clip-text text-transparent leading-tight`}>
            {lang === 'ar' ? fact.hook_ar : fact.hook}
          </h3>
        </div>
      </div>

      {/* Explanation (expandable) */}
      {showExplanation && (
        <div className="p-4 pt-2">
          <div 
            className={`text-sm text-gray-300 leading-relaxed transition-all duration-300 ${
              isExpanded ? '' : 'line-clamp-3'
            }`}
          >
            {lang === 'ar' ? fact.explanation_ar : fact.explanation}
          </div>
          
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-purple-500/20">
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
            >
              {isExpanded 
                ? (lang === 'ar' ? 'إظهار أقل' : 'Show less') 
                : (lang === 'ar' ? 'إظهار المزيد' : 'Read more')}
            </button>
            
            <button 
              onClick={getNewFact}
              className="text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
            >
              <span>🔄</span>
              {lang === 'ar' ? 'حقيقة أخرى' : 'Another fact'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
