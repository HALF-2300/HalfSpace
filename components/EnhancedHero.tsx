'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import HeroOverlay from '@/components/HeroOverlay'
import CinematicHeroOverlayEnhanced from '@/components/CinematicHeroOverlayEnhanced'
import { preloadHeroImage } from '@/utils/perf'
import { getTextOverlayClasses } from '@/utils/a11y'
import { handleImageError, getFallbackImage, enhanceImageSrc } from '@/utils/imageFallback'

interface EnhancedHeroProps {
  title: string
  subtitle?: string
  heroImage?: string
  heroImageAlt?: string
  children?: React.ReactNode
  overlayIntensity?: 'light' | 'medium'
}

export default function EnhancedHero({
  title,
  subtitle,
  heroImage = 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=1920',
  heroImageAlt = 'Space',
  children,
  overlayIntensity = 'light'
}: EnhancedHeroProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    // Preload hero image for faster initial render
    if (heroImage) {
      preloadHeroImage(heroImage)
    }

    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [heroImage])

  // Check image quality - if error or low quality, use stronger overlay
  const useStrongOverlay = imageError || !imageLoaded

  return (
    <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden portal gateway-entrance">
      <div className="absolute inset-0 z-0">
        {heroImage && !imageError && (
          <Image
            src={enhanceImageSrc(heroImage, 'hero', getFallbackImage('hero'))}
            alt={heroImageAlt}
            fill
            className={`object-cover scale-110 space-image-zoom ${reducedMotion ? '' : ''}`}
            priority
            unoptimized={heroImage?.startsWith('http')}
            sizes="100vw"
            quality={85}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              setImageError(true)
              handleImageError(e, getFallbackImage('hero'))
            }}
          />
        )}
        
        {/* Fallback gradient background if no image or image error */}
        {(!heroImage || imageError) && (
          <div className="absolute inset-0 bg-gradient-to-b from-space-deeper via-purple-950/50 via-space-dark to-space-deep" />
        )}

        {/* Multi-layer gradients for depth - stronger if image quality is low */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-transparent to-space-dark"
          style={{
            background: useStrongOverlay 
              ? 'linear-gradient(to bottom, transparent 0%, rgba(10, 14, 39, 0.98) 50%, rgb(10, 14, 39) 100%)'
              : 'linear-gradient(to bottom, transparent 0%, rgba(10, 14, 39, 0.95) 50%, rgb(10, 14, 39) 100%)'
          }}
        />
        <div 
          className="absolute inset-0"
          style={{
            background: useStrongOverlay
              ? 'linear-gradient(to right, rgba(139, 92, 246, 0.4) 0%, transparent 50%, rgba(59, 130, 246, 0.4) 100%)'
              : 'linear-gradient(to right, rgba(139, 92, 246, 0.3) 0%, transparent 50%, rgba(59, 130, 246, 0.3) 100%)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-radial from-purple-500/10 via-transparent to-transparent" />
        
        {/* Hero Overlay - Cinematic gradient + star haze */}
        <HeroOverlay intensity={overlayIntensity} />
        {/* Enhanced overlay available: <CinematicHeroOverlayEnhanced intensity="medium" /> */}
        
        {/* Animated light rays - respect reduced motion */}
        <div className="absolute inset-0">
          <div className={`absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl ${reducedMotion ? '' : 'animate-pulse-slow'}`} />
          <div 
            className={`absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl ${reducedMotion ? '' : 'animate-pulse-slow'}`}
            style={reducedMotion ? {} : { animationDelay: '1s' }}
          />
        </div>
      </div>
      
      {/* Portal Effect Overlay - respect reduced motion */}
      {!reducedMotion && <div className="absolute inset-0 portal-ring z-1" />}
      
      {/* Content with text backdrop blur for better contrast - ensure it's on top */}
      <div className={`relative z-20 text-center px-4 max-w-6xl mx-auto ${reducedMotion ? '' : 'animate-fade-in'}`} style={{ position: 'relative' }}>
        {/* Text backdrop for better readability */}
        <div className="absolute inset-0 -mx-4 -my-8 bg-space-dark/60 backdrop-blur-md rounded-3xl" style={{ zIndex: -1 }} />
        <div className="relative z-10">
          <h1 className={`text-6xl md:text-8xl font-bold mb-6 text-gradient portal-title space-heading-glow ${getTextOverlayClasses()}`} style={{ color: 'white', textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}>
            {title}
          </h1>
          {subtitle && (
            <p className={`text-xl md:text-2xl text-gray-200 mb-8 font-light ${getTextOverlayClasses()}`} style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
              {subtitle}
            </p>
          )}
          {children}
        </div>
      </div>
    </section>
  )
}
