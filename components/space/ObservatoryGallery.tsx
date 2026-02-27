'use client'

import { useState } from 'react'
import Image from 'next/image'
import SpaceLightbox from './SpaceLightbox'
import { safeImageSrc, getFallbackImage, handleImageError } from '@/utils/imageFallback'
import observatoryGalleryData from '@/data/observatoryGallery.json'

type Category = 'All' | 'Nebulae' | 'Galaxies' | 'Stars' | 'Planets' | 'Missions'

interface GalleryImage {
  id: string
  url: string
  category: string
  title_ar: string
  title_en: string
  description_ar: string
  description_en: string
}

export default function ObservatoryGallery() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)

  const images: GalleryImage[] = observatoryGalleryData.images as GalleryImage[]

  const categories: Category[] = ['All', 'Nebulae', 'Galaxies', 'Stars', 'Planets', 'Missions']

  const filteredImages =
    selectedCategory === 'All'
      ? images
      : images.filter((img) => img.category === selectedCategory)

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
    setSelectedImage((prev) => (prev + 1) % filteredImages.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + filteredImages.length) % filteredImages.length)
  }

  // Convert to lightbox format
  const lightboxImages = filteredImages.map((img, idx) => ({
    id: idx,
    url: img.url,
    title: img.title_en,
    description: img.description_en,
  }))

  return (
    <>
      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-3 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 ${
              selectedCategory === category
                ? 'glass border-2 border-purple-500 bg-purple-500/20 glow-purple text-white'
                : 'glass border-2 border-purple-500/30 hover:border-purple-500/50 text-gray-300'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredImages.map((image, index) => (
          <div
            key={image.id}
            onClick={() => openLightbox(index)}
            className="space-gallery-card group relative overflow-hidden rounded-2xl border-2 border-purple-500/30 hover:border-purple-500/70 transition-all cursor-pointer transform hover:scale-105 hover:z-10"
            style={{ aspectRatio: '16/9' }}
          >
            <div className="absolute inset-0">
              <Image
                src={safeImageSrc(image.url, getFallbackImage('gallery'))}
                alt={image.title_en}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                loading="lazy"
                onError={(e) => handleImageError(e, getFallbackImage('gallery'))}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-space-dark via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform">
              <div className="mb-2">
                <span className="inline-block px-2 py-1 text-xs font-semibold rounded glass border border-purple-500/30 text-purple-300 mb-2">
                  {image.category}
                </span>
              </div>
              <h4 className="text-white font-bold text-lg mb-1">{image.title_en}</h4>
              <p className="text-gray-300 text-sm line-clamp-2">{image.description_en}</p>
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

      {/* Lightbox */}
      {lightboxOpen && (
        <SpaceLightbox
          images={lightboxImages}
          currentIndex={selectedImage}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </>
  )
}
