'use client'

import { HTMLAttributes, ReactNode } from 'react'
import '@/components/space/ui-kit/ui-kit.css'

interface SpaceHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  titleAr?: string
  subtitle?: string
  subtitleAr?: string
  icon?: ReactNode
  separator?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export default function SpaceHeader({
  title,
  titleAr,
  subtitle,
  subtitleAr,
  icon,
  separator = true,
  size = 'lg',
  className = '',
  ...props
}: SpaceHeaderProps) {
  const sizeClasses = {
    sm: 'space-header-sm',
    md: 'space-header-md',
    lg: 'space-header-lg',
    xl: 'space-header-xl',
  }

  const classes = [
    'space-header',
    sizeClasses[size],
    className,
  ].filter(Boolean).join(' ')

  return (
    <div className={classes} {...props}>
      {icon && <div className="space-header-icon">{icon}</div>}
      <div className="space-header-content">
        <h1 className="space-header-title">{title}</h1>
        {titleAr && <h2 className="space-header-title-ar">{titleAr}</h2>}
        {subtitle && <p className="space-header-subtitle">{subtitle}</p>}
        {subtitleAr && <p className="space-header-subtitle-ar">{subtitleAr}</p>}
      </div>
      {separator && <div className="space-header-separator" />}
    </div>
  )
}
