import Link from 'next/link'
import CanvasStarfield from '@/components/space/CanvasStarfield'
import { spaceSections } from '@/data/spaceSections'
import '@/app/space/space-page.css'

export const metadata = {
  title: 'Space Home',
  description: 'A single Space Home portal that gathers every section in one place.',
}

export default function SpaceHomePage() {
  const sectionCards = spaceSections.filter((section) => section.key !== 'home')

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <CanvasStarfield intensity="high" />

      <section className="relative z-10 pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xs md:text-sm font-semibold tracking-[0.25em] uppercase text-purple-200/80">
            Space Home
          </p>
          <h1 className="mt-3 text-5xl md:text-7xl font-bold text-gradient space-heading-glow">
            Space Gateway
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
            A unified launchpad connecting everything Space: Experience, Lab, Library, Observatory, and Handbook — all
            from one clear entry point.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {spaceSections.map((section) => (
              <Link
                key={section.key}
                href={section.href}
                className={`glass border border-white/10 px-4 py-2 rounded-full text-sm md:text-base hover:border-purple-400 hover:bg-purple-500/10 transition-colors ${
                  section.key === 'home' ? 'border-purple-500/50 bg-purple-500/15' : ''
                }`}
              >
                <span className="mr-2">{section.icon}</span>
                <span>{section.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-4 pb-12">
        <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-2">
          {sectionCards.map((section) => (
            <div key={section.key} className="glass border border-white/10 rounded-2xl p-6 shadow-lg bg-black/40">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-purple-200/70">Space · {section.title}</p>
                  <h3 className="mt-2 text-2xl font-bold text-white flex items-center gap-2">
                    <span className="text-3xl">{section.icon}</span>
                    <span>{section.title}</span>
                  </h3>
                  <p className="mt-3 text-sm md:text-base text-gray-200 leading-relaxed">{section.description}</p>
                </div>
                <span className="text-4xl opacity-70">{section.icon}</span>
              </div>

              <div className="mt-6 flex items-center justify-between gap-3">
                <span className="text-xs text-white/70">Space &gt; {section.title}</span>
                <Link
                  href={section.href}
                  className="inline-flex items-center gap-2 rounded-lg border border-purple-400/40 bg-purple-500/10 px-4 py-2 text-sm font-semibold text-white hover:border-purple-300 hover:bg-purple-500/20 transition-colors"
                >
                  <span>Enter</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 px-4 pb-20">
        <div className="max-w-6xl mx-auto glass border border-white/10 rounded-2xl p-6 bg-black/40 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h4 className="text-xl font-bold text-white">Quick Nav · Space</h4>
              <p className="text-sm text-gray-200 mt-1">
                Fast navigation between the main sections without leaving the experience.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {sectionCards.map((section) => (
                <Link
                  key={section.key}
                  href={section.href}
                  className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs md:text-sm text-white hover:border-purple-300 hover:bg-purple-500/10 transition-colors"
                >
                  <span>{section.icon}</span>
                  <span>{section.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
