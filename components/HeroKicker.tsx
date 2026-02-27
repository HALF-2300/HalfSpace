'use client'

import { useState, useEffect } from 'react'

const kickersEn = [
  'Journey through the cosmos',
  'Explore the universe',
  'Discover space wonders',
  'Your gateway to the stars',
  'Unveiling cosmic mysteries',
  'Navigate the infinite',
  'Where science meets wonder',
  "Beyond Earth's horizon"
]

const kickersAr = [
  'رحلة عبر الكون',
  'استكشف الكون',
  'اكتشف عجائب الفضاء',
  'بوابتك إلى النجوم',
  'كشف أسرار الكون',
  'توجّه في اللانهاية',
  'حيث يلتقي العلم بالدهشة',
  'ما وراء أفق الأرض'
]

const kickersEs = [
  'Viaje por el cosmos',
  'Explora el universo',
  'Descubre las maravillas del espacio',
  'Tu puerta a las estrellas',
  'Develando misterios cósmicos',
  'Navega lo infinito',
  'Donde la ciencia encuentra el asombro',
  'Más allá del horizonte terrestre'
]

const kickersZh = [
  '穿越宇宙之旅',
  '探索宇宙',
  '发现太空奇观',
  '通往星辰的大门',
  '揭开宇宙奥秘',
  '遨游无限',
  '科学与奇观交汇之处',
  '超越地球地平线'
]

const kickersByLocale: Record<string, string[]> = {
  en: kickersEn,
  ar: kickersAr,
  es: kickersEs,
  zh: kickersZh,
}

export default function HeroKicker({ locale = 'en' }: { locale?: string }) {
  const kickers = kickersByLocale[locale] || kickersEn
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % kickers.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [kickers.length])

  return (
    <div className="h-8 mb-6 flex items-center justify-center">
      <p
        key={currentIndex}
        className="text-lg md:text-xl text-gray-400 font-light animate-fade-in"
        style={{ animation: 'fadeIn 0.5s ease-in-out' }}
      >
        {kickers[currentIndex]}
      </p>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.5s ease-in-out; }
      `}</style>
    </div>
  )
}
