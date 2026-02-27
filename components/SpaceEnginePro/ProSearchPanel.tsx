'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { defaultSpaceEnginePro, SpaceEnginePro, SpaceEngineProResult } from '@/utils/indexer/spaceEnginePro'
import { SpaceContentType, SpaceIndexEntry } from '@/utils/indexer/types'

interface ProSearchPanelProps {
  onSelect?: (entry: SpaceIndexEntry) => void
  limit?: number
  title?: string
}

const typeLabels: Record<SpaceContentType, string> = {
  article: 'Articles',
  term: 'Terms',
  mission: 'Missions',
  fact: 'Facts',
  image: 'Images',
  era: 'Eras',
}

const renderParts = (parts: { text: string; match?: boolean }[]) =>
  parts.map((part, idx) =>
    part.match ? (
      <mark key={`${part.text}-${idx}`} className="bg-purple-600/40 text-white px-0.5 rounded">
        {part.text}
      </mark>
    ) : (
      <span key={`${part.text}-${idx}`}>{part.text}</span>
    ),
  )

export function ProSearchPanel({ onSelect, limit = 20, title = 'Space Engine Pro' }: ProSearchPanelProps) {
  const [query, setQuery] = useState('')
  const [activeTypes, setActiveTypes] = useState<Set<SpaceContentType>>(new Set())
  const [results, setResults] = useState<SpaceEngineProResult[]>([])
  const [engine] = useState<SpaceEnginePro>(() => defaultSpaceEnginePro)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const facets = useMemo(() => engine.facets(), [engine])
  const quickPicks = useMemo(() => engine.quickPicks(6), [engine])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const handle = setTimeout(() => {
      const types = activeTypes.size ? Array.from(activeTypes) : undefined
      const hits = engine.search({ query, types, limit, minScore: 0.04 })
      setResults(hits)
    }, 160)

    return () => clearTimeout(handle)
  }, [query, engine, activeTypes, limit])

  const toggleType = (type: SpaceContentType) => {
    const next = new Set(activeTypes)
    if (next.has(type)) {
      next.delete(type)
    } else {
      next.add(type)
    }
    setActiveTypes(next)
  }

  const handleSelect = (entry: SpaceIndexEntry) => {
    setSelectedId(entry.id)
    if (onSelect) onSelect(entry)
  }

  return (
    <div className="space-y-5">
      <div className="glass border border-purple-500/30 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <p className="text-xs uppercase text-purple-300 tracking-[0.2em]">Space Engine Pro</p>
            <h2 className="text-2xl font-semibold text-white leading-tight">{title}</h2>
            <p className="text-sm text-gray-400">
              Unified index (articles, glossary, missions, facts, images, eras) with BM25-lite ranking and live
              highlighting.
            </p>
          </div>
          <div className="flex gap-3 text-sm text-gray-400">
            <span className="px-3 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
              {Object.values(facets).reduce((sum, val) => sum + val, 0)} entries
            </span>
            <span className="px-3 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
              {results.length ? `${results.length} results` : 'Ready'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Quick search across the entire Space index…"
            className="w-full bg-black/30 border border-purple-500/40 rounded-xl px-4 py-3 text-white placeholder:text-gray-400 focus:outline-none focus:border-purple-300"
            aria-label="Search the space index"
          />
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
            All ({Object.values(facets).reduce((sum, val) => sum + val, 0)})
          </button>
          {(Object.keys(facets) as SpaceContentType[]).map(type => (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                activeTypes.has(type)
                  ? 'bg-purple-600 text-white'
                  : 'glass border border-purple-500/30 text-gray-200 hover:border-purple-400/60'
              }`}
            >
              {typeLabels[type]} ({facets[type]})
            </button>
          ))}
        </div>

        {!query && (
          <div className="mt-5">
            <p className="text-xs uppercase text-purple-200 tracking-[0.15em] mb-2">Quick picks</p>
            <div className="flex flex-wrap gap-2">
              {quickPicks.map(entry => (
                <button
                  key={entry.id}
                  onClick={() => setQuery(entry.title)}
                  className="px-3 py-2 rounded-lg bg-purple-500/15 text-purple-100 border border-purple-500/20 hover:border-purple-400/60 transition"
                >
                  {entry.title}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {query && results.length === 0 && (
        <div className="text-center text-gray-400 py-8 glass rounded-xl border border-purple-500/20">
          No results for “{query}”
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-3">
          {results.map(result => (
            <ResultCard
              key={result.entry.id}
              result={result}
              isSelected={selectedId === result.entry.id}
              onSelect={handleSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function ResultCard({
  result,
  isSelected,
  onSelect,
}: {
  result: SpaceEngineProResult
  isSelected: boolean
  onSelect: (entry: SpaceIndexEntry) => void
}) {
  const href = result.entry.href || '#'
  const badge = result.entry.category || result.entry.type

  return (
    <Link
      href={href}
      onClick={() => onSelect(result.entry)}
      className={`block p-4 rounded-xl glass border transition-all hover:-translate-y-0.5 ${
        isSelected ? 'border-purple-300 bg-purple-500/10' : 'border-purple-500/30 hover:border-purple-400/70'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-purple-300 mb-1 flex items-center gap-2">
            <span className="font-semibold">#{result.rank}</span>
            <span>{badge}</span>
          </div>
          <h3 className="text-lg font-semibold text-white leading-tight">{renderParts(result.highlights.title)}</h3>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] px-2 py-1 rounded bg-purple-500/20 text-purple-200 border border-purple-500/30">
            {result.entry.type}
          </span>
          <span className="text-[10px] px-2 py-1 rounded bg-green-500/15 text-green-200 border border-green-500/30">
            {result.score.toFixed(3)}
          </span>
        </div>
      </div>
      <p className="text-sm text-gray-300 mt-2 line-clamp-3">{renderParts(result.highlights.summary)}</p>
      {result.matches.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {result.matches.slice(0, 6).map(match => (
            <span key={match} className="text-xs bg-purple-500/20 text-purple-200 px-2 py-1 rounded border border-purple-500/20">
              {match}
            </span>
          ))}
        </div>
      )}
    </Link>
  )
}
