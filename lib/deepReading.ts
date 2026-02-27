/**
 * Deep Reading System
 * 
 * Turns HalfSpace into a book-like experience with:
 * - Chapters and sections
 * - Reading progress tracking
 * - Time estimates
 * - Continue where you left off
 */

import { safeGetJSON, safeSetJSON } from './storage'

// ============================================================================
// Types
// ============================================================================

export interface Chapter {
  id: string
  title: string
  titleAr?: string
  description: string
  icon: string
  sections: Section[]
  estimatedMinutes: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  prerequisites?: string[]
}

export interface Section {
  id: string
  title: string
  content: ContentBlock[]
  estimatedMinutes: number
}

export interface ContentBlock {
  type: 'text' | 'fact' | 'image' | 'quote' | 'comparison' | 'timeline' | 'quiz'
  content: string
  metadata?: Record<string, any>
}

export interface ReadingProgress {
  chapterId: string
  sectionIndex: number
  scrollPosition: number
  lastReadAt: string
  completed: boolean
  timeSpent: number // seconds
}

export interface ReadingStats {
  totalTimeRead: number // seconds
  chaptersCompleted: number
  sectionsRead: number
  currentStreak: number
  longestSession: number
}

// ============================================================================
// Storage
// ============================================================================

const PROGRESS_KEY = 'halfspace_reading_progress'
const STATS_KEY = 'halfspace_reading_stats'

export function loadProgress(): Record<string, ReadingProgress> {
  return safeGetJSON(PROGRESS_KEY, {})
}

export function saveProgress(chapterId: string, progress: ReadingProgress): void {
  const all = loadProgress()
  all[chapterId] = progress
  safeSetJSON(PROGRESS_KEY, all)
}

export function loadStats(): ReadingStats {
  return safeGetJSON(STATS_KEY, {
    totalTimeRead: 0,
    chaptersCompleted: 0,
    sectionsRead: 0,
    currentStreak: 0,
    longestSession: 0
  })
}

export function saveStats(stats: ReadingStats): void {
  safeSetJSON(STATS_KEY, stats)
}

// ============================================================================
// Reading Progress Functions
// ============================================================================

export function getChapterProgress(chapterId: string): ReadingProgress | null {
  const all = loadProgress()
  return all[chapterId] || null
}

export function updateReadingProgress(
  chapterId: string, 
  sectionIndex: number, 
  scrollPosition: number,
  timeSpent: number
): void {
  const existing = getChapterProgress(chapterId)
  
  saveProgress(chapterId, {
    chapterId,
    sectionIndex,
    scrollPosition,
    lastReadAt: new Date().toISOString(),
    completed: false,
    timeSpent: (existing?.timeSpent || 0) + timeSpent
  })

  // Update stats
  const stats = loadStats()
  stats.totalTimeRead += timeSpent
  if (timeSpent > stats.longestSession) {
    stats.longestSession = timeSpent
  }
  saveStats(stats)
}

export function markChapterComplete(chapterId: string): void {
  const progress = getChapterProgress(chapterId)
  if (progress) {
    saveProgress(chapterId, { ...progress, completed: true })
    
    const stats = loadStats()
    stats.chaptersCompleted++
    saveStats(stats)
  }
}

export function getResumePoint(): { chapterId: string; progress: ReadingProgress } | null {
  const all = loadProgress()
  let mostRecent: { chapterId: string; progress: ReadingProgress } | null = null
  
  for (const [chapterId, progress] of Object.entries(all)) {
    if (!progress.completed) {
      if (!mostRecent || new Date(progress.lastReadAt) > new Date(mostRecent.progress.lastReadAt)) {
        mostRecent = { chapterId, progress }
      }
    }
  }
  
  return mostRecent
}

// ============================================================================
// Time Formatting
// ============================================================================

export function formatReadingTime(minutes: number): string {
  if (minutes < 1) return 'Less than 1 min'
  if (minutes === 1) return '1 min read'
  if (minutes < 60) return `${minutes} min read`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (mins === 0) return `${hours}h read`
  return `${hours}h ${mins}m read`
}

