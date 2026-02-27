'use client'

import Link from 'next/link'
import TwinSigil from '@/components/TwinSigil'
import FactOfDay from '@/components/FactOfDay'
import HeroKicker from '@/components/HeroKicker'
import FeaturedNavCards from '@/components/FeaturedNavCards'
import EnhancedHero from '@/components/EnhancedHero'
import AmbientStarfield from '@/components/AmbientStarfield'
import StarfieldToggle from '@/components/StarfieldToggle'
import ExploreStats from '@/components/ExploreStats'
import SpaceLogo from '@/components/SpaceLogo'
import SpaceFlightExperience from '@/components/SpaceFlightExperience'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import type { Locale } from '@/data/sitemap'

const homeCopy: Record<Locale, {
  tagline: string
  experiences: string
  experiencesHot: string
  startExploring: string
  spaceJourney: string
}> = {
  en: {
    tagline: "This site isn't competing with others — it stands as a unique vision of space.",
    experiences: '🎮 Interactive Experiences',
    experiencesHot: 'HOT!',
    startExploring: 'Start Exploring →',
    spaceJourney: '🚀 Space Journey',
  },
  ar: {
    tagline: 'هذا الموقع لا ينافس غيره — إنه رؤية فريدة للفضاء.',
    experiences: '🎮 تجارب تفاعلية',
    experiencesHot: 'مميز!',
    startExploring: 'ابدأ الاستكشاف ←',
    spaceJourney: '🚀 رحلة الفضاء',
  },
  es: {
    tagline: 'Este sitio no compite con otros: es una visión única del espacio.',
    experiences: '🎮 Experiencias interactivas',
    experiencesHot: '¡DESTACADO!',
    startExploring: 'Comenzar a explorar →',
    spaceJourney: '🚀 Viaje espacial',
  },
  zh: {
    tagline: '本站不与别站竞争，而是呈现独特的太空视角。',
    experiences: '🎮 互动体验',
    experiencesHot: '热门',
    startExploring: '开始探索 →',
    spaceJourney: '🚀 太空之旅',
  },
}

export default function HomePageContent({
  locale = 'en',
  basePath = '',
}: {
  locale: Locale
  basePath: string
}) {
  const t = homeCopy[locale] || homeCopy.en
  const experiencesHref = basePath ? `${basePath}/experiences` : '/experiences'
  const solarSystemHref = basePath ? `${basePath}/solar-system` : '/solar-system'
  const spaceJourneyHref = basePath ? `${basePath}/space-journey` : '/space-journey'

  return (
    <div className="relative min-h-screen flex flex-col pb-12">
      <AmbientStarfield intensity="light" />
      <StarfieldToggle defaultIntensity="light" />
      <div style={{ position: 'absolute', top: 18, right: 18, zIndex: 50, opacity: 0.95 }}>
        <TwinSigil />
      </div>
      <EnhancedHero
        title="HalfSPACE"
        heroImage="https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000136/GSFC_20171208_Archive_e000136~orig.jpg"
        heroImageAlt="HalfSPACE - Journey Through the Cosmos"
      >
        <div className="mb-6">
          <SpaceLogo size={120} animated={true} />
        </div>
        <HeroKicker locale={locale} />
        <p className="text-xl text-gray-200 mb-4 font-light">
          {t.tagline}
        </p>
        <div className="mb-6 flex justify-center">
          <LanguageSwitcher />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={experiencesHref}
            className="px-10 py-5 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 rounded-xl text-white font-bold text-lg hover:from-cyan-500 hover:via-blue-500 hover:to-purple-500 space-button-glow shadow-2xl enhanced-button-glow relative overflow-hidden group animate-pulse-slow"
          >
            <span className="relative z-10 flex items-center gap-2">
              {t.experiences}
              <span className="text-xs px-2 py-0.5 bg-white/20 rounded-full">{t.experiencesHot}</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 opacity-0 group-hover:opacity-40 blur-xl transition-opacity" />
          </Link>
          <Link
            href={solarSystemHref}
            className="px-10 py-5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-bold text-lg hover:from-purple-700 hover:to-blue-700 space-button-glow shadow-2xl enhanced-button-glow"
          >
            {t.startExploring}
          </Link>
          <Link
            href={spaceJourneyHref}
            className="px-10 py-5 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 rounded-xl text-white font-bold text-lg hover:from-pink-700 hover:via-purple-700 hover:to-indigo-700 space-button-glow shadow-2xl enhanced-button-glow relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center gap-2">
              {t.spaceJourney}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 opacity-0 group-hover:opacity-30 blur-xl transition-opacity" />
          </Link>
        </div>
      </EnhancedHero>
      <div className="relative z-10 -mt-32 mb-8">
        <div className="max-w-2xl mx-auto px-4">
          <FactOfDay locale={locale} />
        </div>
      </div>

      <div className="relative z-10 mb-12">
        <div className="max-w-6xl mx-auto px-4">
          <SpaceFlightExperience locale={locale} />
        </div>
      </div>

      <div className="relative z-10 mb-8">
        <div className="max-w-2xl mx-auto px-4">
          <ExploreStats locale={locale} />
        </div>
      </div>
      <FeaturedNavCards locale={locale} basePath={basePath} />
    </div>
  )
}
