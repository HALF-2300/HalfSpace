/**
 * Live Universe System
 * 
 * Makes HalfSpace feel alive with:
 * - Daily discoveries
 * - This week in space
 * - Upcoming missions & events
 * - Space news feed
 */

// ============================================================================
// Types
// ============================================================================

export interface Discovery {
  id: string
  date: string
  title: string
  description: string
  source: string
  sourceUrl?: string
  image?: string
  category: 'planet' | 'star' | 'galaxy' | 'mission' | 'technology' | 'life' | 'physics'
  importance: 'major' | 'significant' | 'interesting'
}

export interface SpaceEvent {
  id: string
  date: string
  endDate?: string
  title: string
  description: string
  type: 'launch' | 'mission' | 'phenomenon' | 'anniversary' | 'observation'
  icon: string
  relatedLinks?: string[]
}

export interface Mission {
  id: string
  name: string
  agency: string
  status: 'planned' | 'in-development' | 'launching' | 'active' | 'completed' | 'cancelled'
  launchDate?: string
  launchYear: number
  destination: string
  description: string
  objectives: string[]
  icon: string
  image?: string
}

export interface WeekHighlight {
  title: string
  subtitle: string
  icon: string
  linkUrl?: string
  linkText?: string
}

// ============================================================================
// Curated Discoveries (2024-2026)
// ============================================================================

export const DISCOVERIES: Discovery[] = [
  {
    id: 'jwst-earliest-galaxies',
    date: '2024-01-15',
    title: 'JWST Discovers Earliest Galaxies Ever Seen',
    description: 'The James Webb Space Telescope has identified galaxies forming just 300 million years after the Big Bang, rewriting our understanding of early cosmic evolution.',
    source: 'NASA',
    category: 'galaxy',
    importance: 'major'
  },
  {
    id: 'venus-phosphine-update',
    date: '2024-02-20',
    title: 'New Evidence for Phosphine in Venus Atmosphere',
    description: 'Follow-up observations strengthen the case for phosphine gas in Venus\'s clouds, a potential biosignature that remains controversial and unexplained.',
    source: 'ESA',
    category: 'life',
    importance: 'major'
  },
  {
    id: 'europa-plumes',
    date: '2024-03-10',
    title: 'Europa\'s Ocean Plumes Confirmed',
    description: 'New analysis confirms water vapor plumes erupting from Jupiter\'s moon Europa, making future missions to sample its ocean more feasible.',
    source: 'NASA JPL',
    category: 'planet',
    importance: 'significant'
  },
  {
    id: 'starship-orbit',
    date: '2024-06-15',
    title: 'SpaceX Starship Achieves Orbit',
    description: 'After multiple test flights, SpaceX\'s Starship successfully reaches orbit, marking a major milestone toward Mars missions.',
    source: 'SpaceX',
    category: 'technology',
    importance: 'major'
  },
  {
    id: 'mars-underground-lake',
    date: '2024-08-01',
    title: 'Underground Lake System Mapped on Mars',
    description: 'Radar data reveals an extensive network of underground water reservoirs beneath Mars\'s south pole, larger than previously estimated.',
    source: 'ESA',
    category: 'planet',
    importance: 'major'
  },
  {
    id: 'proxima-b-atmosphere',
    date: '2024-09-15',
    title: 'Proxima Centauri b May Have Atmosphere',
    description: 'New observations suggest our nearest exoplanet neighbor may retain a thin atmosphere despite stellar flares, keeping habitability hopes alive.',
    source: 'ESO',
    category: 'planet',
    importance: 'significant'
  },
  {
    id: 'dark-matter-clue',
    date: '2024-11-01',
    title: 'New Dark Matter Particle Candidate Proposed',
    description: 'Theoretical physicists propose a new class of particles that could explain dark matter, with experiments planned to test the theory.',
    source: 'CERN',
    category: 'physics',
    importance: 'significant'
  },
  {
    id: 'artemis-moon-landing',
    date: '2025-04-01',
    title: 'Artemis III: Humans Return to the Moon',
    description: 'NASA\'s Artemis III mission lands the first humans on the Moon since 1972, including the first woman and person of color on the lunar surface.',
    source: 'NASA',
    category: 'mission',
    importance: 'major'
  },
  {
    id: 'titan-lakes-detailed',
    date: '2025-06-15',
    title: 'Titan\'s Methane Lakes More Complex Than Thought',
    description: 'Analysis reveals Titan\'s hydrocarbon lakes have active weather cycles and potential for prebiotic chemistry.',
    source: 'NASA',
    category: 'planet',
    importance: 'interesting'
  },
  {
    id: 'black-hole-merger-record',
    date: '2025-09-01',
    title: 'Largest Black Hole Merger Detected',
    description: 'LIGO-Virgo-KAGRA detect gravitational waves from a merger creating a black hole of 180 solar masses, breaking previous records.',
    source: 'LIGO',
    category: 'physics',
    importance: 'significant'
  },
  {
    id: 'mars-sample-return-launch',
    date: '2026-01-20',
    title: 'Mars Sample Return Mission Launches',
    description: 'The historic mission to retrieve Perseverance\'s collected samples begins, promising the first Mars material on Earth by 2033.',
    source: 'NASA/ESA',
    category: 'mission',
    importance: 'major'
  },
  {
    id: 'jwst-exoplanet-biosignature',
    date: '2026-03-15',
    title: 'JWST Detects Potential Biosignature',
    description: 'Webb identifies unusual chemical combinations in an exoplanet atmosphere that could indicate biological processes.',
    source: 'NASA',
    category: 'life',
    importance: 'major'
  }
]

