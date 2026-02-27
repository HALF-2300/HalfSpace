'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { SpaceSearchEngine, SpaceSearchResult, buildHighlightParts } from '@/utils/indexer/spaceSearchEngine'
import { getSpaceIndexEntries } from '@/utils/indexer/spaceIndexer'
import { HighlightPart, SpaceContentType } from '@/utils/indexer/types'

const typeLabels: Record<SpaceContentType, string> = {
  article: 'Article',
  term: 'Term',
  mission: 'Mission',
  fact: 'Fact',
  image: 'Image',
  era: 'Era',
}

const typeOrder: SpaceContentType[] = ['article', 'term', 'mission', 'image', 'fact', 'era']

const renderParts = (parts: HighlightPart[]) =>
  parts.map((part, idx) =>
    part.match ? (
      <mark key={`${part.text}-${idx}`} className="bg-purple-600/40 text-white px-0.5 rounded">
        {part.text}
      </mark>
    ) : (
      <span key={`${part.text}-${idx}`}>{part.text}</span>
    ),
  )

const MatchBadges = ({ matches }: { matches: string[] }) => {
  if (!matches?.length) return null
  return (
    <div className="flex flex-wrap gap-1 mt-3">
      {matches.slice(0, 4).map(match => (
        <span key={match} className="text-xs bg-purple-500/20 text-purple-200 px-2 py-1 rounded">
          {match}
        </span>
      ))}
    </div>
  )
}

export default function SpaceSearch() {
  const [query, setQuery] = useState('')
  const [activeTypes, setActiveTypes] = useState<Set<SpaceContentType>>(new Set())
  const [results, setResults] = useState<SpaceSearchResult[]>([])
  const [engine] = useState(() => new SpaceSearchEngine(getSpaceIndexEntries()))
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    engine.initialize()
    setIsReady(true)
  }, [engine])

  useEffect(() => {
    if (!isReady) return
    if (!query.trim()) {
      setResults([])
      return
    }

    const handle = setTimeout(() => {
      const types = activeTypes.size ? Array.from(activeTypes) : undefined
      const next = engine.search({ query, types, minScore: 0.08, limit: 50 })
      setResults(next)
    }, 200)

    return () => clearTimeout(handle)
  }, [query, engine, activeTypes, isReady])

  const grouped = useMemo(() => engine.groupByType(results), [results, engine])

  const toggleType = (type: SpaceContentType) => {
    const next = new Set(activeTypes)
    if (next.has(type)) {
      next.delete(type)
    } else {
      next.add(type)
    }
    setActiveTypes(next)
  }

  return (
    <div className="space-y-6">
      <div className="glass border border-purple-500/30 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search handbook, glossary, missions, facts, gallery, eras…"
              className="w-full bg-black/30 border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder:text-gray-400 focus:outline-none focus:border-purple-400"
              aria-label="Search space knowledge"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => setActiveTypes(new Set())}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
              activeTypes.size === 0
                ? 'bg-purple-600 text-white'
                : 'glass border border-purple-500/30 text-gray-200 hover:border-purple-400/60'
            }`}
          >
            All
          </button>
          {typeOrder.map(type => (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                activeTypes.has(type)
                  ? 'bg-purple-600 text-white'
                  : 'glass border border-purple-500/30 text-gray-200 hover:border-purple-400/60'
              }`}
            >
              {typeLabels[type]}
            </button>
          ))}
        </div>
      </div>

      {query && results.length === 0 && (
        <div className="text-center text-gray-400 py-8 glass rounded-xl border border-purple-500/20">
          No results for “{query}”
        </div>
      )}

      {typeOrder.map(type => {
        const items = grouped[type]
        if (!items || items.length === 0) return null
        return (
          <div key={type} className="glass rounded-2xl border border-purple-500/30 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm uppercase text-purple-300 tracking-wide">{typeLabels[type]}</span>
                <span className="text-xs text-gray-400">({items.length})</span>
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-purple-500/40 to-transparent ml-4" />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {items.map(result => (
                <ResultCard key={result.document.id} result={result} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ResultCard({ result }: { result: SpaceSearchResult }) {
  const href = result.document.href || '#'
  const titleParts = result.highlights.title.length
    ? result.highlights.title
    : buildHighlightParts(result.document.title, result.matches)
  const summaryParts = result.highlights.summary.length
    ? result.highlights.summary
    : buildHighlightParts(result.document.summary || result.document.content, result.matches)

  return (
    <Link
      href={href}
      className="block p-4 rounded-xl glass border border-purple-500/30 hover:border-purple-400/70 transition-all hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-purple-300 mb-1">{result.document.category || result.document.type}</div>
          <h3 className="text-lg font-semibold text-white leading-tight">{renderParts(titleParts)}</h3>
        </div>
        <span className="text-[10px] px-2 py-1 rounded bg-purple-500/20 text-purple-200 border border-purple-500/30">
          {result.score.toFixed(2)}
        </span>
      </div>
      <p className="text-sm text-gray-300 mt-2 line-clamp-3">{renderParts(summaryParts)}</p>
      <MatchBadges matches={result.matches} />
    </Link>
  )
}
