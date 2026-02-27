'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface TimelineEvent {
  id: string
  year: number
  title: string
  titleAr: string
  category: 'space-race' | 'telescopes' | 'planets' | 'space-stations'
  description: string
  descriptionAr: string
  image: string
  imageAlt: string
  href?: string
}

const timelineEvents: TimelineEvent[] = [
  {
    id: 'sputnik',
    year: 1957,
    title: 'Sputnik 1',
    titleAr: 'سبوتنيك 1',
    category: 'space-race',
    description: 'First artificial satellite launched by the Soviet Union',
    descriptionAr: 'أول قمر صناعي أطلقته الاتحاد السوفيتي',
    image: 'https://images-assets.nasa.gov/image/S57-00001/S57-00001~orig.jpg',
    imageAlt: 'Sputnik 1',
    href: '/missions'
  },
  {
    id: 'gagarin',
    year: 1961,
    title: 'Yuri Gagarin',
    titleAr: 'يوري جاجارين',
    category: 'space-race',
    description: 'First human in space',
    descriptionAr: 'أول إنسان في الفضاء',
    image: 'https://images-assets.nasa.gov/image/S61-01923/S61-01923~orig.jpg',
    imageAlt: 'Yuri Gagarin',
    href: '/astronauts'
  },
  {
    id: 'apollo-11',
    year: 1969,
    title: 'Apollo 11 Moon Landing',
    titleAr: 'هبوط أبولو 11 على القمر',
    category: 'space-race',
    description: 'First humans on the Moon - "That\'s one small step..."',
    descriptionAr: 'أول بشر على القمر - "خطوة صغيرة للإنسان..."',
    image: 'https://images-assets.nasa.gov/image/AS11-40-5874/AS11-40-5874~orig.jpg',
    imageAlt: 'Apollo 11 moon landing',
    href: '/missions'
  },
  {
    id: 'voyager',
    year: 1977,
    title: 'Voyager Missions',
    titleAr: 'مهمات فوياجر',
    category: 'planets',
    description: 'Twin spacecraft exploring the outer planets',
    descriptionAr: 'مركبتان توأم تستكشفان الكواكب الخارجية',
    image: 'https://images-assets.nasa.gov/image/PIA01341/PIA01341~orig.jpg',
    imageAlt: 'Voyager spacecraft',
    href: '/missions'
  },
  {
    id: 'hubble',
    year: 1990,
    title: 'Hubble Space Telescope',
    titleAr: 'تلسكوب هابل الفضائي',
    category: 'telescopes',
    description: 'Revolutionary space telescope launched',
    descriptionAr: 'إطلاق تلسكوب فضائي ثوري',
    image: 'https://images-assets.nasa.gov/image/STScI-PRC95-24a/STScI-PRC95-24a~orig.jpg',
    imageAlt: 'Hubble Space Telescope',
    href: '/telescopes'
  },
  {
    id: 'iss',
    year: 1998,
    title: 'International Space Station',
    titleAr: 'محطة الفضاء الدولية',
    category: 'space-stations',
    description: 'First module launched - continuous human presence in space',
    descriptionAr: 'إطلاق أول وحدة - وجود بشري مستمر في الفضاء',
    image: 'https://images-assets.nasa.gov/image/ISS030-E-015472/ISS030-E-015472~orig.jpg',
    imageAlt: 'International Space Station',
    href: '/space-stations'
  },
  {
    id: 'mars-rovers',
    year: 2004,
    title: 'Mars Rovers',
    titleAr: 'مركبات المريخ',
    category: 'planets',
    description: 'Spirit and Opportunity land on Mars',
    descriptionAr: 'هبوط سبيريت وأوبورتونيتي على المريخ',
    image: 'https://images-assets.nasa.gov/image/PIA03153/PIA03153~orig.jpg',
    imageAlt: 'Mars rover',
    href: '/mars'
  },
  {
    id: 'exoplanets',
    year: 2009,
    title: 'Kepler Mission',
    titleAr: 'مهمة كيبلر',
    category: 'planets',
    description: 'Discovery of thousands of exoplanets begins',
    descriptionAr: 'بداية اكتشاف آلاف الكواكب الخارجية',
    image: 'https://images-assets.nasa.gov/image/PIA17011/PIA17011~orig.jpg',
    imageAlt: 'Kepler telescope',
    href: '/exoplanets'
  },
  {
    id: 'black-hole',
    year: 2019,
    title: 'First Black Hole Image',
    titleAr: 'أول صورة لثقب أسود',
    category: 'telescopes',
    description: 'Event Horizon Telescope captures first black hole image',
    descriptionAr: 'تلسكوب أفق الحدث يلتقط أول صورة لثقب أسود',
    image: 'https://images-assets.nasa.gov/image/PIA23122/PIA23122~orig.jpg',
    imageAlt: 'First black hole image',
    href: '/black-holes'
  },
  {
    id: 'jwst',
    year: 2021,
    title: 'James Webb Space Telescope',
    titleAr: 'تلسكوب جيمس ويب الفضائي',
    category: 'telescopes',
    description: 'Most powerful space telescope launched',
    descriptionAr: 'إطلاق أقوى تلسكوب فضائي',
    image: 'https://images-assets.nasa.gov/image/weic2208a/weic2208a~orig.jpg',
    imageAlt: 'James Webb Space Telescope',
    href: '/telescopes'
  }
]

