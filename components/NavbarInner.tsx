'use client'

import Link from 'next/link'
import AmbientAudio from './AmbientAudio'
import LanguageSwitcher from './LanguageSwitcher'
import AuthNav from './AuthNav'
import { getNavbarEntries, type Locale } from '@/data/sitemap'

export type NavbarInnerProps = {
  navClass: string
  locale: Locale
  isAr: boolean
  navLinks: ReturnType<typeof getNavbarEntries>
  desktopLinks: ReturnType<typeof getNavbarEntries>
  moreLinks: ReturnType<typeof getNavbarEntries>
  moreOpen: boolean
  setMoreOpen: (v: boolean) => void
  isOpen: boolean
  setIsOpen: (v: boolean) => void
  toLocaleHref: (href: string) => string
  isActive: (href: string) => boolean
}

export default function NavbarInner(props: NavbarInnerProps) {
  const { navClass, locale, isAr, navLinks, desktopLinks, moreLinks, moreOpen, setMoreOpen, isOpen, setIsOpen, toLocaleHref, isActive } = props
  return (
    <nav className={navClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link
            href={isAr ? '/ar' : '/'}
            className="flex items-center space-x-3 group focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-space-dark rounded-lg p-2 -m-2"
            aria-label="HalfSPACE - Home"
            data-logo-easter-egg
          >
            <span className="brandRocket">🚀</span>
            <span className="text-2xl font-bold text-gradient group-hover:scale-105 transition-transform">
              HalfSPACE
            </span>
          </Link>

          {/* Desktop Menu: center = language + nav links + More; right = account only */}
          <div className="hidden lg:flex items-center flex-1 min-w-0 justify-end">
            <div className="flex items-center gap-1 overflow-x-auto max-w-[calc(100vw-20rem)] scrollbar-thin">
              <LanguageSwitcher />
              <AmbientAudio />
              {desktopLinks.map((link) => (
                <Link
                  key={link.href}
                  href={toLocaleHref(link.href)}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all relative group ${
                    isActive(link.href) ? 'text-white bg-purple-500/20' : 'text-gray-300 hover:text-white hover:bg-purple-500/20'
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 transition-all duration-300 ${
                      isActive(link.href) ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              ))}
              {moreLinks.length > 0 && (
                <div
                  className="relative more-dropdown-container"
                  onMouseEnter={() => setMoreOpen(true)}
                  onMouseLeave={() => setMoreOpen(false)}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setMoreOpen(!moreOpen)
                    }}
                    aria-label={moreOpen ? 'Close more menu' : 'Open more menu'}
                    aria-expanded={moreOpen}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-space-dark ${
                      moreOpen ? 'text-white bg-purple-500/20' : 'text-gray-300 hover:text-white hover:bg-purple-500/20'
                    }`}
                  >
                    {locale === 'ar' ? 'المزيد ▼' : 'More ▼'}
                  </button>
                  {moreOpen && (
                    <div
                      className="absolute right-0 top-full mt-2 w-72 rounded-xl shadow-2xl border border-purple-500/30 p-3 z-[9999]"
                      style={{
                        background: 'rgba(10, 14, 39, 0.98)',
                        backdropFilter: 'blur(20px)',
                      }}
                      onMouseEnter={() => setMoreOpen(true)}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="grid grid-cols-1 gap-1 max-h-96 overflow-y-auto">
                        {moreLinks.map((link) => (
                          <Link
                            key={link.href}
                            href={toLocaleHref(link.href)}
                            onClick={() => setMoreOpen(false)}
                            aria-current={isActive(link.href) ? 'page' : undefined}
                            className={`px-4 py-2 rounded-lg text-sm transition-all block ${
                              isActive(link.href) ? 'text-white bg-purple-500/20' : 'text-gray-300 hover:text-white hover:bg-purple-500/20'
                            }`}
                          >
                            {link.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 ml-2" aria-label="Account">
              <AuthNav />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            className="lg:hidden text-gray-300 hover:text-white p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-space-dark rounded-lg"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden glass border-t border-purple-500/20">
          <div className="px-4 pt-2 pb-4 space-y-1 max-h-96 overflow-y-auto">
            <div className="pb-3 mb-3 border-b border-white/10">
              <p className="text-xs font-semibold text-purple-300 uppercase tracking-wider mb-2">Language / اللغة</p>
              <LanguageSwitcher />
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={toLocaleHref(link.href)}
                onClick={() => setIsOpen(false)}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-all ${
                  isActive(link.href) ? 'text-white bg-purple-500/20' : 'text-gray-300 hover:text-white hover:bg-purple-500/20'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-3 mt-3 border-t border-white/10">
              <AuthNav />
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
