'use client'

import { useState } from 'react'
import ExperienceModal from './ExperienceModal'

const cards = [
  {
    id: 'origins',
    title: 'Origins',
    titleAr: 'الأصول',
    icon: '💥',
    content: `The universe began with the Big Bang approximately 13.8 billion years ago. From an infinitely dense point, space, time, matter, and energy expanded rapidly, creating the cosmos we know today.

Within the first second, the universe expanded from smaller than an atom to the size of a galaxy. This expansion continues today, and we can still observe the afterglow of this event in the cosmic microwave background radiation.

The first stars formed about 100-200 million years after the Big Bang, ending the cosmic Dark Ages and beginning the era of reionization.`,
    contentAr: `بدأ الكون مع الانفجار العظيم منذ حوالي 13.8 مليار سنة. من نقطة كثيفة بلا حدود، توسع الفضاء والزمن والمادة والطاقة بسرعة، مكونة الكون الذي نعرفه اليوم.

خلال الثانية الأولى، توسع الكون من أصغر من ذرة إلى حجم مجرة. هذا التوسع مستمر اليوم، ويمكننا رصد توهج هذا الحدث في إشعاع الخلفية الكوني الميكروي.

أول النجوم تشكلت بعد حوالي 100-200 مليون سنة من الانفجار العظيم، منهية العصور المظلمة الكونية وبدء عصر إعادة التأين.`,
  },
  {
    id: 'stars',
    title: 'Stars',
    titleAr: 'النجوم',
    icon: '⭐',
    content: `Stars are the cosmic furnaces that light up the universe. They form in giant molecular clouds when gravity causes dense regions to collapse. When the core reaches about 10 million Kelvin, nuclear fusion begins, and a star is born.

Stars spend most of their lives on the main sequence, fusing hydrogen into helium. Our Sun has been in this phase for 4.6 billion years and will remain for another 5 billion.

The life of a star depends on its mass. Low-mass stars can burn for trillions of years, while massive stars live fast and die young, exploding as supernovae and seeding the universe with heavy elements essential for planets and life.`,
    contentAr: `النجوم هي الأفران الكونية التي تنير الكون. تتشكل في سحب جزيئية عملاقة عندما تسبب الجاذبية انهيار المناطق الكثيفة. عندما يصل القلب إلى حوالي 10 ملايين كلفن، يبدأ الاندماج النووي، ويولد النجم.

النجوم تقضي معظم حياتها في التسلسل الرئيسي، تندمج الهيدروجين إلى هيليوم. شمسنا كانت في هذه المرحلة لمدة 4.6 مليار سنة وستبقى لمدة 5 مليارات أخرى.

حياة النجم تعتمد على كتلته. النجوم منخفضة الكتلة يمكن أن تحترق لتريليونات السنين، بينما النجوم الضخمة تعيش بسرعة وتموت صغيرة، منفجرة كمستعرات عظمى وزرع الكون بعناصر ثقيلة ضرورية للكواكب والحياة.`,
  },
  {
    id: 'galaxies',
    title: 'Galaxies',
    titleAr: 'المجرات',
    icon: '🌌',
    content: `Galaxies are vast cosmic cities containing billions of stars, gas, dust, and dark matter. They come in three main types: spiral, elliptical, and irregular.

Our Milky Way is a barred spiral galaxy, about 100,000 light-years across, containing 100-400 billion stars. It began forming about 400 million years after the Big Bang through hierarchical assembly, with smaller galaxies merging over billions of years.

Galaxies are not randomly distributed but form groups and clusters. The Local Group contains the Milky Way, Andromeda, and about 50 smaller galaxies, all bound together by gravity in the cosmic web.`,
    contentAr: `المجرات مدن كونية شاسعة تحتوي على مليارات النجوم والغاز والغبار والمادة المظلمة. تأتي في ثلاثة أنواع رئيسية: حلزونية، إهليلجية، وغير منتظمة.

درب التبانة مجرة حلزونية قضيبية، حوالي 100,000 سنة ضوئية عبر، تحتوي 100-400 مليار نجم. بدأت تتكون بعد حوالي 400 مليون سنة من الانفجار العظيم من خلال التجميع الهرمي، مع مجرات أصغر تندمج على مدى مليارات السنين.

المجرات ليست موزعة عشوائياً بل تشكل مجموعات وعناقيد. المجموعة المحلية تحتوي على درب التبانة، أندروميدا، وحوالي 50 مجرة أصغر، كلها مربوطة معاً بالجاذبية في الشبكة الكونية.`,
  },
]

export default function ExperienceCards({ lang = 'en' }: { lang?: 'en' | 'ar' }) {
  const [openModal, setOpenModal] = useState<string | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => setOpenModal(card.id)}
            className="group relative glass rounded-2xl border-2 border-purple-500/30 p-8 hover:border-purple-500/70 transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/0 via-purple-500/10 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative z-10 text-center">
              <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform">
                {card.icon}
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gradient">
                {lang === 'ar' ? card.titleAr : card.title}
              </h3>
              <p className="text-sm text-gray-400">
                {lang === 'ar' ? 'انقر للاستكشاف' : 'Click to explore'}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Modals */}
      {cards.map((card) => (
        <ExperienceModal
          key={card.id}
          isOpen={openModal === card.id}
          onClose={() => setOpenModal(null)}
          title={lang === 'ar' ? card.titleAr : card.title}
          icon={card.icon}
          content={lang === 'ar' ? card.contentAr : card.content}
        />
      ))}
    </>
  )
}
