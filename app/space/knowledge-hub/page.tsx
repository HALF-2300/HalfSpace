'use client'

import { useMemo, useState } from 'react'
import CanvasStarfield from '@/components/space/CanvasStarfield'
import SpaceSectionSeparator from '@/components/SpaceSectionSeparator'
import knowledgeData from '@/data/spaceKnowledgeHub.json'
import '@/app/space/space-page.css'

type Section = {
  id: string
  title: string
  summary: string
  bullets: string[]
}

type TimelineItem = {
  title: string
  time: string
  detail: string
}

type GlossaryItem = {
  term: string
  definition: string
}

type QuizItem = {
  question: string
  options: string[]
  answer: number
  explanation: string
}

export default function KnowledgeHubPage() {
  const sections = knowledgeData.sections as Section[]
  const facts = knowledgeData.facts as string[]
  const timeline = knowledgeData.timeline as TimelineItem[]
  const glossary = knowledgeData.glossary as GlossaryItem[]
  const quiz = knowledgeData.quiz as QuizItem[]

  const dailyFact = useMemo(() => {
    if (!facts.length) return ''
    const today = new Date().toDateString()
    const idx = Math.abs(today.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % facts.length
    return facts[idx]
  }, [facts])

  const [fact, setFact] = useState<string>(dailyFact)
  const [answers, setAnswers] = useState<number[]>(Array(quiz.length).fill(-1))
  const [showResult, setShowResult] = useState(false)

  const score = useMemo(() => {
    return answers.reduce((acc, val, idx) => acc + (val === quiz[idx].answer ? 1 : 0), 0)
  }, [answers, quiz])

  const handleRandomFact = () => {
    if (!facts.length) return
    const randomIndex = Math.floor(Math.random() * facts.length)
    setFact(facts[randomIndex])
  }

  const handleAnswer = (questionIdx: number, optionIdx: number) => {
    if (showResult) return
    setAnswers((prev) => prev.map((v, idx) => (idx === questionIdx ? optionIdx : v)))
  }

  const handleSubmit = () => {
    setShowResult(true)
  }

  const handleRetry = () => {
    setAnswers(Array(quiz.length).fill(-1))
    setShowResult(false)
  }

  return (
    <div className="universe-portal min-h-screen relative overflow-hidden">
      <CanvasStarfield intensity="high" />

      <section className="relative z-10 pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-3 px-4 py-2 glass border border-purple-500/40 rounded-full text-sm uppercase tracking-[0.2em] text-purple-200">
            <span>Space Knowledge Hub</span>
            <span className="text-purple-400">|</span>
            <span>الكون واسع جداً</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-gradient space-heading-glow">
            {knowledgeData.hero.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">{knowledgeData.hero.intro}</p>
        </div>
      </section>

      <section className="relative z-10 px-4 pb-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass rounded-3xl border border-purple-500/30 p-6 space-y-4">
            <p className="text-sm uppercase tracking-[0.2em] text-purple-200">Fact of the day</p>
            <p className="text-xl text-white leading-relaxed">{fact}</p>
            <button
              onClick={handleRandomFact}
              className="px-4 py-2 rounded-lg border border-purple-400/60 text-purple-100 hover:border-purple-300 transition-colors text-sm font-semibold"
            >
              Random fact
            </button>
          </div>

          <div className="lg:col-span-2 glass rounded-3xl border border-blue-500/30 p-6 space-y-4">
            <p className="text-sm uppercase tracking-[0.2em] text-blue-200">Timeline</p>
            <div className="space-y-3">
              {timeline.map((item) => (
                <div
                  key={item.title}
                  className="glass rounded-2xl border border-blue-500/30 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                >
                  <div>
                    <h3 className="text-white font-semibold text-lg">{item.title}</h3>
                    <p className="text-gray-300 text-sm">{item.detail}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full border border-blue-400/50 text-blue-100 text-sm">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SpaceSectionSeparator />

      <section className="relative z-10 px-4 pb-12">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient space-heading-glow">
              محاور العلم
            </h2>
            <p className="text-gray-300">
              بدايات الكون، النجوم، المجرات، الثقوب السوداء، الكواكب، والمراصد في مقاطع قصيرة.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {sections.map((section) => (
              <div
                key={section.id}
                className="glass rounded-3xl border border-purple-500/30 p-5 space-y-3 hover:border-purple-400/60 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xl font-bold text-white">{section.title}</h3>
                  <span className="px-3 py-1 rounded-full border border-purple-400/40 text-xs text-purple-200">
                    {section.bullets.length} نقاط
                  </span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{section.summary}</p>
                <ul className="space-y-2">
                  {section.bullets.map((bullet, idx) => (
                    <li key={idx} className="text-gray-200 text-sm flex gap-2">
                      <span className="text-purple-400">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-4 pb-12">
        <div className="max-w-7xl mx-auto glass rounded-3xl border border-emerald-400/30 p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-emerald-200">Glossary</p>
              <h3 className="text-2xl font-bold text-white">مصطلحات فضائية بسرعة</h3>
            </div>
            <span className="px-3 py-1 rounded-full border border-emerald-400/50 text-emerald-100 text-sm">
              {glossary.length} مصطلح
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {glossary.map((item) => (
              <div key={item.term} className="glass rounded-2xl border border-emerald-400/30 p-4 space-y-2">
                <h4 className="text-white font-semibold">{item.term}</h4>
                <p className="text-gray-300 text-sm">{item.definition}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-4 pb-20">
        <div className="max-w-7xl mx-auto glass rounded-3xl border border-orange-400/30 p-6 space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-orange-200">Quiz</p>
              <h3 className="text-2xl font-bold text-white">اختبار خفيف</h3>
            </div>
            <span className="px-3 py-1 rounded-full border border-orange-400/50 text-orange-100 text-sm">
              {quiz.length} أسئلة
            </span>
          </div>

          <div className="space-y-4">
            {quiz.map((item, qIdx) => (
              <div key={item.question} className="glass rounded-2xl border border-orange-400/30 p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-full border border-orange-400 text-orange-200 flex items-center justify-center text-sm font-semibold">
                    {qIdx + 1}
                  </span>
                  <div className="space-y-2">
                    <p className="text-white font-semibold">{item.question}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {item.options.map((option, oIdx) => {
                        const isSelected = answers[qIdx] === oIdx
                        const isCorrect = showResult && oIdx === item.answer
                        const isWrong = showResult && isSelected && oIdx !== item.answer
                        return (
                          <button
                            key={option}
                            onClick={() => handleAnswer(qIdx, oIdx)}
                            className={`text-left px-3 py-2 rounded-lg border text-sm transition-colors ${
                              isCorrect
                                ? 'border-emerald-400 bg-emerald-500/15 text-white'
                                : isWrong
                                ? 'border-rose-400 bg-rose-500/15 text-white'
                                : isSelected
                                ? 'border-orange-300 bg-orange-500/15 text-white'
                                : 'border-orange-400/40 text-gray-200 hover:border-orange-300'
                            }`}
                          >
                            {option}
                          </button>
                        )
                      })}
                    </div>
                    {showResult && (
                      <p className="text-sm text-gray-300 flex gap-2">
                        <span className="text-orange-300">•</span>
                        <span>{item.explanation}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
            <div className="text-white font-semibold">
              النتيجة: {showResult ? `${score} / ${quiz.length}` : '—'}
            </div>
            <div className="flex gap-3">
              {!showResult && (
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 rounded-lg border border-orange-400/70 text-orange-100 hover:border-orange-300 transition-colors text-sm font-semibold"
                >
                  تصحيح الإجابات
                </button>
              )}
              {showResult && (
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 rounded-lg border border-orange-400/70 text-orange-100 hover:border-orange-300 transition-colors text-sm font-semibold"
                >
                  إعادة المحاولة
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
