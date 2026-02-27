'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Sets document lang and dir based on current path so /ar/* gets RTL and lang="ar".
 * Place once in root layout so the whole app respects the language.
 */
export default function SetLocaleFromPath() {
  const pathname = usePathname()

  useEffect(() => {
    const isAr = pathname?.startsWith('/ar')
    const isEs = pathname?.startsWith('/es')
    const isZh = pathname?.startsWith('/zh')
    const html = document.documentElement
    if (isAr) {
      html.setAttribute('lang', 'ar')
      html.setAttribute('dir', 'rtl')
    } else if (isEs) {
      html.setAttribute('lang', 'es')
      html.setAttribute('dir', 'ltr')
    } else if (isZh) {
      html.setAttribute('lang', 'zh-CN')
      html.setAttribute('dir', 'ltr')
    } else {
      html.setAttribute('lang', 'en')
      html.setAttribute('dir', 'ltr')
    }
    return () => {
      html.setAttribute('lang', 'en')
      html.setAttribute('dir', 'ltr')
    }
  }, [pathname])

  return null
}
