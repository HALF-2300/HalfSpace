'use client'

import { useMemo, useState } from 'react'
import type { LearningLevel, UniverseEntityType, UniverseModel } from './types'
import { generateAllLearningPaths, levelLabelAr } from './lib/learning'
import {
  entityLabel,
  filterEntities,
  getRelationsForEntity,
  indexUniverseModel,
  relationLabel,
  suggestNextEntityId,
} from './lib/model'
import { cosmologyLookbackGyr, orbitalPeriodFromKepler, starLifecycleFromMass } from './lib/simulators'
import { useTwinProgress } from './lib/storage'
import '@/app/space/space-page.css'

const ENTITY_TYPES: UniverseEntityType[] = ['era', 'object', 'method', 'mission', 'constant']

const TYPE_LABEL_AR: Record<UniverseEntityType, string> = {
  era: 'حقبة',
  object: 'أجسام',
  method: 'طرق',
  mission: 'مهام',
  constant: 'ثوابت',
}

function fmt(n: number, digits = 3) {
  if (!Number.isFinite(n)) return '—'
  const abs = Math.abs(n)
  if (abs !== 0 && (abs < 0.001 || abs >= 1_000_000)) return n.toExponential(digits)
  return n.toLocaleString(undefined, { maximumFractionDigits: digits })
}

