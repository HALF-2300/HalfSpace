'use client'

import { useState, useEffect } from 'react'
import didYouKnowData from '@/data/didYouKnowGrid.json'

interface DidYouKnowFact {
  id: string
  text_ar: string
  text_en: string
  icon: string
}

export default function DidYouKnowGrid({ lang = 'ar' }: { lang?: 'en' | 'ar' }) {
  const [facts, setFacts] = useState<DidYouKnowFact[]>([])

  useEffect(() => {
    try {
      const data = didYouKnowData?.facts as DidYouKnowFact[]
      if (data && Array.isArray(data)) {
        setFacts(data)
      }
    } catch (error) {
      console.error('Error loading Did You Know facts:', error)
    }
  }, [])

  if (facts.length === 0) return null

  return (
    <div className="w-full">
      <h3 className="text-3xl md:text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
        {lang === 'ar' ? 'هل تعلم؟' : 'Did You Know?'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {facts.map((fact) => (
          <div
            key={fact.id}
            className="glass rounded-xl border border-purple-500/30 hover:border-purple-500/60 transition-all p-5 hover-lift group"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl group-hover:scale-110 transition-transform">{fact.icon}</span>
              <p className="text-white text-sm leading-relaxed flex-1">
                {lang === 'ar' ? fact.text_ar : fact.text_en}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
