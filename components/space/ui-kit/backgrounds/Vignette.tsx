'use client'

import { HTMLAttributes } from 'react'
import './backgrounds.css'

interface VignetteProps extends HTMLAttributes<HTMLDivElement> {
  intensity?: 'light' | 'medium' | 'strong'
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right'
}

export default function Vignette({
  intensity = 'medium',
  position = 'center',
  className = '',
  ...props
}: VignetteProps) {
  const intensityClasses = {
    light: 'vignette-light',
    medium: 'vignette-medium',
    strong: 'vignette-strong',
  }

  const positionClasses = {
    center: 'vignette-center',
    top: 'vignette-top',
    bottom: 'vignette-bottom',
    left: 'vignette-left',
    right: 'vignette-right',
  }

  return (
    <div
      className={`vignette ${intensityClasses[intensity]} ${positionClasses[position]} ${className}`}
      {...props}
    />
  )
}
