'use client'

import { useEffect, useMemo, useState } from 'react'
import { calculateLensEffect } from '@/utils/simLab/calculations'

const STORAGE_KEY = 'sim-lab-lens'

export function BlackHoleLensDemo() {
  const [mass, setMass] = useState(10)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setMass(Number(parsed.mass) || 10)
      }
    } catch (error) {
      console.warn('Lens state load failed', error)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ mass }))
  }, [mass])

  const effect = useMemo(() => calculateLensEffect(mass), [mass])

  const reset = () => setMass(10)

  const distortion = 1 + effect.warp

  return (
    <div className="glass rounded-2xl border border-purple-500/30 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-purple-300">Black Hole Lens Demo</p>
          <h3 className="text-2xl font-semibold text-white">Toy gravitational lens warp</h3>
          <p className="text-sm text-gray-400 max-w-2xl">
            كيف يفكر: يربط الكتلة بمعامل تشويه (scale + blur)، يحسب نصف قطر أينشتاين مبسطاً، ويطبّق تأثيراً بصرياً
            على خلفية نجوم ثنائية الأبعاد لتمثيل انحناء الضوء.
          </p>
        </div>
        <button
          onClick={reset}
          className="px-3 py-2 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:bg-purple-500 transition"
        >
          Reset
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <label className="block">
            <span className="text-sm text-gray-300">Lens mass (M☉)</span>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={mass}
              onChange={e => setMass(Number(e.target.value))}
              className="w-full accent-purple-400"
            />
            <div className="text-sm text-gray-200 mt-1">Current mass: {mass.toFixed(0)} M☉</div>
          </label>

          <div className="grid grid-cols-3 gap-3 text-sm text-gray-200">
            <div className="glass rounded-xl border border-purple-500/20 p-3">
              <div className="text-xs text-purple-200">Warp factor</div>
              <div className="text-xl font-semibold text-white">{distortion.toFixed(3)}x</div>
            </div>
            <div className="glass rounded-xl border border-purple-500/20 p-3">
              <div className="text-xs text-purple-200">Blur halo</div>
              <div className="text-xl font-semibold text-white">{effect.blur.toFixed(1)} px</div>
            </div>
            <div className="glass rounded-xl border border-purple-500/20 p-3">
              <div className="text-xs text-purple-200">Brightness</div>
              <div className="text-xl font-semibold text-white">{effect.brightness.toFixed(2)}</div>
            </div>
          </div>
        </div>

        <div className="relative h-64 rounded-2xl overflow-hidden border border-purple-500/30 bg-gradient-to-br from-slate-900 via-slate-950 to-black">
          <div className="absolute inset-0 opacity-70" style={{ backgroundImage: starfield }} />
          <div
            className="absolute inset-0 transition-transform duration-150 ease-out"
            style={{
              transform: `scale(${distortion})`,
              filter: `blur(${effect.blur}px) brightness(${effect.brightness})`,
            }}
          >
            <div className="absolute inset-0 mix-blend-screen" style={{ backgroundImage: swirl }} />
          </div>
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-purple-300/70"
            style={{
              width: `${60 + effect.warp * 160}px`,
              height: `${60 + effect.warp * 160}px`,
              boxShadow: `0 0 40px 20px rgba(168,85,247,0.25), 0 0 80px 30px rgba(59,130,246,0.2)`,
              background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0) 65%)',
            }}
          />
          <div className="absolute bottom-3 right-3 text-xs text-gray-300 bg-black/40 px-2 py-1 rounded">
            Visual only; not to scale.
          </div>
        </div>
      </div>
    </div>
  )
}

const starfield =
  'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.7) 0, rgba(255,255,255,0) 8%),' +
  'radial-gradient(circle at 70% 60%, rgba(255,255,255,0.6) 0, rgba(255,255,255,0) 10%),' +
  'radial-gradient(circle at 40% 80%, rgba(255,255,255,0.5) 0, rgba(255,255,255,0) 9%),' +
  'radial-gradient(circle at 80% 25%, rgba(255,255,255,0.6) 0, rgba(255,255,255,0) 7%),' +
  'radial-gradient(circle at 10% 70%, rgba(255,255,255,0.5) 0, rgba(255,255,255,0) 6%),' +
  'linear-gradient(135deg, rgba(59,130,246,0.25), rgba(147,51,234,0.05))'

const swirl =
  'radial-gradient(circle at 50% 50%, rgba(59,130,246,0.4), rgba(168,85,247,0.05) 40%, rgba(0,0,0,0) 65%)'