// ============================================================================
// Upcoming Missions (2024-2035)
// ============================================================================

export const MISSIONS: Mission[] = [
  {
    id: 'artemis-2',
    name: 'Artemis II',
    agency: 'NASA',
    status: 'in-development',
    launchYear: 2025,
    launchDate: '2025-09',
    destination: 'Moon (orbit)',
    description: 'First crewed Artemis mission, sending astronauts around the Moon.',
    objectives: ['Test Orion spacecraft with crew', 'Lunar flyby', 'Deep space life support validation'],
    icon: '🌙'
  },
  {
    id: 'artemis-3',
    name: 'Artemis III',
    agency: 'NASA',
    status: 'planned',
    launchYear: 2026,
    destination: 'Moon (surface)',
    description: 'First crewed lunar landing since Apollo 17 in 1972.',
    objectives: ['Land humans on Moon', 'South pole exploration', 'Water ice investigation'],
    icon: '👨‍🚀'
  },
  {
    id: 'europa-clipper',
    name: 'Europa Clipper',
    agency: 'NASA',
    status: 'active',
    launchYear: 2024,
    launchDate: '2024-10',
    destination: 'Europa (Jupiter moon)',
    description: 'Detailed study of Jupiter\'s moon Europa and its subsurface ocean.',
    objectives: ['Map ice shell', 'Analyze ocean composition', 'Identify potential landing sites'],
    icon: '🧊'
  },
  {
    id: 'mars-sample-return',
    name: 'Mars Sample Return',
    agency: 'NASA/ESA',
    status: 'in-development',
    launchYear: 2026,
    destination: 'Mars',
    description: 'The most ambitious robotic mission ever: returning samples from Mars to Earth.',
    objectives: ['Collect Perseverance samples', 'Launch from Mars surface', 'Earth return by 2033'],
    icon: '🔴'
  },
  {
    id: 'dragonfly',
    name: 'Dragonfly',
    agency: 'NASA',
    status: 'in-development',
    launchYear: 2027,
    destination: 'Titan (Saturn moon)',
    description: 'A drone that will fly through Titan\'s thick atmosphere, exploring this alien world.',
    objectives: ['Study prebiotic chemistry', 'Search for biosignatures', 'Explore diverse terrains'],
    icon: '🚁'
  },
  {
    id: 'vera-rubin',
    name: 'Vera C. Rubin Observatory',
    agency: 'NSF/DOE',
    status: 'in-development',
    launchYear: 2025,
    destination: 'Earth (Chile)',
    description: 'Revolutionary ground telescope that will survey the entire visible sky every few nights.',
    objectives: ['Map dark matter', 'Discover millions of asteroids', 'Detect transient events'],
    icon: '🔭'
  },
  {
    id: 'starship-mars-cargo',
    name: 'Starship Mars Cargo',
    agency: 'SpaceX',
    status: 'planned',
    launchYear: 2026,
    destination: 'Mars',
    description: 'First uncrewed Starship missions to Mars to test landing and deliver supplies.',
    objectives: ['Test Mars entry/landing', 'Deliver cargo', 'Produce propellant from atmosphere'],
    icon: '🚀'
  },
  {
    id: 'lunar-gateway',
    name: 'Lunar Gateway',
    agency: 'NASA/ESA/JAXA/CSA',
    status: 'in-development',
    launchYear: 2025,
    destination: 'Moon (orbit)',
    description: 'International space station in lunar orbit, supporting Moon and deep space exploration.',
    objectives: ['Enable sustainable lunar presence', 'Deep space research', 'Mars mission staging'],
    icon: '🛸'
  },
  {
    id: 'habex',
    name: 'Habitable Exoplanet Observatory',
    agency: 'NASA',
    status: 'planned',
    launchYear: 2035,
    destination: 'L2 (space)',
    description: 'Next-generation space telescope designed to directly image Earth-like exoplanets.',
    objectives: ['Image habitable zone planets', 'Analyze atmospheres for biosignatures', 'Characterize 30+ exo-Earths'],
    icon: '🌍'
  },
  {
    id: 'dearmoon',
    name: 'dearMoon',
    agency: 'SpaceX',
    status: 'planned',
    launchYear: 2026,
    destination: 'Moon (flyby)',
    description: 'First civilian lunar mission, carrying artists and creators around the Moon.',
    objectives: ['Inspire humanity', 'Private lunar tourism', 'Create art from space'],
    icon: '🎨'
  },
  {
    id: 'juice',
    name: 'JUICE',
    agency: 'ESA',
    status: 'active',
    launchYear: 2023,
    destination: 'Jupiter moons',
    description: 'Jupiter Icy Moons Explorer studying Ganymede, Callisto, and Europa.',
    objectives: ['Study icy moons', 'Search for subsurface oceans', 'Orbit Ganymede'],
    icon: '🪐'
  },
  {
    id: 'psyche',
    name: 'Psyche',
    agency: 'NASA',
    status: 'active',
    launchYear: 2023,
    destination: 'Asteroid Psyche',
    description: 'Mission to explore a unique metal asteroid that may be the core of a protoplanet.',
    objectives: ['Study metallic asteroid', 'Understand planetary cores', 'Map surface composition'],
    icon: '⚙️'
  }
]

