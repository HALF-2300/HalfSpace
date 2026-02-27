'use client'

import { getFactOfTheDay } from '@/data/spaceFacts'

const labels: Record<string, string> = {
  en: 'Fact of the Day',
  ar: 'حقيقة اليوم',
  es: 'Dato del día',
  zh: '今日一图',
}

export default function FactOfDay({ locale = 'en' }: { locale?: string }) {
  const fact = getFactOfTheDay()
  const title = locale === 'ar' ? fact.title_ar : fact.title_en
  const body = locale === 'ar' ? fact.body_ar : fact.body_en
  const heading = labels[locale] || labels.en

  return (
    <div className="mt-8 relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-pink-600/20 border border-purple-500/30 p-6">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
      <div className="relative">
        <div className="flex items-start gap-4">
          <span className="text-3xl animate-pulse-slow">🌌</span>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
              {heading}
            </h3>
            <p className="text-white text-base leading-relaxed">
              <strong className="text-purple-300">{title}</strong>
              <br />
              <span className="text-gray-300">{body}</span>
            </p>
            <div className="mt-3 text-xs text-gray-400 italic">
              {fact.category}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
