'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function MissionsPage() {
  const [activeTab, setActiveTab] = useState('race')
  const [selectedMission, setSelectedMission] = useState<string | null>(null)

  const missions = {
    race: [
      {
        id: 'sputnik',
        title: 'سبوتنيك 1',
        year: '1957',
        objective: 'أول قمر صناعي في الفضاء',
        achievement: 'بداية عصر الفضاء',
        image: 'https://images-assets.nasa.gov/image/SPD-SLRSY-1857/SPD-SLRSY-1857~orig.jpg',
        before: 'قبل المهمة: لم يكن هناك أي جسم من صنع الإنسان في الفضاء',
        during: 'أثناء المهمة: أرسل إشارات راديو لمدة 22 يومًا',
        after: 'بعد المهمة: فتح الطريق لجميع المهمات الفضائية اللاحقة'
      },
      {
        id: 'gagarin',
        title: 'فوستوك 1 - يوري جاجارين',
        year: '1961',
        objective: 'أول إنسان في الفضاء',
        achievement: 'أول رائد فضاء في التاريخ',
        image: 'https://images-assets.nasa.gov/image/SPD-SLRSY-1861/SPD-SLRSY-1861~orig.jpg',
        before: 'قبل المهمة: لم يسبق لأي إنسان أن غادر الأرض',
        during: 'أثناء المهمة: دار حول الأرض مرة واحدة في 108 دقائق',
        after: 'بعد المهمة: أصبح جاجارين بطلاً عالميًا ورمزًا للاستكشاف'
      },
    ],
    moon: [
      {
        id: 'apollo11',
        title: 'أبولو 11',
        year: '1969',
        objective: 'هبوط البشر على القمر',
        achievement: 'أول خطوات بشرية على القمر',
        image: 'https://images-assets.nasa.gov/image/AS11-40-5874/AS11-40-5874~orig.jpg',
        before: 'قبل المهمة: القمر كان هدفًا بعيد المنال',
        during: 'أثناء المهمة: نيل أرمسترونغ وباز ألدرين مشوا على القمر',
        after: 'بعد المهمة: "خطوة صغيرة للإنسان، قفزة عظيمة للبشرية"'
      },
      {
        id: 'apollo13',
        title: 'أبولو 13',
        year: '1970',
        objective: 'هبوط ثالث على القمر',
        achievement: 'أعظم عملية إنقاذ في تاريخ الفضاء',
        image: 'https://images-assets.nasa.gov/image/AS13-62-9001/AS13-62-9001~orig.jpg',
        before: 'قبل المهمة: مهمة روتينية للهبوط على القمر',
        during: 'أثناء المهمة: انفجار في المركبة، عودة آمنة للأرض',
        after: 'بعد المهمة: درس في الشجاعة والبراعة الهندسية'
      },
    ],
    mars: [
      {
        id: 'curiosity',
        title: 'كوريوسيتي',
        year: '2012',
        objective: 'استكشاف المريخ والبحث عن علامات الحياة',
        achievement: 'أكبر وأحدث مركبة على المريخ',
        image: 'https://images-assets.nasa.gov/image/PIA24542/PIA24542~orig.jpg',
        before: 'قبل المهمة: معلومات محدودة عن سطح المريخ',
        during: 'أثناء المهمة: اكتشفت أدلة على وجود ماء سابق',
        after: 'بعد المهمة: لا تزال تعمل وتستكشف حتى اليوم'
      },
      {
        id: 'perseverance',
        title: 'بيرسيفيرانس',
        year: '2021',
        objective: 'البحث عن علامات الحياة القديمة وجمع عينات',
        achievement: 'أول طائرة هليكوبتر على المريخ (إنجينويتي)',
        image: 'https://images-assets.nasa.gov/image/PIA24542/PIA24542~orig.jpg',
        before: 'قبل المهمة: استعدادات لجمع عينات للعودة',
        during: 'أثناء المهمة: طيران ناجح للهليكوبتر + جمع عينات',
        after: 'بعد المهمة: تمهيد الطريق لإعادة العينات إلى الأرض'
      },
    ],
    stations: [
      {
        id: 'iss',
        title: 'محطة الفضاء الدولية',
        year: '1998-حتى الآن',
        objective: 'مختبر علمي في الفضاء',
        achievement: 'أكبر هيكل من صنع الإنسان في الفضاء',
        image: 'https://images-assets.nasa.gov/image/iss050e043303/iss050e043303~orig.jpg',
        before: 'قبل المهمة: محطات فضائية أصغر وأبسط',
        during: 'أثناء المهمة: رواد فضاء يعيشون ويعملون بشكل مستمر',
        after: 'بعد المهمة: أكثر من 20 عامًا من البحث العلمي المستمر'
      },
      {
        id: 'tianhe',
        title: 'تيانجونج',
        year: '2021-حتى الآن',
        objective: 'محطة فضاء صينية',
        achievement: 'محطة فضاء صينية مستقلة',
        image: 'https://images-assets.nasa.gov/image/iss050e043303/iss050e043303~orig.jpg',
        before: 'قبل المهمة: برنامج فضاء صيني متنامي',
        during: 'أثناء المهمة: رواد فضاء صينيون يعيشون في الفضاء',
        after: 'بعد المهمة: تعزيز القدرات الفضائية الصينية'
      },
    ],
    outer: [
      {
        id: 'voyager',
        title: 'فوياجر 1 و 2',
        year: '1977',
        objective: 'استكشاف الكواكب الخارجية',
        achievement: 'أبعد جسم من صنع الإنسان عن الأرض',
        image: 'https://images-assets.nasa.gov/image/PIA01341/PIA01341~orig.jpg',
        before: 'قبل المهمة: معرفة محدودة بالكواكب الخارجية',
        during: 'أثناء المهمة: صور مذهلة للمشتري وزحل وأورانوس ونبتون',
        after: 'بعد المهمة: لا تزال ترسل بيانات من خارج النظام الشمسي'
      },
      {
        id: 'new-horizons',
        title: 'نيو هورايزونز',
        year: '2015',
        objective: 'استكشاف بلوتو وحزام كويبر',
        achievement: 'أول زيارة لبلوتو',
        image: 'https://images-assets.nasa.gov/image/PIA19952/PIA19952~orig.jpg',
        before: 'قبل المهمة: بلوتو كان مجرد نقطة ضبابية',
        during: 'أثناء المهمة: صور عالية الدقة لبلوتو وأقماره',
        after: 'بعد المهمة: كشف أسرار الكوكب القزم'
      },
    ],
  }

  const tabs = [
    { id: 'race', label: 'سباق الفضاء' },
    { id: 'moon', label: 'هبوط القمر' },
    { id: 'mars', label: 'المريخ' },
    { id: 'stations', label: 'محطات فضاء' },
    { id: 'outer', label: 'استكشاف خارجي' },
  ]

  const currentMissions = missions[activeTab as keyof typeof missions] || []

  return (
    <div className="pt-20 relative min-h-screen">
      {/* Header */}
      <section className="py-12 px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient">
          المهمّات الفضائية
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          رحلة البشرية إلى النجوم
        </p>
      </section>

      {/* Tabs */}
      <section className="px-4 mb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3 border-b border-purple-500/30 pb-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg transition-all font-medium ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'glass border border-purple-500/30 text-gray-300 hover:bg-purple-500/20'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Missions Grid */}
      <section className="px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentMissions.map((mission) => (
              <div
                key={mission.id}
                className="glass rounded-2xl overflow-hidden border-2 border-purple-500/30 hover:border-purple-500/70 transition-all hover-lift cursor-pointer"
                onClick={() => setSelectedMission(mission.id)}
              >
                {/* Image */}
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={mission.image}
                    alt={mission.title}
                    fill
                    className="object-cover"
                    unoptimized={mission.image.startsWith('http')}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-space-dark via-transparent to-transparent" />
                  <div className="absolute top-4 right-4 glass rounded-lg px-3 py-1 border border-purple-500/30">
                    <span className="text-white font-bold">{mission.year}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{mission.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{mission.objective}</p>
                  
                  {/* Big Achievement */}
                  <div className="glass rounded-lg p-4 border border-purple-500/20 mb-4">
                    <div className="text-xs text-purple-400 font-semibold mb-1">إنجاز كبير:</div>
                    <p className="text-white font-bold">{mission.achievement}</p>
                  </div>

                  <button className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white font-medium hover:from-purple-700 hover:to-blue-700 transition-all">
                    التفاصيل →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Detail Modal */}
      {selectedMission && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedMission(null)}
        >
          <div 
            className="glass rounded-2xl p-8 max-w-3xl w-full border border-purple-500/30 shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const mission = currentMissions.find(m => m.id === selectedMission)
              if (!mission) return null
              
              return (
                <>
                  <div className="relative h-64 w-full rounded-xl overflow-hidden mb-6">
                    <Image
                      src={mission.image}
                      alt={mission.title}
                      fill
                      className="object-cover"
                      unoptimized={mission.image.startsWith('http')}
                    />
                  </div>
                  
                  <h2 className="text-4xl font-bold text-white mb-2">{mission.title}</h2>
                  <p className="text-2xl text-purple-400 mb-6">{mission.year}</p>
                  
                  <div className="space-y-6 mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">قبل المهمة:</h3>
                      <p className="text-gray-300">{mission.before}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">أثناء المهمة:</h3>
                      <p className="text-gray-300">{mission.during}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">بعد المهمة:</h3>
                      <p className="text-gray-300">{mission.after}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setSelectedMission(null)}
                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-bold hover:from-purple-700 hover:to-blue-700 transition-all"
                  >
                    إغلاق
                  </button>
                </>
              )
            })()}
          </div>
        </div>
      )}
    </div>
  )
}
