'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import erasData from '@/data/eras.json'

type EraCard = {
  id: string
  name: string
  name_ar: string
  range: string
  summary: string
  icon: string
  gradientFrom: string
  gradientTo: string
}

type RelatedTopic = {
  label: string
  slug: string
}

type TimelineEvent = {
  id: string
  order: number
  time: string
  title: string
  description: string
  era: string
  icon: string
  relatedTopics: RelatedTopic[]
}

type EraData = {
  title: string
  subtitle: string
  eras: EraCard[]
  timeline: TimelineEvent[]
}

const data = erasData as EraData

export default function EraExplorer() {
  const timeline = useMemo(
    () => [...data.timeline].sort((a, b) => a.order - b.order),
    []
  )

  const eraLookup = useMemo(
    () =>
      data.eras.reduce<Record<string, EraCard>>((acc, era) => {
        acc[era.id] = era
        return acc
      }, {}),
    []
  )

  const [query, setQuery] = useState('')
  const [activeEra, setActiveEra] = useState<string>('all')
  const [highlightId, setHighlightId] = useState<string | null>(null)
  const eventRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const filteredEvents = useMemo(() => {
    const text = query.trim().toLowerCase()
    return timeline.filter((event) => {
      const matchesEra = activeEra === 'all' || event.era === activeEra
      if (!text) return matchesEra
      const haystack = `${event.title} ${event.description} ${event.time}`.toLowerCase()
      const topics = event.relatedTopics.map((t) => t.label.toLowerCase()).join(' ')
      return matchesEra && (haystack.includes(text) || topics.includes(text))
    })
  }, [timeline, activeEra, query])

  const eventCountsByEra = useMemo(() => {
    return timeline.reduce<Record<string, number>>((acc, event) => {
      acc[event.era] = (acc[event.era] || 0) + 1
      return acc
    }, {})
  }, [timeline])

  useEffect(() => {
    if (!highlightId) return
    const target = eventRefs.current[highlightId]
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    const timeout = setTimeout(() => setHighlightId(null), 2000)
    return () => clearTimeout(timeout)
  }, [highlightId])

  const handleRandomEra = () => {
    const pool = filteredEvents.length ? filteredEvents : timeline
    const choice = pool[Math.floor(Math.random() * pool.length)]
    setActiveEra(choice.era)
    setHighlightId(choice.id)
  }

  const resetFilters = () => {
    setActiveEra('all')
    setQuery('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-slate-900 text-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.15),transparent_35%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(236,72,153,0.12),transparent_30%)]" />
        <div className="max-w-7xl mx-auto px-4 pt-20 pb-8 relative">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-purple-300/80">
                الزمن من البداية للآن
              </p>
              <h1 className="text-4xl md:text-6xl font-extrabold text-gradient drop-shadow-lg">
                {data.title}
              </h1>
              <p className="text-lg md:text-xl text-gray-200 max-w-2xl mt-3">
                {data.subtitle}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleRandomEra}
                className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-fuchsia-500 to-cyan-500 shadow-lg shadow-fuchsia-500/20 hover:scale-[1.02] transition"
              >
                🎲 Random era
              </button>
              <button
                onClick={resetFilters}
                className="px-6 py-3 rounded-xl font-semibold border border-white/20 hover:border-white/40 transition backdrop-blur"
              >
                Reset filters
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass border border-white/10 rounded-2xl p-4">
              <p className="text-sm text-gray-400">Timeline points</p>
              <p className="text-3xl font-bold">{timeline.length}</p>
              <p className="text-sm text-gray-400">Big Bang → Today</p>
            </div>
            <div className="glass border border-white/10 rounded-2xl p-4">
              <p className="text-sm text-gray-400">Eras</p>
              <p className="text-3xl font-bold">{data.eras.length}</p>
              <p className="text-sm text-gray-400">Early Universe to Life</p>
            </div>
            <div className="glass border border-white/10 rounded-2xl p-4">
              <p className="text-sm text-gray-400">Search / Filter</p>
              <p className="text-3xl font-bold">
                {filteredEvents.length}/{timeline.length}
              </p>
              <p className="text-sm text-gray-400">matching events</p>
            </div>
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 pb-12 space-y-10">
        <div className="glass border border-white/10 rounded-3xl p-6 shadow-xl shadow-purple-500/10">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveEra('all')}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                  activeEra === 'all'
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500'
                    : 'border border-white/20 hover:border-white/40'
                }`}
              >
                All eras
              </button>
              {data.eras.map((era) => (
                <button
                  key={era.id}
                  onClick={() => setActiveEra(era.id)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                    activeEra === era.id
                      ? `bg-gradient-to-r ${era.gradientFrom} ${era.gradientTo}`
                      : 'border border-white/20 hover:border-white/40'
                  }`}
                >
                  {era.icon} {era.name}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search time, title, topic..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-4 pr-10 focus:border-purple-400 focus:outline-none"
                />
                <span className="absolute right-3 top-2.5 text-gray-400">⌕</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {data.eras.map((era) => {
            const count = eventCountsByEra[era.id] || 0
            return (
              <div
                key={era.id}
                className="glass border border-white/10 rounded-2xl p-4 flex flex-col gap-2 shadow-lg shadow-indigo-500/10"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`h-10 w-10 rounded-xl bg-gradient-to-br ${era.gradientFrom} ${era.gradientTo} flex items-center justify-center text-lg`}
                  >
                    {era.icon}
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">{era.range}</p>
                    <p className="font-semibold">{era.name}</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{era.summary}</p>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>{count} points</span>
                  <span>{era.name_ar}</span>
                </div>
              </div>
            )
          })}
        </div>

        <div className="relative">
          <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/60 via-blue-500/40 to-transparent pointer-events-none" />
          <div className="space-y-8">
            {filteredEvents.map((event, index) => {
              const isEven = index % 2 === 0
              const era = eraLookup[event.era]
              const accent = era ? `${era.gradientFrom} ${era.gradientTo}` : 'from-slate-500 to-slate-600'

              return (
                <div
                  key={event.id}
                  ref={(el) => { eventRefs.current[event.id] = el }}
                  className={`relative flex flex-col md:flex-row gap-4 md:gap-10 ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                  id={event.id}
                >
                  <div
                    className={`absolute left-2 md:left-1/2 md:-translate-x-1/2 top-4 h-4 w-4 rounded-full border-4 border-slate-950 bg-gradient-to-br ${accent} shadow-lg shadow-purple-500/30`}
                  />

                  <div className="md:w-5/12">
                    <div
                      className={`glass border rounded-2xl p-5 h-full transition transform hover:-translate-y-1 ${
                        highlightId === event.id
                          ? 'border-cyan-400 shadow-cyan-400/40 shadow-lg'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span
                          className={`text-sm font-semibold px-3 py-1 rounded-full bg-gradient-to-r ${accent}`}
                        >
                          {era ? era.name : event.era}
                        </span>
                        <span className="text-gray-300 text-sm">{event.time}</span>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{event.icon}</span>
                        <h3 className="text-2xl font-bold">{event.title}</h3>
                      </div>
                      <p className="text-gray-200 leading-relaxed mb-4">{event.description}</p>

                      <div className="flex flex-wrap gap-2">
                        {event.relatedTopics.map((topic) => (
                          <Link
                            key={topic.slug}
                            href={`/space/encyclopedia/${topic.slug}`}
                            className="text-sm px-3 py-1 rounded-full border border-white/15 hover:border-white/40 transition"
                          >
                            {topic.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="md:w-5/12 md:mt-6">
                    <div className="bg-gradient-to-r from-white/5 to-white/0 border border-white/10 rounded-2xl p-4">
                      <p className="text-sm text-gray-300">
                        Era focus:{' '}
                        <span className="font-semibold">
                          {era?.summary || 'Cosmic milestone'}
                        </span>
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        Range: {era?.range || '—'}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}

            {filteredEvents.length === 0 && (
              <div className="glass border border-white/10 rounded-2xl p-6 text-center">
                <p className="text-xl font-semibold mb-2">No matches yet</p>
                <p className="text-gray-400">
                  Try clearing the search or selecting a different era filter.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