const categoryColors = {
  'space-race': 'from-blue-600 to-cyan-600',
  'telescopes': 'from-purple-600 to-pink-600',
  'planets': 'from-orange-600 to-red-600',
  'space-stations': 'from-green-600 to-teal-600'
}

const categoryLabels = {
  'space-race': 'Space Race',
  'telescopes': 'Telescopes',
  'planets': 'Planets',
  'space-stations': 'Space Stations'
}

export default function CinematicTimeline() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [visibleEvents, setVisibleEvents] = useState<Set<string>>(new Set())
  const eventRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  const filteredEvents = selectedCategory
    ? timelineEvents.filter(e => e.category === selectedCategory)
    : timelineEvents

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleEvents(prev => new Set([...prev, entry.target.id]))
          }
        })
      },
      { threshold: 0.3 }
    )

    Object.values(eventRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [filteredEvents])

  return (
    <div className="min-h-screen pt-20 px-4 py-12 relative">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-gradient portal-title">
            Cinematic Timeline
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            A journey through the most important space exploration events
          </p>
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedCategory === null
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'glass border border-purple-500/30 text-gray-300 hover:border-purple-500/50'
              }`}
            >
              All
            </button>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  selectedCategory === key
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'glass border border-purple-500/30 text-gray-300 hover:border-purple-500/50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Line */}
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-500 via-blue-500 to-pink-500 opacity-30" />
          
          {/* Events */}
          <div className="space-y-24">
            {filteredEvents.map((event, index) => {
              const isLeft = index % 2 === 0
              const isVisible = visibleEvents.has(event.id)
              
              return (
                <div
                  key={event.id}
                  id={event.id}
                  ref={(el) => { eventRefs.current[event.id] = el }}
                  className={`relative flex items-center ${isLeft ? 'flex-row' : 'flex-row-reverse'} ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  } transition-all duration-1000`}
                >
                  {/* Timeline Dot */}
                  <div className={`absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-br ${categoryColors[event.category]} border-4 border-space-deep z-10 glow-purple`} />
                  
                  {/* Event Card */}
                  <div className={`w-5/12 ${isLeft ? 'pr-8' : 'pl-8'}`}>
                    <div className="glass rounded-2xl p-6 border-2 border-purple-500/30 hover:border-purple-500/50 transition-all transform hover:scale-105">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${categoryColors[event.category]}`}>
                          {categoryLabels[event.category]}
                        </span>
                        <span className="text-2xl font-bold text-purple-400">{event.year}</span>
                      </div>
                      
                      <h3 className="text-3xl font-bold text-gradient mb-3">{event.title}</h3>
                      <p className="text-gray-300 mb-4">{event.description}</p>
                      
                      <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                        <img
                          src={event.image}
                          alt={event.imageAlt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {event.href && (
                        <Link
                          href={event.href}
                          className="inline-block px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white font-bold hover:from-purple-700 hover:to-blue-700 transition-all"
                        >
                          Learn more →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

