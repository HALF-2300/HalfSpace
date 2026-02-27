import React from 'react'
import SimplePageLayout from '@/components/SimplePageLayout'
import exoplanetsData from '@/data/exoplanets.json'

export const metadata = {
  title: 'Exoplanets: Worlds Beyond Our Solar System | Space Explorer',
  description: 'Discover thousands of exoplanets orbiting distant stars, including potentially habitable worlds where life might exist.',
}

export default function ExoplanetsPage() {
  return (
    <SimplePageLayout
      title="Exoplanets: Worlds Beyond Our Solar System"
      subtitle="Thousands of planets orbiting distant stars - some might harbor life"
    >
      <div className="space-y-12">
        {/* Overview */}
        <section>
          <h2 className="text-3xl font-bold mb-4">The Exoplanet Revolution</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <div className="text-4xl mb-2">🪐</div>
              <div className="text-3xl font-bold text-blue-400">{exoplanetsData.overview.discovered}</div>
              <div className="text-gray-400">Confirmed Exoplanets</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <div className="text-4xl mb-2">🔭</div>
              <div className="text-lg text-gray-300">{exoplanetsData.overview.description}</div>
            </div>
          </div>
        </section>

        {/* Potentially Habitable Worlds */}
        <section>
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <span>🌍</span>
            <span>Potentially Habitable Worlds</span>
          </h2>
          <p className="text-gray-300 mb-6 text-lg">
            These planets orbit in the "habitable zone" where liquid water could exist - the key ingredient for life as we know it.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {exoplanetsData.potentiallyHabitable.map((planet, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-lg p-6 border border-blue-500/20 hover:border-blue-500/40 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-2xl font-bold text-blue-300">{planet.name}</h3>
                  <span className="text-sm bg-blue-500/20 px-3 py-1 rounded-full">{planet.distance}</span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Type:</span>
                    <span className="text-white font-medium">{planet.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Star:</span>
                    <span className="text-white">{planet.star}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Discovered:</span>
                    <span className="text-white">{planet.discovered}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Orbital Period:</span>
                    <span className="text-white">{planet.orbit}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-gray-300 text-sm mb-3">{planet.habitability}</p>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-white/5 rounded p-2">
                      <div className="text-xs text-gray-400">Water</div>
                      <div className="text-sm font-semibold text-blue-400">{planet.waterPossibility}</div>
                    </div>
                    <div className="flex-1 bg-white/5 rounded p-2">
                      <div className="text-xs text-gray-400">Atmosphere</div>
                      <div className="text-sm font-semibold text-purple-400">{planet.atmospherePossibility}</div>
                    </div>
                  </div>
                </div>

                {planet.significance && (
                  <div className="mt-3 text-xs text-yellow-400 bg-yellow-400/10 p-2 rounded">
                    ⭐ {planet.significance}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Exotic Worlds */}
        <section>
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <span>🌪️</span>
            <span>Exotic & Extreme Worlds</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exoplanetsData.exoticWorlds.map((world, index) => (
              <div key={index} className="bg-gradient-to-br from-red-900/20 to-orange-900/20 backdrop-blur-sm rounded-lg p-5 border border-orange-500/20 hover:scale-105 transition-transform">
                <h3 className="text-xl font-bold text-orange-300 mb-2">{world.name}</h3>
                <div className="text-sm text-gray-400 mb-2">{world.type}</div>
                <div className="text-lg font-semibold text-white mb-3">{world.feature}</div>
                <p className="text-sm text-gray-300">{world.description}</p>
                {world.temperature && (
                  <div className="mt-3 text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded inline-block">
                    🌡️ {world.temperature}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Planet Categories */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Types of Exoplanets</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(exoplanetsData.categories).map(([key, category]: [string, any]) => (
              <div key={key} className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                <h3 className="text-2xl font-bold text-blue-400 mb-2">{category.name}</h3>
                <p className="text-gray-300 mb-3">{category.description}</p>
                <div className="text-sm text-gray-400 mb-2">
                  <strong>Characteristics:</strong> {category.characteristics}
                </div>
                <div className="text-sm">
                  <strong className="text-gray-400">Examples:</strong>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {category.examples.map((example: string, i: number) => (
                      <span key={i} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Discovery Methods */}
        <section>
          <h2 className="text-3xl font-bold mb-6">How We Find Exoplanets</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(exoplanetsData.searchMethods).map(([key, method]: [string, any]) => (
              <div key={key} className="bg-gradient-to-br from-green-900/20 to-blue-900/20 backdrop-blur-sm rounded-lg p-6 border border-green-500/20">
                <h3 className="text-xl font-bold text-green-400 mb-2">{method.name}</h3>
                <p className="text-gray-300 mb-4">{method.description}</p>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-400">Advantages:</span>
                    <p className="text-white">{method.advantages}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Limitations:</span>
                    <p className="text-white">{method.limitations}</p>
                  </div>
                  <div className="mt-3 text-xs bg-green-500/20 text-green-300 px-3 py-2 rounded">
                    📊 {method.discoveries}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Discovery Timeline */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Historic Milestones</h2>
          <div className="space-y-3">
            {exoplanetsData.discoveryMilestones.map((milestone, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border-l-4 border-purple-500 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-purple-400 min-w-[80px]">{milestone.year}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-white mb-1">{milestone.event}</div>
                    <div className="text-sm text-gray-400">{milestone.details}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Future Searches */}
        <section>
          <h2 className="text-3xl font-bold mb-6">🔮 Future of Exoplanet Discovery</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(exoplanetsData.futureSearches).map(([key, mission]: [string, any]) => (
              <div key={key} className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-lg p-5 border border-purple-500/20">
                <h3 className="text-lg font-bold text-purple-300 mb-2">{key.toUpperCase().replace(/([A-Z])/g, ' $1').trim()}</h3>
                <p className="text-sm text-gray-300">{mission}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-lg p-8 border border-blue-500/20 text-center">
          <h2 className="text-3xl font-bold mb-4">The Search Continues</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Every day we discover new worlds orbiting distant stars. Some might have conditions suitable for life. 
            The James Webb Space Telescope is now studying their atmospheres in unprecedented detail, searching for 
            signs of life beyond Earth. We may be on the verge of answering humanity's oldest question: Are we alone?
          </p>
        </section>
      </div>
    </SimplePageLayout>
  )
}
