import PageTemplate from '@/components/PageTemplate'
import Link from 'next/link'

export default function PlanetsPage() {
  // Planet data with IDs for cross-linking
  const planets = [
    {
      id: 'planet-mercury',
      name: 'Mercury',
      href: '/mercury',
      description: 'The smallest planet, closest to the Sun, with extreme temperature swings.',
      image: 'https://images-assets.nasa.gov/image/PIA16853/PIA16853~orig.jpg',
      imageId: 'image-mercury',
      facts: ['Smallest planet', 'Closest to Sun', 'No atmosphere', 'Extreme temperatures']
    },
    {
      id: 'planet-venus',
      name: 'Venus',
      href: '/venus',
      description: 'The hottest planet with a thick, toxic atmosphere.',
      image: 'https://images-assets.nasa.gov/image/PIA00271/PIA00271~orig.jpg',
      imageId: 'image-venus',
      facts: ['Hottest planet', 'Thick atmosphere', 'Rotates backwards', 'Volcanic activity']
    },
    {
      id: 'planet-earth',
      name: 'Earth',
      href: '/earth',
      description: 'Our beautiful blue planet - the only known world with life.',
      image: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000273/GSFC_20171208_Archive_e000273~orig.jpg',
      imageId: 'image-earth',
      facts: ['Only planet with life', '71% water', 'Protective atmosphere', 'One moon']
    },
    {
      id: 'planet-mars',
      name: 'Mars',
      href: '/mars',
      description: 'The Red Planet - explore ancient river valleys and massive volcanoes.',
      image: 'https://images-assets.nasa.gov/image/PIA04591/PIA04591~orig.jpg',
      imageId: 'image-mars',
      facts: ['Red Planet', 'Largest volcano', 'Two moons', 'Evidence of water']
    },
    {
      id: 'planet-jupiter',
      name: 'Jupiter',
      href: '/jupiter',
      description: 'The largest planet - a gas giant with a Great Red Spot storm.',
      image: 'https://images-assets.nasa.gov/image/PIA02873/PIA02873~orig.jpg',
      imageId: 'image-jupiter',
      facts: ['Largest planet', '95 moons', 'Great Red Spot', 'Gas giant']
    },
    {
      id: 'planet-saturn',
      name: 'Saturn',
      href: '/saturn',
      description: 'The ringed planet - famous for its spectacular ring system.',
      image: 'https://images-assets.nasa.gov/image/PIA06193/PIA06193~orig.jpg',
      imageId: 'image-saturn',
      facts: ['Famous rings', '146 moons', 'Low density', 'Titan moon']
    },
    {
      id: 'planet-uranus',
      name: 'Uranus',
      href: '/uranus',
      description: 'An ice giant tilted on its side, with a unique blue-green color.',
      image: 'https://images-assets.nasa.gov/image/PIA18182/PIA18182~orig.jpg',
      imageId: 'image-uranus',
      facts: ['Rotates on side', 'Ice giant', '27 moons', 'Blue-green color']
    },
    {
      id: 'planet-neptune',
      name: 'Neptune',
      href: '/neptune',
      description: 'The windiest planet with supersonic storms.',
      image: 'https://images-assets.nasa.gov/image/PIA01492/PIA01492~orig.jpg',
      imageId: 'image-neptune',
      facts: ['Fastest winds', 'Most distant', '14 moons', 'Deep blue color']
    }
  ]

  // Timeline events with IDs for cross-linking
  const timelineEvents = [
    {
      id: 'timeline-1610',
      year: '1610',
      title: 'Galileo Discovers Jupiter\'s Moons',
      description: 'Galileo Galilei observed Jupiter\'s four largest moons (Io, Europa, Ganymede, Callisto) using a telescope, proving that not everything orbits Earth.',
      icon: '🔭',
      planetId: 'planet-jupiter',
      imageId: 'image-jupiter'
    },
    {
      id: 'timeline-1655',
      year: '1655',
      title: 'Saturn\'s Rings Discovered',
      description: 'Christiaan Huygens discovered Saturn\'s rings and its largest moon, Titan, using an improved telescope.',
      icon: '💍',
      planetId: 'planet-saturn',
      imageId: 'image-saturn'
    },
    {
      id: 'timeline-1781',
      year: '1781',
      title: 'Uranus Discovered',
      description: 'William Herschel discovered Uranus, the first planet discovered with a telescope. Initially thought to be a comet.',
      icon: '🔵',
      planetId: 'planet-uranus',
      imageId: 'image-uranus'
    },
    {
      id: 'timeline-1846',
      year: '1846',
      title: 'Neptune Discovered',
      description: 'Neptune was discovered through mathematical predictions by Urbain Le Verrier and Johann Galle, the first planet found by calculation rather than observation.',
      icon: '🌊',
      planetId: 'planet-neptune',
      imageId: 'image-neptune'
    },
    {
      id: 'timeline-1962',
      year: '1962',
      title: 'Mariner 2 to Venus',
      description: 'NASA\'s Mariner 2 became the first successful interplanetary mission, flying by Venus and confirming its extreme surface temperature.',
      icon: '🚀',
      planetId: 'planet-venus',
      imageId: 'image-venus'
    },
    {
      id: 'timeline-1965',
      year: '1965',
      title: 'Mariner 4 to Mars',
      description: 'Mariner 4 sent back the first close-up images of Mars, revealing a cratered, Moon-like surface.',
      icon: '🔴',
      planetId: 'planet-mars',
      imageId: 'image-mars'
    },
    {
      id: 'timeline-1974',
      year: '1974',
      title: 'Mariner 10 to Mercury',
      description: 'Mariner 10 became the first spacecraft to visit Mercury, mapping 45% of its surface and discovering its magnetic field.',
      icon: '☀️',
      planetId: 'planet-mercury',
      imageId: 'image-mercury'
    },
    {
      id: 'timeline-1977',
      year: '1977',
      title: 'Voyager Missions Launch',
      description: 'Voyager 1 and 2 launched to explore the outer planets. Voyager 2 visited Jupiter, Saturn, Uranus, and Neptune.',
      icon: '🛰️',
      planetId: 'planet-jupiter',
      imageId: 'image-jupiter'
    },
    {
      id: 'timeline-1995',
      year: '1995',
      title: 'Galileo Arrives at Jupiter',
      description: 'The Galileo spacecraft arrived at Jupiter, studying its atmosphere, moons, and magnetic field for 8 years.',
      icon: '🪐',
      planetId: 'planet-jupiter',
      imageId: 'image-jupiter'
    },
    {
      id: 'timeline-2004',
      year: '2004',
      title: 'Cassini Arrives at Saturn',
      description: 'The Cassini spacecraft began its 13-year mission studying Saturn, its rings, and moons, especially Titan and Enceladus.',
      icon: '💫',
      planetId: 'planet-saturn',
      imageId: 'image-saturn'
    },
    {
      id: 'timeline-2011',
      year: '2011',
      title: 'Messenger at Mercury',
      description: 'NASA\'s MESSENGER became the first spacecraft to orbit Mercury, mapping its entire surface and studying its composition.',
      icon: '📡',
      planetId: 'planet-mercury',
      imageId: 'image-mercury'
    },
    {
      id: 'timeline-2018',
      year: '2018',
      title: 'InSight Lands on Mars',
      description: 'NASA\'s InSight lander arrived on Mars to study the planet\'s interior, measuring marsquakes and heat flow.',
      icon: '🌍',
      planetId: 'planet-mars',
      imageId: 'image-mars'
    }
  ]

  return (
    <PageTemplate
      title="Planets"
      subtitle="Worlds of Wonder"
      heroImage="https://images-assets.nasa.gov/image/PIA01341/PIA01341~orig.jpg"
      heroImageAlt="Planets"
      didYouKnow={[
        "Jupiter is so massive that all other planets in the Solar System could fit inside it!",
        "Venus rotates backwards - a day on Venus is longer than its year!",
        "Saturn's density is so low that it would float if you could find an ocean large enough.",
        "Neptune has winds reaching speeds of 2,100 km/h (1,300 mph) - the fastest in the Solar System!",
      ]}
      sections={[
        {
          title: "The Eight Planets",
          content: (
            <div className="space-y-6">
              <p className="text-lg md:text-xl">Our Solar System contains eight planets, each unique and fascinating. Click on any planet below to explore it in detail, or scroll down to see the timeline of planetary exploration.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                {planets.map((planet) => (
                  <div
                    key={planet.id}
                    id={planet.id}
                    className="group relative overflow-hidden rounded-2xl bg-space-deep border-2 border-purple-500/20 hover:border-purple-500/60 transition-all hover-lift glow-purple"
                  >
                    <Link href={planet.href} className="block">
                      <div className="relative h-48 w-full overflow-hidden">
                        <img
                          id={planet.imageId}
                          src={planet.image}
                          alt={planet.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-space-dark via-transparent to-transparent opacity-80" />
                        <div className="absolute top-4 right-4">
                          <span className="text-3xl opacity-90 group-hover:scale-125 transition-transform">→</span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all">
                          {planet.name}
                        </h3>
                        <p className="text-gray-400 text-sm mb-4">{planet.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {planet.facts.map((fact, idx) => (
                            <span key={idx} className="text-xs px-2 py-1 bg-purple-500/20 rounded text-purple-300">
                              {fact}
                            </span>
                          ))}
                        </div>
                        <div className="mt-4 text-sm text-purple-400 font-semibold flex items-center gap-2">
                          <span>Explore {planet.name}</span>
                          <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                      </div>
                    </Link>
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-transparent to-blue-500/0 group-hover:from-purple-500/10 group-hover:to-blue-500/10 transition-all pointer-events-none" />
                  </div>
                ))}
              </div>
              <div className="mt-8 p-6 glass rounded-xl border border-purple-500/20">
                <p className="text-gray-300 text-sm">
                  <strong className="text-white">Tip:</strong> Each planet card above has a unique ID. Scroll down to see the timeline of planetary exploration, where you can click to jump to specific planets and their images.
                </p>
              </div>
            </div>
          ),
        },
        {
          title: "Terrestrial Planets",
          content: (
            <div className="space-y-4">
              <p>The four inner planets—Mercury, Venus, Earth, and Mars—are called terrestrial planets because they have solid, rocky surfaces. These planets are relatively small and dense, with metallic cores and silicate mantles and crusts.</p>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li>
                  <Link href="#planet-mercury" className="text-purple-400 hover:text-purple-300 underline">
                    <strong className="text-white">Mercury:</strong>
                  </Link> The smallest planet, closest to the Sun, with extreme temperature variations from 427°C to -173°C
                </li>
                <li>
                  <Link href="#planet-venus" className="text-purple-400 hover:text-purple-300 underline">
                    <strong className="text-white">Venus:</strong>
                  </Link> The hottest planet with a thick, toxic atmosphere and crushing surface pressure 92 times that of Earth
                </li>
                <li>
                  <Link href="#planet-earth" className="text-purple-400 hover:text-purple-300 underline">
                    <strong className="text-white">Earth:</strong>
                  </Link> The only known planet with life, featuring liquid water and a protective atmosphere
                </li>
                <li>
                  <Link href="#planet-mars" className="text-purple-400 hover:text-purple-300 underline">
                    <strong className="text-white">Mars:</strong>
                  </Link> The Red Planet, with evidence of ancient water and potential for future human exploration
                </li>
              </ul>
            </div>
          ),
          image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800",
          imageAlt: "Terrestrial Planets"
        },
        {
          title: "Gas Giants",
          content: (
            <div className="space-y-4">
              <p>
                <Link href="#planet-jupiter" className="text-purple-400 hover:text-purple-300 underline font-semibold">Jupiter</Link> and{' '}
                <Link href="#planet-saturn" className="text-purple-400 hover:text-purple-300 underline font-semibold">Saturn</Link> are gas giants, massive planets primarily composed of hydrogen and helium. They lack solid surfaces and have thick atmospheres with swirling clouds and powerful storms.
              </p>
              <p>Jupiter is the largest planet in our Solar System, with a Great Red Spot—a storm larger than Earth that has been raging for centuries. Saturn is famous for its spectacular ring system, made of ice particles and rocky debris orbiting the planet.</p>
            </div>
          ),
          image: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=800",
          imageAlt: "Gas Giants"
        },
        {
          title: "Ice Giants",
          content: (
            <div className="space-y-4">
              <p>
                <Link href="#planet-uranus" className="text-purple-400 hover:text-purple-300 underline font-semibold">Uranus</Link> and{' '}
                <Link href="#planet-neptune" className="text-purple-400 hover:text-purple-300 underline font-semibold">Neptune</Link> are ice giants, composed primarily of water, methane, and ammonia ices surrounding a rocky core. These distant planets have deep, cold atmospheres and unique characteristics.
              </p>
              <p>Uranus rotates on its side, likely due to a massive collision in its past. Neptune has the fastest winds in the Solar System, reaching speeds of up to 2,100 km/h (1,300 mph). Both planets have faint ring systems and numerous moons.</p>
            </div>
          ),
        },
        {
          title: "Planetary Exploration Timeline",
          content: (
            <div className="space-y-6">
              <p className="text-lg md:text-xl">Explore the history of planetary exploration. Click on any timeline event to jump to the related planet section and image above.</p>
              <div className="relative py-8">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-blue-500 to-purple-500 opacity-30" />
                <div className="space-y-8">
                  {timelineEvents.map((event) => (
                    <div
                      key={event.id}
                      id={event.id}
                      className="relative pl-20 group cursor-pointer"
                    >
                      <div className="absolute left-6 top-2 w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 border-4 border-space-dark transition-all duration-300 group-hover:scale-150 group-hover:shadow-lg group-hover:shadow-purple-500/50" />
                      <div className="glass rounded-xl p-6 transition-all duration-300 group-hover:scale-105 glow-purple">
                        <div className="flex items-center gap-4 mb-2">
                          <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                            {event.year}
                          </span>
                          {event.icon && <span className="text-3xl">{event.icon}</span>}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                        <p className="text-gray-300 leading-relaxed mb-4">{event.description}</p>
                        <div className="flex gap-3 flex-wrap">
                          <Link
                            href={`#${event.planetId}`}
                            className="text-sm px-3 py-1 bg-purple-500/20 hover:bg-purple-500/40 rounded text-purple-300 transition-all"
                          >
                            → View Planet
                          </Link>
                          <Link
                            href={`#${event.imageId}`}
                            className="text-sm px-3 py-1 bg-blue-500/20 hover:bg-blue-500/40 rounded text-blue-300 transition-all"
                          >
                            → View Image
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ),
        },
        {
          title: "Planetary Characteristics",
          content: "Each planet has unique features: atmospheres, magnetic fields, moons, and geological activity. Some planets have rings, others have extreme weather patterns, and some may have subsurface oceans. Understanding these diverse worlds helps us learn about planetary formation and the potential for life elsewhere in the universe.",
        }
      ]}
      timeline={timelineEvents.map(event => ({
        year: event.year,
        title: event.title,
        description: event.description,
        icon: event.icon
      }))}
      facts={[
        { fact: "Jupiter has 95 known moons", icon: "🪐" },
        { fact: "Saturn's rings are only 10 meters thick", icon: "💍" },
        { fact: "Venus is hotter than Mercury despite being farther from the Sun", icon: "🔥" },
        { fact: "Mars has the largest volcano in the Solar System: Olympus Mons", icon: "🌋" },
      ]}
      quiz={[
        {
          question: "Which planet is known as the 'Red Planet'?",
          options: ["Venus", "Mars", "Jupiter", "Saturn"],
          correct: 1,
          explanation: "Mars is called the Red Planet due to iron oxide (rust) on its surface, giving it a reddish appearance."
        },
        {
          question: "What is the largest planet in our Solar System?",
          options: ["Saturn", "Jupiter", "Neptune", "Uranus"],
          correct: 1,
          explanation: "Jupiter is the largest planet, with a mass greater than all other planets combined."
        },
        {
          question: "Which planet rotates on its side?",
          options: ["Neptune", "Uranus", "Saturn", "Venus"],
          correct: 1,
          explanation: "Uranus rotates on its side at a 98-degree angle, likely due to a massive collision in its past."
        }
      ]}
      relatedLinks={[
        { name: "Solar System", href: "/solar-system" },
        { name: "Mars", href: "/mars" },
        { name: "Jupiter", href: "/jupiter" },
        { name: "Saturn", href: "/saturn" },
        { name: "Moon", href: "/moon" }
      ]}
    />
  )
}
