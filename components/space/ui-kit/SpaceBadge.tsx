'use client'

import { HTMLAttributes, ReactNode } from 'react'
import '@/components/space/ui-kit/ui-kit.css'

interface SpaceBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'info' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  icon?: ReactNode
}

export default function SpaceBadge({
  children,
  variant = 'default',
  size = 'md',
  icon,
  className = '',
  ...props
}: SpaceBadgeProps) {
  const baseClasses = 'space-badge'
  const variantClasses = {
    default: 'space-badge-default',
    success: 'space-badge-success',
    warning: 'space-badge-warning',
    info: 'space-badge-info',
    danger: 'space-badge-danger',
  }
  const sizeClasses = {
    sm: 'space-badge-sm',
    md: 'space-badge-md',
    lg: 'space-badge-lg',
  }

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className,
  ].filter(Boolean).join(' ')

  return (
    <span className={classes} {...props}>
      {icon && <span className="space-badge-icon">{icon}</span>}
      <span>{children}</span>
    </span>
  )
}
