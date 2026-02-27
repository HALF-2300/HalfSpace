'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import DidYouKnow from '@/components/DidYouKnow'
import Timeline from '@/components/Timeline'
import Quiz from '@/components/Quiz'
import FactCard from '@/components/FactCard'
import ScrollReveal from '@/components/ScrollReveal'
import NextJump from '@/components/NextJump'
import MissionCard from '@/components/MissionCard'
import TodayInSpace from '@/components/TodayInSpace'
import IconicMissionsStrip from '@/components/IconicMissionsStrip'
import LightGallery from '@/components/LightGallery'
import SpaceFactsWidget from '@/components/SpaceFactsWidget'
import MissionStrip from '@/components/MissionStrip'
import GlossaryMini from '@/components/GlossaryMini'
import DidYouKnowMini from '@/components/DidYouKnowMini'
import TimelineMini from '@/components/TimelineMini'
import Starfield from '@/components/Starfield'
import HeroOverlay from '@/components/HeroOverlay'
import HeroCinematicOverlay from '@/components/HeroCinematicOverlay'
import SectionSeparator from '@/components/SectionSeparator'
import SpaceSectionSeparator from '@/components/SpaceSectionSeparator'
import SectionFadeTransition from '@/components/SectionFadeTransition'
import SimpleTooltip from '@/components/SimpleTooltip'
import { preloadHeroImage, getImageLoadingStrategy } from '@/utils/perf'
import { getButtonAriaLabel, getTextOverlayClasses } from '@/utils/a11y'
import { getIconButtonAriaLabel } from '@/utils/aria'
import { handleImageError, getFallbackImage, safeImageSrc } from '@/utils/imageFallback'
import { getPageBySlug } from '@/data/sitemap'

// Prefer real space imagery for the "Space" experience.
// Any Unsplash image is replaced with a deterministic NASA fallback (varies per page to reduce repeats).
const NASA_FALLBACK_POOL: string[] = [
  'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000136/GSFC_20171208_Archive_e000136~orig.jpg',
  'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001327/GSFC_20171208_Archive_e001327~orig.jpg',
  'https://images-assets.nasa.gov/image/PIA23122/PIA23122~orig.jpg',
  'https://images-assets.nasa.gov/image/PIA02873/PIA02873~orig.jpg',
  'https://images-assets.nasa.gov/image/PIA04591/PIA04591~orig.jpg',
  'https://images-assets.nasa.gov/image/PIA01492/PIA01492~orig.jpg',
  'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000282/GSFC_20171208_Archive_e000282~orig.jpg',
  'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000284/GSFC_20171208_Archive_e000284~orig.jpg',
  'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e002200/GSFC_20171208_Archive_e002200~orig.jpg',
  'https://images-assets.nasa.gov/image/PIA23122/PIA23122~orig.jpg',
]

function hashStringToIndex(input: string, modulo: number): number {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0
  }
  return modulo === 0 ? 0 : hash % modulo
}

function isUnsplash(url?: string): boolean {
  return Boolean(url && url.includes('images.unsplash.com'))
}

function uniqueStrings(items: Array<string | undefined | null>): string[] {
  const out: string[] = []
  const seen = new Set<string>()
  for (const item of items) {
    if (!item) continue
    if (seen.has(item)) continue
    seen.add(item)
    out.push(item)
  }
  return out
}

interface MissionHighlight {
  name: string
  agency: string
  year: string
  description: string
  image: string
  status: 'active' | 'completed' | 'planned'
  link?: string
}

interface QuickFact {
  label: string
  value: string
  icon?: string
}

interface SectionCTA {
  text: string
  href: string
  style?: 'primary' | 'secondary'
}

interface PageTemplateProps {
  title: string
  subtitle?: string
  heroImage: string
  heroImageAlt: string
  sections: {
    title: string
    tagline?: string
    shortFact?: string
    content: string | React.ReactNode
    image?: string
    imageAlt?: string
    quickFacts?: QuickFact[]
    highlightMissions?: MissionHighlight[]
    cta?: SectionCTA
  }[]
  relatedLinks?: { name: string; href: string }[]
  didYouKnow?: string[]
  timeline?: Array<{ year: string; title: string; description: string; icon?: string }>
  quiz?: Array<{ question: string; options: string[]; correct: number; explanation: string }>
  facts?: Array<{ fact: string; icon?: string }>
  showTodayInSpace?: boolean
  showIconicMissions?: boolean
  showSpaceFactsWidget?: boolean
  showMissionStrip?: boolean
  showGlossaryMini?: boolean
  showDidYouKnowMini?: boolean
  showTimelineMini?: boolean
  lang?: 'en' | 'ar' | 'es' | 'zh'
  galleryImages?: string[]
  galleryCategory?: 'solar-system' | 'missions' | 'black-holes' | 'stars' | 'telescopes'
  galleryViewMoreHref?: string
}

