import PageTemplate from '@/components/PageTemplate'
import Link from 'next/link'

export default function MythsVsFactsPage() {
  const mythsAndFacts = [
    {
      category: 'Planets & Solar System',
      items: [
        {
          myth: 'Mercury is the hottest planet because it\'s closest to the Sun.',
          fact: 'Venus is actually the hottest planet, reaching 462°C (864°F), despite being farther from the Sun. Its thick atmosphere traps heat through the greenhouse effect.',
          related: ['/mercury', '/venus']
        },
        {
          myth: 'The Sun is yellow.',
          fact: 'The Sun appears yellow from Earth due to our atmosphere, but it actually emits white light. In space, the Sun appears white.',
          related: ['/sun', '/solar-system']
        },
        {
          myth: 'Pluto was "demoted" from being a planet.',
          fact: 'Pluto was reclassified based on the scientific definition of a planet. It doesn\'t meet all three criteria: it hasn\'t cleared its orbital neighborhood.',
          related: ['/pluto', '/planets']
        },
        {
          myth: 'Mars is red because it\'s made of rust.',
          fact: 'Mars appears red due to iron oxide (rust) on its surface, but the planet itself is made of rock and metal, not rust.',
          related: ['/mars', '/planets']
        }
      ]
    },
    {
      category: 'Stars & Galaxies',
      items: [
        {
          myth: 'Stars twinkle because they\'re very far away.',
          fact: 'Stars appear to twinkle due to Earth\'s atmosphere distorting their light. In space, stars don\'t twinkle.',
          related: ['/stars', '/telescopes']
        },
        {
          myth: 'The Big Dipper is a constellation.',
          fact: 'The Big Dipper is actually an asterism (a pattern of stars) within the constellation Ursa Major (the Great Bear).',
          related: ['/stars', '/galaxies']
        },
        {
          myth: 'All stars are the same size.',
          fact: 'Stars vary enormously in size, from neutron stars just 20 km wide to supergiants hundreds of times larger than the Sun.',
          related: ['/stars', '/neutron-stars', '/red-giants']
        },
        {
          myth: 'Black holes suck everything in like a vacuum.',
          fact: 'Black holes have strong gravity, but they only pull in objects that get too close. At a distance, they behave like any massive object.',
          related: ['/black-holes', '/gravitational-waves']
        }
      ]
    },
    {
      category: 'Space Exploration',
      items: [
        {
          myth: 'Astronauts float because there\'s no gravity in space.',
          fact: 'Astronauts float because they\'re in free fall, not because there\'s no gravity. Gravity exists everywhere in space.',
          related: ['/astronauts', '/life-in-space']
        },
        {
          myth: 'The Great Wall of China is visible from space.',
          fact: 'The Great Wall is not visible from space with the naked eye. It\'s too narrow and blends with the landscape.',
          related: ['/earth', '/astronauts']
        },
        {
          myth: 'You explode in space without a spacesuit.',
          fact: 'You wouldn\'t explode. You\'d lose consciousness in about 15 seconds due to lack of oxygen, and your body would freeze.',
          related: ['/life-in-space', '/astronauts']
        },
        {
          myth: 'NASA invented Velcro.',
          fact: 'Velcro was invented in 1948 by a Swiss engineer. NASA popularized its use in space, but didn\'t invent it.',
          related: ['/space-technology', '/missions']
        }
      ]
    },
    {
      category: 'The Universe',
      items: [
        {
          myth: 'The universe is infinite.',
          fact: 'The observable universe is finite (about 93 billion light-years across), but we don\'t know if the entire universe is infinite.',
          related: ['/universe-structure', '/cosmology']
        },
        {
          myth: 'Dark matter is invisible because it doesn\'t emit light.',
          fact: 'Dark matter doesn\'t interact with light at all - it doesn\'t emit, absorb, or reflect it. We detect it only through gravity.',
          related: ['/dark-matter', '/cosmology']
        },
        {
          myth: 'The Big Bang was an explosion in space.',
          fact: 'The Big Bang was the rapid expansion of space itself, not an explosion in space. Space and time began with the Big Bang.',
          related: ['/big-bang', '/cosmology']
        },
        {
          myth: 'Time travel is impossible.',
          fact: 'Time dilation (time passing at different rates) is real and proven. We\'re all traveling through time - forward at 1 second per second.',
          related: ['/time-dilation', '/relativity']
        }
      ]
    },
    {
      category: 'Moons & Asteroids',
      items: [
        {
          myth: 'The Moon is always the same distance from Earth.',
          fact: 'The Moon\'s distance varies from about 363,000 km (perigee) to 405,000 km (apogee) due to its elliptical orbit.',
          related: ['/moon', '/moon-phases']
        },
        {
          myth: 'Asteroids are small planets.',
          fact: 'Asteroids are rocky remnants from the early Solar System, not small planets. They\'re too small to be rounded by their own gravity.',
          related: ['/asteroids', '/asteroid-belt']
        },
        {
          myth: 'The Moon has a dark side that never sees the Sun.',
          fact: 'The Moon has a far side (not visible from Earth), but it receives sunlight just like the near side. All parts experience day and night.',
          related: ['/moon', '/moon-phases']
        }
      ]
    }
  ]

  return (
    <PageTemplate
      title="Myths vs Facts"
      subtitle="Separating Space Fiction from Reality"
      heroImage="https://images-assets.nasa.gov/image/PIA03149/PIA03149~orig.jpg"
      heroImageAlt="Myths vs Facts"
      didYouKnow={[
        "Many common space 'facts' are actually myths!",
        "Science fiction often influences what people believe about space.",
        "Real space science is often more fascinating than the myths!",
        "Question everything - even 'common knowledge' about space!",
      ]}
      sections={[
        {
          title: "Common Space Myths Debunked",
          content: (
            <div className="space-y-6">
              <p className="text-lg md:text-xl">
                Explore common misconceptions about space and learn the scientific facts. Each myth is paired with the actual truth and links to related pages for deeper understanding.
              </p>
              <div className="space-y-12">
                {mythsAndFacts.map((category, catIdx) => (
                  <div key={catIdx} id={`myth-category-${catIdx}`} className="scroll-mt-20">
                    <h3 className="text-4xl font-bold text-gradient mb-8 pb-2 border-b-2 border-purple-500/30">
                      {category.category}
                    </h3>
                    <div className="space-y-8">
                      {category.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="glass rounded-xl p-8 border-2 border-purple-500/20 hover:border-purple-500/50 transition-all hover-lift"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Myth */}
                            <div className="space-y-3">
                              <div className="flex items-center gap-3 mb-3">
                                <span className="text-3xl">❌</span>
                                <h4 className="text-xl font-bold text-red-400">MYTH</h4>
                              </div>
                              <p className="text-gray-300 leading-relaxed italic">
                                "{item.myth}"
                              </p>
                            </div>
                            
                            {/* Fact */}
                            <div className="space-y-3">
                              <div className="flex items-center gap-3 mb-3">
                                <span className="text-3xl">✅</span>
                                <h4 className="text-xl font-bold text-green-400">FACT</h4>
                              </div>
                              <p className="text-gray-200 leading-relaxed">
                                {item.fact}
                              </p>
                            </div>
                          </div>
                          
                          {/* Related Links */}
                          {item.related && item.related.length > 0 && (
                            <div className="mt-6 pt-6 border-t border-purple-500/20">
                              <div className="flex flex-wrap gap-2 items-center">
                                <span className="text-sm text-gray-400">Learn more:</span>
                                {item.related.map((link, linkIdx) => {
                                  const linkName = link.split('/').pop()?.replace(/-/g, ' ') || ''
                                  return (
                                    <Link
                                      key={linkIdx}
                                      href={link}
                                      className="text-sm px-3 py-1 bg-purple-500/20 hover:bg-purple-500/40 rounded text-purple-300 transition-all"
                                    >
                                      {linkName}
                                    </Link>
                                  )
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ),
        },
        {
          title: "Why Myths Persist",
          content: (
            <div className="space-y-4">
              <p>
                Space myths often persist because they're repeated in movies, TV shows, and even some educational materials. Science fiction can be so compelling that it influences what people believe about real space science.
              </p>
              <p>
                The truth is often more complex and fascinating than the simplified myths. Real space science involves careful observation, mathematical models, and peer-reviewed research. When in doubt, always check reliable scientific sources!
              </p>
            </div>
          ),
        }
      ]}
      facts={[
        { fact: "Over 20 common myths debunked", icon: "🔍" },
        { fact: "Each myth paired with scientific fact", icon: "📚" },
        { fact: "Links to related pages for deeper learning", icon: "🔗" },
        { fact: "Separated by category for easy navigation", icon: "📑" },
      ]}
      relatedLinks={[
        { name: "Planets", href: "/planets" },
        { name: "Stars", href: "/stars" },
        { name: "Black Holes", href: "/black-holes" },
        { name: "Glossary", href: "/glossary" }
      ]}
    />
  )
}

