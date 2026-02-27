'use client'

import { HTMLAttributes } from 'react'
import './backgrounds.css'

interface NebulaGradientProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'purple' | 'blue' | 'pink' | 'mixed'
  intensity?: 'light' | 'medium' | 'strong'
}

export default function NebulaGradient({
  variant = 'mixed',
  intensity = 'medium',
  className = '',
  ...props
}: NebulaGradientProps) {
  const variantClasses = {
    purple: 'nebula-gradient-purple',
    blue: 'nebula-gradient-blue',
    pink: 'nebula-gradient-pink',
    mixed: 'nebula-gradient-mixed',
  }

  const intensityClasses = {
    light: 'nebula-intensity-light',
    medium: 'nebula-intensity-medium',
    strong: 'nebula-intensity-strong',
  }

  return (
    <div
      className={`nebula-gradient ${variantClasses[variant]} ${intensityClasses[intensity]} ${className}`}
      {...props}
    />
  )
}
