'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { safeImageSrc, getFallbackImage, handleImageError } from '@/utils/imageFallback'

interface CompareViewProps {
  beforeImage: string
  afterImage: string
  beforeLabel?: string
  afterLabel?: string
  beforeTitle?: string
  afterTitle?: string
}

export default function CompareView({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After',
  beforeTitle,
  afterTitle,
}: CompareViewProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(percentage)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const touch = e.touches[0]
    const x = touch.clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(percentage)
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      window.addEventListener('touchmove', handleTouchMove)
      window.addEventListener('touchend', handleMouseUp)

      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
        window.removeEventListener('touchmove', handleTouchMove)
        window.removeEventListener('touchend', handleMouseUp)
      }
    }
  }, [isDragging])

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl overflow-hidden border-2 border-purple-500/30 hover:border-purple-500/50 transition-all"
      style={{ aspectRatio: '16/9', minHeight: '400px' }}
    >
      {/* Before Image (Background) */}
      <div className="absolute inset-0">
        <Image
          src={safeImageSrc(beforeImage, getFallbackImage('gallery'))}
          alt={beforeTitle || beforeLabel}
          fill
          className="object-cover"
          sizes="100vw"
          loading="lazy"
          onError={(e) => handleImageError(e, getFallbackImage('gallery'))}
        />
        {beforeTitle && (
          <div className="absolute top-4 left-4 glass px-4 py-2 rounded-lg border border-purple-500/30">
            <p className="text-white font-semibold text-sm">{beforeTitle}</p>
            <p className="text-gray-300 text-xs">{beforeLabel}</p>
          </div>
        )}
      </div>

      {/* After Image (Clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <Image
          src={safeImageSrc(afterImage, getFallbackImage('gallery'))}
          alt={afterTitle || afterLabel}
          fill
          className="object-cover"
          sizes="100vw"
          loading="lazy"
          onError={(e) => handleImageError(e, getFallbackImage('gallery'))}
        />
        {afterTitle && (
          <div className="absolute top-4 right-4 glass px-4 py-2 rounded-lg border border-blue-500/30">
            <p className="text-white font-semibold text-sm">{afterTitle}</p>
            <p className="text-gray-300 text-xs">{afterLabel}</p>
          </div>
        )}
      </div>

      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 flex items-center justify-center"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
      >
        <div className="absolute inset-y-0 w-8 -translate-x-1/2" style={{ left: '50%' }} />
        <div className="glass rounded-full p-2 border-2 border-white shadow-lg">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 9l4-4 4 4m0 6l-4 4-4-4"
            />
          </svg>
        </div>
      </div>

      {/* Labels at bottom */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-between px-4 z-10">
        <div className="glass px-4 py-2 rounded-lg border border-purple-500/30">
          <p className="text-white font-semibold text-sm">{beforeLabel}</p>
        </div>
        <div className="glass px-4 py-2 rounded-lg border border-blue-500/30">
          <p className="text-white font-semibold text-sm">{afterLabel}</p>
        </div>
      </div>
    </div>
  )
}