export default function TwinClient({ model }: { model: UniverseModel }) {
  const index = useMemo(() => indexUniverseModel(model), [model])
  const paths = useMemo(() => generateAllLearningPaths(model, index), [model, index])

  const [query, setQuery] = useState('')
  const [allowedTypes, setAllowedTypes] = useState<Set<UniverseEntityType>>(() => new Set(ENTITY_TYPES))
  const [selectedId, setSelectedId] = useState<string>(() => model.entities[0]?.id ?? '')

  const [level, setLevel] = useState<LearningLevel>('Beginner')
  const { completedSetByLevel, toggleStep, resetAll, hydrated } = useTwinProgress()

  const filtered = useMemo(() => filterEntities(model, query, allowedTypes), [model, query, allowedTypes])
  const selected = index.byId.get(selectedId) ?? null
  const relations = selected ? getRelationsForEntity(index, selected.id) : { outgoing: [], incoming: [] }
  const suggestedNextId = selected ? suggestNextEntityId(index, selected.id) : null
  const suggestedNext = suggestedNextId ? index.byId.get(suggestedNextId) ?? null : null

  const activePath = paths.find((p) => p.level === level)!
  const completed = completedSetByLevel[level]
  const completedCount = activePath.steps.filter((s) => completed.has(s.entityId)).length

  // Simulators state
  const [z, setZ] = useState(3)
  const [starMass, setStarMass] = useState(1)
  const [orbitMass, setOrbitMass] = useState(1)
  const [orbitDistance, setOrbitDistance] = useState(1)

  const cosmo = useMemo(() => cosmologyLookbackGyr(index, z), [index, z])
  const star = useMemo(() => starLifecycleFromMass(starMass), [starMass])
  const orbit = useMemo(() => orbitalPeriodFromKepler(orbitMass, orbitDistance), [orbitMass, orbitDistance])

  function toggleType(t: UniverseEntityType) {
    setAllowedTypes((prev) => {
      const next = new Set(prev)
      if (next.has(t)) next.delete(t)
      else next.add(t)
      if (next.size === 0) return new Set(ENTITY_TYPES) // guard: never empty
      return next
    })
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-20 pb-10">
        <div className="glass border border-white/10 rounded-3xl p-6 md:p-10 bg-black/40">
          <p className="text-xs md:text-sm font-semibold tracking-[0.25em] uppercase text-purple-200/80">
            Space · Digital Twin
          </p>
          <h1 className="mt-3 text-4xl md:text-6xl font-bold text-gradient space-heading-glow">
            SPACE DIGITAL TWIN
          </h1>
          <p className="mt-4 text-base md:text-lg text-gray-200 max-w-4xl leading-relaxed">
            صفحة واحدة تربط نموذج بيانات موحّد للكون مع محاكيات (Cosmology / Stars / Orbits) وتوليد مسارات تعلم. كل شيء
            هنا مشتق من <span className="font-semibold text-purple-200">Universe Model</span> (كيانات + علاقات).
          </p>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 pb-14">
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Model Browser */}
          <section className="lg:col-span-4 glass border border-white/10 rounded-2xl p-5 bg-black/40">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">Model browser</h2>
                <p className="mt-1 text-sm text-gray-200/80">
                  بحث + فلترة النوع. اضغط على أي كيان لرؤية علاقاته واقتراح “التالي”.
                </p>
              </div>
              <div className="text-xs text-gray-300/80 text-right">
                <div>Entities: {model.entities.length}</div>
                <div>Relations: {model.relations.length}</div>
              </div>
            </div>

            <div className="mt-4">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث بالاسم / الوصف / tag / id…"
                className="w-full rounded-xl bg-black/50 border border-white/10 px-4 py-3 text-sm outline-none focus:border-purple-400/60"
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {ENTITY_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => toggleType(t)}
                  className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                    allowedTypes.has(t)
                      ? 'border-purple-400/60 bg-purple-500/15 text-purple-100'
                      : 'border-white/10 bg-black/40 text-gray-200/80 hover:border-white/20'
                  }`}
                >
                  {TYPE_LABEL_AR[t]}
                </button>
              ))}
            </div>

            <div className="mt-4 max-h-[520px] overflow-auto pr-1 space-y-1">
              {filtered.length === 0 ? (
                <div className="text-sm text-gray-300/80 p-3">لا توجد نتائج.</div>
              ) : (
                filtered.map((e) => {
                  const active = e.id === selectedId
                  return (
                    <button
                      key={e.id}
                      onClick={() => setSelectedId(e.id)}
                      className={`w-full text-left rounded-xl px-3 py-2 border transition-colors ${
                        active
                          ? 'border-purple-400/60 bg-purple-500/15'
                          : 'border-white/10 bg-black/40 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-semibold text-sm">{entityLabel(e)}</div>
                        <div className="text-[11px] text-gray-300/80">{TYPE_LABEL_AR[e.type]}</div>
                      </div>
                      <div className="text-xs text-gray-200/70 mt-1 line-clamp-2">{e.summary_ar ?? e.summary}</div>
                    </button>
                  )
                })
              )}
            </div>
          </section>

          {/* Entity Panel */}
          <section className="lg:col-span-5 glass border border-white/10 rounded-2xl p-5 bg-black/40">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">Entity</h2>
                <p className="mt-1 text-sm text-gray-200/80">تفاصيل الكيان + العلاقات.</p>
              </div>
              {suggestedNext ? (
                <button
                  onClick={() => setSelectedId(suggestedNext.id)}
                  className="px-3 py-2 rounded-xl border border-purple-400/50 bg-purple-500/15 hover:bg-purple-500/20 text-sm"
                  title="Open suggested next entity"
                >
                  التالي المقترح: <span className="font-semibold">{entityLabel(suggestedNext)}</span>
                </button>
              ) : (
                <div className="text-xs text-gray-300/70">لا يوجد اقتراح.</div>
              )}
            </div>

            {!selected ? (
              <div className="mt-6 text-sm text-gray-300/80">اختر كياناً من القائمة.</div>
            ) : (
              <>
                <div className="mt-4 border border-white/10 rounded-2xl p-4 bg-black/40">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-purple-200/70">
                        {TYPE_LABEL_AR[selected.type]} · {selected.id}
                      </div>
                      <div className="mt-1 text-2xl font-bold">{entityLabel(selected)}</div>
                    </div>
                    {typeof selected.value === 'number' ? (
                      <div className="text-right">
                        <div className="text-xs text-gray-300/80">value</div>
                        <div className="font-mono text-sm">
                          {fmt(selected.value, 6)} {selected.units ?? ''}
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <p className="mt-3 text-sm text-gray-200 leading-relaxed">{selected.summary_ar ?? selected.summary}</p>
                  {selected.tags?.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selected.tags.map((t) => (
                        <span key={t} className="text-[11px] px-2 py-1 rounded-full border border-white/10 bg-black/40">
                          #{t}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="border border-white/10 rounded-2xl p-4 bg-black/40">
                    <div className="font-semibold">Outgoing relations</div>
                    <div className="mt-2 space-y-2">
                      {relations.outgoing.length === 0 ? (
                        <div className="text-sm text-gray-300/70">—</div>
                      ) : (
                        relations.outgoing.map((r, idx) => {
                          const to = index.byId.get(r.to)
                          if (!to) return null
                          return (
                            <button
                              key={`${r.type}:${r.to}:${idx}`}
                              onClick={() => setSelectedId(to.id)}
                              className="w-full text-left rounded-xl px-3 py-2 border border-white/10 bg-black/30 hover:border-white/20"
                            >
                              <div className="text-xs text-purple-200/90">{relationLabel(r.type)}</div>
                              <div className="font-semibold text-sm mt-0.5">{entityLabel(to)}</div>
                              {r.note ? <div className="text-xs text-gray-200/70 mt-1">{r.note}</div> : null}
                            </button>
                          )
                        })
                      )}
                    </div>
                  </div>

                  <div className="border border-white/10 rounded-2xl p-4 bg-black/40">
                    <div className="font-semibold">Incoming relations</div>
                    <div className="mt-2 space-y-2">
                      {relations.incoming.length === 0 ? (
                        <div className="text-sm text-gray-300/70">—</div>
                      ) : (
                        relations.incoming.map((r, idx) => {
                          const from = index.byId.get(r.from)
                          if (!from) return null
                          return (
                            <button
                              key={`${r.type}:${r.from}:${idx}`}
                              onClick={() => setSelectedId(from.id)}
                              className="w-full text-left rounded-xl px-3 py-2 border border-white/10 bg-black/30 hover:border-white/20"
                            >
                              <div className="text-xs text-purple-200/90">{relationLabel(r.type)}</div>
                              <div className="font-semibold text-sm mt-0.5">{entityLabel(from)}</div>
                              {r.note ? <div className="text-xs text-gray-200/70 mt-1">{r.note}</div> : null}
                            </button>
                          )
                        })
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </section>

          {/* Learning Paths */}
          <section className="lg:col-span-3 glass border border-white/10 rounded-2xl p-5 bg-black/40">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="text-xl font-bold">Learning paths</h2>
                <p className="mt-1 text-sm text-gray-200/80">٣ مسارات مع حفظ التقدّم محلياً.</p>
              </div>
              <button
                onClick={resetAll}
                className="text-xs px-3 py-2 rounded-xl border border-white/10 bg-black/30 hover:border-white/20"
                title="Reset all progress"
              >
                Reset
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {(['Beginner', 'Intermediate', 'Expert'] as LearningLevel[]).map((lv) => (
                <button
                  key={lv}
                  onClick={() => setLevel(lv)}
                  className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                    lv === level
                      ? 'border-purple-400/60 bg-purple-500/15 text-purple-100'
                      : 'border-white/10 bg-black/40 text-gray-200/80 hover:border-white/20'
                  }`}
                >
                  {levelLabelAr(lv)}
                </button>
              ))}
            </div>

            <div className="mt-4 border border-white/10 rounded-2xl p-4 bg-black/40">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-semibold">
                  {levelLabelAr(level)}: {completedCount}/{activePath.steps.length}
                </div>
                <div className="text-xs text-gray-300/70">{hydrated ? 'saved' : 'loading…'}</div>
              </div>
              <div className="mt-3 h-2 rounded-full bg-black/50 border border-white/10 overflow-hidden">
                <div
                  className="h-full bg-purple-500/60"
                  style={{ width: `${(completedCount / activePath.steps.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="mt-4 max-h-[520px] overflow-auto pr-1 space-y-2">
              {activePath.steps.map((s) => {
                const isDone = completed.has(s.entityId)
                const e = index.byId.get(s.entityId)
                return (
                  <div key={s.entityId} className="rounded-2xl border border-white/10 bg-black/30 p-3">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleStep(level, s.entityId)}
                        className={`mt-0.5 h-5 w-5 rounded border flex items-center justify-center ${
                          isDone ? 'border-purple-400/60 bg-purple-500/20' : 'border-white/20 bg-black/30'
                        }`}
                        aria-label="Toggle step complete"
                      >
                        {isDone ? <span className="text-xs">✓</span> : null}
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <button
                            onClick={() => setSelectedId(s.entityId)}
                            className="text-left font-semibold text-sm hover:text-purple-200 transition-colors truncate"
                            title="Open in Model Browser"
                          >
                            {s.index + 1}. {s.title}
                          </button>
                          <div className="text-[11px] text-gray-300/80">{TYPE_LABEL_AR[s.type]}</div>
                        </div>
                        <div className="text-xs text-gray-200/70 mt-1">{s.reason}</div>
                        {e ? <div className="text-[11px] text-gray-300/70 mt-2 line-clamp-2">{e.summary_ar ?? e.summary}</div> : null}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </div>
      </div>

      {/* Simulators */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pb-24">
        <div className="glass border border-white/10 rounded-2xl p-5 bg-black/40">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold">Simulators</h2>
              <p className="mt-1 text-sm text-gray-200/80">
                ثلاث محاكيات مرتبطة بالنموذج: انزياح أحمر → زمن رجوع، كتلة النجم → عمر ونهاية، وكتلة+مسافة → فترة مدارية.
              </p>
            </div>
            <div className="text-xs text-gray-300/70 text-right">
              <div>Uses: H0, Ωm, ΩΛ, G…</div>
              <div className="mt-1">Derived from Universe Model</div>
            </div>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-3">
            {/* Cosmology */}
            <div className="border border-white/10 rounded-2xl p-4 bg-black/40">
              <div className="font-semibold text-lg">Cosmology</div>
              <div className="text-xs text-gray-300/80 mt-1">Redshift (z) → Lookback time (تقريب)</div>

              <div className="mt-4">
                <label className="text-xs text-gray-300/80">z (0 → 30)</label>
                <input
                  type="number"
                  value={z}
                  onChange={(e) => setZ(Number(e.target.value))}
                  step={0.1}
                  className="mt-1 w-full rounded-xl bg-black/50 border border-white/10 px-3 py-2 text-sm outline-none focus:border-purple-400/60"
                />
              </div>

              <div className="mt-4 border border-white/10 rounded-xl p-3 bg-black/30">
                <div className="text-sm">
                  Lookback: <span className="font-semibold">{fmt(cosmo.lookbackGyr, 3)} Gyr</span>
                </div>
                <div className="text-xs text-gray-200/70 mt-1">
                  Scale factor \(a = 1/(1+z)\): <span className="font-semibold">{fmt(cosmo.scaleFactor, 4)}</span>
                </div>
              </div>

              <p className="mt-3 text-xs text-gray-200/70 leading-relaxed">{cosmo.explanationAr}</p>
            </div>

            {/* Stars */}
            <div className="border border-white/10 rounded-2xl p-4 bg-black/40">
              <div className="font-semibold text-lg">Stars</div>
              <div className="text-xs text-gray-300/80 mt-1">Mass (M☉) → Lifetime + Endpoint</div>

              <div className="mt-4">
                <label className="text-xs text-gray-300/80">Mass (M☉)</label>
                <input
                  type="number"
                  value={starMass}
                  onChange={(e) => setStarMass(Number(e.target.value))}
                  step={0.1}
                  className="mt-1 w-full rounded-xl bg-black/50 border border-white/10 px-3 py-2 text-sm outline-none focus:border-purple-400/60"
                />
              </div>

              <div className="mt-4 border border-white/10 rounded-xl p-3 bg-black/30">
                <div className="text-sm">
                  Lifetime: <span className="font-semibold">{fmt(star.lifetimeGyr, 3)} Gyr</span>
                </div>
                <div className="text-xs text-gray-200/70 mt-1">
                  Endpoint: <span className="font-semibold">{star.endpointAr}</span>
                </div>
              </div>

              <p className="mt-3 text-xs text-gray-200/70 leading-relaxed">{star.explanationAr}</p>
            </div>

            {/* Orbits */}
            <div className="border border-white/10 rounded-2xl p-4 bg-black/40">
              <div className="font-semibold text-lg">Orbits</div>
              <div className="text-xs text-gray-300/80 mt-1">Mass (M☉) + Distance (AU) → Orbital period</div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-300/80">Central mass (M☉)</label>
                  <input
                    type="number"
                    value={orbitMass}
                    onChange={(e) => setOrbitMass(Number(e.target.value))}
                    step={0.1}
                    className="mt-1 w-full rounded-xl bg-black/50 border border-white/10 px-3 py-2 text-sm outline-none focus:border-purple-400/60"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-300/80">Distance a (AU)</label>
                  <input
                    type="number"
                    value={orbitDistance}
                    onChange={(e) => setOrbitDistance(Number(e.target.value))}
                    step={0.1}
                    className="mt-1 w-full rounded-xl bg-black/50 border border-white/10 px-3 py-2 text-sm outline-none focus:border-purple-400/60"
                  />
                </div>
              </div>

              <div className="mt-4 border border-white/10 rounded-xl p-3 bg-black/30">
                <div className="text-sm">
                  Period: <span className="font-semibold">{fmt(orbit.periodYears, 4)} years</span>
                </div>
                <div className="text-xs text-gray-200/70 mt-1">
                  ≈ <span className="font-semibold">{fmt(orbit.periodDays, 2)} days</span>
                </div>
              </div>

              <p className="mt-3 text-xs text-gray-200/70 leading-relaxed">{orbit.explanationAr}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

