'use client'

import { useEffect, useMemo, useState } from 'react'
import CanvasStarfield from '@/components/space/CanvasStarfield'
import '@/app/space/space-page.css'

import type { LearningLevel, UniverseEntityType, UniverseModel } from './universeModel'
import {
  entityLabel,
  entityMatchesQuery,
  entitySummary,
  indexUniverseModel,
  suggestNextEntityId,
} from './universeModel'
import { generateLearningPaths } from './learning'
import { clearPath, readLearningProgress, toggleStep, writeLearningProgress } from './storage'
import { lookbackTimeGyr, orbitalPeriodFromMassAndDistance, stellarLifetimeAndEndpoint } from './simulations'

const ENTITY_TYPES: UniverseEntityType[] = ['constant', 'method', 'object', 'mission', 'era']

function typeBadge(type: UniverseEntityType) {
  const map: Record<UniverseEntityType, string> = {
    constant: 'ثابت',
    method: 'منهج/طريقة',
    object: 'جسم',
    mission: 'مهمة',
    era: 'حقبة',
  }
  return map[type]
}

function relationBadge(type: string) {
  const map: Record<string, string> = {
    explains: 'يشرح',
    depends_on: 'يعتمد على',
    measured_by: 'يُقاس بـ',
    observed_by: 'يُرصد بـ',
  }
  return map[type] ?? type
}

