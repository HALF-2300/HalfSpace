'use client'

import { useMemo, useState } from 'react'
import CanvasStarfield from '@/components/space/CanvasStarfield'
import hubDataRaw from '@/data/spaceKnowledgeHub.json'

type Section = {
  id: string
  title: string
  summary: string
  bullets: string[]
}

type TimelineEntry = {
  title: string
  time: string
  detail: string
}

type GlossaryEntry = {
  term: string
  definition: string
}

type QuizQuestion = {
  question: string
  options: string[]
  answer: number
  explanation: string
}

type HubData = {
  hero: { title: string; tagline: string; intro: string }
  sections: Section[]
  facts: string[]
  timeline: TimelineEntry[]
  glossary: GlossaryEntry[]
  quiz: QuizQuestion[]
}

const hubData = hubDataRaw as HubData

export default function SpaceKnowledgeHubPage() {
  const [factIndex, setFactIndex] = useState(() => Math.floor(Math.random() * hubData.facts.length))
  const [answers, setAnswers] = useState<number[]>(() => Array(hubData.quiz.length).fill(-1))
  const [submitted, setSubmitted] = useState(false)

  const score = useMemo(() => {
    return answers.reduce((total, answer, idx) => {
      return total + (answer === hubData.quiz[idx].answer ? 1 : 0)
    }, 0)
  }, [answers])

  const progress = useMemo(() => {
    const answered = answers.filter(answer => answer >= 0).length
    return Math.round((answered / hubData.quiz.length) * 100)
  }, [answers])

  const handleRandomFact = () => {
    setFactIndex(prev => {
      if (hubData.facts.length === 1) return prev
      let next = prev
      while (next === prev) {
        next = Math.floor(Math.random() * hubData.facts.length)
      }
      return next
    })
  }

  const handleAnswer = (questionIdx: number, optionIdx: number) => {
    if (submitted) return
    setAnswers(prev => {
      const updated = [...prev]
      updated[questionIdx] = optionIdx
      return updated
    })
  }

  const handleSubmit = () => {
    setSubmitted(true)
  }

  const handleRetry = () => {
    setAnswers(Array(hubData.quiz.length).fill(-1))
    setSubmitted(false)
    setFactIndex(Math.floor(Math.random() * hubData.facts.length))
  }

  const resultLabel = useMemo(() => {
    const ratio = score / hubData.quiz.length
    if (ratio === 1) return 'ممتاز! إتقان كامل.'
    if (ratio >= 0.8) return 'رائع! فهم عميق للمحتوى.'
    if (ratio >= 0.5) return 'جيّد، واصل الاستكشاف.'
    return 'جرّب مرة أخرى لترسيخ المفاهيم.'
  }, [score])

  return (
    <div className="relative min-h-screen bg-slate-950 text-gray-100 overflow-hidden">
      <CanvasStarfield intensity="high" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 space-y-14">
        <header className="text-center space-y-4">
          <p className="text-sm uppercase tracking-[0.4em] text-sky-400">Space Knowledge Hub</p>
          <h1 className="text-4xl md:text-6xl font-bold text-white">{hubData.hero.tagline}</h1>
          <p className="text-lg md:text-xl text-slate-200 max-w-3xl mx-auto">{hubData.hero.intro}</p>
          <div className="flex justify-center gap-3 text-sm text-slate-300">
            <span className="px-3 py-1 rounded-full border border-sky-500/40 bg-sky-500/10">بدايات الكون</span>
            <span className="px-3 py-1 rounded-full border border-indigo-500/40 bg-indigo-500/10">نجوم ومجرات</span>
            <span className="px-3 py-1 rounded-full border border-emerald-500/40 bg-emerald-500/10">كواكب وتلسكوبات</span>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          {hubData.sections.map((section, idx) => (
            <SectionCard key={section.id} section={section} index={idx + 1} />
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <FactWidget
            fact={hubData.facts[factIndex]}
            onRandom={handleRandomFact}
          />
          <TimelineWidget entries={hubData.timeline} />
          <GlossaryWidget glossary={hubData.glossary} />
        </section>

        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl shadow-sky-900/30 backdrop-blur">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <p className="text-sm text-sky-300 uppercase tracking-[0.3em]">Quiz</p>
              <h2 className="text-3xl font-bold text-white">اختبار سريع</h2>
              <p className="text-slate-300">أسئلة اختيار من متعدد مع نتيجة فورية.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-24 h-24 rounded-full border border-white/10 bg-slate-900 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-emerald-400">{score}</span>
                <span className="text-xs text-slate-300">/ {hubData.quiz.length}</span>
              </div>
              <div className="text-sm text-slate-200">
                <p className="font-semibold">التقدم: {progress}%</p>
                <p className="text-slate-400">أجب عن كل الأسئلة ثم اضغط إرسال.</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {hubData.quiz.map((question, idx) => (
              <QuestionCard
                key={idx}
                index={idx}
                question={question}
                selected={answers[idx]}
                submitted={submitted}
                onSelect={optionIdx => handleAnswer(idx, optionIdx)}
              />
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={handleSubmit}
              className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold rounded-xl transition shadow-lg shadow-emerald-900/30"
            >
              عرض النتيجة
            </button>
            <button
              onClick={handleRetry}
              className="px-5 py-3 border border-white/20 text-white rounded-xl hover:border-white/40 transition"
            >
              إعادة المحاولة
            </button>
            {submitted && (
              <div className="px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-sm text-slate-100">
                {resultLabel}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

function SectionCard({ section, index }: { section: Section; index: number }) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/30 backdrop-blur">
      <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-sky-500 to-purple-600" aria-hidden />
      <div className="relative z-10 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-[0.3em] text-sky-300">Section {index}</span>
          <span className="px-3 py-1 rounded-full bg-slate-900/60 border border-white/10 text-xs text-white">
            {section.id}
          </span>
        </div>
        <h3 className="text-2xl font-semibold text-white">{section.title}</h3>
        <p className="text-slate-200">{section.summary}</p>
        <ul className="space-y-2 text-slate-100">
          {section.bullets.map((bullet, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}

function FactWidget({ fact, onRandom }: { fact: string; onRandom: () => void }) {
  return (
    <div className="col-span-1 bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-2xl p-5 shadow-lg shadow-sky-900/40 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-amber-300">Fact of the day</p>
          <h3 className="text-xl font-semibold text-white">حقيقة اليوم</h3>
        </div>
        <button
          onClick={onRandom}
          className="px-3 py-2 text-sm bg-amber-400 text-slate-900 font-semibold rounded-lg hover:bg-amber-300 transition"
        >
          عشوائي
        </button>
      </div>
      <p className="text-slate-100 leading-relaxed flex-1">{fact}</p>
      <div className="mt-4 text-xs text-amber-200">المصدر: بيانات محلية داخل الصفحة</div>
    </div>
  )
}

function TimelineWidget({ entries }: { entries: TimelineEntry[] }) {
  return (
    <div className="col-span-1 bg-white/5 border border-white/10 rounded-2xl p-5 shadow-lg shadow-purple-900/40">
      <p className="text-xs uppercase tracking-[0.25em] text-purple-300">Timeline</p>
      <h3 className="text-xl font-semibold text-white mb-4">خط زمني مختصر</h3>
      <div className="space-y-4">
        {entries.map((entry, idx) => (
          <div key={idx} className="relative pl-4">
            <span className="absolute left-0 top-2 h-2 w-2 rounded-full bg-purple-400" aria-hidden />
            <p className="text-sm text-purple-200">{entry.time}</p>
            <p className="text-white font-semibold">{entry.title}</p>
            <p className="text-slate-300 text-sm">{entry.detail}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function GlossaryWidget({ glossary }: { glossary: GlossaryEntry[] }) {
  return (
    <div className="col-span-1 bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 rounded-2xl p-5 shadow-lg shadow-emerald-900/40">
      <p className="text-xs uppercase tracking-[0.25em] text-emerald-300">Glossary</p>
      <h3 className="text-xl font-semibold text-white mb-4">قاموس مصطلحات</h3>
      <div className="grid grid-cols-1 gap-3">
        {glossary.map((item, idx) => (
          <div key={idx} className="rounded-lg bg-white/5 border border-white/5 p-3">
            <p className="text-white font-semibold">{item.term}</p>
            <p className="text-slate-300 text-sm">{item.definition}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function QuestionCard({
  question,
  index,
  selected,
  submitted,
  onSelect
}: {
  question: QuizQuestion
  index: number
  selected: number
  submitted: boolean
  onSelect: (optionIdx: number) => void
}) {
  const isCorrect = submitted && selected === question.answer

  return (
    <article className="rounded-xl border border-white/10 bg-slate-900/80 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-sky-300 uppercase tracking-[0.2em]">Q{index + 1}</p>
          <h4 className="text-lg font-semibold text-white">{question.question}</h4>
        </div>
        {submitted && (
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${
              isCorrect ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/40' : 'bg-rose-500/20 text-rose-200 border border-rose-400/40'
            }`}
          >
            {isCorrect ? 'إجابة صحيحة' : 'إجابة خاطئة'}
          </span>
        )}
      </div>
      <div className="mt-3 grid gap-2">
        {question.options.map((option, optionIdx) => {
          const isChosen = selected === optionIdx
          const isRight = submitted && optionIdx === question.answer
          const base =
            'w-full text-left px-4 py-3 rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-sky-400'
          const state = submitted
            ? isRight
              ? 'border-emerald-500 bg-emerald-500/10 text-emerald-100'
              : isChosen
                ? 'border-rose-400 bg-rose-500/10 text-rose-100'
                : 'border-white/10 bg-slate-800 text-slate-200'
            : isChosen
              ? 'border-sky-400 bg-sky-500/10 text-white'
              : 'border-white/10 bg-slate-800 hover:border-sky-300 text-slate-200'
          return (
            <button
              key={optionIdx}
              onClick={() => onSelect(optionIdx)}
              className={`${base} ${state}`}
              aria-pressed={isChosen}
              disabled={submitted}
            >
              {option}
            </button>
          )
        })}
      </div>
      {submitted && (
        <p className="mt-3 text-sm text-slate-300">
          الشرح: <span className="text-white">{question.explanation}</span>
        </p>
      )}
    </article>
  )
}
