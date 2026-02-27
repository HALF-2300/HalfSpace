'use client'

import { useMemo, useState } from 'react'
import CanvasStarfield from '@/components/space/CanvasStarfield'
import CompareView from '@/components/space/CompareView'
import ObservatoryGallery from '@/components/space/ObservatoryGallery'
import '@/app/space/space-page.css'

type TelescopeKey = 'hubble' | 'jwst' | 'kepler'

interface TelescopeDetails {
  name: string
  name_ar: string
  icon: string
  era: string
  spectrum: string
  description: string
  description_ar: string
  highlights: string[]
}

export default function ObservatoryShowcase() {
  const telescopes: Record<TelescopeKey, TelescopeDetails> = useMemo(
    () => ({
      hubble: {
        name: 'Hubble Space Telescope',
        name_ar: 'تلسكوب هابل الفضائي',
        icon: '🛰️',
        era: '1990 — present',
        spectrum: 'Ultraviolet + Visible + Near-Infrared',
        description:
          'The iconic eye in orbit that gave us deep-field views, crisp planetary portraits, and the first HD look at distant galaxies.',
        description_ar:
          'العين الأيقونية في المدار التي منحتنا أعماق الكون وصور الكواكب الحادة وأول نظرة عالية الدقة للمجرات البعيدة.',
        highlights: [
          '1.5M+ observations and counting',
          'Sees objects 13.4B light-years away',
          'Serviced 5 times by astronauts',
          'Powered by 2.4 m primary mirror',
        ],
      },
      jwst: {
        name: 'James Webb Space Telescope',
        name_ar: 'تلسكوب جيمس ويب الفضائي',
        icon: '🔭',
        era: '2021 — present',
        spectrum: 'Mid + Near-Infrared specialist',
        description:
          'Infrared powerhouse parked at L2. Webb peers through cosmic dust, revealing first light galaxies and baby stars still forming.',
        description_ar:
          'قوة تحت الحمراء المتمركزة عند نقطة لاغرانج الثانية. يطل ويب عبر الغبار الكوني ويكشف المجرات الأولى والنجوم حديثة الولادة.',
        highlights: [
          '100× deeper sensitivity than Hubble',
          'Detects heat as faint as a bumblebee on the Moon',
          '6.5 m segmented gold mirror',
          'Operates ~1M miles from Earth',
        ],
      },
      kepler: {
        name: 'Kepler Space Telescope',
        name_ar: 'تلسكوب كيبلر الفضائي',
        icon: '🪐',
        era: '2009 — 2018',
        spectrum: 'Visible-light photometry',
        description:
          'The exoplanet hunter that stared at 150,000+ stars, catching tiny dips in brightness to reveal thousands of new worlds.',
        description_ar:
          'صيّاد الكواكب الخارجية الذي حدّق في أكثر من 150 ألف نجم، يلتقط انخفاضات ضوئية دقيقة تكشف آلاف العوالم الجديدة.',
        highlights: [
          '2,600+ confirmed exoplanets found',
          'First Earth-size planets in habitable zones',
          'Laser-stable pointing for years',
          'Legacy continued by TESS',
        ],
      },
    }),
    []
  )

  const [activeTelescope, setActiveTelescope] = useState<TelescopeKey>('hubble')
  const active = telescopes[activeTelescope]

  return (
    <div className="universe-portal min-h-screen relative overflow-hidden">
      <CanvasStarfield intensity="high" />

      <section className="relative z-10 pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-3 px-4 py-2 glass border border-purple-500/40 rounded-full text-sm uppercase tracking-[0.2em] text-purple-200">
              <span>Observatory</span>
              <span className="text-purple-400">|</span>
              <span>مركز صور + تلسكوبات</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold mt-6 mb-4 text-gradient universe-title space-heading-glow">
              AGENT 2 — Observatory
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
              مركز بصري يجمع التلسكوبات الفضائية، شرح سريع لطيف الضوء، ومعرض مصنّف من 36 صورة
              مدهشة من بعثات هابل، جيمس ويب، وكيبلر.
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-4 mb-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-3 text-gradient space-heading-glow">
              Telescopes
            </h2>
            <p className="text-lg text-gray-300">Hubble • JWST • Kepler</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {(Object.keys(telescopes) as TelescopeKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setActiveTelescope(key)}
                className={`universe-tab glass px-6 py-3 rounded-xl border-2 font-semibold text-base transition-all transform hover:scale-105 ${
                  activeTelescope === key
                    ? 'border-purple-500 bg-purple-500/20 glow-purple'
                    : 'border-purple-500/30 hover:border-purple-500/50'
                }`}
              >
                <span className="text-2xl mr-2">{telescopes[key].icon}</span>
                <span>{telescopes[key].name}</span>
              </button>
            ))}
          </div>

          <div className="universe-scene-container glass rounded-3xl border-2 border-purple-500/30 p-6 md:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{active.icon}</div>
                  <div>
                    <h3 className="text-3xl font-bold text-gradient">{active.name}</h3>
                    <p className="text-gray-300">{active.name_ar}</p>
                    <p className="text-sm text-purple-200/80 mt-1">{active.era}</p>
                    <p className="text-sm text-blue-200/80">{active.spectrum}</p>
                  </div>
                </div>
                <p className="text-lg text-gray-200">{active.description}</p>
                <p className="text-lg text-gray-300/80">{active.description_ar}</p>
              </div>

              <div className="space-y-3">
                {active.highlights.map((point) => (
                  <div
                    key={point}
                    className="glass border border-purple-500/30 rounded-xl px-4 py-3 text-gray-200 text-sm md:text-base"
                  >
                    {point}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-4 mb-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-3 text-gradient space-heading-glow">
              What They See
            </h2>
            <p className="text-lg text-gray-300">Infrared vs Visible — شرح بصري سريع</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="universe-scene-container glass rounded-3xl border-2 border-purple-500/30 p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">👁️</span>
                <h3 className="text-2xl font-bold text-gradient">Visible Light</h3>
              </div>
              <ul className="space-y-3 text-gray-200">
                <li>Colors our eyes see (red → violet)</li>
                <li>Best for sharp views of stars, clusters, and planets</li>
                <li>Struggles to pierce thick dust lanes</li>
              </ul>
            </div>

            <div className="universe-scene-container glass rounded-3xl border-2 border-blue-500/30 p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">🔥</span>
                <h3 className="text-2xl font-bold text-gradient">Infrared Light</h3>
              </div>
              <ul className="space-y-3 text-gray-200">
                <li>Longer wavelengths = heat vision through cosmic dust</li>
                <li>Reveals cold objects, newborn stars, first galaxies</li>
                <li>Great for structure inside nebulae and hidden disks</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-4 mb-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-3 text-gradient space-heading-glow">
              Compare View
            </h2>
            <p className="text-lg text-gray-300">سلايدر قبل/بعد بسيط (Infrared vs Visible)</p>
          </div>
          <div className="universe-scene-container glass rounded-3xl border-2 border-purple-500/30 p-6 md:p-10">
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

      <section className="relative z-10 px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-3 text-gradient space-heading-glow">
              Gallery
            </h2>
            <p className="text-lg text-gray-300">
              معرض مصنّف (Nebulae / Galaxies / Stars / Planets / Missions) — 36 صورة
            </p>
          </div>
          <ObservatoryGallery />
        </div>
      </section>
    </div>
  )
}
