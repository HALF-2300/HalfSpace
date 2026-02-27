'use client'

import { useMemo, useState } from 'react'
import CanvasStarfield from '@/components/space/CanvasStarfield'
import CompareView from '@/components/space/CompareView'
import Observatory2Gallery, {
  Observatory2Image,
  Observatory2Telescope,
} from '@/components/space/observatory2/Observatory2Gallery'
import observatory2Data from '@/data/observatory2.json'
import '@/app/space/space-page.css'

const observatoryImages = observatory2Data.images as Observatory2Image[]

const pickInitialPair = () => {
  const primary = observatoryImages.find((img) => img.telescope === 'Hubble') ?? observatoryImages[0]
  const secondary =
    observatoryImages.find((img) => img.telescope === 'JWST' && img.id !== primary?.id) ??
    observatoryImages[1] ??
    primary
  return { primary, secondary }
}

export default function Observatory2Page() {
  const defaults = useMemo(pickInitialPair, [])
  const [beforeImage, setBeforeImage] = useState<Observatory2Image>(defaults.primary)
  const [afterImage, setAfterImage] = useState<Observatory2Image>(defaults.secondary)

  const handleSelectCompare = (slot: 'before' | 'after', image: Observatory2Image) => {
    if (slot === 'before') {
      setBeforeImage(image)
      return
    }
    setAfterImage(image)
  }

  const renderTag = (label: Observatory2Telescope, color: 'emerald' | 'amber') => {
    const paletteClasses =
      color === 'emerald'
        ? 'border-emerald-400/60 text-emerald-100'
        : 'border-amber-400/60 text-amber-100'
    return (
      <span
        className={`glass px-3 py-1 rounded-full border ${paletteClasses} text-xs uppercase tracking-wide`}
      >
        {label}
      </span>
    )
  }

  return (
    <div className="universe-portal min-h-screen relative overflow-hidden">
      <CanvasStarfield intensity="high" />

      <section className="relative z-10 pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <h1 className="text-6xl md:text-8xl font-black text-gradient space-heading-glow">
            Space Observatory 2.0
          </h1>
          <p className="text-2xl text-gray-200">معرض + مقارنة + تلسكوبات</p>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            نسخة موسعة بفلترة حسب التلسكوب، وضع مقارنة قبل/بعد، و 48 صورة مصنّفة مع
            إضاءة/لوحة مفاتيح داخل اللايت بوكس (← → Esc).
          </p>
          <div className="inline-block w-36 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
        </div>
      </section>

      <section className="relative z-10 px-4 pb-14">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient space-heading-glow">
              Compare Mode
            </h2>
            <p className="text-gray-300">
              اختر صورتين من المعرض (زر Before / After)، ثم حرّك السلايدر لرؤية الفروقات.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass rounded-2xl border border-emerald-400/40 p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-200 uppercase tracking-wide">Before</p>
                <h3 className="text-xl font-bold text-white">{beforeImage.title}</h3>
                <p className="text-gray-300 text-sm mt-1">{beforeImage.description}</p>
              </div>
              {renderTag(beforeImage.telescope, 'emerald')}
            </div>
            <div className="glass rounded-2xl border border-amber-400/40 p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-200 uppercase tracking-wide">After</p>
                <h3 className="text-xl font-bold text-white">{afterImage.title}</h3>
                <p className="text-gray-300 text-sm mt-1">{afterImage.description}</p>
              </div>
              {renderTag(afterImage.telescope, 'amber')}
            </div>
          </div>

          <div className="universe-scene-container glass rounded-3xl border-2 border-purple-500/30 p-6 md:p-10">
            <CompareView
              beforeImage={beforeImage.url}
              afterImage={afterImage.url}
              beforeLabel={`${beforeImage.telescope} / Before`}
              afterLabel={`${afterImage.telescope} / After`}
              beforeTitle={beforeImage.title}
              afterTitle={afterImage.title}
            />
            <div className="mt-4 text-center text-sm text-gray-300">
              سلايدر before/after + يدعم السحب بالماوس/اللمس.
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-4 pb-20">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient space-heading-glow">
              Observatory Gallery 2.0
            </h2>
            <p className="text-gray-300">
              مصنّفة إلى Nebulae / Galaxies / Stars / Planets / Missions / Telescopes مع فلترة
              Hubble vs JWST ولايت بوكس مع لوحة مفاتيح.
            </p>
          </div>

          <Observatory2Gallery
            images={observatoryImages}
            onSelectCompare={handleSelectCompare}
            compareSelection={{ before: beforeImage.id, after: afterImage.id }}
          />
        </div>
      </section>
    </div>
  )
}
