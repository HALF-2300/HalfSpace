'use client'

import Link from 'next/link'
import Image from 'next/image'
import { siteMap, type PageEntry } from '@/data/sitemap'
import type { Locale } from '@/data/sitemap'

function getTitle(page: PageEntry, locale: Locale): string {
  if (locale === 'ar' && page.title_ar) return page.title_ar
  if (locale === 'es' && page.title_es) return page.title_es
  if (locale === 'zh' && page.title_zh) return page.title_zh
  return page.title_en
}

const quickStart: Record<Locale, string> = {
  en: 'Quick Start',
  ar: 'بداية سريعة',
  es: 'Inicio rápido',
  zh: '快速入门',
}
const exploreLabel: Record<Locale, string> = {
  en: 'Explore',
  ar: 'استكشف',
  es: 'Explorar',
  zh: '探索',
}

export default function FeaturedNavCards({
  locale = 'en',
  basePath = '',
}: {
  locale?: Locale
  basePath?: string
}) {
  const featuredPages = siteMap.filter((page: PageEntry) => page.featured === true)

  return (
    <div className="mt-12 w-full max-w-6xl mx-auto px-4">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-300">
        {quickStart[locale] || quickStart.en}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuredPages.map((page) => {
          const href = basePath ? `${basePath}${page.href}` : page.href
          const title = getTitle(page, locale)
          return (
            <Link
              key={page.slug}
              href={href}
              className="group relative glass rounded-3xl p-6 border-2 border-purple-500/30 hover:border-purple-500/70 transition-all hover-lift overflow-hidden glow-purple micro-lift enhanced-card-glow"
            >
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                {/* Image */}
                {page.image && (
                  <div className="relative w-full h-32 mb-4 rounded-xl overflow-hidden border border-purple-500/20">
                    <Image
                      src={page.image}
                      alt={title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      unoptimized={page.image.startsWith('http')}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-space-dark/80 via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-transparent to-blue-500/0 group-hover:from-purple-500/20 group-hover:to-blue-500/20 transition-all duration-700" />
                  </div>
                )}
                
                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                  {title}
                </h3>
                
                {/* Summary */}
                {page.summary && (
                  <p className="text-sm text-gray-400 line-clamp-2">
                    {page.summary}
                  </p>
                )}
                
                {/* Arrow indicator */}
                <div className="mt-4 flex items-center text-purple-400 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>{exploreLabel[locale] || exploreLabel.en}</span>
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
