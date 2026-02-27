'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface DailyMission {
  title: string
  titleAr: string
  description: string
  descriptionAr: string
  href: string
  icon: string
}

interface WeeklyVehicle {
  name: string
  nameAr: string
  type: string
  typeAr: string
  description: string
  descriptionAr: string
  image: string
  href: string
}

const dailyMissions: DailyMission[] = [
  {
    title: 'Explore Mars',
    titleAr: 'استكشف المريخ',
    description: 'Learn about the Red Planet and ongoing missions',
    descriptionAr: 'تعرف على الكوكب الأحمر والمهمات الجارية',
    href: '/mars',
    icon: '🔴'
  },
  {
    title: 'Black Holes',
    titleAr: 'الثقوب السوداء',
    description: 'Discover the mysteries of black holes',
    descriptionAr: 'اكتشف أسرار الثقوب السوداء',
    href: '/black-holes',
    icon: '🕳️'
  },
  {
    title: 'James Webb',
    titleAr: 'جيمس ويب',
    description: 'See the latest images from JWST',
    descriptionAr: 'شاهد أحدث صور من جيمس ويب',
    href: '/telescopes',
    icon: '🔭'
  },
  {
    title: 'Exoplanets',
    titleAr: 'الكواكب الخارجية',
    description: 'Find worlds beyond our solar system',
    descriptionAr: 'اكتشف عوالم خارج نظامنا الشمسي',
    href: '/exoplanets',
    icon: '🪐'
  }
]

const weeklyVehicles: WeeklyVehicle[] = [
  {
    name: 'Perseverance Rover',
    nameAr: 'مركبة المثابرة',
    type: 'Mars Rover',
    typeAr: 'مركبة مريخية',
    description: 'Searching for signs of ancient life on Mars',
    descriptionAr: 'تبحث عن علامات الحياة القديمة على المريخ',
    image: 'https://images-assets.nasa.gov/image/PIA24428/PIA24428~orig.jpg',
    href: '/mars'
  },
  {
    name: 'James Webb',
    nameAr: 'جيمس ويب',
    type: 'Space Telescope',
    typeAr: 'تلسكوب فضائي',
    description: 'Peering into the early universe',
    descriptionAr: 'ينظر إلى الكون المبكر',
    image: 'https://images-assets.nasa.gov/image/weic2208a/weic2208a~orig.jpg',
    href: '/telescopes'
  },
  {
    name: 'International Space Station',
    nameAr: 'محطة الفضاء الدولية',
    type: 'Space Station',
    typeAr: 'محطة فضاء',
    description: 'Continuous human presence in space',
    descriptionAr: 'وجود بشري مستمر في الفضاء',
    image: 'https://images-assets.nasa.gov/image/ISS030-E-015472/ISS030-E-015472~orig.jpg',
    href: '/space-stations'
  }
]

const quickFacts = [
  'Distance between Earth and Sun: 150 million kilometers',
  'Speed of light: 300,000 kilometers per second',
  'Number of stars in the Milky Way: 100-400 billion',
  'Largest planet: Jupiter (318 times larger than Earth)',
  'Smallest planet: Mercury (0.38 times the size of Earth)',
  'Longest day: Venus (243 Earth days)',
  'Nearest star: Proxima Centauri (4.24 light years)',
  'Age of the universe: about 13.8 billion years'
]

