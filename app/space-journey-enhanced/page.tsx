'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, Float } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import EnhancedStarfield from '@/components/space-journey/EnhancedStarfield'
import Planet3D from '@/components/space-journey/Planet3D'
import ShootingStars from '@/components/space-journey/ShootingStars'
import FactCard from '@/components/space-journey/FactCard'
import AchievementPopup from '@/components/space-journey/AchievementPopup'
import JourneyStats from '@/components/space-journey/JourneyStats'
import WormholeTransition from '@/components/space-journey/WormholeTransition'
import AudioController from '@/components/space-journey/AudioController'

type Achievement = {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
}

type JourneyStage = {
  name: string
  description: string
  color: string
  image: string
  facts: string[]
  distance: number // in AU (Astronomical Units)
  planetType?: 'terrestrial' | 'gas-giant' | 'ice-giant' | 'dwarf'
  rotationSpeed?: number
  hasRings?: boolean
  phenomena?: string[] // Special visual effects
}

export default function SpaceJourneyEnhancedPage() {
  const [journeyStage, setJourneyStage] = useState(0)
  const [speed, setSpeed] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showFacts, setShowFacts] = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)
  const [totalDistance, setTotalDistance] = useState(0)
  const [discoveries, setDiscoveries] = useState(0)
  const [journeyTime, setJourneyTime] = useState(0)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [showPlanet3D, setShowPlanet3D] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const timerRef = useRef<NodeJS.Timeout>()

  const stages: JourneyStage[] = [
    {
      name: "Launch from Earth",
      description: "Your journey begins on our beautiful blue planet, home to billions of life forms",
      color: "#3b82f6",
      image: "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000263/GSFC_20171208_Archive_e000263~medium.jpg",
      facts: [
        "Earth is the only planet known to harbor life",
        "71% of Earth's surface is covered by water",
        "Earth travels around the Sun at 107,000 km/h"
      ],
      distance: 0,
      planetType: 'terrestrial',
      rotationSpeed: 0.002
    },
    {
      name: "Moon Flyby",
      description: "Passing by Earth's loyal companion, the Moon - our cosmic dance partner",
      color: "#94a3b8",
      image: "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001135/GSFC_20171208_Archive_e001135~orig.jpg",
      facts: [
        "The Moon is moving away from Earth at 3.8 cm per year",
        "A day on the Moon lasts 29.5 Earth days",
        "The Moon's gravity creates ocean tides on Earth"
      ],
      distance: 0.0026, // 384,400 km
      planetType: 'terrestrial',
      rotationSpeed: 0.001
    },
    {
      name: "Mars Approach",
      description: "The Red Planet comes into view - humanity's next frontier",
      color: "#ef4444",
      image: "https://images-assets.nasa.gov/image/PIA04591/PIA04591~orig.jpg",
      facts: [
        "Mars has the largest volcano in our solar system - Olympus Mons",
        "A Martian day is only 40 minutes longer than Earth's",
        "Mars' red color comes from iron oxide (rust) in its soil"
      ],
      distance: 1.52,
      planetType: 'terrestrial',
      rotationSpeed: 0.0018,
      phenomena: ['dust-storm']
    },
    {
      name: "Asteroid Belt",
      description: "Navigate through ancient space rocks - remnants of planet formation",
      color: "#78716c",
      image: "https://images-assets.nasa.gov/image/PIA19185/PIA19185~orig.jpg",
      facts: [
        "The asteroid belt contains millions of rocky objects",
        "Despite its name, asteroids are actually very far apart",
        "The total mass of all asteroids is less than our Moon"
      ],
      distance: 2.8,
      phenomena: ['asteroid-field', 'meteor-shower']
    },
    {
      name: "Jupiter's Majesty",
      description: "Witness the gas giant's Great Red Spot - a storm larger than Earth",
      color: "#f97316",
      image: "https://images-assets.nasa.gov/image/PIA02873/PIA02873~orig.jpg",
      facts: [
        "Jupiter is so massive it could fit all other planets inside it",
        "The Great Red Spot is a storm that's been raging for 400+ years",
        "Jupiter has 95 known moons, including the largest moon Ganymede"
      ],
      distance: 5.2,
      planetType: 'gas-giant',
      rotationSpeed: 0.004,
      phenomena: ['auroras', 'lightning-storms']
    },
    {
      name: "Saturn's Rings",
      description: "Marvel at the most beautiful rings in the solar system",
      color: "#fbbf24",
      image: "https://images-assets.nasa.gov/image/PIA06193/PIA06193~orig.jpg",
      facts: [
        "Saturn's rings are made of billions of ice and rock particles",
        "The rings span 282,000 km but are only 10 meters thick",
        "Saturn could float in water - it's less dense than H₂O"
      ],
      distance: 9.5,
      planetType: 'gas-giant',
      rotationSpeed: 0.0036,
      hasRings: true,
      phenomena: ['ring-sparkle']
    },
    {
      name: "Ice Giants",
      description: "Uranus and Neptune in the outer reaches - mysterious blue worlds",
      color: "#06b6d4",
      image: "https://images-assets.nasa.gov/image/PIA18182/PIA18182~orig.jpg",
      facts: [
        "Uranus rotates on its side at a 98° tilt",
        "Neptune has the fastest winds in the solar system at 2,100 km/h",
        "Both planets get their blue color from methane in their atmospheres"
      ],
      distance: 20,
      planetType: 'ice-giant',
      rotationSpeed: 0.003,
      phenomena: ['diamond-rain']
    },
    {
      name: "Kuiper Belt",
      description: "Enter the frozen frontier - home to Pluto and countless icy worlds",
      color: "#8b5cf6",
      image: "https://images-assets.nasa.gov/image/PIA19952/PIA19952~orig.jpg",
      facts: [
        "The Kuiper Belt extends from 30 to 50 AU from the Sun",
        "It's 20 times wider than the asteroid belt",
        "Pluto is the most famous Kuiper Belt object"
      ],
      distance: 40,
      phenomena: ['ice-crystals', 'comet-tails']
    },
    {
      name: "Interstellar Space",
      description: "Beyond our solar system - where the Sun's influence fades",
      color: "#6366f1",
      image: "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001435/GSFC_20171208_Archive_e001435~orig.jpg",
      facts: [
        "Only 5 spacecraft have reached interstellar space",
        "Voyager 1 is currently 159 AU from Earth",
        "Interstellar space is not empty - it contains gas and cosmic rays"
      ],
      distance: 100,
      phenomena: ['cosmic-rays', 'bow-shock']
    },
    {
      name: "Distant Galaxy",
      description: "Millions of light years from home - a glimpse of cosmic vastness",
      color: "#a855f7",
      image: "https://images-assets.nasa.gov/image/STScI-PRC2022-055a/STScI-PRC2022-055a~orig.jpg",
      facts: [
        "There are an estimated 2 trillion galaxies in the observable universe",
        "Light from distant galaxies can take billions of years to reach us",
        "We see distant galaxies as they were in the ancient past"
      ],
      distance: 653000000, // 100 million AU (roughly)
      phenomena: ['star-formation', 'spiral-arms', 'supernova']
    }
  ]

  // Initialize achievements
  useEffect(() => {
    setAchievements([
      { id: 'first-launch', title: '🚀 First Launch', description: 'Begin your cosmic journey', icon: '🚀', unlocked: false },
      { id: 'moon-landing', title: '🌙 Lunar Explorer', description: 'Visit the Moon', icon: '🌙', unlocked: false },
      { id: 'red-planet', title: '🔴 Mars Pioneer', description: 'Reach the Red Planet', icon: '🔴', unlocked: false },
      { id: 'asteroid-hunter', title: '☄️ Asteroid Hunter', description: 'Navigate the asteroid belt', icon: '☄️', unlocked: false },
      { id: 'gas-giant', title: '🪐 Gas Giant Explorer', description: 'Witness Jupiter\'s majesty', icon: '🪐', unlocked: false },
      { id: 'ring-master', title: '💍 Ring Master', description: 'Marvel at Saturn\'s rings', icon: '💍', unlocked: false },
      { id: 'deep-space', title: '🌌 Deep Space Voyager', description: 'Enter the Kuiper Belt', icon: '🌌', unlocked: false },
      { id: 'interstellar', title: '✨ Interstellar Traveler', description: 'Leave the solar system', icon: '✨', unlocked: false },
      { id: 'cosmic-explorer', title: '🌟 Cosmic Explorer', description: 'Reach a distant galaxy', icon: '🌟', unlocked: false },
      { id: 'speed-demon', title: '⚡ Speed Demon', description: 'Reach maximum speed', icon: '⚡', unlocked: false },
      { id: 'fact-hunter', title: '📚 Fact Hunter', description: 'Read 10 facts', icon: '📚', unlocked: false },
      { id: 'completionist', title: '🏆 Completionist', description: 'Complete the entire journey', icon: '🏆', unlocked: false },
    ])
  }, [])

  // Journey timer
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setJourneyTime(prev => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPlaying])

  // Unlock achievements based on progress
  useEffect(() => {
    const achievementMap: { [key: number]: string } = {
      0: 'first-launch',
      1: 'moon-landing',
      2: 'red-planet',
      3: 'asteroid-hunter',
      4: 'gas-giant',
      5: 'ring-master',
      7: 'deep-space',
      8: 'interstellar',
      9: 'cosmic-explorer',
    }

    const achievementId = achievementMap[journeyStage]
    if (achievementId) {
      unlockAchievement(achievementId)
    }

    if (speed >= 10) {
      unlockAchievement('speed-demon')
    }

    if (journeyStage === stages.length - 1) {
      unlockAchievement('completionist')
    }
  }, [journeyStage, speed])

  const unlockAchievement = (id: string) => {
    setAchievements(prev => {
      const updated = prev.map(achievement => {
        if (achievement.id === id && !achievement.unlocked) {
          setNewAchievement(achievement)
          setTimeout(() => setNewAchievement(null), 4000)
          return { ...achievement, unlocked: true }
        }
        return achievement
      })
      return updated
    })
  }

  // Starfield animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const stars: Array<{ x: number; y: number; z: number; size: number }> = []
    const numStars = 1200

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

      ctx.fillStyle = 'rgba(10, 14, 39, 0.15)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = '#ffffff'
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      stars.forEach(star => {
        star.z -= speed * 4

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
    setJourneyTime(0)
    setTotalDistance(0)
    setDiscoveries(0)
  }

  const nextStage = () => {
    if (journeyStage < stages.length - 1) {
      setTransitioning(true)
      setTimeout(() => {
        setJourneyStage(journeyStage + 1)
        setTotalDistance(prev => prev + stages[journeyStage + 1].distance)
        setDiscoveries(prev => prev + 1)
        setTransitioning(false)
        setShowPlanet3D(true)
      }, 1500)
    }
  }

  const prevStage = () => {
    if (journeyStage > 0) {
      setTransitioning(true)
      setTimeout(() => {
        setJourneyStage(journeyStage - 1)
        setTransitioning(false)
        setShowPlanet3D(true)
      }, 1500)
    }
  }

  const jumpToStage = (index: number) => {
    if (index !== journeyStage) {
      setTransitioning(true)
      setTimeout(() => {
        setJourneyStage(index)
        setTotalDistance(stages.slice(0, index + 1).reduce((sum, stage) => sum + stage.distance, 0))
        setTransitioning(false)
        setShowPlanet3D(true)
      }, 1500)
    }
  }

  const currentStage = stages[journeyStage]

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-space-deep">
      {/* Animated Starfield Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ background: '#0a0e27' }}
      />

      {/* Shooting Stars Effect */}
      {isPlaying && <ShootingStars speed={speed} />}

      {/* Wormhole Transition */}
      <AnimatePresence>
        {transitioning && <WormholeTransition />}
      </AnimatePresence>

      {/* Achievement Popup */}
      <AnimatePresence>
        {newAchievement && (
          <AchievementPopup achievement={newAchievement} />
        )}
      </AnimatePresence>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-space-deep/80 z-10" />

      {/* Content */}
      <div className="relative z-20 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6 flex justify-between items-center">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <span>←</span> Back to Home
          </Link>
          
          {isPlaying && (
            <div className="flex items-center gap-4">
              <AudioController enabled={audioEnabled} onToggle={() => setAudioEnabled(!audioEnabled)} />
              <JourneyStats
                distance={totalDistance.toFixed(2)}
                time={formatTime(journeyTime)}
                discoveries={discoveries}
              />
            </div>
          )}
        </header>

        {/* Main Journey Experience */}
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-6xl w-full">
            {!isPlaying ? (
              /* Welcome Screen */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-8"
              >
                <motion.div 
                  className="space-y-4"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.h1 
                    className="text-7xl md:text-9xl font-bold text-gradient"
                    animate={{ 
                      scale: [1, 1.05, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      ease: "easeInOut" 
                    }}
                  >
                    🚀
                  </motion.h1>
                  <h2 className="text-5xl md:text-7xl font-bold text-white mb-4">
                    Enhanced Space Journey
                  </h2>
                  <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
                    Embark on an incredible voyage through our solar system and beyond.
                    Experience space like never before with 3D planets, interactive facts, and achievements!
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <button
                    onClick={startJourney}
                    className="group relative px-12 py-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl text-white font-bold text-2xl hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-2xl"
                  >
                    <span className="relative z-10">🚀 Launch Enhanced Journey</span>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-50 blur-xl transition-opacity" />
                  </button>
                </motion.div>

                {/* Features Preview */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8"
                >
                  {[
                    { icon: '🌍', text: '3D Planets' },
                    { icon: '📚', text: 'Space Facts' },
                    { icon: '🏆', text: 'Achievements' },
                    { icon: '🌌', text: 'Phenomena' },
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      className="glass p-4 rounded-lg text-center"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <div className="text-3xl mb-2">{feature.icon}</div>
                      <div className="text-sm text-gray-300">{feature.text}</div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Stage Preview */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto pt-4"
                >
                  {stages.slice(0, 10).map((stage, index) => (
                    <motion.div
                      key={index}
                      className="glass p-3 rounded-lg text-center"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: 'spring' }}
                    >
                      <div className="text-2xl mb-1">
                        {index === 0 ? '🌍' : index === 1 ? '🌙' : index === 2 ? '🔴' : 
                         index === 3 ? '☄️' : index === 4 ? '🪐' : index === 5 ? '💍' :
                         index === 6 ? '❄️' : index === 7 ? '🌌' : index === 8 ? '✨' : '🌟'}
                      </div>
                      <div className="text-xs text-gray-400">{stage.name}</div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ) : (
              /* Journey Stage Display */
              <AnimatePresence mode="wait">
                <motion.div
                  key={journeyStage}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  {/* Stage Image with 3D Planet Overlay */}
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-t from-space-deep via-transparent to-transparent z-10" />
                    <img
                      src={currentStage.image}
                      alt={currentStage.name}
                      className="w-full h-[400px] object-cover"
                    />
                    
                    {/* 3D Planet Overlay */}
                    {showPlanet3D && currentStage.planetType && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, type: 'spring' }}
                        className="absolute top-4 right-4 w-32 h-32 z-20"
                      >
                        <Canvas>
                          <Suspense fallback={null}>
                            <ambientLight intensity={0.5} />
                            <pointLight position={[10, 10, 10]} />
                            <Planet3D
                              type={currentStage.planetType}
                              color={currentStage.color}
                              rotationSpeed={currentStage.rotationSpeed || 0.002}
                              hasRings={currentStage.hasRings}
                            />
                            <OrbitControls enableZoom={false} />
                          </Suspense>
                        </Canvas>
                      </motion.div>
                    )}

                    <div className="absolute inset-0 z-20 flex items-end p-8">
                      <div className="space-y-2">
                        <motion.div
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          className="inline-block px-4 py-1 rounded-full text-sm font-semibold glass"
                        >
                          Stage {journeyStage + 1} of {stages.length} • {currentStage.distance} AU
                        </motion.div>
                        <motion.h3
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className="text-4xl md:text-6xl font-bold text-white"
                        >
                          {currentStage.name}
                        </motion.h3>
                        <motion.p
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="text-xl text-gray-300"
                        >
                          {currentStage.description}
                        </motion.p>
                      </div>
                    </div>

                    {/* Facts Button */}
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      onClick={() => setShowFacts(!showFacts)}
                      className="absolute top-4 left-4 z-20 px-4 py-2 glass rounded-lg font-semibold text-white hover:bg-white/20 transition-all"
                    >
                      {showFacts ? '📖 Hide Facts' : '📚 Show Facts'}
                    </motion.button>
                  </div>

                  {/* Facts Display */}
                  <AnimatePresence>
                    {showFacts && (
                      <FactCard facts={currentStage.facts} />
                    )}
                  </AnimatePresence>

                  {/* Space Phenomena Indicators */}
                  {currentStage.phenomena && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass rounded-xl p-4"
                    >
                      <h4 className="text-sm font-semibold text-purple-400 mb-2">🌟 Active Phenomena</h4>
                      <div className="flex flex-wrap gap-2">
                        {currentStage.phenomena.map((phenomenon, index) => (
                          <motion.span
                            key={index}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="px-3 py-1 bg-purple-600/30 rounded-full text-xs text-purple-200 border border-purple-500/30"
                          >
                            {phenomenon.replace('-', ' ')}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Journey Progress</span>
                      <span>{Math.round((journeyStage / (stages.length - 1)) * 100)}%</span>
                    </div>
                    <div className="h-3 bg-black/40 rounded-full overflow-hidden backdrop-blur">
                      <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${((journeyStage + 1) / stages.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Speed Control */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="glass rounded-2xl p-4 space-y-2 w-full md:w-auto"
                    >
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
                    </motion.div>

                    {/* Navigation Buttons */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex gap-4"
                    >
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
                    </motion.div>
                  </div>

                  {/* Journey Map */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-2xl p-6 space-y-4"
                  >
                    <h4 className="text-xl font-bold text-white flex items-center gap-2">
                      <span>🗺️</span> Journey Map
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {stages.map((stage, index) => (
                        <motion.button
                          key={index}
                          onClick={() => jumpToStage(index)}
                          className={`p-3 rounded-lg text-center transition-all ${
                            index === journeyStage
                              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white scale-105 shadow-lg'
                              : index < journeyStage
                              ? 'bg-green-900/30 text-green-400 border border-green-500/30'
                              : 'bg-white/5 text-gray-500 hover:bg-white/10'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="text-xl mb-1">
                            {index === 0 ? '🌍' : index === 1 ? '🌙' : index === 2 ? '🔴' : 
                             index === 3 ? '☄️' : index === 4 ? '🪐' : index === 5 ? '💍' :
                             index === 6 ? '❄️' : index === 7 ? '🌌' : index === 8 ? '✨' : '🌟'}
                          </div>
                          <div className="text-xs line-clamp-2">{stage.name}</div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>

                  {/* Achievements Progress */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-2xl p-6 space-y-4"
                  >
                    <h4 className="text-xl font-bold text-white flex items-center gap-2">
                      <span>🏆</span> Achievements ({achievements.filter(a => a.unlocked).length}/{achievements.length})
                    </h4>
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                      {achievements.map((achievement) => (
                        <motion.div
                          key={achievement.id}
                          className={`p-3 rounded-lg text-center transition-all ${
                            achievement.unlocked
                              ? 'bg-gradient-to-br from-yellow-600/30 to-orange-600/30 border border-yellow-500/50'
                              : 'bg-white/5 opacity-50'
                          }`}
                          whileHover={{ scale: achievement.unlocked ? 1.1 : 1 }}
                          title={`${achievement.title} - ${achievement.description}`}
                        >
                          <div className="text-2xl">{achievement.icon}</div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* End Journey */}
                  {journeyStage === stages.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center space-y-4 p-8 glass rounded-2xl"
                    >
                      <motion.div
                        className="text-6xl mb-4"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        🎉
                      </motion.div>
                      <h3 className="text-3xl font-bold text-white">Journey Complete!</h3>
                      <p className="text-gray-300">
                        You've traveled {totalDistance.toFixed(2)} AU through space in {formatTime(journeyTime)}!
                      </p>
                      <p className="text-gray-300">
                        Achievements unlocked: {achievements.filter(a => a.unlocked).length}/{achievements.length}
                      </p>
                      <div className="flex gap-4 justify-center pt-4">
                        <button
                          onClick={() => {
                            setJourneyStage(0)
                            setTotalDistance(0)
                            setJourneyTime(0)
                            setDiscoveries(0)
                          }}
                          className="px-6 py-3 rounded-xl glass font-semibold text-white hover:bg-white/10 transition-all"
                        >
                          🔄 Restart Journey
                        </button>
                        <Link
                          href="/solar-system"
                          className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 font-semibold text-white hover:from-purple-700 hover:to-blue-700 transition-all"
                        >
                          🌍 Explore Solar System
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </main>

        {/* Footer Info */}
        {isPlaying && (
          <footer className="p-6 text-center">
            <p className="text-sm text-gray-500">
              Tip: Click "Show Facts" to learn more • Achieve maximum speed for special achievements • Click stages in the map to jump instantly
            </p>
          </footer>
        )}
      </div>
    </div>
  )
}
