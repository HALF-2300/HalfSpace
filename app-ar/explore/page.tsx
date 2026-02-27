import React from 'react'
import Link from 'next/link'
import SimplePageLayout from '@/components/SimplePageLayout'

export const metadata = {
  title: 'استكشف الفضاء: دليل المعلومات الشامل | بوابة الفضاء',
  description: 'دليل شامل لكل ما يتعلق بالفضاء — الاكتشافات، النجوم البعيدة، البحث عن الحياة، الظواهر الكونية، والمزيد.',
}

const spaceTopicsAr = [
  {
    category: 'البحث عن الحياة',
    icon: '🔬',
    color: 'from-green-900/30 to-blue-900/30',
    borderColor: 'border-green-500/20',
    topics: [
      { name: 'علم الأحياء الفلكي', url: '/astrobiology', icon: '🦠', description: 'البحث عن الحياة خارج الأرض' },
      { name: 'الكواكب الخارجية', url: '/exoplanets', icon: '🪐', description: 'أكثر من 5,000 كوكب حول نجوم بعيدة' },
      { name: 'عوالم قابلة للحياة', url: '/exoplanets#habitable', icon: '🌍', description: 'كواكب قد تحتضن الحياة' },
      { name: 'المتحملات القصوى', url: '/astrobiology#extremophiles', icon: '🦠', description: 'الحياة في ظروف قاسية' },
    ],
  },
  {
    category: 'النجوم والأجرام النجمية',
    icon: '✨',
    color: 'from-yellow-900/30 to-orange-900/30',
    borderColor: 'border-yellow-500/20',
    topics: [
      { name: 'النجوم البعيدة', url: '/distant-stars', icon: '⭐', description: 'من أقرب الجيران إلى منارات الكون' },
      { name: 'أنواع النجوم', url: '/stars', icon: '💫', description: 'من الأقزام الحمراء إلى العمالقة' },
      { name: 'المدارس النجمية', url: '/nebulae', icon: '🌫️', description: 'حيث تولد النجوم' },
      { name: 'المستعرات العظمى', url: '/supernovae', icon: '💥', description: 'الموت النجمي الانفجاري' },
      { name: 'النجوم النيوترونية والنجوم النابضة', url: '/pulsars', icon: '📡', description: 'بقايا نجمية فائقة الكثافة' },
      { name: 'الأقزام البيضاء', url: '/white-dwarfs', icon: '⚪', description: 'المراحل النهائية للنجوم' },
    ],
  },
  {
    category: 'الظواهر الكونية',
    icon: '💫',
    color: 'from-purple-900/30 to-pink-900/30',
    borderColor: 'border-purple-500/20',
    topics: [
      { name: 'الثقوب السوداء', url: '/black-holes', icon: '⚫', description: 'حيث تحكم الجاذبية' },
      { name: 'الموجات الثقالية', url: '/gravitational-waves', icon: '〰️', description: 'تموجات في الزمكان' },
      { name: 'المادة والطاقة المظلمتين', url: '/dark-matter', icon: '🌑', description: 'مكونات الكون الخفية' },
      { name: 'السدم', url: '/nebulae', icon: '🌫️', description: 'سحب كونية رائعة' },
      { name: 'الكوازارات', url: '/quasars', icon: '✨', description: 'ألمع الأجرام في الكون' },
    ],
  },
  {
    category: 'نظامنا الشمسي',
    icon: '☀️',
    color: 'from-blue-900/30 to-cyan-900/30',
    borderColor: 'border-blue-500/20',
    topics: [
      { name: 'نظرة عامة على النظام الشمسي', url: '/solar-system', icon: '🪐', description: 'جوارنا الكوني' },
      { name: 'الكواكب', url: '/planets', icon: '🌍', description: 'ثمانية عوالم، عجائب لا نهائية' },
      { name: 'الكويكبات والمذنبات', url: '/asteroids', icon: '☄️', description: 'أجسام صغيرة، أهمية كبيرة' },
      { name: 'الشمس', url: '/sun', icon: '☀️', description: 'نجمنا ومنبع الحياة' },
      { name: 'طقس الفضاء', url: '/space-weather', icon: '🌤️', description: 'العواصف الشمسية وتأثيراتها' },
    ],
  },
  {
    category: 'علم الكونيات والكون',
    icon: '🌌',
    color: 'from-indigo-900/30 to-purple-900/30',
    borderColor: 'border-indigo-500/20',
    topics: [
      { name: 'علم الكونيات', url: '/cosmology', icon: '🌐', description: 'نشأة الكون ومصيره' },
      { name: 'الانفجار العظيم', url: '/big-bang', icon: '💥', description: 'كيف بدأ كل شيء' },
      { name: 'بنية الكون', url: '/universe-structure', icon: '🕸️', description: 'الشبكة الكونية' },
      { name: 'الكون المتعدد', url: '/multiverse', icon: '🎭', description: 'ما وراء كوننا' },
      { name: 'النسبية', url: '/relativity', icon: '⚛️', description: 'زمكان أينشتاين' },
    ],
  },
  {
    category: 'استكشاف الفضاء',
    icon: '🚀',
    color: 'from-red-900/30 to-orange-900/30',
    borderColor: 'border-red-500/20',
    topics: [
      { name: 'تاريخ استكشاف الفضاء', url: '/space-history', icon: '📜', description: 'من سبوتنيك إلى المريخ' },
      { name: 'المهمات', url: '/missions', icon: '🚀', description: 'أعظم المهمات الفضائية' },
      { name: 'محطات الفضاء', url: '/space-stations', icon: '🛰️', description: 'مختبرات مدارية' },
      { name: 'التلسكوبات', url: '/telescopes', icon: '🔭', description: 'نوافذنا على الكون' },
      { name: 'مهمات المستقبل', url: '/future-missions', icon: '🛸', description: 'ما الذي ينتظرنا' },
    ],
  },
  {
    category: 'المجرات وما وراءها',
    icon: '🌌',
    color: 'from-pink-900/30 to-purple-900/30',
    borderColor: 'border-pink-500/20',
    topics: [
      { name: 'المجرات', url: '/galaxies', icon: '🌌', description: 'جزر من النجوم' },
      { name: 'درب التبانة', url: '/galaxy-map', icon: '🌀', description: 'مجرتنا الأم' },
      { name: 'الفضاء بين النجمي', url: '/interstellar-medium', icon: '🌌', description: 'ما بين النجوم' },
    ],
  },
]

