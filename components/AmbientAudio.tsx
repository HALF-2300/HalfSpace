'use client'

import { useAudio } from '@/lib/audioContext'
import { useState, useEffect } from 'react'

export default function AmbientAudio() {
  const { isPlaying, isLoading, toggle } = useAudio()
  const [showLoading, setShowLoading] = useState(false)

  // Only show loading for a short time, then hide it
  useEffect(() => {
    if (isLoading) {
      setShowLoading(true)
      const timer = setTimeout(() => {
        setShowLoading(false)
      }, 2000) // Hide loading after 2 seconds max
      return () => clearTimeout(timer)
    } else {
      setShowLoading(false)
    }
  }, [isLoading])

  return (
    <button
      onClick={toggle}
      aria-label={isPlaying ? 'Disable ambient sound' : 'Enable ambient sound'}
      className={`px-4 py-2 glass rounded-lg border transition-all flex items-center gap-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-space-dark ${
        isPlaying 
          ? 'border-green-500/50 hover:border-green-500/70 bg-green-500/10' 
          : 'border-purple-500/50 hover:border-purple-500/70 bg-purple-500/10'
      }`}
      title={isPlaying ? 'Click to disable space ambient sound' : 'Click to enable space ambient sound'}
      disabled={showLoading}
    >
      {showLoading ? (
        <>
          <span className="text-lg">🌌</span>
          <span className="text-gray-300 font-medium">Ready...</span>
        </>
      ) : isPlaying ? (
        <>
          <span className="text-lg">🌌</span>
          <span className="text-green-300 font-medium">Space Sound: On</span>
        </>
      ) : (
        <>
          <span className="text-lg">🌌</span>
          <span className="text-purple-300 font-medium">Space Sound</span>
        </>
      )}
    </button>
  )
}

