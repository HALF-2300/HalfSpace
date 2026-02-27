'use client'

import styles from './play-kit.module.css'

interface SpaceBadgeProps {
  label: string
  icon?: string
}

export default function SpaceBadge({ label, icon }: SpaceBadgeProps) {
  return (
    <span className={styles.badge}>
      {icon && <span aria-hidden="true">{icon}</span>}
      <span>{label}</span>
    </span>
  )
}