export default function SpaceTwinClient({ model }: { model: UniverseModel }) {
  const idx = useMemo(() => indexUniverseModel(model), [model])
  const paths = useMemo(() => generateLearningPaths(model), [model])

  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<Set<UniverseEntityType>>(() => new Set(ENTITY_TYPES))
  const [selectedId, setSelectedId] = useState<string>(() => model.entities[0]?.id ?? '')
  const [activeLevel, setActiveLevel] = useState<LearningLevel>('Beginner')
  const [progress, setProgress] = useState(() => readLearningProgress())

  // Simulator states
  const [z, setZ] = useState(3)
  const [starMass, setStarMass] = useState(1)
  const [orbitMass, setOrbitMass] = useState(1)
  const [orbitDistance, setOrbitDistance] = useState(1)

  useEffect(() => {
    writeLearningProgress(progress)
  }, [progress])

  const filteredEntities = useMemo(() => {
    return model.entities
      .filter((e) => typeFilter.has(e.type))
      .filter((e) => entityMatchesQuery(e, query))
      .sort((a, b) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type.localeCompare(b.type)))
  }, [model.entities, query, typeFilter])

  const selected = idx.byId.get(selectedId) ?? null
  const outgoing = selected ? idx.outgoing.get(selected.id) ?? [] : []
  const incoming = selected ? idx.incoming.get(selected.id) ?? [] : []

  const nextSuggestedId = useMemo(() => {
    if (!selected) return null
    return suggestNextEntityId(selected.id, idx)
  }, [idx, selected])

  const activePath = paths[activeLevel]
  const completedSet = useMemo(() => new Set(progress[activeLevel] ?? []), [progress, activeLevel])
  const completedCount = activePath.steps.filter((s) => completedSet.has(s.entityId)).length
  const pct = Math.round((completedCount / activePath.steps.length) * 100)

  const cosmology = useMemo(() => lookbackTimeGyr(z), [z])
  const star = useMemo(() => stellarLifetimeAndEndpoint(starMass), [starMass])
  const orbit = useMemo(() => orbitalPeriodFromMassAndDistance(orbitMass, orbitDistance), [orbitMass, orbitDistance])

  const onSelectEntity = (id: string) => {
    if (!idx.byId.has(id)) return
    setSelectedId(id)
  }

  return (
    <div className="universe-portal min-h-screen relative overflow-hidden">
      <CanvasStarfield intensity="high" />

      <section className="relative z-10 pt-24 pb-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-3 text-gradient universe-title space-heading-glow">
              SPACE DIGITAL TWIN
            </h1>
            <p className="text-lg md:text-xl text-gray-200 font-light">
              توأم رقمي للكون: نموذج بيانات موحّد + محاكاة + مسار تعلم (كلها مرتبطة)
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-12 items-start">
            {/* Model Browser */}
            <div className="lg:col-span-5 glass rounded-2xl border border-purple-500/30 p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-purple-300">Model browser</p>
                  <h2 className="text-2xl font-bold text-white">متصفح النموذج</h2>
                </div>
                <div className="text-xs text-gray-300">
                  {filteredEntities.length}/{model.entities.length}
                </div>
              </div>

              <div className="grid gap-3">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="بحث بالاسم/الوصف/الوسوم..."
                  className="w-full rounded-xl px-4 py-3 bg-black/40 border border-purple-500/30 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/60"
                />

                <div className="flex flex-wrap gap-2">
                  {ENTITY_TYPES.map((t) => {
                    const on = typeFilter.has(t)
                    return (
                      <button
                        key={t}
                        onClick={() => {
                          const next = new Set(typeFilter)
                          if (next.has(t)) next.delete(t)
                          else next.add(t)
                          setTypeFilter(next.size ? next : new Set([t]))
                        }}
                        className={`px-3 py-2 rounded-xl text-sm border transition ${
                          on ? 'border-purple-500 bg-purple-500/20 text-white' : 'border-purple-500/30 text-gray-200 hover:border-purple-500/50'
                        }`}
                        aria-pressed={on}
                      >
                        {typeBadge(t)}
                      </button>
                    )
                  })}
                </div>

                <div className="grid gap-2 max-h-[320px] overflow-auto pr-1">
                  {filteredEntities.slice(0, 80).map((e) => (
                    <button
                      key={e.id}
                      onClick={() => setSelectedId(e.id)}
                      className={`text-left rounded-xl px-4 py-3 border transition ${
                        selectedId === e.id
                          ? 'border-purple-500 bg-purple-500/15'
                          : 'border-purple-500/20 bg-black/20 hover:border-purple-500/40'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-semibold text-white">{entityLabel(e, 'ar')}</div>
                        <div className="text-xs text-purple-200">{typeBadge(e.type)}</div>
                      </div>
                      <div className="text-sm text-gray-300 mt-1 line-clamp-2">{entitySummary(e, 'ar')}</div>
                    </button>
                  ))}
                  {filteredEntities.length > 80 && (
                    <div className="text-xs text-gray-400 px-2">عرض أول 80 نتيجة (حسّن البحث لتضييق النتائج).</div>
                  )}
                </div>
              </div>

              {/* Selected entity details */}
              <div className="mt-5 pt-5 border-t border-purple-500/20">
                {!selected ? (
                  <div className="text-gray-200">اختر عنصر لعرض التفاصيل.</div>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xs text-purple-200 mb-1">{typeBadge(selected.type)}</div>
                        <h3 className="text-xl font-bold text-white">{entityLabel(selected, 'ar')}</h3>
                        <p className="text-sm text-gray-300 mt-2">{entitySummary(selected, 'ar')}</p>
                      </div>
                      {nextSuggestedId && (
                        <button
                          onClick={() => onSelectEntity(nextSuggestedId)}
                          className="shrink-0 px-4 py-2 rounded-xl border border-purple-500/40 bg-purple-500/15 text-white hover:border-purple-500/70"
                        >
                          التالي المقترح →
                        </button>
                      )}
                    </div>

                    {selected.tags && selected.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {selected.tags.slice(0, 8).map((t) => (
                          <span key={t} className="text-xs px-2 py-1 rounded-full bg-black/30 border border-purple-500/20 text-gray-200">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="grid gap-3 mt-4">
                      <div>
                        <div className="text-sm font-semibold text-white mb-2">العلاقات (Outgoing)</div>
                        <div className="grid gap-2">
                          {outgoing.length === 0 && <div className="text-sm text-gray-400">لا توجد علاقات.</div>}
                          {outgoing.slice(0, 10).map((r, i) => {
                            const to = idx.byId.get(r.to)
                            return (
                              <button
                                key={`${r.type}-${i}-${r.to}`}
                                onClick={() => onSelectEntity(r.to)}
                                className="text-left rounded-xl px-3 py-2 border border-purple-500/20 bg-black/20 hover:border-purple-500/45"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div className="text-sm text-white">
                                    <span className="text-purple-200">{relationBadge(r.type)}</span> → {to ? entityLabel(to, 'ar') : r.to}
                                  </div>
                                </div>
                                {r.note && <div className="text-xs text-gray-400 mt-1">{r.note}</div>}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-semibold text-white mb-2">العلاقات (Incoming)</div>
                        <div className="grid gap-2">
                          {incoming.length === 0 && <div className="text-sm text-gray-400">لا توجد علاقات.</div>}
                          {incoming.slice(0, 10).map((r, i) => {
                            const from = idx.byId.get(r.from)
                            return (
                              <button
                                key={`${r.type}-${i}-${r.from}`}
                                onClick={() => onSelectEntity(r.from)}
                                className="text-left rounded-xl px-3 py-2 border border-purple-500/20 bg-black/20 hover:border-purple-500/45"
                              >
                                <div className="text-sm text-white">
                                  {from ? entityLabel(from, 'ar') : r.from} → <span className="text-purple-200">{relationBadge(r.type)}</span>
                                </div>
                                {r.note && <div className="text-xs text-gray-400 mt-1">{r.note}</div>}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Simulations + Learning */}
            <div className="lg:col-span-7 grid gap-6">
              <div className="glass rounded-2xl border border-purple-500/30 p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-purple-300">Simulations</p>
                <h2 className="text-2xl font-bold text-white mb-4">محاكيات مرتبطة بالنموذج</h2>

                <div className="grid gap-4 md:grid-cols-3">
                  {/* Cosmology */}
                  <div className="rounded-2xl border border-purple-500/20 bg-black/20 p-4">
                    <div className="font-semibold text-white mb-2">Cosmology</div>
                    <div className="text-xs text-gray-300 mb-3">redshift → lookback time (تقريب)</div>
                    <label className="text-xs text-gray-300">z (Redshift)</label>
                    <input
                      type="number"
                      value={z}
                      step={0.1}
                      min={0}
                      max={30}
                      onChange={(e) => setZ(Number(e.target.value))}
                      className="mt-1 w-full rounded-xl px-3 py-2 bg-black/40 border border-purple-500/30 text-white"
                    />
                    <div className="mt-3 text-sm text-white">
                      ≈ {cosmology.lookback_gyr.toFixed(2)} Gyr
                    </div>
                    <div className="mt-2 text-xs text-gray-400">{cosmology.explanation_ar}</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {['method-redshift', 'constant-h0', 'method-hubble-law'].map((id) => (
                        <button
                          key={id}
                          onClick={() => onSelectEntity(id)}
                          className="text-xs px-2 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-100 hover:border-purple-500/60"
                        >
                          {idx.byId.get(id) ? entityLabel(idx.byId.get(id)!, 'ar') : id}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="rounded-2xl border border-purple-500/20 bg-black/20 p-4">
                    <div className="font-semibold text-white mb-2">Stars</div>
                    <div className="text-xs text-gray-300 mb-3">mass → lifetime + endpoint</div>
                    <label className="text-xs text-gray-300">Mass (M☉)</label>
                    <input
                      type="number"
                      value={starMass}
                      step={0.1}
                      min={0.01}
                      onChange={(e) => setStarMass(Number(e.target.value))}
                      className="mt-1 w-full rounded-xl px-3 py-2 bg-black/40 border border-purple-500/30 text-white"
                    />
                    {star.ok ? (
                      <>
                        <div className="mt-3 text-sm text-white">≈ {star.lifetime_gyr.toFixed(3)} Gyr</div>
                        <div className="mt-1 text-xs text-purple-200">{star.endpoint_ar}</div>
                        <div className="mt-2 text-xs text-gray-400">{star.explanation_ar}</div>
                      </>
                    ) : (
                      <div className="mt-3 text-xs text-red-200">{star.error_ar}</div>
                    )}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {['object-star', 'object-main-sequence', 'method-stellar-evolution-models', 'method-nuclear-fusion'].map((id) => (
                        <button
                          key={id}
                          onClick={() => onSelectEntity(id)}
                          className="text-xs px-2 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-100 hover:border-purple-500/60"
                        >
                          {idx.byId.get(id) ? entityLabel(idx.byId.get(id)!, 'ar') : id}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Orbits */}
                  <div className="rounded-2xl border border-purple-500/20 bg-black/20 p-4">
                    <div className="font-semibold text-white mb-2">Orbits</div>
                    <div className="text-xs text-gray-300 mb-3">mass + distance → orbital period</div>
                    <label className="text-xs text-gray-300">Central mass (M☉)</label>
                    <input
                      type="number"
                      value={orbitMass}
                      step={0.1}
                      min={0.01}
                      onChange={(e) => setOrbitMass(Number(e.target.value))}
                      className="mt-1 w-full rounded-xl px-3 py-2 bg-black/40 border border-purple-500/30 text-white"
                    />
                    <label className="text-xs text-gray-300 mt-2 block">Distance a (AU)</label>
                    <input
                      type="number"
                      value={orbitDistance}
                      step={0.1}
                      min={0.01}
                      onChange={(e) => setOrbitDistance(Number(e.target.value))}
                      className="mt-1 w-full rounded-xl px-3 py-2 bg-black/40 border border-purple-500/30 text-white"
                    />
                    {orbit.ok ? (
                      <>
                        <div className="mt-3 text-sm text-white">
                          ≈ {orbit.period_years.toFixed(4)} years ({orbit.period_days.toFixed(1)} days)
                        </div>
                        <div className="mt-2 text-xs text-gray-400">{orbit.explanation_ar}</div>
                      </>
                    ) : (
                      <div className="mt-3 text-xs text-red-200">{orbit.error_ar}</div>
                    )}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {['method-kepler-third-law', 'constant-g', 'constant-au', 'constant-msun'].map((id) => (
                        <button
                          key={id}
                          onClick={() => onSelectEntity(id)}
                          className="text-xs px-2 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-100 hover:border-purple-500/60"
                        >
                          {idx.byId.get(id) ? entityLabel(idx.byId.get(id)!, 'ar') : id}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass rounded-2xl border border-purple-500/30 p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-purple-300">Learning paths</p>
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-2xl font-bold text-white">مولّد مسار تعلم</h2>
                  <div className="text-sm text-gray-200">
                    {completedCount}/{activePath.steps.length} ({pct}%)
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {(['Beginner', 'Intermediate', 'Expert'] as LearningLevel[]).map((lvl) => {
                    const on = activeLevel === lvl
                    return (
                      <button
                        key={lvl}
                        onClick={() => setActiveLevel(lvl)}
                        className={`px-4 py-2 rounded-xl border transition ${
                          on ? 'border-purple-500 bg-purple-500/20 text-white' : 'border-purple-500/30 text-gray-200 hover:border-purple-500/50'
                        }`}
                      >
                        {lvl}
                      </button>
                    )
                  })}
                  <button
                    onClick={() => setProgress((p) => clearPath(p, activeLevel))}
                    className="ml-auto px-4 py-2 rounded-xl border border-red-400/30 bg-red-500/10 text-red-100 hover:border-red-400/60"
                  >
                    تصفير تقدّم هذا المسار
                  </button>
                </div>

                <div className="mt-4 grid gap-2">
                  {activePath.steps.map((s) => {
                    const e = idx.byId.get(s.entityId)
                    const checked = completedSet.has(s.entityId)
                    return (
                      <div
                        key={`${activeLevel}-${s.step}-${s.entityId}`}
                        className={`rounded-2xl border p-4 ${
                          checked ? 'border-green-400/30 bg-green-500/10' : 'border-purple-500/20 bg-black/20'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => setProgress((p) => toggleStep(p, activeLevel, s.entityId))}
                            className="mt-1 h-5 w-5 accent-purple-500"
                            aria-label={`Mark step ${s.step} complete`}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-3">
                              <button
                                onClick={() => onSelectEntity(s.entityId)}
                                className="text-left font-semibold text-white hover:underline"
                              >
                                {s.step}. {e ? entityLabel(e, 'ar') : s.entityId}
                              </button>
                              {e && <div className="text-xs text-purple-200">{typeBadge(e.type)}</div>}
                            </div>
                            <div className="text-sm text-gray-300 mt-1">{s.reason_ar}</div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-4 text-xs text-gray-400">
                  التقدّم محفوظ تلقائياً في <span className="text-gray-200">localStorage</span> — جرّب إعادة تحميل الصفحة للتأكد.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

