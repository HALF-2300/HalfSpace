'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function SolarSystemPage() {
  const [filter, setFilter] = useState<string>('all')
  const [compareMode, setCompareMode] = useState(false)
  const [selectedPlanets, setSelectedPlanets] = useState<string[]>([])

  const planets = [
    {
      id: 'mercury',
      name: 'عطارد',
      nameEn: 'Mercury',
      type: 'rocky',
      diameter: '4,879',
      gravity: '3.7',
      dayLength: '59',
      temperature: '167',
      hasRings: false,
      moons: 0,
      image: 'https://images-assets.nasa.gov/image/PIA16853/PIA16853~orig.jpg',
      facts: [
        'أصغر كوكب في المجموعة الشمسية',
        'أقرب كوكب للشمس',
        'لا يملك غلاف جوي',
        'درجة حرارته تتراوح بين -173°C و 427°C',
        'يومه أطول من سنته',
        'سطحه مليء بالفوهات'
      ],
      unique: 'عطارد هو الكوكب الأسرع في دورانه حول الشمس، حيث يكمل دورة كاملة في 88 يومًا أرضيًا فقط.'
    },
    {
      id: 'venus',
      name: 'الزهرة',
      nameEn: 'Venus',
      type: 'rocky',
      diameter: '12,104',
      gravity: '8.87',
      dayLength: '243',
      temperature: '462',
      hasRings: false,
      moons: 0,
      image: 'https://images-assets.nasa.gov/image/PIA00271/PIA00271~orig.jpg',
      facts: [
        'أكثر الكواكب حرارة',
        'غلافه الجوي كثيف جدًا',
        'يدور عكس اتجاه الكواكب الأخرى',
        'يومه أطول من سنته',
        'يُسمى "نجم الصباح"',
        'ضغطه الجوي 92 ضعف الأرض'
      ],
      unique: 'الزهرة هو الكوكب الوحيد الذي يدور من الشرق إلى الغرب، وله غلاف جوي سام من ثاني أكسيد الكربون.'
    },
    {
      id: 'earth',
      name: 'الأرض',
      nameEn: 'Earth',
      type: 'rocky',
      diameter: '12,756',
      gravity: '9.8',
      dayLength: '24',
      temperature: '15',
      hasRings: false,
      moons: 1,
      image: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000273/GSFC_20171208_Archive_e000273~orig.jpg',
      facts: [
        'الكوكب الوحيد المعروف بالحياة',
        '71% من سطحه ماء',
        'له قمر واحد كبير',
        'غلاف جوي يحميه',
        'مغناطيسي قوي',
        'درجة حرارته مناسبة للحياة'
      ],
      unique: 'الأرض هي الكوكب الوحيد المعروف بوجود الحياة، بفضل موقعها المثالي في "المنطقة الصالحة للسكن" والماء السائل.'
    },
    {
      id: 'mars',
      name: 'المريخ',
      nameEn: 'Mars',
      type: 'rocky',
      diameter: '6,792',
      gravity: '3.71',
      dayLength: '24.6',
      temperature: '-65',
      hasRings: false,
      moons: 2,
      image: 'https://images-assets.nasa.gov/image/PIA04591/PIA04591~orig.jpg',
      facts: [
        'الكوكب الأحمر',
        'أكبر بركان في النظام الشمسي',
        'له قمران صغيران',
        'كان فيه ماء سابقًا',
        'يومه قريب من يوم الأرض',
        'هدف للاستعمار البشري'
      ],
      unique: 'المريخ يحتوي على أوليمبوس مونس، أكبر بركان في النظام الشمسي بارتفاع 25 كيلومترًا.'
    },
    {
      id: 'jupiter',
      name: 'المشتري',
      nameEn: 'Jupiter',
      type: 'gas',
      diameter: '142,984',
      gravity: '24.79',
      dayLength: '9.9',
      temperature: '-110',
      hasRings: true,
      moons: 95,
      image: 'https://images-assets.nasa.gov/image/PIA02873/PIA02873~orig.jpg',
      facts: [
        'أكبر كوكب في النظام الشمسي',
        'له أكثر من 90 قمرًا',
        'البقعة الحمراء العظيمة',
        'كوكب غازي عملاق',
        'يحمي الكواكب الداخلية',
        'له حلقات خفيفة'
      ],
      unique: 'المشتري هو أكبر كوكب في نظامنا الشمسي، وكتلته أكبر من جميع الكواكب الأخرى مجتمعة.'
    },
    {
      id: 'saturn',
      name: 'زحل',
      nameEn: 'Saturn',
      type: 'gas',
      diameter: '120,536',
      gravity: '10.44',
      dayLength: '10.7',
      temperature: '-140',
      hasRings: true,
      moons: 146,
      image: 'https://images-assets.nasa.gov/image/PIA06193/PIA06193~orig.jpg',
      facts: [
        'مشهور بحلقاته',
        'أقل كثافة من الماء',
        'له أكثر من 140 قمرًا',
        'قمر تيتان كبير جدًا',
        'حلقاته من الجليد والصخور',
        'كوكب غازي عملاق'
      ],
      unique: 'زحل هو الكوكب الوحيد الذي كثافته أقل من الماء - لو وضعناه في محيط كبير، سيطفو!'
    },
    {
      id: 'uranus',
      name: 'أورانوس',
      nameEn: 'Uranus',
      type: 'ice',
      diameter: '51,118',
      gravity: '8.69',
      dayLength: '17.2',
      temperature: '-195',
      hasRings: true,
      moons: 27,
      image: 'https://images-assets.nasa.gov/image/PIA18182/PIA18182~orig.jpg',
      facts: [
        'مائل على جانبه',
        'لونه أزرق-أخضر',
        'كوكب جليدي',
        'له حلقات رأسية',
        'فصوله تستمر 21 عامًا',
        'أبرد كوكب في النظام'
      ],
      unique: 'أورانوس هو الكوكب الوحيد الذي يدور على جانبه بزاوية 98 درجة، مما يسبب فصولًا غريبة.'
    },
    {
      id: 'neptune',
      name: 'نبتون',
      nameEn: 'Neptune',
      type: 'ice',
      diameter: '49,528',
      gravity: '11.15',
      dayLength: '16.1',
      temperature: '-200',
      hasRings: true,
      moons: 16,
      image: 'https://images-assets.nasa.gov/image/PIA01492/PIA01492~orig.jpg',
      facts: [
        'أبعد كوكب عن الشمس',
        'أسرع رياح في النظام',
        'لونه أزرق عميق',
        'كوكب جليدي',
        'اكتُشف بالحسابات الرياضية',
        'له عواصف قوية'
      ],
      unique: 'نبتون لديه أسرع رياح في النظام الشمسي، تصل سرعتها إلى 2,100 كم/ساعة.'
    },
  ]

  const filteredPlanets = planets.filter(planet => {
    if (filter === 'all') return true
    if (filter === 'rocky') return planet.type === 'rocky'
    if (filter === 'gas') return planet.type === 'gas'
    if (filter === 'ice') return planet.type === 'ice'
    if (filter === 'rings') return planet.hasRings
    if (filter === 'many-moons') return planet.moons > 10
    return true
  })

  const togglePlanet = (id: string) => {
    if (selectedPlanets.includes(id)) {
      setSelectedPlanets(selectedPlanets.filter(p => p !== id))
    } else if (selectedPlanets.length < 2) {
      setSelectedPlanets([...selectedPlanets, id])
    }
  }

  const selectedPlanetsData = planets.filter(p => selectedPlanets.includes(p.id))

  return (
    <div className="pt-20 relative min-h-screen">
      {/* Header */}
      <section className="py-12 px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient">
          المجموعة الشمسية
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          استكشف كواكبنا الثمانية والشمس والأقمار
        </p>
      </section>

      {/* Filters */}
      <section className="px-4 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { id: 'all', label: 'الكل' },
              { id: 'rocky', label: 'صخري' },
              { id: 'gas', label: 'غازي' },
              { id: 'ice', label: 'جليدي' },
              { id: 'rings', label: 'فيه حلقات' },
              { id: 'many-moons', label: 'أقمار كثيرة' },
            ].map(filterOption => (
              <button
                key={filterOption.id}
                onClick={() => setFilter(filterOption.id)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filter === filterOption.id
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'glass border border-purple-500/30 text-gray-300 hover:bg-purple-500/20'
                }`}
              >
                {filterOption.label}
              </button>
            ))}
            <button
              onClick={() => {
                setCompareMode(!compareMode)
                setSelectedPlanets([])
              }}
              className={`px-4 py-2 rounded-lg transition-all ${
                compareMode
                  ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white'
                  : 'glass border border-purple-500/30 text-gray-300 hover:bg-purple-500/20'
              }`}
            >
              {compareMode ? 'إلغاء المقارنة' : 'قارن'}
            </button>
          </div>
        </div>
      </section>

      {/* Planets Grid */}
      <section className="px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPlanets.map((planet) => (
              <div
                key={planet.id}
                className={`glass rounded-2xl overflow-hidden border-2 transition-all hover-lift ${
                  compareMode && selectedPlanets.includes(planet.id)
                    ? 'border-yellow-500 glow-purple'
                    : 'border-purple-500/30 hover:border-purple-500/70'
                } ${compareMode ? 'cursor-pointer' : ''}`}
                onClick={() => compareMode && togglePlanet(planet.id)}
              >
                {/* Image */}
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={planet.image}
                    alt={planet.name}
                    fill
                    className="object-cover"
                    unoptimized={planet.image.startsWith('http')}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-space-dark via-transparent to-transparent" />
                  <div className="absolute top-4 right-4 text-4xl">{planet.type === 'rocky' ? '🪨' : planet.type === 'gas' ? '💨' : '🧊'}</div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{planet.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{planet.nameEn}</p>

                  {/* 4 Big Numbers */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="glass rounded-lg p-3 border border-purple-500/20">
                      <div className="text-xs text-gray-400 mb-1">القطر (كم)</div>
                      <div className="text-lg font-bold text-gradient">{planet.diameter}</div>
                    </div>
                    <div className="glass rounded-lg p-3 border border-purple-500/20">
                      <div className="text-xs text-gray-400 mb-1">الجاذبية</div>
                      <div className="text-lg font-bold text-gradient">{planet.gravity}</div>
                    </div>
                    <div className="glass rounded-lg p-3 border border-purple-500/20">
                      <div className="text-xs text-gray-400 mb-1">طول اليوم (ساعة)</div>
                      <div className="text-lg font-bold text-gradient">{planet.dayLength}</div>
                    </div>
                    <div className="glass rounded-lg p-3 border border-purple-500/20">
                      <div className="text-xs text-gray-400 mb-1">الحرارة (°C)</div>
                      <div className="text-lg font-bold text-gradient">{planet.temperature}</div>
                    </div>
                  </div>

                  {/* Quick Facts */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">حقائق سريعة:</h4>
                    <ul className="text-xs text-gray-400 space-y-1">
                      {planet.facts.slice(0, 3).map((fact, i) => (
                        <li key={i}>• {fact}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Unique Feature */}
                  <div className="glass rounded-lg p-3 border border-purple-500/20 mb-4">
                    <div className="text-xs font-semibold text-purple-400 mb-1">وش يميّزه؟</div>
                    <p className="text-xs text-gray-300 leading-relaxed">{planet.unique}</p>
                  </div>

                  {compareMode && (
                    <div className={`text-center py-2 rounded-lg ${
                      selectedPlanets.includes(planet.id)
                        ? 'bg-yellow-500/20 border border-yellow-500'
                        : 'bg-purple-500/10 border border-purple-500/30'
                    }`}>
                      {selectedPlanets.includes(planet.id) ? '✓ مختار' : 'اختر للمقارنة'}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      {compareMode && selectedPlanetsData.length === 2 && (
        <section className="px-4 pb-20">
          <div className="max-w-5xl mx-auto glass rounded-2xl p-8 border border-purple-500/30">
            <h2 className="text-3xl font-bold text-center mb-8 text-gradient">
              مقارنة الكواكب
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-purple-500/30">
                    <th className="text-right p-4 text-gray-300">المقياس</th>
                    {selectedPlanetsData.map(planet => (
                      <th key={planet.id} className="text-right p-4 text-white font-bold">{planet.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-purple-500/20">
                    <td className="p-4 text-gray-400">القطر (كم)</td>
                    {selectedPlanetsData.map(planet => (
                      <td key={planet.id} className="p-4 text-white">{planet.diameter}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-purple-500/20">
                    <td className="p-4 text-gray-400">الجاذبية (م/ث²)</td>
                    {selectedPlanetsData.map(planet => (
                      <td key={planet.id} className="p-4 text-white">{planet.gravity}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-purple-500/20">
                    <td className="p-4 text-gray-400">طول اليوم (ساعة)</td>
                    {selectedPlanetsData.map(planet => (
                      <td key={planet.id} className="p-4 text-white">{planet.dayLength}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-purple-500/20">
                    <td className="p-4 text-gray-400">الحرارة (°C)</td>
                    {selectedPlanetsData.map(planet => (
                      <td key={planet.id} className="p-4 text-white">{planet.temperature}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 text-gray-400">عدد الأقمار</td>
                    {selectedPlanetsData.map(planet => (
                      <td key={planet.id} className="p-4 text-white">{planet.moons}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
