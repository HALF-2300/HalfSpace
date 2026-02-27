'use client'

import { useState, useEffect } from 'react'

interface DidYouKnowProps {
  facts: string[]
}

export default function DidYouKnow({ facts }: DidYouKnowProps) {
  const [currentFact, setCurrentFact] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentFact((prev) => (prev + 1) % facts.length)
        setIsVisible(true)
      }, 300)
    }, 5000)

    return () => clearInterval(interval)
  }, [facts.length])

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-pink-600/20 border border-purple-500/30 p-8">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
      <div className={`relative transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-start gap-4">
          <span className="text-4xl animate-pulse-slow">✨</span>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-3">
              Did You Know?
            </h3>
            <p className="text-white text-lg leading-relaxed">{facts[currentFact]}</p>
            <div className="flex gap-2 mt-4">
              {facts.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all ${
                    index === currentFact
                      ? 'w-8 bg-gradient-to-r from-purple-400 to-pink-400'
                      : 'w-2 bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

