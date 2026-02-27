'use client'

import Link from 'next/link'

const COMING_SOON_LABELS: Record<string, { title: string; home: string; back: string }> = {
  ar: { title: 'قريباً', home: 'الرئيسية', back: 'استكشف المواضيع الأخرى' },
  es: { title: 'Próximamente', home: 'Inicio', back: 'Explorar otros temas' },
  zh: { title: '即将推出', home: '首页', back: '探索其他主题' },
  en: { title: 'Coming Soon', home: 'Home', back: 'Explore other topics' },
}

function slugToTitle(slug: string): string {
  return slug
    .split(/[-/]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
}

export default function ComingSoon({
  slugSegment,
  locale,
}: {
  slugSegment: string
  locale: 'en' | 'ar' | 'es' | 'zh'
}) {
  const t = COMING_SOON_LABELS[locale]
  const homeHref = locale === 'en' ? '/' : `/${locale}`
  const title = slugToTitle(slugSegment)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-12">
      <div className="glass rounded-2xl border border-purple-500/30 p-8 md:p-12 max-w-lg w-full text-center">
        <div className="text-6xl mb-6" aria-hidden>
          🚀
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          {title}
        </h1>
        <p className="text-lg text-purple-300 mb-8">
          {t.title}
        </p>
        <p className="text-gray-400 text-sm mb-8">
          We&apos;re working on this page. In the meantime, explore the rest of HalfSPACE.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={homeHref}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 font-semibold text-white hover:from-purple-700 hover:to-blue-700 transition-all"
          >
            {t.home}
          </Link>
          <Link
            href={locale === 'en' ? '/solar-system' : `/${locale}/solar-system`}
            className="px-6 py-3 rounded-xl glass font-semibold text-gray-300 hover:text-white hover:bg-purple-500/20 transition-all border border-purple-500/30"
          >
            {t.back}
          </Link>
        </div>
      </div>
    </div>
  )
}
