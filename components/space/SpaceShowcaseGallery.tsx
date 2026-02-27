'use client'

import { useMemo, useState } from 'react'
import showcaseData from '@/data/spaceShowcaseGallery.json'
import SafeImage from './SafeImage'
import SpaceShowcaseLightbox from './SpaceShowcaseLightbox'
import { ShowcaseCategory, ShowcaseImage } from './types'

type FilterCategory = ShowcaseCategory | 'all'

const categories: Array<{ id: FilterCategory; label: string; icon: string }> = [
  { id: 'all', label: 'All', icon: '✨' },
  { id: 'nebula', label: 'Nebula', icon: '🪐' },
  { id: 'galaxy', label: 'Galaxy', icon: '🌌' },
  { id: 'planet', label: 'Planet', icon: '🛰️' },
  { id: 'mission', label: 'Mission', icon: '🚀' },
]

const images: ShowcaseImage[] = showcaseData as ShowcaseImage[]

export default function SpaceShowcaseGallery() {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const filteredImages = useMemo(() => {
    if (activeCategory === 'all') return images
    return images.filter((item) => item.category === activeCategory)
  }, [activeCategory])

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setLightboxOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    document.body.style.overflow = 'unset'
  }

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredImages.length)
  }

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length)
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`glass px-4 py-3 rounded-xl border-2 font-semibold transition-all hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-400/60 ${
              activeCategory === category.id
                ? 'border-purple-500 bg-purple-500/20 text-white'
                : 'border-purple-500/40 text-purple-100 hover:border-purple-500/70'
            }`}
            aria-pressed={activeCategory === category.id}
            aria-label={`Filter gallery by ${category.label}`}
          >
            <span className="mr-2">{category.icon}</span>
            {category.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredImages.map((image, index) => (
          <article
            key={image.id}
            tabIndex={0}
            role="button"
            aria-label={`${image.title} — open in lightbox`}
            onClick={() => openLightbox(index)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                openLightbox(index)
              }
            }}
            className="group relative overflow-hidden rounded-2xl border-2 border-purple-500/30 hover:border-purple-400/80 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-400/60 bg-space-dark/60"
            style={{ aspectRatio: '4 / 3', minHeight: '220px' }}
          >
            <SafeImage
              src={image.url}
              alt={image.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wide rounded-full bg-purple-500/30 border border-purple-400/60 text-purple-50">
                {image.category}
              </span>
              {image.year && (
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/10 border border-white/30 text-white">
                  {image.year}
                </span>
              )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-lg font-bold text-white mb-1 drop-shadow">{image.title}</h3>
              <p className="text-sm text-gray-200 line-clamp-2">{image.description}</p>
              {image.credit && (
                <div className="mt-2 text-xs text-purple-200/90 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {image.credit}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      {lightboxOpen && filteredImages[currentIndex] && (
        <SpaceShowcaseLightbox
          images={filteredImages}
          currentIndex={currentIndex}
          onClose={closeLightbox}
          onNext={goNext}
          onPrev={goPrev}
        />
      )}
    </div>
  )
}
