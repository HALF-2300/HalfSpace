'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import TwinSigil from '@/components/TwinSigil'
import HeroOverlay from '@/components/HeroOverlay'
import HeroCinematicOverlay from '@/components/HeroCinematicOverlay'
import Starfield from '@/components/Starfield'
import SectionSeparator from '@/components/SectionSeparator'
import ExploreStats from '@/components/ExploreStats'
import { preloadHeroImage, shouldLazyLoad, getImageSizes } from '@/utils/perf'
import { getButtonAriaLabel } from '@/utils/aria'

export default function HomeAr() {
  const [factModal, setFactModal] = useState(false)
  const [currentFact, setCurrentFact] = useState('')
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    // Preload hero image
    preloadHeroImage('https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000136/GSFC_20171208_Archive_e000136~orig.jpg')

    const handleScroll = () => {
      const currentScroll = window.scrollY
      // Only apply parallax within hero section (first 100vh)
      if (currentScroll < window.innerHeight) {
        setScrollY(currentScroll)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const facts = [
    'يوم على الزهرة أطول من سنته! الزهرة تدور ببطء شديد بحيث تستغرق 243 يومًا أرضيًا لإكمال دورة واحدة، لكنها تحتاج فقط 225 يومًا للدوران حول الشمس.',
    'هناك نجوم في الكون أكثر من حبات الرمل على جميع شواطئ الأرض. يقدر علماء الفلك وجود 100 مليار مجرة، كل واحدة تحتوي على مليارات النجوم.',
    'إذا استطعت قيادة سيارة إلى الشمس بسرعة الطريق السريع (60 ميل/ساعة)، سيستغرق الأمر أكثر من 177 عامًا للوصول. لكن الضوء يقوم بالرحلة في 8 دقائق فقط!',
    'البقعة الحمراء العظيمة على المشتري هي عاصفة أكبر من الأرض وقد استمرت لمدة 400 عام على الأقل.',
    'ملعقة صغيرة من مادة نجم نيوتروني ستزن 6 مليارات طن على الأرض - هذا ثقيل مثل جبل إفرست!',
    'محطة الفضاء الدولية تسافر بسرعة 17,500 ميل/ساعة، وتكمل دورة حول الأرض كل 90 دقيقة. رواد الفضاء يشاهدون 16 شروقًا وغروبًا كل يوم!',
  ]

  const quickTiles = [
    {
      title: 'كوكب اليوم',
      icon: '🪐',
      content: 'المريخ',
      description: 'الكوكب الأحمر',
      href: '/solar-system#mars',
      color: 'from-red-500 to-orange-500'
    },
    {
      title: 'مهمة اليوم',
      icon: '🚀',
      content: 'أبولو 11',
      description: 'هبوط القمر 1969',
      href: '/missions#apollo11',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'صورة اليوم',
      icon: '📸',
      content: 'Pale Blue Dot',
      description: 'الأرض من بعيد',
      href: '/historic-images#pale-blue-dot',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'مصطلح اليوم',
      icon: '📖',
      content: 'النجم النيوتروني',
      description: 'نجم فائق الكثافة',
      href: '/glossary#neutron-star',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      title: 'أسطورة اليوم',
      icon: '✨',
      content: 'الثقوب السوداء تبتلع كل شيء',
      description: 'الحقيقة مختلفة',
      href: '/myths-vs-facts#black-holes',
      color: 'from-gray-600 to-gray-800'
    },
    {
      title: 'اختبار سريع',
      icon: '🎯',
      content: '3 أسئلة',
      description: 'اختبر معلوماتك',
      href: '/quizzes?type=quick',
      color: 'from-yellow-500 to-orange-500'
    },
  ]

  const timelineEvents = [
    { year: '1957', event: 'إطلاق سبوتنيك 1 - أول قمر صناعي' },
    { year: '1961', event: 'يوري جاجارين - أول إنسان في الفضاء' },
    { year: '1969', event: 'أبولو 11 - أول هبوط على القمر' },
    { year: '1990', event: 'إطلاق تلسكوب هابل الفضائي' },
    { year: '1998', event: 'بدء بناء محطة الفضاء الدولية' },
    { year: '2012', event: 'كوريوسيتي - هبوط على المريخ' },
    { year: '2021', event: 'إطلاق تلسكوب جيمس ويب' },
    { year: '2024', event: 'أرتميس - العودة للقمر' },
  ]

  const featuredPages = [
    {
      title: 'المجموعة الشمسية',
      description: 'استكشف كواكبنا الثمانية',
      image: 'https://images-assets.nasa.gov/image/PIA01341/PIA01341~orig.jpg',
      href: '/solar-system',
      icon: '🪐'
    },
    {
      title: 'المهمّات الفضائية',
      description: 'رحلة البشرية إلى النجوم',
      image: 'https://images-assets.nasa.gov/image/iss050e043303/iss050e043303~orig.jpg',
      href: '/missions',
      icon: '🚀'
    },
    {
      title: 'صور تاريخية',
      description: 'صور غيّرت التاريخ',
      image: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000136/GSFC_20171208_Archive_e000136~orig.jpg',
      href: '/historic-images',
      icon: '📸'
    },
    {
      title: 'التلسكوبات',
      description: 'نوافذنا على الكون',
      image: 'https://images-assets.nasa.gov/image/webbfirstimages_001_gsfc_20220711_archive_e001435/webbfirstimages_001_gsfc_20220711_archive_e001435~orig.jpg',
      href: '/telescopes',
      icon: '🔭'
    },
    {
      title: 'القاموس',
      description: 'معاني المصطلحات',
      image: 'https://images-assets.nasa.gov/image/PIA03149/PIA03149~orig.jpg',
      href: '/glossary',
      icon: '📖'
    },
    {
      title: 'الاختبارات',
      description: 'اختبر معلوماتك',
      image: 'https://images-assets.nasa.gov/image/PIA04591/PIA04591~orig.jpg',
      href: '/quizzes',
      icon: '🎯'
    },
  ]

  const showRandomFact = () => {
    const randomFact = facts[Math.floor(Math.random() * facts.length)]
    setCurrentFact(randomFact)
    setFactModal(true)
  }

  return (
    <div className="pt-20 relative" id="main-content">
      <div style={{ position: 'absolute', top: 18, left: 18, zIndex: 2, opacity: 0.95 }}>
        <TwinSigil />
      </div>
      {/* Hero Section - Cinematic with High-Res Image */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden portal gateway-entrance">
        <div className="absolute inset-0">
          {/* High-resolution hero image with subtle parallax */}
          <div 
            className="absolute inset-0"
            style={{
              transform: `translateY(${scrollY * 0.3}px) scale(${Math.min(1 + scrollY * 0.00005, 1.05)})`,
              transition: 'transform 0.1s ease-out',
            }}
          >
            <Image
              src="https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000136/GSFC_20171208_Archive_e000136~orig.jpg"
              alt="الكون السحيق"
              fill
              className="object-cover scale-110 animate-ken-burns space-image-zoom space-hero-container text-over-image"
              priority
              quality={95}
              sizes="100vw"
              unoptimized={true}
            />
          </div>
          
          {/* Multi-layer gradients for depth - same as PageTemplate */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-space-dark/95 to-space-dark" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-transparent to-blue-500/30" />
          <div className="absolute inset-0 bg-gradient-radial from-purple-500/10 via-transparent to-transparent" />
          
          {/* Starry fog overlay - cinematic effect */}
          <div className="absolute inset-0 opacity-40">
            {[...Array(300)].map((_, i) => (
              <div
                key={i}
                className="absolute star"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 2 + 0.5}px`,
                  height: `${Math.random() * 2 + 0.5}px`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${Math.random() * 4 + 3}s`,
                }}
              >
                <div className="w-full h-full bg-white rounded-full animate-twinkle" />
              </div>
            ))}
          </div>
          
          {/* Animated light rays - same as PageTemplate */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
          </div>
          <HeroOverlay intensity="medium" />
          <HeroCinematicOverlay intensity="medium" />
          <Starfield intensity="light" />
        </div>
        
        {/* Portal Effect Overlay */}
        <div className="absolute inset-0 portal-ring" />
        
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-gradient portal-title space-heading-glow space-aurora-bg text-over-image">
            هنا تبدأ رحلتك خارج الأرض
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 font-light max-w-3xl mx-auto leading-relaxed text-over-image">
            موسوعة فضاء عربية — صور، مهمّات، كواكب، ومعاني المصطلحات.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/galaxy-map"
              className="px-10 py-5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-bold text-lg hover:from-purple-700 hover:to-blue-700 transform hover:scale-110 transition-all shadow-2xl glow-purple cinema-button-hover space-button-glow"
              aria-label={getButtonAriaLabel('galaxy-map')}
            >
              ابدأ من الخريطة
            </Link>
            <button
              onClick={showRandomFact}
              className="px-10 py-5 glass border-2 border-purple-500 rounded-xl text-white font-bold text-lg hover:bg-purple-500/20 transform hover:scale-110 transition-all"
              aria-label={getButtonAriaLabel('random-fact')}
            >
              اعطني حقيقة الآن
            </button>
          </div>
        </div>
      </section>

      {/* Explore Stats */}
      <SectionSeparator variant="gradient" className="my-8" />
      <section className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient relative space-aurora-bg">
              <span className="relative z-10">إحصائيات الاستكشاف</span>
            </h2>
            <p className="text-gray-400 text-lg">اكتشف ما ينتظرك</p>
          </div>
          <ExploreStats totalPages={60} />
        </div>
      </section>

      {/* Quick Tiles Section - Unified Styling */}
      <SectionSeparator variant="gradient" className="my-8" />
      <section className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gradient">
            بطاقات سريعة
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {quickTiles.map((tile, index) => (
              <Link
                key={index}
                href={tile.href}
                className="group relative glass rounded-3xl p-6 border-2 border-purple-500/30 hover:border-purple-500/70 transition-all hover-lift glow-purple overflow-hidden cinema-card-hover space-card-lift"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${tile.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                <div className="relative z-10">
                  <div className="text-5xl mb-4">{tile.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{tile.title}</h3>
                  <p className="text-2xl font-semibold text-gradient mb-1">{tile.content}</p>
                  <p className="text-gray-400 text-sm">{tile.description}</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-transparent to-blue-500/0 group-hover:from-purple-500/10 group-hover:to-blue-500/10 transition-all pointer-events-none" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <SectionSeparator variant="gradient" className="my-8" />
      <section className="py-20 px-4 bg-space-deep/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gradient">
            شريط زمني مختصر
          </h2>
          <div className="space-y-4">
            {timelineEvents.slice(0, 8).map((event, index) => (
              <div
                key={index}
                className="glass rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/50 transition-all"
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-gradient min-w-[80px]">{event.year}</span>
                  <span className="text-gray-300 text-lg">{event.event}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/timeline"
              className="px-6 py-3 glass border border-purple-500/30 rounded-xl text-white hover:bg-purple-500/20 transition-all inline-block"
            >
              شوف الكل →
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Pages - Unified Styling with PageTemplate */}
      <SectionSeparator variant="gradient" className="my-8" />
      <section className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gradient">
            أكثر الصفحات زيارة
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPages.map((page, index) => (
              <Link
                key={index}
                href={page.href}
                className="group relative overflow-hidden rounded-3xl border-2 border-purple-500/30 hover:border-purple-500/70 transition-all hover-lift glow-purple cinema-card-hover space-card-lift"
              >
                <div className="relative h-[500px] w-full overflow-hidden">
                  {/* Gradient overlay for depth - same as PageTemplate */}
                  <div className="absolute inset-0 bg-gradient-to-t from-space-dark/50 to-transparent z-10" />
                  <Image
                    src={page.image}
                    alt={page.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-1000"
                    unoptimized={page.image.startsWith('http')}
                    quality={90}
                    sizes={getImageSizes({ mobile: 100, tablet: 50, desktop: 33 })}
                    loading="lazy"
                  />
                  {/* Color grading overlay - same as PageTemplate */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-transparent to-blue-500/0 group-hover:from-purple-500/20 group-hover:to-blue-500/20 transition-all duration-700 z-20" />
                  <div className="absolute top-4 right-4 text-6xl opacity-80 group-hover:scale-125 transition-transform z-30">
                    {page.icon}
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-space-dark via-space-dark/90 to-transparent z-30">
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all">
                    {page.title}
                  </h3>
                  <p className="text-gray-300">{page.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Fact Modal */}
      {factModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setFactModal(false)}
        >
          <div 
            className="glass rounded-2xl p-8 max-w-2xl w-full border border-purple-500/30 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <span className="text-6xl mb-4 block">✨</span>
              <h3 className="text-3xl font-bold text-gradient mb-4">حقيقة فورية</h3>
            </div>
            <p className="text-xl text-gray-300 mb-6 leading-relaxed text-center">
              {currentFact}
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={showRandomFact}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-bold hover:from-purple-700 hover:to-blue-700 transition-all"
              >
                حقيقة جديدة
              </button>
              <button
                onClick={() => setFactModal(false)}
                className="px-6 py-3 glass border border-purple-500/30 rounded-xl text-white hover:bg-purple-500/20 transition-all"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
