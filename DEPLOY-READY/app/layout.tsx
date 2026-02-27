import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '../styles/a11y.css'
import '../styles/game-animations.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PortalTransition from '@/components/PortalTransition'
import ThemeToggle from '@/components/ThemeToggle'
import { AudioProvider } from '@/lib/audioContext'
import StarfieldCanvas from '@/components/StarfieldCanvas'
import StarfieldBackground from '@/components/StarfieldBackground'
import TwinVerseSignature from '@/components/TwinVerseSignature'
import { EasterEggStarModeProvider } from '@/components/EasterEggStarMode'
import StructuredData from '@/components/StructuredData'
import BackToTop from '@/components/BackToTop'
import PageNavigation from '@/components/PageNavigation'
import { ShortcutManager } from '@/components/keyboard'
import { Onboarding } from '@/components/onboarding'
import CommandBar from '@/components/command/CommandBar'
import { generateMetadata as genMetadata } from '@/utils/seo'
import GameHUD from '@/components/game/GameHUD'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  ...genMetadata({
    title: 'Space Explorer - Universe, Astronomy, Planets, Stars & Space Exploration',
    description: 'Explore the universe with 5,000+ exoplanets, distant stars, search for life, space missions, planets, galaxies, black holes, nebulae, and cosmic phenomena. Perfect for kids, students, researchers, and space enthusiasts worldwide. Information-rich content from every space agency globally.',
    image: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000136/GSFC_20171208_Archive_e000136~orig.jpg',
    keywords: [
      // Core - Most searched
      'space', 'astronomy', 'universe', 'cosmos', 'NASA', 'planets', 'stars', 'galaxies', 'black holes', 'solar system', 'exoplanets', 'space exploration', 'astronauts', 'telescopes', 'mars', 'moon',
      
      // All Planets
      'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'dwarf planets', 'terrestrial planets', 'gas giants', 'ice giants', 'planet facts',
      
      // All Star Types
      'stars', 'sun', 'stellar evolution', 'main sequence', 'red giant', 'white dwarf', 'neutron star', 'pulsar', 'magnetar', 'supernova', 'hypernova', 'brown dwarf', 'red dwarf', 'blue giant', 'supergiant', 'Wolf-Rayet',
      
      // Famous Stars
      'Sirius', 'Betelgeuse', 'Rigel', 'Vega', 'Arcturus', 'Antares', 'Aldebaran', 'Spica', 'Pollux', 'Fomalhaut', 'Deneb', 'Altair', 'Canopus', 'Capella', 'Proxima Centauri', 'Alpha Centauri', 'Polaris', 'North Star',
      
      // Exoplanets & Habitable
      'exoplanets', '5000 exoplanets', 'habitable zone', 'goldilocks zone', 'potentially habitable', 'super-Earth', 'ocean world', 'hot Jupiter', 'Proxima b', 'TRAPPIST-1', 'TRAPPIST-1e', 'Kepler-452b', 'Kepler-442b', 'K2-18b', 'water vapor', 'biosignatures',
      
      // Life Search
      'astrobiology', 'search for life', 'alien life', 'extraterrestrial', 'ET', 'SETI', 'Drake equation', 'Fermi paradox', 'are we alone', 'life on Mars', 'Europa ocean', 'Enceladus', 'Titan lakes', 'extremophiles',
      
      // Galaxies
      'galaxies', 'Milky Way', 'Andromeda', 'spiral galaxy', 'elliptical galaxy', 'irregular galaxy', 'galaxy clusters', 'Virgo Cluster', 'Local Group', 'cosmic web', 'quasar', 'active galaxy',
      
      // Black Holes
      'black holes', 'supermassive black hole', 'stellar black hole', 'event horizon', 'singularity', 'Sagittarius A*', 'M87*', 'first black hole image', 'Cygnus X-1', 'Hawking radiation', 'accretion disk',
      
      // Nebulae
      'nebulae', 'nebula', 'Orion Nebula', 'Eagle Nebula', 'Pillars of Creation', 'Carina Nebula', 'Ring Nebula', 'Helix Nebula', 'Crab Nebula', 'Horsehead Nebula', 'planetary nebula', 'emission nebula', 'dark nebula',
      
      // Space Phenomena
      'dark matter', 'dark energy', 'gravitational waves', 'LIGO', 'big bang', 'Big Bang theory', 'cosmic microwave background', 'CMB', 'gamma ray burst', 'fast radio burst', 'FRB', 'supernova explosion', 'neutron star merger',
      
      // Missions - Historic
      'Apollo 11', 'moon landing', 'Neil Armstrong', 'Buzz Aldrin', '1969', 'first man on moon', 'Apollo mission', 'Voyager', 'Voyager 1', 'Voyager 2', 'Golden Record', 'Pioneer', 'Viking', 'Space Shuttle',
      
      // Missions - Current
      'Perseverance', 'Curiosity', 'Mars rover', 'Ingenuity helicopter', 'Mars exploration', 'Mars missions', 'Europa Clipper', 'Juno', 'Cassini', 'New Horizons', 'Pluto flyby',
      
      // Telescopes
      'Hubble Space Telescope', 'Hubble', 'HST', 'James Webb Space Telescope', 'JWST', 'Webb telescope', 'Kepler mission', 'TESS', 'Spitzer', 'Chandra', 'Gaia', 'Keck', 'VLT', 'ALMA',
      
      // Space Stations & Commercial
      'International Space Station', 'ISS', 'space station', 'SpaceX', 'Falcon 9', 'Starship', 'Dragon', 'Blue Origin', 'Virgin Galactic', 'commercial spaceflight', 'space tourism',
      
      // Moons
      'moon', 'moons', 'Io', 'Europa', 'Ganymede', 'Callisto', 'Titan', 'Enceladus', 'Triton', 'Phobos', 'Deimos', 'Charon', 'Europa ocean', 'Enceladus geysers', 'Titan methane',
      
      // Small Bodies
      'asteroid', 'comet', 'meteor', 'meteorite', 'asteroid belt', 'Kuiper belt', 'Oort cloud', 'near-Earth object', 'Halley Comet', 'Ceres', 'Bennu', 'Apophis', 'DART mission',
      
      // Space Weather
      'space weather', 'solar flare', 'solar storm', 'coronal mass ejection', 'CME', 'aurora', 'northern lights', 'southern lights', 'sunspot', 'solar wind', 'Carrington Event',
      
      // Cosmology & Theory
      'cosmology', 'astrophysics', 'relativity', 'general relativity', 'special relativity', 'Einstein', 'E=mc2', 'spacetime', 'time dilation', 'wormhole', 'multiverse', 'inflation', 'expanding universe',
      
      // Scientists
      'Albert Einstein', 'Stephen Hawking', 'Carl Sagan', 'Isaac Newton', 'Galileo Galilei', 'Edwin Hubble', 'Nicolaus Copernicus', 'Johannes Kepler', 'Tycho Brahe', 'Neil deGrasse Tyson', 'Vera Rubin', 'Katherine Johnson', 'Sally Ride', 'Mae Jemison',
      
      // Educational - Kids
      'space for kids', 'astronomy for children', 'fun space facts', 'space experiments', 'planets for kids', 'solar system for kids', 'astronaut for kids', 'space activities', 'space games', 'space education',
      
      // Educational - General
      'learn astronomy', 'astronomy for beginners', 'astronomy guide', 'space science', 'STEM', 'STEAM', 'science education', 'astronomy class', 'astronomy course',
      
      // Amateur Astronomy
      'amateur astronomy', 'stargazing', 'night sky', 'telescope for beginners', 'best telescope', 'binoculars astronomy', 'astrophotography', 'how to use telescope', 'star chart', 'astronomy app',
      
      // Observation
      'what to see tonight', 'planet visibility', 'ISS tracker', 'ISS location', 'where is ISS', 'meteor shower dates', 'when is next eclipse', 'Perseids', 'Geminids', 'satellite tracking',
      
      // Research & Careers
      'space research', 'astronomy research', 'astrophysics research', 'how to become astronaut', 'astronaut training', 'space career', 'aerospace engineering', 'planetary science', 'exoplanet research',
      
      // Space Agencies Worldwide
      'space agencies', 'world space agencies', 'NASA', 'ESA', 'Roscosmos', 'CNSA', 'JAXA', 'ISRO', 'CSA', 'UAE Space Agency', 'KARI', 'international cooperation',
      
      // Current Topics & Trending
      'latest space discoveries', 'space news', 'astronomy news', 'JWST discoveries', 'Mars latest', 'new exoplanet', 'space today', 'astronomy today', 'breakthrough discovery',
      
      // Questions (High Value)
      'what is space', 'how big is universe', 'are we alone', 'is there life on Mars', 'can humans live on Mars', 'what is a black hole', 'how do stars form', 'when will Betelgeuse explode',
      
      // Multi-Language Keywords
      'فضاء', 'كواكب', 'نجوم', 'مجرات', 'ناسا', 'المريخ', 'القمر', 'استكشاف الفضاء', 'علم الفلك', 'ثقوب سوداء',
      'espacio', 'planetas', 'estrellas', 'galaxias', 'astronomía', 'exploración espacial', 'NASA', 'Marte',
      'espace', 'planètes', 'étoiles', 'galaxies', 'astronomie', 'NASA', 'Mars',
      'Weltraum', 'Planeten', 'Sterne', 'Galaxien', 'Astronomie', 'NASA', 'Mars',
      '太空', '行星', '恒星', '星系', '天文学', '火星', '宇宙探索',
      '宇宙', '惑星', '恒星', '銀河', '天文学', '火星', '宇宙探査',
      'अंतरिक्ष', 'ग्रह', 'तारे', 'आकाशगंगा', 'खगोल विज्ञान',
      'espaço', 'planetas', 'estrelas', 'galáxias', 'astronomia',
      'космос', 'планеты', 'звёзды', 'галактики', 'астрономия',
      'spazio', 'pianeti', 'stelle', 'galassie', 'astronomia',
      '우주', '행성', '별', '은하', '천문학',
      'uzay', 'gezegenler', 'yıldızlar', 'galaksiler',
      'ruimte', 'planeten', 'sterren', 'sterrenstelsels',
      'przestrzeń', 'planety', 'gwiazdy', 'galaktyki',
      
      // Long-tail & Specific
      'potentially habitable exoplanets', 'planets with water', 'search for alien life', 'life on Europa', 'life on Enceladus', 'Mars water discovery', 'exoplanet atmospheres JWST',
      'amateur astronomy guide', 'telescope buying guide', 'how to photograph Milky Way', 'stargazing for beginners', 'best meteor showers', 'ISS sighting times', 'planet viewing tonight',
      'space agencies worldwide', 'famous astronomers', 'history of astronomy', 'space exploration history', 'Apollo program', 'moon landing facts', 'Mars colonization', 'future space missions',
      'world observatories', 'ground telescopes', 'space telescopes', 'radio astronomy', 'infrared astronomy', 'X-ray astronomy', 'gamma-ray astronomy',
      'cosmic phenomena', 'space discoveries', 'astronomy breakthroughs', 'latest from Mars', 'JWST images', 'Hubble photos', 'space pictures', 'NASA images', 'astronomy images',
      'distance to stars', 'how far are planets', 'light year explained', 'astronomical distances', 'scale of universe', 'size comparison', 'cosmic scale',
      'star formation regions', 'stellar nurseries', 'molecular clouds', 'protoplanetary disks', 'planet formation', 'accretion disk',
      'black hole types', 'supermassive black holes', 'stellar black holes', 'black hole merger', 'gravitational wave detection', 'LIGO discoveries', 'event horizon image',
      'space for students', 'astronomy homework help', 'solar system project', 'science fair space', 'astronomy degree', 'astrophysics career', 'become space scientist',
      'citizen science projects', 'Galaxy Zoo', 'Planet Hunters', 'discover exoplanets', 'amateur discoveries', 'contribute to science',
      'all constellation names', 'constellation guide', 'star patterns', '88 constellations', 'zodiac constellations', 'Big Dipper', 'Orion', 'Southern Cross',
      'meteor showers calendar', 'Perseids August', 'Geminids December', 'shooting stars', 'meteorite impacts', 'asteroid threat', 'planetary defense',
      'space weather effects', 'solar storms impact', 'aurora forecast', 'when to see northern lights', 'geomagnetic storm', 'CME Earth impact',
      'Mars surface', 'Mars geology', 'Mars minerals', 'Mars atmosphere', 'Mars temperature', 'Mars day length', 'Mars year', 'Mars seasons', 'Olympus Mons', 'Valles Marineris',
      'Jupiter Great Red Spot', 'Jupiter storms', 'Jupiter bands', 'Jupiter magnetosphere', 'Jupiter missions', 'Juno spacecraft', 'Galilean moons',
      'Saturn rings', 'ring structure', 'Cassini Division', 'Saturn missions', 'Cassini spacecraft', 'Saturn hexagon', 'Saturn moons', 'Titan atmosphere',
      'interstellar space', 'interstellar medium', 'between stars', 'interstellar travel', 'Voyager interstellar', 'heliopause', 'interstellar journey',
      'cosmology theories', 'origin of universe', 'fate of universe', 'Big Freeze', 'Big Rip', 'expanding universe', 'accelerating expansion', 'Hubble constant', 'cosmic inflation',
      'observable universe', '93 billion light years', '13.8 billion years old', 'age of universe', 'how old is universe', 'when did universe begin',
      'most distant star', 'Earendel', 'nearest star', 'closest exoplanet', 'farthest galaxy', 'oldest star', 'largest star', 'brightest star', 'hottest planet', 'coldest place',
      'space records', 'cosmic records', 'astronomy records', 'universe records', 'extreme space', 'cosmic extremes',
      'space news 2024', 'space news 2025', 'space news 2026', 'latest discoveries', 'recent discoveries', 'new findings', 'breakthrough', 'space updates',
      'all space missions', 'historic missions', 'current missions', 'future missions', 'planned missions', 'mission timeline', 'space exploration timeline',
      'spacecraft', 'space probe', 'orbiter', 'lander', 'rover', 'flyby mission', 'sample return', 'robotic mission', 'crewed mission',
      'Hubble images', 'JWST images', 'NASA images', 'space photography', 'astronomical images', 'deep field', 'ultra deep field', 'iconic space photos',
      'star clusters', 'Pleiades', 'Hyades', 'Beehive Cluster', 'M13', 'globular cluster', 'open cluster', 'stellar association',
      'astronomical events', 'celestial events', 'sky events', 'eclipse', 'solar eclipse', 'lunar eclipse', 'total eclipse', 'meteor shower', 'conjunction', 'opposition',
      'observatory', 'observatories worldwide', 'Keck Observatory', 'VLT', 'Gemini', 'Subaru', 'ground telescopes', 'space observatories',
      'radio astronomy', 'ALMA', 'VLA', 'FAST', 'Arecibo', 'MeerKAT', 'Event Horizon Telescope', 'EHT', 'radio telescope',
      'infrared astronomy', 'X-ray astronomy', 'gamma-ray astronomy', 'ultraviolet astronomy', 'multi-wavelength astronomy',
      'astrophotography', 'photograph stars', 'photograph planets', 'photograph nebulae', 'photograph galaxies', 'astrophotography guide', 'camera settings stars', 'stacking images',
      'astronomy equipment', 'telescope types', 'refractor', 'reflector', 'Dobsonian', 'Schmidt-Cassegrain', 'eyepiece', 'mount', 'filters', 'CCD camera',
      'what to observe', 'beginner targets', 'easy targets telescope', 'best deep sky objects', 'bright nebulae', 'visible galaxies',
      'Moon', 'lunar', 'lunar craters', 'lunar maria', 'moon phases', 'full moon', 'new moon', 'crescent', 'gibbous', 'lunar cycle',
      'space weather forecast', 'solar activity', 'space weather prediction', 'aurora forecast', 'geomagnetic storm forecast', 'solar flare alert',
      'gravitational lensing', 'Einstein ring', 'microlensing', 'strong lensing', 'weak lensing', 'galaxy cluster lensing',
      'time dilation', 'spacetime', 'curved space', 'relativity explained', 'general relativity', 'special relativity', 'Einstein theory',
      'star names', 'constellation names', '88 constellations', 'star catalog', 'Messier objects', 'NGC catalog', 'IC catalog',
      'planetary science', 'comparative planetology', 'planet geology', 'planet atmospheres', 'planet interiors', 'planet magnetic fields',
      'stellar physics', 'stellar structure', 'stellar atmospheres', 'stellar spectra', 'HR diagram', 'Hertzsprung-Russell',
      'galactic astronomy', 'extragalactic astronomy', 'galaxy evolution', 'galaxy mergers', 'galaxy formation', 'high-redshift galaxies',
      'variable stars', 'Cepheid variables', 'RR Lyrae', 'Mira variables', 'eclipsing binaries', 'pulsating stars',
      'binary stars', 'multiple star systems', 'Albireo', 'Mizar Alcor', 'visual binary', 'spectroscopic binary',
      'astronomy software', 'Stellarium', 'SkySafari', 'Starry Night', 'planetarium software', 'sky simulation', 'astronomy apps',
      'space agencies budget', 'NASA budget', 'space program funding', 'international collaboration', 'space treaties', 'space law',
      'future telescopes', 'ELT', 'TMT', 'GMT', 'SKA', 'Roman telescope', 'Habitable Worlds Observatory', 'next generation telescopes',
      'Mars human mission', 'Mars colonization', 'Mars base', 'living on Mars', 'Mars settlement', 'Artemis program', 'return to moon', 'lunar base',
      'dwarf planets', 'Ceres', 'Pluto', 'Eris', 'Haumea', 'Makemake', 'Gonggong', 'Quaoar', 'Sedna',
      'asteroid types', 'C-type', 'S-type', 'M-type', 'metallic asteroid', 'carbonaceous asteroid', 'Psyche asteroid',
      'comet structure', 'comet nucleus', 'coma', 'ion tail', 'dust tail', 'comet orbit', 'long-period comet', 'short-period comet',
      'spectroscopy', 'spectrum', 'spectral lines', 'emission spectrum', 'absorption spectrum', 'continuous spectrum', 'Doppler shift', 'redshift', 'blueshift',
      'magnitude', 'apparent magnitude', 'absolute magnitude', 'brightness', 'luminosity', 'stellar magnitude', 'photometry',
      'parallax', 'stellar parallax', 'distance measurement', 'cosmic distance ladder', 'standard candles', 'Cepheid distance',
      'orbital mechanics', 'Kepler laws', 'orbital period', 'semi-major axis', 'eccentricity', 'inclination', 'orbital elements',
      'Lagrange points', 'L1', 'L2', 'L3', 'L4', 'L5', 'JWST at L2', 'stable orbits', 'trojan asteroids',
      'space radiation', 'cosmic rays', 'solar radiation', 'radiation shielding', 'radiation exposure', 'space radiation effects',
      'space suit', 'EVA suit', 'pressure suit', 'life support', 'portable life support', 'spacesuit design',
      'rocket science', 'rocket propulsion', 'rocket engine', 'liquid fuel', 'solid fuel', 'ion drive', 'nuclear propulsion',
      'orbital velocity', 'escape velocity', 'delta-v', 'specific impulse', 'thrust', 'rocket equation',
      'space debris', 'orbital debris', 'space junk', 'Kessler syndrome', 'defunct satellites', 'collision avoidance',
      'exomoon', 'moon of exoplanet', 'extrasolar moon', 'Kepler exomoon', 'exomoon detection',
      'protoplanetary disk', 'circumstellar disk', 'planet formation disk', 'dust disk', 'debris disk', 'Fomalhaut disk', 'Beta Pictoris disk',
      'stellar remnant', 'white dwarf', 'neutron star', 'black hole', 'supernova remnant', 'planetary nebula',
      'interstellar visitor', 'Oumuamua', 'Borisov', 'interstellar object', 'extrasolar comet', 'interstellar asteroid',
      'space documentaries', 'Cosmos', 'Planet Earth', 'space movies', 'Interstellar', 'The Martian', 'Gravity', 'Apollo 13', 'Contact', '2001 Space Odyssey',
      'space books', 'astronomy books', 'Cosmos book', 'Brief History of Time', 'Pale Blue Dot', 'Astrophysics for People in a Hurry',
      'planetarium', 'science museum', 'space museum', 'Kennedy Space Center', 'Smithsonian Air and Space', 'planetarium show',
      'astronomy club', 'star party', 'astronomy society', 'amateur astronomers', 'astronomy community', 'astronomy forum',
      'deep sky observing', 'planetary observing', 'lunar observing', 'solar observing', 'observation techniques', 'finder scope',
      'astrogeology', 'planetary geology', 'crater formation', 'volcanism', 'tectonics', 'erosion', 'impact basins',
      'atmospheric science', 'planet atmospheres', 'atmospheric composition', 'greenhouse effect', 'atmospheric escape',
      'magnetic field', 'magnetosphere', 'planetary magnetism', 'dynamo effect', 'magnetic reconnection',
      'tidal forces', 'tidal locking', 'synchronous rotation', 'tidal heating', 'Io tidal heating', 'Europa tidal heating',
      'cryovolcanism', 'ice volcanoes', 'Enceladus plumes', 'Triton geysers', 'nitrogen geysers',
      'subsurface ocean', 'ocean worlds', 'Europa ocean', 'Enceladus ocean', 'Ganymede ocean', 'Titan ocean', 'Callisto ocean',
      'space biology', 'astrobiology', 'life in space', 'space medicine', 'microgravity effects', 'space health', 'astronaut health',
      'space psychology', 'isolation effects', 'long duration spaceflight', 'Mars mission psychology',
      'space archaeology', 'lunar artifacts', 'Mars artifacts', 'space heritage', 'Apollo landing sites',
      'space art', 'astronomical art', 'space illustration', 'NASA art', 'space artist', 'Chesley Bonestell',
      'space music', 'planetary sounds', 'electromagnetic sonification', 'music of the spheres', 'cosmic sounds',
      'space philosophy', 'cosmic perspective', 'overview effect', 'Copernican principle', 'anthropic principle', 'pale blue dot perspective',
      'astro-tourism', 'astronomy travel', 'dark sky tourism', 'eclipse tourism', 'astronomy vacation', 'observatory tours',
      'space in culture', 'space in media', 'space in fiction', 'science fiction', 'sci-fi', 'space opera',
    ],

  }),
  icons: {
    icon: '/space-icon.svg',
    shortcut: '/space-icon.svg',
    apple: '/space-icon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className} style={{ position: 'relative' }}>
        <StructuredData />
        <StarfieldCanvas />
        {/* Light starfield available: <StarfieldBackground intensity="very-light" /> */}
        <AudioProvider>
          <EasterEggStarModeProvider>
            <ShortcutManager>
              <div className="relative min-h-screen" style={{ position: 'relative', zIndex: 1 }}>
                <PortalTransition />
                <Navbar />
                <main className="relative z-10">
                  {children}
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <PageNavigation position="bottom" showLabels={true} />
                  </div>
                </main>
                <Footer />
                <BackToTop />
                <ThemeToggle />
                <TwinVerseSignature position="bottom-right" minimal={true} />
                <CommandBar />
                <GameHUD />
              </div>
              <Onboarding />
            </ShortcutManager>
          </EasterEggStarModeProvider>
        </AudioProvider>
      </body>
    </html>
  )
}

