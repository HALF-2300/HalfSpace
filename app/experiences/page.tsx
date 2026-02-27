'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'

// Dynamically import experiences to avoid SSR issues
const SpaceFlightExperience = dynamic(() => import('@/components/SpaceFlightExperience'), { ssr: false })
const BlackHoleSimulator = dynamic(() => import('@/components/experiences/BlackHoleSimulator'), { ssr: false })
const SolarSystemExplorer = dynamic(() => import('@/components/experiences/SolarSystemExplorer'), { ssr: false })
const RocketLaunchSimulator = dynamic(() => import('@/components/experiences/RocketLaunchSimulator'), { ssr: false })
const NebulaGenerator = dynamic(() => import('@/components/experiences/NebulaGenerator'), { ssr: false })
const MarsExplorer = dynamic(() => import('@/components/experiences/MarsExplorer'), { ssr: false })
const CosmicDreamMode = dynamic(() => import('@/components/experiences/CosmicDreamMode'), { ssr: false })
const CosmicMemoryLane = dynamic(() => import('@/components/experiences/CosmicMemoryLane'), { ssr: false })
const SpaceMusicVisualizer = dynamic(() => import('@/components/experiences/SpaceMusicVisualizer'), { ssr: false })
const SpaceQuizGame = dynamic(() => import('@/components/experiences/SpaceQuizGame'), { ssr: false })
const ConstellationPuzzle = dynamic(() => import('@/components/experiences/ConstellationPuzzle'), { ssr: false })
const PlanetMatchingGame = dynamic(() => import('@/components/experiences/PlanetMatchingGame'), { ssr: false })

const experiences = [
  {
    id: 'cosmic-dream',
    title: 'Cosmic Dream Mode',
    description: 'A surreal journey through YOUR unique cosmic signature - shapes morph based on your identity',
    icon: '✨',
    category: 'Personal',
    difficulty: 'Easy',
    component: CosmicDreamMode,
    isNew: true,
    isUnique: true
  },
  {
    id: 'memory-lane',
    title: 'Cosmic Memory Lane',
    description: 'Relive your personal journey through space - every visit, bookmark, and mission',
    icon: '🧭',
    category: 'Personal',
    difficulty: 'Easy',
    component: CosmicMemoryLane,
    isNew: true,
    isUnique: true
  },
  {
    id: 'quiz-game',
    title: 'Space Knowledge Quiz',
    description: 'Test your space knowledge! Earn XP with streak bonuses',
    icon: '🧠',
    category: 'Game',
    difficulty: 'Medium',
    component: SpaceQuizGame,
    isNew: true,
    isHot: true
  },
  {
    id: 'constellation-puzzle',
    title: 'Constellation Puzzle',
    description: 'Connect the stars to form real constellations!',
    icon: '⭐',
    category: 'Game',
    difficulty: 'Medium',
    component: ConstellationPuzzle,
    isNew: true,
    isHot: true
  },
  {
    id: 'planet-match',
    title: 'Planet Matching',
    description: 'Memory game with planets - match pairs fast for bonus XP!',
    icon: '🎮',
    category: 'Game',
    difficulty: 'Easy',
    component: PlanetMatchingGame,
    isNew: true,
    isHot: true
  },
  {
    id: 'music-viz',
    title: 'Space Music Creator',
    description: 'Turn cosmic scales into procedural music with live 3D visualization',
    icon: '🎵',
    category: 'Creative',
    difficulty: 'Medium',
    component: SpaceMusicVisualizer,
    isNew: true
  },
  {
    id: 'space-flight',
    title: 'Space Flight',
    description: 'Fly through the cosmos in your own spaceship',
    icon: '🚀',
    category: 'Immersive',
    difficulty: 'Easy',
    component: SpaceFlightExperience
  },
  {
    id: 'black-hole',
    title: 'Black Hole Simulator',
    description: 'Experience gravitational lensing and time dilation',
    icon: '🕳️',
    category: 'Simulation',
    difficulty: 'Medium',
    component: BlackHoleSimulator
  },
  {
    id: 'solar-system',
    title: 'Solar System Explorer',
    description: 'Fly between planets and learn about our cosmic neighborhood',
    icon: '🪐',
    category: 'Exploration',
    difficulty: 'Easy',
    component: SolarSystemExplorer
  },
  {
    id: 'rocket-launch',
    title: 'Rocket Launch',
    description: 'Control thrust and angle to reach orbit',
    icon: '🚀',
    category: 'Simulation',
    difficulty: 'Hard',
    component: RocketLaunchSimulator
  },
  {
    id: 'nebula',
    title: 'Nebula Generator',
    description: 'Create your own cosmic clouds with procedural generation',
    icon: '🌌',
    category: 'Creative',
    difficulty: 'Easy',
    component: NebulaGenerator
  },
  {
    id: 'mars',
    title: 'Mars Explorer',
    description: 'Drive a rover on the Red Planet surface',
    icon: '🔴',
    category: 'Exploration',
    difficulty: 'Medium',
    component: MarsExplorer
  }
]

