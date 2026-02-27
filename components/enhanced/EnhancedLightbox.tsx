'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { safeImageSrc, getFallbackImage, handleImageError } from '@/utils/imageFallback'
import { getButtonAriaLabel, getFocusStyles } from '@/utils/a11y'

interface ImageData {
  id: number
  url: string
  title: string
  description: string
  width?: number
  height?: number
}

interface EnhancedLightboxProps {
  images: ImageData[]
  currentIndex: number
  onClose: () => void
  onNext: () => void
  onPrev: () => void
}

/**
 * Enhanced Lightbox Modal - No external libraries
 * Full accessibility and keyboard navigation support
 */
export default function EnhancedLightbox({
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}: EnhancedLightboxProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const prevButtonRef = useRef<HTMLButtonElement>(null)
  const nextButtonRef = useRef<HTMLButtonElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const currentImage = images[currentIndex]

  // Reset image state when changing images
  useEffect(() => {
    setImageLoaded(false)
    setImageError(false)
  }, [currentIndex])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        onNext()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        onPrev()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, onNext, onPrev])

  // Focus management
  useEffect(() => {
    if (closeButtonRef.current) {
      closeButtonRef.current.focus()
    }
  }, [])

  const handleImageLoadError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setImageError(true)
    setImageLoaded(true)
    handleImageError(e, getFallbackImage('gallery'))
  }

  const aspectRatio = currentImage.width && currentImage.height 
    ? currentImage.width / currentImage.height 
    : 16 / 9

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-space-dark/95 backdrop-blur-lg"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
      aria-describedby="lightbox-description"
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/80" aria-hidden="true" />

      {/* Close button */}
      <button
        ref={closeButtonRef}
        onClick={onClose}
        className={`
          absolute top-6 right-6 z-50 glass rounded-full p-3 border-2 
          border-purple-500/50 hover:border-purple-500 text-white 
          hover:bg-purple-500/20 transition-all
          ${getFocusStyles()}
        `}
        aria-label={getButtonAriaLabel('Close', 'lightbox')}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Navigation buttons */}
      {images.length > 1 && (
        <>
          <button
            ref={prevButtonRef}
            onClick={(e) => {
              e.stopPropagation()
              onPrev()
            }}
            className={`
              absolute left-6 z-50 glass rounded-full p-4 border-2 
              border-purple-500/50 hover:border-purple-500 text-white 
              hover:bg-purple-500/20 transition-all
              ${getFocusStyles()}
            `}
            aria-label={getButtonAriaLabel('Previous image', '')}
            disabled={images.length <= 1}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            ref={nextButtonRef}
            onClick={(e) => {
              e.stopPropagation()
              onNext()
            }}
            className={`
              absolute right-6 z-50 glass rounded-full p-4 border-2 
              border-purple-500/50 hover:border-purple-500 text-white 
              hover:bg-purple-500/20 transition-all
              ${getFocusStyles()}
            `}
            aria-label={getButtonAriaLabel('Next image', '')}
            disabled={images.length <= 1}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Image container */}
      <div
        className="relative z-40 max-w-7xl w-full h-full flex items-center justify-center p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          className="relative w-full max-w-5xl" 
          style={{ 
            aspectRatio: `${aspectRatio}`,
            minHeight: '400px',
            maxHeight: '90vh'
          }}
        >
          {/* Loading state */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500" 
                   role="status" 
                   aria-label="Loading image">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          )}

          {/* Error state */}
          {imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900/20 to-blue-900/20">
              <div className="text-center">
                <span className="text-6xl mb-4 block">🌌</span>
                <p className="text-gray-400">Unable to load image</p>
              </div>
            </div>
          )}

          {/* Image */}
          <Image
            src={safeImageSrc(currentImage.url, getFallbackImage('gallery'))}
            alt={currentImage.title}
            fill
            className={`object-contain transition-opacity duration-300 ${
              imageLoaded && !imageError ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={handleImageLoadError}
            priority
            sizes="90vw"
            width={currentImage.width || 1200}
            height={currentImage.height || 630}
          />
        </div>

        {/* Image info */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50 glass rounded-2xl p-6 border-2 border-purple-500/50 max-w-2xl w-full mx-4">
          <h3 id="lightbox-title" className="text-2xl font-bold text-white mb-2">
            {currentImage.title}
          </h3>
          <p id="lightbox-description" className="text-gray-300">
            {currentImage.description}
          </p>
          {images.length > 1 && (
            <div className="mt-4 text-sm text-purple-400" aria-live="polite">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>
      </div>

      {/* Image counter - Top left */}
      {images.length > 1 && (
        <div 
          className="absolute top-6 left-6 z-50 glass rounded-full px-4 py-2 border-2 border-purple-500/50 text-white"
          aria-live="polite"
          aria-atomic="true"
        >
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  )
}
