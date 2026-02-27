'use client'

import { useEffect, useState } from 'react'
import SafeImage from './SafeImage'
import { ShowcaseImage } from './types'

interface SpaceShowcaseLightboxProps {
  images: ShowcaseImage[]
  currentIndex: number
  onClose: () => void
  onNext: () => void
  onPrev: () => void
}

export default function SpaceShowcaseLightbox({
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}: SpaceShowcaseLightboxProps) {
  const [loaded, setLoaded] = useState(false)

  const currentImage = images[currentIndex]

  useEffect(() => {
    setLoaded(false)
  }, [currentIndex])

  useEffect(() => {
    const handleKeys = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') onNext()
      if (event.key === 'ArrowLeft') onPrev()
    }

    window.addEventListener('keydown', handleKeys)
    return () => window.removeEventListener('keydown', handleKeys)
  }, [onClose, onNext, onPrev])

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-xl"
      role="dialog"
      aria-modal="true"
      aria-label={`${currentImage.title} lightbox`}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-space-dark/90 via-space-dark/80 to-black/90" />

      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-50 glass rounded-full p-3 border-2 border-purple-500/60 hover:border-purple-400 text-white hover:bg-purple-500/20 transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-400/60"
        aria-label="Close showcase lightbox"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <button
        onClick={(event) => {
          event.stopPropagation()
          onPrev()
        }}
        className="absolute left-6 z-50 glass rounded-full p-4 border-2 border-purple-500/60 hover:border-purple-400 text-white hover:bg-purple-500/20 transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-400/60"
        aria-label="Previous image"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={(event) => {
          event.stopPropagation()
          onNext()
        }}
        className="absolute right-6 z-50 glass rounded-full p-4 border-2 border-purple-500/60 hover:border-purple-400 text-white hover:bg-purple-500/20 transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-400/60"
        aria-label="Next image"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div
        className="relative z-40 w-full max-w-6xl px-6 md:px-10"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative rounded-3xl overflow-hidden border-2 border-purple-500/40 shadow-2xl bg-space-dark/60 backdrop-blur-lg" style={{ aspectRatio: '16/9' }}>
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-16 w-16 rounded-full border-t-2 border-b-2 border-purple-400 animate-spin" />
            </div>
          )}
          <SafeImage
            src={currentImage.url}
            alt={currentImage.title}
            className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setLoaded(true)}
          />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>

        <div className="mt-6 glass border-2 border-purple-500/40 rounded-2xl p-6 md:p-8 shadow-lg">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wide rounded-full bg-purple-500/20 border border-purple-400/60 text-purple-100">
              {currentImage.category}
            </span>
            {currentImage.year && (
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/10 border border-white/20 text-white">
                {currentImage.year}
              </span>
            )}
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{currentImage.title}</h3>
          <p className="text-gray-200 mb-4">{currentImage.description}</p>
          <div className="flex flex-wrap gap-3 text-sm text-purple-200">
            {currentImage.credit && (
              <span className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-500/10 border border-purple-400/40">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {currentImage.credit}
              </span>
            )}
            {currentImage.location && (
              <span className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-500/10 border border-purple-400/40">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.38 0 2.5-1.12 2.5-2.5S13.38 6 12 6s-2.5 1.12-2.5 2.5S10.62 11 12 11z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 22s6-5.686 6-12a6 6 0 10-12 0c0 6.314 6 12 6 12z" />
                </svg>
                {currentImage.location}
              </span>
            )}
          </div>
          <div className="mt-4 text-sm text-purple-200/80">
            Use ← / → to navigate and Esc to close
          </div>
        </div>

        <div className="absolute top-4 left-4 text-white text-sm glass px-3 py-1 rounded-full border border-purple-400/60">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  )
}
