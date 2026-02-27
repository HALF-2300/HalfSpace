'use client'

import Link from 'next/link'
import { spaceSections } from '@/data/spaceSections'
import CanvasStarfield from '@/components/space/CanvasStarfield'
import DeepUniverseInsightWidget from '@/components/space/widgets/DeepUniverseInsightWidget'
import '@/app/space/space-page.css'

export default function SpacePortalPage() {
  return (
    <div className="space-portal min-h-screen relative overflow-hidden">
      {/* Background Canvas Starfield */}
      <CanvasStarfield intensity="high" />
      
      {/* Hero Section */}
      <section className="relative z-10 pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-7xl md:text-9xl font-bold mb-6 text-gradient universe-title space-heading-glow">
              Space Portal
            </h1>
            <p className="text-2xl md:text-3xl text-gray-200 font-light mb-4">
              A unified gateway to every Space page
            </p>
            <div className="inline-block w-32 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="relative z-10 px-4 pb-12">
        <div className="max-w-5xl mx-auto">
          <div className="glass rounded-3xl border border-purple-500/30 px-6 md:px-10 py-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-3">
              A Vision Beyond Comparison
            </h2>
            <p className="text-gray-300 leading-relaxed max-w-3xl mx-auto mb-8">
              This experience is not built to compete with other space websites. It is a
              singular journey crafted to inspire wonder, focus, and deep curiosity about the
              universe through its own voice and vision.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-purple-500/20 bg-purple-500/10 p-5">
                <h3 className="text-lg font-semibold text-purple-200 mb-2">Original Vision</h3>
                <p className="text-sm text-gray-300">
                  A distinct creative identity, not a comparison.
                </p>
              </div>
              <div className="rounded-2xl border border-purple-500/20 bg-purple-500/10 p-5">
                <h3 className="text-lg font-semibold text-purple-200 mb-2">Focused Wonder</h3>
                <p className="text-sm text-gray-300">
                  Designed to calm the mind and expand imagination.
                </p>
              </div>
              <div className="rounded-2xl border border-purple-500/20 bg-purple-500/10 p-5">
                <h3 className="text-lg font-semibold text-purple-200 mb-2">Always Evolving</h3>
                <p className="text-sm text-gray-300">
                  A living universe that keeps growing with purpose.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New: Deep Universe Insights */}
      <section className="relative z-10 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-3xl border border-purple-500/30 px-6 md:px-10 py-8">
            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
              <div className="flex-1">
                <p className="text-xs md:text-sm font-semibold tracking-[0.25em] uppercase text-purple-200/80">
                  NEW · Deep Universe
                </p>
                <h2 className="mt-2 text-3xl md:text-4xl font-bold text-gradient">
                  Fresh space & universe information — with excitement
                </h2>
                <p className="mt-3 text-gray-300 leading-relaxed max-w-3xl">
                  A brand-new collection of insights that weren&apos;t in the site before: cosmic “sound”, galaxy-sized
                  gravitational-wave detectors, interstellar visitors, where gold is born, and more.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href="/space/deep-universe"
                    className="inline-flex items-center gap-2 rounded-lg border border-purple-400/40 bg-purple-500/10 px-4 py-2 text-sm font-semibold text-white hover:border-purple-300 hover:bg-purple-500/20 transition-colors"
                  >
                    <span>Enter Deep Universe</span>
                    <span>→</span>
                  </Link>
                  <span className="text-xs text-gray-400 flex items-center">English-only descriptions</span>
                </div>
              </div>

              <div className="w-full lg:w-[420px]">
                <DeepUniverseInsightWidget />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Space Sections Grid */}
      <section className="relative z-10 px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spaceSections.map((section) => (
              <Link
                key={section.key}
                href={section.href}
                className="group space-portal-card glass rounded-2xl border-2 border-purple-500/30 hover:border-purple-500/70 p-6 transition-all transform hover:scale-105 hover:z-10 relative overflow-hidden"
              >
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="mb-4 text-6xl transform group-hover:scale-110 transition-transform duration-300">
                    {section.icon}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gradient mb-3 group-hover:text-purple-300 transition-colors">
                    {section.title}
                  </h3>
                  
                  {/* Subtitle */}
                  <h4 className="text-xl font-semibold text-gray-300 mb-4">
                    {section.titleAr}
                  </h4>
                  
                  {/* Description - Two lines */}
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-2">
                    {section.description}
                  </p>
                  
                  {/* Entry Button */}
                  <div className="flex items-center justify-between">
                    <span className="text-purple-400 font-semibold group-hover:text-purple-300 transition-colors">
                      Enter →
                    </span>
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center group-hover:bg-purple-500/30 group-hover:border-purple-500 transition-all">
                      <svg
                        className="w-4 h-4 text-purple-400 transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            
            {/* Gallery Card - Special addition */}
            <Link
              href="/space/gallery"
              className="group space-portal-card glass rounded-2xl border-2 border-purple-500/30 hover:border-purple-500/70 p-6 transition-all transform hover:scale-105 hover:z-10 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="mb-4 text-6xl transform group-hover:scale-110 transition-transform duration-300">
                  🖼️
                </div>
                <h3 className="text-2xl font-bold text-gradient mb-3 group-hover:text-purple-300 transition-colors">
                  Gallery
                </h3>
                <h4 className="text-xl font-semibold text-gray-300 mb-4">
                  Image Gallery
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-2">
                  A curated space image gallery with lightbox viewing and multiple categories.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-purple-400 font-semibold group-hover:text-purple-300 transition-colors">
                    Enter →
                  </span>
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center group-hover:bg-purple-500/30 group-hover:border-purple-500 transition-all">
                    <svg
                      className="w-4 h-4 text-purple-400 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
