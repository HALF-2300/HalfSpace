'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { safeImageSrc, getFallbackImage, handleImageError } from '@/utils/imageFallback'
import { getImageLoadingStrategy, getImageSizes } from '@/utils/perf'
import { getButtonAriaLabel, getFocusStyles } from '@/utils/a11y'
import EnhancedLightbox from './EnhancedLightbox'

// Extended space images collection (12-24 images)
const spaceImages = [
  {
    id: 1,
    url: 'https://images-assets.nasa.gov/image/PIA01341/PIA01341~orig.jpg',
    title: 'Solar System Overview',
    description: 'Our cosmic neighborhood',
    width: 1200,
    height: 630,
  },
  {
    id: 2,
    url: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000263/GSFC_20171208_Archive_e000263~orig.jpg',
    title: 'Earth from Space',
    description: 'The Blue Planet',
    width: 1200,
    height: 630,
  },
  {
    id: 3,
    url: 'https://images-assets.nasa.gov/image/PIA04591/PIA04591~orig.jpg',
    title: 'Mars Surface',
    description: 'The Red Planet',
    width: 1200,
    height: 630,
  },
  {
    id: 4,
    url: 'https://images-assets.nasa.gov/image/PIA02873/PIA02873~orig.jpg',
    title: 'Jupiter',
    description: 'Gas Giant',
    width: 1200,
    height: 630,
  },
  {
    id: 5,
    url: 'https://images-assets.nasa.gov/image/PIA06193/PIA06193~orig.jpg',
    title: 'Saturn with Rings',
    description: 'The Ringed Planet',
    width: 1200,
    height: 630,
  },
  {
    id: 6,
    url: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001135/GSFC_20171208_Archive_e001135~orig.jpg',
    title: 'Earth and Moon',
    description: 'Our closest neighbor',
    width: 1200,
    height: 630,
  },
  {
    id: 7,
    url: 'https://images-assets.nasa.gov/image/PIA18182/PIA18182~orig.jpg',
    title: 'Uranus',
    description: 'The Ice Giant',
    width: 1200,
    height: 630,
  },
  {
    id: 8,
    url: 'https://images-assets.nasa.gov/image/PIA01492/PIA01492~orig.jpg',
    title: 'Neptune',
    description: 'The Distant Blue',
    width: 1200,
    height: 630,
  },
  {
    id: 9,
    url: 'https://images-assets.nasa.gov/image/PIA19952/PIA19952~orig.jpg',
    title: 'Pluto',
    description: 'Dwarf Planet',
    width: 1200,
    height: 630,
  },
  {
    id: 10,
    url: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001435/GSFC_20171208_Archive_e001435~orig.jpg',
    title: 'The Sun',
    description: 'Our Star',
    width: 1200,
    height: 630,
  },
  {
    id: 11,
    url: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000136/GSFC_20171208_Archive_e000136~orig.jpg',
    title: 'Deep Space',
    description: 'Cosmic Wonders',
    width: 1200,
    height: 630,
  },
  {
    id: 12,
    url: 'https://images-assets.nasa.gov/image/PIA16853/PIA16853~orig.jpg',
    title: 'Mercury',
    description: 'The Closest Planet',
    width: 1200,
    height: 630,
  },
  {
    id: 13,
    url: 'https://images-assets.nasa.gov/image/PIA00271/PIA00271~orig.jpg',
    title: 'Venus',
    description: 'The Hottest Planet',
    width: 1200,
    height: 630,
  },
  {
    id: 14,
    url: 'https://images-assets.nasa.gov/image/PIA00069/PIA00069~orig.jpg',
    title: 'Andromeda Galaxy',
    description: 'Neighboring Galaxy',
    width: 1200,
    height: 630,
  },
  {
    id: 15,
    url: 'https://images-assets.nasa.gov/image/PIA04921/PIA04921~orig.jpg',
    title: 'Orion Nebula',
    description: 'Stellar Nursery',
    width: 1200,
    height: 630,
  },
  {
    id: 16,
    url: 'https://images-assets.nasa.gov/image/PIA03149/PIA03149~orig.jpg',
    title: 'Pillars of Creation',
    description: 'Eagle Nebula',
    width: 1200,
    height: 630,
  },
  {
    id: 17,
    url: 'https://images-assets.nasa.gov/image/PIA09178/PIA09178~orig.jpg',
    title: 'Saturn\'s Moons',
    description: 'Titan and Enceladus',
    width: 1200,
    height: 630,
  },
  {
    id: 18,
    url: 'https://images-assets.nasa.gov/image/PIA04357/PIA04357~orig.jpg',
    title: 'Hubble Deep Field',
    description: 'Distant Galaxies',
    width: 1200,
    height: 630,
  },
  {
    id: 19,
    url: 'https://images-assets.nasa.gov/image/PIA09178/PIA09178~orig.jpg',
    title: 'Crab Nebula',
    description: 'Supernova Remnant',
    width: 1200,
    height: 630,
  },
  {
    id: 20,
    url: 'https://images-assets.nasa.gov/image/PIA04921/PIA04921~orig.jpg',
    title: 'Jupiter\'s Europa',
    description: 'Icy Moon',
    width: 1200,
    height: 630,
  },
  {
    id: 21,
    url: 'https://images-assets.nasa.gov/image/PIA03149/PIA03149~orig.jpg',
    title: 'Milky Way',
    description: 'Our Galaxy',
    width: 1200,
    height: 630,
  },
  {
    id: 22,
    url: 'https://images-assets.nasa.gov/image/PIA00069/PIA00069~orig.jpg',
    title: 'Black Hole Visualization',
    description: 'Event Horizon',
    width: 1200,
    height: 630,
  },
  {
    id: 23,
    url: 'https://images-assets.nasa.gov/image/PIA04357/PIA04357~orig.jpg',
    title: 'Mars Rovers',
    description: 'Surface Exploration',
    width: 1200,
    height: 630,
  },
  {
    id: 24,
    url: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000136/GSFC_20171208_Archive_e000136~orig.jpg',
    title: 'International Space Station',
    description: 'Orbital Laboratory',
    width: 1200,
    height: 630,
  },
]

