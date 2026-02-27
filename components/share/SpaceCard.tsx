'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import styles from './Share.module.css'
import {
  ShareCardData,
  generateShareUrl,
  generateShareText,
  copyToClipboard,
  shareViaWebShare,
  getTwitterShareUrl,
  getFacebookShareUrl,
  getWhatsAppShareUrl
} from '@/lib/shareCard'

interface SpaceCardProps {
  data: ShareCardData
  onClose?: () => void
  showActions?: boolean
}

export default function SpaceCard({ data, onClose, showActions = true }: SpaceCardProps) {
  const [copied, setCopied] = useState(false)
  const [showSocial, setShowSocial] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleCopyLink = async () => {
    const url = generateShareUrl(data)
    await copyToClipboard(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyCard = async () => {
    const text = generateShareText(data)
    await copyToClipboard(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    const success = await shareViaWebShare(data)
    if (!success) {
      setShowSocial(true)
    }
  }

  return (
    <div className={styles.cardWrapper}>
      <div ref={cardRef} className={styles.card}>
        {/* Image */}
        <div className={styles.cardImage}>
          <Image
            src={data.image}
            alt={data.title}
            fill
            style={{ objectFit: 'cover' }}
            unoptimized
          />
          <div className={styles.cardOverlay} />
        </div>

        {/* Content */}
        <div className={styles.cardContent}>
          <span className={styles.cardType}>{data.type}</span>
          <h2 className={styles.cardTitle}>{data.title}</h2>
          <p className={styles.cardFact}>{data.fact}</p>
          
          {data.tags.length > 0 && (
            <div className={styles.cardTags}>
              {data.tags.slice(0, 3).map(tag => (
                <span key={tag} className={styles.cardTag}>#{tag}</span>
              ))}
            </div>
          )}

          <div className={styles.cardBrand}>
            <span className={styles.brandIcon}>🚀</span>
            <span className={styles.brandName}>HalfSpace</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className={styles.actions}>
          <button className={styles.actionButton} onClick={handleShare}>
            <span>📤</span>
            <span>Share</span>
          </button>
          <button className={styles.actionButton} onClick={handleCopyLink}>
            <span>🔗</span>
            <span>{copied ? 'Copied!' : 'Copy Link'}</span>
          </button>
          <button className={styles.actionButton} onClick={handleCopyCard}>
            <span>📋</span>
            <span>Copy Text</span>
          </button>
        </div>
      )}

      {/* Social Share Dropdown */}
      {showSocial && (
        <div className={styles.socialShare}>
          <a 
            href={getTwitterShareUrl(data)} 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.socialButton}
          >
            𝕏 Twitter
          </a>
          <a 
            href={getFacebookShareUrl(data)} 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.socialButton}
          >
            Facebook
          </a>
          <a 
            href={getWhatsAppShareUrl(data)} 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.socialButton}
          >
            WhatsApp
          </a>
          <button 
            className={styles.socialClose}
            onClick={() => setShowSocial(false)}
          >
            Close
          </button>
        </div>
      )}

      {onClose && (
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>
      )}
    </div>
  )
}

// Modal wrapper for share card
export function ShareCardModal({ data, onClose }: { data: ShareCardData; onClose: () => void }) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <SpaceCard data={data} onClose={onClose} />
      </div>
    </div>
  )
}

// Button to trigger share card
export function ShareButton({ 
  data, 
  compact = false 
}: { 
  data: ShareCardData
  compact?: boolean 
}) {
  const [showCard, setShowCard] = useState(false)

  const handleQuickShare = async () => {
    const success = await shareViaWebShare(data)
    if (!success) {
      setShowCard(true)
    }
  }

  if (compact) {
    return (
      <>
        <button 
          className={styles.shareButtonCompact}
          onClick={handleQuickShare}
          title="Share"
        >
          📤
        </button>
        {showCard && (
          <ShareCardModal data={data} onClose={() => setShowCard(false)} />
        )}
      </>
    )
  }

  return (
    <>
      <button 
        className={styles.shareButton}
        onClick={() => setShowCard(true)}
      >
        <span>📤</span>
        <span>Share</span>
      </button>
      {showCard && (
        <ShareCardModal data={data} onClose={() => setShowCard(false)} />
      )}
    </>
  )
}
