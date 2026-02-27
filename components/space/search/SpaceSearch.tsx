'use client'

import { useState, useEffect, useCallback } from 'react'
import { getSearchEngine } from '@/utils/search/searchEngine'
import { SearchResult } from '@/utils/search/searchIndex'
import Link from 'next/link'

interface SpaceSearchProps {
  onResultClick?: (result: SearchResult) => void
  maxResults?: number
}

export default function SpaceSearch({ 
  onResultClick,
  maxResults = 10 
}: SpaceSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize search engine
  useEffect(() => {
    const init = async () => {
      try {
        const engine = getSearchEngine()
        await engine.initialize()
        setCategories(engine.getCategories())
        setIsInitialized(true)
      } catch (error) {
        console.error('Failed to initialize search:', error)
      }
    }
    init()
  }, [])

  // Perform search
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!isInitialized || !searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    try {
      const engine = getSearchEngine()
      const searchResults = engine.search(searchQuery, {
        category: selectedCategory || undefined,
        limit: maxResults,
        minScore: 0.2,
      })
      setResults(searchResults)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [isInitialized, selectedCategory, maxResults])

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(query)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, performSearch])

  const handleResultClick = (result: SearchResult) => {
    if (onResultClick) {
      onResultClick(result)
    }
  }

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search encyclopedia..."
          className="w-full px-4 py-3 glass rounded-xl border-2 border-purple-500/30 focus:border-purple-500 focus:outline-none text-white placeholder-gray-400"
          aria-label="Search encyclopedia"
        />
        {isLoading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-purple-500" />
          </div>
        )}
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded-lg border-2 transition-all ${
              selectedCategory === ''
                ? 'border-purple-500 bg-purple-500/20 text-white'
                : 'border-purple-500/30 text-gray-300 hover:border-purple-500/50'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                selectedCategory === category
                  ? 'border-purple-500 bg-purple-500/20 text-white'
                  : 'border-purple-500/30 text-gray-300 hover:border-purple-500/50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Search Results */}
      {results.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm text-gray-400">
            Found {results.length} result{results.length !== 1 ? 's' : ''}
          </div>
          {results.map((result, index) => (
            <Link
              key={result.document.id}
              href={result.document.slug ? `/space/encyclopedia/${result.document.slug}` : '#'}
              onClick={() => handleResultClick(result)}
              className="block glass rounded-xl p-4 border-2 border-purple-500/30 hover:border-purple-500/70 transition-all enhanced-card-glow"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-bold text-white">
                  {result.document.title}
                </h3>
                <span className="text-xs text-purple-400 bg-purple-500/20 px-2 py-1 rounded">
                  {result.score.toFixed(2)}
                </span>
              </div>
              {result.document.summary && (
                <p className="text-sm text-gray-300 mb-2 line-clamp-2">
                  {result.document.summary}
                </p>
              )}
              {result.document.category && (
                <div className="text-xs text-purple-400">
                  {result.document.category}
                </div>
              )}
              {result.matches.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {result.matches.slice(0, 3).map((match) => (
                    <span
                      key={match}
                      className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded"
                    >
                      {match}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}

      {query && results.length === 0 && !isLoading && isInitialized && (
        <div className="text-center text-gray-400 py-8">
          No results found for "{query}"
        </div>
      )}
    </div>
  )
}
