'use client'

import { useState, useEffect, useCallback } from 'react'
import waitWhatData from '@/data/waitWhat.json'

interface SpaceFact {
  id: string
  fact: string
  factAr: string
  detail?: string
  image?: string
  icon?: string
  category: string
}

// Combine original facts with Wait What data
const originalFacts: SpaceFact[] = [
  {
    id: '1',
    fact: 'A day on Venus is longer than its year',
    factAr: 'يوم على الزهرة أطول من سنتها',
    image: 'https://images-assets.nasa.gov/image/PIA00271/PIA00271~orig.jpg',
    icon: '🌍',
    category: 'planets'
  },
  {
    id: '2',
    fact: 'Jupiter has at least 95 known moons',
    factAr: 'للمشتري 95 قمراً معروفاً على الأقل',
    image: 'https://images-assets.nasa.gov/image/PIA02873/PIA02873~orig.jpg',
    icon: '🌙',
    category: 'planets'
  },
  {
    id: '3',
    fact: 'Neptune has winds up to 2,100 km/h',
    factAr: 'رياح نبتون تصل إلى 2,100 كم/ساعة',
    image: 'https://images-assets.nasa.gov/image/PIA01492/PIA01492~orig.jpg',
    icon: '💨',
    category: 'planets'
  },
  {
    id: '4',
    fact: 'The Sun contains 99.86% of the solar system\'s mass',
    factAr: 'الشمس تحتوي على 99.86% من كتلة النظام الشمسي',
    image: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000263/GSFC_20171208_Archive_e000263~orig.jpg',
    icon: '☀️',
    category: 'stars'
  },
  {
    id: '5',
    fact: 'A black hole can be smaller than an atom but have the mass of a mountain',
    factAr: 'الثقب الأسود يمكن أن يكون أصغر من الذرة لكن بكتلة جبل',
    image: 'https://images-assets.nasa.gov/image/PIA23122/PIA23122~orig.jpg',
    icon: '⚫',
    category: 'cosmic-objects'
  }
]

// Add Wait What facts
const waitWhatFacts: SpaceFact[] = waitWhatData.facts.map(f => ({
  id: f.id,
  fact: f.fact,
  factAr: f.fact_ar,
  detail: f.detail,
  icon: f.icon,
  category: f.category
}))

// All facts combined
const allFacts: SpaceFact[] = [...originalFacts, ...waitWhatFacts]

interface SwipeableFactsProps {
  mode?: 'all' | 'wait-what'
  showDetail?: boolean
}

