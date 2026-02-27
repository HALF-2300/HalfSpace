'use client'

import { ButtonHTMLAttributes, ReactNode } from 'react'
import '@/components/space/ui-kit/ui-kit.css'

interface SpaceButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  children: ReactNode
}

export default function SpaceButton({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  children,
  className = '',
  ...props
}: SpaceButtonProps) {
  const baseClasses = 'space-button'
  const variantClasses = {
    primary: 'space-button-primary',
    secondary: 'space-button-secondary',
    ghost: 'space-button-ghost',
    danger: 'space-button-danger',
  }
  const sizeClasses = {
    sm: 'space-button-sm',
    md: 'space-button-md',
    lg: 'space-button-lg',
  }

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className,
  ].filter(Boolean).join(' ')

  return (
    <button className={classes} {...props}>
      {icon && iconPosition === 'left' && (
        <span className="space-button-icon-left">{icon}</span>
      )}
      <span>{children}</span>
      {icon && iconPosition === 'right' && (
        <span className="space-button-icon-right">{icon}</span>
      )}
    </button>
  )
}
