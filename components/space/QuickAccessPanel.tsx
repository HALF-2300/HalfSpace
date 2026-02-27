'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

type Bookmark = {
  id: string
  title: string
  path: string
  icon?: string
}

const QUICK_LINKS: Bookmark[] = [
  { id: 'demo', title: 'Demo Tour', path: '/space/demo', icon: '🚀' },
  { id: 'experience', title: '3D Experience', path: '/space/experience-v2', icon: '🌌' },
  { id: 'atlas', title: 'Space Atlas', path: '/space/atlas', icon: '🪐' },
  { id: 'knowledge', title: 'Knowledge Hub', path: '/space/knowledge-hub', icon: '📚' },
  { id: 'observatory', title: 'Observatory', path: '/space/observatory', icon: '🔭' },
  { id: 'library', title: 'Library', path: '/space/library', icon: '📖' },
]

const STORAGE_KEY = 'space-bookmarks'

export default function QuickAccessPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const pathname = usePathname()

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setBookmarks(JSON.parse(stored))
      } catch {
        setBookmarks([])
      }
    }
  }, [])

  // Keyboard shortcut: "/" to open, "Esc" to close
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      
      if (e.key === '/' && !isOpen) {
        e.preventDefault()
        setIsOpen(true)
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isOpen])

  const saveBookmarks = (newBookmarks: Bookmark[]) => {
    setBookmarks(newBookmarks)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newBookmarks))
  }

  const addBookmark = () => {
    if (!pathname.startsWith('/space')) return
    
    const currentPage = QUICK_LINKS.find(link => link.path === pathname) || {
      id: pathname.split('/').pop() || 'page',
      title: document.title.split('|')[0].trim() || 'Current Page',
      path: pathname,
      icon: '⭐',
    }

    if (!bookmarks.find(b => b.path === pathname)) {
      saveBookmarks([...bookmarks, currentPage])
    }
  }

  const removeBookmark = (path: string) => {
    saveBookmarks(bookmarks.filter(b => b.path !== path))
  }

  const isBookmarked = pathname && bookmarks.some(b => b.path === pathname)

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-50 glass rounded-full p-4 border border-purple-500/40 hover:border-purple-400 transition-all shadow-lg hover:scale-110"
        aria-label="Open Quick Access"
      >
        <svg className="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
    )
  }

  return (
    <div className="fixed bottom-24 right-6 z-50 w-80 max-h-[70vh] overflow-hidden glass rounded-3xl border border-purple-500/40 shadow-2xl">
      <div className="p-4 space-y-4 overflow-y-auto max-h-[70vh]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Quick Access</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Add Current Page */}
        {pathname.startsWith('/space') && (
          <div className="flex items-center gap-2 p-2 rounded-lg border border-purple-500/30">
            <button
              onClick={isBookmarked ? () => removeBookmark(pathname) : addBookmark}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                isBookmarked
                  ? 'border border-emerald-400/60 bg-emerald-500/10 text-emerald-200'
                  : 'border border-purple-400/60 bg-purple-500/10 text-purple-200 hover:bg-purple-500/20'
              }`}
            >
              {isBookmarked ? '✓ Bookmarked' : '+ Bookmark This Page'}
            </button>
          </div>
        )}

        {/* Quick Links */}
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-purple-200 mb-2">Quick Links</p>
          <div className="space-y-1">
            {QUICK_LINKS.map((link) => (
              <a
                key={link.id}
                href={link.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                  pathname === link.path
                    ? 'bg-purple-500/20 border border-purple-400/50 text-white'
                    : 'hover:bg-purple-500/10 border border-transparent text-gray-200'
                }`}
              >
                <span className="text-lg">{link.icon}</span>
                <span>{link.title}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Bookmarks */}
        {bookmarks.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-purple-200 mb-2">Your Bookmarks</p>
            <div className="space-y-1">
              {bookmarks.map((bookmark) => (
                <div
                  key={bookmark.path}
                  className="flex items-center gap-2 group"
                >
                  <a
                    href={bookmark.path}
                    className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                      pathname === bookmark.path
                        ? 'bg-purple-500/20 border border-purple-400/50 text-white'
                        : 'hover:bg-purple-500/10 border border-transparent text-gray-200'
                    }`}
                  >
                    <span>{bookmark.icon || '⭐'}</span>
                    <span className="truncate">{bookmark.title}</span>
                  </a>
                  <button
                    onClick={() => removeBookmark(bookmark.path)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-rose-400 transition-all p-1"
                    aria-label="Remove bookmark"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Keyboard Shortcuts Hint */}
        <div className="pt-2 border-t border-purple-500/30">
          <p className="text-xs text-gray-400 mb-1">Keyboard Shortcuts</p>
          <div className="text-xs text-gray-500 space-y-1">
            <div>Press <kbd className="px-1.5 py-0.5 rounded bg-purple-500/20 border border-purple-400/30">/</kbd> to search</div>
            <div>Press <kbd className="px-1.5 py-0.5 rounded bg-purple-500/20 border border-purple-400/30">Esc</kbd> to close</div>
          </div>
        </div>
      </div>
    </div>
  )
}
