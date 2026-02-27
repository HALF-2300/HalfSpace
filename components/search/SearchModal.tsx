'use client'

import React, { useState, useEffect, useRef } from 'react'
import { search, type SearchResult } from './searchIndex'
import Link from 'next/link'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (query.trim()) {
      const searchResults = search(query)
      setResults(searchResults)
      setSelectedIndex(0)
    } else {
      setResults([])
    }
  }, [query])

  useEffect(() => {
    if (!isOpen) {
      setQuery('')
      setResults([])
      setSelectedIndex(0)
    }
  }, [isOpen])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev - 1 + results.length) % results.length)
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      window.location.href = results[selectedIndex].url
    }
  }

  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.type]) acc[result.type] = []
    acc[result.type].push(result)
    return acc
  }, {} as Record<string, SearchResult[]>)

  const typeLabels = {
    page: '📄 Pages',
    object: '🪐 Objects',
    mission: '🚀 Missions',
    article: '📰 Articles'
  }

  const typeOrder: Array<keyof typeof typeLabels> = ['page', 'object', 'mission', 'article']

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-20">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl mx-4 bg-gray-900/95 border border-purple-500/30 rounded-xl shadow-2xl overflow-hidden"
        style={{
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: '0 0 60px rgba(139, 92, 246, 0.3)'
        }}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-purple-500/20">
          <span className="text-2xl">🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search objects, missions, articles..."
            className="flex-1 bg-transparent text-white text-lg placeholder-gray-500 outline-none"
          />
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-sm px-2 py-1 rounded bg-gray-800/50"
          >
            ESC
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {query.trim() === '' ? (
            <div className="p-8 text-center">
              <p className="text-gray-400 text-sm">
                Type to search across all content
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Try: "Mars", "Apollo", "Black Holes"
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-400 text-sm">No results found</p>
              <p className="text-gray-500 text-xs mt-2">
                Try a different search term
              </p>
            </div>
          ) : (
            <div className="py-2">
              {typeOrder.map(type => {
                const items = groupedResults[type]
                if (!items || items.length === 0) return null

                return (
                  <div key={type} className="mb-4">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      {typeLabels[type]}
                    </div>
                    {items.map((result, idx) => {
                      const globalIndex = results.indexOf(result)
                      const isSelected = globalIndex === selectedIndex

                      return (
                        <Link
                          key={result.id}
                          href={result.url}
                          onClick={onClose}
                          className={`
                            block px-4 py-3 transition-colors
                            ${isSelected 
                              ? 'bg-purple-600/30 border-l-2 border-purple-500' 
                              : 'hover:bg-gray-800/50'
                            }
                          `}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-medium text-sm truncate">
                                {result.title}
                              </p>
                              <p className="text-gray-400 text-xs truncate">
                                {result.description}
                              </p>
                            </div>
                            <span className="text-gray-500 text-xs">→</span>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-purple-500/20 bg-gray-900/50">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
              <span>ESC Close</span>
            </div>
            <div>
              {results.length > 0 && `${results.length} result${results.length === 1 ? '' : 's'}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
