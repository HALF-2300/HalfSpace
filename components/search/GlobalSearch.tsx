'use client'

import React, { useState, useEffect } from 'react'
import SearchModal from './SearchModal'

/**
 * GlobalSearch - Keyboard-activated search
 * 
 * Features:
 * - Ctrl+K (Cmd+K on Mac) to open
 * - Optional / key to open
 * - Fast fuzzy search
 * - Grouped results
 */
export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
      // Forward slash (/) - only if not in input
      else if (e.key === '/' && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault()
        setIsOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <SearchModal 
      isOpen={isOpen} 
      onClose={() => setIsOpen(false)} 
    />
  )
}
