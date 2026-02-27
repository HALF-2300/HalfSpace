'use client'

import { useState } from 'react'
import Link from 'next/link'
import { spaceSections } from '@/data/spaceSections'

const coreNavItems = spaceSections
  .filter((section) => ['home', 'experience', 'lab', 'library', 'media', 'observatory', 'handbook'].includes(section.key))
  .map((section) => ({
    href: section.href,
    label: section.title,
    label_ar: section.titleAr,
    icon: section.icon,
  }))

const legacyNavItems = [
  { href: '/space', label: 'Portal', label_ar: 'البوابة', icon: '🌌' },
  { href: '/space/showcase', label: 'Showcase', label_ar: 'المعرض', icon: '🛰️' },
  { href: '/space/map', label: 'Map', label_ar: 'الخريطة', icon: '🗺️' },
  { href: '/space/encyclopedia', label: 'Encyclopedia', label_ar: 'الموسوعة', icon: '📚' },
]

const navItems = [...coreNavItems, ...legacyNavItems.filter((item) => !coreNavItems.some((core) => core.href === item.href))]

export default function QuickNav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[100] glass rounded-full p-4 border-2 border-purple-500/50 hover:border-purple-500 bg-purple-500/20 hover:bg-purple-500/30 text-white transition-all transform hover:scale-110 shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-400/60"
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
          <div className="fixed bottom-24 right-6 z-[100] glass rounded-2xl border-2 border-purple-500/50 p-4 min-w-[200px] shadow-xl">
            <div className="mb-3 pb-3 border-b border-purple-500/30">
              <h3 className="text-lg font-bold text-gradient">Quick Nav</h3>
            </div>
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-purple-500/20 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/60"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  <span className="text-white font-semibold group-hover:text-purple-300 transition-colors">
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  )
}
