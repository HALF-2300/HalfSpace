'use client'

import { useEffect, useCallback, createContext, useContext, useState, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  registerShortcut,
  handleKeyboardEvent,
  DEFAULT_SHORTCUTS,
  CATEGORY_SHORTCUTS,
  getShortcuts,
  Shortcut
} from '@/lib/keyboardShortcuts'
import { getRandomJump, getItemsByCategory } from '@/lib/jumpEngine'
import { toggleBookmark, isBookmarked } from '@/lib/explorerProfile'
import ShortcutOverlay from './ShortcutOverlay'

// ============================================================================
// Context
// ============================================================================

interface ShortcutContextValue {
  showOverlay: boolean
  setShowOverlay: (show: boolean) => void
  showGuide: boolean
  setShowGuide: (show: boolean) => void
  compareList: string[]
  addToCompare: (id: string) => void
  removeFromCompare: (id: string) => void
  clearCompare: () => void
  isInCompare: (id: string) => boolean
  currentPageId: string | null
  setCurrentPageId: (id: string | null) => void
}

const ShortcutContext = createContext<ShortcutContextValue | null>(null)

export function useShortcuts() {
  const context = useContext(ShortcutContext)
  if (!context) {
    throw new Error('useShortcuts must be used within ShortcutManager')
  }
  return context
}

// ============================================================================
// Provider Component
// ============================================================================

interface ShortcutManagerProps {
  children: ReactNode
}

