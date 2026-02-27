'use client'

import { useState } from 'react'

interface MiniFact {
  fact_en: string
  fact_ar: string
  icon?: string
}

interface DidYouKnowMiniProps {
  facts?: MiniFact[]
  lang?: 'en' | 'ar' | 'es' | 'zh'
}

const defaultFacts: MiniFact[] = [
  {
    fact_en: "Light travels at 299,792 km/s - fast enough to circle Earth 7.5 times in one second!",
    fact_ar: "الضوء يسافر بسرعة 299,792 كم/ث - سريع بما يكفي للدوران حول الأرض 7.5 مرة في ثانية واحدة!",
    icon: "⚡"
  },
  {
    fact_en: "The universe is 13.8 billion years old - and we can see galaxies from its first billion years",
    fact_ar: "الكون يبلغ 13.8 مليار سنة - ويمكننا رؤية مجرات من أول مليار سنة",
    icon: "🌌"
  },
  {
    fact_en: "Distance to Moon: 384,400 km | Distance to Sun: 150 million km | Distance to nearest star: 4.24 light-years",
    fact_ar: "المسافة للقمر: 384,400 كم | المسافة للشمس: 150 مليون كم | المسافة لأقرب نجم: 4.24 سنة ضوئية",
    icon: "📏"
  },
  {
    fact_en: "JWST can detect the heat signature of a bumblebee on the Moon from Earth",
    fact_ar: "جيمس ويب يمكنه اكتشاف توقيع الحرارة لنحلة على القمر من الأرض",
    icon: "🔭"
  },
  {
    fact_en: "One day on Venus = 243 Earth days (longer than its year!)",
    fact_ar: "يوم واحد على الزهرة = 243 يوم أرضي (أطول من سنتها!)",
    icon: "🪐"
  },
  {
    fact_en: "Jupiter's Great Red Spot is a storm larger than Earth that has raged for 400+ years",
    fact_ar: "البقعة الحمراء العظيمة لكوكب المشتري عاصفة أكبر من الأرض تستمر منذ 400+ سنة",
    icon: "🪐"
  },
  {
    fact_en: "A neutron star is so dense that a teaspoon would weigh 6 billion tons on Earth",
    fact_ar: "النجم النيوتروني كثيف جداً لدرجة أن ملعقة صغيرة تزن 6 مليارات طن على الأرض",
    icon: "⭐"
  },
  {
    fact_en: "The Sun produces more energy in one second than humanity has used throughout all history",
    fact_ar: "الشمس تنتج طاقة في ثانية واحدة أكثر مما استخدمته البشرية طوال التاريخ",
    icon: "☀️"
  },
  {
    fact_en: "Only 12 humans have ever walked on the Moon, all during Apollo missions (1969-1972)",
    fact_ar: "12 شخصاً فقط مشوا على القمر، جميعهم خلال بعثات أبولو (1969-1972)",
    icon: "🌙"
  },
  {
    fact_en: "The Andromeda Galaxy will collide with the Milky Way in about 4.5 billion years",
    fact_ar: "مجرة أندروميدا ستصطدم بدرب التبانة خلال حوالي 4.5 مليار سنة",
    icon: "🌌"
  },
  {
    fact_en: "Black holes can have event horizons where time and space swap roles",
    fact_ar: "الثقوب السوداء لها أفق حدث حيث يتبادل الزمان والمكان الأدوار",
    icon: "🕳️"
  },
  {
    fact_en: "Supernovae create most heavy elements in the universe, including gold and iron",
    fact_ar: "المستعرات العظمى تخلق معظم العناصر الثقيلة في الكون، بما في ذلك الذهب والحديد",
    icon: "💥"
  }
]

export default function DidYouKnowMini({ facts = defaultFacts, lang = 'en' }: DidYouKnowMiniProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="glass rounded-xl border border-purple-500/30 p-6">
      <h3 className="text-xl font-bold text-gradient mb-4 flex items-center gap-2">
        <span>✨</span>
        <span>{lang === 'ar' ? 'هل تعلم؟' : 'Did You Know?'}</span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {facts.map((fact, index) => (
          <div
            key={index}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="group glass rounded-lg border border-purple-500/20 hover:border-purple-500/50 transition-all p-3 hover-lift cursor-pointer"
          >
            <div className="flex items-start gap-2">
              {fact.icon && (
                <span className="text-lg flex-shrink-0 mt-0.5">
                  {fact.icon}
                </span>
              )}
              <p className="text-xs text-gray-300 leading-relaxed group-hover:text-white transition-colors">
                {lang === 'ar' ? fact.fact_ar : fact.fact_en}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
