'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAudio } from '@/lib/audioContext'

export default function ImmersiveEntry() {
  const [isVisible, setIsVisible] = useState(true)
  const [phase, setPhase] = useState(0)
  const { play, isPlaying } = useAudio()

  useEffect(() => {
    // Check if already shown in this session
    const hasSeen = sessionStorage.getItem('spaceExplorerEntrySeen')
    if (hasSeen === 'true') {
      setIsVisible(false)
      // Always try to start audio even if entry was seen before
      setTimeout(() => {
        play().catch(() => {
          // Autoplay blocked, will be enabled on user interaction
        })
      }, 200)
      return
    }

    // Start audio immediately when entry screen appears
    // Use multiple attempts to ensure it plays
    const audioTimer1 = setTimeout(() => {
      play().catch(() => {})
    }, 100)
    
    const audioTimer2 = setTimeout(() => {
      play().catch(() => {})
    }, 500)
    
    const audioTimer3 = setTimeout(() => {
      play().catch(() => {})
    }, 1000)

    const timer1 = setTimeout(() => setPhase(1), 2000)
    const timer2 = setTimeout(() => setPhase(2), 5000)
    const timer3 = setTimeout(() => {
      setPhase(3)
      setTimeout(() => {
        setIsVisible(false)
        sessionStorage.setItem('spaceExplorerEntrySeen', 'true')
      }, 3000)
    }, 8000)

    return () => {
      if (audioTimer1) clearTimeout(audioTimer1)
      if (audioTimer2) clearTimeout(audioTimer2)
      if (audioTimer3) clearTimeout(audioTimer3)
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [play, isPlaying])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-space-deeper">
      {/* Animated Starfield */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(500)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
              opacity: phase >= 1 ? 1 : 0,
              transition: 'opacity 2s ease-in',
            }}
          />
        ))}
      </div>

      {/* Nebula Background Effects */}
      <div className="absolute inset-0">
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-500/20 blur-3xl animate-pulse-slow"
          style={{ opacity: phase >= 1 ? 1 : 0, transition: 'opacity 2s ease-in' }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl animate-pulse-slow"
          style={{ opacity: phase >= 1 ? 1 : 0, transition: 'opacity 2s ease-in', animationDelay: '1s' }}
        />
        <div 
          className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full bg-pink-500/10 blur-3xl animate-pulse-slow"
          style={{ opacity: phase >= 1 ? 1 : 0, transition: 'opacity 2s ease-in', animationDelay: '2s' }}
        />
      </div>

      {/* Text Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center px-4">
          {phase === 0 && (
            <div className="animate-fade-in">
              <h1 className="text-6xl md:text-8xl font-bold mb-4 text-gradient animate-pulse">
                Welcome to Space
              </h1>
            </div>
          )}
          
          {phase === 1 && (
            <div className="animate-fade-in">
              <h1 className="text-7xl md:text-9xl font-bold mb-6 text-gradient animate-float">
                🚀
              </h1>
              <p className="text-3xl md:text-5xl text-white mb-4 font-light">
                You are entering
              </p>
              <p className="text-4xl md:text-6xl font-bold text-gradient">
                THE COSMOS
              </p>
            </div>
          )}

          {phase === 2 && (
            <div className="animate-fade-in">
              <h1 className="text-5xl md:text-7xl font-bold mb-8 text-gradient">
                HalfSPACE
              </h1>
              <p className="text-2xl md:text-3xl text-gray-300 mb-6 max-w-3xl mx-auto">
                Prepare for an incredible journey through the universe
              </p>
              <div className="flex justify-center gap-4">
                <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse" />
                <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="w-3 h-3 rounded-full bg-pink-500 animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          )}

          {phase === 3 && (
            <div className="animate-fade-in">
              <Link
                href="#main-content"
                className="inline-block px-12 py-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-bold text-2xl hover:from-purple-700 hover:to-blue-700 transform hover:scale-110 transition-all shadow-2xl glow-purple animate-float"
                onClick={() => setIsVisible(false)}
              >
                Enter the Universe →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Particle Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 1}s`,
              opacity: phase >= 2 ? 0.6 : 0,
              transition: 'opacity 1s ease-in',
            }}
          />
        ))}
      </div>
    </div>
  )
}

