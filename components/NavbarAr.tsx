'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function NavbarAr() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'الخريطة', href: '/galaxy-map' },
    { name: 'الكواكب', href: '/solar-system' },
    { name: 'المهمّات', href: '/missions' },
    { name: 'الصور', href: '/historic-images' },
    { name: 'القاموس', href: '/glossary' },
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <>
      <nav className={`navbar fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'glass border-b-2 border-purple-500/40 shadow-2xl backdrop-blur-xl' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo - Right side for Arabic */}
            <Link href="/" className="flex items-center space-x-3 space-x-reverse group">
              <span className="text-2xl font-bold text-gradient group-hover:scale-105 transition-transform">
                بوابة الفضاء
              </span>
              <span className="text-2xl">🚀</span>
            </Link>

            {/* Desktop Menu - Left side for Arabic */}
            <div className="hidden lg:flex items-center space-x-4 space-x-reverse">
              {navLinks.map((link) => (
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
              
              {/* Language Toggle - Hidden until English language is fully implemented */}
              {/* <Link
                href="/en"
                className="px-3 py-2 rounded-lg text-xs font-medium text-gray-300 hover:text-white hover:bg-purple-500/20 transition-all border border-purple-500/30"
              >
                EN
              </Link> */}
              
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-purple-500/20 transition-all"
                aria-label="بحث"
              >
                🔎
              </button>
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
              <div className="flex gap-2 pt-2">
                {/* Language Toggle - Hidden until English language is fully implemented */}
                {/* <Link
                  href="/en"
                  className="block px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-purple-500/20 transition-all border border-purple-500/30"
                >
                  EN
                </Link> */}
                <button
                  onClick={() => {
                    setSearchOpen(true)
                    setIsOpen(false)
                  }}
                  className="block px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-purple-500/20 transition-all"
                >
                  🔎 بحث
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Search Overlay */}
      {searchOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-start justify-center pt-32 px-4"
          onClick={() => setSearchOpen(false)}
        >
          <div 
            className="glass rounded-2xl p-6 max-w-2xl w-full border border-purple-500/30 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 mb-4">
              <input
                type="text"
                placeholder="ابحث عن صفحة، مصطلح، أو صورة..."
                className="flex-1 px-4 py-3 bg-space-deep rounded-lg border border-purple-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                autoFocus
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-all"
              >
                إغلاق
              </button>
            </div>
            <div className="text-sm text-gray-400 text-center">
              نتائج البحث ستظهر هنا...
            </div>
          </div>
        </div>
      )}
    </>
  )
}

