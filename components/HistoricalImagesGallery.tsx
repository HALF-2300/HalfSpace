'use client'

import { useState } from 'react'
import Image from 'next/image'

interface HistoricalImage {
  id: string
  title: string
  titleAr: string
  year: number
  mission: string
  description: string
  descriptionAr: string
  whyImportant: string
  whyImportantAr: string
  image: string
  imageAlt: string
}

const historicalImages: HistoricalImage[] = [
  {
    id: 'earthrise',
    title: 'Earthrise',
    titleAr: 'شروق الأرض',
    year: 1968,
    mission: 'Apollo 8',
    description: 'The first color photograph of Earth rising over the Moon',
    descriptionAr: 'أول صورة ملونة للأرض تشرق من خلف القمر',
    whyImportant: 'Changed humanity\'s perspective - we saw our home as a fragile blue marble',
    whyImportantAr: 'غيّرت منظور البشرية - رأينا كوكبنا ككرة زرقاء هشة',
    image: 'https://images-assets.nasa.gov/image/AS08-14-2383/AS08-14-2383~orig.jpg',
    imageAlt: 'Earthrise from Apollo 8'
  },
  {
    id: 'blue-marble',
    title: 'Blue Marble',
    titleAr: 'الرخام الأزرق',
    year: 1972,
    mission: 'Apollo 17',
    description: 'The most famous photograph of Earth - fully illuminated',
    descriptionAr: 'أشهر صورة للأرض - مضاءة بالكامل',
    whyImportant: 'Became an icon of environmentalism and global unity',
    whyImportantAr: 'أصبحت أيقونة للبيئية والوحدة العالمية',
    image: 'https://images-assets.nasa.gov/image/AS17-148-22727/AS17-148-22727~orig.jpg',
    imageAlt: 'Blue Marble Earth'
  },
  {
    id: 'pale-blue-dot',
    title: 'Pale Blue Dot',
    titleAr: 'النقطة الزرقاء الباهتة',
    year: 1990,
    mission: 'Voyager 1',
    description: 'Earth seen from 6 billion kilometers away - a tiny speck',
    descriptionAr: 'الأرض من مسافة 6 مليارات كيلومتر - نقطة صغيرة',
    whyImportant: 'Carl Sagan\'s reflection on our place in the cosmos',
    whyImportantAr: 'تأمل كارل ساجان عن مكاننا في الكون',
    image: 'https://images-assets.nasa.gov/image/PIA00452/PIA00452~orig.jpg',
    imageAlt: 'Pale Blue Dot'
  },
  {
    id: 'black-hole',
    title: 'First Black Hole Image',
    titleAr: 'أول صورة لثقب أسود',
    year: 2019,
    mission: 'Event Horizon Telescope',
    description: 'The first direct image of a black hole\'s event horizon',
    descriptionAr: 'أول صورة مباشرة لأفق حدث ثقب أسود',
    whyImportant: 'Confirmed Einstein\'s theory and opened new era of black hole astronomy',
    whyImportantAr: 'أكدت نظرية أينشتاين وفتحت عصراً جديداً في فلك الثقوب السوداء',
    image: 'https://images-assets.nasa.gov/image/PIA23122/PIA23122~orig.jpg',
    imageAlt: 'First black hole image'
  },
  {
    id: 'hubble-deep-field',
    title: 'Hubble Deep Field',
    titleAr: 'حقل هابل العميق',
    year: 1995,
    mission: 'Hubble Space Telescope',
    description: 'Thousands of galaxies in a tiny patch of sky',
    descriptionAr: 'آلاف المجرات في رقعة صغيرة من السماء',
    whyImportant: 'Revealed the vastness of the universe and billions of galaxies',
    whyImportantAr: 'كشفت عن ضخامة الكون ومليارات المجرات',
    image: 'https://images-assets.nasa.gov/image/STScI-1996-01a/STScI-1996-01a~orig.jpg',
    imageAlt: 'Hubble Deep Field'
  },
  {
    id: 'pillars-of-creation',
    title: 'Pillars of Creation',
    titleAr: 'أعمدة الخلق',
    year: 1995,
    mission: 'Hubble Space Telescope',
    description: 'Iconic image of star-forming region in Eagle Nebula',
    descriptionAr: 'صورة أيقونية لمنطقة تشكيل النجوم في سديم النسر',
    whyImportant: 'Most famous space image - shows beauty of cosmic creation',
    whyImportantAr: 'أشهر صورة فضائية - تظهر جمال الخلق الكوني',
    image: 'https://images-assets.nasa.gov/image/STScI-1995-44a/STScI-1995-44a~orig.jpg',
    imageAlt: 'Pillars of Creation'
  },
  {
    id: 'jwst-first',
    title: 'JWST First Deep Field',
    titleAr: 'أول حقل عميق لجيمس ويب',
    year: 2022,
    mission: 'James Webb Space Telescope',
    description: 'Deepest and sharpest infrared image of the universe',
    descriptionAr: 'أعمق وأوضح صورة تحت حمراء للكون',
    whyImportant: 'Revealed galaxies from 13 billion years ago - near the Big Bang',
    whyImportantAr: 'كشفت مجرات من 13 مليار سنة - قرب الانفجار العظيم',
    image: 'https://images-assets.nasa.gov/image/weic2208a/weic2208a~orig.jpg',
    imageAlt: 'JWST First Deep Field'
  },
  {
    id: 'mars-rover',
    title: 'Mars Selfie',
    titleAr: 'سيلفي من المريخ',
    year: 2021,
    mission: 'Perseverance Rover',
    description: 'First helicopter flight on another planet',
    descriptionAr: 'أول طيران مروحية على كوكب آخر',
    whyImportant: 'Proved powered flight possible on Mars - new exploration era',
    whyImportantAr: 'أثبتت إمكانية الطيران على المريخ - عصر استكشاف جديد',
    image: 'https://images-assets.nasa.gov/image/PIA24428/PIA24428~orig.jpg',
    imageAlt: 'Mars helicopter Ingenuity'
  }
]

