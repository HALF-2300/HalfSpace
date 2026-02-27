'use client'

import Image from 'next/image'

interface SpaceLogoProps {
  size?: number
  className?: string
  animated?: boolean
}

export default function SpaceLogo({ 
  size = 64, 
  className = '',
  animated = false 
}: SpaceLogoProps) {
  return (
    <div 
      className={`relative inline-block ${animated ? 'animate-float' : ''} ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/space-icon.svg"
        alt="HalfSPACE Logo"
        width={size}
        height={size}
        priority
        className="w-full h-full"
      />
      {animated && (
        <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl animate-pulse" />
      )}
    </div>
  )
}
