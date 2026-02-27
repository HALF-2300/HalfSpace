import React from 'react'
import Link from 'next/link'
import SimplePageLayout from '@/components/SimplePageLayout'

export const metadata = {
  title: 'Explore Space: Complete Information Guide | Space Explorer',
  description: 'Comprehensive guide to everything about space - discoveries, distant stars, life search, phenomena, and more.',
}

const spaceTopics = [
  {
    category: "The Search for Life",
    icon: "🔬",
    color: "from-green-900/30 to-blue-900/30",
    borderColor: "border-green-500/20",
    topics: [
      { name: "Astrobiology", url: "/astrobiology", icon: "🦠", description: "The search for life beyond Earth" },
      { name: "Exoplanets", url: "/exoplanets", icon: "🪐", description: "5,000+ planets orbiting distant stars" },
      { name: "Habitable Worlds", url: "/exoplanets#habitable", icon: "🌍", description: "Planets that could harbor life" },
      { name: "Extremophiles", url: "/astrobiology#extremophiles", icon: "🦠", description: "Life in extreme conditions" },
    ]
  },
  {
    category: "Stars & Stellar Objects",
    icon: "✨",
    color: "from-yellow-900/30 to-orange-900/30",
    borderColor: "border-yellow-500/20",
    topics: [
      { name: "Distant Stars", url: "/distant-stars", icon: "⭐", description: "From nearest neighbors to cosmic beacons" },
      { name: "Star Types", url: "/stars", icon: "💫", description: "Red dwarfs to supergiants" },
      { name: "Stellar Nurseries", url: "/nebulae", icon: "🌫️", description: "Where stars are born" },
      { name: "Supernovae", url: "/supernovae", icon: "💥", description: "Explosive stellar deaths" },
      { name: "Neutron Stars & Pulsars", url: "/pulsars", icon: "📡", description: "Ultra-dense stellar remnants" },
      { name: "White Dwarfs", url: "/white-dwarfs", icon: "⚪", description: "Stellar end stages" },
    ]
  },
  {
    category: "Cosmic Phenomena",
    icon: "💫",
    color: "from-purple-900/30 to-pink-900/30",
    borderColor: "border-purple-500/20",
    topics: [
      { name: "Deep Space Phenomena", url: "/deep-space-phenomena", icon: "🌟", description: "Gamma-ray bursts, FRBs, cosmic extremes" },
      { name: "Black Holes", url: "/black-holes", icon: "⚫", description: "Where gravity rules supreme" },
      { name: "Gravitational Waves", url: "/gravitational-waves", icon: "〰️", description: "Ripples in spacetime" },
      { name: "Dark Matter & Energy", url: "/dark-matter", icon: "🌑", description: "The universe's hidden components" },
      { name: "Nebulae", url: "/nebulae", icon: "🌫️", description: "Cosmic clouds of wonder" },
      { name: "Quasars", url: "/quasars", icon: "✨", description: "Brightest objects in universe" },
    ]
  },
  {
    category: "Our Solar System",
    icon: "☀️",
    color: "from-blue-900/30 to-cyan-900/30",
    borderColor: "border-blue-500/20",
    topics: [
      { name: "Solar System Overview", url: "/solar-system", icon: "🪐", description: "Our cosmic neighborhood" },
      { name: "Moons of Solar System", url: "/solar-system-moons", icon: "🌙", description: "200+ diverse worlds" },
      { name: "Asteroids & Comets", url: "/asteroids", icon: "☄️", description: "Small bodies, big importance" },
      { name: "The Sun", url: "/sun", icon: "☀️", description: "Our star and life-giver" },
      { name: "Space Weather", url: "/space-weather", icon: "🌤️", description: "Solar storms and their effects" },
      { name: "Planets", url: "/planets", icon: "🌍", description: "8 worlds, infinite wonder" },
    ]
  },
  {
    category: "Cosmology & Universe",
    icon: "🌌",
    color: "from-indigo-900/30 to-purple-900/30",
    borderColor: "border-indigo-500/20",
    topics: [
      { name: "Cosmology", url: "/cosmology", icon: "🌐", description: "Origin and fate of universe" },
      { name: "Big Bang", url: "/big-bang", icon: "💥", description: "How it all began" },
      { name: "Cosmic Microwave Background", url: "/cosmic-microwave-background", icon: "📻", description: "Afterglow of creation" },
      { name: "Universe Structure", url: "/universe-structure", icon: "🕸️", description: "The cosmic web" },
      { name: "Multiverse", url: "/multiverse", icon: "🎭", description: "Beyond our universe" },
      { name: "Relativity", url: "/relativity", icon: "⚛️", description: "Einstein's spacetime" },
    ]
  },
  {
    category: "Space Exploration",
    icon: "🚀",
    color: "from-red-900/30 to-orange-900/30",
    borderColor: "border-red-500/20",
    topics: [
      { name: "Space Exploration History", url: "/space-exploration-history", icon: "📜", description: "From Sputnik to Mars" },
      { name: "Space Discoveries", url: "/space-discoveries", icon: "🔬", description: "Breakthrough findings" },
      { name: "Missions", url: "/missions", icon: "🚀", description: "Greatest space missions" },
      { name: "Space Stations", url: "/space-stations", icon: "🛰️", description: "Orbital laboratories" },
      { name: "Telescopes", url: "/telescopes", icon: "🔭", description: "Our windows to cosmos" },
      { name: "Future Missions", url: "/future-missions", icon: "🛸", description: "What's next" },
    ]
  },
  {
    category: "Galaxies & Beyond",
    icon: "🌌",
    color: "from-pink-900/30 to-purple-900/30",
    borderColor: "border-pink-500/20",
    topics: [
      { name: "Galaxies", url: "/galaxies", icon: "🌌", description: "Island universes of stars" },
      { name: "Milky Way", url: "/milky-way", icon: "🌀", description: "Our home galaxy" },
      { name: "Andromeda", url: "/andromeda", icon: "🌌", description: "Our nearest major neighbor" },
      { name: "Galaxy Clusters", url: "/galaxy-clusters", icon: "✨", description: "Groups of galaxies" },
      { name: "Interstellar Space", url: "/interstellar-space", icon: "🌌", description: "Between the stars" },
    ]
  },
  {
    category: "Mind-Blowing Facts",
    icon: "🤯",
    color: "from-teal-900/30 to-cyan-900/30",
    borderColor: "border-teal-500/20",
    topics: [
      { name: "Cosmic Scale", url: "/space/numbers", icon: "🔢", description: "Mind-boggling numbers" },
      { name: "Strange Planets", url: "/exoplanets#exotic", icon: "👽", description: "Bizarre exoworlds" },
      { name: "Record Holders", url: "/distant-stars#records", icon: "🏆", description: "Cosmic extremes" },
      { name: "Space Mysteries", url: "/myths-vs-reality", icon: "❓", description: "Unsolved questions" },
    ]
  },
];

