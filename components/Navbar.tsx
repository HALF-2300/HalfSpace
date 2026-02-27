'use client'

import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import NavbarInner from './NavbarInner'
import { getNavbarEntries, type Locale } from '@/data/sitemap'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreOpen && !(event.target as Element).closest('.more-dropdown-container')) {
        setMoreOpen(false)
      }
    }
    if (moreOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [moreOpen])

  const isAr = pathname?.startsWith('/ar')
  // Launch: supported locales are en + ar. /es and /zh are redirected by middleware.
  const locale: Locale = isAr ? 'ar' : 'en'
  const navLinks = getNavbarEntries(locale)
  const desktopLinks = navLinks.filter((l) => l.featured)
  const moreLinks = navLinks.filter((l) => !l.featured)

  const toLocaleHref = (href: string) => {
    if (isAr) return `/ar${href === '/' ? '' : href}`
    return href
  }

  const isActive = (href: string) => {
    if (href === '/' && !isAr) return pathname === '/'
    if (href === '/' && isAr) return pathname === '/ar' || pathname === '/ar/'
    const base = isAr ? '/ar' : ''
    const fullHref = href === '/' ? base || '/' : base + href
    return pathname === fullHref || pathname.startsWith(fullHref + '/')
  }

  const navClass =
    'navbar fixed top-0 w-full z-50 transition-all duration-500 ' +
    (scrolled ? 'glass border-b-2 border-purple-500/40 shadow-2xl backdrop-blur-xl' : 'bg-transparent')

  return (
    <NavbarInner
      navClass={navClass}
      locale={locale}
      isAr={isAr}
      navLinks={navLinks}
      desktopLinks={desktopLinks}
      moreLinks={moreLinks}
      moreOpen={moreOpen}
      setMoreOpen={setMoreOpen}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      toLocaleHref={toLocaleHref}
      isActive={isActive}
    />
  )
}
