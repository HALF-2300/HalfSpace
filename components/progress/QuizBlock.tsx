'use client'

import { useMemo, useState } from 'react'

interface QuizQuestion {
  q: string
  choices: string[]
  answer: number
}

interface QuizBlockProps {
  title: string
  questions: QuizQuestion[]
}

export default function QuizBlock({ title, questions }: QuizBlockProps) {
  const [answers, setAnswers] = useState<Record<number, number | undefined>>({})
  const [submitted, setSubmitted] = useState(false)

  const score = useMemo(() => {
    if (!submitted) return 0
    return questions.reduce((acc, q, idx) => (answers[idx] === q.answer ? acc + 1 : acc), 0)
  }, [answers, questions, submitted])

  const handleSelect = (qIndex: number, choiceIndex: number) => {
    if (submitted) return
    setAnswers(prev => ({ ...prev, [qIndex]: choiceIndex }))
  }

  const handleSubmit = () => {
    setSubmitted(true)
  }

  return (
    <div className="glass rounded-2xl border border-purple-500/30 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        {submitted && (
          <span className="text-sm text-purple-200">
            Score: {score} / {questions.length}
          </span>
        )}
      </div>

      <div className="space-y-4">
        {questions.map((question, idx) => {
          const selected = answers[idx]
          const isCorrect = selected === question.answer
          return (
            <div key={idx} className="p-3 rounded-xl bg-black/20 border border-purple-500/20 space-y-2">
              <div className="text-white font-medium">{idx + 1}. {question.q}</div>
              <div className="grid md:grid-cols-2 gap-2">
                {question.choices.map((choice, choiceIdx) => {
                  const isChosen = selected === choiceIdx
                  const isAnswer = question.answer === choiceIdx
                  const stateClass = submitted
                    ? isAnswer
                      ? 'border-green-400/70 bg-green-500/10'
                      : isChosen
                        ? 'border-red-400/70 bg-red-500/10'
                        : 'border-purple-500/20 bg-black/10'
                    : isChosen
                      ? 'border-purple-400/70 bg-purple-500/10'
                      : 'border-purple-500/30 bg-black/10'

                  return (
                    <button
                      key={choiceIdx}
                      onClick={() => handleSelect(idx, choiceIdx)}
                      className={`text-left px-3 py-2 rounded-lg border text-sm text-gray-100 transition ${stateClass}`}
                    >
                      {choice}
                    </button>
                  )
                })}
              </div>
              {submitted && (
                <div className="text-xs text-gray-300">
                  Correct answer: {question.choices[question.answer]}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:opacity-90 transition"
        >
          Submit Quiz
        </button>
      )}
      {submitted && (
        <div className="text-center text-purple-200 text-sm">
          Great work! Review any misses above and continue.
        </div>
      )}
    </div>
  )
}
