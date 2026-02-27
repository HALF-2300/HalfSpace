'use client'

import Link from 'next/link'
import whatsNew from '@/data/spaceWhatsNew.json'

type WhatsNewEntry = {
  id: string
  title: string
  summary: string
  date: string
  tags?: string[]
  link?: string
}

const formatDate = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function WhatsNewPanel({ limit = 4 }: { limit?: number }) {
  const entries = (whatsNew as { entries: WhatsNewEntry[] }).entries
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)

  return (
    <div
      className="glass rounded-2xl border-2 border-purple-500/30 p-5 shadow-lg focus-within:ring-2 focus-within:ring-purple-400/80"
      aria-label="What's new inside Space"
      id="whats-new"
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-purple-300">What’s new</p>
          <h3 className="text-xl font-semibold text-white leading-tight">Latest inside Space</h3>
        </div>
        <span className="text-xs text-gray-400">{entries.length} updates</span>
      </div>

      <div className="space-y-3" role="list">
        {entries.map(entry => (
          <Link
            key={entry.id}
            href={entry.link || '#'}
            className="block rounded-xl bg-black/30 border border-purple-500/30 hover:border-purple-300/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/80 p-4 transition-all"
            role="listitem"
            aria-label={`${entry.title} — ${entry.summary}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-white font-semibold leading-tight mb-1">{entry.title}</h4>
                <p className="text-sm text-gray-300 leading-relaxed">{entry.summary}</p>
                {entry.tags?.length ? (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {entry.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="text-[11px] px-2 py-1 rounded bg-purple-500/15 text-purple-200 border border-purple-500/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
              <span className="text-[11px] text-gray-400 whitespace-nowrap">{formatDate(entry.date)}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
