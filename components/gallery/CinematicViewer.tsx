'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { savedItems } from '@/components/console/SavedItems'
import { getItemsByCategory, getItemById, type JumpDestination } from '@/lib/jumpEngine'
import './cinematicViewer.css'

export interface GalleryImage {
  id: string
  title: string
  description: string
  category: string
  url: string
  related?: string[] // IDs from contentIndex
}

interface CinematicViewerProps {
  images: GalleryImage[]
  initialIndex?: number
  onClose: () => void
}

/**
 * CinematicViewer - Fullscreen immersive gallery experience
 * 
 * Features:
 * - Fullscreen mode with Escape to exit
 * - Arrow keys for navigation
 * - Preload next/prev images
 * - "Jump from this image" with related content
 * - Save to collection
 * - Share functionality
 */
export default function CinematicViewer({ images, initialIndex = 0, onClose }: CinematicViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [showInfo, setShowInfo] = useState(true)
  const [showJumpMenu, setShowJumpMenu] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const router = useRouter()

  const currentImage = images[currentIndex]
  
  // Get related items for "Jump from this image"
  const relatedItems = getRelatedContent(currentImage)

  // Check if current image is saved
  useEffect(() => {
    setIsSaved(savedItems.isSaved(`gallery-${currentImage.id}`))
  }, [currentImage.id])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goToPrevious()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        goToNext()
      } else if (e.key === 'i' || e.key === 'I') {
        setShowInfo(prev => !prev)
      } else if (e.key === 'j' || e.key === 'J') {
        setShowJumpMenu(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex])

  // Preload adjacent images
  useEffect(() => {
    const preloadImage = (index: number) => {
      if (index >= 0 && index < images.length) {
        const img = new window.Image()
        img.src = images[index].url
      }
    }

    preloadImage(currentIndex + 1)
    preloadImage(currentIndex - 1)
  }, [currentIndex, images])

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % images.length)
    setShowJumpMenu(false)
  }, [images.length])

  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + images.length) % images.length)
    setShowJumpMenu(false)
  }, [images.length])

  const handleSave = () => {
    if (isSaved) {
      savedItems.remove(`gallery-${currentImage.id}`)
      setIsSaved(false)
    } else {
      savedItems.save({
        id: `gallery-${currentImage.id}`,
        title: currentImage.title,
        type: 'page',
        url: `/space/gallery?image=${currentImage.id}`
      })
      setIsSaved(true)
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: `${currentImage.title} - HalfSpace Gallery`,
      text: currentImage.description,
      url: `${window.location.origin}/space/gallery?image=${currentImage.id}`
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareData.url)
    }
  }

  const handleJumpTo = (destination: JumpDestination) => {
    router.push(destination.url)
    onClose()
  }

  return (
    <div className="cinematic-viewer">
      {/* Main Image */}
      <div className="cinematic-image-container">
        <Image
          src={currentImage.url}
          alt={currentImage.title}
          fill
          className="cinematic-image"
          priority
          quality={95}
        />
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="cinematic-btn cinematic-btn-close"
        aria-label="Close viewer (ESC)"
      >
        ✕
      </button>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="cinematic-btn cinematic-btn-prev"
        aria-label="Previous image (←)"
      >
        ←
      </button>

      <button
        onClick={goToNext}
        className="cinematic-btn cinematic-btn-next"
        aria-label="Next image (→)"
      >
        →
      </button>

      {/* Info Overlay */}
      {showInfo && (
        <div className="cinematic-info">
          <div className="cinematic-info-content">
            <h2 className="cinematic-title">{currentImage.title}</h2>
            <p className="cinematic-description">{currentImage.description}</p>
            <div className="cinematic-meta">
              <span className="cinematic-category">{currentImage.category}</span>
              <span className="cinematic-counter">
                {currentIndex + 1} / {images.length}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="cinematic-actions">
        <button
          onClick={() => setShowInfo(prev => !prev)}
          className="cinematic-action-btn"
          title="Toggle info (I)"
        >
          {showInfo ? '👁️' : '👁️‍🗨️'}
        </button>

        <button
          onClick={handleSave}
          className="cinematic-action-btn"
          title={isSaved ? 'Remove from collection' : 'Save to collection'}
        >
          {isSaved ? '★' : '☆'}
        </button>

        <button
          onClick={handleShare}
          className="cinematic-action-btn"
          title="Share this image"
        >
          ↗
        </button>

        <button
          onClick={() => setShowJumpMenu(prev => !prev)}
          className="cinematic-action-btn cinematic-action-jump"
          title="Jump from this image (J)"
        >
          🎲 Jump
        </button>
      </div>

      {/* Jump Menu */}
      {showJumpMenu && relatedItems.length > 0 && (
        <div className="cinematic-jump-menu">
          <div className="cinematic-jump-header">
            <h3>Jump from this {currentImage.category.toLowerCase()}</h3>
            <button onClick={() => setShowJumpMenu(false)}>✕</button>
          </div>
          
          <div className="cinematic-jump-items">
            {relatedItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleJumpTo(item)}
                className="cinematic-jump-item"
              >
                <span className="cinematic-jump-icon">{item.icon}</span>
                <div className="cinematic-jump-text">
                  <div className="cinematic-jump-title">{item.title}</div>
                  <div className="cinematic-jump-desc">{item.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Keyboard Hints */}
      <div className="cinematic-hints">
        <span>←→ Navigate</span>
        <span>I Info</span>
        <span>J Jump</span>
        <span>ESC Close</span>
      </div>
    </div>
  )
}

/**
 * Get related content based on image category
 */
function getRelatedContent(image: GalleryImage): JumpDestination[] {
  const related: JumpDestination[] = []

  // If image has explicit related IDs, use those
  if (image.related && image.related.length > 0) {
    image.related.forEach(id => {
      const item = getItemById(id)
      if (item) related.push(item)
    })
  }

  // Otherwise, get items by category
  if (related.length === 0) {
    const categoryMap: Record<string, string> = {
      'Nebula': 'phenomena',
      'Galaxy': 'objects',
      'Planet': 'objects',
      'Mission': 'missions'
    }

    const category = categoryMap[image.category]
    if (category) {
      const items = getItemsByCategory(category)
      // Get 3-4 random related items
      const shuffled = items.sort(() => 0.5 - Math.random())
      related.push(...shuffled.slice(0, 4))
    }
  }

  return related
}
