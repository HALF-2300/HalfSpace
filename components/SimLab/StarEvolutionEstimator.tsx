'use client'

import { useEffect, useMemo, useState } from 'react'
import { computeStarEvolution } from '@/utils/simLab/calculations'

const STORAGE_KEY = 'sim-lab-star'

export function StarEvolutionEstimator() {
  const [mass, setMass] = useState(1.0)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setMass(Number(parsed.mass) || 1)
      }
    } catch (error) {
      console.warn('Star state load failed', error)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ mass }))
  }, [mass])

  const timeline = useMemo(() => computeStarEvolution(mass), [mass])

  const reset = () => setMass(1)

  const totalFinite = timeline.path.reduce((sum, step) => (step.years === Infinity ? sum : sum + step.years), 0)

  return (
    <div className="glass rounded-2xl border border-purple-500/30 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-purple-300">Star Evolution Estimator</p>
          <h3 className="text-2xl font-semibold text-white">Mass-based lifetime sketch</h3>
          <p className="text-sm text-gray-400 max-w-2xl">
            كيف يفكر: يستخدم علاقة عمر رئيسي ≈ 10Gyr × M^-2.5، يخصص 10٪ للعملاق الأحمر، ويقرر المصير
            (قزم أبيض/نيوتروني/ثقب أسود) بناءً على الكتلة.
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
            <span className="text-sm text-gray-300">Star mass (M☉)</span>
            <input
              type="range"
              min="0.1"
              max="40"
              step="0.1"
              value={mass}
              onChange={e => setMass(Number(e.target.value))}
              className="w-full accent-purple-400"
            />
            <div className="text-sm text-gray-200 mt-1">Current mass: {mass.toFixed(1)} M☉</div>
          </label>

          <div className="grid grid-cols-2 gap-3 text-sm text-gray-200">
            <div className="glass rounded-xl border border-purple-500/20 p-3">
              <div className="text-xs text-purple-200">Main sequence age</div>
              <div className="text-xl font-semibold text-white">
                {(timeline.path[0].years / 1_000_000_000).toFixed(2)} Gyr
              </div>
            </div>
            <div className="glass rounded-xl border border-purple-500/20 p-3">
              <div className="text-xs text-purple-200">Fate</div>
              <div className="text-sm font-semibold text-white">{timeline.path[3].stage}</div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {timeline.path.map((step, idx) => {
            const width =
              step.years === Infinity || totalFinite === 0 ? 100 : Math.max(8, (step.years / totalFinite) * 100)
            return (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-sm text-gray-200">
                  <span>{step.stage}</span>
                  <span>
                    {step.years === Infinity
                      ? 'Long cooling'
                      : step.years > 1_000_000_000
                        ? `${(step.years / 1_000_000_000).toFixed(2)} Gyr`
                        : step.years > 1_000_000
                          ? `${(step.years / 1_000_000).toFixed(1)} Myr`
                          : `${Math.max(step.years, 1).toFixed(0)} yr`}
                  </span>
                </div>
                <div className="w-full bg-purple-500/15 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-purple-400 via-fuchsia-400 to-amber-300"
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
