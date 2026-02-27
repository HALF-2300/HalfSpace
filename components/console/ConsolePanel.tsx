'use client'

import React, { useState, useEffect } from 'react'
import { savedItems, type SavedItem } from './SavedItems'
import Link from 'next/link'

interface ConsolePanelProps {
  onSearchClick: () => void
  onRandomJump: () => void
  onCategoryJump: (category: string) => void
  onStationMapClick: () => void
}

export default function ConsolePanel({ onSearchClick, onRandomJump, onCategoryJump, onStationMapClick }: ConsolePanelProps) {
  const [saved, setSaved] = useState<SavedItem[]>([])

  useEffect(() => {
    // Load saved items
    setSaved(savedItems.list())
    
    // Listen for storage changes
    const handleStorageChange = () => {
      setSaved(savedItems.list())
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleRemove = (id: string) => {
    savedItems.remove(id)
    setSaved(savedItems.list())
  }

  return (
    <div className="console-panel-content space-y-4">
      {/* Search */}
      <div>
        <button
          onClick={onSearchClick}
          className="w-full px-4 py-3 text-left rounded-lg
            bg-gray-800/40 border border-gray-700/50
            hover:border-purple-500/50 hover:bg-gray-800/60
            transition-all duration-200
            flex items-center gap-3"
        >
          <span className="text-xl">🔍</span>
          <span className="text-gray-400 text-sm">Search everything...</span>
          <span className="ml-auto text-xs text-gray-500 px-2 py-1 rounded bg-gray-700/50">
            Ctrl+K
          </span>
        </button>
      </div>

      {/* Quick Actions */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onStationMapClick}
            className="px-3 py-2 rounded-lg bg-purple-600/20 border border-purple-500/30
              hover:bg-purple-600/30 hover:border-purple-500/50
              text-white text-xs font-medium
              transition-all duration-200 hover:scale-105"
          >
            🗺️ Station Map
          </button>
          <Link 
            href="/today"
            className="px-3 py-2 rounded-lg bg-blue-600/20 border border-blue-500/30
              hover:bg-blue-600/30 hover:border-blue-500/50
              text-white text-xs font-medium text-center
              transition-all duration-200 hover:scale-105"
          >
            📅 Today
          </Link>
        </div>
      </div>

      {/* Jump Presets */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2">
          Quick Jump
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onCategoryJump('objects')}
            className="px-3 py-2 rounded-lg bg-cyan-600/20 border border-cyan-500/30
              hover:bg-cyan-600/30 hover:border-cyan-500/50
              text-white text-xs font-medium
              transition-all duration-200 hover:scale-105"
          >
            🪐 Objects
          </button>
          <button
            onClick={() => onCategoryJump('phenomena')}
            className="px-3 py-2 rounded-lg bg-purple-600/20 border border-purple-500/30
              hover:bg-purple-600/30 hover:border-purple-500/50
              text-white text-xs font-medium
              transition-all duration-200 hover:scale-105"
          >
            💫 Phenomena
          </button>
          <button
            onClick={() => onCategoryJump('missions')}
            className="px-3 py-2 rounded-lg bg-orange-600/20 border border-orange-500/30
              hover:bg-orange-600/30 hover:border-orange-500/50
              text-white text-xs font-medium
              transition-all duration-200 hover:scale-105"
          >
            🚀 Missions
          </button>
          <button
            onClick={() => onCategoryJump('learning')}
            className="px-3 py-2 rounded-lg bg-green-600/20 border border-green-500/30
              hover:bg-green-600/30 hover:border-green-500/50
              text-white text-xs font-medium
              transition-all duration-200 hover:scale-105"
          >
            📚 Learn
          </button>
          <button
            onClick={() => onCategoryJump('experiences')}
            className="px-3 py-2 rounded-lg bg-pink-600/20 border border-pink-500/30
              hover:bg-pink-600/30 hover:border-pink-500/50
              text-white text-xs font-medium
              transition-all duration-200 hover:scale-105"
          >
            ✨ Experience
          </button>
          <button
            onClick={onRandomJump}
            className="px-3 py-2 rounded-lg bg-gradient-to-r from-pink-600/20 to-purple-600/20 
              border border-pink-500/30
              hover:from-pink-600/30 hover:to-purple-600/30 hover:border-pink-500/50
              text-white text-xs font-medium
              transition-all duration-200 hover:scale-105"
          >
            🎲 Surprise Me
          </button>
        </div>
      </div>

      {/* Saved Items */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2">
          Saved ({saved.length})
        </h3>
        <div className="space-y-1 max-h-48 overflow-y-auto scrollbar-hide">
          {saved.length === 0 ? (
            <p className="text-xs text-gray-500 px-2 py-4 text-center">
              No saved items yet
            </p>
          ) : (
            saved.slice(0, 10).map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 px-2 py-2 rounded
                  hover:bg-gray-800/40 group"
              >
                <Link 
                  href={item.url}
                  className="flex-1 min-w-0"
                >
                  <p className="text-xs text-white truncate hover:text-purple-400 transition-colors">
                    {item.title}
                  </p>
                  <p className="text-[10px] text-gray-500 uppercase">
                    {item.type}
                  </p>
                </Link>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="opacity-0 group-hover:opacity-100
                    text-red-400 hover:text-red-300
                    text-xs transition-opacity"
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
