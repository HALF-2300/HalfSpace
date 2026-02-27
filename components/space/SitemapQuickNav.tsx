'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import sitemapData from '@/data/space/sitemap.json'
import { validateSpaceSitemap } from '@/components/space/sitemap/validate'

function isVisibleStatus(status: string) {
  return status !== 'hidden' && status !== 'deprecated'
}

export default function SitemapQuickNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname() || '/'

  const { pages } = useMemo(() => validateSpaceSitemap(sitemapData), [])

  // Only show on space pages.
  const isSpacePage = pathname.startsWith('/space')

  const items = useMemo(() => {
    if (!isSpacePage) return []
    const dedup = new Map<string, { route: string; title: string }>()

    // Featured first, then the rest (stable-ish), visible statuses only.
    const ordered = [...pages]
      .filter((p) => p.route.startsWith('/space'))
      .filter((p) => isVisibleStatus(String(p.status)))
      .sort((a, b) => Number(b.featured) - Number(a.featured))

    for (const p of ordered) {
      if (!dedup.has(p.route)) dedup.set(p.route, { route: p.route, title: p.title })
    }

    return Array.from(dedup.values()).slice(0, 14)
  }, [isSpacePage, pages])

  if (!isSpacePage) return null

  return (
    <>
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-[100] glass rounded-full p-4 border-2 border-purple-500/50 hover:border-purple-500 bg-purple-500/20 hover:bg-purple-500/30 text-white transition-all transform hover:scale-110 shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-400/60"
        aria-label="Space Quick Navigation"
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

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

          <div className="fixed bottom-24 right-6 z-[100] glass rounded-2xl border-2 border-purple-500/50 p-4 min-w-[220px] max-w-[320px] shadow-xl max-h-[70vh] overflow-y-auto">
            <div className="mb-3 pb-3 border-b border-purple-500/30">
              <h3 className="text-lg font-bold text-gradient">Quick Nav</h3>
              <p className="text-xs text-gray-400 mt-1">Powered by `data/space/sitemap.json`</p>
            </div>

            <div className="space-y-2">
              {items.map((item) => {
                const isActive = pathname === item.route
                return (
                  <Link
                    key={item.route}
                    href={item.route}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/60 ${
                      isActive
                        ? 'border-purple-500/70 bg-purple-500/20'
                        : 'border-purple-500/20 hover:border-purple-500/50 hover:bg-purple-500/10'
                    }`}
                  >
                    <span
                      className={`font-semibold transition-colors ${
                        isActive ? 'text-purple-300' : 'text-white group-hover:text-purple-300'
                      }`}
                    >
                      {item.title}
                    </span>
                  </Link>
                )
              })}
            </div>

            <div className="mt-3 pt-3 border-t border-purple-500/20 flex items-center justify-between">
              <Link
                href="/space/all"
                onClick={() => setIsOpen(false)}
                className="text-sm text-purple-200 hover:text-purple-100 underline underline-offset-4"
              >
                Open directory
              </Link>
              <Link
                href="/space/health"
                onClick={() => setIsOpen(false)}
                className="text-sm text-blue-200 hover:text-blue-100 underline underline-offset-4"
              >
                Health
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  )
}

