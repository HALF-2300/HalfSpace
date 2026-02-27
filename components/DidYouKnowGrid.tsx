'use client'

import { useState } from 'react'

interface QuickFact {
  fact_en: string
  fact_ar: string
  icon?: string
}

const quickFacts: QuickFact[] = [
  {
    fact_en: "Light speed: 299,792 km/s",
    fact_ar: "سرعة الضوء: 299,792 كم/ث",
    icon: "⚡"
  },
  {
    fact_en: "Moon distance: 384,400 km",
    fact_ar: "المسافة للقمر: 384,400 كم",
    icon: "🌙"
  },
  {
    fact_en: "Sun distance: 150 million km",
    fact_ar: "المسافة للشمس: 150 مليون كم",
    icon: "☀️"
  },
  {
    fact_en: "Nearest star: 4.24 light-years",
    fact_ar: "أقرب نجم: 4.24 سنة ضوئية",
    icon: "⭐"
  },
  {
    fact_en: "Universe age: 13.8 billion years",
    fact_ar: "عمر الكون: 13.8 مليار سنة",
    icon: "🌌"
  },
  {
    fact_en: "Venus day = 243 Earth days",
    fact_ar: "يوم الزهرة = 243 يوم أرضي",
    icon: "🪐"
  },
  {
    fact_en: "Jupiter's storm: 400+ years",
    fact_ar: "عاصفة المشتري: 400+ سنة",
    icon: "🪐"
  },
  {
    fact_en: "Neutron star: 6B tons/tsp",
    fact_ar: "النجم النيوتروني: 6 مليار طن/ملعقة",
    icon: "⭐"
  },
  {
    fact_en: "12 humans walked on Moon",
    fact_ar: "12 شخصاً مشوا على القمر",
    icon: "🌙"
  },
  {
    fact_en: "Andromeda collision: 4.5B years",
    fact_ar: "اصطدام أندروميدا: 4.5 مليار سنة",
    icon: "🌌"
  },
  {
    fact_en: "ISS speed: 7.66 km/s",
    fact_ar: "سرعة المحطة: 7.66 كم/ث",
    icon: "🛰️"
  },
  {
    fact_en: "5,000+ exoplanets found",
    fact_ar: "اكتُشف 5,000+ كوكب خارجي",
    icon: "🪐"
  },
  {
    fact_en: "JWST sees 200M years after Big Bang",
    fact_ar: "جيمس ويب يرى 200 مليون سنة بعد الانفجار",
    icon: "🔭"
  },
  {
    fact_en: "Black hole: no escape past horizon",
    fact_ar: "الثقب الأسود: لا هروب بعد الأفق",
    icon: "🕳️"
  },
  {
    fact_en: "Supernovae create gold & iron",
    fact_ar: "المستعرات العظمى تخلق الذهب والحديد",
    icon: "💥"
  },
  {
    fact_en: "Dark matter: 27% of universe",
    fact_ar: "المادة المظلمة: 27% من الكون",
    icon: "🌑"
  },
  {
    fact_en: "Saturn rings: 10 meters thick",
    fact_ar: "حلقات زحل: 10 أمتار سماكة",
    icon: "🪐"
  },
  {
    fact_en: "Neptune winds: 2,100 km/h",
    fact_ar: "رياح نبتون: 2,100 كم/ساعة",
    icon: "🪐"
  }
]

export default function DidYouKnowGrid({ lang = 'en' }: { lang?: 'en' | 'ar' }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="glass rounded-xl border border-purple-500/30 p-6">
      <h3 className="text-xl font-bold text-gradient mb-4 flex items-center gap-2">
        <span>✨</span>
        <span>{lang === 'ar' ? 'هل تعلم؟' : 'Did You Know?'}</span>
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {quickFacts.map((fact, index) => (
          <div
            key={index}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="group glass rounded-lg border border-purple-500/20 hover:border-purple-500/50 transition-all p-2.5 hover-lift cursor-pointer"
          >
            <div className="flex items-start gap-2">
              {fact.icon && (
                <span className="text-base flex-shrink-0 mt-0.5">
                  {fact.icon}
                </span>
              )}
              <p className="text-xs text-gray-300 leading-tight group-hover:text-white transition-colors">
                {lang === 'ar' ? fact.fact_ar : fact.fact_en}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
