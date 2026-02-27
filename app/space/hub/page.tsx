'use client'

import { useState } from 'react'
import Link from 'next/link'
import { spaceSections } from '@/data/spaceSections'
import spaceSitemapData from '@/data/spaceSitemap.json'
import spaceWhatsNewData from '@/data/spaceWhatsNew.json'
import SpaceHeroOverlay from '@/components/space/theme/SpaceHeroOverlay'
import SpaceSectionSeparator from '@/components/space/theme/SpaceSectionSeparator'
import SpaceStarfieldToggle from '@/components/space/theme/SpaceStarfieldToggle'
import UnifiedSpaceSearch from '@/components/SpaceSearch/SpaceSearch'
import CanvasStarfield from '@/components/space/CanvasStarfield'
import '@/app/space/theme/space-theme.css'
import '@/app/space/theme/space-micro-interactions.css'

export default function SpaceHubPage() {
  const [searchQuery, setSearchQuery] = useState('')

  // Get featured sections from spaceSitemap
  const featuredRoutes = spaceSitemapData.routes
    .filter((route) => route.featured)
    .slice(0, 6)
    .sort((a, b) => (b.priority || 0) - (a.priority || 0))

  // Get latest What's New entries
  const whatsNewEntries = spaceWhatsNewData.entries.slice(0, 6)

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Starfield Background */}
      <SpaceStarfieldToggle defaultIntensity="medium" />

      {/* Hero Section */}
      <SpaceHeroOverlay
        title="Space Hub"
        titleAr="بوابة الفضاء"
        subtitle="Your unified gateway to all Space sections, search, and latest updates"
        variant="cinematic"
      />

      {/* Featured Sections Grid */}
      <section className="space-section relative z-10 px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-bold mb-4 space-text-gradient space-heading-glow">
              Space Sections
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Explore all Space sections and features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {spaceSections.map((section) => (
              <Link
                key={section.key}
                href={section.href}
                className="space-card space-glass-card space-glass p-6 group"
              >
                <div className="text-6xl mb-4 text-center group-hover:scale-110 transition-transform">
                  {section.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:space-text-gradient transition-all">
                  {section.title}
                </h3>
                <p className="text-gray-400 mb-2 text-sm">{section.titleAr}</p>
                <p className="text-gray-300 text-sm">{section.description}</p>
                <div className="mt-4 flex items-center text-purple-400 text-sm font-semibold group-hover:text-purple-300">
                  Explore →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SpaceSectionSeparator variant="glow" />

      {/* Featured Routes */}
      <section className="space-section relative z-10 px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-bold mb-4 space-text-gradient space-heading-glow">
              Featured Content
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Explore highlighted space topics and pages
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {featuredRoutes.map((route) => (
              <Link
                key={route.slug}
                href={route.path}
                className="space-card space-glass-card space-glass p-6 group relative overflow-hidden"
              >
                {route.image && (
                  <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                    <img
                      src={route.image}
                      alt={route.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:space-text-gradient transition-all">
                    {route.title}
                  </h3>
                  <p className="text-gray-400 mb-2 text-sm">{route.titleAr}</p>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                    {route.summary}
                  </p>
                  {route.tags && route.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {route.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs bg-purple-500/20 border border-purple-500/30 rounded text-purple-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center text-purple-400 text-sm font-semibold group-hover:text-purple-300">
                    Read More →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SpaceSectionSeparator variant="stars" />

      {/* Unified Search */}
      <section className="space-section relative z-10 px-4 py-12" id="space-search">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-bold mb-4 space-text-gradient space-heading-glow">
              Unified Search
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-2">
              Search across handbook, glossary, missions, facts, gallery, and more
            </p>
            <p className="text-sm text-gray-400">
              نتائج مصنّفة حسب النوع مع highlight
            </p>
          </div>
          <UnifiedSpaceSearch />
        </div>
      </section>

      <SpaceSectionSeparator variant="gradient" />

      {/* What's New */}
      <section className="space-section relative z-10 px-4 py-12" id="whats-new">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-bold mb-4 space-text-gradient space-heading-glow">
              What's New
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Latest updates and additions to Space
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whatsNewEntries.map((entry) => (
              <Link
                key={entry.id}
                href={entry.link || '#'}
                className="space-card space-glass-card space-glass p-6 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-purple-300 font-semibold">
                    {new Date(entry.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  {entry.tags && entry.tags.length > 0 && (
                    <span className="px-2 py-1 text-xs bg-purple-500/20 border border-purple-500/30 rounded text-purple-300">
                      {entry.tags[0]}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:space-text-gradient transition-all">
                  {entry.title}
                </h3>
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  {entry.summary}
                </p>
                <div className="flex items-center text-purple-400 text-sm font-semibold group-hover:text-purple-300">
                  Learn More →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
