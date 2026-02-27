'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './Compare.module.css'
import {
  compare,
  getAllComparableItems,
  getComparisonSuggestions,
  ComparableItem,
  CompareResult
} from '@/lib/compareEngine'
import { useShortcuts } from '@/components/keyboard'

export default function CompareMode() {
  const { compareList, removeFromCompare, clearCompare } = useShortcuts()
  const [result, setResult] = useState<CompareResult | null>(null)
  const [showSelector, setShowSelector] = useState(false)
  const [allItems, setAllItems] = useState<ComparableItem[]>([])
  const [filter, setFilter] = useState<string>('')

  useEffect(() => {
    if (compareList.length > 0) {
      setResult(compare(compareList))
    } else {
      setResult(null)
    }
  }, [compareList])

  useEffect(() => {
    setAllItems(getAllComparableItems())
  }, [])

  const suggestions = getComparisonSuggestions()

  const filteredItems = filter
    ? allItems.filter(item => 
        item.name.toLowerCase().includes(filter.toLowerCase()) ||
        item.type.toLowerCase().includes(filter.toLowerCase())
      )
    : allItems

  if (compareList.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>⚖️</div>
        <h2 className={styles.emptyTitle}>Compare Mode</h2>
        <p className={styles.emptyText}>
          Add celestial objects to compare them side-by-side.
          Press <kbd>C</kbd> on any planet or star page to add it here.
        </p>
        
        <div className={styles.suggestions}>
          <h3 className={styles.suggestionsTitle}>Quick Comparisons</h3>
          <div className={styles.suggestionGrid}>
            {suggestions.map((suggestion) => (
              <Link
                key={suggestion.name}
                href={`/compare?ids=${suggestion.ids.join(',')}`}
                className={styles.suggestionCard}
              >
                <span className={styles.suggestionIcon}>🔄</span>
                <span className={styles.suggestionName}>{suggestion.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>⚖️ Compare Mode</h1>
        <div className={styles.headerActions}>
          <span className={styles.count}>{compareList.length}/4 objects</span>
          <button className={styles.clearButton} onClick={clearCompare}>
            Clear All
          </button>
        </div>
      </div>

      {/* Comparison Grid */}
      {result && (
        <>
          <div className={styles.compareGrid} style={{ gridTemplateColumns: `repeat(${result.items.length}, 1fr)` }}>
            {result.items.map((item) => (
              <CompareCard
                key={item.id}
                item={item}
                onRemove={() => removeFromCompare(item.id)}
              />
            ))}
          </div>

          {/* Metrics */}
          <div className={styles.metricsSection}>
            <h2 className={styles.sectionTitle}>Measurements</h2>
            {result.metrics.map((metric) => (
              <div key={metric.name} className={styles.metricRow}>
                <div className={styles.metricLabel}>
                  <span className={styles.metricName}>{metric.name}</span>
                  <span className={styles.metricUnit}>{metric.unit}</span>
                </div>
                <div className={styles.metricBars}>
                  {metric.values.map((value, i) => (
                    <div key={i} className={styles.metricBarContainer}>
                      <div
                        className={styles.metricBar}
                        style={{
                          width: value !== null ? `${(value / metric.maxValue) * 100}%` : '0%'
                        }}
                      />
                      <span className={styles.metricValue}>
                        {metric.displayValues[i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Insights */}
          {result.insights.length > 0 && (
            <div className={styles.insightsSection}>
              <h2 className={styles.sectionTitle}>💡 Insights</h2>
              <div className={styles.insightsList}>
                {result.insights.map((insight, i) => (
                  <div key={i} className={styles.insightCard}>
                    <span className={styles.insightIcon}>
                      {insight.type === 'size' ? '📏' : 
                       insight.type === 'distance' ? '🚀' : '⭐'}
                    </span>
                    <span className={styles.insightText}>{insight.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Add More Button */}
      {compareList.length < 4 && (
        <button
          className={styles.addButton}
          onClick={() => setShowSelector(true)}
        >
          + Add Object
        </button>
      )}

      {/* Item Selector Modal */}
      {showSelector && (
        <ItemSelector
          items={filteredItems}
          excludeIds={compareList}
          filter={filter}
          onFilterChange={setFilter}
          onClose={() => setShowSelector(false)}
        />
      )}
    </div>
  )
}

function CompareCard({ item, onRemove }: { item: ComparableItem; onRemove: () => void }) {
  return (
    <div className={styles.card}>
      <button className={styles.removeButton} onClick={onRemove}>
        ✕
      </button>
      
      <div className={styles.cardImage}>
        <Image
          src={item.image}
          alt={item.name}
          fill
          style={{ objectFit: 'cover' }}
          unoptimized
        />
      </div>
      
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{item.name}</h3>
        <span className={styles.cardType}>{item.type}</span>
        
        <div className={styles.cardFacts}>
          {item.facts.slice(0, 2).map((fact, i) => (
            <p key={i} className={styles.cardFact}>{fact}</p>
          ))}
        </div>
        
        <div className={styles.cardTags}>
          {item.tags.slice(0, 3).map((tag) => (
            <span key={tag} className={styles.cardTag}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function ItemSelector({
  items,
  excludeIds,
  filter,
  onFilterChange,
  onClose
}: {
  items: ComparableItem[]
  excludeIds: string[]
  filter: string
  onFilterChange: (filter: string) => void
  onClose: () => void
}) {
  const { addToCompare } = useShortcuts()
  
  const availableItems = items.filter(item => !excludeIds.includes(item.id))

  const handleSelect = (id: string) => {
    addToCompare(id)
    onClose()
  }

  return (
    <div className={styles.selectorOverlay} onClick={onClose}>
      <div className={styles.selectorModal} onClick={e => e.stopPropagation()}>
        <div className={styles.selectorHeader}>
          <h2>Add to Compare</h2>
          <button className={styles.selectorClose} onClick={onClose}>✕</button>
        </div>
        
        <input
          type="text"
          className={styles.selectorSearch}
          placeholder="Search planets, stars..."
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          autoFocus
        />
        
        <div className={styles.selectorList}>
          {availableItems.map((item) => (
            <button
              key={item.id}
              className={styles.selectorItem}
              onClick={() => handleSelect(item.id)}
            >
              <div className={styles.selectorItemImage}>
                <Image
                  src={item.image}
                  alt={item.name}
                  width={48}
                  height={48}
                  style={{ objectFit: 'cover', borderRadius: '8px' }}
                  unoptimized
                />
              </div>
              <div className={styles.selectorItemInfo}>
                <span className={styles.selectorItemName}>{item.name}</span>
                <span className={styles.selectorItemType}>{item.type}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
