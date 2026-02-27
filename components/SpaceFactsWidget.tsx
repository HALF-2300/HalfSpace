'use client'

import { useEffect, useState } from 'react'
import spaceFactsData from '@/data/spaceFacts.json'

interface SpaceFact {
  id: string
  text_en: string
  text_ar: string
  category: string
  icon: string
}

export default function SpaceFactsWidget({ lang = 'en' }: { lang?: 'en' | 'ar' | 'es' | 'zh' }) {
  const [fact, setFact] = useState<SpaceFact | null>(null)

  const getFactOfDay = () => {
    try {
      const facts = spaceFactsData?.facts as SpaceFact[]
      if (!facts || !Array.isArray(facts) || facts.length === 0) {
        return null
      }
      const today = new Date()
      const startOfYear = new Date(today.getFullYear(), 0, 0)
      const dayOfYear = Math.floor((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24))
      const index = dayOfYear % facts.length
      return facts[index]
    } catch (error) {
      console.error('Error loading fact of day:', error)
      return null
    }
  }

  const getRandomFact = () => {
    try {
      const facts = spaceFactsData?.facts as SpaceFact[]
      if (!facts || !Array.isArray(facts) || facts.length === 0) {
        return null
      }
      const randomIndex = Math.floor(Math.random() * facts.length)
      return facts[randomIndex]
    } catch (error) {
      console.error('Error loading random fact:', error)
      return null
    }
  }

  useEffect(() => {
    const factData = getFactOfDay()
    if (factData) {
      setFact(factData)
    }
  }, [])

  const handleRandomFact = () => {
    setFact(getRandomFact())
  }

  if (!fact) return null

  return (
    <div className="glass rounded-xl border border-purple-500/30 hover:border-purple-500/60 transition-all p-5 hover-lift">
      <div className="flex items-start gap-4">
        <span className="text-3xl animate-pulse-slow">{fact.icon}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wide">
              {lang === 'ar' ? 'حقيقة اليوم' : 'Fact of the Day'}
            </h3>
            <span className="text-xs text-gray-500 bg-purple-500/20 px-2 py-1 rounded">
              {fact.category}
            </span>
          </div>
          <p className="text-white text-base leading-relaxed mb-3">
            {lang === 'ar' ? fact.text_ar : fact.text_en}
          </p>
          <button
            onClick={handleRandomFact}
            className="text-xs px-3 py-1.5 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/50 rounded-lg text-purple-200 transition-all hover:scale-105"
          >
            {lang === 'ar' ? 'حقيقة عشوائية' : 'Random Fact'}
          </button>
        </div>
      </div>
    </div>
  )
}