export default function ExplorePage() {
  return (
    <SimplePageLayout
      title="Explore Space: Complete Information Guide"
      subtitle="Everything you need to know about the cosmos - from our solar system to the edge of the universe"
    >
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="text-center bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-lg p-8 border border-blue-500/20">
          <div className="text-6xl mb-4">🌌</div>
          <h2 className="text-3xl font-bold mb-4">Your Complete Space Encyclopedia</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Dive deep into the cosmos with comprehensive information about discoveries, distant stars, 
            the search for life, cosmic phenomena, space exploration, and everything in between. 
            From potentially habitable exoplanets to the mysteries of black holes, from our nearest stellar 
            neighbors to the edge of the observable universe.
          </p>
        </section>

        {/* Stats */}
        <section>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-lg p-6 border border-blue-500/20 text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">5,000+</div>
              <div className="text-gray-400">Exoplanets Discovered</div>
            </div>
            <div className="bg-gradient-to-br from-green-900/30 to-teal-900/30 backdrop-blur-sm rounded-lg p-6 border border-green-500/20 text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">200+</div>
              <div className="text-gray-400">Solar System Moons</div>
            </div>
            <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 backdrop-blur-sm rounded-lg p-6 border border-orange-500/20 text-center">
              <div className="text-4xl font-bold text-orange-400 mb-2">13.8B</div>
              <div className="text-gray-400">Years Old Universe</div>
            </div>
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20 text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">2 Trillion</div>
              <div className="text-gray-400">Galaxies</div>
            </div>
          </div>
        </section>

        {/* Topics Grid */}
        {spaceTopics.map((section, index) => (
          <section key={index}>
            <div className={`bg-gradient-to-r ${section.color} backdrop-blur-sm rounded-lg p-6 border ${section.borderColor} mb-6`}>
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <span className="text-4xl">{section.icon}</span>
                <span>{section.category}</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.topics.map((topic, topicIndex) => (
                <Link
                  key={topicIndex}
                  href={topic.url}
                  className="group bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all hover:scale-105"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{topic.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-2">
                        {topic.name}
                      </h3>
                      <p className="text-sm text-gray-400">{topic.description}</p>
                    </div>
                    <div className="text-white/50 group-hover:text-white transition-colors">
                      →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}

        {/* Featured Content */}
        <section>
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <span>🌟</span>
            <span>Must-Read Topics</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link
              href="/astrobiology"
              className="group bg-gradient-to-br from-green-900/30 to-blue-900/30 backdrop-blur-sm rounded-lg p-8 border border-green-500/20 hover:border-green-500/40 transition-all"
            >
              <div className="text-5xl mb-4">🦠</div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-green-400 transition-colors">
                Are We Alone?
              </h3>
              <p className="text-gray-300">
                Explore the search for life beyond Earth - from microbes on Mars to intelligent civilizations 
                in distant star systems. Learn about biosignatures, extremophiles, and the Drake Equation.
              </p>
            </Link>

            <Link
              href="/exoplanets"
              className="group bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-lg p-8 border border-blue-500/20 hover:border-blue-500/40 transition-all"
            >
              <div className="text-5xl mb-4">🪐</div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-400 transition-colors">
                Worlds Beyond Our Solar System
              </h3>
              <p className="text-gray-300">
                Discover 5,000+ exoplanets including potentially habitable worlds like Proxima b, TRAPPIST-1e, 
                and bizarre planets where it rains glass or gemstones.
              </p>
            </Link>

            <Link
              href="/distant-stars"
              className="group bg-gradient-to-br from-yellow-900/30 to-orange-900/30 backdrop-blur-sm rounded-lg p-8 border border-yellow-500/20 hover:border-yellow-500/40 transition-all"
            >
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-yellow-400 transition-colors">
                From Nearest Stars to Cosmic Giants
              </h3>
              <p className="text-gray-300">
                Journey from Proxima Centauri (4.2 light-years away) to the most luminous, largest, and 
                oldest stars in the universe. Meet Betelgeuse, VY Canis Majoris, and more.
              </p>
            </Link>

            <Link
              href="/deep-space-phenomena"
              className="group bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-lg p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all"
            >
              <div className="text-5xl mb-4">💫</div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-purple-400 transition-colors">
                The Universe's Most Extreme Events
              </h3>
              <p className="text-gray-300">
                Gamma-ray bursts brighter than entire galaxies, mysterious fast radio bursts, gravitational 
                waves from colliding black holes, and more cosmic extremes.
              </p>
            </Link>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-lg p-8 border border-blue-500/20 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Your Cosmic Journey</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-6">
            Whether you're curious about life on other worlds, fascinated by black holes, or wondering about 
            the universe's origin and fate, we have comprehensive, up-to-date information on every space topic.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/astrobiology"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Search for Life
            </Link>
            <Link
              href="/exoplanets"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Explore Exoplanets
            </Link>
            <Link
              href="/distant-stars"
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Discover Stars
            </Link>
            <Link
              href="/cosmology"
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Universe Origins
            </Link>
          </div>
        </section>
      </div>
    </SimplePageLayout>
  )
}
