'use client'

import CanvasStarfield from '@/components/space/CanvasStarfield'
import BlackHoleLab from '@/components/space/BlackHoleLab'
import blackHoleLabCopy from '@/data/blackHoleLab.copy.json'
import '@/app/space/space-page.css'

export default function BlackHoleLabPage() {
  const lang = 'en' // Could be made dynamic based on locale

  return (
    <div className="universe-portal min-h-screen relative overflow-hidden">
      <CanvasStarfield intensity="high" />

      <section className="relative z-10 pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <h1 className="text-6xl md:text-8xl font-black text-gradient space-heading-glow">
            {blackHoleLabCopy.title[lang]}
          </h1>
          <p className="text-2xl text-gray-200">{blackHoleLabCopy.subtitle[lang]}</p>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Explore the visual effects of black holes through gravitational lensing and accretion
            disk simulations. Adjust parameters to see how mass, distance, and spin affect the
            appearance.
          </p>
          <div className="inline-block w-36 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
        </div>
      </section>

      <section className="relative z-10 px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-3xl border-2 border-purple-500/30 p-6 md:p-10">
            <BlackHoleLab />
          </div>
        </div>
      </section>
    </div>
  )
}
