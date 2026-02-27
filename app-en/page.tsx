import Link from 'next/link'
import Image from 'next/image'
import DidYouKnow from '@/components/DidYouKnow'
import MissionCard from '@/components/MissionCard'
import FactCard from '@/components/FactCard'
import ImmersiveEntry from '@/components/ImmersiveEntry'
import HeroOverlay from '@/components/HeroOverlay'
import HeroCinematicOverlay from '@/components/HeroCinematicOverlay'
import Starfield from '@/components/Starfield'
import SectionSeparator from '@/components/SectionSeparator'
import ExploreStats from '@/components/ExploreStats'
import { preloadHeroImage, shouldLazyLoad, getImagePriority, getImageSizes } from '@/utils/perf'
import { getButtonAriaLabel } from '@/utils/aria'

export default function Home() {
  // Preload hero images for faster initial render
  if (typeof window !== 'undefined') {
    // Preload first portal image as it's likely above the fold
    preloadHeroImage('https://images-assets.nasa.gov/image/PIA01341/PIA01341~orig.jpg')
  }

  const didYouKnowFacts = [
    "A day on Venus is longer than its year! Venus rotates so slowly that it takes 243 Earth days to complete one rotation, but only 225 Earth days to orbit the Sun.",
    "There are more stars in the universe than grains of sand on all the beaches on Earth. Astronomers estimate there are 100 billion galaxies, each with billions of stars.",
    "If you could drive a car to the Sun at highway speeds (60 mph), it would take over 177 years to get there. But light makes the journey in just 8 minutes!",
    "Jupiter's Great Red Spot is a storm larger than Earth that has been raging for at least 400 years. It's shrinking but still massive enough to swallow our planet whole.",
    "A teaspoon of neutron star material would weigh 6 billion tons on Earth - that's as heavy as Mount Everest!",
    "The International Space Station travels at 17,500 mph, completing an orbit around Earth every 90 minutes. Astronauts see 16 sunrises and sunsets every day!",
  ]

  const featuredPortals = [
    {
      title: 'Solar System',
      description: 'Journey through our cosmic neighborhood',
      image: 'https://images-assets.nasa.gov/image/PIA01341/PIA01341~orig.jpg',
      href: '/solar-system',
      gradient: 'from-yellow-500 via-orange-500 to-red-500',
      icon: '🪐'
    },
    {
      title: 'Galaxies',
      description: 'Explore island universes across the cosmos',
      image: 'https://images-assets.nasa.gov/image/PIA03149/PIA03149~orig.jpg',
      href: '/galaxies',
      gradient: 'from-purple-500 via-pink-500 to-fuchsia-500',
      icon: '🌌'
    },
    {
      title: 'Black Holes',
      description: 'Discover the ultimate cosmic mystery',
      image: 'https://images-assets.nasa.gov/image/black-hole-image-nasa_gsfc_20190410_archive_e000190/black-hole-image-nasa_gsfc_20190410_archive_e000190~orig.jpg',
      href: '/black-holes',
      gradient: 'from-gray-800 via-gray-900 to-black',
      icon: '🕳️'
    },
    {
      title: 'Space Missions',
      description: 'Follow humanity\'s journey to the stars',
      image: 'https://images-assets.nasa.gov/image/iss050e043303/iss050e043303~orig.jpg',
      href: '/missions',
      gradient: 'from-blue-500 via-cyan-500 to-teal-500',
      icon: '🚀'
    },
    {
      title: 'Nebulae',
      description: 'Witness cosmic clouds of creation',
      image: 'https://images-assets.nasa.gov/image/PIA04591/PIA04591~orig.jpg',
      href: '/nebulae',
      gradient: 'from-pink-500 via-rose-500 to-purple-500',
      icon: '🌫️'
    },
    {
      title: 'Exoplanets',
      description: 'Worlds beyond our solar system',
      image: 'https://images-assets.nasa.gov/image/PIA22093/PIA22093~orig.jpg',
      href: '/exoplanets',
      gradient: 'from-indigo-500 via-purple-500 to-pink-500',
      icon: '🪐'
    }
  ]

  const quickFacts = [
    { fact: "The Sun contains 99.86% of the Solar System's mass", icon: "☀️" },
    { fact: "One light-year equals about 5.88 trillion miles", icon: "💫" },
    { fact: "Mars has the largest volcano in the Solar System: Olympus Mons", icon: "🔴" },
    { fact: "Saturn's moon Titan has lakes and rivers of liquid methane", icon: "🪐" },
  ]

  const featuredMissions = [
    {
      name: 'James Webb Space Telescope',
      agency: 'NASA/ESA/CSA',
      year: '2021',
      description: 'The most powerful space telescope ever built, revealing the early universe and distant exoplanets.',
      image: 'https://images-assets.nasa.gov/image/webbfirstimages_001_gsfc_20220711_archive_e001435/webbfirstimages_001_gsfc_20220711_archive_e001435~orig.jpg',
      status: 'active' as const,
      link: '/telescopes'
    },
    {
      name: 'Perseverance Rover',
      agency: 'NASA',
      year: '2021',
      description: 'Searching for signs of ancient life on Mars and collecting samples for future return to Earth.',
      image: 'https://images-assets.nasa.gov/image/PIA24542/PIA24542~orig.jpg',
      status: 'active' as const,
      link: '/mars'
    },
    {
      name: 'Artemis Program',
      agency: 'NASA',
      year: '2025',
      description: 'Returning humans to the Moon and establishing a sustainable lunar presence.',
      image: 'https://images-assets.nasa.gov/image/artemis-1-orion-flight-test_gsfc_20221116_archive_e001435/artemis-1-orion-flight-test_gsfc_20221116_archive_e001435~orig.jpg',
      status: 'planned' as const,
      link: '/future-missions'
    },
  ]

  const allPages = [
    // Solar System
    { name: 'Solar System', href: '/solar-system', category: 'Solar System', summary: 'Explore our cosmic neighborhood - the Sun, planets, moons, asteroids, and comets that make up our home in space.', image: 'https://images-assets.nasa.gov/image/PIA01341/PIA01341~orig.jpg' },
    { name: 'Planets', href: '/planets', category: 'Solar System', summary: 'Discover all eight planets in our Solar System, from rocky Mercury to icy Neptune, each with unique characteristics.', image: 'https://images-assets.nasa.gov/image/PIA03149/PIA03149~orig.jpg' },
    { name: 'The Sun', href: '/sun', category: 'Solar System', summary: 'Our life-giving star - learn about solar activity, fusion, sunspots, and how the Sun powers our Solar System.', image: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000136/GSFC_20171208_Archive_e000136~orig.jpg' },
    { name: 'Mercury', href: '/mercury', category: 'Planets', summary: 'The smallest and closest planet to the Sun, with extreme temperature swings and a heavily cratered surface.', image: 'https://images-assets.nasa.gov/image/PIA16853/PIA16853~orig.jpg' },
    { name: 'Venus', href: '/venus', category: 'Planets', summary: 'The hottest planet with a thick, toxic atmosphere and surface temperatures hot enough to melt lead.', image: 'https://images-assets.nasa.gov/image/PIA00271/PIA00271~orig.jpg' },
    { name: 'Earth', href: '/earth', category: 'Planets', summary: 'Our beautiful blue planet - the only known world with life, oceans, and a protective atmosphere.', image: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000273/GSFC_20171208_Archive_e000273~orig.jpg' },
    { name: 'Mars', href: '/mars', category: 'Planets', summary: 'The Red Planet - explore ancient river valleys, massive volcanoes, and the search for past or present life.', image: 'https://images-assets.nasa.gov/image/PIA04591/PIA04591~orig.jpg' },
    { name: 'Jupiter', href: '/jupiter', category: 'Planets', summary: 'The largest planet - a gas giant with a Great Red Spot storm and over 90 moons including Europa and Ganymede.', image: 'https://images-assets.nasa.gov/image/PIA02873/PIA02873~orig.jpg' },
    { name: 'Saturn', href: '/saturn', category: 'Planets', summary: 'The ringed planet - famous for its spectacular ring system and moon Titan with lakes of liquid methane.', image: 'https://images-assets.nasa.gov/image/PIA06193/PIA06193~orig.jpg' },
    { name: 'Uranus', href: '/uranus', category: 'Planets', summary: 'An ice giant tilted on its side, with a unique blue-green color and extreme seasons lasting decades.', image: 'https://images-assets.nasa.gov/image/PIA18182/PIA18182~orig.jpg' },
    { name: 'Neptune', href: '/neptune', category: 'Planets', summary: 'The windiest planet with supersonic storms and the most distant planet from the Sun in our Solar System.', image: 'https://images-assets.nasa.gov/image/PIA01492/PIA01492~orig.jpg' },
    { name: 'Pluto', href: '/pluto', category: 'Dwarf Planets', summary: 'A dwarf planet in the Kuiper Belt with a heart-shaped glacier and five moons including Charon.', image: 'https://images-assets.nasa.gov/image/PIA19952/PIA19952~orig.jpg' },
    { name: 'Moon', href: '/moon', category: 'Solar System', summary: 'Earth\'s natural satellite - explore lunar phases, craters, and humanity\'s first steps beyond Earth.', image: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000136/GSFC_20171208_Archive_e000136~orig.jpg' },
    { name: 'Moon Phases', href: '/moon-phases', category: 'Solar System', summary: 'Understand the lunar cycle - from new moon to full moon and how the Moon\'s appearance changes.', image: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001136/GSFC_20171208_Archive_e001136~orig.jpg' },
    { name: 'Asteroids', href: '/asteroids', category: 'Solar System', summary: 'Rocky remnants from the early Solar System - learn about near-Earth asteroids and their impact on our planet.', image: 'https://images-assets.nasa.gov/image/PIA19056/PIA19056~orig.jpg' },
    { name: 'Asteroid Belt', href: '/asteroid-belt', category: 'Solar System', summary: 'The region between Mars and Jupiter containing millions of asteroids and dwarf planet Ceres.', image: 'https://images-assets.nasa.gov/image/PIA19185/PIA19185~orig.jpg' },
    { name: 'Comets', href: '/comets', category: 'Solar System', summary: 'Icy visitors from the outer Solar System - discover their spectacular tails and role in delivering water to Earth.', image: 'https://images-assets.nasa.gov/image/PIA18866/PIA18866~orig.jpg' },
    { name: 'Kuiper Belt', href: '/kuiper-belt', category: 'Solar System', summary: 'A region beyond Neptune filled with icy objects, dwarf planets, and remnants from the Solar System\'s formation.', image: 'https://images-assets.nasa.gov/image/PIA19056/PIA19056~orig.jpg' },
    { name: 'Oort Cloud', href: '/oort-cloud', category: 'Solar System', summary: 'The most distant region of our Solar System - a spherical shell of icy objects surrounding the Sun.', image: 'https://images-assets.nasa.gov/image/PIA19952/PIA19952~orig.jpg' },
    { name: 'Habitable Zone', href: '/habitable-zone', category: 'Exoplanets', summary: 'The "Goldilocks zone" where conditions might be just right for liquid water and potentially life.', image: 'https://images-assets.nasa.gov/image/PIA22093/PIA22093~orig.jpg' },
    
    // Stars & Stellar Objects
    { name: 'Stars', href: '/stars', category: 'Stars & Stellar Objects', summary: 'The building blocks of galaxies - learn about star formation, life cycles, and different types of stars.', image: 'https://images-assets.nasa.gov/image/PIA01341/PIA01341~orig.jpg' },
    { name: 'Pulsars', href: '/pulsars', category: 'Stars & Stellar Objects', summary: 'Rapidly rotating neutron stars that emit beams of radiation like cosmic lighthouses.', image: 'https://images-assets.nasa.gov/image/PIA04591/PIA04591~orig.jpg' },
    { name: 'Quasars', href: '/quasars', category: 'Stars & Stellar Objects', summary: 'The most luminous objects in the universe - supermassive black holes powering distant galaxies.', image: 'https://images-assets.nasa.gov/image/PIA22093/PIA22093~orig.jpg' },
    { name: 'Supernovae', href: '/supernovae', category: 'Stars & Stellar Objects', summary: 'The explosive death of massive stars - creating elements essential for life and seeding the universe.', image: 'https://images-assets.nasa.gov/image/PIA03149/PIA03149~orig.jpg' },
    { name: 'Neutron Stars', href: '/neutron-stars', category: 'Stars & Stellar Objects', summary: 'Ultra-dense stellar remnants where a teaspoon of material would weigh billions of tons.', image: 'https://images-assets.nasa.gov/image/PIA02873/PIA02873~orig.jpg' },
    { name: 'White Dwarfs', href: '/white-dwarfs', category: 'Stars & Stellar Objects', summary: 'The final stage of Sun-like stars - dense, hot cores that slowly cool over billions of years.', image: 'https://images-assets.nasa.gov/image/PIA06193/PIA06193~orig.jpg' },
    { name: 'Red Giants', href: '/red-giants', category: 'Stars & Stellar Objects', summary: 'Evolved stars that have expanded to enormous sizes, including our Sun\'s future fate.', image: 'https://images-assets.nasa.gov/image/PIA18182/PIA18182~orig.jpg' },
    { name: 'Protostars', href: '/protostars', category: 'Stars & Stellar Objects', summary: 'Stars in the making - young stellar objects still gathering mass from their birth clouds.', image: 'https://images-assets.nasa.gov/image/PIA01492/PIA01492~orig.jpg' },
    { name: 'Brown Dwarfs', href: '/brown-dwarfs', category: 'Stars & Stellar Objects', summary: 'Failed stars that are too small to sustain fusion - objects between planets and stars.', image: 'https://images-assets.nasa.gov/image/PIA19952/PIA19952~orig.jpg' },
    { name: 'Star Clusters', href: '/star-clusters', category: 'Stars & Stellar Objects', summary: 'Groups of stars born together - from open clusters to ancient globular clusters.', image: 'https://images-assets.nasa.gov/image/PIA19056/PIA19056~orig.jpg' },
    
    // Galaxies
    { name: 'Galaxies', href: '/galaxies', category: 'Galaxies', summary: 'Island universes containing billions of stars - explore spiral, elliptical, and irregular galaxies.', image: 'https://images-assets.nasa.gov/image/PIA01341/PIA01341~orig.jpg' },
    
    // Cosmic Phenomena
    { name: 'Black Holes', href: '/black-holes', category: 'Cosmic Phenomena', summary: 'Regions of spacetime where gravity is so strong that nothing, not even light, can escape.', image: 'https://images-assets.nasa.gov/image/black-hole-image-nasa_gsfc_20190410_archive_e000190/black-hole-image-nasa_gsfc_20190410_archive_e000190~orig.jpg' },
    { name: 'Nebulae', href: '/nebulae', category: 'Cosmic Phenomena', summary: 'Cosmic clouds of gas and dust - stellar nurseries and remnants of dying stars.', image: 'https://images-assets.nasa.gov/image/PIA03149/PIA03149~orig.jpg' },
    { name: 'Solar Wind', href: '/solar-wind', category: 'Space Phenomena', summary: 'Streams of charged particles from the Sun that create auroras and affect space weather.', image: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000275/GSFC_20171208_Archive_e000275~orig.jpg' },
    { name: 'Cosmic Rays', href: '/cosmic-rays', category: 'Space Phenomena', summary: 'High-energy particles from space that constantly bombard Earth and affect our atmosphere.', image: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000276/GSFC_20171208_Archive_e000276~orig.jpg' },
    { name: 'Solar Flares', href: '/solar-flares', category: 'Space Phenomena', summary: 'Explosive releases of energy from the Sun that can disrupt communications and power grids.', image: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000277/GSFC_20171208_Archive_e000277~orig.jpg' },
    { name: 'Coronal Mass Ejections', href: '/coronal-mass-ejections', category: 'Space Phenomena', summary: 'Massive eruptions of solar material that can create spectacular auroras and geomagnetic storms.', image: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000278/GSFC_20171208_Archive_e000278~orig.jpg' },
    { name: 'Interstellar Medium', href: '/interstellar-medium', category: 'Space Phenomena', summary: 'The matter and radiation that exists in the space between star systems in a galaxy.', image: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000279/GSFC_20171208_Archive_e000279~orig.jpg' },
    { name: 'Space Weather', href: '/space-weather', category: 'Space Phenomena', summary: 'Conditions in space that affect Earth and human technology - from solar storms to cosmic radiation.', image: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000280/GSFC_20171208_Archive_e000280~orig.jpg' },
    { name: 'Space Debris', href: '/space-debris', category: 'Space Phenomena', summary: 'Human-made objects orbiting Earth - from defunct satellites to rocket stages and their impact on space exploration.', image: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000281/GSFC_20171208_Archive_e000281~orig.jpg' },
    
    // Space Exploration
    { name: 'Missions', href: '/missions', category: 'Space Exploration', summary: 'Humanity\'s greatest space missions - from Apollo to Mars rovers and beyond.', image: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000282/GSFC_20171208_Archive_e000282~orig.jpg' },
    { name: 'Astronauts', href: '/astronauts', category: 'Space Exploration', summary: 'The brave men and women who venture into space, pushing the boundaries of human exploration.', image: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000283/GSFC_20171208_Archive_e000283~orig.jpg' },
    { name: 'Telescopes', href: '/telescopes', category: 'Space Exploration', summary: 'From ground-based observatories to space telescopes like Hubble and James Webb - our windows to the universe.', image: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000284/GSFC_20171208_Archive_e000284~orig.jpg' },
    { name: 'Space Stations', href: '/space-stations', category: 'Space Exploration', summary: 'Orbiting laboratories like the ISS where astronauts live and work in space.', image: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000285/GSFC_20171208_Archive_e000285~orig.jpg' },
    { name: 'Space History', href: '/space-history', category: 'Space Exploration', summary: 'The incredible journey of space exploration from Sputnik to modern missions.', image: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000286/GSFC_20171208_Archive_e000286~orig.jpg' },
    { name: 'Future Missions', href: '/future-missions', category: 'Space Exploration', summary: 'Upcoming missions to the Moon, Mars, and beyond - humanity\'s next steps in space.', image: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000287/GSFC_20171208_Archive_e000287~orig.jpg' },
    { name: 'Space Technology', href: '/space-technology', category: 'Space Exploration', summary: 'Innovations that enable space exploration - from rockets to life support systems.', image: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000288/GSFC_20171208_Archive_e000288~orig.jpg' },
    { name: 'Life in Space', href: '/life-in-space', category: 'Space Exploration', summary: 'How humans adapt to living in space - from microgravity effects to space habitats.', image: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000289/GSFC_20171208_Archive_e000289~orig.jpg' },
    
    // Exoplanets
    { name: 'Exoplanets', href: '/exoplanets', category: 'Exoplanets', summary: 'Planets orbiting other stars - thousands discovered, some potentially habitable.', image: 'https://images-assets.nasa.gov/image/PIA22093/PIA22093~orig.jpg' },
    { name: 'Rogue Planets', href: '/rogue-planets', category: 'Exoplanets', summary: 'Planets that don\'t orbit any star - wandering alone through the galaxy in eternal darkness.', image: 'https://images-assets.nasa.gov/image/PIA22094/PIA22094~orig.jpg' },
    { name: 'Exomoons', href: '/exomoons', category: 'Exoplanets', summary: 'Moons orbiting exoplanets - potential havens for life beyond our Solar System.', image: 'https://images-assets.nasa.gov/image/PIA22095/PIA22095~orig.jpg' },
    
    // Cosmology
    { name: 'Cosmology', href: '/cosmology', category: 'Cosmology', summary: 'The study of the universe as a whole - its origin, evolution, and ultimate fate.', image: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000290/GSFC_20171208_Archive_e000290~orig.jpg' },
    { name: 'Dark Matter', href: '/dark-matter', category: 'Cosmology', summary: 'Invisible matter that makes up 27% of the universe - detected only by its gravitational effects.', image: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000291/GSFC_20171208_Archive_e000291~orig.jpg' },
    { name: 'Dark Energy', href: '/dark-energy', category: 'Cosmology', summary: 'The mysterious force causing the universe to expand at an accelerating rate.', image: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000292/GSFC_20171208_Archive_e000292~orig.jpg' },
    { name: 'Big Bang', href: '/big-bang', category: 'Cosmology', summary: 'The origin of our universe - from an infinitely dense point to the cosmos we see today.', image: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000293/GSFC_20171208_Archive_e000293~orig.jpg' },
    { name: 'Cosmic Microwave Background', href: '/cosmic-microwave-background', category: 'Cosmology', summary: 'The afterglow of the Big Bang - the oldest light in the universe, visible everywhere.', image: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000294/GSFC_20171208_Archive_e000294~orig.jpg' },
    { name: 'Universe Structure', href: '/universe-structure', category: 'Cosmology', summary: 'The large-scale structure of the universe - from galaxies to superclusters and cosmic web.', image: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000295/GSFC_20171208_Archive_e000295~orig.jpg' },
    
    // Physics & Cosmology
    { name: 'Gravitational Waves', href: '/gravitational-waves', category: 'Physics & Cosmology', summary: 'Ripples in spacetime caused by massive cosmic events like merging black holes.', image: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000296/GSFC_20171208_Archive_e000296~orig.jpg' },
    { name: 'Time Dilation', href: '/time-dilation', category: 'Physics & Cosmology', summary: 'Einstein\'s relativity - how time passes differently depending on speed and gravity.', image: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000297/GSFC_20171208_Archive_e000297~orig.jpg' },
    { name: 'Relativity', href: '/relativity', category: 'Physics & Cosmology', summary: 'Einstein\'s revolutionary theory explaining gravity, spacetime, and the universe.', image: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000298/GSFC_20171208_Archive_e000298~orig.jpg' },
    { name: 'Wormholes', href: '/wormholes', category: 'Physics & Cosmology', summary: 'Theoretical shortcuts through spacetime - could they enable faster-than-light travel?', image: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000299/GSFC_20171208_Archive_e000299~orig.jpg' },
    { name: 'Multiverse', href: '/multiverse', category: 'Physics & Cosmology', summary: 'The possibility of multiple universes - parallel realities beyond our observable cosmos.', image: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000300/GSFC_20171208_Archive_e000300~orig.jpg' },
  ]

  const categories = Array.from(new Set(allPages.map(p => p.category))).sort()
  
  const categoryIcons: Record<string, string> = {
    'Solar System': '🪐',
    'Planets': '🌍',
    'Dwarf Planets': '🪨',
    'Stars & Stellar Objects': '⭐',
    'Galaxies': '🌌',
    'Cosmic Phenomena': '✨',
    'Space Phenomena': '🌠',
    'Space Exploration': '🚀',
    'Exoplanets': '🪐',
    'Cosmology': '🔭',
    'Physics & Cosmology': '⚛️',
  }

  return (
    <div className="pt-20 relative" id="main-content">
      <ImmersiveEntry />
      {/* Hero Section - Ultra Enhanced Cinematic Space Experience */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden portal gateway-entrance">
        <div className="absolute inset-0">
          {/* Deep space gradient background with cosmic colors */}
          <div className="absolute inset-0 bg-gradient-to-b from-space-deeper via-purple-950/30 via-space-dark to-space-deep" />
          
          {/* Ultra-dense starfield with multiple layers */}
          <div className="absolute inset-0 opacity-80">
            {[...Array(500)].map((_, i) => (
              <div
                key={i}
                className="absolute star"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 4 + 1}px`,
                  height: `${Math.random() * 4 + 1}px`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${Math.random() * 4 + 3}s`,
                }}
              >
                <div className="w-full h-full bg-white rounded-full animate-twinkle" />
              </div>
            ))}
          </div>

          {/* Shooting stars / meteors */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 50}%`,
                  animation: `shooting-star ${3 + Math.random() * 2}s linear infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                  boxShadow: '0 0 6px 2px rgba(255, 255, 255, 0.8)',
                }}
              />
            ))}
          </div>

          {/* Enhanced nebula glow effects - more dramatic and colorful */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-purple-500/20 via-pink-500/15 to-transparent blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-1/4 right-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-l from-blue-500/20 via-cyan-500/15 to-transparent blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 w-[700px] h-[700px] rounded-full bg-gradient-radial from-pink-500/15 via-purple-500/10 to-transparent blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
            <div className="absolute top-3/4 left-1/3 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-indigo-500/15 to-blue-500/10 blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
          </div>

          {/* Floating cosmic elements - planets and galaxies */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Large distant planet */}
            <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-gradient-to-br from-purple-900/30 to-blue-900/30 blur-2xl border border-purple-500/10" 
              style={{ animation: 'float 20s ease-in-out infinite' }} />
            {/* Medium planet */}
            <div className="absolute bottom-32 left-20 w-48 h-48 rounded-full bg-gradient-to-br from-pink-900/30 to-purple-900/30 blur-xl border border-pink-500/10"
              style={{ animation: 'float 15s ease-in-out infinite', animationDelay: '2s' }} />
            {/* Small planet */}
            <div className="absolute top-1/2 right-1/4 w-32 h-32 rounded-full bg-gradient-to-br from-cyan-900/30 to-blue-900/30 blur-lg border border-cyan-500/10"
              style={{ animation: 'float 12s ease-in-out infinite', animationDelay: '4s' }} />
          </div>

          {/* Multiple portal ring effects for depth */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute w-[500px] h-[500px] border-2 border-purple-500/30 rounded-full animate-portal-rotate" />
            <div className="absolute w-[350px] h-[350px] border border-blue-500/20 rounded-full animate-portal-rotate" style={{ animationDirection: 'reverse', animationDuration: '15s' }} />
            <div className="absolute w-[200px] h-[200px] border border-pink-500/20 rounded-full animate-portal-rotate" style={{ animationDuration: '8s' }} />
          </div>

          {/* Particle effects */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full opacity-60"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `particle-float ${10 + Math.random() * 10}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              />
            ))}
          </div>
          <HeroOverlay intensity="medium" />
          <HeroCinematicOverlay intensity="medium" />
          <Starfield intensity="light" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto animate-fade-in">
          {/* Enhanced rocket with glow */}
          <div className="mb-6 animate-float relative inline-block">
            <span className="text-8xl relative z-10">🚀</span>
            <div className="absolute inset-0 blur-xl bg-purple-500/50 rounded-full animate-pulse" style={{ transform: 'scale(1.5)' }} />
          </div>
          
          {/* Main title with enhanced glow */}
          <h1 className="text-7xl md:text-9xl font-bold mb-6 text-gradient animate-slide-up relative space-heading-glow space-aurora-bg text-over-image">
            <span className="relative z-10">Space Explorer</span>
          </h1>
          
          <p className="text-3xl md:text-4xl text-gray-200 mb-4 font-light animate-slide-up drop-shadow-lg text-over-image" style={{ animationDelay: '0.2s', textShadow: '0 0 20px rgba(139, 92, 246, 0.5)' }}>
            Journey Through the Cosmos
          </p>
          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.4s' }}>
            The greatest space website on Earth. Explore planets, stars, galaxies, and the mysteries of the universe 
            with interactive content, cinematic visuals, and immersive experiences.
          </p>
          
          {/* Enhanced buttons with better effects */}
          <div className="flex flex-wrap justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <Link
              href="/solar-system"
              className="group relative px-10 py-5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-bold text-lg hover:from-purple-700 hover:to-blue-700 transform hover:scale-110 transition-all shadow-2xl glow-purple overflow-hidden cinema-button-hover space-button-glow"
              aria-label={getButtonAriaLabel('start-exploring')}
            >
              <span className="relative z-10">Start Exploring</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity" />
            </Link>
            <Link
              href="/missions"
              className="group relative px-10 py-5 glass border-2 border-purple-500/50 rounded-xl text-white font-bold text-lg hover:bg-purple-500/30 hover:border-purple-400 transform hover:scale-110 transition-all backdrop-blur-xl space-button-glow"
              aria-label={getButtonAriaLabel('view-missions')}
            >
              <span className="relative z-10">View Missions</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/10 group-hover:to-blue-500/10 transition-all" />
            </Link>
          </div>
        </div>

        {/* Enhanced scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
          <div className="w-6 h-10 border-2 border-purple-500/70 rounded-full flex justify-center backdrop-blur-sm bg-purple-500/10">
            <div className="w-1 h-3 bg-gradient-to-b from-purple-400 to-blue-400 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Did You Know Section */}
      <SectionSeparator variant="gradient" className="my-8" />
      <section className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <DidYouKnow facts={didYouKnowFacts} />
        </div>
      </section>

      {/* Portal Sections - Gateway Experience - Enhanced */}
      <SectionSeparator variant="gradient" className="my-8" />
      <section className="py-20 px-4 relative overflow-hidden">
        {/* Enhanced background with cosmic effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/10 to-transparent" />
        <div className="absolute inset-0">
          {/* Floating particles in portal section */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-purple-400/40 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `particle-float ${8 + Math.random() * 6}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
          {/* Subtle nebula glow */}
          <div className="absolute top-1/2 left-1/4 w-96 h-96 rounded-full bg-purple-500/5 blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block mb-8">
              <div className="flex items-center gap-6">
                <div className="h-px w-32 bg-gradient-to-r from-transparent via-purple-400 to-purple-500 animate-pulse" />
                <div className="relative">
                  <div className="w-4 h-4 rounded-full bg-purple-500 animate-pulse" />
                  <div className="absolute inset-0 w-4 h-4 rounded-full bg-purple-400 animate-ping opacity-75" />
                </div>
                <div className="h-px w-32 bg-gradient-to-l from-transparent via-purple-400 to-purple-500 animate-pulse" />
              </div>
            </div>
            <h2 className="text-6xl md:text-8xl font-bold mb-6 text-gradient portal-title relative">
              <span className="relative z-10">Explore the Universe</span>
              <span className="absolute inset-0 blur-2xl text-purple-500/20 animate-pulse" style={{ zIndex: 0 }}>Explore the Universe</span>
            </h2>
            <p className="text-center text-gray-200 text-2xl mb-4 max-w-4xl mx-auto leading-relaxed drop-shadow-lg" style={{ textShadow: '0 0 15px rgba(139, 92, 246, 0.3)' }}>
              Step through portals to different realms of space
            </p>
            <p className="text-center text-gray-400 text-lg max-w-3xl mx-auto">
              Each section is a gateway to infinite knowledge and wonder
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredPortals.map((portal, index) => (
              <Link
                key={index}
                href={portal.href}
                className="group relative portal overflow-hidden rounded-3xl border-2 border-purple-500/40 hover:border-purple-400/80 transition-all hover-lift glow-purple gateway-card backdrop-blur-sm cinema-card-hover space-card-lift"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Enhanced background glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 group-hover:from-purple-500/20 group-hover:to-blue-500/20 transition-all" />
                
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={portal.image}
                    alt={portal.title}
                    fill
                    className="object-cover group-hover:scale-125 transition-transform duration-700"
                    loading={shouldLazyLoad(index > 2) ? 'lazy' : 'eager'}
                    priority={index < 3}
                    sizes={getImageSizes({ mobile: 100, tablet: 50, desktop: 33 })}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${portal.gradient} opacity-70 group-hover:opacity-85 transition-opacity`} />
                  
                  {/* Enhanced icon with glow */}
                  <div className="absolute top-4 right-4 relative z-10">
                    <span className="text-6xl opacity-90 group-hover:scale-125 transition-transform relative">
                      {portal.icon}
                      <span className="absolute inset-0 blur-xl opacity-50 group-hover:opacity-75 transition-opacity" style={{ transform: 'scale(1.5)' }}>
                        {portal.icon}
                      </span>
                    </span>
                  </div>
                  
                  {/* Animated border glow on hover */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-400/50 rounded-3xl transition-all duration-500" />
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-space-dark/95 via-space-dark/80 to-transparent backdrop-blur-sm">
                  <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all relative z-10">
                    {portal.title}
                  </h3>
                  <p className="text-gray-300 relative z-10">{portal.description}</p>
                </div>
                
                {/* Particle effect overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full"
                      style={{
                        left: `${20 + i * 15}%`,
                        top: `${30 + i * 10}%`,
                        animation: `particle-float ${3 + i * 0.5}s ease-in-out infinite`,
                        animationDelay: `${i * 0.2}s`,
                      }}
                    />
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Explore Stats */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient relative">
              <span className="relative z-10">Explore Stats</span>
              <span className="absolute inset-0 blur-xl text-purple-500/20 animate-pulse" style={{ zIndex: 0 }}>Explore Stats</span>
            </h2>
            <p className="text-gray-400 text-lg">Discover what's waiting for you</p>
          </div>
          <ExploreStats totalPages={allPages.length} />
        </div>
      </section>

      {/* Quick Facts Grid - Enhanced */}
      <section className="py-20 px-4 bg-space-deep/30 relative overflow-hidden">
        {/* Background cosmic effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-purple-500/5 blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient relative">
              <span className="relative z-10">Quick Space Facts</span>
              <span className="absolute inset-0 blur-xl text-purple-500/20 animate-pulse" style={{ zIndex: 0 }}>Quick Space Facts</span>
            </h2>
            <p className="text-gray-400 text-lg">Amazing cosmic discoveries at a glance</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickFacts.map((item, index) => (
              <div key={index} className="transform hover:scale-105 transition-all duration-300" style={{ animationDelay: `${index * 0.1}s` }}>
                <FactCard
                  fact={item.fact}
                  icon={item.icon}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Missions - Enhanced */}
      <section className="py-20 px-4 relative overflow-hidden">
        {/* Cosmic background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `particle-float ${6 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient relative">
              <span className="relative z-10">Featured Missions</span>
              <span className="absolute inset-0 blur-xl text-blue-500/20 animate-pulse" style={{ zIndex: 0 }}>Featured Missions</span>
            </h2>
            <p className="text-center text-gray-300 text-xl mb-2 max-w-3xl mx-auto drop-shadow-lg" style={{ textShadow: '0 0 10px rgba(59, 130, 246, 0.3)' }}>
              Discover humanity's greatest achievements in space exploration
            </p>
            <p className="text-center text-gray-500 text-sm">Journey to the stars and beyond</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredMissions.map((mission, index) => (
              <div key={index} className="transform hover:scale-105 transition-all duration-300" style={{ animationDelay: `${index * 0.15}s` }}>
                <MissionCard {...mission} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - Enhanced */}
      <section className="py-20 px-4 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 w-full h-full bg-gradient-radial from-purple-500/5 via-transparent to-transparent" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '60+', label: 'Pages of Content', icon: '📚' },
              { value: '100+', label: 'Space Images', icon: '🖼️' },
              { value: '∞', label: 'Knowledge to Discover', icon: '✨' },
              { value: '🚀', label: 'Space Adventures', icon: '🌌' },
            ].map((stat, index) => (
              <div 
                key={index}
                className="group text-center glass rounded-2xl p-8 border border-purple-500/30 hover:border-purple-400/60 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 relative overflow-hidden"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/10 group-hover:to-blue-500/10 transition-all" />
                
                <div className="relative z-10">
                  <div className="text-6xl font-bold text-gradient mb-2 relative">
                    <span className="relative z-10">{stat.value}</span>
                    <span className="absolute inset-0 blur-lg text-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity">{stat.value}</span>
                  </div>
                  <div className="text-gray-300 text-lg group-hover:text-gray-200 transition-colors">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Pages Section - Complete Universe Explorer - Enhanced */}
      <section className="py-20 px-4 relative bg-space-deep/20 overflow-hidden">
        {/* Cosmic background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-purple-300/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `particle-float ${7 + Math.random() * 5}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl font-bold mb-6 text-gradient relative">
              <span className="relative z-10">Explore All Pages</span>
              <span className="absolute inset-0 blur-2xl text-purple-500/25 animate-pulse" style={{ zIndex: 0 }}>Explore All Pages</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto drop-shadow-lg" style={{ textShadow: '0 0 10px rgba(139, 92, 246, 0.2)' }}>
              Discover all {allPages.length} pages of space knowledge. Each page contains detailed information, 
              stunning images, interactive content, and fascinating facts about our wonderful universe.
            </p>
          </div>

          <div className="space-y-16">
            {categories.map((category) => {
              const categoryPages = allPages.filter(p => p.category === category)
              return (
                <div key={category} className="glass rounded-3xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all">
                  <h3 className="text-4xl font-bold mb-8 text-gradient flex items-center gap-3">
                    <span className="text-5xl">{categoryIcons[category] || '🌌'}</span>
                    {category}
                    <span className="text-2xl text-gray-500 font-normal">({categoryPages.length})</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryPages.map((page) => (
                      <Link
                        key={page.href}
                        href={page.href}
                        className="group block bg-space-deep rounded-xl border border-purple-500/20 hover:border-purple-500/60 hover:bg-purple-500/10 transition-all transform hover:scale-105 hover:shadow-2xl overflow-hidden"
                      >
                        {/* Image Section */}
                        <div className="relative h-48 w-full overflow-hidden">
                          <Image
                            src={page.image || 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800'}
                            alt={page.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                            sizes={getImageSizes({ mobile: 100, tablet: 50, desktop: 33 })}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-space-dark via-transparent to-transparent opacity-80" />
                          <div className="absolute top-4 right-4">
                            <span className="text-3xl opacity-90 group-hover:scale-125 transition-transform">→</span>
                          </div>
                        </div>
                        
                        {/* Content Section */}
                        <div className="p-6">
                          <h4 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all">
                            {page.name}
                          </h4>
                          <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                            {page.summary}
                          </p>
                          <div className="flex items-center gap-2 text-purple-400 text-sm font-semibold">
                            <span>Read More</span>
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Call to Action - Enhanced */}
      <section className="py-20 px-4 relative overflow-hidden">
        {/* Dramatic cosmic background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-purple-500/10 via-pink-500/5 to-transparent blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-l from-blue-500/10 via-cyan-500/5 to-transparent blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/40 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `particle-float ${5 + Math.random() * 5}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
        
        <div className="max-w-4xl mx-auto text-center glass rounded-3xl p-12 border border-purple-500/40 glow-purple relative backdrop-blur-xl">
          {/* Inner glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 rounded-3xl" />
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient relative">
              <span className="relative z-10">Ready to Explore?</span>
              <span className="absolute inset-0 blur-2xl text-purple-500/30 animate-pulse" style={{ zIndex: 0 }}>Ready to Explore?</span>
            </h2>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed drop-shadow-lg" style={{ textShadow: '0 0 15px rgba(139, 92, 246, 0.3)' }}>
              Embark on an incredible journey through space. From our solar system to distant galaxies, 
              from black holes to exoplanets - your cosmic adventure awaits.
            </p>
            <Link
              href="/solar-system"
              className="group relative inline-block px-12 py-5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-bold text-lg hover:from-purple-700 hover:to-blue-700 transform hover:scale-110 transition-all shadow-2xl glow-purple overflow-hidden"
            >
              <span className="relative z-10">Begin Your Journey →</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-30 transition-opacity" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

