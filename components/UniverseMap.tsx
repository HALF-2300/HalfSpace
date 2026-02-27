'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Region {
  name: string
  href: string
  icon: string
  position: { x: number; y: number }
  size: number
  color: string
  description: string
}

export default function UniverseMap() {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null)
  const [zoom, setZoom] = useState(1)

  const regions: Region[] = [
    {
      name: 'Solar System',
      href: '/solar-system',
      icon: '🪐',
      position: { x: 20, y: 50 },
      size: 120,
      color: 'from-yellow-500 to-orange-500',
      description: 'Our cosmic neighborhood'
    },
    {
      name: 'Stars',
      href: '/stars',
      icon: '⭐',
      position: { x: 50, y: 30 },
      size: 100,
      color: 'from-blue-500 to-cyan-500',
      description: 'The building blocks of galaxies'
    },
    {
      name: 'Galaxies',
      href: '/galaxies',
      icon: '🌌',
      position: { x: 70, y: 20 },
      size: 140,
      color: 'from-purple-500 to-pink-500',
      description: 'Island universes'
    },
    {
      name: 'Black Holes',
      href: '/black-holes',
      icon: '🕳️',
      position: { x: 80, y: 60 },
      size: 90,
      color: 'from-gray-800 to-black',
      description: 'The ultimate mystery'
    },
    {
      name: 'Nebulae',
      href: '/nebulae',
      icon: '🌫️',
      position: { x: 40, y: 70 },
      size: 110,
      color: 'from-pink-500 to-rose-500',
      description: 'Cosmic clouds of creation'
    },
    {
      name: 'Missions',
      href: '/missions',
      icon: '🚀',
      position: { x: 15, y: 80 },
      size: 100,
      color: 'from-blue-500 to-teal-500',
      description: 'Humanity\'s journey to the stars'
    },
    {
      name: 'Exoplanets',
      href: '/exoplanets',
      icon: '🪐',
      position: { x: 60, y: 75 },
      size: 95,
      color: 'from-indigo-500 to-purple-500',
      description: 'Worlds beyond our solar system'
    },
    {
      name: 'Cosmology',
      href: '/cosmology',
      icon: '🔭',
      position: { x: 85, y: 40 },
      size: 105,
      color: 'from-violet-500 to-purple-500',
      description: 'The universe as a whole'
    },
  ]

  return (
    <div className="min-h-screen pt-20 px-4 py-12 relative overflow-hidden">
      {/* Animated Starfield Background */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        {[...Array(300)].map((_, i) => (
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

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-8">
            <span className="text-7xl animate-float">🌌</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-gradient portal-title">
            Universe Map
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Navigate the cosmos. Click any region to explore.
          </p>
        </div>

        {/* Interactive Map */}
        <div className="relative w-full h-[70vh] min-h-[600px] glass rounded-3xl border-2 border-purple-500/30 overflow-hidden">
          <div 
            className="relative w-full h-full"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
          >
            {/* Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {regions.map((region, i) => {
                if (i === 0) return null
                const prev = regions[i - 1]
                return (
                  <line
                    key={i}
                    x1={`${prev.position.x}%`}
                    y1={`${prev.position.y}%`}
                    x2={`${region.position.x}%`}
                    y2={`${region.position.y}%`}
                    stroke="rgba(139, 92, 246, 0.3)"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    className="animate-pulse-slow"
                  />
                )
              })}
            </svg>

            {/* Regions */}
            {regions.map((region, index) => (
              <Link
                key={index}
                href={region.href}
                className="absolute group cursor-pointer"
                style={{
                  left: `${region.position.x}%`,
                  top: `${region.position.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                onMouseEnter={() => setSelectedRegion(region)}
                onMouseLeave={() => setSelectedRegion(null)}
              >
                <div
                  className={`relative rounded-full bg-gradient-to-br ${region.color} p-6 border-4 border-white/20 group-hover:border-white/50 transition-all transform group-hover:scale-125 glow-purple`}
                  style={{
                    width: `${region.size}px`,
                    height: `${region.size}px`,
                  }}
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
                  <div className="relative z-10 flex items-center justify-center h-full">
                    <span className="text-5xl group-hover:scale-125 transition-transform">
                      {region.icon}
                    </span>
                  </div>
                  
                  {/* Pulse Ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping opacity-0 group-hover:opacity-100" />
                </div>

                {/* Label */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 whitespace-nowrap">
                  <div className="px-4 py-2 glass rounded-lg border border-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-white font-bold text-sm">{region.name}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Selected Region Info */}
        {selectedRegion && (
          <div className="mt-12 glass rounded-2xl p-8 border-2 border-purple-500/30 max-w-2xl mx-auto animate-fade-in">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-5xl">{selectedRegion.icon}</span>
              <div>
                <h3 className="text-3xl font-bold text-gradient">{selectedRegion.name}</h3>
                <p className="text-gray-400">{selectedRegion.description}</p>
              </div>
            </div>
            <Link
              href={selectedRegion.href}
              className="inline-block mt-6 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-bold hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all"
            >
              Enter {selectedRegion.name} →
            </Link>
          </div>
        )}

        {/* Quick Navigation Grid */}
        <div className="mt-16">
          <h2 className="text-4xl font-bold text-center mb-8 text-gradient">Quick Navigation</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {regions.map((region, index) => (
              <Link
                key={index}
                href={region.href}
                className="group p-6 glass rounded-xl border border-purple-500/20 hover:border-purple-500/50 text-center transition-all transform hover:scale-105"
              >
                <div className="text-4xl mb-2 group-hover:scale-125 transition-transform">
                  {region.icon}
                </div>
                <div className="text-sm font-semibold text-white">{region.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

