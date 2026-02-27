'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import CinematicViewer, { type GalleryImage } from '@/components/gallery/CinematicViewer'
import { enhanceImageSrc, getFallbackImage } from '@/utils/imageFallback'
import CanvasStarfield from '@/components/space/CanvasStarfield'
import '@/app/space/space-page.css'

// 36 Space images with categories
const galleryImages: GalleryImage[] = [
  // Planets & Solar System (12 images)
  {
    id: 'solar-system-1',
    url: 'https://images-assets.nasa.gov/image/PIA01341/PIA01341~orig.jpg',
    title: 'Solar System',
    description: 'Our cosmic neighborhood with all planets',
    category: 'Planet',
    related: ['solar-system', 'planets', 'sun']
  },
  {
    id: '2',
    url: 'https://images-assets.nasa.gov/image/PIA16853/PIA16853~orig.jpg',
    title: 'Mercury',
    description: 'The closest planet to the Sun',
    category: 'planets',
  },
  {
    id: '3',
    url: 'https://images-assets.nasa.gov/image/PIA00271/PIA00271~orig.jpg',
    title: 'Venus',
    description: 'The hottest planet in our solar system',
    category: 'planets',
  },
  {
    id: '4',
    url: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000263/GSFC_20171208_Archive_e000263~medium.jpg',
    title: 'Earth from Space',
    description: 'The Blue Planet as seen from space',
    category: 'planets',
  },
  {
    id: '5',
    url: 'https://images-assets.nasa.gov/image/PIA04591/PIA04591~orig.jpg',
    title: 'Mars',
    description: 'The Red Planet',
    category: 'planets',
  },
  {
    id: '6',
    url: 'https://images-assets.nasa.gov/image/PIA02873/PIA02873~orig.jpg',
    title: 'Jupiter',
    description: 'The largest gas giant',
    category: 'planets',
  },
  {
    id: '7',
    url: 'https://images-assets.nasa.gov/image/PIA06193/PIA06193~orig.jpg',
    title: 'Saturn',
    description: 'The Ringed Planet',
    category: 'planets',
  },
  {
    id: '8',
    url: 'https://images-assets.nasa.gov/image/PIA18182/PIA18182~orig.jpg',
    title: 'Uranus',
    description: 'The ice giant',
    category: 'planets',
  },
  {
    id: '9',
    url: 'https://images-assets.nasa.gov/image/PIA01492/PIA01492~orig.jpg',
    title: 'Neptune',
    description: 'The farthest planet from the Sun',
    category: 'planets',
  },
  {
    id: '10',
    url: 'https://images-assets.nasa.gov/image/PIA19952/PIA19952~orig.jpg',
    title: 'Pluto',
    description: 'The dwarf planet',
    category: 'planets',
  },
  {
    id: '11',
    url: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001135/GSFC_20171208_Archive_e001135~orig.jpg',
    title: 'The Moon',
    description: 'Earth\'s natural satellite',
    category: 'planets',
  },
  {
    id: '12',
    url: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001435/GSFC_20171208_Archive_e001435~orig.jpg',
    title: 'The Sun',
    description: 'Our star at the center of the solar system',
    category: 'planets',
  },
  // Nebulae & Star Formation (12 images)
  {
    id: '13',
    url: 'https://images-assets.nasa.gov/image/STScI-PRC2022-055a/STScI-PRC2022-055a~orig.jpg',
    title: 'Pillars of Creation',
    description: 'Hubble Space Telescope - Star-forming region in Eagle Nebula',
    category: 'nebulae',
  },
  {
    id: '14',
    url: 'https://images-assets.nasa.gov/image/STScI-PRC2022-056a/STScI-PRC2022-056a~orig.jpg',
    title: 'Orion Nebula',
    description: 'A stellar nursery visible to the naked eye',
    category: 'nebulae',
  },
  {
    id: '15',
    url: 'https://images-assets.nasa.gov/image/STScI-PRC2022-059a/STScI-PRC2022-059a~orig.jpg',
    title: 'Crab Nebula',
    description: 'Supernova remnant from 1054 AD',
    category: 'nebulae',
  },
  {
    id: '16',
    url: 'https://images-assets.nasa.gov/image/STScI-PRC2022-060a/STScI-PRC2022-060a~orig.jpg',
    title: 'Horsehead Nebula',
    description: 'Dark nebula in the constellation Orion',
    category: 'nebulae',
  },
  {
    id: '17',
    url: 'https://images-assets.nasa.gov/image/STScI-PRC2022-061a/STScI-PRC2022-061a~orig.jpg',
    title: 'Helix Nebula',
    description: 'The Eye of God - A planetary nebula',
    category: 'nebulae',
  },
  {
    id: '18',
    url: 'https://images-assets.nasa.gov/image/STScI-PRC2022-062a/STScI-PRC2022-062a~orig.jpg',
    title: 'Carina Nebula',
    description: 'Massive star-forming region',
    category: 'nebulae',
  },
  {
    id: '19',
    url: 'https://images-assets.nasa.gov/image/STScI-PRC2022-063a/STScI-PRC2022-063a~orig.jpg',
    title: 'Lagoon Nebula',
    description: 'Emission nebula in Sagittarius',
    category: 'nebulae',
  },
  {
    id: '20',
    url: 'https://images-assets.nasa.gov/image/STScI-PRC2022-064a/STScI-PRC2022-064a~orig.jpg',
    title: 'Trifid Nebula',
    description: 'Combination of emission and reflection nebula',
    category: 'nebulae',
  },
  {
    id: '21',
    url: 'https://images-assets.nasa.gov/image/STScI-PRC2022-065a/STScI-PRC2022-065a~orig.jpg',
    title: 'Eagle Nebula',
    description: 'Home of the Pillars of Creation',
    category: 'nebulae',
  },
  {
    id: '22',
    url: 'https://images-assets.nasa.gov/image/STScI-PRC2022-066a/STScI-PRC2022-066a~orig.jpg',
    title: 'Rosette Nebula',
    description: 'Star cluster surrounded by nebula',
    category: 'nebulae',
  },
  {
    id: '23',
    url: 'https://images-assets.nasa.gov/image/STScI-PRC2022-067a/STScI-PRC2022-067a~orig.jpg',
    title: 'Veil Nebula',
    description: 'Supernova remnant in Cygnus',
    category: 'nebulae',
  },
  {
    id: '24',
    url: 'https://images-assets.nasa.gov/image/STScI-PRC2022-068a/STScI-PRC2022-068a~orig.jpg',
    title: 'Ring Nebula',
    description: 'Planetary nebula in Lyra',
    category: 'nebulae',
  },
  // Galaxies (12 images)
  {
    id: '25',
    url: 'https://images-assets.nasa.gov/image/STScI-PRC2022-069a/STScI-PRC2022-069a~orig.jpg',
    title: 'Andromeda Galaxy',
    description: 'Our nearest major galactic neighbor',
    category: 'galaxies',
  },
  {
    id: '26',
    url: 'https://images-assets.nasa.gov/image/STScI-PRC2022-070a/STScI-PRC2022-070a~orig.jpg',
    title: 'Whirlpool Galaxy',
    description: 'Spiral galaxy in Canes Venatici',
    category: 'galaxies',
  },
  {
    id: '27',
    url: 'https://images-assets.nasa.gov/image/STScI-PRC2022-071a/STScI-PRC2022-071a~orig.jpg',
    title: 'Sombrero Galaxy',
    description: 'Edge-on spiral galaxy',
    category: 'galaxies',
  },
  {
    id: '28',
    url: 'https://images-assets.nasa.gov/image/STScI-PRC2022-072a/STScI-PRC2022-072a~orig.jpg',
    title: 'Hubble Ultra Deep Field',
    description: 'Deepest view of the universe',
    category: 'galaxies',
  },
  {
    id: '29',
    url: 'https://images-assets.nasa.gov/image/STScI-PRC2022-073a/STScI-PRC2022-073a~orig.jpg',
    title: 'Pinwheel Galaxy',
    description: 'Face-on spiral galaxy',
    category: 'galaxies',
  },
  {
    id: '30',
    url: 'https://images-assets.nasa.gov/image/STScI-PRC2022-074a/STScI-PRC2022-074a~orig.jpg',
    title: 'Triangulum Galaxy',
    description: 'Third largest galaxy in Local Group',
    category: 'galaxies',
  },
  {
    id: '31',
    url: 'https://images-assets.nasa.gov/image/STScI-PRC2022-075a/STScI-PRC2022-075a~orig.jpg',
    title: 'Black Eye Galaxy',
    description: 'Spiral galaxy with dark band',
    category: 'galaxies',
  },
  {
    id: '32',
    url: 'https://images-assets.nasa.gov/image/STScI-PRC2022-076a/STScI-PRC2022-076a~orig.jpg',
    title: 'Cartwheel Galaxy',
    description: 'Ring galaxy formed by collision',
    category: 'galaxies',
  },
  {
    id: '33',
    url: 'https://images-assets.nasa.gov/image/STScI-PRC2022-077a/STScI-PRC2022-077a~orig.jpg',
    title: 'Antennae Galaxies',
    description: 'Two colliding spiral galaxies',
    category: 'galaxies',
  },
  {
    id: '34',
    url: 'https://images-assets.nasa.gov/image/STScI-PRC2022-078a/STScI-PRC2022-078a~orig.jpg',
    title: 'Cigar Galaxy',
    description: 'Edge-on starburst galaxy',
    category: 'galaxies',
  },
  {
    id: '35',
    url: 'https://images-assets.nasa.gov/image/STScI-PRC2022-079a/STScI-PRC2022-079a~orig.jpg',
    title: 'Tadpole Galaxy',
    description: 'Distorted galaxy with long tail',
    category: 'galaxies',
  },
  {
    id: '36',
    url: 'https://images-assets.nasa.gov/image/STScI-PRC2022-080a/STScI-PRC2022-080a~orig.jpg',
    title: 'Milky Way',
    description: 'Our home galaxy',
    category: 'galaxies',
  },
]

