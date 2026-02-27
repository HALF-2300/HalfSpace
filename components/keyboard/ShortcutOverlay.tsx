'use client'

import { useEffect } from 'react'
import styles from './Keyboard.module.css'
import { getShortcutGroups, CATEGORY_SHORTCUTS } from '@/lib/keyboardShortcuts'

interface ShortcutOverlayProps {
  onClose: () => void
}

export default function ShortcutOverlay({ onClose }: ShortcutOverlayProps) {
  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  const groups = getShortcutGroups()

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>⌨️ Keyboard Shortcuts</h2>
          <p className={styles.subtitle}>Navigate HalfSpace like a pro</p>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.content}>
          {/* Main Shortcuts */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Quick Actions</h3>
            <div className={styles.shortcutGrid}>
              <ShortcutRow keyLabel="J" description="Random jump anywhere" />
              <ShortcutRow keyLabel="S" description="Save/bookmark page" />
              <ShortcutRow keyLabel="C" description="Add to compare" />
              <ShortcutRow keyLabel="G" description="Open AI Guide" />
              <ShortcutRow keyLabel="R" description="Random in category" />
              <ShortcutRow keyLabel="/" description="Open search" />
              <ShortcutRow keyLabel="?" description="Show this help" isShift />
              <ShortcutRow keyLabel="Esc" description="Close any modal" />
            </div>
          </div>

          {/* Category Shortcuts */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Category Jump</h3>
            <div className={styles.shortcutGrid}>
              {CATEGORY_SHORTCUTS.map(({ key, label }) => (
                <ShortcutRow key={key} keyLabel={key} description={`Jump to ${label}`} />
              ))}
            </div>
          </div>

          {/* Navigation Shortcuts */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Navigation</h3>
            <div className={styles.shortcutGrid}>
              <ShortcutRow keyLabel="←→" description="Previous/Next page" />
              <ShortcutRow keyLabel="↑↓" description="Scroll up/down" />
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <p>Press <kbd>Esc</kbd> or click outside to close</p>
        </div>
      </div>
    </div>
  )
}

function ShortcutRow({ 
  keyLabel, 
  description, 
  isShift = false 
}: { 
  keyLabel: string
  description: string
  isShift?: boolean 
}) {
  return (
    <div className={styles.shortcutRow}>
      <div className={styles.keyCombo}>
        {isShift && <kbd className={styles.key}>Shift</kbd>}
        {isShift && <span className={styles.plus}>+</span>}
        <kbd className={styles.key}>{keyLabel}</kbd>
      </div>
      <span className={styles.description}>{description}</span>
    </div>
  )
}
