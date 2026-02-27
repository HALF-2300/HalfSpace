'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { enhanceImageSrc, getFallbackImage, handleImageError } from '@/utils/imageFallback'

interface ImageData {
  id: number
  url: string
  title: string
  description: string
}

interface SpaceLightboxProps {
  images: ImageData[]
  currentIndex: number
  onClose: () => void
  onNext: () => void
  onPrev: () => void
}

export default function SpaceLightbox({
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}: SpaceLightboxProps) {
  const [imageLoaded, setImageLoaded] = useState(false)

  const currentImage = images[currentIndex]

  useEffect(() => {
    setImageLoaded(false)
  }, [currentIndex])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft') onPrev()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, onNext, onPrev])

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-space-dark/95 backdrop-blur-lg"
      onClick={onClose}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/80" />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-50 glass rounded-full p-3 border-2 border-purple-500/50 hover:border-purple-500 text-white hover:bg-purple-500/20 transition-all"
        aria-label="Close lightbox"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Navigation buttons */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onPrev()
        }}
        className="absolute left-6 z-50 glass rounded-full p-4 border-2 border-purple-500/50 hover:border-purple-500 text-white hover:bg-purple-500/20 transition-all"
        aria-label="Previous image"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation()
          onNext()
        }}
        className="absolute right-6 z-50 glass rounded-full p-4 border-2 border-purple-500/50 hover:border-purple-500 text-white hover:bg-purple-500/20 transition-all"
        aria-label="Next image"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Image container */}
      <div
        className="relative z-40 max-w-7xl w-full h-full flex items-center justify-center p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full max-w-5xl" style={{ aspectRatio: '16/9' }}>
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500" />
            </div>
          )}
          <Image
            src={enhanceImageSrc(currentImage.url, 'lightbox', getFallbackImage('gallery'))}
            alt={currentImage.title}
            fill
            className={`object-contain transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              handleImageError(e, getFallbackImage('gallery'))
              setImageLoaded(true)
            }}
            priority
          />
        </div>

        {/* Image info */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50 glass rounded-2xl p-6 border-2 border-purple-500/50 max-w-2xl w-full mx-4">
          <h3 className="text-2xl font-bold text-white mb-2">{currentImage.title}</h3>
          <p className="text-gray-300">{currentImage.description}</p>
          <div className="mt-4 text-sm text-purple-400">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      </div>

      {/* Image counter */}
      <div className="absolute top-6 left-6 z-50 glass rounded-full px-4 py-2 border-2 border-purple-500/50 text-white">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  )
}
