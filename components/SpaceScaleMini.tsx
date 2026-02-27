'use client'

import scaleData from '@/data/scale.json'

interface Scale {
  comparison_en: string
  comparison_ar: string
}

export default function SpaceScaleMini({ lang = 'en' }: { lang?: 'en' | 'ar' }) {
  const scales = scaleData.scales as Scale[]

  return (
    <div className="glass rounded-xl border border-purple-500/30 p-6">
      <h3 className="text-xl font-bold text-gradient mb-4 flex items-center gap-2">
        <span>📏</span>
        <span>{lang === 'ar' ? 'مقياس الفضاء' : 'Scale of Space'}</span>
      </h3>
      <div className="space-y-3">
        {scales.map((scale, index) => (
          <div
            key={index}
            className="glass rounded-lg border border-purple-500/20 hover:border-purple-500/50 transition-all p-3 hover-lift"
          >
            <p className="text-sm text-gray-300 leading-relaxed">
              {lang === 'ar' ? scale.comparison_ar : scale.comparison_en}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