export default function PageTemplate({
  title,
  subtitle,
  heroImage,
  heroImageAlt,
  sections,
  relatedLinks,
  didYouKnow,
  timeline,
  quiz,
  facts,
  showTodayInSpace = false,
  showIconicMissions = false,
  showSpaceFactsWidget = false,
  showMissionStrip = false,
  showGlossaryMini = false,
  showDidYouKnowMini = false,
  showTimelineMini = false,
  lang = 'en',
  galleryImages,
  galleryCategory,
  galleryViewMoreHref
}: PageTemplateProps) {
  const pathname = usePathname()
  const derivedLang: 'en' | 'ar' | 'es' | 'zh' =
    pathname?.startsWith('/ar') ? 'ar' : pathname?.startsWith('/es') ? 'es' : pathname?.startsWith('/zh') ? 'zh' : 'en'
  const effectiveLang = lang || derivedLang
  const slug = pathname?.split('/').filter(Boolean).pop()
  const sitemapImage = slug ? getPageBySlug(slug, effectiveLang)?.image : undefined
  const fallbackKey = slug || title || 'space'
  const fallbackHero = NASA_FALLBACK_POOL[hashStringToIndex(fallbackKey, NASA_FALLBACK_POOL.length)]
  const effectiveHeroImage = isUnsplash(heroImage) ? (sitemapImage || fallbackHero) : heroImage

  useEffect(() => {
    // Preload hero image for faster initial render
    preloadHeroImage(effectiveHeroImage)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    )

    const sections = document.querySelectorAll('.gateway-section')
    sections.forEach((section) => observer.observe(section))

    return () => {
      sections.forEach((section) => observer.unobserve(section))
    }
  }, [effectiveHeroImage])

  return (
    <div className="pt-20 relative overflow-hidden">
      {/* Animated Starfield Background - uses star map mode */}
      <Starfield className="fixed inset-0 opacity-30" useStarMode={true} />

      {/* Hero Section - Cinematic Gateway */}
      <section className="relative h-[85vh] min-h-[700px] flex items-center justify-center overflow-hidden portal gateway-entrance">
        <div className="absolute inset-0">
          <Image
            src={safeImageSrc(effectiveHeroImage, getFallbackImage('hero'))}
            alt={heroImageAlt}
            fill
            className="object-cover scale-110 space-image-zoom space-hero-container"
            priority
            unoptimized={effectiveHeroImage?.startsWith('http')}
            sizes="100vw"
            quality={85}
            onError={(e) => handleImageError(e, getFallbackImage('hero'))}
          />
          {/* Multi-layer gradients for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-space-dark/95 to-space-dark" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-transparent to-blue-500/30" />
          <div className="absolute inset-0 bg-gradient-radial from-purple-500/10 via-transparent to-transparent" />
          
          {/* Hero Overlay - Cinematic gradient + star haze */}
          <HeroOverlay intensity="light" />
          <HeroCinematicOverlay intensity="medium" />
          
          {/* Animated light rays */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
          </div>
        </div>
        
        {/* Portal Effect Overlay */}
        <div className="absolute inset-0 portal-ring" />
        
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto animate-fade-in">
          <div className="mb-8 animate-float">
            <SimpleTooltip content={title} position="bottom">
              <div className="inline-block p-6 glass rounded-full border-2 border-purple-500/50 glow-purple">
                <span className="text-6xl" aria-label={`${title} icon`}>🌌</span>
              </div>
            </SimpleTooltip>
          </div>
          <h1 className={`text-7xl md:text-9xl font-bold mb-8 text-gradient animate-slide-up portal-title space-heading-glow space-aurora-bg ${getTextOverlayClasses()}`}>
            {title}
          </h1>
          {subtitle && (
            <p className={`text-3xl md:text-4xl text-gray-200 font-light mb-6 animate-slide-up ${getTextOverlayClasses()}`} style={{ animationDelay: '0.2s' }}>
              {subtitle}
            </p>
          )}
          <div className="mt-12 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="inline-block w-24 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-gray-400 font-semibold">Explore</span>
            <div className="w-6 h-10 border-2 border-purple-500 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-purple-500 rounded-full mt-2 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Did You Know Section */}
      {didYouKnow && didYouKnow.length > 0 && (
        <>
          <SectionSeparator variant="gradient" className="my-8" />
          {/* Space separator available: <SpaceSectionSeparator variant="subtle" /> */}
          <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <DidYouKnow facts={didYouKnow} />
          </div>
        </section>
        </>
      )}

      {/* Today in Space Widget */}
      {showTodayInSpace && (
        <section className="py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <TodayInSpace />
          </div>
        </section>
      )}

      {/* Iconic Missions Strip */}
      {showIconicMissions && (
        <>
          <SectionSeparator variant="subtle" className="my-8" />
          <section className="py-8 px-4 bg-space-deep/20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5" />
          <div className="max-w-7xl mx-auto relative z-10">
            <ScrollReveal>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-center text-gradient space-aurora-bg">
                Iconic Missions
              </h3>
            </ScrollReveal>
            <IconicMissionsStrip />
          </div>
        </section>
        </>
      )}

      {/* Space Facts Widget */}
      {showSpaceFactsWidget && (
        <section className="py-8 px-4 relative">
          <div className="max-w-4xl mx-auto">
            <SpaceFactsWidget lang={lang} />
          </div>
        </section>
      )}

      {/* Mission Strip (Enhanced) */}
      {showMissionStrip && (
        <section className="py-8 px-4 bg-space-deep/20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5" />
          <div className="max-w-7xl mx-auto relative z-10">
            <ScrollReveal>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-center text-gradient space-aurora-bg">
                {lang === 'ar' ? 'البعثات الأيقونية' : 'Iconic Missions'}
              </h3>
            </ScrollReveal>
            <MissionStrip lang={lang} />
          </div>
        </section>
      )}

      {/* Glossary Mini */}
      {showGlossaryMini && (
        <section className="py-8 px-4 relative">
          <div className="max-w-6xl mx-auto">
            <GlossaryMini lang={lang} />
          </div>
        </section>
      )}

      {/* Did You Know Mini */}
      {showDidYouKnowMini && (
        <section className="py-8 px-4 relative">
          <div className="max-w-6xl mx-auto">
            <DidYouKnowMini lang={lang} />
          </div>
        </section>
      )}

      {/* Timeline Mini */}
      {showTimelineMini && (
        <section className="py-8 px-4 relative">
          <div className="max-w-4xl mx-auto">
            <TimelineMini lang={lang} />
          </div>
        </section>
      )}

      {/* Content Sections - Gateway Transitions */}
      <section className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto space-y-32">
          {sections.map((section, index) => (
            <SectionFadeTransition key={index} delay={index * 100} showSeparator={index > 0}>
            <div
              className="relative gateway-section"
              data-section-index={index}
            >
              {/* Section Gateway Header */}
              <div className="text-center mb-16">
                <div className="inline-block mb-6">
                  <div className="flex items-center gap-4">
                    <div className="h-px w-20 bg-gradient-to-r from-transparent to-purple-500" />
                    <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse" />
                    <div className="h-px w-20 bg-gradient-to-l from-transparent to-purple-500" />
                  </div>
                </div>
                <h2 className="text-5xl md:text-7xl font-bold mb-4 text-gradient section-gateway-title space-heading-glow space-aurora-bg">
                  {section.title}
                </h2>
                {section.tagline && (
                  <p className="text-xl md:text-2xl text-gray-300 font-light mb-2 italic max-w-3xl mx-auto">
                    {section.tagline}
                  </p>
                )}
                {section.shortFact && (
                  <p className="text-sm md:text-base text-purple-300/80 mb-4 max-w-3xl mx-auto">
                    {section.shortFact}
                  </p>
                )}
                <div className="inline-block w-32 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
              </div>

              <div
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-16 items-center`}
              >
                <div className="flex-1 space-y-6">
                  <div className="text-gray-200 text-xl leading-relaxed space-y-6 prose prose-invert max-w-none">
                    {typeof section.content === 'string' ? (
                      <p className="text-lg md:text-xl">{section.content}</p>
                    ) : (
                      section.content
                    )}
                  </div>

                  {/* Quick Facts */}
                  {section.quickFacts && section.quickFacts.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                      {section.quickFacts.map((fact, factIndex) => (
                        <div
                          key={factIndex}
                          className="glass p-4 rounded-xl border border-purple-500/30 hover:border-purple-500/60 space-card-lift enhanced-card-glow"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            {fact.icon && (
                              <SimpleTooltip content={fact.label || fact.value} position="top">
                                <span className="text-2xl" aria-label={getIconButtonAriaLabel(fact.icon, fact.label || '')}>
                                  {fact.icon}
                                </span>
                              </SimpleTooltip>
                            )}
                            <div className="text-sm text-purple-400 font-semibold">{fact.label}</div>
                          </div>
                          <div className="text-lg md:text-xl font-bold text-white">{fact.value}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Mission Highlights */}
                  {section.highlightMissions && section.highlightMissions.length > 0 && (
                    <div className="mt-8">
                      <h4 className="text-2xl md:text-3xl font-bold mb-6 text-gradient space-heading-glow">
                        Featured Missions
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {section.highlightMissions.map((mission, missionIndex) => (
                          <MissionCard
                            key={missionIndex}
                            name={mission.name}
                            agency={mission.agency}
                            year={mission.year}
                            description={mission.description}
                            image={mission.image}
                            status={mission.status}
                            link={mission.link}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Call-to-Action */}
                  {section.cta && (
                    <div className="mt-8 flex justify-center md:justify-start">
                      <Link
                        href={section.cta.href}
                        aria-label={getButtonAriaLabel('Navigate to', section.cta.text)}
                        className={`px-8 py-4 rounded-xl font-bold text-lg space-button-glow enhanced-button-glow shadow-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-space-dark ${
                          section.cta.style === 'secondary'
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-2 border-blue-500/50'
                            : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-2 border-purple-500/50'
                        }`}
                      >
                        {section.cta.text} →
                      </Link>
                    </div>
                  )}
                </div>
                {section.image && (
                  <div className="flex-1 relative w-full rounded-3xl overflow-hidden border-2 border-purple-500/30 hover:border-purple-500/70 space-card-lift glow-purple enhanced-card-glow group" style={{ aspectRatio: '16/9', minHeight: '500px' }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-space-dark/50 to-transparent z-10" />
                    {(() => {
                      const sectionFallbackKey = `${fallbackKey}-section-${index}`
                      const sectionFallback = NASA_FALLBACK_POOL[hashStringToIndex(sectionFallbackKey, NASA_FALLBACK_POOL.length)]
                      const effectiveSectionImage = isUnsplash(section.image) ? sectionFallback : section.image
                      return (
                        <Image
                          src={safeImageSrc(effectiveSectionImage, getFallbackImage('section'))}
                          alt={section.imageAlt || section.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-1000"
                          unoptimized={effectiveSectionImage?.startsWith('http')}
                          loading={getImageLoadingStrategy(false, index < 2)}
                          sizes="(max-width: 768px) 100vw, 50vw"
                          quality={80}
                          onError={(e) => handleImageError(e, getFallbackImage('section'))}
                        />
                      )
                    })()}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-transparent to-blue-500/0 group-hover:from-purple-500/20 group-hover:to-blue-500/20 transition-all duration-700 z-20" />
                  </div>
                )}
              </div>
            </div>
            </SectionFadeTransition>
          ))}
        </div>
      </section>

      {/* Light Gallery */}
      {(galleryImages || galleryCategory) && (
        <section className="py-20 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent" />
          <div className="max-w-7xl mx-auto relative z-10">
            <ScrollReveal>
              <h3 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gradient space-heading-glow">
                Gallery
              </h3>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <LightGallery
                images={uniqueStrings(galleryImages || [])}
                category={galleryCategory}
                viewMoreHref={galleryViewMoreHref}
              />
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Facts Grid */}
      {facts && facts.length > 0 && (
        <section className="py-20 px-4 bg-space-deep/30 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />
          <div className="max-w-7xl mx-auto relative z-10">
            <ScrollReveal>
              <h3 className="text-5xl md:text-6xl font-bold text-center mb-16 text-gradient space-heading-glow">
                Amazing Facts
              </h3>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {facts.map((item, index) => (
                <ScrollReveal key={index} delay={index * 100}>
                  <FactCard
                    fact={item.fact}
                    icon={item.icon}
                  />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Timeline */}
      {timeline && timeline.length > 0 && (
        <section className="py-20 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5" />
          <div className="max-w-5xl mx-auto relative z-10">
            <ScrollReveal>
              <h3 className="text-5xl md:text-6xl font-bold text-center mb-16 text-gradient space-heading-glow">
                Timeline
              </h3>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <div className="glass rounded-3xl p-10 border-2 border-purple-500/30 hover:border-purple-500/50 transition-all glow-purple">
                <Timeline events={timeline} />
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Quiz */}
      {quiz && quiz.length > 0 && (
        <section className="py-20 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent" />
          <div className="max-w-4xl mx-auto relative z-10">
            <ScrollReveal>
              <h3 className="text-5xl md:text-6xl font-bold text-center mb-16 text-gradient space-heading-glow">
                Test Your Knowledge
              </h3>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <div className="glass rounded-3xl p-10 border-2 border-blue-500/30 hover:border-blue-500/50 transition-all">
                <Quiz questions={quiz} title={`${title} Quiz`} />
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Next Jump Module */}
      {relatedLinks && relatedLinks.length > 0 && (
        <NextJump
          currentPage={title}
          recommendations={relatedLinks.map((link, index) => ({
            name: link.name,
            href: link.href,
            description: `Explore ${link.name.toLowerCase()} and discover more cosmic wonders`,
            icon: index === 0 ? '⭐' : index === 1 ? '🚀' : '🌌'
          }))}
        />
      )}

    </div>
  )
}

