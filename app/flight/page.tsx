'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UniverseFlight } from '@/components/flight'

export default function FlightPage() {
  const router = useRouter()
  const [showIntro, setShowIntro] = useState(true)

  const handleExit = () => {
    router.push('/')
  }

  const handleStart = () => {
    setShowIntro(false)
  }

  if (showIntro) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4">
        <div className="max-w-lg text-center">
          <div className="text-6xl mb-6">🚀</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Universe Flight
          </h1>
          <p className="text-lg text-gray-400 mb-8">
            Fly through the cosmos. Visit planets, stars, and galaxies. 
            Experience the universe like never before.
          </p>
          
          <div className="bg-gray-900/50 rounded-xl p-6 mb-8 text-left">
            <h3 className="text-white font-semibold mb-4">Quick Controls</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="text-gray-400">
                <span className="text-purple-400 font-mono">W/S</span> Forward/Back
              </div>
              <div className="text-gray-400">
                <span className="text-purple-400 font-mono">A/D</span> Strafe Left/Right
              </div>
              <div className="text-gray-400">
                <span className="text-purple-400 font-mono">Q/E</span> Up/Down
              </div>
              <div className="text-gray-400">
                <span className="text-purple-400 font-mono">Mouse</span> Look Around
              </div>
              <div className="text-gray-400">
                <span className="text-purple-400 font-mono">F</span> Warp Speed
              </div>
              <div className="text-gray-400">
                <span className="text-purple-400 font-mono">Enter</span> Land on Destination
              </div>
            </div>
          </div>

          <button
            onClick={handleStart}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg shadow-purple-500/30"
          >
            Launch Flight →
          </button>
          
          <button
            onClick={handleExit}
            className="block mx-auto mt-4 text-gray-500 hover:text-gray-300 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    )
  }

  return <UniverseFlight onExit={handleExit} />
}
