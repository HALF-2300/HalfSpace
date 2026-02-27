'use client'

import { useState } from 'react'
import Image from 'next/image'
import spaceContent from '@/data/spaceContent.json'
import { getImageLoadingStrategy } from '@/utils/perf'
import { handleImageError, getFallbackImage, safeImageSrc } from '@/utils/imageFallback'

// Type assertion for the imported JSON
const spaceContentData = spaceContent as {
  spaceImages: {
    'solar-system'?: string[]
    'missions'?: string[]
    'black-holes'?: string[]
    'stars'?: string[]
    'telescopes'?: string[]
  }
}

interface LightGalleryProps {
  images?: string[]
  category?: keyof typeof spaceContent.spaceImages
  viewMoreHref?: string
}

export default function LightGallery({ images, category, viewMoreHref }: LightGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  let galleryImages: string[] = []
  
  if (images && images.length > 0) {
    // De-dupe to prevent repeated tiles
    galleryImages = Array.from(new Set(images)).slice(0, 6)
  } else if (category && spaceContentData.spaceImages[category]) {
    // De-dupe to prevent repeated tiles
    galleryImages = Array.from(new Set(spaceContentData.spaceImages[category]!)).slice(0, 6)
  }

  if (galleryImages.length === 0) return null

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {galleryImages.map((img, index) => (
          <div
            key={index}
            onClick={() => setSelectedImage(index)}
            className="relative aspect-square rounded-lg overflow-hidden border border-purple-500/30 hover:border-purple-500/60 transition-all hover-lift cursor-pointer group"
          >
            <Image
              src={safeImageSrc(img, getFallbackImage('gallery'))}
              alt={`Gallery image ${index + 1}`}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              unoptimized={img.startsWith('http')}
              loading={getImageLoadingStrategy(false, index < 3)}
              sizes="(max-width: 768px) 50vw, 33vw"
              quality={75}
              onError={(e) => handleImageError(e, getFallbackImage('gallery'))}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-space-dark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>

      {viewMoreHref && (
        <div className="text-center">
          <a
            href={viewMoreHref}
            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl text-white font-semibold transition-all hover:scale-105 shadow-lg"
          >
            View More →
          </a>
        </div>
      )}

      {/* Modal */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation()
              setSelectedImage(null)
            }}
            className="absolute top-4 right-4 text-white text-3xl hover:text-purple-400 transition-colors z-10"
            aria-label="Close"
          >
            ×
          </button>
          <div className="relative max-w-6xl max-h-[90vh] w-full h-full">
            <Image
              src={safeImageSrc(galleryImages[selectedImage], getFallbackImage('gallery'))}
              alt={`Gallery image ${selectedImage + 1}`}
              fill
              className="object-contain"
              unoptimized={galleryImages[selectedImage].startsWith('http')}
              onError={(e) => handleImageError(e, getFallbackImage('gallery'))}
            />
          </div>
          {selectedImage > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setSelectedImage(selectedImage - 1)
              }}
              className="absolute left-4 text-white text-4xl hover:text-purple-400 transition-colors z-10"
              aria-label="Previous"
            >
              ‹
            </button>
          )}
          {selectedImage < galleryImages.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setSelectedImage(selectedImage + 1)
              }}
              className="absolute right-4 text-white text-4xl hover:text-purple-400 transition-colors z-10"
              aria-label="Next"
            >
              ›
            </button>
          )}
        </div>
      )}
    </>
  )
}
