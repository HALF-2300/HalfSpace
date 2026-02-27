'use client'

import { useEffect, ReactNode } from 'react'
import '@/components/space/ui-kit/ui-kit.css'

interface SpaceModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  titleAr?: string
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closeOnBackdrop?: boolean
}

export default function SpaceModal({
  isOpen,
  onClose,
  title,
  titleAr,
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true,
}: SpaceModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="space-modal-overlay" onClick={closeOnBackdrop ? onClose : undefined}>
      <div
        className={`space-modal space-modal-${size}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || titleAr) && (
          <div className="space-modal-header">
            <div>
              {title && <h2 className="space-modal-title">{title}</h2>}
              {titleAr && <h3 className="space-modal-title-ar">{titleAr}</h3>}
            </div>
            <button
              className="space-modal-close"
              onClick={onClose}
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Body */}
        <div className="space-modal-body">{children}</div>

        {/* Footer */}
        {footer && <div className="space-modal-footer">{footer}</div>}
      </div>
    </div>
  )
}
