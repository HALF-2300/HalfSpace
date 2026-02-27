'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import spacePortalImagesData from '@/data/spacePortalImages.json'

interface SpaceImage {
  id: string
  url: string
  category: string
  title_ar: string
  title_en: string
  description_ar: string
  description_en: string
}

export default function SpaceLightbox({ lang = 'ar' }: { lang?: 'en' | 'ar' }) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const spacePortalImages = spacePortalImagesData as { images: SpaceImage[] }
  const [images] = useState<SpaceImage[]>(spacePortalImages.images)

  const categories = ['All', 'Nebula', 'Galaxy', 'Planet', 'Mission']
  const filteredImages = selectedCategory === 'All' 
    ? images 
    : images.filter(img => img.category === selectedCategory)

  useEffect(() => {
    if (selectedImage !== null) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [selectedImage])

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImage === null) return
    if (direction === 'prev') {
      setSelectedImage(selectedImage > 0 ? selectedImage - 1 : filteredImages.length - 1)
    } else {
      setSelectedImage(selectedImage < filteredImages.length - 1 ? selectedImage + 1 : 0)
    }
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (selectedImage === null) return
      if (e.key === 'ArrowLeft') navigateImage('prev')
      if (e.key === 'ArrowRight') navigateImage('next')
      if (e.key === 'Escape') setSelectedImage(null)
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [selectedImage, filteredImages.length])

  return (
    <div className="w-full">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => {
              setSelectedCategory(category)
              setSelectedImage(null)
            }}
            className={`px-4 py-2 rounded-lg border transition-all ${
              selectedCategory === category
                ? 'bg-purple-600/30 border-purple-500 text-white'
                : 'bg-space-deep/50 border-purple-500/30 text-gray-300 hover:border-purple-500/60'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredImages.map((img, index) => (
          <div
            key={img.id}
            onClick={() => setSelectedImage(index)}
            className="relative aspect-square rounded-lg overflow-hidden border border-purple-500/30 hover:border-purple-500/60 transition-all hover-lift cursor-pointer group"
          >
            <Image
              src={img.url}
              alt={lang === 'ar' ? img.title_ar : img.title_en}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              unoptimized={img.url.startsWith('http')}
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-space-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white text-sm font-semibold">
                  {lang === 'ar' ? img.title_ar : img.title_en}
                </p>
                <p className="text-gray-300 text-xs">
                  {lang === 'ar' ? img.description_ar : img.description_en}
                </p>
              </div>
            </div>
            <div className="absolute top-2 right-2 bg-purple-600/80 backdrop-blur-sm px-2 py-1 rounded text-xs text-white">
              {img.category}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation()
              setSelectedImage(null)
            }}
            className="absolute top-4 right-4 text-white text-4xl hover:text-purple-400 transition-colors z-10 w-12 h-12 flex items-center justify-center rounded-full bg-purple-600/30 hover:bg-purple-600/50"
            aria-label="Close"
          >
            ×
          </button>

          <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <div className="relative w-full h-full max-w-6xl">
              <Image
                src={filteredImages[selectedImage].url}
                alt={lang === 'ar' ? filteredImages[selectedImage].title_ar : filteredImages[selectedImage].title_en}
                fill
                className="object-contain"
                unoptimized={filteredImages[selectedImage].url.startsWith('http')}
              />
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-8">
              <h3 className="text-2xl font-bold text-white mb-2">
                {lang === 'ar' ? filteredImages[selectedImage].title_ar : filteredImages[selectedImage].title_en}
              </h3>
              <p className="text-gray-300">
                {lang === 'ar' ? filteredImages[selectedImage].description_ar : filteredImages[selectedImage].description_en}
              </p>
              <span className="inline-block mt-2 bg-purple-600/80 px-3 py-1 rounded text-sm text-white">
                {filteredImages[selectedImage].category}
              </span>
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              navigateImage('prev')
            }}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-5xl hover:text-purple-400 transition-colors z-10 w-16 h-16 flex items-center justify-center rounded-full bg-purple-600/30 hover:bg-purple-600/50"
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              navigateImage('next')
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-5xl hover:text-purple-400 transition-colors z-10 w-16 h-16 flex items-center justify-center rounded-full bg-purple-600/30 hover:bg-purple-600/50"
            aria-label="Next"
          >
            ›
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white bg-purple-600/30 backdrop-blur-sm px-4 py-2 rounded-full">
            {selectedImage + 1} / {filteredImages.length}
          </div>
        </div>
      )}
    </div>
  )
}
