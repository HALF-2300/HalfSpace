'use client'

import { useState } from 'react'
import changelogData from '@/data/changelog.json'

interface ChangelogEntry {
  id: string
  version: string
  date: string
  title_ar: string
  title_en: string
  changes_ar: string[]
  changes_en: string[]
}

export default function ChangelogPanel() {
  const [isExpanded, setIsExpanded] = useState(false)
  const changelog: ChangelogEntry[] = changelogData.changelog.slice(0, 6) as ChangelogEntry[]

  return (
    <div className="fixed bottom-6 left-6 z-[90] max-w-sm">
      <div className="glass rounded-2xl border-2 border-purple-500/30 overflow-hidden">
        {/* Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-4 hover:bg-purple-500/10 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="text-2xl">📝</div>
            <div className="text-left">
              <h3 className="text-sm font-bold text-gradient">Changelog</h3>
              <p className="text-xs text-gray-400">Latest updates</p>
            </div>
          </div>
          <svg
            className={`w-5 h-5 text-purple-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Content */}
        {isExpanded && (
          <div className="max-h-[400px] overflow-y-auto p-4 space-y-4">
            {changelog.map((entry) => (
              <div
                key={entry.id}
                className="glass rounded-xl p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs px-2 py-1 rounded glass border border-purple-500/30 text-purple-300 font-semibold">
                    v{entry.version}
                  </span>
                  <span className="text-xs text-gray-400">{entry.date}</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-2">{entry.title_en}</h4>
                <ul className="space-y-1">
                  {entry.changes_en.slice(0, 2).map((change, idx) => (
                    <li key={idx} className="text-xs text-gray-300 flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
