'use client'

import { useMemo, useState } from 'react'

const C_KM_S = 299_792.458
const MPC_TO_MLY = 3.26156 // million light-years per Mpc

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function num(v: string) {
  const x = Number(v)
  return Number.isFinite(x) ? x : NaN
}

export function CosmologyToolsApp() {
  const [z, setZ] = useState('0.1')
  const [h0, setH0] = useState('70')

  const [vFrac, setVFrac] = useState('0.8')
  const [properYears, setProperYears] = useState('10')

  const hubble = useMemo(() => {
    const Z = clamp(num(z), 0, 20)
    const H0 = clamp(num(h0), 40, 110)
    if (!Number.isFinite(Z) || !Number.isFinite(H0)) return null
    const v = C_KM_S * Z
    const dMpc = v / H0
    const dBly = (dMpc * MPC_TO_MLY) / 1000
    return { Z, H0, v, dMpc, dBly }
  }, [z, h0])

  const dilation = useMemo(() => {
    const v = clamp(num(vFrac), 0, 0.999999)
    const t0 = clamp(num(properYears), 0, 1e9)
    if (!Number.isFinite(v) || !Number.isFinite(t0)) return null
    const gamma = 1 / Math.sqrt(1 - v * v)
    const t = gamma * t0
    return { v, t0, gamma, t }
  }, [vFrac, properYears])

  return (
    <div className="p-5 space-y-4">
      <div>
        <div className="text-white/90 font-semibold text-lg">Cosmology Tools</div>
        <div className="text-xs text-white/60">
          Fast, educational approximations (not a precision cosmology pipeline).
        </div>
      </div>

      <section className="rounded-2xl border border-white/10 bg-black/25 p-4">
        <div className="text-white/90 font-semibold">1) Redshift → distance (Hubble law)</div>
        <div className="text-xs text-white/60 mt-1">
          Uses \(v \approx cz\) and \(d \approx v / H_0\) (good only for small z).
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          <label className="block">
            <div className="text-xs text-white/65 mb-1">Redshift z</div>
            <input
              value={z}
              onChange={(e) => setZ(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-black/35 border border-white/10 text-white/85 outline-none focus:border-cyan-300/50"
              inputMode="decimal"
            />
          </label>
          <label className="block">
            <div className="text-xs text-white/65 mb-1">H₀ (km/s/Mpc)</div>
            <input
              value={h0}
              onChange={(e) => setH0(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-black/35 border border-white/10 text-white/85 outline-none focus:border-cyan-300/50"
              inputMode="decimal"
            />
          </label>
        </div>

        {hubble ? (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="text-xs text-white/60">Recession velocity</div>
              <div className="text-white/90 font-semibold mt-1">
                {hubble.v.toFixed(0)} km/s
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="text-xs text-white/60">Distance</div>
              <div className="text-white/90 font-semibold mt-1">{hubble.dMpc.toFixed(1)} Mpc</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="text-xs text-white/60">≈</div>
              <div className="text-white/90 font-semibold mt-1">{hubble.dBly.toFixed(2)} B ly</div>
            </div>
          </div>
        ) : (
          <div className="mt-4 text-sm text-white/60">Enter valid numbers to compute.</div>
        )}
      </section>

      <section className="rounded-2xl border border-white/10 bg-black/25 p-4">
        <div className="text-white/90 font-semibold">2) Special relativity time dilation</div>
        <div className="text-xs text-white/60 mt-1">
          Given speed as a fraction of c, computes \(\gamma\) and dilated time.
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          <label className="block">
            <div className="text-xs text-white/65 mb-1">v/c</div>
            <input
              value={vFrac}
              onChange={(e) => setVFrac(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-black/35 border border-white/10 text-white/85 outline-none focus:border-cyan-300/50"
              inputMode="decimal"
            />
          </label>
          <label className="block">
            <div className="text-xs text-white/65 mb-1">Proper time (years)</div>
            <input
              value={properYears}
              onChange={(e) => setProperYears(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-black/35 border border-white/10 text-white/85 outline-none focus:border-cyan-300/50"
              inputMode="decimal"
            />
          </label>
        </div>

        {dilation ? (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="text-xs text-white/60">γ (Lorentz factor)</div>
              <div className="text-white/90 font-semibold mt-1">{dilation.gamma.toFixed(6)}</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="text-xs text-white/60">Proper time</div>
              <div className="text-white/90 font-semibold mt-1">{dilation.t0.toFixed(2)} y</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="text-xs text-white/60">Dilated time</div>
              <div className="text-white/90 font-semibold mt-1">{dilation.t.toFixed(2)} y</div>
            </div>
          </div>
        ) : (
          <div className="mt-4 text-sm text-white/60">Enter valid numbers to compute.</div>
        )}
      </section>
    </div>
  )
}

