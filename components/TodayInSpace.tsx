'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import spaceContent from '@/data/spaceContent.json'
import todayData from '@/data/today.json'

// Type assertion for the imported JSON
const spaceContentData = spaceContent as {
  todayInSpace: {
    facts: Array<{ text: string; icon?: string; type?: string }>
    quotes: Array<{ text: string; author: string; icon?: string }>
  }
}

type TodayContent = {
  text: string
  icon?: string
  type?: string
  author?: string
}

export default function TodayInSpace() {
  const [content, setContent] = useState<TodayContent | null>(null)
  const [contentType, setContentType] = useState<'fact' | 'quote' | 'distance'>('fact')

  useEffect(() => {
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    
    // Cycle through fact, quote, distance
    const typeIndex = dayOfYear % 3
    const types: ('fact' | 'quote' | 'distance')[] = ['fact', 'quote', 'distance']
    const currentType = types[typeIndex]
    setContentType(currentType)

    if (currentType === 'quote') {
      const quotes = spaceContentData.todayInSpace.quotes
      const quoteIndex = dayOfYear % quotes.length
      setContent(quotes[quoteIndex])
    } else {
      const facts = spaceContentData.todayInSpace.facts.filter(f => 
        currentType === 'distance' ? f.type === 'distance' : f.type === 'fact'
      )
      const factIndex = dayOfYear % facts.length
      setContent(facts[factIndex])
    }
  }, [])

  if (!content) return null

  return (
    <Link href="/today" className="block">
      <div className="glass rounded-xl border border-purple-500/30 p-4 hover:border-purple-500/60 hover:bg-purple-600/5 transition-all group cursor-pointer">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{content.icon || '🌌'}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs text-purple-400 font-semibold uppercase tracking-wider">
                {contentType === 'fact' ? 'Fact of the Day' : contentType === 'quote' ? 'Quote of the Day' : 'Distance Scale'}
              </div>
              <span className="text-xs text-gray-500 group-hover:text-purple-400 transition-colors">
                View Today →
              </span>
            </div>
            <p className="text-sm text-white leading-relaxed">
              {content.text}
            </p>
            {content.author && (
              <p className="text-xs text-gray-400 mt-2 italic">— {content.author}</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