interface SpaceGalleryEnhancedProps {
  maxImages?: number
  className?: string
}

export default function SpaceGalleryEnhanced({ 
  maxImages = 24,
  className = '' 
}: SpaceGalleryEnhancedProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set())
  const containerRef = useRef<HTMLDivElement>(null)

  const displayedImages = spaceImages.slice(0, Math.min(maxImages, spaceImages.length))

  const openLightbox = (index: number) => {
    setSelectedImage(index)
    setLightboxOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    document.body.style.overflow = 'unset'
  }

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % displayedImages.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + displayedImages.length) % displayedImages.length)
  }

  const handleImageLoadError = (id: number, event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setImageErrors((prev) => new Set(prev).add(id))
    handleImageError(event, getFallbackImage('gallery'))
  }

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'ArrowLeft') prevImage()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxOpen, selectedImage])

  return (
    <>
      <div 
        ref={containerRef}
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}
        role="region"
        aria-label="Space image gallery"
      >
        {displayedImages.map((image, index) => {
          const hasError = imageErrors.has(image.id)
          const aspectRatio = image.width / image.height

          return (
            <button
              key={image.id}
              onClick={() => openLightbox(index)}
              className={`
                group relative overflow-hidden rounded-2xl border-2 border-purple-500/30 
                hover:border-purple-500/70 transition-all cursor-pointer transform 
                hover:scale-105 hover:z-10 enhanced-card-glow
                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 
                focus:ring-offset-space-dark
              `}
              style={{ aspectRatio: `${aspectRatio || 16/9}` }}
              aria-label={getButtonAriaLabel('Open image', image.title)}
            >
              {/* Fixed dimensions container to prevent layout shift */}
              <div 
                className="absolute inset-0"
                style={{ 
                  width: '100%', 
                  height: '100%',
                  minHeight: '200px' // Prevent collapse
                }}
              >
                <Image
                  src={safeImageSrc(image.url, getFallbackImage('gallery'))}
                  alt={image.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes={getImageSizes({ mobile: 100, tablet: 50, desktop: 25 })}
                  loading={getImageLoadingStrategy(false, index < 8)}
                  onError={(e) => handleImageLoadError(image.id, e)}
                  width={image.width}
                  height={image.height}
                />
                
                {/* Fallback placeholder if error */}
                {hasError && (
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20 flex items-center justify-center">
                    <span className="text-4xl opacity-50">🌌</span>
                  </div>
                )}
              </div>

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-space-dark via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {/* Image info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform bg-gradient-to-t from-black/80 to-transparent">
                <h4 className="text-white font-bold text-lg mb-1">{image.title}</h4>
                <p className="text-gray-300 text-sm">{image.description}</p>
              </div>

              {/* Zoom icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="glass rounded-full p-4 border-2 border-purple-500/50">
                  <svg
                    className="w-8 h-8 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                    />
                  </svg>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <EnhancedLightbox
          images={displayedImages}
          currentIndex={selectedImage}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </>
  )
}
