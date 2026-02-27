'use client'

import CanvasStarfield from '@/components/space/CanvasStarfield'
import UniverseFlightExperience from '@/components/space/flight/UniverseFlightExperience'
import '@/app/space/space-page.css'

export default function SpaceFlightPage() {
  return (
    <div className="universe-portal min-h-screen relative overflow-hidden">
      <CanvasStarfield intensity="high" />

      <section className="relative z-10 pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <h1 className="text-5xl md:text-7xl font-black text-gradient space-heading-glow">
            Universe Flight
          </h1>
          <p className="text-xl text-gray-200">
            Glide along a cosmic spline from the CMB to the Solar System with optional manual control, performance modes, and a WebGL fallback.
          </p>
          <div className="inline-block w-36 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
        </div>
      </section>

      <section className="relative z-10 px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          <UniverseFlightExperience />
        </div>
      </section>
    </div>
  )
}
