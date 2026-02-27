'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import AmbientAudio from '@/components/AmbientAudio'
import { getNavbarEntries } from '@/data/sitemap'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = getNavbarEntries('ar')
  const desktopLinks = navLinks.filter((l) => l.featured)
  const moreLinks = navLinks.filter((l) => !l.featured)

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <nav className={`navbar fixed top-0 w-full z-50 transition-all duration-500 ${
      scrolled 
        ? 'glass border-b-2 border-purple-500/40 shadow-2xl backdrop-blur-xl' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center space-x-3 group">
            <span className="brandRocket">🚀</span>
            <span className="text-2xl font-bold text-gradient group-hover:scale-105 transition-transform">
              مستكشف الفضاء
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-4">
            <AmbientAudio />
            {desktopLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
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
            <div className="relative group">
              <button className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-purple-500/20 transition-all">
                المزيد ▼
              </button>
              <div className="absolute right-0 mt-2 w-72 glass rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-purple-500/20 p-2">
                <div className="grid grid-cols-1 gap-1 max-h-96 overflow-y-auto custom-scrollbar">
                  {moreLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={isActive(link.href) ? 'page' : undefined}
                      className={`px-4 py-2 rounded-lg text-sm transition-all ${
                        isActive(link.href) ? 'text-white bg-purple-500/20' : 'text-gray-300 hover:text-white hover:bg-purple-500/20'
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-gray-300 hover:text-white p-2"
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
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-all ${
                  isActive(link.href) ? 'text-white bg-purple-500/20' : 'text-gray-300 hover:text-white hover:bg-purple-500/20'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

