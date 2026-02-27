'use client'

import { HTMLAttributes } from 'react'
import './backgrounds.css'

interface StarHazeOverlayProps extends HTMLAttributes<HTMLDivElement> {
  intensity?: 'light' | 'medium' | 'heavy'
  opacity?: number
}

export default function StarHazeOverlay({
  intensity = 'medium',
  opacity,
  className = '',
  ...props
}: StarHazeOverlayProps) {
  const intensityClasses = {
    light: 'star-haze-light',
    medium: 'star-haze-medium',
    heavy: 'star-haze-heavy',
  }

  const defaultOpacity = {
    light: 0.3,
    medium: 0.5,
    heavy: 0.7,
  }

  const style = {
    opacity: opacity ?? defaultOpacity[intensity],
    ...props.style,
  }

  return (
    <div
      className={`star-haze-overlay ${intensityClasses[intensity]} ${className}`}
      style={style}
      {...props}
    >
      {/* Animated stars */}
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="star-haze-star"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  )
}
