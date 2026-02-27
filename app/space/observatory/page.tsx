'use client'

import { useState } from 'react'
import CanvasStarfield from '@/components/space/CanvasStarfield'
import ObservatoryGallery from '@/components/space/ObservatoryGallery'
import CompareView from '@/components/space/CompareView'
import '@/app/space/space-page.css'

export default function ObservatoryPage() {
  const [activeTelescope, setActiveTelescope] = useState<'hubble' | 'jwst' | 'kepler'>('hubble')

  const telescopes = {
    hubble: {
      name: 'Hubble Space Telescope',
      name_ar: 'تلسكوب هابل الفضائي',
      icon: '🛰️',
      description: 'Launched in 1990, Hubble has revolutionized our understanding of the universe. It observes in visible, ultraviolet, and near-infrared light, capturing stunning images of distant galaxies, nebulae, and cosmic phenomena.',
      description_ar: 'أُطلق في عام 1990، غيّر هابل فهمنا للكون. يرصد في الضوء المرئي والأشعة فوق البنفسجية والأشعة تحت الحمراء القريبة، ويصور مجرات بعيدة وسدم وظواهر كونية مذهلة.',
      facts: [
        'Over 1.5 million observations since launch',
        'Can see objects 13.4 billion light-years away',
        'Orbits Earth at 340 miles altitude',
        'Has been serviced 5 times by astronauts',
      ],
      facts_ar: [
        'أكثر من 1.5 مليون ملاحظة منذ الإطلاق',
        'يمكنه رؤية أجسام على بعد 13.4 مليار سنة ضوئية',
        'يدور حول الأرض على ارتفاع 340 ميلاً',
        'تم صيانته 5 مرات من قبل رواد الفضاء',
      ],
    },
    jwst: {
      name: 'James Webb Space Telescope',
      name_ar: 'تلسكوب جيمس ويب الفضائي',
      icon: '🔭',
      description: 'Launched in 2021, JWST is the most powerful space telescope ever built. It observes primarily in infrared light, allowing it to see through cosmic dust and observe the first galaxies that formed after the Big Bang.',
      description_ar: 'أُطلق في عام 2021، جيمس ويب هو أقوى تلسكوب فضائي تم بناؤه. يرصد بشكل أساسي في الأشعة تحت الحمراء، مما يسمح له برؤية ما وراء الغبار الكوني ومراقبة أول المجرات التي تشكلت بعد الانفجار العظيم.',
      facts: [
        '100 times more powerful than Hubble',
        'Can detect heat from a bumblebee on the Moon',
        'Located 1 million miles from Earth',
        'Primary mirror is 21 feet across',
      ],
      facts_ar: [
        'أقوى من هابل بـ 100 مرة',
        'يمكنه اكتشاف حرارة نحلة على القمر',
        'يقع على بعد مليون ميل من الأرض',
        'المرآة الأساسية بعرض 21 قدماً',
      ],
    },
    kepler: {
      name: 'Kepler Space Telescope',
      name_ar: 'تلسكوب كيبلر الفضائي',
      icon: '🪐',
      description: 'Launched in 2009, Kepler was designed to find Earth-like planets orbiting other stars. It discovered over 2,600 confirmed exoplanets by detecting tiny dips in starlight as planets passed in front of their host stars.',
      description_ar: 'أُطلق في عام 2009، صُمم كيبلر للعثور على كواكب شبيهة بالأرض تدور حول نجوم أخرى. اكتشف أكثر من 2600 كوكب خارجي مؤكد من خلال اكتشاف انخفاضات صغيرة في ضوء النجوم عندما تمر الكواكب أمام نجومها المضيفة.',
      facts: [
        'Discovered 2,600+ confirmed exoplanets',
        'Observed 150,000+ stars continuously',
        'Mission ended in 2018',
        'Revolutionized exoplanet science',
      ],
      facts_ar: [
        'اكتشف أكثر من 2600 كوكب خارجي مؤكد',
        'راقب أكثر من 150,000 نجم بشكل مستمر',
        'انتهت المهمة في عام 2018',
        'أحدث ثورة في علم الكواكب الخارجية',
      ],
    },
  }

  return (
    <div className="universe-portal min-h-screen relative overflow-hidden">
      {/* Background Canvas Starfield */}
      <CanvasStarfield intensity="high" />

      {/* Hero Section */}
      <section className="relative z-10 pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-7xl md:text-9xl font-bold mb-6 text-gradient universe-title space-heading-glow">
              المرصد
            </h1>
            <p className="text-2xl md:text-3xl text-gray-200 font-light mb-4">
              Observatory
            </p>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-4">
              مركز صور + تلسكوبات + شرح بصري
            </p>
            <div className="inline-block w-32 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
          </div>
        </div>
      </section>

      {/* Telescopes Section */}
      <section className="relative z-10 px-4 mb-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-bold mb-4 text-gradient space-heading-glow">
              Telescopes
            </h2>
            <p className="text-xl text-gray-300">Explore the instruments that reveal the cosmos</p>
          </div>

          {/* Telescope Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {(['hubble', 'jwst', 'kepler'] as const).map((telescope) => (
              <button
                key={telescope}
                onClick={() => setActiveTelescope(telescope)}
                className={`universe-tab glass px-8 py-4 rounded-xl border-2 font-bold text-lg transition-all transform hover:scale-105 ${
                  activeTelescope === telescope
                    ? 'border-purple-500 bg-purple-500/20 glow-purple'
                    : 'border-purple-500/30 hover:border-purple-500/50'
                }`}
              >
                <span className="text-2xl mr-2">{telescopes[telescope].icon}</span>
                <span>{telescopes[telescope].name}</span>
              </button>
            ))}
          </div>

          {/* Active Telescope Info */}
          <div className="universe-scene-container glass rounded-3xl border-2 border-purple-500/30 p-8 md:p-12">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{telescopes[activeTelescope].icon}</div>
              <h3 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
                {telescopes[activeTelescope].name}
              </h3>
              <p className="text-xl md:text-2xl text-gray-300 mb-6">
                {telescopes[activeTelescope].description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {telescopes[activeTelescope].facts.map((fact, index) => (
                <div
                  key={index}
                  className="glass p-4 rounded-xl border border-purple-500/30 hover:border-purple-500/60 transition-all"
                >
                  <p className="text-gray-200 text-lg">{fact}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What They See Section */}
      <section className="relative z-10 px-4 mb-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-bold mb-4 text-gradient space-heading-glow">
              What They See
            </h2>
            <p className="text-xl text-gray-300">Understanding different wavelengths of light</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Visible Light */}
            <div className="universe-scene-container glass rounded-3xl border-2 border-purple-500/30 p-8">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">👁️</div>
                <h3 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
                  Visible Light
                </h3>
              </div>
              <div className="space-y-4 text-gray-200 text-lg">
                <p>
                  <strong className="text-purple-400">What it is:</strong> The light our eyes can
                  see - colors of the rainbow from red to violet.
                </p>
                <p>
                  <strong className="text-purple-400">What it shows:</strong> Stars, planets,
                  galaxies, and nebulae as we would see them with our eyes. Hubble primarily
                  observes in visible light.
                </p>
                <p>
                  <strong className="text-purple-400">Limitations:</strong> Cannot see through
                  cosmic dust clouds that block visible light.
                </p>
              </div>
            </div>

            {/* Infrared Light */}
            <div className="universe-scene-container glass rounded-3xl border-2 border-blue-500/30 p-8">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🔥</div>
                <h3 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
                  Infrared Light
                </h3>
              </div>
              <div className="space-y-4 text-gray-200 text-lg">
                <p>
                  <strong className="text-blue-400">What it is:</strong> Heat radiation - light
                  with longer wavelengths than visible light.
                </p>
                <p>
                  <strong className="text-blue-400">What it shows:</strong> Can see through dust
                  clouds, reveals cool stars, and shows the earliest galaxies. JWST observes
                  primarily in infrared.
                </p>
                <p>
                  <strong className="text-blue-400">Advantages:</strong> Penetrates cosmic dust and
                  reveals objects too cool or distant for visible light.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compare View Section */}
      <section className="relative z-10 px-4 mb-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-bold mb-4 text-gradient space-heading-glow">
              Compare View
            </h2>
            <p className="text-xl text-gray-300">
              Slide to compare visible vs infrared observations
            </p>
          </div>

          <div className="universe-scene-container glass rounded-3xl border-2 border-purple-500/30 p-8">
            <CompareView
              beforeImage="https://images-assets.nasa.gov/image/STScI-PRC95-24a/STScI-PRC95-24a~orig.jpg"
              afterImage="https://images-assets.nasa.gov/image/weic2208a/weic2208a~orig.jpg"
              beforeLabel="Visible Light"
              afterLabel="Infrared"
              beforeTitle="Eagle Nebula (Visible)"
              afterTitle="Eagle Nebula (Infrared)"
            />
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="relative z-10 px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-bold mb-4 text-gradient space-heading-glow">
              Gallery
            </h2>
            <p className="text-xl text-gray-300">36 stunning images from space observatories</p>
          </div>
          <ObservatoryGallery />
        </div>
      </section>
    </div>
  )
}