export default function ExplorePageAr() {
  return (
    <SimplePageLayout
      title="استكشف الفضاء: دليل المعلومات الشامل"
      subtitle="كل ما تحتاج معرفته عن الكون — من نظامنا الشمسي إلى حافة الكون المرئي"
    >
      <div className="space-y-12">
        <section className="text-center bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-lg p-8 border border-blue-500/20">
          <div className="text-6xl mb-4">🌌</div>
          <h2 className="text-3xl font-bold mb-4">موسوعة الفضاء بين يديك</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            انغمس في أعماق الكون مع معلومات شاملة عن الاكتشافات والنجوم البعيدة والبحث عن الحياة
            والظواهر الكونية واستكشاف الفضاء وما بينها. من كواكب قد تكون قابلة للحياة إلى أسرار الثقوب السوداء،
            ومن أقرب النجوم إلينا إلى حافة الكون المرئي.
          </p>
        </section>

        <section>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-lg p-6 border border-blue-500/20 text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">5,000+</div>
              <div className="text-gray-400">كواكب خارجية مكتشفة</div>
            </div>
            <div className="bg-gradient-to-br from-green-900/30 to-teal-900/30 backdrop-blur-sm rounded-lg p-6 border border-green-500/20 text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">200+</div>
              <div className="text-gray-400">قمر في النظام الشمسي</div>
            </div>
            <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 backdrop-blur-sm rounded-lg p-6 border border-orange-500/20 text-center">
              <div className="text-4xl font-bold text-orange-400 mb-2">13.8 مليار</div>
              <div className="text-gray-400">عمر الكون بالسنين</div>
            </div>
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20 text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">2 تريليون</div>
              <div className="text-gray-400">مجرة</div>
            </div>
          </div>
        </section>

        {spaceTopicsAr.map((section, index) => (
          <section key={index}>
            <div className={`bg-gradient-to-r ${section.color} backdrop-blur-sm rounded-lg p-6 border ${section.borderColor} mb-6`}>
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <span className="text-4xl">{section.icon}</span>
                <span>{section.category}</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.topics.map((topic, topicIndex) => (
                <Link
                  key={topicIndex}
                  href={topic.url}
                  className="group bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all hover:scale-105"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{topic.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-2">
                        {topic.name}
                      </h3>
                      <p className="text-sm text-gray-400">{topic.description}</p>
                    </div>
                    <div className="text-white/50 group-hover:text-white transition-colors">←</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}

        <section>
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <span>🌟</span>
            <span>مواضيع لا بد من قراءتها</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link
              href="/astrobiology"
              className="group bg-gradient-to-br from-green-900/30 to-blue-900/30 backdrop-blur-sm rounded-lg p-8 border border-green-500/20 hover:border-green-500/40 transition-all"
            >
              <div className="text-5xl mb-4">🦠</div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-green-400 transition-colors">
                هل نحن وحدنا؟
              </h3>
              <p className="text-gray-300">
                استكشف البحث عن الحياة خارج الأرض — من الميكروبات على المريخ إلى حضارات ذكية في أنظمة نجمية بعيدة.
                تعرف على المؤشرات الحيوية والمتحملات القصوى ومعادلة دريك.
              </p>
            </Link>

            <Link
              href="/exoplanets"
              className="group bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-lg p-8 border border-blue-500/20 hover:border-blue-500/40 transition-all"
            >
              <div className="text-5xl mb-4">🪐</div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-400 transition-colors">
                عوالم وراء نظامنا الشمسي
              </h3>
              <p className="text-gray-300">
                اكتشف أكثر من 5,000 كوكب خارجي منها عوالم قد تكون قابلة للحياة مثل بروكسيما b و TRAPPIST-1e،
                وكواكب غريبة حيث تمطر زجاجاً أو أحجاراً كريمة.
              </p>
            </Link>

            <Link
              href="/distant-stars"
              className="group bg-gradient-to-br from-yellow-900/30 to-orange-900/30 backdrop-blur-sm rounded-lg p-8 border border-yellow-500/20 hover:border-yellow-500/40 transition-all"
            >
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-yellow-400 transition-colors">
                من أقرب النجوم إلى عمالقة الكون
              </h3>
              <p className="text-gray-300">
                رحلة من بروكسيما سنتوري (4.2 سنة ضوئية) إلى ألمع وأضخم وأقدم النجوم في الكون.
                تعرف على منكب الجوزاء و VY Canis Majoris والمزيد.
              </p>
            </Link>

            <Link
              href="/black-holes"
              className="group bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-lg p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all"
            >
              <div className="text-5xl mb-4">💫</div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-purple-400 transition-colors">
                أقصى أحداث الكون
              </h3>
              <p className="text-gray-300">
                انفجارات أشعة غاما ألمع من مجرات كاملة، انفجارات راديوية سريعة غامضة، موجات ثقالية من ثقوب سوداء متصادمة، والمزيد من التطرف الكوني.
              </p>
            </Link>
          </div>
        </section>

        <section className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-lg p-8 border border-blue-500/20 text-center">
          <h2 className="text-3xl font-bold mb-4">ابدأ رحلتك الكونية</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-6">
            سواء كنت مهتماً بالحياة على عوالم أخرى، أو مفتوناً بالثقوب السوداء، أو تتساءل عن نشأة الكون ومصيره —
            لدينا معلومات شاملة ومحدّثة عن كل موضوع فضائي.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/astrobiology"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              البحث عن الحياة
            </Link>
            <Link
              href="/exoplanets"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              استكشف الكواكب الخارجية
            </Link>
            <Link
              href="/distant-stars"
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              اكتشف النجوم
            </Link>
            <Link
              href="/cosmology"
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              أصول الكون
            </Link>
          </div>
        </section>
      </div>
    </SimplePageLayout>
  )
}
