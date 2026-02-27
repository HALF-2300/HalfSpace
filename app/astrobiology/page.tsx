import React from 'react'
import SimplePageLayout from '@/components/SimplePageLayout'
import astrobiologyData from '@/data/astrobiology.json'

export const metadata = {
  title: 'Astrobiology: The Search for Life in the Universe | Space Explorer',
  description: 'Explore the scientific search for life beyond Earth - from microbes on Mars to intelligent civilizations among the stars.',
}

export default function AstrobiologyPage() {
  return (
    <SimplePageLayout
      title="Astrobiology: The Search for Life"
      subtitle="Are we alone in the universe? Science is searching for answers"
    >
      <div className="space-y-12">
        {/* Overview */}
        <section className="text-center">
          <h2 className="text-4xl font-bold mb-4">{astrobiologyData.overview.keyQuestion}</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {astrobiologyData.overview.description}
          </p>
        </section>

        {/* Where to Look */}
        <section>
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <span>🔍</span>
            <span>Where We're Looking for Life</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(astrobiologyData.whereToLookForLife).map(([key, location]: [string, any]) => (
              <div key={key} className="bg-gradient-to-br from-green-900/30 to-blue-900/30 backdrop-blur-sm rounded-lg p-6 border border-green-500/20 hover:border-green-500/40 transition-all">
                <h3 className="text-2xl font-bold text-green-400 mb-3">{location.target}</h3>
                
                {location.evidence && (
                  <div className="mb-3">
                    <div className="text-sm text-gray-400 mb-1">Evidence:</div>
                    <div className="text-white">{location.evidence}</div>
                  </div>
                )}
                
                {location.currentSearch && (
                  <div className="mb-3">
                    <div className="text-sm text-gray-400 mb-1">Current Search:</div>
                    <div className="text-white">{location.currentSearch}</div>
                  </div>
                )}
                
                {location.missions && (
                  <div className="mb-3">
                    <div className="text-sm text-gray-400 mb-1">Missions:</div>
                    <div className="text-white">{location.missions}</div>
                  </div>
                )}
                
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="text-sm text-gray-400 mb-1">Potential:</div>
                  <div className="text-sm text-green-300 font-semibold">{location.potential}</div>
                </div>
                
                {location.examples && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {location.examples.map((example: string, i: number) => (
                      <span key={i} className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                        {example}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Biosignatures */}
        <section>
          <h2 className="text-3xl font-bold mb-6">🧬 How to Detect Life</h2>
          <div className="space-y-6">
            {/* Atmospheric */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <h3 className="text-2xl font-bold text-blue-400 mb-4">Atmospheric Biosignatures</h3>
              <p className="text-gray-300 mb-4">Gases in a planet's atmosphere that could indicate life:</p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(astrobiologyData.biosignatures.atmospheric).map(([key, value]: [string, any]) => (
                  <div key={key} className="bg-blue-500/10 rounded p-4">
                    <div className="font-bold text-blue-300 mb-2">{key.toUpperCase()}</div>
                    <div className="text-sm text-gray-300">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Surface */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <h3 className="text-2xl font-bold text-green-400 mb-4">Surface Biosignatures</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {Object.entries(astrobiologyData.biosignatures.surface).map(([key, value]: [string, any]) => (
                  <div key={key} className="bg-green-500/10 rounded p-4">
                    <div className="font-bold text-green-300 mb-2">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
                    <div className="text-sm text-gray-300">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Technosignatures */}
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
              <h3 className="text-2xl font-bold text-purple-400 mb-4">Technosignatures - Signs of Technology</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(astrobiologyData.biosignatures.technosignatures).map(([key, value]: [string, any]) => (
                  <div key={key} className="bg-purple-500/10 rounded p-4">
                    <div className="font-bold text-purple-300 mb-2">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
                    <div className="text-sm text-gray-300">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Extremophiles */}
        <section>
          <h2 className="text-3xl font-bold mb-6">🦠 Life in Extreme Conditions</h2>
          <p className="text-gray-300 mb-6 text-lg">{astrobiologyData.extremophiles.description}</p>
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(astrobiologyData.extremophiles.types).map(([key, type]: [string, any]) => (
              <div key={key} className="bg-gradient-to-br from-red-900/20 to-orange-900/20 backdrop-blur-sm rounded-lg p-6 border border-orange-500/20">
                <h3 className="text-xl font-bold text-orange-400 mb-3">{key.charAt(0).toUpperCase() + key.slice(1)}</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-400">Environment:</span>
                    <span className="text-white ml-2">{type.environment}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">
                      {type.temperature ? 'Temperature:' : type.pH ? 'pH:' : type.salinity ? 'Salinity:' : type.tolerance ? 'Tolerance:' : type.pressure ? 'Pressure:' : 'Depth:'}
                    </span>
                    <span className="text-white ml-2">{type.temperature || type.pH || type.salinity || type.tolerance || type.pressure || type.depth}</span>
                  </div>
                  <div className="pt-2 border-t border-white/10">
                    <span className="text-gray-400">Implication:</span>
                    <p className="text-green-300 mt-1">{type.implication}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Alternative Life */}
        <section>
          <h2 className="text-3xl font-bold mb-6">👽 Life Built Differently</h2>
          <p className="text-gray-300 mb-6">Life on Earth is carbon-based and uses water. But could life use different chemistry?</p>
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(astrobiologyData.lifeBuiltDifferently).map(([key, life]: [string, any]) => (
              <div key={key} className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                <h3 className="text-xl font-bold text-cyan-400 mb-3">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="text-gray-400">Concept:</span> <span className="text-white">{life.concept}</span></div>
                  {life.environments && <div><span className="text-gray-400">Environments:</span> <span className="text-white">{life.environments}</span></div>}
                  {life.location && <div><span className="text-gray-400">Location:</span> <span className="text-white">{life.location}</span></div>}
                  {life.temperature && <div><span className="text-gray-400">Temperature:</span> <span className="text-white">{life.temperature}</span></div>}
                  {life.chemistry && <div><span className="text-gray-400">Chemistry:</span> <span className="text-white">{life.chemistry}</span></div>}
                  {life.challenges && <div><span className="text-gray-400">Challenges:</span> <span className="text-white">{life.challenges}</span></div>}
                  {life.implication && <div className="pt-2 border-t border-white/10"><span className="text-gray-400">Implication:</span> <span className="text-cyan-300">{life.implication}</span></div>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Drake Equation */}
        <section className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur-sm rounded-lg p-8 border border-purple-500/20">
          <h2 className="text-3xl font-bold mb-4">📐 The Drake Equation</h2>
          <p className="text-gray-300 mb-4">{astrobiologyData.drakeEquation.description}</p>
          <div className="bg-black/30 p-6 rounded-lg mb-6">
            <div className="text-2xl font-mono text-center text-blue-400">{astrobiologyData.drakeEquation.formula}</div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(astrobiologyData.drakeEquation.factors).map(([key, value]: [string, any]) => (
              <div key={key} className="bg-white/5 p-4 rounded">
                <div className="text-lg font-bold text-purple-400 mb-1">{key}</div>
                <div className="text-sm text-gray-300">{value}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center text-yellow-400">
            {astrobiologyData.drakeEquation.currentEstimates}
          </div>
        </section>

        {/* Fermi Paradox */}
        <section>
          <h2 className="text-3xl font-bold mb-6">🤔 The Fermi Paradox</h2>
          <div className="bg-red-900/20 backdrop-blur-sm rounded-lg p-6 border border-red-500/20 mb-6">
            <h3 className="text-2xl font-bold text-red-400 mb-3">{astrobiologyData.fermiParadox.question}</h3>
            <p className="text-gray-300 text-lg">If the universe is so vast and old, why haven't we detected any signs of alien civilizations?</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {astrobiologyData.fermiParadox.possibleAnswers.map((answer, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <p className="text-white">{answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SETI */}
        <section>
          <h2 className="text-3xl font-bold mb-6">📡 SETI: Search for Extraterrestrial Intelligence</h2>
          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-lg p-6 border border-blue-500/20 mb-6">
            <p className="text-gray-300 mb-4">{astrobiologyData.seti.fullName}</p>
            <div className="space-y-2">
              {astrobiologyData.seti.methods.map((method, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="text-blue-400">▸</span>
                  <span className="text-white">{method}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-yellow-900/20 backdrop-blur-sm rounded-lg p-6 border border-yellow-500/20">
              <h3 className="text-xl font-bold text-yellow-400 mb-2">The "Wow!" Signal</h3>
              <p className="text-gray-300">{astrobiologyData.seti.wowSignal}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <h3 className="text-xl font-bold text-gray-300 mb-2">Results So Far</h3>
              <p className="text-gray-300">{astrobiologyData.seti.results}</p>
            </div>
          </div>
        </section>

        {/* Current Missions */}
        <section>
          <h2 className="text-3xl font-bold mb-6">🚀 Current Missions Searching for Life</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(astrobiologyData.currentMissions).map(([key, mission]: [string, any]) => (
              <div key={key} className="bg-gradient-to-br from-green-900/20 to-blue-900/20 backdrop-blur-sm rounded-lg p-5 border border-green-500/20">
                <h3 className="text-lg font-bold text-green-400 mb-2">{key.replace(/([A-Z])/g, ' $1').trim().toUpperCase()}</h3>
                <p className="text-sm text-gray-300">{mission}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-lg p-8 border border-blue-500/20 text-center">
          <h2 className="text-3xl font-bold mb-4">The Greatest Question</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            The search for life beyond Earth is one of humanity's most profound scientific endeavors. 
            Whether we find microbes on Mars, detect biosignatures in an exoplanet's atmosphere, 
            or receive a signal from an intelligent civilization, the discovery of life elsewhere would 
            fundamentally change our understanding of our place in the cosmos. The answer is out there, 
            waiting to be found.
          </p>
        </section>
      </div>
    </SimplePageLayout>
  )
}
