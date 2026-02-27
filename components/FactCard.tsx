'use client'

import { useState } from 'react'

interface FactCardProps {
  fact: string
  source?: string
  icon?: string
  whyItMatters?: string
  showMeLink?: string
}

export default function FactCard({ fact, source, icon, whyItMatters, showMeLink }: FactCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div
      className="relative h-64 cursor-pointer [perspective:1000px] group"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`relative w-full h-full [transform-style:preserve-3d] transition-transform duration-700 ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
        {/* Front */}
        <div className="absolute inset-0 [backface-visibility:hidden] glass rounded-xl p-6 flex flex-col items-center justify-center text-center border-2 border-purple-500/20 hover:border-purple-500/50 transition-all hover-lift">
          {icon && <span className="text-5xl mb-4 animate-float group-hover:scale-125 transition-transform">{icon}</span>}
          <p className="text-white text-lg font-medium mb-2">{fact}</p>
          <div className="mt-4 text-xs text-purple-400 font-semibold flex items-center gap-1">
            <span>Click to discover</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>
        {/* Back */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] glass rounded-xl p-6 flex flex-col items-center justify-center text-center border-2 border-blue-500/30">
          <span className="text-4xl mb-4">💫</span>
          {whyItMatters && (
            <p className="text-white text-sm font-semibold mb-2">Why it matters:</p>
          )}
          <p className="text-gray-300 text-sm mb-4">
            {whyItMatters || 'This fact reveals the incredible scale and wonder of our universe.'}
          </p>
          {showMeLink && (
            <a
              href={showMeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-4 py-2 bg-purple-500/20 rounded-lg border border-purple-500/30 hover:bg-purple-500/30 transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              Show me →
            </a>
          )}
          {source && (
            <p className="text-gray-500 text-xs mt-4">Source: {source}</p>
          )}
          <p className="text-gray-400 text-xs mt-2">Click to flip back</p>
        </div>
      </div>
    </div>
  )
}
