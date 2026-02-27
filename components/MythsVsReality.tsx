'use client'

import { useState } from 'react'

interface Myth {
  id: string
  myth: string
  mythAr: string
  reality: string
  realityAr: string
  reason: string
  reasonAr: string
  category: string
}

const myths: Myth[] = [
  {
    id: '1',
    myth: 'Space is extremely cold, so you freeze instantly',
    mythAr: 'الفضاء بارد جداً، لذلك تتجمد فوراً',
    reality: 'You would actually overheat first, then freeze',
    realityAr: 'ستسخن أولاً، ثم تتجمد',
    reason: 'In vacuum, your body heat has nowhere to go, so you overheat. Only after losing heat through radiation would you freeze.',
    reasonAr: 'في الفراغ، حرارة جسمك لا تجد مكاناً تذهب إليه، لذلك تسخن. فقط بعد فقدان الحرارة بالإشعاع ستتجمد.',
    category: 'space-environment'
  },
  {
    id: '2',
    myth: 'The Sun is yellow',
    mythAr: 'الشمس صفراء',
    reality: 'The Sun is actually white',
    realityAr: 'الشمس في الواقع بيضاء',
    reason: 'Our atmosphere scatters blue light, making the Sun appear yellow. From space, it appears white.',
    reasonAr: 'غلافنا الجوي يشتت الضوء الأزرق، مما يجعل الشمس تبدو صفراء. من الفضاء، تبدو بيضاء.',
    category: 'stars'
  },
  {
    id: '3',
    myth: 'You can see the Great Wall of China from space',
    mythAr: 'يمكنك رؤية سور الصين العظيم من الفضاء',
    reality: 'It\'s very difficult to see with the naked eye',
    realityAr: 'من الصعب جداً رؤيته بالعين المجردة',
    reason: 'The wall is only about 6 meters wide and blends with its surroundings. Astronauts need binoculars or cameras to see it clearly.',
    reasonAr: 'السور عرضه حوالي 6 أمتار فقط ويمتزج مع محيطه. رواد الفضاء يحتاجون مناظير أو كاميرات لرؤيته بوضوح.',
    category: 'earth'
  },
  {
    id: '4',
    myth: 'There is no gravity in space',
    mythAr: 'لا توجد جاذبية في الفضاء',
    reality: 'Gravity exists everywhere, including in space',
    realityAr: 'الجاذبية موجودة في كل مكان، بما في ذلك الفضاء',
    reason: 'Astronauts float because they are in free fall around Earth, not because there\'s no gravity. Gravity keeps the Moon in orbit!',
    reasonAr: 'رواد الفضاء يطفون لأنهم في سقوط حر حول الأرض، وليس لأن الجاذبية غير موجودة. الجاذبية تبقي القمر في مداره!',
    category: 'physics'
  },
  {
    id: '5',
    myth: 'The dark side of the Moon never sees sunlight',
    mythAr: 'الجانب المظلم من القمر لا يرى ضوء الشمس أبداً',
    reality: 'All sides of the Moon receive sunlight',
    realityAr: 'جميع جوانب القمر تتلقى ضوء الشمس',
    reason: 'The Moon rotates, so all sides get sunlight. The "dark side" is just the side we never see from Earth because the Moon is tidally locked.',
    reasonAr: 'القمر يدور، لذلك جميع الجوانب تحصل على ضوء الشمس. "الجانب المظلم" هو فقط الجانب الذي لا نراه من الأرض لأن القمر مقيد مدياً.',
    category: 'moon'
  },
  {
    id: '6',
    myth: 'Sound travels in space',
    mythAr: 'الصوت ينتقل في الفضاء',
    reality: 'Sound cannot travel in the vacuum of space',
    realityAr: 'الصوت لا يمكنه الانتقال في فراغ الفضاء',
    reason: 'Sound needs a medium (like air) to travel. In space\'s vacuum, there\'s no medium, so sound cannot propagate.',
    reasonAr: 'الصوت يحتاج وسط (مثل الهواء) للانتقال. في فراغ الفضاء، لا يوجد وسط، لذلك الصوت لا يمكنه الانتشار.',
    category: 'physics'
  },
  {
    id: '7',
    myth: 'Black holes suck everything in',
    mythAr: 'الثقوب السوداء تمتص كل شيء',
    reality: 'Black holes have gravity like any other object',
    realityAr: 'الثقوب السوداء لها جاذبية مثل أي جسم آخر',
    reason: 'If the Sun became a black hole, Earth would continue orbiting normally. You\'d only be pulled in if you got very close to the event horizon.',
    reasonAr: 'إذا أصبحت الشمس ثقباً أسود، ستستمر الأرض في الدوران بشكل طبيعي. ستُسحب فقط إذا اقتربت جداً من أفق الحدث.',
    category: 'black-holes'
  },
  {
    id: '8',
    myth: 'You explode in space without a spacesuit',
    mythAr: 'تنفجر في الفضاء بدون بدلة فضاء',
    reality: 'You would lose consciousness in 15 seconds, but not explode',
    realityAr: 'ستفقد الوعي في 15 ثانية، لكن لن تنفجر',
    reason: 'Your skin is strong enough to hold you together. You\'d die from lack of oxygen and pressure, but your body wouldn\'t explode.',
    reasonAr: 'جلدك قوي بما يكفي لإبقائك متماسكاً. ستموت من نقص الأكسجين والضغط، لكن جسدك لن ينفجر.',
    category: 'space-environment'
  }
]