export function formatTimeSpent(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

// ============================================================================
// Chapter Library
// ============================================================================

export const CHAPTERS: Chapter[] = [
  {
    id: 'solar-system-intro',
    title: 'Our Solar System: A Complete Guide',
    description: 'Everything you need to know about our cosmic neighborhood — from the Sun to the Oort Cloud.',
    icon: '☀️',
    difficulty: 'beginner',
    estimatedMinutes: 45,
    sections: [
      {
        id: 'ss-overview',
        title: 'Overview: What is the Solar System?',
        estimatedMinutes: 5,
        content: [
          { type: 'text', content: 'The Solar System is our cosmic home — a gravitationally bound system comprising the Sun and everything that orbits it. This includes eight planets, hundreds of moons, millions of asteroids, and billions of comets and icy bodies.' },
          { type: 'fact', content: 'The Solar System is 4.6 billion years old, formed from a giant cloud of gas and dust called the solar nebula.' },
          { type: 'text', content: 'Our Solar System extends far beyond the planets. The Oort Cloud, a theoretical shell of icy objects, may extend up to 100,000 AU from the Sun — nearly 2 light-years away.' },
          { type: 'comparison', content: 'If the Sun were the size of a basketball, Earth would be a peppercorn 26 meters away, and Neptune would be 780 meters away.' }
        ]
      },
      {
        id: 'ss-sun',
        title: 'The Sun: Our Star',
        estimatedMinutes: 8,
        content: [
          { type: 'text', content: 'The Sun is a G-type main-sequence star (G2V), often called a yellow dwarf. It contains 99.86% of the Solar System\'s total mass and provides the light and heat that makes life on Earth possible.' },
          { type: 'fact', content: 'The Sun\'s core temperature reaches 15 million degrees Celsius — hot enough to fuse hydrogen into helium through nuclear fusion.' },
          { type: 'text', content: 'Every second, the Sun converts 600 million tons of hydrogen into helium, releasing energy equivalent to 400 billion nuclear bombs. This process has been ongoing for 4.6 billion years and will continue for another 5 billion years.' },
          { type: 'timeline', content: 'Sun\'s Life Cycle: Formation (4.6 billion years ago) → Main Sequence (now) → Red Giant (5 billion years) → White Dwarf (7.5 billion years)' },
          { type: 'text', content: 'The Sun\'s surface, called the photosphere, is "only" about 5,500°C. Above it lies the chromosphere and the corona, which paradoxically reaches temperatures of 1-3 million degrees — a mystery scientists are still working to understand.' }
        ]
      },
      {
        id: 'ss-inner-planets',
        title: 'The Inner Planets: Rocky Worlds',
        estimatedMinutes: 12,
        content: [
          { type: 'text', content: 'The four inner planets — Mercury, Venus, Earth, and Mars — are called terrestrial or rocky planets. They share common features: solid surfaces, relatively small sizes, and few or no moons.' },
          { type: 'fact', content: 'Mercury orbits so close to the Sun that a single day (sunrise to sunrise) takes 176 Earth days, but its year is only 88 Earth days.' },
          { type: 'text', content: 'Venus is often called Earth\'s twin because of similar size and mass, but the similarities end there. Venus has a crushing atmosphere 90 times denser than Earth\'s, surface temperatures of 465°C (hot enough to melt lead), and sulfuric acid clouds.' },
          { type: 'quote', content: '"Venus is a reminder that the greenhouse effect is not just a theory — it\'s a planetary reality." — Carl Sagan' },
          { type: 'text', content: 'Earth is the only known planet with liquid water on its surface, a protective magnetic field, and active plate tectonics. These factors, combined with our atmosphere, create the conditions for life.' },
          { type: 'text', content: 'Mars, the Red Planet, once had rivers, lakes, and possibly oceans. Today, water ice exists at the poles and possibly underground. The Perseverance rover is currently searching for signs of ancient microbial life.' }
        ]
      },
      {
        id: 'ss-asteroid-belt',
        title: 'The Asteroid Belt',
        estimatedMinutes: 5,
        content: [
          { type: 'text', content: 'Between Mars and Jupiter lies the asteroid belt, home to millions of rocky objects left over from the Solar System\'s formation. Despite what movies show, the belt is mostly empty space — you could fly through it without hitting anything.' },
          { type: 'fact', content: 'The total mass of the asteroid belt is less than 4% of Earth\'s Moon. Ceres alone contains about one-third of that mass.' },
          { type: 'text', content: 'Ceres, the largest object in the asteroid belt, is classified as a dwarf planet. It has a diameter of 940 km and may have a subsurface ocean of liquid water.' }
        ]
      },
      {
        id: 'ss-outer-planets',
        title: 'The Outer Planets: Gas and Ice Giants',
        estimatedMinutes: 15,
        content: [
          { type: 'text', content: 'Beyond the asteroid belt lie the four giant planets: Jupiter and Saturn (gas giants) and Uranus and Neptune (ice giants). These worlds are fundamentally different from the rocky inner planets.' },
          { type: 'fact', content: 'Jupiter is so massive that it\'s actually a "failed star." If it were 80 times more massive, it would have enough pressure to ignite nuclear fusion and become a red dwarf star.' },
          { type: 'text', content: 'Jupiter\'s Great Red Spot is a storm that has been raging for at least 400 years. It\'s so large that Earth could fit inside it three times. Recently, it has been shrinking, and scientists are monitoring whether it will eventually disappear.' },
          { type: 'text', content: 'Saturn is famous for its stunning ring system, but all four giant planets have rings. Saturn\'s rings are just the most spectacular — made of billions of particles of ice and rock, ranging from grains of sand to houses.' },
          { type: 'comparison', content: 'Saturn is so light for its size that if you could find a bathtub big enough, it would float. Its density is only 0.687 g/cm³ — less than water.' },
          { type: 'text', content: 'Uranus is the strangest planet: it rotates on its side, with an axial tilt of 98 degrees. This means its poles get more direct sunlight than its equator. Scientists believe a massive collision knocked it over early in the Solar System\'s history.' },
          { type: 'text', content: 'Neptune, the windiest planet, has storms that rage at over 2,000 km/h — faster than the speed of sound on Earth. Its deep blue color comes from methane in its atmosphere absorbing red light.' },
          { type: 'fact', content: 'Neptune was the first planet discovered through mathematical prediction rather than observation. Astronomers noticed Uranus wasn\'t where it should be and calculated that another planet\'s gravity must be affecting it.' }
        ]
      }
    ]
  },
  {
    id: 'black-holes-deep',
    title: 'Black Holes: The Ultimate Deep Dive',
    description: 'From stellar collapse to supermassive monsters — understand the most extreme objects in the universe.',
    icon: '⚫',
    difficulty: 'intermediate',
    estimatedMinutes: 60,
    sections: [
      {
        id: 'bh-what-are',
        title: 'What is a Black Hole?',
        estimatedMinutes: 8,
        content: [
          { type: 'text', content: 'A black hole is a region of spacetime where gravity is so strong that nothing — not even light — can escape once it crosses the event horizon. They are not "holes" in the traditional sense, but rather incredibly dense objects.' },
          { type: 'fact', content: 'If you compressed Earth to the size of a marble (about 9mm), it would become a black hole. The Sun would need to be compressed to about 6 km across.' },
          { type: 'text', content: 'Black holes were predicted by Einstein\'s general theory of relativity in 1915, though Einstein himself doubted they could exist in nature. The term "black hole" wasn\'t coined until 1967 by physicist John Wheeler.' },
          { type: 'quote', content: '"Black holes are where God divided by zero." — Steven Wright (humorously capturing their mathematical strangeness)' }
        ]
      },
      {
        id: 'bh-formation',
        title: 'How Black Holes Form',
        estimatedMinutes: 10,
        content: [
          { type: 'text', content: 'Stellar black holes form when massive stars (at least 20-25 times the mass of our Sun) die. When such a star exhausts its nuclear fuel, it can no longer support itself against gravity and collapses catastrophically.' },
          { type: 'timeline', content: 'Star Death → Core Collapse (milliseconds) → Supernova Explosion → Black Hole (if core > 3 solar masses) or Neutron Star (if core < 3 solar masses)' },
          { type: 'text', content: 'The collapse happens incredibly fast. The core of a dying star can go from the size of Earth to a singularity in less than a second. The outer layers are blasted away in a supernova explosion that can briefly outshine an entire galaxy.' },
          { type: 'fact', content: 'Supermassive black holes at galaxy centers didn\'t form from stellar collapse. How they grew so large (millions to billions of solar masses) so early in the universe is one of astronomy\'s biggest mysteries.' }
        ]
      },
      {
        id: 'bh-anatomy',
        title: 'Anatomy of a Black Hole',
        estimatedMinutes: 12,
        content: [
          { type: 'text', content: 'A black hole has several key regions, each with fascinating properties:' },
          { type: 'text', content: '**The Singularity**: At the very center lies the singularity — a point of theoretically infinite density where our current physics breaks down. Whether singularities actually exist or are replaced by something else (perhaps quantum effects) remains unknown.' },
          { type: 'text', content: '**The Event Horizon**: This is the "point of no return" — the boundary beyond which escape is impossible. It\'s not a physical surface; you could cross it without noticing (though you\'d never return). For a black hole the mass of our Sun, the event horizon would be about 6 km across.' },
          { type: 'fact', content: 'At the event horizon, time appears to stop for an outside observer. If you watched someone fall in, you\'d see them slow down and fade to red, frozen at the edge forever (due to extreme gravitational time dilation and redshift).' },
          { type: 'text', content: '**The Photon Sphere**: Just outside the event horizon (at 1.5 times its radius) is a region where light can orbit the black hole. If you stood here and looked straight ahead, you\'d see the back of your own head.' },
          { type: 'text', content: '**The Accretion Disk**: Matter falling toward a black hole forms a swirling disk of superheated gas. Friction heats this material to millions of degrees, making it glow brightly in X-rays. This is how we detect most black holes.' }
        ]
      },
      {
        id: 'bh-types',
        title: 'Types of Black Holes',
        estimatedMinutes: 10,
        content: [
          { type: 'text', content: 'Black holes come in different sizes, and the differences are dramatic:' },
          { type: 'text', content: '**Stellar Black Holes** (3-100 solar masses): Formed from collapsed stars. The Milky Way contains an estimated 100 million of these. The first ever detected, Cygnus X-1, is about 21 solar masses.' },
          { type: 'text', content: '**Intermediate Black Holes** (100-100,000 solar masses): The "missing link" — we\'ve only recently found convincing evidence they exist. They may form in dense star clusters through stellar mergers.' },
          { type: 'text', content: '**Supermassive Black Holes** (millions to billions of solar masses): Found at the centers of most large galaxies. Sagittarius A*, at the center of our Milky Way, is 4 million solar masses. M87\'s black hole (the first ever photographed) is 6.5 billion solar masses.' },
          { type: 'comparison', content: 'If Sagittarius A* were placed at the Sun\'s location, its event horizon would extend to about 12 million km — about 8% of Earth\'s orbital distance. M87\'s black hole would extend past Pluto\'s orbit.' },
          { type: 'fact', content: 'The largest known black hole, TON 618, has an estimated mass of 66 billion solar masses. Its event horizon is larger than our entire Solar System.' }
        ]
      },
      {
        id: 'bh-hawking',
        title: 'Hawking Radiation and Black Hole Evaporation',
        estimatedMinutes: 10,
        content: [
          { type: 'text', content: 'In 1974, Stephen Hawking made a revolutionary discovery: black holes aren\'t completely black. They emit radiation and slowly evaporate over time. This "Hawking radiation" arises from quantum effects near the event horizon.' },
          { type: 'text', content: 'The mechanism involves virtual particle pairs that constantly pop in and out of existence in empty space. Near the event horizon, one particle can fall in while the other escapes. The escaping particles appear as radiation coming from the black hole.' },
          { type: 'fact', content: 'Smaller black holes evaporate faster. A stellar black hole would take 10^67 years to evaporate — far longer than the current age of the universe (13.8 billion years). A black hole the mass of a mountain would evaporate in about a second.' },
          { type: 'text', content: 'This creates the famous "information paradox": if black holes evaporate completely, what happens to the information about everything that fell in? Does it disappear forever (violating quantum mechanics) or is it somehow preserved? This remains one of the biggest unsolved problems in physics.' }
        ]
      },
      {
        id: 'bh-detection',
        title: 'How We Detect Black Holes',
        estimatedMinutes: 10,
        content: [
          { type: 'text', content: 'Since black holes don\'t emit light, we detect them through their effects on surrounding matter and spacetime:' },
          { type: 'text', content: '**X-ray Emissions**: Gas falling into a black hole heats up and emits X-rays. X-ray telescopes like Chandra have revealed thousands of black holes this way.' },
          { type: 'text', content: '**Stellar Orbits**: By watching stars orbit invisible objects, we can calculate the object\'s mass. Stars at the Milky Way\'s center orbit Sagittarius A* at up to 3% the speed of light.' },
          { type: 'text', content: '**Gravitational Waves**: When black holes merge, they create ripples in spacetime. LIGO first detected these in 2015, confirming Einstein\'s century-old prediction and opening a new window on the universe.' },
          { type: 'text', content: '**Direct Imaging**: In 2019, the Event Horizon Telescope captured the first image of a black hole\'s shadow — the supermassive black hole in galaxy M87. In 2022, they imaged Sagittarius A*, our own galactic center black hole.' },
          { type: 'fact', content: 'The Event Horizon Telescope is actually a network of radio telescopes around the world, working together as one Earth-sized virtual telescope. This technique, called very-long-baseline interferometry, achieves the resolution needed to see black hole shadows.' }
        ]
      }
    ]
  },
  {
    id: 'mars-exploration',
    title: 'Mars: Past, Present, and Future',
    description: 'From ancient observations to the 2026 missions — the complete story of humanity\'s journey to Mars.',
    icon: '🔴',
    difficulty: 'beginner',
    estimatedMinutes: 50,
    sections: [
      {
        id: 'mars-intro',
        title: 'Mars: The Red Planet',
        estimatedMinutes: 6,
        content: [
          { type: 'text', content: 'Mars has captivated human imagination for millennia. Named after the Roman god of war for its blood-red appearance, Mars is now the most explored planet beyond Earth — and our best candidate for future human settlement.' },
          { type: 'fact', content: 'Mars appears red because its surface is covered in iron oxide (rust). Billions of years ago, the iron on Mars oxidized, creating the distinctive color visible even to the naked eye.' },
          { type: 'text', content: 'Mars is about half the size of Earth and has 38% of Earth\'s gravity. A 100 kg person would weigh only 38 kg on Mars. The planet has seasons, ice caps, and a 24.6-hour day — remarkably similar to Earth\'s.' },
          { type: 'comparison', content: 'A year on Mars lasts 687 Earth days (nearly two Earth years). If you were 30 Earth years old, you\'d only be about 16 Mars years old.' }
        ]
      },
      {
        id: 'mars-water',
        title: 'Water on Mars: A Wet History',
        estimatedMinutes: 8,
        content: [
          { type: 'text', content: 'Evidence is overwhelming that Mars once had abundant liquid water. River valleys, lake beds, and mineral deposits all point to a wetter past — perhaps 3.5 to 4 billion years ago.' },
          { type: 'fact', content: 'Mars may have had an ocean covering up to one-third of its surface. This "Oceanus Borealis" would have contained more water than the Arctic Ocean.' },
          { type: 'text', content: 'Today, most of Mars\'s water is locked in polar ice caps and underground. The southern polar cap contains enough water ice that, if melted, it could cover the entire planet in an 11-meter-deep ocean.' },
          { type: 'text', content: 'In 2018, radar data from the Mars Express orbiter suggested a liquid water lake may exist under the south polar ice cap, about 1.5 km beneath the surface. If confirmed, this would be the first known stable body of liquid water on Mars.' },
          { type: 'quote', content: '"Follow the water" has been NASA\'s guiding principle for Mars exploration. Where there was water, there may have been life.' }
        ]
      },
      {
        id: 'mars-missions-past',
        title: 'Mars Missions: The Journey So Far',
        estimatedMinutes: 10,
        content: [
          { type: 'text', content: 'Humanity has sent over 50 missions to Mars, with about half succeeding. Each successful mission has revolutionized our understanding of the Red Planet.' },
          { type: 'timeline', content: '1965: Mariner 4 (first flyby) → 1971: Mariner 9 (first orbiter) → 1976: Viking 1 & 2 (first landers) → 1997: Pathfinder/Sojourner (first rover) → 2004: Spirit & Opportunity → 2012: Curiosity → 2021: Perseverance & Ingenuity' },
          { type: 'text', content: 'The Viking landers in 1976 conducted the first experiments searching for life on Mars. The results were ambiguous and remain debated today — some scientists believe the tests may have detected microbial activity.' },
          { type: 'fact', content: 'The Opportunity rover was designed for a 90-day mission. It exceeded that by 5,111 days, operating for over 14 years before a global dust storm ended its mission in 2018. It traveled 45 km across Mars.' },
          { type: 'text', content: 'Perseverance, which landed in 2021, is currently exploring Jezero Crater — an ancient lake bed. It\'s collecting rock samples that will be the first ever returned from Mars to Earth.' },
          { type: 'fact', content: 'Ingenuity, the helicopter that accompanied Perseverance, was designed for 5 test flights. It completed over 70 flights before its rotor was damaged, proving powered flight is possible in Mars\'s thin atmosphere.' }
        ]
      },
      {
        id: 'mars-2026',
        title: 'Mars 2026: What\'s Coming',
        estimatedMinutes: 10,
        content: [
          { type: 'text', content: 'The year 2026 marks a crucial launch window for Mars missions. Several space agencies and private companies are planning ambitious ventures.' },
          { type: 'text', content: '**Mars Sample Return (NASA/ESA)**: The most ambitious robotic mission ever attempted. A spacecraft will land on Mars, rendezvous with the samples Perseverance collected, launch them into orbit, then return them to Earth by 2033.' },
          { type: 'fact', content: 'Mars Sample Return will be the first mission to ever launch from another planet and return material to Earth. The samples could contain evidence of ancient Martian life.' },
          { type: 'text', content: '**SpaceX Starship**: SpaceX aims to launch uncrewed Starship missions to Mars around 2026-2028. These missions would test landing technologies and potentially deliver supplies for future human missions.' },
          { type: 'text', content: '**International Mars Ice Mapper**: A proposed orbiter mission (NASA, ESA, JAXA, CSA) to map water ice deposits near the Martian surface — crucial information for selecting human landing sites.' },
          { type: 'text', content: '**China\'s Mars Sample Return**: China is developing its own sample return mission, potentially launching around 2028-2030, which could return samples before the NASA/ESA mission.' }
        ]
      },
      {
        id: 'mars-humans',
        title: 'Humans on Mars: The Challenges',
        estimatedMinutes: 10,
        content: [
          { type: 'text', content: 'Sending humans to Mars is the greatest challenge in the history of exploration. The journey takes 6-9 months each way, and astronauts would face numerous dangers:' },
          { type: 'text', content: '**Radiation**: Beyond Earth\'s magnetic field, astronauts are exposed to solar radiation and cosmic rays. A round trip to Mars would expose astronauts to roughly the same radiation as a nuclear power plant worker receives over an entire career.' },
          { type: 'text', content: '**Muscle and Bone Loss**: In microgravity, astronauts lose about 1-2% of bone density per month. Exercise helps, but long-duration space travel still causes significant physical changes.' },
          { type: 'text', content: '**Psychological Stress**: Isolation, confinement, and the distance from Earth (up to 20 minutes for radio signals) create unique psychological challenges. Once on Mars, astronauts would be truly on their own.' },
          { type: 'fact', content: 'The first humans on Mars will be farther from Earth than any human has ever been. At its farthest, Mars is 401 million km away — a distance so great that real-time communication is impossible.' },
          { type: 'text', content: '**Surface Challenges**: Mars has no breathable atmosphere, extreme cold (-60°C average), dust storms that can last months, and toxic soil containing perchlorates. Every aspect of survival will require technology.' },
          { type: 'quote', content: '"Going to Mars is hard. It\'s incredibly hard. It\'s the hardest thing humans have ever tried to do. And that\'s exactly why we have to do it." — Mars exploration advocate' }
        ]
      },
      {
        id: 'mars-future',
        title: 'The Future: Colonizing Mars',
        estimatedMinutes: 6,
        content: [
          { type: 'text', content: 'Many visionaries believe Mars will eventually become humanity\'s second home. Plans range from scientific outposts to fully terraformed worlds.' },
          { type: 'text', content: 'In the near term (2030s-2040s), we\'ll likely see small research bases similar to Antarctic stations. These would be largely self-sufficient, using local resources like water ice and producing oxygen from CO2.' },
          { type: 'text', content: 'Long-term terraforming — making Mars Earth-like — would take centuries or millennia. Ideas include releasing greenhouse gases to warm the planet, importing comets for water, and using genetically engineered organisms to produce oxygen.' },
          { type: 'fact', content: 'Elon Musk\'s stated goal is to establish a self-sustaining city of 1 million people on Mars. Whether or not this timeline is realistic, it represents a new era of bold thinking about humanity\'s future in space.' },
          { type: 'text', content: 'The question isn\'t whether humans will go to Mars, but when and how. The Red Planet awaits, and we are the generation that will take the first steps toward making it our second world.' }
        ]
      }
    ]
  },
  {
    id: 'stars-lifecycle',
    title: 'The Life and Death of Stars',
    description: 'From stellar nurseries to supernovae — the complete journey of how stars are born, live, and die.',
    icon: '⭐',
    difficulty: 'intermediate',
    estimatedMinutes: 55,
    sections: [
      {
        id: 'stars-birth',
        title: 'Stellar Nurseries: Where Stars Are Born',
        estimatedMinutes: 10,
        content: [
          { type: 'text', content: 'Stars are born in vast clouds of gas and dust called nebulae. These stellar nurseries can span hundreds of light-years and contain enough material to form thousands of stars.' },
          { type: 'fact', content: 'The Orion Nebula, visible to the naked eye as a fuzzy patch in Orion\'s sword, is actively forming stars right now. It\'s about 1,344 light-years away and 24 light-years across.' },
          { type: 'text', content: 'Star formation begins when a region of a nebula becomes dense enough to collapse under its own gravity. This can be triggered by shockwaves from nearby supernovae, collisions between gas clouds, or density waves in spiral galaxies.' },
          { type: 'text', content: 'As the cloud collapses, it fragments into smaller clumps, each destined to become a star. The collapsing material heats up, and at the center, a protostar forms — glowing from gravitational energy but not yet producing nuclear fusion.' },
          { type: 'timeline', content: 'Molecular Cloud → Collapse (100,000 years) → Protostar (500,000 years) → T Tauri Star (10 million years) → Main Sequence Star' }
        ]
      },
      {
        id: 'stars-main',
        title: 'Main Sequence: The Prime of Life',
        estimatedMinutes: 12,
        content: [
          { type: 'text', content: 'When a protostar\'s core reaches about 10 million degrees, hydrogen fusion ignites. The star joins the "main sequence" — the stable phase where it will spend most of its life, balancing gravity against the outward pressure of fusion.' },
          { type: 'text', content: 'Stars come in a stunning range of sizes and colors. The smallest red dwarfs are about 8% the Sun\'s mass (any smaller and fusion can\'t sustain). The largest blue giants can be 100+ solar masses and millions of times brighter.' },
          { type: 'comparison', content: 'A red dwarf like Proxima Centauri will live for trillions of years — longer than the current age of the universe. A massive blue giant like Betelgeuse will exhaust its fuel in just a few million years.' },
          { type: 'fact', content: 'Our Sun is middle-aged. At 4.6 billion years old, it\'s about halfway through its 10-billion-year main sequence life. It will remain stable for another 5 billion years.' },
          { type: 'text', content: 'Stellar colors indicate temperature: red stars are coolest (~3,000K), yellow stars like our Sun are medium (~5,800K), and blue stars are hottest (~30,000K+). Paradoxically, "red hot" in everyday language describes cool stars, while "blue" stars are actually the hottest.' }
        ]
      },
      {
        id: 'stars-death-small',
        title: 'Gentle Endings: How Small Stars Die',
        estimatedMinutes: 10,
        content: [
          { type: 'text', content: 'Stars like our Sun die gradually over hundreds of millions of years. When hydrogen in the core runs out, the core contracts while the outer layers expand, creating a red giant.' },
          { type: 'fact', content: 'When our Sun becomes a red giant in about 5 billion years, it will expand to engulf Mercury and Venus. Earth will either be swallowed or scorched to a cinder — either way, life here ends.' },
          { type: 'text', content: 'The red giant phase is unstable. The star pulses, and its outer layers are gradually shed, creating a beautiful planetary nebula. The exposed core remains as a white dwarf — an Earth-sized object with the mass of the Sun.' },
          { type: 'text', content: 'White dwarfs are incredibly dense. A teaspoon of white dwarf material would weigh about 5 tons on Earth. With no fusion to sustain them, they slowly cool over billions of years, eventually becoming hypothetical "black dwarfs."' },
          { type: 'fact', content: 'No black dwarfs exist yet — the universe isn\'t old enough. A white dwarf takes longer than 13.8 billion years (the age of the universe) to cool completely.' }
        ]
      },
      {
        id: 'stars-death-massive',
        title: 'Violent Endings: Supernovae and Beyond',
        estimatedMinutes: 15,
        content: [
          { type: 'text', content: 'Massive stars (8+ solar masses) die spectacularly. They race through their fuel, fusing heavier and heavier elements: helium, carbon, oxygen, silicon. But when they start fusing iron, they\'re doomed.' },
          { type: 'fact', content: 'Iron fusion consumes energy instead of releasing it. Once a star develops an iron core, collapse is inevitable — and it happens in less than a second.' },
          { type: 'text', content: 'The core collapse is catastrophic. The outer layers fall inward at 23% the speed of light, hit the incompressible core, and bounce back as a supernova shock wave. The explosion briefly outshines billions of stars.' },
          { type: 'text', content: 'In that moment, conditions are extreme enough to forge elements heavier than iron — gold, uranium, platinum. Nearly every heavy element on Earth was created in the death throes of massive stars.' },
          { type: 'quote', content: '"We are made of star stuff." — Carl Sagan, referring to the stellar origins of the atoms in our bodies' },
          { type: 'text', content: 'What\'s left behind depends on the original star\'s mass. Stars 8-25 solar masses leave neutron stars — city-sized objects with the mass of the Sun, so dense that a sugar-cube-sized piece would weigh a billion tons. Stars above 25 solar masses collapse directly into black holes.' },
          { type: 'fact', content: 'Neutron stars spin incredibly fast — some rotate hundreds of times per second. If they emit beams of radiation that sweep past Earth, we see them as pulsars — cosmic lighthouses.' }
        ]
      },
      {
        id: 'stars-elements',
        title: 'Cosmic Alchemy: How Stars Made Everything',
        estimatedMinutes: 8,
        content: [
          { type: 'text', content: 'Almost everything you see, touch, and are is stardust. Hydrogen and helium came from the Big Bang, but carbon, oxygen, nitrogen, iron — the stuff of life and worlds — was forged inside stars.' },
          { type: 'text', content: 'Small stars make carbon, nitrogen, and oxygen. Massive stars add silicon, sulfur, and iron. Supernovae and neutron star mergers create gold, platinum, and uranium.' },
          { type: 'fact', content: 'The gold in your jewelry came from neutron star collisions. These rare events, called kilonovae, are the universe\'s only known significant source of the heaviest elements.' },
          { type: 'text', content: 'This process took time. The first stars, formed 200-400 million years after the Big Bang, contained only hydrogen and helium. It took generations of stellar deaths to enrich the universe with heavy elements.' },
          { type: 'text', content: 'Our Solar System formed from the debris of previous stellar generations. The Sun is a "third-generation" star, containing elements from many ancestral stars that lived and died before it was born.' }
        ]
      }
    ]
  }
]

// ============================================================================
// Chapter Access
// ============================================================================

export function getChapter(id: string): Chapter | undefined {
  return CHAPTERS.find(c => c.id === id)
}

export function getAllChapters(): Chapter[] {
  return CHAPTERS
}

export function getChaptersByDifficulty(difficulty: Chapter['difficulty']): Chapter[] {
  return CHAPTERS.filter(c => c.difficulty === difficulty)
}

export function getTotalReadingTime(): number {
  return CHAPTERS.reduce((sum, c) => sum + c.estimatedMinutes, 0)
}