export default function HistoricalImagesGallery() {
  const [selectedImage, setSelectedImage] = useState<HistoricalImage | null>(null)
  const [filterYear, setFilterYear] = useState<number | null>(null)

  const sortedImages = [...historicalImages].sort((a, b) => a.year - b.year)
  const filteredImages = filterYear 
    ? sortedImages.filter(img => img.year === filterYear)
    : sortedImages

  const years = Array.from(new Set(historicalImages.map(img => img.year))).sort()

  return (
    <div className="min-h-screen pt-20 px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-gradient portal-title">
            Images That Changed History
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            A timeline gallery of the most impactful space images in human history
          </p>
          
          {/* Year Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => setFilterYear(null)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filterYear === null
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'glass border border-purple-500/30 text-gray-300 hover:border-purple-500/50'
              }`}
            >
              All
            </button>
            {years.map(year => (
              <button
                key={year}
                onClick={() => setFilterYear(year)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filterYear === year
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'glass border border-purple-500/30 text-gray-300 hover:border-purple-500/50'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Gallery */}
        <div className="space-y-8">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              className="glass rounded-2xl p-6 border-2 border-purple-500/30 hover:border-purple-500/50 transition-all transform hover:scale-[1.02] cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <div className="grid md:grid-cols-3 gap-6 items-center">
                {/* Image */}
                <div className="relative h-64 rounded-xl overflow-hidden">
                  <img
                    src={image.image}
                    alt={image.imageAlt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-black/70 px-3 py-1 rounded-full text-white font-bold">
                    {image.year}
                  </div>
                </div>
                
                {/* Info */}
                <div className="md:col-span-2">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-3xl font-bold text-gradient">{image.title}</h3>
                    <span className="text-sm text-gray-400">({image.mission})</span>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="text-purple-400 font-semibold mb-1">What do we see?</div>
                      <p className="text-gray-300">{image.description}</p>
                    </div>
                    <div>
                      <div className="text-purple-400 font-semibold mb-1">Why is it important?</div>
                      <p className="text-gray-300">{image.whyImportant}</p>
                    </div>
                    <div>
                      <div className="text-purple-400 font-semibold mb-1">Year</div>
                      <p className="text-gray-300">{image.year}</p>
                    </div>
                  </div>
                  
                  <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white font-bold hover:from-purple-700 hover:to-blue-700 transition-all">
                    Learn more →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="glass rounded-3xl p-8 max-w-4xl w-full border-2 border-purple-500/50 animate-fade-in max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-4xl font-bold text-gradient">{selectedImage.title}</h2>
              <button
                onClick={() => setSelectedImage(null)}
                className="text-3xl text-gray-400 hover:text-white transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="relative h-96 rounded-xl overflow-hidden mb-6">
              <img
                src={selectedImage.image}
                alt={selectedImage.imageAlt}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-purple-400 font-semibold mb-2">What do we see?</div>
                <p className="text-gray-300">{selectedImage.description}</p>
              </div>
              <div>
                <div className="text-purple-400 font-semibold mb-2">Why is it important?</div>
                <p className="text-gray-300">{selectedImage.whyImportant}</p>
              </div>
              <div className="flex gap-4">
                <div>
                  <div className="text-purple-400 font-semibold mb-1">Year</div>
                  <p className="text-gray-300">{selectedImage.year}</p>
                </div>
                <div>
                  <div className="text-purple-400 font-semibold mb-1">Mission</div>
                  <p className="text-gray-300">{selectedImage.mission}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

