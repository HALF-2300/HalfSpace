'use client'

import { OrbitPlayground } from '@/components/SimLab/OrbitPlayground'
import { StarEvolutionEstimator } from '@/components/SimLab/StarEvolutionEstimator'
import { BlackHoleLensDemo } from '@/components/SimLab/BlackHoleLensDemo'

export default function SimLabPage() {
  return (
    <main className="min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-7xl mx-auto space-y-10">
        <header className="text-center space-y-3">
          <p className="text-xs uppercase text-purple-300 tracking-[0.25em]">Additions Only</p>
          <h1 className="text-5xl md:text-6xl font-bold text-gradient">Astro Sim Lab</h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            ثلاث محاكيات سريعة: مدارات بسيطة، عمر النجوم حسب الكتلة، وتشويه عدسة جاذبية ثنائي الأبعاد قابل للضبط.
            كل محاكي يحفظ آخر إعداداتك ويحتوي زر إعادة ضبط.
          </p>
        </header>

        <div className="space-y-8">
          <OrbitPlayground />
          <StarEvolutionEstimator />
          <BlackHoleLensDemo />
        </div>
      </div>
    </main>
  )
}
