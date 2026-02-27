'use client'

import { ReactNode } from 'react'
import SpaceBadge from './SpaceBadge'
import styles from './play-kit.module.css'

interface SpaceCardProps {
  title: string
  description: string | ReactNode
  badgeLabel?: string
  accentEmoji?: string
  footer?: ReactNode
}

export default function SpaceCard({
  title,
  description,
  badgeLabel,
  accentEmoji,
  footer
}: SpaceCardProps) {
  return (
    <article className={styles.card}>
      {badgeLabel && (
        <div className={styles.cardBadge}>
          <SpaceBadge label={badgeLabel} icon={accentEmoji} />
        </div>
      )}
      <div className={styles.cardTitle}>{title}</div>
      <p className={styles.cardBody}>{description}</p>
      {footer && <div>{footer}</div>}
    </article>
  )
}
