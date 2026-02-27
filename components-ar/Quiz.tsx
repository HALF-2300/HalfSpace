'use client'

import { useState } from 'react'

interface Question {
  question: string
  options: string[]
  correct: number
  explanation: string
}

interface QuizProps {
  questions: Question[]
  title?: string
}

export default function Quiz({ questions, title = "اختبار الفضاء" }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [isAnswered, setIsAnswered] = useState(false)

  const handleAnswer = (index: number) => {
    if (isAnswered) return
    
    setSelectedAnswer(index)
    setIsAnswered(true)
    
    if (index === questions[currentQuestion].correct) {
      setScore(score + 1)
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
    } else {
      setShowResult(true)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setScore(0)
    setShowResult(false)
    setIsAnswered(false)
  }

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100)
    return (
      <div className="glass rounded-2xl p-8 text-center border border-purple-500/20">
        <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-4">
          اكتمل الاختبار! 🎉
        </h3>
        <div className="text-6xl mb-4">
          {percentage >= 80 ? '🚀' : percentage >= 60 ? '⭐' : '🌙'}
        </div>
        <p className="text-2xl text-white mb-2">
          حصلت على {score} من {questions.length}
        </p>
        <p className="text-xl text-gray-300 mb-6">
          {percentage}% صحيح
        </p>
        <button
          onClick={resetQuiz}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white font-semibold hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all glow-purple"
        >
          حاول مرة أخرى
        </button>
      </div>
    )
  }

  const question = questions[currentQuestion]

  return (
    <div className="glass rounded-2xl p-8 border border-purple-500/20">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <div className="flex items-center gap-2 text-gray-400">
          <span>السؤال {currentQuestion + 1} من {questions.length}</span>
          <div className="flex-1 h-2 bg-space-deep rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <h4 className="text-xl text-white mb-6 leading-relaxed">{question.question}</h4>

      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => {
          const isCorrect = index === question.correct
          const isSelected = selectedAnswer === index
          let bgClass = 'bg-space-deep border-gray-700'
          
          if (isAnswered) {
            if (isCorrect) {
              bgClass = 'bg-green-500/20 border-green-500'
            } else if (isSelected && !isCorrect) {
              bgClass = 'bg-red-500/20 border-red-500'
            }
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={isAnswered}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${bgClass} ${
                !isAnswered ? 'hover:border-purple-500 hover:bg-purple-500/10 cursor-pointer' : 'cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold text-gray-400 w-8">
                  {String.fromCharCode(65 + index)}.
                </span>
                <span className="text-white">{option}</span>
                {isAnswered && isCorrect && (
                  <span className="ml-auto text-2xl">✓</span>
                )}
                {isAnswered && isSelected && !isCorrect && (
                  <span className="ml-auto text-2xl">✗</span>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {isAnswered && (
        <div className="mb-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
          <p className="text-blue-300">
            <strong>شرح:</strong> {question.explanation}
          </p>
        </div>
      )}

      {isAnswered && (
        <button
          onClick={nextQuestion}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white font-semibold hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all"
        >
          {currentQuestion < questions.length - 1 ? 'السؤال التالي' : 'عرض النتائج'}
        </button>
      )}
    </div>
  )
}

