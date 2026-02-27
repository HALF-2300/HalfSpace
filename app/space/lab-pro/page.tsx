'use client'

import CanvasStarfield from '@/components/space/CanvasStarfield'
import LabProExperience from '@/components/space/lab-pro/LabProExperience'
import '@/app/space/space-page.css'

export default function SpaceLabProPage() {
  return (
    <div className="universe-portal min-h-screen relative overflow-hidden">
      <CanvasStarfield intensity="high" />

      <section className="relative z-10 pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <h1 className="text-5xl md:text-7xl font-black text-gradient space-heading-glow">
            Space Science Lab Pro
          </h1>
          <p className="text-xl text-gray-200">
            Hands-on stellar evolution, cosmology, and exoplanet exploration — plus myth-busting and adaptive quizzes.
          </p>
          <div className="inline-block w-36 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
        </div>
      </section>

      <section className="relative z-10 px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          <LabProExperience />
        </div>
      </section>
    </div>
  )
}
