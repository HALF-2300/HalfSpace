'use client'

import { useState } from 'react'

interface Scale {
  name_en: string
  name_ar: string
  size: string
  comparison: string
  icon: string
}

interface ScaleOfSpaceWidgetProps {
  lang?: 'en' | 'ar'
  className?: string
}

/**
 * Scale of Space Widget
 * Shows size comparisons in space
 * ADDITIONS ONLY - New component
 */
export default function ScaleOfSpaceWidget({ lang = 'en', className = '' }: ScaleOfSpaceWidgetProps) {
  const scales: Scale[] = [
    {
      name_en: "Earth",
      name_ar: "الأرض",
      size: "12,742 km",
      comparison: "1x",
      icon: "🌍"
    },
    {
      name_en: "Jupiter",
      name_ar: "المشتري",
      size: "139,820 km",
      comparison: "11x Earth",
      icon: "🪐"
    },
    {
      name_en: "Sun",
      name_ar: "الشمس",
      size: "1,392,700 km",
      comparison: "109x Earth",
      icon: "☀️"
    },
    {
      name_en: "Solar System",
      name_ar: "النظام الشمسي",
      size: "~10 billion km",
      comparison: "~7,500x Earth",
      icon: "🪐"
    },
    {
      name_en: "Light-Year",
      name_ar: "سنة ضوئية",
      size: "9.46 trillion km",
      comparison: "~63,000 AU",
      icon: "📏"
    },
    {
      name_en: "Milky Way",
      name_ar: "درب التبانة",
      size: "100,000 light-years",
      comparison: "~100 billion km",
      icon: "🌌"
    },
    {
      name_en: "Local Group",
      name_ar: "المجموعة المحلية",
      size: "10 million light-years",
      comparison: "~50 galaxies",
      icon: "👥"
    },
    {
      name_en: "Observable Universe",
      name_ar: "الكون المرصود",
      size: "93 billion light-years",
      comparison: "~2 trillion galaxies",
      icon: "🌐"
    }
  ]

  const [selectedScale, setSelectedScale] = useState<number>(0)

  return (
    <div className={`glass rounded-xl border border-purple-500/30 p-6 ${className}`}>
      <h3 className="text-lg font-bold text-gradient mb-4">
        {lang === 'ar' ? 'مقاييس الفضاء' : 'Scale of Space'}
      </h3>
      
      <div className="space-y-3">
        {scales.map((scale, index) => (
          <button
            key={index}
            onClick={() => setSelectedScale(index)}
            className={`w-full text-left p-3 rounded-lg border transition-all ${
              selectedScale === index
                ? 'bg-purple-600/20 border-purple-500'
                : 'bg-space-dark/30 border-purple-500/30 hover:border-purple-500/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{scale.icon}</span>
              <div className="flex-1">
                <div className="text-sm font-semibold text-white">
                  {lang === 'ar' ? scale.name_ar : scale.name_en}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {scale.size} • {scale.comparison}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
        <div className="text-xs text-purple-300">
          {lang === 'ar' 
            ? 'اختر مقياساً لمقارنة الأحجام في الكون'
            : 'Select a scale to compare sizes in the universe'}
        </div>
      </div>
    </div>
  )
}
