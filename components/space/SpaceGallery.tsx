'use client'

import { useState } from 'react'
import Image from 'next/image'
import SpaceLightbox from './SpaceLightbox'
import { enhanceImageSrc, getFallbackImage } from '@/utils/imageFallback'

// Space images - using verified NASA and Hubble Space Telescope images
const spaceImages = [
  {
    id: 1,
    url: 'https://images-assets.nasa.gov/image/STScI-PRC2022-055a/STScI-PRC2022-055a~orig.jpg',
    title: 'Pillars of Creation',
    description: 'Hubble Space Telescope - Star-forming region',
  },
  {
    id: 2,
    url: 'https://images-assets.nasa.gov/image/STScI-PRC2022-056a/STScI-PRC2022-056a~orig.jpg',
    title: 'Deep Space Galaxy',
    description: 'Hubble Space Telescope view',
  },
  {
    id: 3,
    url: 'https://images-assets.nasa.gov/image/STScI-PRC2022-059a/STScI-PRC2022-059a~orig.jpg',
    title: 'James Webb Deep Field',
    description: 'Human outpost in orbit',
  },
  {
    id: 4,
    url: 'https://images-assets.nasa.gov/image/STScI-PRC2022-060a/STScI-PRC2022-060a~orig.jpg',
    title: 'Cosmic Nebula',
    description: 'Hubble Space Telescope',
  },
  {
    id: 5,
    url: 'https://images-assets.nasa.gov/image/STScI-PRC2022-064a/STScI-PRC2022-064a~orig.jpg',
    title: 'Star Cluster',
    description: 'The Ringed Planet',
  },
  {
    id: 6,
    url: 'https://images-assets.nasa.gov/image/STScI-PRC2022-061a/STScI-PRC2022-061a~orig.jpg',
    title: 'Galaxy Mosaic',
    description: 'Earth’s closest neighbor',
  },
  {
    id: 7,
    url: 'https://images-assets.nasa.gov/image/STScI-PRC2022-062a/STScI-PRC2022-062a~orig.jpg',
    title: 'Deep Space',
    description: 'James Webb Space Telescope',
  },
  {
    id: 8,
    url: 'https://images-assets.nasa.gov/image/STScI-PRC2022-063a/STScI-PRC2022-063a~orig.jpg',
    title: 'Cosmic Landscape',
    description: 'Hubble view of the universe',
  },
  {
    id: 9,
    url: 'https://images-assets.nasa.gov/image/STScI-PRC2022-069a/STScI-PRC2022-069a~orig.jpg',
    title: 'Nebula Formation',
    description: 'Star-forming region',
  },
  {
    id: 10,
    url: 'https://images-assets.nasa.gov/image/PIA01341/PIA01341~orig.jpg',
    title: 'Solar System',
    description: 'Our cosmic neighborhood',
  },
  {
    id: 11,
    url: 'https://images-assets.nasa.gov/image/PIA02873/PIA02873~orig.jpg',
    title: 'Jupiter',
    description: 'Gas Giant',
  },
  {
    id: 12,
    url: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000263/GSFC_20171208_Archive_e000263~orig.jpg',
    title: 'Earth from Space',
    description: 'The Blue Planet',
  },
]

export default function SpaceGallery() {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({})

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
    setSelectedImage((prev) => (prev + 1) % spaceImages.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + spaceImages.length) % spaceImages.length)
  }

  return (
    <>
      <div className="mb-4 text-center text-gray-300 text-sm">
        Showing {spaceImages.length} images in gallery
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {spaceImages.map((image, index) => (
          <div
            key={image.id}
            onClick={() => openLightbox(index)}
            className="space-gallery-card group relative overflow-hidden rounded-2xl border-2 border-purple-500/30 hover:border-purple-500/70 transition-all cursor-pointer transform hover:scale-105 hover:z-10"
            style={{ aspectRatio: '16/9' }}
          >
            <div className="absolute inset-0">
              <Image
                src={
                  imageErrors[image.id]
                    ? getFallbackImage('gallery')
                    : enhanceImageSrc(image.url, 'card', getFallbackImage('gallery'))
                }
                alt={image.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                loading="lazy"
                unoptimized
                onError={() => {
                  setImageErrors(prev => ({ ...prev, [image.id]: true }))
                }}
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
          images={spaceImages}
          currentIndex={selectedImage}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </>
  )
}
