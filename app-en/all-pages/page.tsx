import Link from 'next/link'

export default function AllPagesPage() {
  const allPages = [
    // Core Pages
    { name: 'Solar System', href: '/solar-system', category: 'Solar System' },
    { name: 'Planets', href: '/planets', category: 'Solar System' },
    { name: 'Stars', href: '/stars', category: 'Stars & Stellar Objects' },
    { name: 'Galaxies', href: '/galaxies', category: 'Galaxies' },
    { name: 'Black Holes', href: '/black-holes', category: 'Cosmic Phenomena' },
    { name: 'Nebulae', href: '/nebulae', category: 'Cosmic Phenomena' },
    { name: 'Missions', href: '/missions', category: 'Space Exploration' },
    { name: 'Astronauts', href: '/astronauts', category: 'Space Exploration' },
    { name: 'Telescopes', href: '/telescopes', category: 'Space Exploration' },
    { name: 'Space Stations', href: '/space-stations', category: 'Space Exploration' },
    { name: 'Exoplanets', href: '/exoplanets', category: 'Exoplanets' },
    { name: 'Asteroids', href: '/asteroids', category: 'Solar System' },
    { name: 'Comets', href: '/comets', category: 'Solar System' },
    { name: 'Moon', href: '/moon', category: 'Solar System' },
    { name: 'Mars', href: '/mars', category: 'Planets' },
    { name: 'Jupiter', href: '/jupiter', category: 'Planets' },
    { name: 'Saturn', href: '/saturn', category: 'Planets' },
    { name: 'Space History', href: '/space-history', category: 'Space Exploration' },
    { name: 'Future Missions', href: '/future-missions', category: 'Space Exploration' },
    { name: 'Space Technology', href: '/space-technology', category: 'Space Exploration' },
    { name: 'Life in Space', href: '/life-in-space', category: 'Space Exploration' },
    { name: 'Space Weather', href: '/space-weather', category: 'Space Phenomena' },
    { name: 'Cosmology', href: '/cosmology', category: 'Cosmology' },
    { name: 'Dark Matter', href: '/dark-matter', category: 'Cosmology' },
    // New Pages - Planets
    { name: 'Mercury', href: '/mercury', category: 'Planets' },
    { name: 'Venus', href: '/venus', category: 'Planets' },
    { name: 'Earth', href: '/earth', category: 'Planets' },
    { name: 'Uranus', href: '/uranus', category: 'Planets' },
    { name: 'Neptune', href: '/neptune', category: 'Planets' },
    { name: 'Pluto', href: '/pluto', category: 'Dwarf Planets' },
    { name: 'The Sun', href: '/sun', category: 'Solar System' },
    // Solar System Regions
    { name: 'Kuiper Belt', href: '/kuiper-belt', category: 'Solar System' },
    { name: 'Oort Cloud', href: '/oort-cloud', category: 'Solar System' },
    { name: 'Asteroid Belt', href: '/asteroid-belt', category: 'Solar System' },
    { name: 'Moon Phases', href: '/moon-phases', category: 'Solar System' },
    // Stellar Objects
    { name: 'Pulsars', href: '/pulsars', category: 'Stars & Stellar Objects' },
    { name: 'Quasars', href: '/quasars', category: 'Stars & Stellar Objects' },
    { name: 'Supernovae', href: '/supernovae', category: 'Stars & Stellar Objects' },
    { name: 'Neutron Stars', href: '/neutron-stars', category: 'Stars & Stellar Objects' },
    { name: 'White Dwarfs', href: '/white-dwarfs', category: 'Stars & Stellar Objects' },
    { name: 'Red Giants', href: '/red-giants', category: 'Stars & Stellar Objects' },
    { name: 'Protostars', href: '/protostars', category: 'Stars & Stellar Objects' },
    { name: 'Brown Dwarfs', href: '/brown-dwarfs', category: 'Stars & Stellar Objects' },
    { name: 'Star Clusters', href: '/star-clusters', category: 'Stars & Stellar Objects' },
    // Space Phenomena
    { name: 'Solar Wind', href: '/solar-wind', category: 'Space Phenomena' },
    { name: 'Cosmic Rays', href: '/cosmic-rays', category: 'Space Phenomena' },
    { name: 'Solar Flares', href: '/solar-flares', category: 'Space Phenomena' },
    { name: 'Coronal Mass Ejections', href: '/coronal-mass-ejections', category: 'Space Phenomena' },
    { name: 'Interstellar Medium', href: '/interstellar-medium', category: 'Space Phenomena' },
    { name: 'Space Debris', href: '/space-debris', category: 'Space Phenomena' },
    // Physics & Cosmology
    { name: 'Gravitational Waves', href: '/gravitational-waves', category: 'Physics & Cosmology' },
    { name: 'Time Dilation', href: '/time-dilation', category: 'Physics & Cosmology' },
    { name: 'Relativity', href: '/relativity', category: 'Physics & Cosmology' },
    { name: 'Dark Energy', href: '/dark-energy', category: 'Cosmology' },
    { name: 'Big Bang', href: '/big-bang', category: 'Cosmology' },
    { name: 'Cosmic Microwave Background', href: '/cosmic-microwave-background', category: 'Cosmology' },
    { name: 'Universe Structure', href: '/universe-structure', category: 'Cosmology' },
    { name: 'Multiverse', href: '/multiverse', category: 'Physics & Cosmology' },
    { name: 'Wormholes', href: '/wormholes', category: 'Physics & Cosmology' },
    // Exotic Worlds
    { name: 'Rogue Planets', href: '/rogue-planets', category: 'Exoplanets' },
    { name: 'Exomoons', href: '/exomoons', category: 'Exoplanets' },
    { name: 'Habitable Zone', href: '/habitable-zone', category: 'Exoplanets' },
  ]

  const categories = Array.from(new Set(allPages.map(p => p.category))).sort()

  return (
    <div className="pt-20 min-h-screen px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 text-gradient text-center">
          Explore All Pages
        </h1>
        <p className="text-center text-gray-400 text-xl mb-12 max-w-3xl mx-auto">
          Discover all {allPages.length} pages of space knowledge. Click any page to explore!
        </p>

        <div className="space-y-12">
          {categories.map((category) => {
            const categoryPages = allPages.filter(p => p.category === category)
            return (
              <div key={category} className="glass rounded-2xl p-8 border border-purple-500/20">
                <h2 className="text-3xl font-bold mb-6 text-gradient">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {categoryPages.map((page) => (
                    <Link
                      key={page.href}
                      href={page.href}
                      className="block p-4 bg-space-deep rounded-lg border border-purple-500/20 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all transform hover:scale-105"
                    >
                      <span className="text-white font-semibold">{page.name}</span>
                      <span className="block text-gray-400 text-sm mt-1">→ Explore</span>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-12 text-center glass rounded-2xl p-8 border border-purple-500/20">
          <p className="text-2xl text-white mb-4">Total Pages: <span className="text-gradient font-bold">{allPages.length}</span></p>
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-semibold hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

