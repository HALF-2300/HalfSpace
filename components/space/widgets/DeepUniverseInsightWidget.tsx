'use client'

import { useEffect, useState } from 'react'
import deepInsights from '@/data/deepUniverseInsights.json'

interface Insight {
  id: string
  icon: string
  title: string
  hook: string
  detail: string
}

interface DeepUniverseInsightWidgetProps {
  className?: string
}

/**
 * Deep Universe Insight Widget
 * Shows a fresh, exciting “never-before-added” insight about the universe.
 */
export default function DeepUniverseInsightWidget({ className = '' }: DeepUniverseInsightWidgetProps) {
  const [insight, setInsight] = useState<Insight | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const insights = (deepInsights.insights || []) as Insight[]
    const random = insights[Math.floor(Math.random() * insights.length)]
    setInsight(random)
    setIsLoading(false)
  }, [])

  const getNewInsight = () => {
    const insights = (deepInsights.insights || []) as Insight[]
    const random = insights[Math.floor(Math.random() * insights.length)]
    setInsight(random)
    setIsExpanded(false)
  }

  if (isLoading || !insight) {
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

  return (
    <div className={`glass rounded-xl border border-purple-500/30 overflow-hidden hover:border-purple-500/60 transition-all ${className}`}>
      {/* Header */}
      <div className="p-5 border-b border-purple-500/20 bg-gradient-to-r from-purple-500/10 via-transparent to-blue-500/10">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="text-4xl">{insight.icon}</span>
            <div>
              <div className="text-xs text-purple-400 uppercase tracking-wide">
                {deepInsights.title}
              </div>
              <h3 className="text-lg font-bold text-white mt-1">
                {insight.title}
              </h3>
            </div>
          </div>
          <button
            onClick={getNewInsight}
            className="text-xs text-purple-300 hover:text-purple-200 transition-colors flex items-center gap-1"
            title="Another insight"
          >
            <span>🔄</span>
            Next
          </button>
        </div>

        <p className="mt-3 text-sm text-gray-200 leading-relaxed">
          {insight.hook}
        </p>
      </div>

      {/* Detail */}
      <div className="p-5">
        <p className={`text-sm text-gray-300 leading-relaxed ${isExpanded ? '' : 'line-clamp-3'}`}>
          {insight.detail}
        </p>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-purple-500/20">
          <button onClick={() => setIsExpanded(!isExpanded)} className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
            {isExpanded ? 'Show less' : 'Reveal the details'}
          </button>

          <span className="text-xs text-gray-500">{deepInsights.id}</span>
        </div>
      </div>
    </div>
  )
}