export default function ExperiencesPage() {
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')
  
  const selected = experiences.find(e => e.id === selectedExperience)
  
  const filteredExperiences = filter === 'all' 
    ? experiences 
    : experiences.filter(e => e.category === filter)
  
  const categories = ['all', ...Array.from(new Set(experiences.map(e => e.category)))]
  
  if (selected) {
    const Component = selected.component
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-purple-900/10 to-black p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4">
            <button
              onClick={() => setSelectedExperience(null)}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg text-white font-bold transition-all"
            >
              ← Back to Experiences
            </button>
          </div>
          
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gradient mb-2">{selected.icon} {selected.title}</h1>
            <p className="text-gray-300 text-lg">{selected.description}</p>
          </div>
          
          <Component />
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-900/10 to-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-block px-4 py-2 mb-6 text-purple-400 hover:text-purple-300 transition-colors">
            ← Home
          </Link>
          <h1 className="text-6xl font-bold text-gradient mb-4">
            Space Experiences
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Immersive interactive experiences that bring the wonders of space to life. 
            Explore, simulate, and create your own cosmic adventures.
          </p>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="glass rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-purple-400 mb-2">{experiences.length}</div>
            <div className="text-sm text-gray-400">Experiences</div>
          </div>
          <div className="glass rounded-xl p-6 text-center border border-pink-500/30">
            <div className="text-4xl font-bold text-pink-400 mb-2">2</div>
            <div className="text-sm text-gray-400">Personalized</div>
          </div>
          <div className="glass rounded-xl p-6 text-center border border-green-500/30">
            <div className="text-4xl font-bold text-green-400 mb-2">3</div>
            <div className="text-sm text-gray-400">Games</div>
          </div>
          <div className="glass rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-orange-400 mb-2">100%</div>
            <div className="text-sm text-gray-400">Free</div>
          </div>
        </div>
        
        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filter === cat
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>
        
        {/* Experience Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperiences.map(exp => (
            <button
              key={exp.id}
              onClick={() => setSelectedExperience(exp.id)}
              className={`glass rounded-2xl p-6 hover:border-purple-400/50 transition-all duration-300 group text-left relative ${
                exp.isUnique ? 'border-pink-500/50 animate-pulse-slow' : ''
              }`}
            >
              {exp.isNew && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full text-white text-xs font-bold">
                  NEW!
                </div>
              )}
              {exp.isUnique && (
                <div className="absolute top-2 left-2 px-2 py-1 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full text-white text-xs font-bold animate-pulse">
                  UNIQUE
                </div>
              )}
              {exp.isHot && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-full text-white text-xs font-bold animate-pulse">
                  HOT!
                </div>
              )}
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                {exp.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                {exp.title}
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                {exp.description}
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-xs ${
                  exp.category === 'Personal' ? 'bg-pink-600/30 text-pink-300' : 'bg-purple-600/30 text-purple-300'
                }`}>
                  {exp.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs ${
                  exp.difficulty === 'Easy' ? 'bg-green-600/30 text-green-300' :
                  exp.difficulty === 'Medium' ? 'bg-yellow-600/30 text-yellow-300' :
                  'bg-red-600/30 text-red-300'
                }`}>
                  {exp.difficulty}
                </span>
              </div>
            </button>
          ))}
        </div>
        
        {/* Coming Soon */}
        <div className="mt-16 text-center glass rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-gradient mb-4">More Coming Soon!</h2>
          <p className="text-gray-300 mb-6">
            We're building even more incredible space experiences:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="glass rounded-lg p-4">
              <div className="text-3xl mb-2">🛸</div>
              <div className="text-sm text-gray-400">ISS Tour</div>
            </div>
            <div className="glass rounded-lg p-4">
              <div className="text-3xl mb-2">🌠</div>
              <div className="text-sm text-gray-400">Meteor Shower</div>
            </div>
            <div className="glass rounded-lg p-4">
              <div className="text-3xl mb-2">🔭</div>
              <div className="text-sm text-gray-400">Telescope Sim</div>
            </div>
            <div className="glass rounded-lg p-4">
              <div className="text-3xl mb-2">⏰</div>
              <div className="text-sm text-gray-400">Time Machine</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
