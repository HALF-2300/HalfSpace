'use client'

import { useState, ImgHTMLAttributes } from 'react'

interface SafeImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  fallbackSrc?: string
  className?: string
}

/**
 * SafeImage - Image component with fallback support
 * Shows a placeholder if image fails to load
 */
export default function SafeImage({
  src,
  alt,
  fallbackSrc = '/images/space-placeholder.png',
  className = '',
  ...props
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError && imgSrc !== fallbackSrc) {
      setHasError(true)
      setImgSrc(fallbackSrc)
    }
  }

  // If no src provided, show placeholder
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center bg-space-deep border border-purple-500/20 ${className}`}
        {...props}
      >
        <span className="text-4xl opacity-50">🛰️</span>
      </div>
    )
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={handleError}
      className={className}
      {...props}
    />
  )
}
