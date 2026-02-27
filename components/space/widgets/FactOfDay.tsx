'use client'

import { useState, useEffect } from 'react'
import factOfDayData from '@/data/factOfDay.json'

interface Fact {
  id: string
  text_en: string
  text_ar: string
  icon: string
  category: string
}

export default function FactOfDay({ lang = 'ar' }: { lang?: 'en' | 'ar' }) {
  const [currentFact, setCurrentFact] = useState<Fact | null>(null)
  const [isRandom, setIsRandom] = useState(false)

  useEffect(() => {
    // Set fact of the day
    setCurrentFact(factOfDayData.factOfDay as Fact)
    setIsRandom(false)
  }, [])

  const getRandomFact = () => {
    const randomFacts = factOfDayData.randomFacts as Fact[]
    const randomIndex = Math.floor(Math.random() * randomFacts.length)
    setCurrentFact(randomFacts[randomIndex])
    setIsRandom(true)
  }

  if (!currentFact) return null

  return (
    <div className="glass rounded-xl border border-purple-500/30 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gradient flex items-center gap-2">
          <span>{currentFact.icon}</span>
          <span>
            {isRandom
              ? lang === 'ar'
                ? 'حقيقة عشوائية'
                : 'Random Fact'
              : lang === 'ar'
              ? 'حقيقة اليوم'
              : 'Fact of the Day'}
          </span>
        </h3>
        <button
          onClick={getRandomFact}
          className="px-3 py-1.5 text-xs glass rounded-lg border border-purple-500/30 hover:border-purple-500/50 text-purple-300 hover:text-white transition-all"
        >
          {lang === 'ar' ? 'عشوائي' : 'Random'}
        </button>
      </div>
      <p className="text-white text-base leading-relaxed">
        {lang === 'ar' ? currentFact.text_ar : currentFact.text_en}
      </p>
      <div className="mt-3 pt-3 border-t border-purple-500/20">
        <span className="text-xs text-purple-300 uppercase tracking-wide">
          {currentFact.category}
        </span>
      </div>
    </div>
  )
}
