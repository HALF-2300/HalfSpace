'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import SpaceLightbox from '@/components/space/SpaceLightbox'
import { safeImageSrc, getFallbackImage, handleImageError } from '@/utils/imageFallback'

export type Observatory2Category = 'Nebulae' | 'Galaxies' | 'Stars' | 'Planets' | 'Missions' | 'Telescopes'
export type Observatory2Telescope = 'Hubble' | 'JWST'

export interface Observatory2Image {
  id: string
  title: string
  description: string
  category: Observatory2Category
  telescope: Observatory2Telescope
  url: string
}

interface Observatory2GalleryProps {
  images: Observatory2Image[]
  onSelectCompare: (slot: 'before' | 'after', image: Observatory2Image) => void
  compareSelection: { before?: string; after?: string }
}

export default function Observatory2Gallery({
  images,
  onSelectCompare,
  compareSelection,
}: Observatory2GalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<'All' | Observatory2Category>('All')
  const [selectedTelescope, setSelectedTelescope] = useState<'All' | Observatory2Telescope>('All')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const categories: Array<'All' | Observatory2Category> = [
    'All',
    'Nebulae',
    'Galaxies',
    'Stars',
    'Planets',
    'Missions',
    'Telescopes',
  ]

  const telescopes: Array<'All' | Observatory2Telescope> = ['All', 'Hubble', 'JWST']

  const filteredImages = useMemo(() => {
    return images.filter((img) => {
      const categoryMatch = selectedCategory === 'All' || img.category === selectedCategory
      const telescopeMatch = selectedTelescope === 'All' || img.telescope === selectedTelescope
      return categoryMatch && telescopeMatch
    })
  }, [images, selectedCategory, selectedTelescope])

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index)
    setLightboxOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    document.body.style.overflow = 'unset'
  }

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % filteredImages.length)
  }

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length)
  }

  const lightboxImages = filteredImages.map((img, idx) => ({
    id: idx,
    url: img.url,
    title: img.title,
    description: img.description,
  }))

  const isSelected = (slot: 'before' | 'after', id: string) => {
    if (slot === 'before') return compareSelection.before === id
    return compareSelection.after === id
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-5 py-3 rounded-xl font-semibold text-sm md:text-base transition-all transform hover:scale-105 ${
              selectedCategory === category
                ? 'glass border-2 border-purple-500 bg-purple-500/20 glow-purple text-white'
                : 'glass border-2 border-purple-500/30 hover:border-purple-500/50 text-gray-300'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {telescopes.map((telescope) => (
          <button
            key={telescope}
            onClick={() => setSelectedTelescope(telescope)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              selectedTelescope === telescope
                ? 'glass border border-blue-400 bg-blue-400/20 text-white'
                : 'glass border border-blue-400/40 text-blue-100 hover:border-blue-300/70'
            }`}
          >
            {telescope === 'All' ? 'All Telescopes' : telescope}
          </button>
        ))}
      </div>

      <div className="text-center text-gray-300">
        Showing <span className="text-white font-bold">{filteredImages.length}</span> of{' '}
        <span className="text-white font-bold">{images.length}</span> items
      </div>

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
                alt={image.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                loading="lazy"
                onError={(e) => handleImageError(e, getFallbackImage('gallery'))}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-space-dark via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute top-3 left-3 flex gap-2">
              <span className="glass px-2 py-1 rounded-full border border-purple-400/40 text-xs text-purple-200">
                {image.category}
              </span>
              <span className="glass px-2 py-1 rounded-full border border-blue-400/40 text-xs text-blue-100">
                {image.telescope}
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform">
              <h4 className="text-white font-bold text-lg mb-1">{image.title}</h4>
              <p className="text-gray-200 text-sm line-clamp-2">{image.description}</p>
            </div>
            <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                className={`glass px-3 py-2 rounded-lg text-xs font-semibold border ${
                  isSelected('before', image.id)
                    ? 'border-emerald-400 bg-emerald-500/20 text-white'
                    : 'border-emerald-300/50 text-emerald-100 hover:border-emerald-300'
                }`}
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectCompare('before', image)
                }}
              >
                Set as Before
              </button>
              <button
                className={`glass px-3 py-2 rounded-lg text-xs font-semibold border ${
                  isSelected('after', image.id)
                    ? 'border-amber-400 bg-amber-500/20 text-white'
                    : 'border-amber-300/50 text-amber-100 hover:border-amber-300'
                }`}
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectCompare('after', image)
                }}
              >
                Set as After
              </button>
            </div>
          </div>
        ))}
      </div>

      {lightboxOpen && filteredImages.length > 0 && (
        <SpaceLightbox
          images={lightboxImages}
          currentIndex={selectedImageIndex}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </div>
  )
}
