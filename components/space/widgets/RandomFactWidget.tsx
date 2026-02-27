'use client'

import { useState } from 'react'
import factsData from '@/data/facts.json'

interface Fact {
  id: string
  text_en: string
  text_ar: string
  icon: string
  category: string
}

interface RandomFactWidgetProps {
  lang?: 'en' | 'ar'
  className?: string
}

/**
 * Random Fact Widget
 * Shows a random fact with button to get another
 * ADDITIONS ONLY - New component
 */
export default function RandomFactWidget({ lang = 'en', className = '' }: RandomFactWidgetProps) {
  const [fact, setFact] = useState<Fact>(() => {
    const facts = factsData.facts
    return facts[Math.floor(Math.random() * facts.length)]
  })

  const getRandomFact = () => {
    const facts = factsData.facts
    const randomIndex = Math.floor(Math.random() * facts.length)
    setFact(facts[randomIndex])
  }

  return (
    <div className={`glass rounded-xl border border-purple-500/30 p-6 hover:border-purple-500/60 transition-all ${className}`}>
      <div className="flex items-start gap-4 mb-4">
        <div className="text-4xl">{fact.icon}</div>
        <div className="flex-1">
          <div className="text-xs text-purple-400 mb-2 uppercase tracking-wide">
            {lang === 'ar' ? 'حقيقة عشوائية' : 'Random Fact'}
          </div>
          <p className="text-white text-sm leading-relaxed">
            {lang === 'ar' ? fact.text_ar : fact.text_en}
          </p>
        </div>
      </div>
      <button
        onClick={getRandomFact}
        className="w-full px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/50 rounded-lg text-purple-300 text-sm font-semibold transition-all hover:scale-105"
      >
        {lang === 'ar' ? 'حقيقة أخرى' : 'Another Fact'}
      </button>
    </div>
  )
}
