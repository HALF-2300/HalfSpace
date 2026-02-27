'use client'

import { useState, useEffect, useMemo } from 'react'
import { StarfieldExperience, NebulaFog, ExperienceCards, PhotoMode } from '@/components/space/experience'

export default function SpaceExperiencePage() {
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('medium')
  const [starDensity, setStarDensity] = useState(0.7)
  const [fogDensity, setFogDensity] = useState(0.55)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [lang, setLang] = useState<'en' | 'ar'>('en')
  const [canvasSupported, setCanvasSupported] = useState(true)

  const qualityPreset = useMemo(
    () => ({
      low: { stars: 0.45, fog: 0.35 },
      medium: { stars: 0.7, fog: 0.55 },
      high: { stars: 0.95, fog: 0.8 },
    }),
    []
  )

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    // Canvas guard to avoid crashes on older devices
    const canvas = document.createElement('canvas')
    const supported = Boolean(canvas.getContext('2d'))
    setCanvasSupported(supported)
  }, [])

  useEffect(() => {
    const preset = qualityPreset[quality]
    setStarDensity(preset.stars)
    setFogDensity(preset.fog)
  }, [quality, qualityPreset])

  const handleStartJourney = () => {
    setShowContent(true)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Visual Scene */}
      {canvasSupported ? (
        <>
          <StarfieldExperience
            starDensity={starDensity}
            fogDensity={fogDensity}
            reducedMotion={reducedMotion}
          />
          <NebulaFog density={fogDensity} reducedMotion={reducedMotion} />
        </>
      ) : (
        <div className="fixed inset-0 bg-gradient-to-br from-[#0b1024] via-[#0a0820] to-[#050712] pointer-events-none" />
      )}

      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="pt-24 pb-12 px-4 text-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-4 text-gradient space-heading-glow">
            {lang === 'ar' ? 'تجربة الفضاء' : 'Space Experience'}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            {lang === 'ar'
              ? 'رحلة بصريّة عبر الكون'
              : 'A visual journey through the cosmos'}
          </p>

          {/* Language Toggle - Hidden until English language is fully implemented */}
          {/* <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setLang('ar')}
              className={`px-6 py-2 rounded-lg border-2 transition-all ${
                lang === 'ar'
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-purple-500/30 hover:border-purple-500/50'
              }`}
            >
              عربي
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-6 py-2 rounded-lg border-2 transition-all ${
                lang === 'en'
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-purple-500/30 hover:border-purple-500/50'
              }`}
            >
              English
            </button>
          </div> */}

          {/* Quality Preset */}
          <div className="flex justify-center gap-3 mb-6">
            {(['low', 'medium', 'high'] as const).map((preset) => (
              <button
                key={preset}
                onClick={() => setQuality(preset)}
                className={`px-4 py-2 rounded-lg border-2 text-sm font-semibold transition-all ${
                  quality === preset
                    ? 'border-purple-400 bg-purple-500/20 text-white'
                    : 'border-purple-500/30 text-gray-200 hover:border-purple-300/60'
                }`}
              >
                {preset === 'low' ? 'Low' : preset === 'medium' ? 'Medium' : 'High'} quality
              </button>
            ))}
          </div>

          {/* Start Journey Button */}
          {!showContent && (
            <button
              onClick={handleStartJourney}
              className="px-12 py-6 glass rounded-2xl border-2 border-purple-500/50 hover:border-purple-500 text-xl font-bold text-gradient hover:scale-110 transition-all transform shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50"
            >
              {lang === 'ar' ? 'ابدأ الرحلة' : 'Start Journey'}
            </button>
          )}
        </header>

        {/* Main Content */}
        {showContent && (
          <main className="flex-1 px-4 pb-20 max-w-7xl mx-auto w-full">
            {/* Photo Mode Controls */}
            <PhotoMode
              starDensity={starDensity}
              fogDensity={fogDensity}
              onStarDensityChange={setStarDensity}
              onFogDensityChange={setFogDensity}
              lang={lang}
            />

            {/* Experience Cards */}
            <ExperienceCards lang={lang} />
          </main>
        )}
      </div>

      {/* Glow Accents */}
      <div className="fixed inset-0 pointer-events-none z-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>
    </div>
  )
}
