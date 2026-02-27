'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { spaceSections } from '@/data/spaceSections'
import spaceWhatsNewData from '@/data/spaceWhatsNew.json'
import SpaceHeroOverlay from '@/components/space/theme/SpaceHeroOverlay'
import SpaceSectionSeparator from '@/components/space/theme/SpaceSectionSeparator'
import SpaceStarfieldToggle from '@/components/space/theme/SpaceStarfieldToggle'
import CanvasStarfield from '@/components/space/CanvasStarfield'
import '@/app/space/theme/space-theme.css'
import '@/app/space/theme/space-micro-interactions.css'

// Select 6 key sections for landing (Academy/Handbook/Gallery/Lab/Map/Odyssey equivalents)
const getLandingSections = () => {
  const sections = [
    spaceSections.find(s => s.key === 'handbook'), // Academy equivalent
    spaceSections.find(s => s.key === 'handbook'), // Handbook
    spaceSections.find(s => s.key === 'media'), // Gallery
    spaceSections.find(s => s.key === 'lab'), // Lab
    spaceSections.find(s => s.key === 'observatory'), // Map equivalent
    spaceSections.find(s => s.key === 'experience'), // Odyssey equivalent
  ].filter(Boolean)
  
  // Fallback to first 6 if some are missing
  if (sections.length < 6) {
    return spaceSections.slice(0, 6)
  }
  return sections.slice(0, 6)
}

const LANDING_SECTIONS = getLandingSections()