const categories = [
  { id: 'all', name: 'All' },
  { id: 'space-environment', name: 'Space Environment' },
  { id: 'stars', name: 'Stars' },
  { id: 'earth', name: 'Earth' },
  { id: 'physics', name: 'Physics' },
  { id: 'moon', name: 'Moon' },
  { id: 'black-holes', name: 'Black Holes' }
]

export default function MythsVsReality() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedMyth, setSelectedMyth] = useState<Myth | null>(null)

  const filteredMyths = selectedCategory === 'all'
    ? myths
    : myths.filter(m => m.category === selectedCategory)

  return (
    <div className="min-h-screen pt-20 px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-gradient portal-title">
            Myths vs Reality
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Debunking common space myths with scientific facts
          </p>
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'glass border border-purple-500/30 text-gray-300 hover:border-purple-500/50'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Myths Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMyths.map((myth) => (
            <div
              key={myth.id}
              onClick={() => setSelectedMyth(myth)}
              className="glass rounded-2xl p-6 border-2 border-purple-500/30 hover:border-purple-500/50 transition-all transform hover:scale-105 cursor-pointer"
            >
              <div className="mb-4">
                <div className="text-red-400 font-semibold mb-2">❌ Myth</div>
                <p className="text-white font-semibold mb-4">{myth.myth}</p>
              </div>
              
              <div className="mb-4">
                <div className="text-green-400 font-semibold mb-2">✅ Reality</div>
                <p className="text-gray-300 text-sm line-clamp-2">{myth.reality}</p>
              </div>
              
              <div className="text-purple-400 text-sm font-semibold">
                Learn why →
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedMyth && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedMyth(null)}
          >
            <div
              className="glass rounded-3xl p-8 max-w-3xl w-full border-2 border-purple-500/50 animate-fade-in max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-4xl font-bold text-gradient">Myth vs Reality</h2>
                <button
                  onClick={() => setSelectedMyth(null)}
                  className="text-3xl text-gray-400 hover:text-white transition-colors"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Myth */}
                <div className="p-6 bg-red-500/10 border-2 border-red-500/30 rounded-xl">
                  <div className="text-red-400 font-bold text-lg mb-3">❌ Myth</div>
                  <p className="text-white text-xl font-semibold">{selectedMyth.myth}</p>
                </div>
                
                {/* Reality */}
                <div className="p-6 bg-green-500/10 border-2 border-green-500/30 rounded-xl">
                  <div className="text-green-400 font-bold text-lg mb-3">✅ Reality</div>
                  <p className="text-white text-xl font-semibold">{selectedMyth.reality}</p>
                </div>
                
                {/* Reason */}
                <div className="p-6 bg-purple-500/10 border-2 border-purple-500/30 rounded-xl">
                  <div className="text-purple-400 font-bold text-lg mb-3">💡 Why</div>
                  <p className="text-gray-300">{selectedMyth.reason}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

