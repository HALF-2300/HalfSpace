'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getSectionByPath, spaceSections } from '@/data/spaceSections'

export default function SpaceChromeOverlay() {
  const pathname = usePathname()

  if (!pathname || !pathname.startsWith('/space')) {
    return null
  }

  const current = getSectionByPath(pathname)
  const readableSection = current?.title ?? deriveLabelFromPath(pathname)

  const quickLinks = spaceSections.filter((section) => section.key !== 'home')

  return (
    <>
      <div className="fixed top-3 left-3 right-3 z-[120] md:hidden">
        <div className="glass border border-white/10 rounded-2xl p-3 shadow-lg backdrop-blur-xl bg-black/60">
          <div className="flex items-center justify-between gap-2">
            <div className="text-[12px] text-white/90 truncate">Space &gt; {readableSection}</div>
            <Link
              href="/space/home"
              className="inline-flex items-center gap-1 rounded-lg border border-purple-400/40 bg-purple-500/10 px-2 py-1 text-[12px] font-semibold text-white hover:border-purple-300 hover:bg-purple-500/20 transition-colors"
            >
              <span>←</span>
              <span>Home</span>
            </Link>
          </div>

          <div className="mt-2 flex gap-2 overflow-x-auto">
            {spaceSections
              .filter((section) => ['home', 'experience', 'lab', 'library', 'observatory', 'handbook'].includes(section.key))
              .map((section) => (
                <Link
                  key={section.key}
                  href={section.href}
                  className={`flex items-center gap-1 rounded-lg border border-white/10 px-2 py-1 text-xs text-white transition-colors hover:border-purple-400 hover:bg-purple-500/10 ${
                    pathname === section.href ? 'bg-purple-500/20 border-purple-400/60' : ''
                  }`}
                >
                  <span>{section.icon}</span>
                  <span>{section.title}</span>
                </Link>
              ))}
          </div>
        </div>
      </div>

      <div className="hidden md:block fixed top-4 left-4 z-[120] max-w-md">
        <div className="glass border border-white/10 rounded-2xl p-4 shadow-lg backdrop-blur-xl bg-black/40">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-purple-200/70">Space</p>
              <div className="text-sm text-white/90">Space &gt; {readableSection}</div>
            </div>
            <Link
              href="/space/home"
              className="inline-flex items-center gap-2 rounded-lg border border-purple-400/40 bg-purple-500/10 px-3 py-2 text-xs font-semibold text-white hover:border-purple-300 hover:bg-purple-500/20 transition-colors"
            >
              <span>←</span>
              <span>Back to Home</span>
            </Link>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {spaceSections
              .filter((section) => section.key === 'home')
              .concat(quickLinks)
              .map((section) => (
                <Link
                  key={section.key}
                  href={section.href}
                  className={`flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-white transition-colors hover:border-purple-400 hover:bg-purple-500/10 ${
                    pathname === section.href ? 'bg-purple-500/15 border-purple-400/60' : ''
                  }`}
                >
                  <span className="text-lg">{section.icon}</span>
                  <span>{section.title}</span>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </>
  )
}

function deriveLabelFromPath(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean)
  const key = parts[1] ?? 'home'
  return key
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
