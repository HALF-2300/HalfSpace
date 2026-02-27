'use client'

import { useState } from 'react'
import Image from 'next/image'
import SpaceLightbox from './SpaceLightbox'
import { safeImageSrc, getFallbackImage, handleImageError } from '@/utils/imageFallbackEnhanced'

// 24 Space images - using NASA and space-themed URLs
const spaceImages24 = [
  {
    id: 1,
    url: 'https://images-assets.nasa.gov/image/PIA01341/PIA01341~orig.jpg',
    title: 'Solar System Overview',
    description: 'Our cosmic neighborhood with all eight planets',
  },
  {
    id: 2,
    url: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000263/GSFC_20171208_Archive_e000263~orig.jpg',
    title: 'Earth from Space',
    description: 'The Blue Planet as seen from orbit',
  },
  {
    id: 3,
    url: 'https://images-assets.nasa.gov/image/PIA04591/PIA04591~orig.jpg',
    title: 'Mars Surface',
    description: 'The Red Planet with its distinctive terrain',
  },
  {
    id: 4,
    url: 'https://images-assets.nasa.gov/image/PIA02873/PIA02873~orig.jpg',
    title: 'Jupiter',
    description: 'The largest planet in our Solar System',
  },
  {
    id: 5,
    url: 'https://images-assets.nasa.gov/image/PIA06193/PIA06193~orig.jpg',
    title: 'Saturn with Rings',
    description: 'The magnificent ringed planet',
  },
  {
    id: 6,
    url: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001135/GSFC_20171208_Archive_e001135~orig.jpg',
    title: 'Earth and Moon',
    description: 'Our closest celestial neighbor',
  },
  {
    id: 7,
    url: 'https://images-assets.nasa.gov/image/PIA18182/PIA18182~orig.jpg',
    title: 'Uranus',
    description: 'The ice giant tilted on its side',
  },
  {
    id: 8,
    url: 'https://images-assets.nasa.gov/image/PIA01492/PIA01492~orig.jpg',
    title: 'Neptune',
    description: 'The distant blue planet',
  },
  {
    id: 9,
    url: 'https://images-assets.nasa.gov/image/PIA19952/PIA19952~orig.jpg',
    title: 'Pluto',
    description: 'The dwarf planet with a heart',
  },
  {
    id: 10,
    url: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001435/GSFC_20171208_Archive_e001435~orig.jpg',
    title: 'The Sun',
    description: 'Our life-giving star',
  },
  {
    id: 11,
    url: 'https://images-assets.nasa.gov/image/PIA16853/PIA16853~orig.jpg',
    title: 'Mercury',
    description: 'The closest planet to the Sun',
  },
  {
    id: 12,
    url: 'https://images-assets.nasa.gov/image/PIA00271/PIA00271~orig.jpg',
    title: 'Venus',
    description: 'The hottest planet in our Solar System',
  },
  {
    id: 13,
    url: 'https://images-assets.nasa.gov/image/black-hole-image-nasa_gsfc_20190410_archive_e000190/black-hole-image-nasa_gsfc_20190410_archive_e000190~orig.jpg',
    title: 'Black Hole',
    description: 'First image of a black hole event horizon',
  },
  {
    id: 14,
    url: 'https://images-assets.nasa.gov/image/STScI-PRC95-24a/STScI-PRC95-24a~orig.jpg',
    title: 'Pillars of Creation',
    description: 'Iconic Hubble image of star-forming region',
  },
  {
    id: 15,
    url: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000136/GSFC_20171208_Archive_e000136~orig.jpg',
    title: 'Deep Space',
    description: 'Cosmic wonders beyond our imagination',
  },
  {
    id: 16,
    url: 'https://images-assets.nasa.gov/image/PIA03149/PIA03149~orig.jpg',
    title: 'Nebula',
    description: 'Cosmic clouds of gas and dust',
  },
  {
    id: 17,
    url: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000275/GSFC_20171208_Archive_e000275~orig.jpg',
    title: 'Aurora',
    description: 'Northern lights dancing in the sky',
  },
  {
    id: 18,
    url: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000276/GSFC_20171208_Archive_e000276~orig.jpg',
    title: 'Galaxy',
    description: 'Spiral galaxy with billions of stars',
  },
  {
    id: 19,
    url: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000277/GSFC_20171208_Archive_e000277~orig.jpg',
    title: 'Solar Flare',
    description: 'Massive eruption from the Sun',
  },
  {
    id: 20,
    url: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000278/GSFC_20171208_Archive_e000278~orig.jpg',
    title: 'Space Station',
    description: 'International Space Station in orbit',
  },
  {
    id: 21,
    url: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000279/GSFC_20171208_Archive_e000279~orig.jpg',
    title: 'Astronaut',
    description: 'Human exploration of space',
  },
  {
    id: 22,
    url: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000280/GSFC_20171208_Archive_e000280~orig.jpg',
    title: 'Telescope',
    description: 'Our window to the universe',
  },
  {
    id: 23,
    url: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000281/GSFC_20171208_Archive_e000281~orig.jpg',
    title: 'Rocket Launch',
    description: 'Humanity reaching for the stars',
  },
  {
    id: 24,
    url: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000282/GSFC_20171208_Archive_e000282~orig.jpg',
    title: 'Cosmic Web',
    description: 'The large-scale structure of the universe',
  },
]

export default function SpaceGallery24() {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)

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
    setSelectedImage((prev) => (prev + 1) % spaceImages24.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + spaceImages24.length) % spaceImages24.length)
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {spaceImages24.map((image, index) => (
          <div
            key={image.id}
            onClick={() => openLightbox(index)}
            className="space-gallery-card group relative overflow-hidden rounded-2xl border-2 border-purple-500/30 hover:border-purple-500/70 transition-all cursor-pointer transform hover:scale-105 hover:z-10"
            style={{ aspectRatio: '16/9' }}
          >
            <div className="absolute inset-0">
              <Image
                src={safeImageSrc(image.url, getFallbackImage('gallery'))}
                alt={image.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                loading="lazy"
                onError={(e) => handleImageError(e, getFallbackImage('gallery'))}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-space-dark via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform">
              <h4 className="text-white font-bold text-lg mb-1">{image.title}</h4>
              <p className="text-gray-300 text-sm">{image.description}</p>
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="glass rounded-full p-4 border-2 border-purple-500/50">
                <svg
                  className="w-8 h-8 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
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
          </div>
        ))}
      </div>

      {lightboxOpen && (
        <SpaceLightbox
          images={spaceImages24}
          currentIndex={selectedImage}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </>
  )
}
