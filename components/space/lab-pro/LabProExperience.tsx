'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  cosmologyTimeline,
  exoplanetCatalog,
  labProQuizBank,
  mythFactCards,
  stellarMassProfiles,
  type CosmologyEra,
  type ExoplanetRecord,
  type MythFactCard,
  type QuizQuestion,
  type StellarMassProfile
} from '@/data/labProData'

const sectionWrapper =
  'glass border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl shadow-purple-500/10 bg-gradient-to-b from-slate-900/70 to-slate-950/80'

const chipClass =
  'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-white/5 border border-white/10 text-sky-200'

const pillButton =
  'px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm text-white'

const accentGradient = 'bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400'

function formatMillionYears(value: number) {
  if (value < 1) return `${Math.round(value * 1000)} kyr`
  if (value < 1000) return `${value.toFixed(0)} Myr`
  return `${(value / 1000).toFixed(1)} Byr`
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="space-y-2 mb-6">
      <div className="flex items-center gap-3">
        <span className={`${chipClass} bg-purple-500/10 text-purple-100`}>Space Science Lab Pro</span>
        <div className="h-px flex-1 bg-gradient-to-r from-purple-500/60 via-cyan-400/60 to-transparent" />
      </div>
      <h2 className="text-3xl md:text-4xl font-bold text-white">{title}</h2>
      <p className="text-slate-200 max-w-3xl">{subtitle}</p>
    </div>
  )
}