export default function ShortcutManager({ children }: ShortcutManagerProps) {
  const router = useRouter()
  const pathname = usePathname()
  
  const [showOverlay, setShowOverlay] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const [compareList, setCompareList] = useState<string[]>([])
  const [currentPageId, setCurrentPageId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null)

  // Show toast notification
  const showToast = useCallback((message: string, type: 'success' | 'info' = 'info') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 2000)
  }, [])

  // Compare functions
  const addToCompare = useCallback((id: string) => {
    setCompareList(prev => {
      if (prev.includes(id)) return prev
      if (prev.length >= 4) {
        showToast('Compare limit reached (max 4)', 'info')
        return prev
      }
      showToast('Added to compare (press C to view)', 'success')
      return [...prev, id]
    })
  }, [showToast])

  const removeFromCompare = useCallback((id: string) => {
    setCompareList(prev => prev.filter(i => i !== id))
  }, [])

  const clearCompare = useCallback(() => {
    setCompareList([])
  }, [])

  const isInCompare = useCallback((id: string) => {
    return compareList.includes(id)
  }, [compareList])

  // Register default shortcuts
  useEffect(() => {
    const unregisters: (() => void)[] = []

    // / - Open search
    unregisters.push(registerShortcut({
      key: '/',
      description: 'Open search',
      category: 'navigation',
      action: () => {
        // Dispatch custom event for search component
        window.dispatchEvent(new CustomEvent('halfspace:open-search'))
      }
    }))

    // J - Random jump
    unregisters.push(registerShortcut({
      key: 'j',
      description: 'Random jump',
      category: 'navigation',
      action: () => {
        const destination = getRandomJump({ exclude: [pathname] })
        if (destination) {
          showToast(`Jumping to ${destination.title}...`, 'info')
          router.push(destination.url)
        }
      }
    }))

    // S - Save/bookmark
    unregisters.push(registerShortcut({
      key: 's',
      description: 'Save/bookmark',
      category: 'actions',
      action: () => {
        if (currentPageId) {
          const isSaved = isBookmarked(currentPageId)
          toggleBookmark(currentPageId)
          showToast(isSaved ? 'Removed from bookmarks' : 'Saved to bookmarks', 'success')
        } else {
          showToast('Cannot bookmark this page', 'info')
        }
      }
    }))

    // R - Random in current category
    unregisters.push(registerShortcut({
      key: 'r',
      description: 'Random in category',
      category: 'navigation',
      action: () => {
        // Try to determine category from pathname
        const pathParts = pathname.split('/')
        const category = pathParts[1] || 'objects'
        const items = getItemsByCategory(category)
        
        if (items.length > 0) {
          const randomItem = items[Math.floor(Math.random() * items.length)]
          showToast(`Random ${category}: ${randomItem.title}`, 'info')
          router.push(randomItem.url)
        } else {
          // Fallback to any random
          const destination = getRandomJump()
          if (destination) {
            router.push(destination.url)
          }
        }
      }
    }))

    // C - Add to compare / open compare
    unregisters.push(registerShortcut({
      key: 'c',
      description: 'Add to compare',
      category: 'tools',
      action: () => {
        if (currentPageId && !isInCompare(currentPageId)) {
          addToCompare(currentPageId)
        } else if (compareList.length > 0) {
          router.push('/compare')
        } else {
          showToast('Visit a page to add to compare', 'info')
        }
      }
    }))

    // G - Open AI Guide
    unregisters.push(registerShortcut({
      key: 'g',
      description: 'Open AI Guide',
      category: 'tools',
      action: () => {
        setShowGuide(prev => !prev)
      }
    }))

    // ? - Show shortcuts overlay
    unregisters.push(registerShortcut({
      key: '?',
      description: 'Show shortcuts',
      category: 'tools',
      requiresModifier: true,
      modifiers: ['shift'],
      action: () => {
        setShowOverlay(prev => !prev)
      }
    }))

    // Escape - Close overlays
    unregisters.push(registerShortcut({
      key: 'Escape',
      description: 'Close',
      category: 'navigation',
      action: () => {
        setShowOverlay(false)
        setShowGuide(false)
        window.dispatchEvent(new CustomEvent('halfspace:close-all'))
      }
    }))

    // Category quick jumps (1-7)
    CATEGORY_SHORTCUTS.forEach(({ key, category, label }) => {
      unregisters.push(registerShortcut({
        key,
        description: `Jump to ${label}`,
        category: 'navigation',
        action: () => {
          const items = getItemsByCategory(category)
          if (items.length > 0) {
            const randomItem = items[Math.floor(Math.random() * items.length)]
            showToast(`${label}: ${randomItem.title}`, 'info')
            router.push(randomItem.url)
          }
        }
      }))
    })

    return () => {
      unregisters.forEach(unregister => unregister())
    }
  }, [router, pathname, currentPageId, compareList, addToCompare, isInCompare, showToast])

  // Global keyboard listener
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      handleKeyboardEvent(event)
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Persist compare list
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('halfspace_compare')
      if (saved) {
        try {
          setCompareList(JSON.parse(saved))
        } catch {}
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('halfspace_compare', JSON.stringify(compareList))
    }
  }, [compareList])

  const contextValue: ShortcutContextValue = {
    showOverlay,
    setShowOverlay,
    showGuide,
    setShowGuide,
    compareList,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isInCompare,
    currentPageId,
    setCurrentPageId
  }

  return (
    <ShortcutContext.Provider value={contextValue}>
      {children}
      
      {/* Shortcut Help Overlay */}
      {showOverlay && (
        <ShortcutOverlay onClose={() => setShowOverlay(false)} />
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '100px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '12px 24px',
            background: toast.type === 'success' ? 'rgba(34, 197, 94, 0.9)' : 'rgba(59, 130, 246, 0.9)',
            borderRadius: '12px',
            color: 'white',
            fontSize: '14px',
            fontWeight: 500,
            zIndex: 9999,
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            animation: 'fadeInUp 0.3s ease'
          }}
        >
          {toast.message}
        </div>
      )}

      {/* Compare indicator */}
      {compareList.length > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '10px 16px',
            background: 'rgba(139, 92, 246, 0.9)',
            borderRadius: '12px',
            color: 'white',
            fontSize: '13px',
            fontWeight: 500,
            zIndex: 9998,
            backdropFilter: 'blur(10px)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onClick={() => router.push('/compare')}
        >
          <span>⚖️</span>
          <span>{compareList.length} in compare</span>
          <kbd style={{ 
            padding: '2px 6px', 
            background: 'rgba(255,255,255,0.2)', 
            borderRadius: '4px',
            fontSize: '11px'
          }}>C</kbd>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </ShortcutContext.Provider>
  )
}
