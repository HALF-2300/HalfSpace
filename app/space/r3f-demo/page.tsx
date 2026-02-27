'use client'

import CanvasStarfield from '@/components/space/CanvasStarfield'
import R3FDemoScene from '@/components/space/r3f-demo/R3FDemoScene'
import '@/app/space/space-page.css'

export default function R3FDemoPage() {
  return (
    <div className="universe-portal min-h-screen relative overflow-hidden">
      <CanvasStarfield intensity="medium" />

      <section className="relative z-10 pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <h1 className="text-5xl md:text-7xl font-black text-gradient space-heading-glow">R3F Demo Lab</h1>
          <p className="text-xl text-gray-200">
            A React Three Fiber + Drei mini scene with bloom, depth-of-field, stars, and Orbit controls. Drop-in starter for richer 3D UI.
          </p>
          <div className="inline-block w-36 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
        </div>
      </section>

      <section className="relative z-10 px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          <R3FDemoScene />
        </div>
      </section>
    </div>
  )
}
