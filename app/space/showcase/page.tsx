'use client'

import CanvasStarfield from '@/components/space/CanvasStarfield'
import ExploreStats from '@/components/space/ExploreStats'
import SpaceShowcaseGallery from '@/components/space/SpaceShowcaseGallery'

export default function SpaceShowcasePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-space-dark text-white">
      <CanvasStarfield intensity="medium" />

      <section className="relative z-10 px-4 pt-24 pb-10">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm uppercase tracking-[0.3em] text-purple-300/80 mb-3">Space Showcase</p>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gradient mb-4">رحلة بصرية عبر الكون</h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl">
            مصورّات مختارة مع تصنيفات بسيطة، عارض ضوئي سريع، وإحصائيات محلية تساعدك
            على استكشاف كل ما قمنا بجمعه من حقائق، صور، ومهام فضائية.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <a
              href="#gallery"
              className="glass inline-flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-purple-500/60 hover:border-purple-400 hover:bg-purple-500/20 transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-400/60"
              aria-label="Jump to gallery"
            >
              🚀 استعرض الآن
            </a>
            <a
              href="#stats"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-white/30 hover:border-white/60 transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-400/60"
              aria-label="Jump to explore stats"
            >
              📊 إحصائيات المحتوى
            </a>
          </div>
          <p className="mt-4 text-sm text-purple-200/80">
            استخدم الأسهم اليسار/اليمين داخل العارض، ومفتاح Esc للإغلاق.
          </p>
        </div>
      </section>

      <section id="gallery" className="relative z-10 px-4 pb-16">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gradient">Space Showcase Gallery</h2>
            <span className="px-3 py-2 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-100 text-sm">
              Lazy-loaded • Keyboard-ready • Lightbox
            </span>
          </div>
          <SpaceShowcaseGallery />
        </div>
      </section>

      <section id="stats" className="relative z-10 px-4 pb-24">
        <div className="max-w-7xl mx-auto">
          <ExploreStats />
        </div>
      </section>
    </div>
  )
}
