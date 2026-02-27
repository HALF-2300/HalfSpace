import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="relative mt-20 glass border-t border-purple-500/20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-3xl">🚀</span>
              <h3 className="text-2xl font-bold text-gradient">
                HalfSPACE
              </h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              Your ultimate portal to the cosmos. Explore planets, stars, galaxies, and the mysteries of the universe. 
              Built for students, teachers, and space enthusiasts worldwide.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="https://www.nasa.gov" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                🌌 NASA
              </a>
              <a href="https://www.esa.int" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                🛰️ ESA
              </a>
              <a href="https://apod.nasa.gov" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                📸 APOD
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/solar-system" className="text-gray-400 hover:text-white transition-colors">Solar System</Link></li>
              <li><Link href="/planets" className="text-gray-400 hover:text-white transition-colors">Planets</Link></li>
              <li><Link href="/stars" className="text-gray-400 hover:text-white transition-colors">Stars</Link></li>
              <li><Link href="/galaxies" className="text-gray-400 hover:text-white transition-colors">Galaxies</Link></li>
              <li><Link href="/missions" className="text-gray-400 hover:text-white transition-colors">Missions</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Learn</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/space-history" className="text-gray-400 hover:text-white transition-colors">Space History</Link></li>
              <li><Link href="/astronauts" className="text-gray-400 hover:text-white transition-colors">Astronauts</Link></li>
              <li><Link href="/telescopes" className="text-gray-400 hover:text-white transition-colors">Telescopes</Link></li>
              <li><Link href="/future-missions" className="text-gray-400 hover:text-white transition-colors">Future Missions</Link></li>
              <li><Link href="/cosmology" className="text-gray-400 hover:text-white transition-colors">Cosmology</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/all-pages" className="text-gray-400 hover:text-white transition-colors">All Pages</Link></li>
              <li><Link href="/sources" className="text-gray-400 hover:text-white transition-colors">Sources</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-purple-500/20 text-center">
          <p className="text-sm text-gray-400">
            © 2026 HalfSPACE. Created with passion for space exploration. 
            All images from NASA, ESA, and other public domain sources.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            The greatest space website on Earth 🌍 → 🚀 → 🌌
          </p>
        </div>
      </div>
    </footer>
  )
}

