'use client'

import { ButtonHTMLAttributes } from 'react'
import styles from './play-kit.module.css'

type Variant = 'primary' | 'secondary' | 'ghost'

interface SpaceButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  className?: string
}

export default function SpaceButton({
  children,
  variant = 'primary',
  className = '',
  ...props
}: SpaceButtonProps) {
  const variantClass =
    variant === 'secondary'
      ? styles.buttonSecondary
      : variant === 'ghost'
      ? styles.buttonGhost
      : styles.buttonPrimary

  return (
    <button className={`${styles.buttonBase} ${variantClass} ${className}`} {...props}>
      {children}
    </button>
  )
}
