'use client'

import Image from 'next/image'

export default function TelescopesPage() {
  const telescopes = {
    visible: [
      {
        name: 'تلسكوب هابل الفضائي',
        description: 'أشهر تلسكوب فضائي في التاريخ',
        image: 'https://images-assets.nasa.gov/image/webbfirstimages_001_gsfc_20220711_archive_e001435/webbfirstimages_001_gsfc_20220711_archive_e001435~orig.jpg',
        sees: 'يرى الضوء المرئي والأشعة فوق البنفسجية',
        importance: 'غيّر فهمنا للكون بشكل جذري. صوره المذهلة كشفت عن أعماق الكون وعمره واتساعه.',
        examples: [
          'https://images-assets.nasa.gov/image/PIA03149/PIA03149~orig.jpg',
          'https://images-assets.nasa.gov/image/PIA01341/PIA01341~orig.jpg',
          'https://images-assets.nasa.gov/image/PIA04591/PIA04591~orig.jpg',
        ]
      },
    ],
    infrared: [
      {
        name: 'تلسكوب جيمس ويب الفضائي',
        description: 'أقوى تلسكوب فضائي على الإطلاق',
        image: 'https://images-assets.nasa.gov/image/webbfirstimages_001_gsfc_20220711_archive_e001435/webbfirstimages_001_gsfc_20220711_archive_e001435~orig.jpg',
        sees: 'يرى الأشعة تحت الحمراء - يخترق الغبار الكوني',
        importance: 'يمكنه رؤية النجوم والمجرات الأولى في الكون. يخترق سحب الغبار ليكشف عن ولادة النجوم.',
        examples: [
          'https://images-assets.nasa.gov/image/PIA03149/PIA03149~orig.jpg',
          'https://images-assets.nasa.gov/image/PIA01341/PIA01341~orig.jpg',
          'https://images-assets.nasa.gov/image/PIA04591/PIA04591~orig.jpg',
        ]
      },
    ],
    radio: [
      {
        name: 'مصفوفة أتاكاما الكبيرة',
        description: 'أكبر تلسكوب راديوي في العالم',
        image: 'https://images-assets.nasa.gov/image/PIA03149/PIA03149~orig.jpg',
        sees: 'يرى موجات الراديو - يكشف عن الغاز البارد والثقوب السوداء',
        importance: 'يكشف عن أجزاء من الكون لا يمكن رؤيتها بالضوء المرئي. صور أول ثقب أسود.',
        examples: [
          'https://images-assets.nasa.gov/image/PIA01341/PIA01341~orig.jpg',
          'https://images-assets.nasa.gov/image/PIA04591/PIA04591~orig.jpg',
          'https://images-assets.nasa.gov/image/PIA03149/PIA03149~orig.jpg',
        ]
      },
    ],
    xray: [
      {
        name: 'تلسكوب شاندرا للأشعة السينية',
        description: 'يرى الكون بالأشعة السينية',
        image: 'https://images-assets.nasa.gov/image/PIA03149/PIA03149~orig.jpg',
        sees: 'يرى الأشعة السينية - يكشف عن الأجسام الساخنة جدًا',
        importance: 'يكشف عن الثقوب السوداء والنجوم النيوترونية والانفجارات النجمية.',
        examples: [
          'https://images-assets.nasa.gov/image/PIA01341/PIA01341~orig.jpg',
          'https://images-assets.nasa.gov/image/PIA04591/PIA04591~orig.jpg',
          'https://images-assets.nasa.gov/image/PIA03149/PIA03149~orig.jpg',
        ]
      },
    ],
  }

  const categories = [
    { id: 'visible', label: 'ترى الضوء المرئي', icon: '👁️', data: telescopes.visible },
    { id: 'infrared', label: 'تحت الأحمر', icon: '🔴', data: telescopes.infrared },
    { id: 'radio', label: 'الراديو', icon: '📻', data: telescopes.radio },
    { id: 'xray', label: 'الأشعة السينية', icon: '☢️', data: telescopes.xray },
  ]

  return (
    <div className="pt-20 relative min-h-screen">
      {/* Header */}
      <section className="py-12 px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient">
          التلسكوبات والمراصد
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          نوافذنا على الكون
        </p>
      </section>

      {/* Categories */}
      <section className="px-4 pb-20">
        <div className="max-w-7xl mx-auto space-y-16">
          {categories.map((category) => (
            <div key={category.id} className="glass rounded-3xl p-8 border border-purple-500/30">
              <div className="flex items-center gap-4 mb-8">
                <span className="text-5xl">{category.icon}</span>
                <h2 className="text-4xl font-bold text-gradient">{category.label}</h2>
              </div>

              <div className="space-y-12">
                {category.data.map((telescope, index) => (
                  <div key={index} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Main Image */}
                    <div className="relative h-64 lg:h-full rounded-xl overflow-hidden">
                      <Image
                        src={telescope.image}
                        alt={telescope.name}
                        fill
                        className="object-cover"
                        unoptimized={telescope.image.startsWith('http')}
                      />
                    </div>

                    {/* Content */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-3xl font-bold text-white mb-2">{telescope.name}</h3>
                        <p className="text-gray-400">{telescope.description}</p>
                      </div>

                      <div className="glass rounded-lg p-4 border border-purple-500/20">
                        <div className="text-sm text-purple-400 font-semibold mb-2">يشوف وش ما نشوفه:</div>
                        <p className="text-white">{telescope.sees}</p>
                      </div>

                      <div>
                        <div className="text-sm text-purple-400 font-semibold mb-2">ليش مهم؟</div>
                        <p className="text-gray-300 leading-relaxed">{telescope.importance}</p>
                      </div>

                      {/* Example Images */}
                      <div>
                        <div className="text-sm text-purple-400 font-semibold mb-4">3 صور مثال:</div>
                        <div className="grid grid-cols-3 gap-3">
                          {telescope.examples.map((img, i) => (
                            <div key={i} className="relative h-24 rounded-lg overflow-hidden">
                              <Image
                                src={img}
                                alt={`مثال ${i + 1}`}
                                fill
                                className="object-cover"
                                unoptimized={img.startsWith('http')}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
