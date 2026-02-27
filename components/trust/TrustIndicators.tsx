'use client'

import { useState } from 'react'
import styles from './Trust.module.css'
import {
  getTrustInfo,
  getConfidence,
  formatLastUpdated,
  CONFIDENCE_INFO,
  Source,
  ConfidenceLevel
} from '@/lib/trustIndicators'

interface TrustIndicatorsProps {
  topicId: string
  compact?: boolean
}

export default function TrustIndicators({ topicId, compact = false }: TrustIndicatorsProps) {
  const [showDetails, setShowDetails] = useState(false)
  const trustInfo = getTrustInfo(topicId)
  const confidence = getConfidence(topicId)

  if (compact) {
    return (
      <div className={styles.compactWrapper}>
        <SourceChips sources={trustInfo.sources} maxShow={2} />
        <span className={styles.compactDivider}>•</span>
        <ConfidenceBadge level={confidence.level} compact />
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <SourceChips sources={trustInfo.sources} />
        <button 
          className={styles.detailsToggle}
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Hide details' : 'View details'}
        </button>
      </div>

      <div className={styles.row}>
        <ConfidenceBadge level={confidence.level} />
        <LastUpdated date={trustInfo.lastUpdated} />
      </div>

      {showDetails && (
        <div className={styles.details}>
          <div className={styles.detailSection}>
            <h4>Sources</h4>
            <div className={styles.sourceList}>
              {trustInfo.sources.map(source => (
                <a
                  key={source.id}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.sourceLink}
                >
                  <span className={styles.sourceName}>{source.name}</span>
                  <span className={styles.sourceType}>{source.type}</span>
                </a>
              ))}
            </div>
          </div>

          <div className={styles.detailSection}>
            <h4>Confidence Level</h4>
            <p className={styles.confidenceDescription}>
              {confidence.info.description}
            </p>
            {confidence.note && (
              <p className={styles.confidenceNote}>
                ℹ️ {confidence.note}
              </p>
            )}
          </div>

          <div className={styles.detailSection}>
            <h4>What does this mean?</h4>
            <div className={styles.confidenceLegend}>
              {Object.entries(CONFIDENCE_INFO).map(([level, info]) => (
                <div 
                  key={level} 
                  className={`${styles.legendItem} ${level === confidence.level ? styles.legendActive : ''}`}
                >
                  <span 
                    className={styles.legendDot}
                    style={{ background: info.color }}
                  />
                  <span className={styles.legendLabel}>{info.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Source Chips Component
export function SourceChips({ 
  sources, 
  maxShow = 4 
}: { 
  sources: Source[]
  maxShow?: number 
}) {
  const visibleSources = sources.slice(0, maxShow)
  const hiddenCount = sources.length - maxShow

  return (
    <div className={styles.chips}>
      {visibleSources.map(source => (
        <a
          key={source.id}
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.chip}
          style={{ 
            '--chip-color': source.color,
            background: `${source.color}20`,
            borderColor: `${source.color}40`
          } as React.CSSProperties}
          title={source.name}
        >
          {source.abbrev}
        </a>
      ))}
      {hiddenCount > 0 && (
        <span className={styles.chipMore}>+{hiddenCount}</span>
      )}
    </div>
  )
}

// Confidence Badge Component
export function ConfidenceBadge({ 
  level, 
  compact = false 
}: { 
  level: ConfidenceLevel
  compact?: boolean 
}) {
  const info = CONFIDENCE_INFO[level]

  return (
    <div 
      className={`${styles.confidence} ${compact ? styles.confidenceCompact : ''}`}
      style={{ 
        '--confidence-color': info.color,
        background: `${info.color}15`,
        borderColor: `${info.color}30`
      } as React.CSSProperties}
      title={info.description}
    >
      <span 
        className={styles.confidenceDot}
        style={{ background: info.color }}
      />
      <span className={styles.confidenceLabel}>{info.label}</span>
    </div>
  )
}

// Last Updated Component
export function LastUpdated({ date }: { date: string }) {
  return (
    <span className={styles.lastUpdated}>
      Updated {formatLastUpdated(date)}
    </span>
  )
}

// Inline fact source
export function FactSource({ source }: { source: string }) {
  return (
    <span className={styles.factSource}>
      Source: {source}
    </span>
  )
}
