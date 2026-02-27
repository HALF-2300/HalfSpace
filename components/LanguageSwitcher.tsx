'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'

export default function LanguageSwitcher() {
  const pathname = usePathname() ?? '/'
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Detect current locale based on leading path segment
  const knownLocales = [
    { code: 'ar', label: 'العربية' },
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'zh', label: '中文' },
  ] as const

  const currentLocale =
    knownLocales.find(locale => pathname === `/${locale.code}` || pathname.startsWith(`/${locale.code}/`))?.code ??
    'en'

  const pathWithoutLocale =
    currentLocale === 'en' ? pathname : pathname.replace(new RegExp(`^/${currentLocale}`), '') || '/'
  const pathSuffix = pathWithoutLocale === '/' ? '' : pathWithoutLocale

  const options = knownLocales.map(locale => ({
    label: locale.label,
    href: locale.code === 'en' ? pathWithoutLocale : `/${locale.code}${pathSuffix}`,
    current: currentLocale === locale.code,
  }))

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  const currentLabel = options.find(o => o.current)?.label ?? 'English'

  const languageLabel = currentLocale === 'ar' ? 'اللغة' : 'Language'
  const chooseLanguageAria = currentLocale === 'ar' ? 'اختر اللغة' : 'Choose language'

  return (
    <div ref={ref} className="relative flex items-center">
      <span className="text-gray-400 text-sm mr-2 inline" aria-hidden="true">
        {languageLabel}
      </span>
      {/* Desktop: inline links, all clickable */}
      <div className="hidden sm:flex items-center gap-1" role="group" aria-label={chooseLanguageAria}>
        {options.map(({ label, href, current }) => (
          <Link
            key={label}
            href={href}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-space-dark ${
              current
                ? 'text-white bg-purple-500/30 cursor-default'
                : 'text-gray-300 hover:text-white hover:bg-purple-500/20'
            }`}
            aria-label={current ? `Current language: ${label}` : `Switch to ${label}`}
            aria-current={current ? 'true' : undefined}
          >
            {label}
          </Link>
        ))}
      </div>
      {/* Mobile: dropdown so "Language" is clickable to open */}
      <div className="sm:hidden">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-purple-500/20 border border-white/10 flex items-center gap-1"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={chooseLanguageAria}
        >
          <span>{currentLabel}</span>
          <span className="text-xs" aria-hidden="true">{open ? '▲' : '▼'}</span>
        </button>
        {open && (
          <div
            className="absolute right-0 top-full mt-1 py-1 rounded-lg border border-purple-500/30 min-w-[140px] z-[100]"
            style={{ background: 'rgba(10, 14, 39, 0.98)', backdropFilter: 'blur(12px)' }}
            role="listbox"
            aria-label="Language options"
          >
            {options.map(({ label, href, current }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                className={`block px-4 py-2 text-sm font-medium transition-colors ${
                  current ? 'text-white bg-purple-500/30' : 'text-gray-300 hover:bg-purple-500/20 hover:text-white'
                }`}
                role="option"
                aria-selected={current}
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
