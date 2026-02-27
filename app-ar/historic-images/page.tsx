'use client'

import Image from 'next/image'

export default function HistoricImagesPage() {
  const images = [
    {
      id: 'pale-blue-dot',
      year: '1990',
      title: 'Pale Blue Dot',
      description: 'الأرض من مسافة 6 مليارات كيلومتر',
      image: 'https://images-assets.nasa.gov/image/PIA00452/PIA00452~orig.jpg',
      whatWeSee: 'نقطة زرقاء باهتة في الفضاء - كوكبنا الأرض',
      whyImportant: 'تذكير قوي بمدى صغر كوكبنا في الكون الشاسع',
      whatChanged: 'غيّر منظورنا عن مكاننا في الكون وأهمية حماية كوكبنا الوحيد'
    },
    {
      id: 'hubble-deep',
      year: '1995',
      title: 'Hubble Deep Field',
      description: 'أعمق صورة للكون على الإطلاق',
      image: 'https://images-assets.nasa.gov/image/PIA03149/PIA03149~orig.jpg',
      whatWeSee: 'آلاف المجرات في مساحة صغيرة من السماء',
      whyImportant: 'كشفت عن عدد المجرات الهائل في الكون',
      whatChanged: 'وسّعت فهمنا لحجم الكون وعدد المجرات'
    },
    {
      id: 'earthrise',
      year: '1968',
      title: 'Earthrise',
      description: 'شروق الأرض من القمر',
      image: 'https://images-assets.nasa.gov/image/AS08-14-2383/AS08-14-2383~orig.jpg',
      whatWeSee: 'الأرض تشرق من خلف القمر',
      whyImportant: 'أول مرة يرى البشر كوكبهم من الفضاء',
      whatChanged: 'ألهمت حركة حماية البيئة العالمية'
    },
    {
      id: 'black-hole',
      year: '2019',
      title: 'أول صورة لثقب أسود',
      description: 'ثقب أسود في مجرة M87',
      image: 'https://images-assets.nasa.gov/image/black-hole-image-nasa_gsfc_20190410_archive_e000190/black-hole-image-nasa_gsfc_20190410_archive_e000190~orig.jpg',
      whatWeSee: 'ظل الثقب الأسود محاطًا بضوء متوهج',
      whyImportant: 'أول دليل بصري مباشر على وجود الثقوب السوداء',
      whatChanged: 'أكدت نظرية أينشتاين للنسبية العامة'
    },
    {
      id: 'pillars',
      year: '1995',
      title: 'أعمدة الخلق',
      description: 'سديم النسر - أين تولد النجوم',
      image: 'https://images-assets.nasa.gov/image/PIA09178/PIA09178~orig.jpg',
      whatWeSee: 'أعمدة ضخمة من الغاز والغبار حيث تولد النجوم',
      whyImportant: 'كشفت عن عملية ولادة النجوم',
      whatChanged: 'ساعدت في فهم كيفية تشكل النجوم والأنظمة الكوكبية'
    },
    {
      id: 'apollo-footprint',
      year: '1969',
      title: 'خطوات على القمر',
      description: 'أول خطوات بشرية على القمر',
      image: 'https://images-assets.nasa.gov/image/AS11-40-5874/AS11-40-5874~orig.jpg',
      whatWeSee: 'حذاء رائد الفضاء على سطح القمر',
      whyImportant: 'إثبات أن البشر يمكنهم السفر إلى عوالم أخرى',
      whatChanged: 'فتحت عصر استكشاف الفضاء البشري'
    },
  ]

  return (
    <div className="pt-20 relative min-h-screen">
      {/* Header */}
      <section className="py-12 px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient">
          صور غيّرت التاريخ
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          صور غيرت فهمنا للكون
        </p>
      </section>

      {/* Timeline Gallery */}
      <section className="px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Timeline */}
          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-4">
              {[...new Set(images.map(img => img.year))].sort().map(year => (
                <div key={year} className="glass rounded-lg px-4 py-2 border border-purple-500/30">
                  <span className="text-white font-bold">{year}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Images Grid */}
          <div className="space-y-12">
            {images.map((img) => (
              <div
                key={img.id}
                className="glass rounded-3xl overflow-hidden border-2 border-purple-500/30 hover:border-purple-500/70 transition-all hover-lift"
              >
                {/* Image */}
                <div className="relative h-96 w-full overflow-hidden">
                  <Image
                    src={img.image}
                    alt={img.title}
                    fill
                    className="object-cover"
                    unoptimized={img.image.startsWith('http')}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-space-dark via-transparent to-transparent" />
                  <div className="absolute top-6 right-6 glass rounded-lg px-4 py-2 border border-purple-500/30">
                    <span className="text-white font-bold text-xl">{img.year}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <h3 className="text-3xl font-bold text-white mb-2">{img.title}</h3>
                  <p className="text-gray-400 text-lg mb-6">{img.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass rounded-lg p-4 border border-purple-500/20">
                      <div className="text-sm text-purple-400 font-semibold mb-2">وش نشوف؟</div>
                      <p className="text-gray-300">{img.whatWeSee}</p>
                    </div>
                    <div className="glass rounded-lg p-4 border border-purple-500/20">
                      <div className="text-sm text-purple-400 font-semibold mb-2">ليش مهمة؟</div>
                      <p className="text-gray-300">{img.whyImportant}</p>
                    </div>
                    <div className="glass rounded-lg p-4 border border-purple-500/20">
                      <div className="text-sm text-purple-400 font-semibold mb-2">وش تغيّر بعدها؟</div>
                      <p className="text-gray-300">{img.whatChanged}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