export default function MissionControl() {
  const [curiosityLevel, setCuriosityLevel] = useState(0)
  const [dailyMission, setDailyMission] = useState<DailyMission>(dailyMissions[0])
  const [weeklyVehicle, setWeeklyVehicle] = useState<WeeklyVehicle>(weeklyVehicles[0])
  const [quickFact, setQuickFact] = useState(quickFacts[0])

  useEffect(() => {
    // Set daily mission (changes daily)
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    setDailyMission(dailyMissions[dayOfYear % dailyMissions.length])
    
    // Set weekly vehicle (changes weekly)
    const weekOfYear = Math.floor(dayOfYear / 7)
    setWeeklyVehicle(weeklyVehicles[weekOfYear % weeklyVehicles.length])
    
    // Rotate quick fact
    const factInterval = setInterval(() => {
      setQuickFact(quickFacts[Math.floor(Math.random() * quickFacts.length)])
    }, 5000)
    
    // Calculate curiosity level (based on pages visited - stored in localStorage)
    try {
      const stored = localStorage.getItem('visitedPages')
      const visitedPages = stored ? JSON.parse(stored) : []
      if (Array.isArray(visitedPages)) {
        const curiosity = Math.min(visitedPages.length * 5, 100)
        setCuriosityLevel(curiosity)
      }
    } catch (error) {
      console.error('Error reading visited pages from localStorage:', error)
      setCuriosityLevel(0)
    }
    
    return () => clearInterval(factInterval)
  }, [])

  return (
    <div className="min-h-screen pt-20 px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-gradient portal-title">
            Mission Control
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Your space dashboard - today's mission, weekly vehicle, and quick facts
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Daily Mission */}
          <div className="glass rounded-2xl p-6 border-2 border-purple-500/30 hover:border-purple-500/50 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{dailyMission.icon}</span>
              <div>
                <div className="text-purple-400 text-sm font-semibold">Daily Mission</div>
                <h3 className="text-2xl font-bold text-white">{dailyMission.title}</h3>
              </div>
            </div>
            <p className="text-gray-300 mb-4">{dailyMission.description}</p>
            <Link
              href={dailyMission.href}
              className="inline-block w-full text-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white font-bold hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              Start Exploring →
            </Link>
          </div>

          {/* Weekly Vehicle */}
          <div className="glass rounded-2xl p-6 border-2 border-purple-500/30 hover:border-purple-500/50 transition-all">
            <div className="text-purple-400 text-sm font-semibold mb-2">Weekly Vehicle</div>
            <h3 className="text-2xl font-bold text-white mb-2">{weeklyVehicle.name}</h3>
            <div className="text-gray-400 text-sm mb-3">{weeklyVehicle.type}</div>
            <div className="relative h-32 rounded-xl overflow-hidden mb-4">
              <img
                src={weeklyVehicle.image}
                alt={weeklyVehicle.name}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-gray-300 text-sm mb-4">{weeklyVehicle.description}</p>
            <Link
              href={weeklyVehicle.href}
              className="inline-block w-full text-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white font-bold hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              Learn More →
            </Link>
          </div>

          {/* Quick Fact */}
          <div className="glass rounded-2xl p-6 border-2 border-purple-500/30 hover:border-purple-500/50 transition-all">
            <div className="text-purple-400 text-sm font-semibold mb-2">Quick Fact</div>
            <div className="h-32 flex items-center justify-center">
              <p className="text-white text-lg text-center font-semibold">{quickFact}</p>
            </div>
            <div className="text-center text-gray-400 text-xs mt-4">
              Changes every 5 seconds
            </div>
          </div>

          {/* Curiosity Level */}
          <div className="glass rounded-2xl p-6 border-2 border-purple-500/30 hover:border-purple-500/50 transition-all md:col-span-2 lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-purple-400 text-sm font-semibold mb-1">Curiosity Level</div>
                <h3 className="text-3xl font-bold text-gradient">
                  {curiosityLevel < 20 && 'Space Cadet'}
                  {curiosityLevel >= 20 && curiosityLevel < 50 && 'Passionate Astronomer'}
                  {curiosityLevel >= 50 && curiosityLevel < 80 && 'Professional Explorer'}
                  {curiosityLevel >= 80 && 'Fleet Commander'}
                </h3>
              </div>
              <div className="text-4xl font-bold text-purple-400">{curiosityLevel}%</div>
            </div>
            <div className="relative h-8 bg-space-deep rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 rounded-full transition-all duration-1000 flex items-center justify-end pr-4"
                style={{ width: `${curiosityLevel}%` }}
              >
                {curiosityLevel > 10 && (
                  <span className="text-white text-xs font-bold">🚀</span>
                )}
              </div>
            </div>
            <p className="text-gray-400 text-sm mt-3">
              Explore more pages to increase your curiosity level!
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-gradient">Quick Links</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Link
              href="/galaxy-map"
              className="p-6 glass rounded-xl border border-purple-500/20 hover:border-purple-500/50 text-center transition-all transform hover:scale-105"
            >
              <div className="text-4xl mb-2">🌌</div>
              <div className="text-sm font-semibold text-white">Galaxy Map</div>
            </Link>
            <Link
              href="/planets"
              className="p-6 glass rounded-xl border border-purple-500/20 hover:border-purple-500/50 text-center transition-all transform hover:scale-105"
            >
              <div className="text-4xl mb-2">🪐</div>
              <div className="text-sm font-semibold text-white">Planets</div>
            </Link>
            <Link
              href="/telescopes"
              className="p-6 glass rounded-xl border border-purple-500/20 hover:border-purple-500/50 text-center transition-all transform hover:scale-105"
            >
              <div className="text-4xl mb-2">🔭</div>
              <div className="text-sm font-semibold text-white">Telescopes</div>
            </Link>
            <Link
              href="/missions"
              className="p-6 glass rounded-xl border border-purple-500/20 hover:border-purple-500/50 text-center transition-all transform hover:scale-105"
            >
              <div className="text-4xl mb-2">🚀</div>
              <div className="text-sm font-semibold text-white">Missions</div>
            </Link>
            <Link
              href="/historical-images"
              className="p-6 glass rounded-xl border border-purple-500/20 hover:border-purple-500/50 text-center transition-all transform hover:scale-105"
            >
              <div className="text-4xl mb-2">📸</div>
              <div className="text-sm font-semibold text-white">Historical Images</div>
            </Link>
            <Link
              href="/glossary"
              className="p-6 glass rounded-xl border border-purple-500/20 hover:border-purple-500/50 text-center transition-all transform hover:scale-105"
            >
              <div className="text-4xl mb-2">📚</div>
              <div className="text-sm font-semibold text-white">Glossary</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

