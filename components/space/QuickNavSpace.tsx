'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { siteMap } from '@/data/sitemap'

interface NavItem {
  href: string
  label: string
  icon: string
}

export default function QuickNavSpace() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Only show on space pages
  const isSpacePage = pathname?.startsWith('/space')

  // Get space-related routes from sitemap
  const spaceNavItems: NavItem[] = siteMap
    .filter((page) => page.href.startsWith('/space'))
    .slice(0, 8) // Limit to 8 items
    .map((page) => ({
      href: page.href,
      label: page.name,
      icon: getIconForPage(page.slug),
    }))

  // Don't render if not on a space page
  if (!isSpacePage) {
    return null
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[100] glass rounded-full p-4 border-2 border-purple-500/50 hover:border-purple-500 bg-purple-500/20 hover:bg-purple-500/30 text-white transition-all transform hover:scale-110 shadow-lg"
        aria-label="Quick Navigation"
      >
        <svg
          className={`w-6 h-6 transition-transform ${isOpen ? 'rotate-45' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Navigation Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="fixed bottom-24 right-6 z-[100] glass rounded-2xl border-2 border-purple-500/50 p-4 min-w-[220px] max-w-[280px] shadow-xl max-h-[70vh] overflow-y-auto">
            <div className="mb-3 pb-3 border-b border-purple-500/30">
              <h3 className="text-lg font-bold text-gradient">Space Navigation</h3>
            </div>
            <div className="space-y-2">
              {spaceNavItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all group ${
                      isActive
                        ? 'border-purple-500/70 bg-purple-500/20'
                        : 'border-purple-500/20 hover:border-purple-500/50 hover:bg-purple-500/10'
                    }`}
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">
                      {item.icon}
                    </span>
                    <span
                      className={`font-semibold transition-colors ${
                        isActive
                          ? 'text-purple-300'
                          : 'text-white group-hover:text-purple-300'
                      }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </>
      )}
    </>
  )
}

// Helper function to get icon for page
function getIconForPage(slug: string): string {
  const iconMap: Record<string, string> = {
    handbook: '📖',
    map: '🗺️',
    observatory: '🔭',
    'observatory2': '🔭',
    experience: '✨',
    encyclopedia: '📚',
    'course-v2': '🎓',
    eras: '⏳',
    'black-hole-lab': '🕳️',
    mythbusters: '🔍',
  }
  return iconMap[slug] || '🌌'
}