const categories = [
  { id: 'all', label: 'All', labelAr: 'الكل' },
  { id: 'planets', label: 'Planets & Solar System', labelAr: 'الكواكب والنظام الشمسي' },
  { id: 'nebulae', label: 'Nebulae & Star Formation', labelAr: 'السدم وتكوين النجوم' },
  { id: 'galaxies', label: 'Galaxies', labelAr: 'المجرات' },
]

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  const filteredImages = selectedCategory === 'all'
    ? galleryImages
    : galleryImages.filter(img => img.category === selectedCategory)

  const openLightbox = (index: number) => {
    // Find the index in the full galleryImages array
    const image = filteredImages[index]
    const fullIndex = galleryImages.findIndex(img => img.id === image.id)
    setSelectedImage(fullIndex >= 0 ? fullIndex : index)
    setLightboxOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    document.body.style.overflow = 'unset'
  }

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % galleryImages.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
  }

  return (
    <div className="gallery-page min-h-screen relative overflow-hidden">
      {/* Background Canvas Starfield */}
      <CanvasStarfield intensity="high" />
      
      {/* Hero Section */}
      <section className="relative z-10 pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8 animate-fade-in">
            <Link
              href="/space"
              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-6 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>العودة إلى Space Portal</span>
            </Link>
            <h1 className="text-7xl md:text-9xl font-bold mb-6 text-gradient universe-title space-heading-glow">
              Space Gallery
            </h1>
            <p className="text-2xl md:text-3xl text-gray-200 font-light mb-4">
              معرض الصور الكونية
            </p>
            <div className="inline-block w-32 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="relative z-10 px-4 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-xl border-2 font-semibold transition-all transform hover:scale-105 ${
                  selectedCategory === category.id
                    ? 'border-purple-500 bg-purple-500/20 text-white glow-purple'
                    : 'border-purple-500/30 text-gray-300 hover:border-purple-500/50 hover:bg-purple-500/10'
                }`}
              >
                <span className="block">{category.label}</span>
                <span className="block text-sm opacity-75">{category.labelAr}</span>
              </button>
            ))}
          </div>
          <div className="text-center mt-6 text-gray-400">
            عرض {filteredImages.length} من {galleryImages.length} صورة
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="relative z-10 px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          {filteredImages.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🌌</div>
              <h3 className="text-2xl font-bold text-gradient mb-2">لا توجد صور</h3>
              <p className="text-gray-400">لم يتم العثور على صور في هذا التصنيف</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredImages.map((image, index) => (
                <div
                  key={image.id}
                  onClick={() => openLightbox(index)}
                  className="gallery-card group relative overflow-hidden rounded-2xl border-2 border-purple-500/30 hover:border-purple-500/70 transition-all cursor-pointer transform hover:scale-105 hover:z-10"
                  style={{ aspectRatio: '16/9' }}
                >
                  <div className="absolute inset-0">
                    <Image
                      src={
                        imageErrors[image.id]
                          ? getFallbackImage('gallery')
                          : enhanceImageSrc(image.url, 'card', getFallbackImage('gallery'))
                      }
                      alt={image.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      loading="lazy"
                      unoptimized
                        onError={() => {
                        setImageErrors(prev => ({ ...prev, [image.id]: true }))
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-space-dark via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform">
                    <h4 className="text-white font-bold text-lg mb-1">{image.title}</h4>
                    <p className="text-gray-300 text-sm">{image.description}</p>
                    <span className="inline-block mt-2 px-2 py-1 text-xs bg-purple-500/30 rounded text-purple-200">
                      {categories.find(c => c.id === image.category)?.label}
                    </span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="glass rounded-full p-4 border-2 border-purple-500/50">
                      <svg
                        className="w-8 h-8 text-purple-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Cinematic Viewer */}
      {lightboxOpen && (
        <CinematicViewer
          images={galleryImages}
          initialIndex={selectedImage}
          onClose={closeLightbox}
        />
      )}
    </div>
  )
}