export default function SpaceLandingPage() {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Get latest What's New entries (3 for compact display)
  const whatsNewEntries = spaceWhatsNewData.entries.slice(0, 3)

  return (
    <div className={`min-h-screen relative overflow-hidden ${reducedMotion ? 'motion-reduced' : ''}`}>
      {/* Starfield Background */}
      <SpaceStarfieldToggle defaultIntensity="high" showToggle={false} />

      {/* Star Haze Effect */}
      <div className="space-star-haze" aria-hidden="true" />

      {/* Hero Section - Cinematic */}
      <SpaceHeroOverlay
        title="HalfSPACE"
        titleAr="مستكشف الفضاء"
        subtitle="Your gateway to the cosmos - Explore, Learn, Discover"
        variant="cinematic"
      >
        <div className="space-hero-cta">
          <Link
            href="/space/hub"
            className="space-btn space-button-glow px-8 py-4 rounded-xl text-lg font-bold text-white border-2 border-purple-500/50 hover:border-purple-400 transition-all"
          >
            Enter Space Hub →
          </Link>
          <Link
            href="/space/handbook"
            className="space-btn space-button-glow px-8 py-4 rounded-xl text-lg font-bold text-white border-2 border-blue-500/50 hover:border-blue-400 transition-all"
          >
            Start Learning →
          </Link>
        </div>
      </SpaceHeroOverlay>

      {/* What's New Bar - Compact */}
      <section className="space-section relative z-10 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="space-whats-new-bar space-glass space-glass-hover p-4 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">✨</span>
              <h3 className="text-lg font-bold text-white">What's New</h3>
              <div className="flex-1 h-px bg-gradient-to-r from-purple-500/40 to-transparent" />
            </div>
            <div className="flex flex-wrap gap-4">
              {whatsNewEntries.map((entry) => (
                <Link
                  key={entry.id}
                  href={entry.link || '#'}
                  className="space-link flex-1 min-w-[200px] group"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-sm text-purple-300 font-semibold whitespace-nowrap">
                      {new Date(entry.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">
                        {entry.title}
                      </h4>
                      <p className="text-xs text-gray-400 line-clamp-1 mt-1">
                        {entry.summary}
                      </p>
                    </div>
                    <span className="text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SpaceSectionSeparator variant="glow" />

      {/* Main Sections Grid - 6 Cards */}
      <section className="space-section relative z-10 px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-bold mb-4 space-text-gradient space-heading-glow">
              Explore Space
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Choose your journey through the cosmos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {LANDING_SECTIONS.map((section, index) => {
              if (!section) return null;
              return (
              <Link
                key={section.key}
                href={section.href}
                className="space-card space-glass-card space-glass p-8 group relative overflow-hidden"
                style={{
                  animationDelay: reducedMotion ? '0s' : `${index * 0.1}s`,
                }}
              >
                {/* Gradient Background */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `radial-gradient(circle at ${50 + (index % 3) * 20}% ${30 + (index % 2) * 40}%, 
                        rgba(${index % 3 === 0 ? '139, 92, 246' : index % 3 === 1 ? '59, 130, 246' : '236, 72, 153'}, 0.2), 
                        transparent 70%)`,
                    }}
                  />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="text-7xl mb-6 text-center group-hover:scale-110 transition-transform duration-300">
                    {section.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:space-text-gradient transition-all">
                    {section.title}
                  </h3>
                  <p className="text-gray-400 mb-2 text-sm">{section.titleAr}</p>
                  <p className="text-gray-300 text-sm mb-6 line-clamp-2">
                    {section.description}
                  </p>
                  <div className="flex items-center text-purple-400 text-sm font-semibold group-hover:text-purple-300 group-hover:translate-x-2 transition-all">
                    Explore →
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div
                    className="absolute inset-0 rounded-xl"
                    style={{
                      boxShadow: `0 0 40px rgba(${
                        index % 3 === 0 ? '139, 92, 246' : index % 3 === 1 ? '59, 130, 246' : '236, 72, 153'
                      }, 0.4)`,
                    }}
                  />
                </div>
              </Link>
              );
            })}
          </div>
        </div>
      </section>

      <SpaceSectionSeparator variant="stars" />

      {/* Quick Stats / Footer CTA */}
      <section className="space-section relative z-10 px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="space-glass space-glass-hover p-8 rounded-2xl text-center">
            <h3 className="text-3xl font-bold space-text-gradient mb-4">
              Ready to Explore?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Join thousands exploring the cosmos. Start your journey today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/space/hub"
                className="space-btn space-button-glow px-8 py-4 rounded-xl text-lg font-bold text-white border-2 border-purple-500/50 hover:border-purple-400"
              >
                Browse All Sections →
              </Link>
              <Link
                href="/space/handbook"
                className="space-btn space-button-glow px-8 py-4 rounded-xl text-lg font-bold text-white border-2 border-blue-500/50 hover:border-blue-400"
              >
                Read Handbook →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .space-star-haze {
          position: fixed;
          inset: 0;
          background: 
            radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.1) 0%, transparent 60%);
          pointer-events: none;
          z-index: 1;
          animation: spaceHazeFloat 20s ease-in-out infinite;
        }

        @keyframes spaceHazeFloat {
          0%, 100% {
            opacity: 0.6;
            transform: translate(0, 0);
          }
          33% {
            opacity: 0.8;
            transform: translate(-2%, -1%);
          }
          66% {
            opacity: 0.7;
            transform: translate(2%, 1%);
          }
        }

        .space-hero-cta {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
          margin-top: 2rem;
        }

        .space-whats-new-bar {
          background: rgba(12, 16, 32, 0.9);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        /* Reduced Motion Support */
        .motion-reduced .space-star-haze {
          animation: none;
          opacity: 0.5;
        }

        .motion-reduced .space-card,
        .motion-reduced .space-btn,
        .motion-reduced .space-link {
          transition: none;
        }

        .motion-reduced .space-card:hover {
          transform: none;
        }

        /* Enhanced Card Animations */
        .space-card {
          animation: spaceCardFadeIn 0.6s ease-out both;
        }

        @keyframes spaceCardFadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .motion-reduced .space-card {
          animation: none;
        }

        /* Enhanced Hover Glow */
        .space-glass-card:hover {
          box-shadow: 
            var(--space-shadow-xl),
            0 0 30px rgba(139, 92, 246, 0.3),
            0 0 60px rgba(139, 92, 246, 0.1);
        }

        @media (max-width: 768px) {
          .space-hero-cta {
            flex-direction: column;
            align-items: stretch;
          }

          .space-hero-cta .space-btn {
            width: 100%;
            text-align: center;
          }

          .space-whats-new-bar .flex {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}
