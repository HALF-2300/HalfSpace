'use client'

import { useState } from 'react'
import PlanetCard, { PlanetComparison } from '@/components/PlanetCard'

const planets = [
  {
    id: 'mercury',
    name: 'Mercury',
    nameAr: 'Mercury',
    href: '/mercury',
    size: '4,879 km',
    gravity: '3.7 m/s²',
    dayLength: '176 Earth days',
    temperature: '427°C / -173°C',
    moons: '0',
    image: '',
    color: 'from-gray-500 to-gray-700',
    description: 'Smallest planet and closest to the Sun'
  },
  {
    id: 'venus',
    name: 'Venus',
    nameAr: 'Venus',
    href: '/venus',
    size: '12,104 km',
    gravity: '8.87 m/s²',
    dayLength: '243 Earth days',
    temperature: '462°C',
    moons: '0',
    image: '',
    color: 'from-yellow-500 to-orange-500',
    description: 'Hottest planet in the solar system'
  },
  {
    id: 'earth',
    name: 'Earth',
    nameAr: 'Earth',
    href: '/earth',
    size: '12,756 km',
    gravity: '9.8 m/s²',
    dayLength: '24 hours',
    temperature: '15°C (average)',
    moons: '1',
    image: '',
    color: 'from-blue-500 to-cyan-500',
    description: 'Our blue planet - home of life'
  },
  {
    id: 'mars',
    name: 'Mars',
    nameAr: 'Mars',
    href: '/mars',
    size: '6,792 km',
    gravity: '3.7 m/s²',
    dayLength: '24.6 hours',
    temperature: '-65°C (average)',
    moons: '2',
    image: '',
    color: 'from-red-500 to-orange-500',
    description: 'The Red Planet - exploration target'
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    nameAr: 'Jupiter',
    href: '/jupiter',
    size: '142,984 km',
    gravity: '24.8 m/s²',
    dayLength: '9.9 hours',
    temperature: '-110°C',
    moons: '95+',
    image: '',
    color: 'from-orange-500 to-yellow-500',
    description: 'Gas giant - largest planet'
  },
  {
    id: 'saturn',
    name: 'Saturn',
    nameAr: 'Saturn',
    href: '/saturn',
    size: '120,536 km',
    gravity: '10.4 m/s²',
    dayLength: '10.7 hours',
    temperature: '-140°C',
    moons: '146+',
    image: '',
    color: 'from-yellow-400 to-amber-400',
    description: 'Planet with beautiful rings'
  },
  {
    id: 'uranus',
    name: 'Uranus',
    nameAr: 'Uranus',
    href: '/uranus',
    size: '51,118 km',
    gravity: '8.7 m/s²',
    dayLength: '17.2 hours',
    temperature: '-195°C',
    moons: '27',
    image: '',
    color: 'from-cyan-500 to-blue-500',
    description: 'The planet tilted on its side'
  },
  {
    id: 'neptune',
    name: 'Neptune',
    nameAr: 'Neptune',
    href: '/neptune',
    size: '49,528 km',
    gravity: '11.2 m/s²',
    dayLength: '16.1 hours',
    temperature: '-200°C',
    moons: '16',
    image: '',
    color: 'from-blue-600 to-indigo-600',
    description: 'Farthest planet - fastest winds'
  }
]

export default function PlanetComparisonPage() {
  const [selectedPlanets, setSelectedPlanets] = useState<string[]>([])

  const handleCompare = (planet: typeof planets[0]) => {
    if (selectedPlanets.includes(planet.id)) {
      setSelectedPlanets(selectedPlanets.filter(id => id !== planet.id))
    } else if (selectedPlanets.length < 2) {
      setSelectedPlanets([...selectedPlanets, planet.id])
    } else {
      // Replace first selected
      setSelectedPlanets([selectedPlanets[1], planet.id])
    }
  }

  const planet1 = planets.find(p => p.id === selectedPlanets[0])
  const planet2 = planets.find(p => p.id === selectedPlanets[1])

  return (
    <div className="min-h-screen pt-20 px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-gradient portal-title">
            Planet Cards
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Compare planets and discover amazing differences
          </p>
          {selectedPlanets.length > 0 && (
            <div className="inline-block px-6 py-3 glass rounded-xl border-2 border-purple-500/50">
              <span className="text-purple-300">
                {selectedPlanets.length === 1 ? 'Select another planet to compare' : 'Click "Compare" to compare'}
              </span>
            </div>
          )}
        </div>

        {/* Planets Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {planets.map((planet) => (
            <PlanetCard
              key={planet.id}
              planet={planet}
              onCompare={handleCompare}
              isComparing={selectedPlanets.includes(planet.id)}
            />
          ))}
        </div>
      </div>

      {/* Comparison Modal */}
      {planet1 && planet2 && (
        <PlanetComparison
          planet1={planet1}
          planet2={planet2}
          onClose={() => setSelectedPlanets([])}
        />
      )}
    </div>
  )
}

