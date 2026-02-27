'use client'

import { useEffect, useMemo, useState } from 'react'
import CanvasStarfield from '@/components/space/CanvasStarfield'
import '@/app/space/space-page.css'

import type { ChallengeDef, ChallengesBundle, ChallengeCategory } from './types'
import { runChallenge } from './engine'
import { readHighScore, writeHighScore } from './storage'

type AnswerState =
  | { kind: 'numeric'; value: string }
  | { kind: 'choice'; value: string }

const CATEGORY_LABEL_AR: Record<ChallengeCategory, string> = {
  cosmology: 'كوزمولوجيا',
  stars: 'نجوم',
  orbits: 'مدارات',
  blackholes: 'ثقوب سوداء',
  units: 'تحويل وحدات',
}

function formatNumber(n: number) {
  if (!Number.isFinite(n)) return '—'
  const abs = Math.abs(n)
  if (abs !== 0 && (abs >= 1e6 || abs < 1e-3)) return n.toExponential(6)
  return n.toFixed(6).replace(/0+$/, '').replace(/\.$/, '')
}

export default function SpaceChallengesClient({ bundle }: { bundle: ChallengesBundle }) {
  const challenges = bundle.challenges
  const [selectedId, setSelectedId] = useState<string>(() => challenges[0]?.id ?? '')

  const selected = useMemo(() => challenges.find((c) => c.id === selectedId) ?? challenges[0], [challenges, selectedId])

  const [inputs, setInputs] = useState<Record<string, number>>({})
  const [showSteps, setShowSteps] = useState(false)

  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [solved, setSolved] = useState<Set<string>>(() => new Set())
  const [feedback, setFeedback] = useState<string>('')

  const [answer, setAnswer] = useState<AnswerState>(() => ({ kind: 'numeric', value: '' }))

  useEffect(() => {
    setHighScore(readHighScore())
  }, [])

  useEffect(() => {
    if (!selected) return
    const nextInputs: Record<string, number> = {}
    for (const inp of selected.inputs) nextInputs[inp.key] = inp.default
    setInputs(nextInputs)
    setShowSteps(false)
    setFeedback('')
    setAnswer(selected.answer.kind === 'choice' ? { kind: 'choice', value: '' } : { kind: 'numeric', value: '' })
  }, [selected?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const run = useMemo(() => {
    if (!selected) {
      return {
        outputValue: 0,
        outputLabel_ar: '',
        outputUnit: '',
        explanation_ar: '',
        steps_ar: [],
      }
    }
    return runChallenge(selected, inputs)
  }, [selected, inputs])

  const categoryCounts = useMemo(() => {
    const map = new Map<ChallengeCategory, number>()
    for (const c of challenges) map.set(c.category, (map.get(c.category) ?? 0) + 1)
    return map
  }, [challenges])

  const groups = useMemo(() => {
    const byCat: Record<ChallengeCategory, ChallengeDef[]> = {
      cosmology: [],
      stars: [],
      orbits: [],
      blackholes: [],
      units: [],
    }
    for (const c of challenges) byCat[c.category].push(c)
    return byCat
  }, [challenges])

  const expectedNumeric = typeof run.outputValue === 'number' ? run.outputValue : NaN
  const expectedChoice = typeof run.outputValue === 'string' ? run.outputValue : run.expectedChoice_ar

  const checkAnswer = () => {
    if (!selected) return
    if (solved.has(selected.id)) {
      setFeedback('تم احتساب نقاط هذا التحدي بالفعل في هذه الجلسة.')
      return
    }

    if (selected.answer.kind === 'numeric') {
      const user = Number(answer.kind === 'numeric' ? answer.value : NaN)
      if (!Number.isFinite(user)) {
        setFeedback('أدخل إجابة رقمية صحيحة.')
        return
      }
      const tolPct = selected.answer.tolerance_pct
      const denom = Math.max(1e-12, Math.abs(expectedNumeric))
      const errPct = (Math.abs(user - expectedNumeric) / denom) * 100
      if (errPct <= tolPct) {
        const pts = selected.answer.points
        setSolved((s) => new Set([...s, selected.id]))
        setScore((prev) => {
          const next = prev + pts
          if (next > highScore) {
            setHighScore(next)
            writeHighScore(next)
          }
          return next
        })
        setFeedback(`صحيح! +${pts} نقطة (الخطأ ≈ ${errPct.toFixed(2)}%).`)
      } else {
        setFeedback(`غير دقيق: الخطأ ≈ ${errPct.toFixed(2)}% (المسموح ${tolPct}%).`)
      }
      return
    }

    // choice
    const userChoice = answer.kind === 'choice' ? answer.value : ''
    if (!userChoice) {
      setFeedback('اختر إجابة.')
      return
    }
    const correct = expectedChoice ?? ''
    if (userChoice === correct) {
      const pts = selected.answer.points
      setSolved((s) => new Set([...s, selected.id]))
      setScore((prev) => {
        const next = prev + pts
        if (next > highScore) {
          setHighScore(next)
          writeHighScore(next)
        }
        return next
      })
      setFeedback(`صحيح! +${pts} نقطة.`)
    } else {
      setFeedback(`غير صحيح. الإجابة الصحيحة: ${correct || '—'}`)
    }
  }

  return (
    <div className="universe-portal min-h-screen relative overflow-hidden">
      <CanvasStarfield intensity="high" />

      <section className="relative z-10 pt-24 pb-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-3 text-gradient universe-title space-heading-glow">
              SPACE CHALLENGES
            </h1>
            <p className="text-lg md:text-xl text-gray-200 font-light">تحديات تفكير علمي: مدخلات → ناتج + خطوات حل</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-12 items-start">
            {/* Challenge list */}
            <div className="lg:col-span-4 glass rounded-2xl border border-purple-500/30 p-5">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-purple-300">Challenges</p>
                  <h2 className="text-2xl font-bold text-white">قائمة التحديات</h2>
                </div>
                <div className="text-xs text-gray-300">{challenges.length}+</div>
              </div>

              <div className="rounded-2xl border border-purple-500/20 bg-black/20 p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-200">Score</div>
                  <div className="text-white font-bold">{score}</div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <div className="text-sm text-gray-200">High score</div>
                  <div className="text-purple-200 font-bold">{highScore}</div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => {
                      setScore(0)
                      setSolved(new Set())
                      setFeedback('تم تصفير نقاط الجلسة.')
                    }}
                    className="px-3 py-2 rounded-xl border border-purple-500/30 bg-purple-500/10 text-gray-100 hover:border-purple-500/60 text-sm"
                  >
                    تصفير الجلسة
                  </button>
                </div>
                <div className="mt-2 text-xs text-gray-400">أعلى نتيجة محفوظة في localStorage.</div>
              </div>

              <div className="grid gap-3 max-h-[560px] overflow-auto pr-1">
                {(Object.keys(groups) as ChallengeCategory[]).map((cat) => (
                  <div key={cat}>
                    <div className="text-xs text-purple-200 mb-2">
                      {CATEGORY_LABEL_AR[cat]} <span className="text-gray-400">({categoryCounts.get(cat) ?? 0})</span>
                    </div>
                    <div className="grid gap-2 mb-3">
                      {groups[cat].map((c) => (
                        <button
                          key={c.id}
                          onClick={() => setSelectedId(c.id)}
                          className={`text-left rounded-xl px-4 py-3 border transition ${
                            selected?.id === c.id
                              ? 'border-purple-500 bg-purple-500/15'
                              : 'border-purple-500/20 bg-black/20 hover:border-purple-500/45'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="font-semibold text-white">{c.title_ar}</div>
                            <div className="text-xs text-gray-300">{solved.has(c.id) ? '✓' : ''}</div>
                          </div>
                          <div className="text-xs text-gray-400 mt-1 line-clamp-2">{c.scenario_ar}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Challenge runner */}
            <div className="lg:col-span-8 grid gap-6">
              <div className="glass rounded-2xl border border-purple-500/30 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-purple-300">Mission</p>
                    <h2 className="text-2xl font-bold text-white">{selected?.title_ar}</h2>
                    <p className="text-sm text-gray-300 mt-2">{selected?.scenario_ar}</p>
                  </div>
                  <button
                    onClick={() => setShowSteps((v) => !v)}
                    className="shrink-0 px-4 py-2 rounded-xl border border-purple-500/40 bg-purple-500/10 text-white hover:border-purple-500/70"
                  >
                    {showSteps ? 'إخفاء خطوات الحل' : 'Show solution steps'}
                  </button>
                </div>

                {/* Inputs */}
                <div className="grid gap-4 mt-5 md:grid-cols-2">
                  {selected?.inputs.map((inp) => (
                    <div key={inp.key} className="rounded-2xl border border-purple-500/20 bg-black/20 p-4">
                      <div className="text-sm text-gray-200">{inp.label_ar}</div>
                      <div className="text-xs text-gray-400 mt-1">{inp.unit || '—'}</div>
                      <input
                        type="number"
                        value={inputs[inp.key] ?? inp.default}
                        min={inp.min}
                        max={inp.max}
                        step={inp.step}
                        onChange={(e) =>
                          setInputs((prev) => ({
                            ...prev,
                            [inp.key]: Number(e.target.value),
                          }))
                        }
                        className="mt-3 w-full rounded-xl px-3 py-2 bg-black/40 border border-purple-500/30 text-white"
                      />
                    </div>
                  ))}
                </div>

                {/* Output */}
                <div className="mt-5 rounded-2xl border border-purple-500/20 bg-black/20 p-4">
                  <div className="text-sm text-gray-200 mb-2">النتيجة (Computed)</div>
                  <div className="text-white font-bold text-xl">
                    {typeof run.outputValue === 'number' ? formatNumber(run.outputValue) : run.outputValue}{' '}
                    <span className="text-sm text-gray-300 font-normal">{run.outputUnit || ''}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-2">{run.explanation_ar}</div>
                </div>

                {/* Answer + score */}
                <div className="mt-5 rounded-2xl border border-purple-500/20 bg-black/20 p-4">
                  <div className="text-sm text-gray-200 mb-3">إجابتك (للنقاط)</div>

                  {selected?.answer.kind === 'numeric' ? (
                    <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-end">
                      <div className="flex-1">
                        <div className="text-xs text-gray-400">أدخل قيمة رقمية ({selected.output.unit || '—'})</div>
                        <input
                          value={answer.kind === 'numeric' ? answer.value : ''}
                          onChange={(e) => setAnswer({ kind: 'numeric', value: e.target.value })}
                          type="number"
                          className="mt-2 w-full rounded-xl px-3 py-2 bg-black/40 border border-purple-500/30 text-white"
                        />
                        <div className="text-xs text-gray-500 mt-2">
                          هامش الخطأ المسموح: ±{selected.answer.tolerance_pct}% | النقاط: {selected.answer.points}
                        </div>
                      </div>
                      <button
                        onClick={checkAnswer}
                        className="px-5 py-3 rounded-xl border border-purple-500/40 bg-purple-500/15 text-white hover:border-purple-500/70"
                      >
                        Check answer
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-end">
                      <div className="flex-1">
                        <div className="text-xs text-gray-400">اختر الإجابة</div>
                        <select
                          value={answer.kind === 'choice' ? answer.value : ''}
                          onChange={(e) => setAnswer({ kind: 'choice', value: e.target.value })}
                          className="mt-2 w-full rounded-xl px-3 py-2 bg-black/40 border border-purple-500/30 text-white"
                        >
                          <option value="">—</option>
                          {selected.answer.choices_ar.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                        <div className="text-xs text-gray-500 mt-2">النقاط: {selected.answer.points}</div>
                      </div>
                      <button
                        onClick={checkAnswer}
                        className="px-5 py-3 rounded-xl border border-purple-500/40 bg-purple-500/15 text-white hover:border-purple-500/70"
                      >
                        Check answer
                      </button>
                    </div>
                  )}

                  {feedback && <div className="mt-3 text-sm text-gray-100">{feedback}</div>}
                </div>

                {/* Steps */}
                {showSteps && (
                  <div className="mt-5 rounded-2xl border border-purple-500/20 bg-black/20 p-4">
                    <div className="text-sm text-gray-200 mb-2">خطوات الحل</div>
                    <ol className="list-decimal pl-5 text-sm text-gray-200 grid gap-2">
                      {run.steps_ar.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

