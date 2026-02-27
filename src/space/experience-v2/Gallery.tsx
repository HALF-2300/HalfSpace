'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import SpaceLightbox from '@/components/space/SpaceLightbox'
import { safeImageSrc, getFallbackImage, handleImageError } from '@/utils/imageFallback'

interface GalleryItem {
  id: string
  title: string
  description: string
  category: string
  url: string
}

interface ExperienceGalleryProps {
  items: GalleryItem[]
}

export default function ExperienceGallery({ items }: ExperienceGalleryProps) {
  const [category, setCategory] = useState<string>('All')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const categories = useMemo(() => ['All', ...Array.from(new Set(items.map((i) => i.category)))], [items])

  const filtered = category === 'All' ? items : items.filter((i) => i.category === category)

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setLightboxOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    document.body.style.overflow = 'unset'
  }

  const next = () => setCurrentIndex((prev) => (prev + 1) % filtered.length)
  const prev = () => setCurrentIndex((prev) => (prev - 1 + filtered.length) % filtered.length)

  const lightboxImages = filtered.map((img, idx) => ({
    id: idx,
    url: img.url,
    title: img.title,
    description: img.description,
  }))

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
              category === cat
                ? 'glass border-purple-400 bg-purple-500/20 text-white'
                : 'glass border-purple-400/30 text-gray-200 hover:border-purple-300/70'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => openLightbox(idx)}
            className="experience-v2-gallery-card relative overflow-hidden rounded-2xl border-2 border-purple-500/30 cursor-pointer"
            style={{ aspectRatio: '16/9' }}
          >
            <Image
              src={safeImageSrc(item.url, getFallbackImage('gallery'))}
              alt={item.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              onError={(e) => handleImageError(e, getFallbackImage('gallery'))}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute top-3 left-3">
              <span className="glass px-2 py-1 rounded-lg border border-blue-400/40 text-xs text-blue-100">
                {item.category}
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-white font-semibold text-lg">{item.title}</h3>
              <p className="text-gray-200 text-sm line-clamp-2">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {lightboxOpen && filtered.length > 0 && (
        <SpaceLightbox
          images={lightboxImages}
          currentIndex={currentIndex}
          onClose={closeLightbox}
          onNext={next}
          onPrev={prev}
        />
      )}
    </div>
  )
}
