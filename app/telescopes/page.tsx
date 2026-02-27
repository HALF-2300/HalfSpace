import PageTemplate from '@/components/PageTemplate'

export default function TelescopesPage() {
  return (
    <PageTemplate
      title="Space Telescopes"
      subtitle="Our windows to the universe"
      heroImage="https://images-assets.nasa.gov/image/STScI-PRC95-24a/STScI-PRC95-24a~orig.jpg"
      heroImageAlt="Space telescopes"
      didYouKnow={[
        "Hubble Telescope launched in 1990 and is still working!",
        "James Webb can see galaxies from 13 billion years ago!",
        "Event Horizon Telescope captured the first black hole image!",
        "ALMA sees the universe in radio waves!",
      ]}
      sections={[
        {
          title: "Hubble Space Telescope",
          tagline: "The eye that revolutionized our view of the cosmos",
          shortFact: "Launched in 1990, Hubble has made over 1.5 million observations and helped determine the universe is 13.8 billion years old.",
          content: (
            <div className="space-y-4">
              <p>The Hubble Space Telescope was launched in 1990 and is one of the most famous telescopes in history. Despite initial optics problems, Hubble became a revolutionary tool that changed our understanding of the universe.</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="glass p-4 rounded-xl border border-purple-500/20">
                  <div className="text-purple-400 font-semibold mb-2">What does it observe?</div>
                  <p className="text-gray-300">Visible light and ultraviolet radiation</p>
                </div>
                <div className="glass p-4 rounded-xl border border-purple-500/20">
                  <div className="text-purple-400 font-semibold mb-2">Example images</div>
                  <p className="text-gray-300">Pillars of Creation, Hubble Deep Field, Crab Nebula</p>
                </div>
              </div>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li>First large space telescope</li>
                <li>More than 1.5 million observations</li>
                <li>Helped determine the age of the universe: 13.8 billion years</li>
                <li>Discovered that the universe's expansion is accelerating</li>
              </ul>
            </div>
          ),
          image: "https://images-assets.nasa.gov/image/STScI-PRC95-24a/STScI-PRC95-24a~orig.jpg",
          imageAlt: "Hubble Space Telescope",
          quickFacts: [
            { label: "Launch date", value: "April 1990", icon: "🚀" },
            { label: "Observations", value: "1.5+ million", icon: "🔭" },
            { label: "Orbit altitude", value: "340 miles", icon: "🛰️" }
          ],
          highlightMissions: [
            {
              name: 'Hubble Space Telescope',
              agency: 'NASA/ESA',
              year: '1990',
              description: 'Revolutionized our understanding of the universe with stunning images and groundbreaking discoveries about galaxies, stars, and planets.',
              image: 'https://images-assets.nasa.gov/image/STScI-PRC95-24a/STScI-PRC95-24a~orig.jpg',
              status: 'active' as const,
            }
          ],
          cta: {
            text: "View Historical Images",
            href: "/historical-images",
            style: "primary"
          }
        },
        {
          title: "James Webb Space Telescope",
          tagline: "Peering into the cosmic dawn, revealing the universe's first light",
          shortFact: "Can detect the heat signature of a bumblebee on the Moon from Earth. Its 6.5-meter mirror is 6 times larger than Hubble's.",
          content: (
            <div className="space-y-4">
              <p>The James Webb Space Telescope (JWST) is the most powerful space telescope, launched in 2021. It observes the universe in infrared, allowing it to see the first galaxies and exoplanets.</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="glass p-4 rounded-xl border border-purple-500/20">
                  <div className="text-purple-400 font-semibold mb-2">What does it observe?</div>
                  <p className="text-gray-300">Infrared radiation (0.6-28 micrometers)</p>
                </div>
                <div className="glass p-4 rounded-xl border border-purple-500/20">
                  <div className="text-purple-400 font-semibold mb-2">Example images</div>
                  <p className="text-gray-300">First deep field, Carina Nebula, Neptune's rings</p>
                </div>
              </div>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li>6.5-meter diameter mirror (6 times larger than Hubble)</li>
                <li>Can see galaxies from 13 billion years ago</li>
                <li>Studies exoplanet atmospheres</li>
                <li>Searches for signs of life in the universe</li>
              </ul>
            </div>
          ),
          image: "https://images-assets.nasa.gov/image/weic2208a/weic2208a~orig.jpg",
          imageAlt: "James Webb Space Telescope",
          quickFacts: [
            { label: "Launch date", value: "December 2021", icon: "🚀" },
            { label: "Mirror size", value: "6.5 meters", icon: "🔭" },
            { label: "Distance from Earth", value: "1 million miles", icon: "🌍" },
            { label: "Looks back in time", value: "13.6 billion years", icon: "⏰" }
          ],
          highlightMissions: [
            {
              name: 'James Webb Space Telescope',
              agency: 'NASA/ESA/CSA',
              year: '2021',
              description: 'The most powerful space telescope ever built, revealing the early universe and studying exoplanet atmospheres.',
              image: 'https://images-assets.nasa.gov/image/weic2208a/weic2208a~orig.jpg',
              status: 'active' as const,
            }
          ],
          cta: {
            text: "Explore All Missions",
            href: "/missions",
            style: "primary"
          }
        },
        {
          title: "Event Horizon Telescope (EHT)",
          tagline: "The world as one giant eye, capturing the impossible",
          content: (
            <div className="space-y-4">
              <p>The Event Horizon Telescope is not a single telescope, but a network of radio telescopes around the world working together as one Earth-sized telescope!</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="glass p-4 rounded-xl border border-purple-500/20">
                  <div className="text-purple-400 font-semibold mb-2">What does it observe?</div>
                  <p className="text-gray-300">Radio waves (1.3 mm)</p>
                </div>
                <div className="glass p-4 rounded-xl border border-purple-500/20">
                  <div className="text-purple-400 font-semibold mb-2">Example images</div>
                  <p className="text-gray-300">First black hole image (M87*)</p>
                </div>
              </div>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li>First direct image of a black hole (2019)</li>
                <li>Network of 8 telescopes around the world</li>
                <li>Resolution equivalent to seeing an orange on the Moon from Earth</li>
                <li>Confirmed Einstein's theory of general relativity</li>
              </ul>
            </div>
          ),
          image: "https://images-assets.nasa.gov/image/PIA23122/PIA23122~orig.jpg",
          imageAlt: "Event Horizon Telescope",
          quickFacts: [
            { label: "First black hole image", value: "April 2019", icon: "📸" },
            { label: "Network size", value: "Earth-sized", icon: "🌍" },
            { label: "Resolution", value: "See orange on Moon", icon: "🔭" }
          ],
          cta: {
            text: "Discover Black Holes",
            href: "/black-holes",
            style: "secondary"
          }
        },
        {
          title: "ALMA - Atacama Large Millimeter Array",
          tagline: "66 eyes watching the birth of stars and planets",
          content: (
            <div className="space-y-4">
              <p>ALMA is the world's largest ground-based astronomy project, consisting of 66 radio antennas in the Atacama Desert in Chile.</p>
            <div className="grid md:grid-cols-2 gap-4">
                <div className="glass p-4 rounded-xl border border-purple-500/20">
                  <div className="text-purple-400 font-semibold mb-2">What does it observe?</div>
                  <p className="text-gray-300">Radio waves (0.3-9.6 mm)</p>
                </div>
                <div className="glass p-4 rounded-xl border border-purple-500/20">
                  <div className="text-purple-400 font-semibold mb-2">Example images</div>
                  <p className="text-gray-300">Star formation, planetary disks, distant galaxies</p>
                </div>
              </div>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li>66 radio antennas working together</li>
                <li>Studies cold gas and dust in the universe</li>
                <li>Observes star and planet formation</li>
                <li>Located in Atacama - one of the driest places on Earth</li>
              </ul>
            </div>
          ),
          image: "https://images-assets.nasa.gov/image/PIA09184/PIA09184~orig.jpg",
          imageAlt: "ALMA telescope array",
          quickFacts: [
            { label: "Number of antennas", value: "66", icon: "📡" },
            { label: "Location", value: "Atacama Desert", icon: "🏜️" },
            { label: "Altitude", value: "16,000+ feet", icon: "⛰️" }
          ]
        },
        {
          title: "Future Telescopes",
          tagline: "The next generation of cosmic visionaries",
          content: (
            <div className="space-y-4">
              <p>Upcoming telescopes will open new frontiers in exploring the universe:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li><strong className="text-white">Nancy Grace Roman Space Telescope:</strong> Will search for exoplanets and dark energy</li>
                <li><strong className="text-white">LUVOIR:</strong> Massive telescope that can see signs of life on exoplanets</li>
                <li><strong className="text-white">Thirty Meter Telescope:</strong> Large ground-based telescope with a 30-meter mirror</li>
                <li><strong className="text-white">Square Kilometre Array:</strong> World's largest radio telescope</li>
              </ul>
            </div>
          ),
          image: "https://images-assets.nasa.gov/image/PIA24175/PIA24175~orig.jpg",
          imageAlt: "Concept art of the Nancy Grace Roman Space Telescope",
          quickFacts: [
            { label: "Roman Telescope", value: "2027 launch", icon: "🚀" },
            { label: "TMT mirror", value: "30 meters", icon: "🔭" },
            { label: "SKA antennas", value: "Thousands", icon: "📡" }
          ],
          cta: {
            text: "Explore Future Missions",
            href: "/future-missions",
            style: "primary"
          }
        }
      ]}
      showTodayInSpace={true}
      showIconicMissions={true}
      showSpaceFactsWidget={true}
      showMissionStrip={true}
      showGlossaryMini={true}
      showDidYouKnowMini={true}
      showTimelineMini={true}
      galleryCategory="telescopes"
      galleryViewMoreHref="/historical-images"
    />
  )
}
