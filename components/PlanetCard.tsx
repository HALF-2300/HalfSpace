'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Planet {
  id: string
  name: string
  nameAr: string
  href: string
  size: string
  gravity: string
  dayLength: string
  temperature: string
  moons: string
  image: string
  color: string
  description: string
}

interface PlanetCardProps {
  planet: Planet
  onCompare?: (planet: Planet) => void
  isComparing?: boolean
}

export default function PlanetCard({ planet, onCompare, isComparing }: PlanetCardProps) {
  return (
    <div className={`glass rounded-2xl p-6 border-2 transition-all transform hover:scale-105 enhanced-card-glow ${
      isComparing ? 'border-yellow-500/50 ring-2 ring-yellow-500/30' : 'border-purple-500/30 hover:border-purple-500/50'
    }`}>
      <div className="relative mb-4">
        <div className={`w-full h-48 rounded-xl bg-gradient-to-br ${planet.color} flex items-center justify-center overflow-hidden`}>
          <span className="text-8xl">{planet.name === 'Earth' ? '🌍' : planet.name === 'Mars' ? '🔴' : '🪐'}</span>
        </div>
        {isComparing && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold">
            For Comparison
          </div>
        )}
      </div>
      
      <h3 className="text-2xl font-bold text-gradient mb-2">{planet.name}</h3>
      <p className="text-gray-400 text-sm mb-4">{planet.description}</p>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Size:</span>
          <span className="text-white font-semibold">{planet.size}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Gravity:</span>
          <span className="text-white font-semibold">{planet.gravity}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Day Length:</span>
          <span className="text-white font-semibold">{planet.dayLength}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Temperature:</span>
          <span className="text-white font-semibold">{planet.temperature}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Moons:</span>
          <span className="text-white font-semibold">{planet.moons}</span>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Link
          href={planet.href}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white font-bold text-center hover:from-purple-700 hover:to-blue-700 transition-all"
        >
          Explore
        </Link>
        {onCompare && (
          <button
            onClick={() => onCompare(planet)}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              isComparing
                ? 'bg-yellow-500 text-black hover:bg-yellow-600'
                : 'bg-purple-500/20 text-purple-300 border border-purple-500/50 hover:bg-purple-500/30'
            }`}
          >
            {isComparing ? '✓' : 'Compare'}
          </button>
        )}
      </div>
    </div>
  )
}

interface PlanetComparisonProps {
  planet1: Planet
  planet2: Planet
  onClose: () => void
}

export function PlanetComparison({ planet1, planet2, onClose }: PlanetComparisonProps) {
  const compareItems = [
    { label: 'Size', key: 'size' as keyof Planet },
    { label: 'Gravity', key: 'gravity' as keyof Planet },
    { label: 'Day Length', key: 'dayLength' as keyof Planet },
    { label: 'Temperature', key: 'temperature' as keyof Planet },
    { label: 'Moons', key: 'moons' as keyof Planet },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="glass rounded-3xl p-8 max-w-4xl w-full border-2 border-purple-500/50 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-4xl font-bold text-gradient">Planet Comparison</h2>
          <button
            onClick={onClose}
            className="text-3xl text-gray-400 hover:text-white transition-colors"
          >
            ×
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-6">
          {/* Planet 1 */}
          <div className="text-center">
            <div className={`w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br ${planet1.color} flex items-center justify-center`}>
              <span className="text-6xl">{planet1.name === 'Earth' ? '🌍' : planet1.name === 'Mars' ? '🔴' : '🪐'}</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{planet1.name}</h3>
            <Link
              href={planet1.href}
              className="text-purple-400 hover:text-purple-300 text-sm"
            >
              Explore more →
            </Link>
          </div>
          
          {/* Comparison Table */}
          <div className="col-span-1 space-y-4">
            {compareItems.map((item) => (
              <div key={item.key} className="text-center">
                <div className="text-gray-400 text-sm mb-1">{item.label}</div>
                <div className="flex items-center justify-center gap-2">
                  <div className="flex-1 text-right text-white font-semibold text-sm">
                    {planet1[item.key]}
                  </div>
                  <div className="text-purple-400">vs</div>
                  <div className="flex-1 text-left text-white font-semibold text-sm">
                    {planet2[item.key]}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Planet 2 */}
          <div className="text-center">
            <div className={`w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br ${planet2.color} flex items-center justify-center`}>
              <span className="text-6xl">{planet2.name === 'Earth' ? '🌍' : planet2.name === 'Mars' ? '🔴' : '🪐'}</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{planet2.name}</h3>
            <Link
              href={planet2.href}
              className="text-purple-400 hover:text-purple-300 text-sm"
            >
              Explore more →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

