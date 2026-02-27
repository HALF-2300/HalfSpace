'use client'

import CanvasStarfield from '@/components/space/CanvasStarfield'
import SpaceSectionSeparator from '@/components/SpaceSectionSeparator'
import WeirdSpaceLibraryClient from '@/components/space/weird/WeirdSpaceLibraryClient'
import '@/app/space/space-page.css'

export default function WeirdSpaceLibraryPage() {
  return (
    <div className="universe-portal min-h-screen relative overflow-hidden">
      <CanvasStarfield intensity="high" />

      <section className="relative z-10 pt-24 pb-10 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-3 px-4 py-2 glass border border-purple-500/40 rounded-full text-sm uppercase tracking-[0.2em] text-purple-200">
            <span>Weird Space Library</span>
            <span className="text-purple-400">|</span>
            <span>Weird but true</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-gradient space-heading-glow">Weird Space Library</h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
            120 facts that are weird, real, and fun — with tags, quick numbers, myth warnings, and a deep‑dive modal.
          </p>
        </div>
      </section>

      <section className="relative z-10 px-4 pb-14">
        <div className="max-w-7xl mx-auto">
          <WeirdSpaceLibraryClient />
        </div>
      </section>

      <SpaceSectionSeparator />
    </div>
  )
}

