'use client'

import { useEffect, useMemo, useState } from 'react'
import { emitSpaceEvent, onSpaceEvent } from '@/lib/space/recorder/eventBus'
import { computeOrbit } from '@/utils/simLab/calculations'

const STORAGE_KEY = 'sim-lab-orbit'

interface OrbitState {
  mass: number
  radius: number
}

const defaultState: OrbitState = { mass: 1, radius: 1 }

export function OrbitPlayground() {
  const [state, setState] = useState<OrbitState>(defaultState)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setState({
          mass: Number(parsed.mass) || defaultState.mass,
          radius: Number(parsed.radius) || defaultState.radius,
        })
      }
    } catch (error) {
      console.warn('Orbit state load failed', error)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const result = useMemo(() => computeOrbit(state.mass, state.radius), [state.mass, state.radius])

  const reset = () => {
    setState(defaultState)
    emitSpaceEvent('slider_move', { controlId: 'orbit-mass', value: defaultState.mass, page: 'sim-lab/orbit' })
    emitSpaceEvent('slider_move', { controlId: 'orbit-radius', value: defaultState.radius, page: 'sim-lab/orbit' })
  }

  useEffect(() => {
    const unsubscribe = onSpaceEvent((event) => {
      if (!event.meta?.replay || event.type !== 'slider_move') return
      const payload = event.payload as any
      if (!payload || payload.page !== 'sim-lab/orbit') return
      if (payload.controlId === 'orbit-mass') {
        setState((s) => ({ ...s, mass: Number(payload.value) }))
      }
      if (payload.controlId === 'orbit-radius') {
        setState((s) => ({ ...s, radius: Number(payload.value) }))
      }
    })
    return unsubscribe
  }, [])

  const updateMass = (value: number) => {
    setState((s) => ({ ...s, mass: value }))
    emitSpaceEvent('slider_move', { controlId: 'orbit-mass', value, page: 'sim-lab/orbit' })
  }

  const updateRadius = (value: number) => {
    setState((s) => ({ ...s, radius: value }))
    emitSpaceEvent('slider_move', { controlId: 'orbit-radius', value, page: 'sim-lab/orbit' })
  }

  const orbitSize = 140
  const planetAngle = 45
  const x = orbitSize + orbitSize * Math.cos((planetAngle * Math.PI) / 180)
  const y = orbitSize + orbitSize * Math.sin((planetAngle * Math.PI) / 180)

  return (
    <div className="glass rounded-2xl border border-purple-500/30 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-purple-300">Orbit Playground</p>
          <h3 className="text-2xl font-semibold text-white">Kepler-like orbital scaler</h3>
          <p className="text-sm text-gray-400 max-w-2xl">
            كيف يفكر: يفترض مدار دائري حول نجم ثابت، يستخدم مقياس كبلر (v ∝ √(M/r)) لفترة وسرعة مدار تقريبية،
            ويعرض مساراً دائرياً مع نقطة كوكب.
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
              type="number"
              min="0.1"
              step="0.1"
              value={state.mass}
              onChange={e => updateMass(Number(e.target.value))}
              className="mt-1 w-full bg-black/30 border border-purple-500/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-400"
            />
          </label>
          <label className="block">
            <span className="text-sm text-gray-300">Orbit radius (AU)</span>
            <input
              type="number"
              min="0.05"
              step="0.05"
              value={state.radius}
              onChange={e => updateRadius(Number(e.target.value))}
              className="mt-1 w-full bg-black/30 border border-purple-500/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-400"
            />
          </label>
          <div className="grid grid-cols-2 gap-3 text-sm text-gray-200">
            <div className="glass rounded-xl border border-purple-500/20 p-3">
              <div className="text-xs text-purple-200">Orbital speed</div>
              <div className="text-xl font-semibold text-white">{result.speedKmS.toFixed(2)} km/s</div>
            </div>
            <div className="glass rounded-xl border border-purple-500/20 p-3">
              <div className="text-xs text-purple-200">Period</div>
              <div className="text-xl font-semibold text-white">
                {result.periodYears.toFixed(2)} yrs ({result.periodDays.toFixed(0)} days)
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <svg width="300" height="300" viewBox="0 0 300 300" className="drop-shadow-lg">
            <defs>
              <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="1" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.2" />
              </radialGradient>
            </defs>
            <circle cx={150} cy={150} r={18} fill="url(#starGlow)" stroke="#fbbf24" strokeWidth="2" />
            <circle
              cx={150}
              cy={150}
              r={orbitSize}
              fill="none"
              stroke="rgba(168,85,247,0.5)"
              strokeWidth="2"
              strokeDasharray="6 6"
            />
            <circle cx={x} cy={y} r={10} fill="#60a5fa" stroke="#bfdbfe" strokeWidth="2" />
            <text x={150} y={285} textAnchor="middle" fill="#cbd5e1" fontSize="12">
              Simplified circular orbit (not to scale)
            </text>
          </svg>
        </div>
      </div>
    </div>
  )
}
