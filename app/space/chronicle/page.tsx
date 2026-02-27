/* eslint-disable @next/next/no-img-element */
'use client'

import { chronicleSeries, ChronicleRecord } from '@/data/chronicleRecords'
import { useMemo, useState } from 'react'

type DepthMode = 'surface' | 'deep' | 'math'

const depthModes: { id: DepthMode; label: string; hint: string }[] = [
  { id: 'surface', label: 'وضع السطح', hint: 'شرح مبسّط سريع' },
  { id: 'deep', label: 'وضع العمق', hint: 'سياق أعمق وعلاقات' },
  { id: 'math', label: 'Math / Physics', hint: 'معادلة + تفسير' },
]

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-100">
      {children}
    </span>
  )
}

function RecordCard({
  record,
  depthMode,
  resolveLink,
}: {
  record: ChronicleRecord
  depthMode: DepthMode
  resolveLink: (id: string) => string
}) {
  const depthContent =
    depthMode === 'surface'
      ? record.depth.surface
      : depthMode === 'deep'
        ? record.depth.deep
        : record.depth.math.explanation

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-6 shadow-lg transition hover:-translate-y-1 hover:border-white/15 hover:bg-white/10">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-indigo-500/10 opacity-0 blur-3xl transition group-hover:opacity-100" />

      <div className="relative flex flex-wrap items-center gap-2">
        <Badge>{record.title}</Badge>
        <Badge>الفكرة المحورية</Badge>
        <div className="text-sm text-slate-300">{record.coreIdea}</div>
      </div>

      <div className="relative mt-4 grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-3">
          <div className="text-sm text-amber-200/90">ليش صعب؟</div>
          <p className="text-sm text-slate-200">{record.whyHard}</p>

          <div className="rounded-xl bg-slate-900/60 p-4 border border-white/5">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>
                {depthMode === 'math'
                  ? 'Math / Physics Mode'
                  : depthMode === 'deep'
                    ? 'وضع العمق'
                    : 'وضع السطح'}
              </span>
              {depthMode === 'math' && (
                <span className="font-mono text-teal-200">
                  {record.depth.math.expression}
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-slate-100 leading-relaxed">{depthContent}</p>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-3">
          <div className="rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/70 to-slate-800/60 p-4 shadow-inner">
            <div className="text-xs text-slate-300">رقم واحد مهم</div>
            <div className="text-2xl font-semibold text-sky-200">
              {record.number.value}
              {record.number.unit ? <span className="text-base text-slate-300 ml-1">{record.number.unit}</span> : null}
            </div>
            <p className="mt-1 text-sm text-slate-200">{record.number.comparison}</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-900/70 p-4 space-y-2">
            <div className="text-xs text-slate-300">ينبغي أن تعرف قبل</div>
            <div className="flex flex-wrap gap-2">
              {record.prerequisites.length === 0 ? (
                <Badge>جذرية</Badge>
              ) : (
                record.prerequisites.map((id) => (
                  <Badge key={id}>{resolveLink(id)}</Badge>
                ))
              )}
            </div>
            <div className="text-xs text-slate-300 pt-2">اقرأ بعد</div>
            <div className="flex flex-wrap gap-2">
              {record.followUps.length === 0 ? (
                <Badge>آخر الطريق</Badge>
              ) : (
                record.followUps.map((id) => (
                  <Badge key={id}>{resolveLink(id)}</Badge>
                ))
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {record.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}

function QuizBlock({
  questionId,
  prompt,
  options,
  answer,
  explanation,
  selected,
  onSelect,
}: {
  questionId: string
  prompt: string
  options: string[]
  answer: string
  explanation: string
  selected?: string
  onSelect: (id: string, choice: string) => void
}) {
  const isAnswered = Boolean(selected)
  const correct = selected === answer

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-sm">
      <div className="flex items-center gap-2 text-sm text-slate-200">
        <span className="rounded-full bg-indigo-500/20 px-2 py-1 text-xs text-indigo-100">
          اختبار فهم
        </span>
        <p>{prompt}</p>
      </div>
      <div className="mt-3 grid gap-2 md:grid-cols-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onSelect(questionId, opt)}
            className={`rounded-xl border px-3 py-2 text-left text-sm transition ${
              selected === opt
                ? correct
                  ? 'border-emerald-400/80 bg-emerald-500/10 text-emerald-50'
                  : 'border-rose-400/80 bg-rose-500/10 text-rose-50'
                : 'border-white/10 bg-slate-900/60 text-slate-100 hover:border-white/20 hover:bg-slate-800/60'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      {isAnswered && (
        <div
          className={`mt-3 rounded-xl border p-3 text-sm ${
            correct
              ? 'border-emerald-400/50 bg-emerald-500/10 text-emerald-50'
              : 'border-amber-400/50 bg-amber-500/10 text-amber-50'
          }`}
        >
          <div className="font-semibold">{correct ? 'إجابة صحيحة' : 'توضيح'}</div>
          <p className="mt-1 text-slate-50">{explanation}</p>
        </div>
      )}
    </div>
  )
}

export default function ChroniclePage() {
  const [depthMode, setDepthMode] = useState<DepthMode>('surface')
  const [quizState, setQuizState] = useState<Record<string, string>>({})

  const recordLookup = useMemo(() => {
    const map = new Map<string, { title: string; series: string }>()
    chronicleSeries.forEach((series) => {
      series.records.forEach((record) => {
        map.set(record.id, { title: record.title, series: series.title })
      })
    })
    return map
  }, [])

  const resolveLink = (id: string) => {
    const hit = recordLookup.get(id)
    if (!hit) return id
    return `${hit.title} - ${hit.series}`
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.25),transparent_25%),radial-gradient(circle_at_80%_10%,rgba(14,165,233,0.2),transparent_25%),radial-gradient(circle_at_40%_80%,rgba(56,189,248,0.2),transparent_25%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <Badge>Route جديد</Badge>
            <Badge>/space/chronicle</Badge>
            <Badge>سجل الكون</Badge>
          </div>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            سجل الكون - موسوعة لها معنى
          </h1>
          <p className="max-w-3xl text-lg text-slate-200">
            سجلات متسلسلة تفكك الكون إلى طبقات: سطح سريع، عمق مرتبط، وMath/Physics
            يربط المعادلات بالسرد. كل سجل يشرح لماذا يصعب الفهم وما الرقم الحاسم
            الذي يثبته.
          </p>

          <div className="flex flex-wrap gap-3">
            {depthModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setDepthMode(mode.id)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  depthMode === mode.id
                    ? 'border-cyan-300 bg-cyan-500/20 text-cyan-50'
                    : 'border-white/10 bg-white/5 text-slate-100 hover:border-white/30'
                }`}
              >
                <div className="font-semibold">{mode.label}</div>
                <div className="text-xs text-slate-200/80">{mode.hint}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16 space-y-12">
        {chronicleSeries.map((series) => (
          <section
            key={series.id}
            className="overflow-hidden rounded-3xl border border-white/5 bg-white/5 shadow-2xl"
          >
            <div className={`relative border-b border-white/10 bg-gradient-to-r ${series.color} p-8`}>
              <div className="flex flex-wrap items-center gap-3">
                <Badge>{series.title}</Badge>
                <Badge>{series.records.length} سجل</Badge>
                <Badge>اختبارات فهم: {series.quiz.length}</Badge>
              </div>
              <h2 className="mt-3 text-2xl font-semibold text-white">{series.subtitle}</h2>
              <p className="mt-2 max-w-3xl text-slate-100">
                كل سجل يتدرج من سطح إلى عمق إلى صياغة فيزيائية. بدّل وضع العرض لتقرأ
                السلسلة بنفسك أو مع فريق تعلّم.
              </p>
            </div>

            <div className="space-y-6 p-6">
              {series.records.map((record) => (
                <RecordCard
                  key={record.id}
                  record={record}
                  depthMode={depthMode}
                  resolveLink={resolveLink}
                />
              ))}

              <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-6 shadow-lg">
                <div className="flex items-center gap-3">
                  <Badge>اختبارات فهم</Badge>
                  <p className="text-sm text-slate-200">
                    أسئلة غير تافهة تعكس روح السلسلة ({series.title})
                  </p>
                </div>
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  {series.quiz.map((q) => (
                    <QuizBlock
                      key={q.id}
                      questionId={q.id}
                      prompt={q.prompt}
                      options={q.options}
                      answer={q.answer}
                      explanation={q.explanation}
                      selected={quizState[q.id]}
                      onSelect={(id, choice) =>
                        setQuizState((prev) => ({
                          ...prev,
                          [id]: prev[id] === choice ? '' : choice,
                        }))
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
