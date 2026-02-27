'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

export default function SpaceJourneyPage() {
  const [journeyStage, setJourneyStage] = useState(0)
  const [speed, setSpeed] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  const stages = [
    {
      name: "Launch from Earth",
      description: "Your journey begins on our beautiful blue planet",
      color: "#3b82f6",
      image: "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000263/GSFC_20171208_Archive_e000263~medium.jpg"
    },
    {
      name: "Moon Flyby",
      description: "Passing by Earth's loyal companion",
      color: "#94a3b8",
      image: "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001135/GSFC_20171208_Archive_e001135~orig.jpg"
    },
    {
      name: "Mars Approach",
      description: "The Red Planet comes into view",
      color: "#ef4444",
      image: "https://images-assets.nasa.gov/image/PIA04591/PIA04591~orig.jpg"
    },
    {
      name: "Asteroid Belt",
      description: "Navigate through ancient space rocks",
      color: "#78716c",
      image: "https://images-assets.nasa.gov/image/PIA19185/PIA19185~orig.jpg"
    },
    {
      name: "Jupiter's Majesty",
      description: "Witness the gas giant's Great Red Spot",
      color: "#f97316",
      image: "https://images-assets.nasa.gov/image/PIA02873/PIA02873~orig.jpg"
    },
    {
      name: "Saturn's Rings",
      description: "Marvel at the most beautiful rings in the solar system",
      color: "#fbbf24",
      image: "https://images-assets.nasa.gov/image/PIA06193/PIA06193~orig.jpg"
    },
    {
      name: "Ice Giants",
      description: "Uranus and Neptune in the outer reaches",
      color: "#06b6d4",
      image: "https://images-assets.nasa.gov/image/PIA18182/PIA18182~orig.jpg"
    },
    {
      name: "Kuiper Belt",
      description: "Enter the frozen frontier of our solar system",
      color: "#8b5cf6",
      image: "https://images-assets.nasa.gov/image/PIA19952/PIA19952~orig.jpg"
    },
    {
      name: "Interstellar Space",
      description: "Beyond our solar system - infinite possibilities",
      color: "#6366f1",
      image: "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001435/GSFC_20171208_Archive_e001435~orig.jpg"
    },
    {
      name: "Distant Galaxy",
      description: "Millions of light years from home",
      color: "#a855f7",
      image: "https://images-assets.nasa.gov/image/STScI-PRC2022-055a/STScI-PRC2022-055a~orig.jpg"
    }
  ]

  // Starfield animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const stars: Array<{ x: number; y: number; z: number; size: number }> = []
    const numStars = 800

    // Initialize stars
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width - canvas.width / 2,
        y: Math.random() * canvas.height - canvas.height / 2,
        z: Math.random() * canvas.width,
        size: Math.random() * 2
      })
    }

    const animate = () => {
      if (!isPlaying) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      ctx.fillStyle = 'rgba(10, 14, 39, 0.2)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = '#ffffff'
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      stars.forEach(star => {
        star.z -= speed * 3

        if (star.z <= 0) {
          star.z = canvas.width
          star.x = Math.random() * canvas.width - canvas.width / 2
          star.y = Math.random() * canvas.height - canvas.height / 2
        }

        const x = (star.x / star.z) * canvas.width + centerX
        const y = (star.y / star.z) * canvas.height + centerY
        const size = (1 - star.z / canvas.width) * star.size * 3

        if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
          ctx.beginPath()
          ctx.arc(x, y, size, 0, Math.PI * 2)
          ctx.fill()

          // Add star trails for speed effect
          if (speed > 2) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 * (1 - star.z / canvas.width)})`
            ctx.lineWidth = size
            ctx.beginPath()
            ctx.moveTo(x, y)
            const trailX = (star.x / (star.z + speed * 10)) * canvas.width + centerX
            const trailY = (star.y / (star.z + speed * 10)) * canvas.height + centerY
            ctx.lineTo(trailX, trailY)
            ctx.stroke()
          }
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [speed, isPlaying])

  const startJourney = () => {
    setIsPlaying(true)
    setJourneyStage(0)
  }

  const nextStage = () => {
    if (journeyStage < stages.length - 1) {
      setJourneyStage(journeyStage + 1)
    }
  }

  const prevStage = () => {
    if (journeyStage > 0) {
      setJourneyStage(journeyStage - 1)
    }
  }

  const currentStage = stages[journeyStage]

  return (
    <div className="relative min-h-screen overflow-hidden bg-space-deep">
      {/* Animated Starfield Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ background: '#0a0e27' }}
      />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-space-deep/80 z-10" />

      {/* Content */}
      <div className="relative z-20 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <span>←</span> Back to Home
          </Link>
        </header>

        {/* Main Journey Experience */}
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-6xl w-full">
            {!isPlaying ? (
              /* Welcome Screen */
              <div className="text-center space-y-8 animate-fade-in">
                <div className="space-y-4">
                  <h1 className="text-7xl md:text-9xl font-bold text-gradient animate-pulse-slow">
                    🚀
                  </h1>
                  <h2 className="text-5xl md:text-7xl font-bold text-white mb-4">
                    Space Journey
                  </h2>
                  <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
                    Embark on an incredible voyage through our solar system and beyond.
                    Experience the wonders of space like never before.
                  </p>
                </div>

                <button
                  onClick={startJourney}
                  className="group relative px-12 py-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl text-white font-bold text-2xl hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-2xl"
                >
                  <span className="relative z-10">Launch Journey</span>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-50 blur-xl transition-opacity" />
                </button>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto pt-8">
                  {stages.slice(0, 10).map((stage, index) => (
                    <div key={index} className="glass p-3 rounded-lg text-center">
                      <div className="text-2xl mb-1">
                        {index === 0 ? '🌍' : index === 1 ? '🌙' : index === 2 ? '🔴' : 
                         index === 3 ? '☄️' : index === 4 ? '🪐' : index === 5 ? '💍' :
                         index === 6 ? '❄️' : index === 7 ? '🌌' : index === 8 ? '✨' : '🌟'}
                      </div>
                      <div className="text-xs text-gray-400">{stage.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Journey Stage Display */
              <div className="space-y-8">
                {/* Stage Image */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-1000 animate-fade-in">
                  <div className="absolute inset-0 bg-gradient-to-t from-space-deep via-transparent to-transparent z-10" />
                  <img
                    src={currentStage.image}
                    alt={currentStage.name}
                    className="w-full h-[400px] object-cover"
                  />
                  <div className="absolute inset-0 z-20 flex items-end p-8">
                    <div className="space-y-2">
                      <div className="inline-block px-4 py-1 rounded-full text-sm font-semibold glass">
                        Stage {journeyStage + 1} of {stages.length}
                      </div>
                      <h3 className="text-4xl md:text-6xl font-bold text-white">
                        {currentStage.name}
                      </h3>
                      <p className="text-xl text-gray-300">
                        {currentStage.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Journey Progress</span>
                    <span>{Math.round((journeyStage / (stages.length - 1)) * 100)}%</span>
                  </div>
                  <div className="h-3 bg-black/40 rounded-full overflow-hidden backdrop-blur">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500 rounded-full"
                      style={{ width: `${((journeyStage + 1) / stages.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  {/* Speed Control */}
                  <div className="glass rounded-2xl p-4 space-y-2 w-full md:w-auto">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-gray-400">Warp Speed</span>
                      <span className="text-lg font-bold text-white">{speed}x</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={speed}
                      onChange={(e) => setSpeed(Number(e.target.value))}
                      className="w-full accent-purple-500"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Slow</span>
                      <span>Ludicrous!</span>
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={prevStage}
                      disabled={journeyStage === 0}
                      className="px-6 py-3 rounded-xl glass font-semibold text-white hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={nextStage}
                      disabled={journeyStage === stages.length - 1}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 font-semibold text-white hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                      Next →
                    </button>
                  </div>
                </div>

                {/* Journey Map */}
                <div className="glass rounded-2xl p-6 space-y-4">
                  <h4 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>🗺️</span> Journey Map
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {stages.map((stage, index) => (
                      <button
                        key={index}
                        onClick={() => setJourneyStage(index)}
                        className={`p-3 rounded-lg text-center transition-all ${
                          index === journeyStage
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white scale-105 shadow-lg'
                            : index < journeyStage
                            ? 'bg-green-900/30 text-green-400 border border-green-500/30'
                            : 'bg-white/5 text-gray-500 hover:bg-white/10'
                        }`}
                      >
                        <div className="text-xl mb-1">
                          {index === 0 ? '🌍' : index === 1 ? '🌙' : index === 2 ? '🔴' : 
                           index === 3 ? '☄️' : index === 4 ? '🪐' : index === 5 ? '💍' :
                           index === 6 ? '❄️' : index === 7 ? '🌌' : index === 8 ? '✨' : '🌟'}
                        </div>
                        <div className="text-xs line-clamp-2">{stage.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* End Journey */}
                {journeyStage === stages.length - 1 && (
                  <div className="text-center space-y-4 p-8 glass rounded-2xl animate-fade-in">
                    <div className="text-6xl mb-4">🎉</div>
                    <h3 className="text-3xl font-bold text-white">Journey Complete!</h3>
                    <p className="text-gray-300">
                      You've traveled millions of light years through space. Ready to explore more?
                    </p>
                    <div className="flex gap-4 justify-center pt-4">
                      <button
                        onClick={() => {
                          setJourneyStage(0)
                        }}
                        className="px-6 py-3 rounded-xl glass font-semibold text-white hover:bg-white/10 transition-all"
                      >
                        Restart Journey
                      </button>
                      <Link
                        href="/solar-system"
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 font-semibold text-white hover:from-purple-700 hover:to-blue-700 transition-all"
                      >
                        Explore Solar System
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

        {/* Footer Info */}
        {isPlaying && (
          <footer className="p-6 text-center">
            <p className="text-sm text-gray-500">
              Tip: Use the speed slider to control your journey speed • Click on any stage in the map to jump there
            </p>
          </footer>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  )
}
