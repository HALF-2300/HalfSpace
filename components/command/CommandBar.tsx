'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import styles from './Command.module.css'
import { searchItems, getRandomJump, getCategories, getItemsByCategory } from '@/lib/jumpEngine'
import { useShortcuts } from '@/components/keyboard'

interface CommandItem {
  id: string
  title: string
  icon: string
  action: () => void
  category: 'launch' | 'explore' | 'save' | 'learn' | 'compare' | 'routes'
  shortcut?: string
}

export default function CommandBar() {
  const router = useRouter()
  const { setShowOverlay, setShowGuide, addToCompare, currentPageId } = useShortcuts()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [showTip, setShowTip] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Base commands
  const getCommands = useCallback((): CommandItem[] => {
    const commands: CommandItem[] = [
      {
        id: 'random-jump',
        title: 'Random Jump',
        icon: '🚀',
        action: () => {
          const dest = getRandomJump()
          if (dest) router.push(dest.url)
        },
        category: 'launch',
        shortcut: 'J'
      },
      {
        id: 'tonights-journey',
        title: "Tonight's Journey",
        icon: '🌙',
        action: () => router.push('/journey'),
        category: 'routes'
      },
      {
        id: 'quick-run',
        title: '5-Minute Run',
        icon: '⚡',
        action: () => router.push('/journey/play?type=quick-5'),
        category: 'routes'
      },
      {
        id: 'ai-guide',
        title: 'Open AI Guide',
        icon: '🤖',
        action: () => setShowGuide(true),
        category: 'learn',
        shortcut: 'G'
      },
      {
        id: 'compare',
        title: 'Compare Mode',
        icon: '⚖️',
        action: () => router.push('/compare'),
        category: 'compare',
        shortcut: 'C'
      },
      {
        id: 'collections',
        title: 'My Collections',
        icon: '📚',
        action: () => router.push('/collections'),
        category: 'save',
        shortcut: 'S'
      },
      {
        id: 'shortcuts',
        title: 'Keyboard Shortcuts',
        icon: '⌨️',
        action: () => setShowOverlay(true),
        category: 'learn',
        shortcut: '?'
      }
    ]

    // Add category jumps
    const categories = getCategories()
    categories.forEach((cat, i) => {
      commands.push({
        id: `cat-${cat}`,
        title: `Explore ${cat.charAt(0).toUpperCase() + cat.slice(1)}`,
        icon: getCategoryIcon(cat),
        action: () => {
          const items = getItemsByCategory(cat)
          if (items.length > 0) {
            const random = items[Math.floor(Math.random() * items.length)]
            router.push(random.url)
          }
        },
        category: 'explore',
        shortcut: String(i + 1)
      })
    })

    return commands
  }, [router, setShowGuide, setShowOverlay])

  // Search results
  const getResults = useCallback(() => {
    const commands = getCommands()
    
    if (!query) {
      return commands.slice(0, 8)
    }

    // Search commands
    const matchingCommands = commands.filter(cmd =>
      cmd.title.toLowerCase().includes(query.toLowerCase())
    )

    // Search content
    const contentResults = searchItems(query).slice(0, 5).map(item => ({
      id: item.id,
      title: item.title,
      icon: item.icon,
      action: () => router.push(item.url),
      category: 'explore' as const
    }))

    return [...matchingCommands, ...contentResults].slice(0, 10)
  }, [query, getCommands, router])

  const results = getResults()

  // Open handler
  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true)
      setTimeout(() => inputRef.current?.focus(), 50)
    }

    window.addEventListener('halfspace:open-search', handleOpen)
    return () => window.removeEventListener('halfspace:open-search', handleOpen)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
        setQuery('')
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(i => Math.min(i + 1, results.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(i => Math.max(i - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const selected = results[selectedIndex]
        if (selected) {
          selected.action()
          setIsOpen(false)
          setQuery('')
        }
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, results, selectedIndex])

  // Reset selected on query change
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  // Show tip when user clicks UI instead of using keyboard
  const showKeyboardTip = (shortcut: string) => {
    setShowTip(`Tip: Press ${shortcut} next time`)
    setTimeout(() => setShowTip(null), 3000)
  }

  return (
    <>
      {/* Hint badge */}
      <div className={styles.hint}>
        <span>Press</span>
        <kbd>/</kbd>
        <span>to search</span>
        <span className={styles.hintDivider}>•</span>
        <kbd>?</kbd>
        <span>shortcuts</span>
      </div>

      {/* Tip toast */}
      {showTip && (
        <div className={styles.tip}>
          {showTip}
        </div>
      )}

      {/* Command palette */}
      {isOpen && (
        <div className={styles.overlay} onClick={() => setIsOpen(false)}>
          <div className={styles.palette} onClick={e => e.stopPropagation()}>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>🔍</span>
              <input
                ref={inputRef}
                type="text"
                className={styles.input}
                placeholder="Search or jump to..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                autoComplete="off"
              />
              <kbd className={styles.escKey}>esc</kbd>
            </div>

            <div className={styles.results}>
              {results.map((item, index) => (
                <button
                  key={item.id}
                  className={`${styles.result} ${index === selectedIndex ? styles.resultSelected : ''}`}
                  onClick={() => {
                    item.action()
                    if ('shortcut' in item && item.shortcut) showKeyboardTip(item.shortcut)
                    setIsOpen(false)
                    setQuery('')
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <span className={styles.resultIcon}>{item.icon}</span>
                  <span className={styles.resultTitle}>{item.title}</span>
                  {'shortcut' in item && item.shortcut && (
                    <kbd className={styles.resultShortcut}>{item.shortcut}</kbd>
                  )}
                </button>
              ))}

              {results.length === 0 && (
                <div className={styles.noResults}>
                  No results for "{query}"
                </div>
              )}
            </div>

            <div className={styles.footer}>
              <span><kbd>↑↓</kbd> navigate</span>
              <span><kbd>↵</kbd> select</span>
              <span><kbd>esc</kbd> close</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    objects: '🪐',
    phenomena: '🌌',
    missions: '🛰️',
    guides: '📖',
    learning: '🎓',
    experiences: '🎮',
    tools: '🔧'
  }
  return icons[category] || '⭐'
}