function StellarLifecycleSimulator() {
  const [selectedId, setSelectedId] = useState<string>(stellarMassProfiles[1]?.id ?? '')
  const selectedProfile = useMemo<StellarMassProfile | undefined>(
    () => stellarMassProfiles.find((profile) => profile.id === selectedId),
    [selectedId]
  )

  return (
    <div className={sectionWrapper}>
      <SectionHeader
        title="Stellar Lifecycle Simulator"
        subtitle="Pick a stellar mass category to explore how stars evolve, how long each phase lasts, and what their final state becomes."
      />
      <div className="grid gap-4 md:grid-cols-4">
        {stellarMassProfiles.map((profile) => (
          <button
            key={profile.id}
            className={`text-left rounded-2xl border p-4 transition ${
              selectedId === profile.id
                ? 'border-purple-500/70 bg-purple-900/40 shadow-lg shadow-purple-500/20'
                : 'border-white/10 bg-white/5 hover:border-purple-400/40'
            }`}
            onClick={() => setSelectedId(profile.id)}
          >
            <div className="text-xs text-purple-100 mb-1">Mass Range</div>
            <div className="text-lg font-semibold text-white">{profile.label}</div>
            <div className="text-sm text-slate-200">{profile.massRange}</div>
            <div className="mt-2 text-xs text-slate-400">{profile.lifetime}</div>
          </button>
        ))}
      </div>

      {selectedProfile && (
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className={`${chipClass} bg-cyan-500/10 text-cyan-100`}>Summary</div>
            <h3 className="text-2xl font-semibold text-white">{selectedProfile.label}</h3>
            <p className="text-slate-200">{selectedProfile.note}</p>
            <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3">
              <div className="text-sm text-slate-400">Expected lifetime</div>
              <div className="text-lg font-bold text-cyan-300">{selectedProfile.lifetime}</div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            {selectedProfile.stages.map((stage, index) => (
              <div
                key={stage.name}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-col md:flex-row md:items-center gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${accentGradient}`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-sm text-purple-100">{stage.duration}</div>
                    <div className="text-lg font-semibold text-white">{stage.name}</div>
                  </div>
                </div>
                <p className="text-slate-200 flex-1 md:text-base text-sm">{stage.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function CosmologyTimelineExplorer() {
  const [timeMyr, setTimeMyr] = useState<number>(4500)

  const currentEra = useMemo<CosmologyEra>(() => {
    return cosmologyTimeline.reduce((closest, era) => {
      return era.millionYears <= timeMyr && era.millionYears >= closest.millionYears ? era : closest
    }, cosmologyTimeline[0])
  }, [timeMyr])

  return (
    <div className={sectionWrapper}>
      <SectionHeader
        title="Cosmology Timeline Explorer"
        subtitle="Slide through cosmic history from the first fractions of a second to the present day. Content and visuals update with each era."
      />

      <div className="space-y-4">
        <input
          type="range"
          min={0}
          max={13800}
          step={10}
          value={timeMyr}
          onChange={(e) => setTimeMyr(Number(e.target.value))}
          className="w-full accent-purple-500"
        />
        <div className="flex justify-between text-xs text-slate-400">
          <span>0 Myr</span>
          <span>13,800 Myr (Now)</span>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
            <div className={`${chipClass} bg-indigo-500/10 text-indigo-100`}>Era</div>
            <h3 className="text-2xl font-semibold text-white">{currentEra.title}</h3>
            <div className="text-slate-300">{currentEra.subtitle}</div>
            <div className="text-sm text-slate-400">
              Slider set to <span className="text-cyan-200 font-semibold">{formatMillionYears(timeMyr)}</span>
            </div>
            <p className="text-slate-200">{currentEra.description}</p>
          </div>

          <div
            className="rounded-2xl border border-white/10 bg-slate-900/40 overflow-hidden relative min-h-[220px]"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(99,102,241,0.35), rgba(14,165,233,0.25)), url(${currentEra.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
            role="img"
            aria-label={currentEra.title}
          >
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
              <div className="text-xs uppercase tracking-wide text-white/80">Illustration</div>
              <div className="text-lg font-semibold">{currentEra.title}</div>
              <div className="text-sm text-white/80">{currentEra.subtitle}</div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {cosmologyTimeline.map((era) => {
            const active = era.id === currentEra.id
            return (
              <div
                key={era.id}
                className={`rounded-xl border p-3 transition ${
                  active ? 'border-cyan-400/70 bg-cyan-900/30' : 'border-white/10 bg-white/5'
                }`}
              >
                <div className="text-xs text-slate-400">{formatMillionYears(era.millionYears)}</div>
                <div className="text-sm font-semibold text-white">{era.title}</div>
                <div className="text-xs text-slate-300">{era.subtitle}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function ExoplanetFinderDemo() {
  const [sizeFilter, setSizeFilter] = useState<ExoplanetRecord['sizeCategory'] | 'All'>('All')
  const [methodFilter, setMethodFilter] = useState<ExoplanetRecord['detectionMethod'] | 'All'>('All')
  const [distanceFilter, setDistanceFilter] = useState<number>(500)

  const filtered = useMemo(() => {
    return exoplanetCatalog.filter((planet) => {
      const sizeMatch = sizeFilter === 'All' || planet.sizeCategory === sizeFilter
      const methodMatch = methodFilter === 'All' || planet.detectionMethod === methodFilter
      const distanceMatch = planet.distanceLy <= distanceFilter
      return sizeMatch && methodMatch && distanceMatch
    })
  }, [distanceFilter, methodFilter, sizeFilter])

  const availableSizes = Array.from(new Set(exoplanetCatalog.map((p) => p.sizeCategory)))
  const availableMethods = Array.from(new Set(exoplanetCatalog.map((p) => p.detectionMethod)))

  return (
    <div className={sectionWrapper}>
      <SectionHeader
        title="Exoplanet Finder Demo"
        subtitle="Filter a local catalog by size, distance, and discovery method to see which worlds remain in view."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2">
          <div className="text-sm text-slate-300">Size</div>
          <div className="flex flex-wrap gap-2">
            <button
              className={pillButton + (sizeFilter === 'All' ? ' border-purple-400/60 text-white' : '')}
              onClick={() => setSizeFilter('All')}
            >
              All
            </button>
            {availableSizes.map((size) => (
              <button
                key={size}
                className={pillButton + (sizeFilter === size ? ' border-purple-400/60 text-white' : '')}
                onClick={() => setSizeFilter(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2">
          <div className="text-sm text-slate-300">Detection Method</div>
          <div className="flex flex-wrap gap-2">
            <button
              className={pillButton + (methodFilter === 'All' ? ' border-purple-400/60 text-white' : '')}
              onClick={() => setMethodFilter('All')}
            >
              All
            </button>
            {availableMethods.map((method) => (
              <button
                key={method}
                className={pillButton + (methodFilter === method ? ' border-purple-400/60 text-white' : '')}
                onClick={() => setMethodFilter(method)}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2">
          <div className="flex items-center justify-between text-sm text-slate-300">
            <span>Distance ≤ {distanceFilter} ly</span>
            <span className="text-xs text-slate-400">Catalog max: 21,500 ly</span>
          </div>
          <input
            type="range"
            min={10}
            max={21500}
            step={10}
            value={distanceFilter}
            onChange={(e) => setDistanceFilter(Number(e.target.value))}
            className="w-full accent-purple-500"
          />
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((planet) => (
          <div key={planet.name} className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2">
            <div className={`${chipClass} bg-emerald-500/10 text-emerald-100`}>{planet.detectionMethod}</div>
            <h3 className="text-xl font-semibold text-white">{planet.name}</h3>
            <div className="text-sm text-slate-300">
              {planet.sizeCategory} • {planet.hostStar}
            </div>
            <div className="text-sm text-cyan-200">{planet.distanceLy.toLocaleString()} light-years</div>
            <p className="text-slate-200 text-sm">{planet.highlight}</p>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="md:col-span-2 lg:col-span-3 text-center text-slate-300 py-8 rounded-2xl border border-dashed border-white/15">
            No planets match those filters—try widening the distance or switching methods.
          </div>
        )}
      </div>
    </div>
  )
}

function MythFactEngine() {
  const [responses, setResponses] = useState<Record<string, MythFactCard['classification']>>({})

  const score = useMemo(() => {
    return mythFactCards.reduce((acc, card) => {
      const answer = responses[card.id]
      if (!answer) return acc
      return answer === card.classification ? acc + 1 : acc
    }, 0)
  }, [responses])

  const answeredCount = Object.keys(responses).length

  return (
    <div className={sectionWrapper}>
      <SectionHeader
        title="Myth vs Fact Engine"
        subtitle="Decide if each statement is a myth or a fact, then see how your score shifts as you rate them."
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="text-slate-200">
          Rated {answeredCount}/{mythFactCards.length} • Score {score}
        </div>
        <div className="flex gap-2">
          <span className={`${chipClass} bg-emerald-500/10 text-emerald-100`}>Fact</span>
          <span className={`${chipClass} bg-rose-500/10 text-rose-100`}>Myth</span>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {mythFactCards.map((card) => {
          const chosen = responses[card.id]
          const correct = chosen && chosen === card.classification

          return (
            <div
              key={card.id}
              className={`rounded-2xl border p-4 space-y-3 transition ${
                correct ? 'border-emerald-400/60 bg-emerald-900/20' : 'border-white/10 bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs text-slate-400">{card.sourceNote}</div>
                <div className={`${chipClass} ${card.classification === 'Fact' ? 'bg-emerald-500/10 text-emerald-100' : 'bg-rose-500/10 text-rose-100'}`}>
                  {card.classification}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white">{card.claim}</h3>
              <p className="text-slate-200 text-sm">{card.reality}</p>
              <div className="flex gap-2">
                <button
                  className={pillButton + (chosen === 'Myth' ? ' border-rose-400/70 text-white' : '')}
                  onClick={() =>
                    setResponses((prev) => ({
                      ...prev,
                      [card.id]: 'Myth'
                    }))
                  }
                >
                  Myth
                </button>
                <button
                  className={pillButton + (chosen === 'Fact' ? ' border-emerald-400/70 text-white' : '')}
                  onClick={() =>
                    setResponses((prev) => ({
                      ...prev,
                      [card.id]: 'Fact'
                    }))
                  }
                >
                  Fact
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const QUESTIONS_TO_SHOW = 5

function pickRandomQuestions(): QuizQuestion[] {
  return [...labProQuizBank].sort(() => Math.random() - 0.5).slice(0, QUESTIONS_TO_SHOW)
}

function DynamicQuiz() {
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => pickRandomQuestions())
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [showResults, setShowResults] = useState(false)

  const score = useMemo(() => {
    return questions.reduce((acc, question) => {
      const answer = answers[question.id]
      return answer === question.answerIndex ? acc + 1 : acc
    }, 0)
  }, [answers, questions])

  useEffect(() => {
    setAnswers({})
    setShowResults(false)
  }, [questions])

  const allAnswered = questions.every((q) => answers[q.id] !== undefined)

  return (
    <div className={sectionWrapper}>
      <SectionHeader
        title="Adaptive Space Quiz"
        subtitle="Five questions are drawn at random from the Space Science Lab Pro bank. Submit to see your result and review the explanations."
      />

      <div className="space-y-4">
        {questions.map((question, idx) => (
          <div key={question.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className={`${chipClass} bg-cyan-500/10 text-cyan-100`}>Question {idx + 1}</div>
              {showResults && answers[question.id] === question.answerIndex && (
                <span className="text-emerald-300 text-sm">Correct</span>
              )}
              {showResults && answers[question.id] !== question.answerIndex && (
                <span className="text-rose-300 text-sm">Review</span>
              )}
            </div>
            <h3 className="text-lg font-semibold text-white">{question.question}</h3>
            <div className="grid gap-2 md:grid-cols-2">
              {question.choices.map((choice, choiceIdx) => {
                const selected = answers[question.id] === choiceIdx
                const isCorrect = showResults && question.answerIndex === choiceIdx
                const isWrong = showResults && selected && !isCorrect

                return (
                  <button
                    key={choice}
                    className={`rounded-xl border p-3 text-left transition ${
                      isCorrect
                        ? 'border-emerald-400/70 bg-emerald-900/20'
                        : isWrong
                          ? 'border-rose-400/70 bg-rose-900/20'
                          : selected
                            ? 'border-purple-400/70 bg-purple-900/20'
                            : 'border-white/10 bg-white/5 hover:border-purple-400/40'
                    }`}
                    onClick={() =>
                      setAnswers((prev) => ({
                        ...prev,
                        [question.id]: choiceIdx
                      }))
                    }
                  >
                    {choice}
                  </button>
                )
              })}
            </div>
            {showResults && (
              <div className="text-sm text-slate-200">
                Explanation: {question.explanation}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="text-slate-200">
          Score {score}/{QUESTIONS_TO_SHOW}
        </div>
        <div className="flex gap-3">
          <button
            className={`${pillButton} ${allAnswered ? 'border-emerald-400/60 text-white' : 'opacity-60 cursor-not-allowed'}`}
            disabled={!allAnswered}
            onClick={() => setShowResults(true)}
          >
            Submit
          </button>
          <button className={pillButton} onClick={() => setQuestions(pickRandomQuestions())}>
            New Set
          </button>
        </div>
      </div>
    </div>
  )
}

export default function LabProExperience() {
  return (
    <div className="space-y-10">
      <StellarLifecycleSimulator />
      <CosmologyTimelineExplorer />
      <ExoplanetFinderDemo />
      <MythFactEngine />
      <DynamicQuiz />
    </div>
  )
}
