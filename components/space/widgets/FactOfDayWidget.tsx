'use client'

import { useEffect, useState } from 'react'
import factsData from '@/data/facts.json'

interface Fact {
  id: string
  text_en: string
  text_ar: string
  icon: string
  category: string
}

interface FactOfDayWidgetProps {
  lang?: 'en' | 'ar'
  className?: string
}

/**
 * Fact of the Day Widget
 * Shows a different fact each day
 * ADDITIONS ONLY - New component
 */
export default function FactOfDayWidget({ lang = 'en', className = '' }: FactOfDayWidgetProps) {
  const [fact, setFact] = useState<Fact | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get fact of the day based on date
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    
    const facts = factsData.facts
    const factIndex = dayOfYear % facts.length
    const selectedFact = facts[factIndex]
    
    setFact(selectedFact)
    setIsLoading(false)
  }, [])

  if (isLoading || !fact) {
    return (
      <div className={`glass rounded-xl border border-purple-500/30 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-purple-500/20 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-purple-500/20 rounded w-full"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={`glass rounded-xl border border-purple-500/30 p-6 hover:border-purple-500/60 transition-all ${className}`}>
      <div className="flex items-start gap-4">
        <div className="text-4xl">{fact.icon}</div>
        <div className="flex-1">
          <div className="text-xs text-purple-400 mb-2 uppercase tracking-wide">
            {lang === 'ar' ? 'حقيقة اليوم' : 'Fact of the Day'}
          </div>
          <p className="text-white text-sm leading-relaxed">
            {lang === 'ar' ? fact.text_ar : fact.text_en}
          </p>
          <div className="mt-3 text-xs text-gray-400">
            {lang === 'ar' ? `الفئة: ${fact.category}` : `Category: ${fact.category}`}
          </div>
        </div>
      </div>
    </div>
  )
}