// ============================================================================
// This Week in Space (Auto-generated based on date)
// ============================================================================

export function getThisWeekHighlights(): WeekHighlight[] {
  const now = new Date()
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
  
  // Rotate through highlights based on week
  const weekNum = Math.floor(dayOfYear / 7)
  
  const allHighlights: WeekHighlight[] = [
    {
      title: 'Mars is at its closest',
      subtitle: 'Best viewing opportunity this month',
      icon: '🔴',
      linkUrl: '/space/planets/mars',
      linkText: 'Learn about Mars'
    },
    {
      title: 'Perseid Meteor Shower Peak',
      subtitle: 'Up to 100 meteors per hour visible',
      icon: '☄️',
      linkUrl: '/space/phenomena/meteors',
      linkText: 'Viewing guide'
    },
    {
      title: 'New JWST Images Released',
      subtitle: 'Stunning views of distant galaxies',
      icon: '🔭',
      linkUrl: '/space/missions/jwst',
      linkText: 'See the images'
    },
    {
      title: 'SpaceX Launch This Week',
      subtitle: 'Starlink mission scheduled',
      icon: '🚀',
      linkUrl: '/space/missions',
      linkText: 'Mission details'
    },
    {
      title: 'ISS Visible Tonight',
      subtitle: 'Bright pass over most regions',
      icon: '🛸',
      linkUrl: '/space/missions/iss',
      linkText: 'Viewing times'
    },
    {
      title: 'Full Moon: Super Blue Moon',
      subtitle: 'Rare lunar event this week',
      icon: '🌕',
      linkUrl: '/space/moons/moon',
      linkText: 'Moon facts'
    }
  ]

  // Return 3 highlights rotated by week
  const startIdx = (weekNum * 2) % allHighlights.length
  return [
    allHighlights[startIdx % allHighlights.length],
    allHighlights[(startIdx + 1) % allHighlights.length],
    allHighlights[(startIdx + 2) % allHighlights.length]
  ]
}

// ============================================================================
// Helper Functions
// ============================================================================

export function getRecentDiscoveries(count: number = 5): Discovery[] {
  const sorted = [...DISCOVERIES].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  return sorted.slice(0, count)
}

export function getUpcomingMissions(count: number = 5): Mission[] {
  const now = new Date()
  const currentYear = now.getFullYear()
  
  return MISSIONS
    .filter(m => m.launchYear >= currentYear && m.status !== 'completed')
    .sort((a, b) => a.launchYear - b.launchYear)
    .slice(0, count)
}

export function getMissionsByYear(year: number): Mission[] {
  return MISSIONS.filter(m => m.launchYear === year)
}

export function getMissionById(id: string): Mission | undefined {
  return MISSIONS.find(m => m.id === id)
}

export function getDiscoveryById(id: string): Discovery | undefined {
  return DISCOVERIES.find(d => d.id === id)
}

export function getTodaysHighlight(): Discovery {
  // Deterministic daily selection
  const today = new Date()
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
  return DISCOVERIES[dayOfYear % DISCOVERIES.length]
}

export function formatMissionDate(mission: Mission): string {
  if (mission.launchDate) {
    const [year, month] = mission.launchDate.split('-')
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${months[parseInt(month) - 1]} ${year}`
  }
  return String(mission.launchYear)
}

export function getMissionStatusColor(status: Mission['status']): string {
  const colors: Record<Mission['status'], string> = {
    'planned': '#3b82f6',
    'in-development': '#f59e0b',
    'launching': '#22c55e',
    'active': '#22c55e',
    'completed': '#6b7280',
    'cancelled': '#ef4444'
  }
  return colors[status]
}