export default function SwipeableFacts({ mode = 'all', showDetail = true }: SwipeableFactsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [startX, setStartX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [offset, setOffset] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)
  const [shareToast, setShareToast] = useState(false)
  const [likedFacts, setLikedFacts] = useState<Set<string>>(new Set())

  const spaceFacts = mode === 'wait-what' ? waitWhatFacts : allFacts
  const currentFact = spaceFacts[currentIndex]

  // Share functionality
  const handleShare = useCallback(async () => {
    const shareText = `${currentFact.icon || '✨'} ${currentFact.fact}\n\nDiscover more at HalfSpace`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Wait, What?! - HalfSpace',
          text: shareText,
          url: window.location.href
        })
        return
      } catch {
        // User cancelled
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(shareText)
      setShareToast(true)
      setTimeout(() => setShareToast(false), 2000)
    } catch {
      console.error('Failed to copy')
    }
  }, [currentFact])

  // Like functionality
  const handleLike = useCallback(() => {
    setLikedFacts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(currentFact.id)) {
        newSet.delete(currentFact.id)
      } else {
        newSet.add(currentFact.id)
      }
      return newSet
    })
  }, [currentFact.id])

  // Reset explanation when changing facts
  useEffect(() => {
    setShowExplanation(false)
  }, [currentIndex])

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX)
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const currentX = e.touches[0].clientX
    setOffset(currentX - startX)
  }

  const handleTouchEnd = () => {
    if (Math.abs(offset) > 100) {
      if (offset > 0) {
        // Swipe right - previous
        setCurrentIndex((prev) => (prev === 0 ? spaceFacts.length - 1 : prev - 1))
      } else {
        // Swipe left - next
        setCurrentIndex((prev) => (prev === spaceFacts.length - 1 ? 0 : prev + 1))
      }
    }
    setOffset(0)
    setIsDragging(false)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setStartX(e.clientX)
    setIsDragging(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const currentX = e.clientX
    setOffset(currentX - startX)
  }

  const handleMouseUp = () => {
    if (Math.abs(offset) > 100) {
      if (offset > 0) {
        setCurrentIndex((prev) => (prev === 0 ? spaceFacts.length - 1 : prev - 1))
      } else {
        setCurrentIndex((prev) => (prev === spaceFacts.length - 1 ? 0 : prev + 1))
      }
    }
    setOffset(0)
    setIsDragging(false)
  }

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const currentX = e.clientX
        setOffset(currentX - startX)
      }
    }

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        if (Math.abs(offset) > 100) {
          if (offset > 0) {
            setCurrentIndex((prev) => (prev === 0 ? spaceFacts.length - 1 : prev - 1))
          } else {
            setCurrentIndex((prev) => (prev === spaceFacts.length - 1 ? 0 : prev + 1))
          }
        }
        setOffset(0)
        setIsDragging(false)
      }
    }

    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMouseMove)
      window.addEventListener('mouseup', handleGlobalMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove)
      window.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [isDragging, offset, startX])

  return (
    <div className="min-h-screen pt-20 px-4 py-12 flex items-center justify-center">
      {/* Share Toast */}
      {shareToast && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 bg-green-600 text-white rounded-lg shadow-lg text-sm animate-fade-in">
          Copied to clipboard!
        </div>
      )}

      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-gradient portal-title">
            {mode === 'wait-what' ? 'Wait, What?!' : 'Swipe for Facts'}
          </h1>
          <p className="text-gray-300 mb-4">
            {mode === 'wait-what' 
              ? 'Facts so surprising they make you say "Wait, what?!"'
              : 'Swipe right or left to discover amazing space facts'
            }
          </p>
          <div className="text-gray-400 text-sm">
            {currentIndex + 1} / {spaceFacts.length}
          </div>
        </div>

        {/* Swipeable Card */}
        <div
          className="relative h-[600px] rounded-3xl overflow-hidden glass border-2 border-purple-500/30 cursor-grab active:cursor-grabbing"
          style={{
            transform: `translateX(${offset}px) rotate(${offset * 0.02}deg)`,
            transition: isDragging ? 'none' : 'transform 0.3s ease-out'
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            {currentFact.image ? (
              <img
                src={currentFact.image}
                alt={currentFact.fact}
                className="w-full h-full object-cover opacity-30"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-indigo-900/50" />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/50 to-black" />
          </div>

          {/* Stars Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white animate-twinkle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 3 + 1}px`,
                  height: `${Math.random() * 3 + 1}px`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${Math.random() * 4 + 3}s`,
                }}
              />
            ))}
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center">
            <div className="text-6xl mb-6">{currentFact.icon || '✨'}</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
              {currentFact.fact}
            </h2>
            
            {/* Detail section */}
            {showDetail && currentFact.detail && (
              <div className="mb-6">
                {showExplanation ? (
                  <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 max-w-md animate-fade-in">
                    <p className="text-gray-200 text-sm leading-relaxed">{currentFact.detail}</p>
                    <button 
                      onClick={() => setShowExplanation(false)}
                      className="text-purple-400 text-xs mt-2 hover:underline"
                    >
                      Hide details
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowExplanation(true)}
                    className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-purple-300 text-sm transition-all"
                  >
                    Learn more
                  </button>
                )}
              </div>
            )}

            <div className="px-4 py-2 bg-purple-500/20 rounded-full text-purple-300 text-sm">
              {currentFact.category}
            </div>
          </div>

          {/* Action buttons */}
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-4 z-20">
            <button
              onClick={handleLike}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                likedFacts.has(currentFact.id)
                  ? 'bg-pink-500/30 border-2 border-pink-400 scale-110'
                  : 'bg-white/10 border-2 border-white/20 hover:border-pink-400/50'
              }`}
            >
              <span className="text-xl">{likedFacts.has(currentFact.id) ? '❤️' : '🤍'}</span>
            </button>
            <button
              onClick={handleShare}
              className="w-12 h-12 rounded-full bg-white/10 border-2 border-white/20 hover:border-blue-400/50 flex items-center justify-center transition-all"
            >
              <span className="text-xl">📤</span>
            </button>
          </div>

          {/* Swipe Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {spaceFacts.slice(
              Math.max(0, currentIndex - 3),
              Math.min(spaceFacts.length, currentIndex + 4)
            ).map((_, index) => {
              const actualIndex = Math.max(0, currentIndex - 3) + index
              return (
                <div
                  key={actualIndex}
                  className={`h-2 rounded-full transition-all ${
                    actualIndex === currentIndex
                      ? 'w-8 bg-purple-500'
                      : 'w-2 bg-purple-500/30'
                  }`}
                />
              )
            })}
          </div>

          {/* Swipe hints */}
          {offset < -30 && (
            <div className="absolute top-1/2 right-4 transform -translate-y-1/2 text-green-400 text-4xl animate-pulse">
              →
            </div>
          )}
          {offset > 30 && (
            <div className="absolute top-1/2 left-4 transform -translate-y-1/2 text-green-400 text-4xl animate-pulse">
              ←
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => setCurrentIndex((prev) => (prev === 0 ? spaceFacts.length - 1 : prev - 1))}
            className="px-8 py-4 glass rounded-xl border-2 border-purple-500/30 hover:border-purple-500/50 text-white font-bold transition-all transform hover:scale-105"
          >
            ← Previous
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev === spaceFacts.length - 1 ? 0 : prev + 1))}
            className="px-8 py-4 glass rounded-xl border-2 border-purple-500/30 hover:border-purple-500/50 text-white font-bold transition-all transform hover:scale-105"
          >
            Next →
          </button>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-8 mt-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <span>❤️</span>
            <span>{likedFacts.size} liked</span>
          </div>
          <div className="flex items-center gap-2">
            <span>👆</span>
            <span>Swipe or tap arrows</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Export a version specifically for Wait What facts
export function WaitWhatFacts() {
  return <SwipeableFacts mode="wait-what" showDetail={true} />
}