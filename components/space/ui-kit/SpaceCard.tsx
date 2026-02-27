'use client'

import { HTMLAttributes, ReactNode } from 'react'
import '@/components/space/ui-kit/ui-kit.css'

interface SpaceCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  hover?: boolean
  glow?: boolean
  variant?: 'default' | 'elevated' | 'flat'
}

export default function SpaceCard({
  children,
  hover = true,
  glow = false,
  variant = 'default',
  className = '',
  ...props
}: SpaceCardProps) {
  const baseClasses = 'space-card'
  const variantClasses = {
    default: 'space-card-default',
    elevated: 'space-card-elevated',
    flat: 'space-card-flat',
  }

  const classes = [
    baseClasses,
    variantClasses[variant],
    hover && 'space-card-hover',
    glow && 'space-card-glow',
    className,
  ].filter(Boolean).join(' ')

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}
