'use client'

import { ReactNode } from 'react'
import SpaceButton from './SpaceButton'
import styles from './play-kit.module.css'

interface SpaceModalProps {
  open: boolean
  title: string
  description?: string
  onClose: () => void
  children?: ReactNode
  actions?: ReactNode
}

export default function SpaceModal({
  open,
  title,
  description,
  onClose,
  children,
  actions
}: SpaceModalProps) {
  if (!open) {
    return null
  }

  return (
    <div className={styles.modalBackdrop} role="dialog" aria-modal="true">
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>{title}</div>
        {description && <p className={styles.modalDescription}>{description}</p>}
        {children}
        <div className={styles.modalActions}>
          {actions}
          <SpaceButton variant="ghost" onClick={onClose}>
            Close
          </SpaceButton>
        </div>
      </div>
    </div>
  )
}
