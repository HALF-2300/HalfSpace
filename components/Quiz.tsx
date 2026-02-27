'use client'

import { useEffect, useState } from 'react'
import { emitSpaceEvent, onSpaceEvent } from '@/lib/space/recorder/eventBus'

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

export default function Quiz({ questions, title = "Space Quiz" }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [isAnswered, setIsAnswered] = useState(false)

  useEffect(() => {
    const unsubscribe = onSpaceEvent((event) => {
      if (!event.meta?.replay || event.type !== 'quiz_answer') return
      const payload = event.payload as any
      if (!payload || payload.quizTitle !== title) return

      if (payload.action === 'reset') {
        resetQuiz()
        return
      }

      if (payload.action === 'answer' && typeof payload.answerIndex === 'number') {
        setCurrentQuestion(payload.questionIndex)
        setSelectedAnswer(payload.answerIndex)
        setIsAnswered(true)
        if (payload.correct) {
          setScore((prev) => prev + 1)
        }
        return
      }

      if (payload.action === 'next') {
        if (payload.questionIndex < questions.length) {
          setCurrentQuestion(payload.questionIndex)
          setSelectedAnswer(null)
          setIsAnswered(false)
          setShowResult(payload.questionIndex >= questions.length - 1 && isAnswered)
        } else {
          setShowResult(true)
        }
      }
    })
    return unsubscribe
  }, [questions.length, title, isAnswered])

  const handleAnswer = (index: number) => {
    if (isAnswered) return
    
    setSelectedAnswer(index)
    setIsAnswered(true)
    emitSpaceEvent('quiz_answer', {
      quizTitle: title,
      questionIndex: currentQuestion,
      answerIndex: index,
      action: 'answer',
      correct: index === questions[currentQuestion].correct
    })
    
    if (index === questions[currentQuestion].correct) {
      setScore(score + 1)
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
      emitSpaceEvent('quiz_answer', {
        quizTitle: title,
        questionIndex: currentQuestion + 1,
        action: 'next'
      })
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
    emitSpaceEvent('quiz_answer', {
      quizTitle: title,
      questionIndex: 0,
      action: 'reset'
    })
  }

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100)
    let title = ''
    let titleAr = ''
    let emoji = '🌙'
    
    if (percentage >= 90) {
      title = 'Fleet Commander'
      titleAr = 'Fleet Commander'
      emoji = '🚀'
    } else if (percentage >= 80) {
      title = 'Space Expert'
      titleAr = 'Space Expert'
      emoji = '⭐'
    } else if (percentage >= 70) {
      title = 'Astronomer'
      titleAr = 'Astronomer'
      emoji = '🔭'
    } else if (percentage >= 60) {
      title = 'Space Enthusiast'
      titleAr = 'Space Enthusiast'
      emoji = '🌌'
    } else if (percentage >= 50) {
      title = 'Rookie Explorer'
      titleAr = 'Rookie Explorer'
      emoji = '🛸'
    } else {
      title = 'Space Cadet'
      titleAr = 'Space Cadet'
      emoji = '🌙'
    }
    
    return (
      <div className="glass rounded-2xl p-8 text-center border border-purple-500/20">
        <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-4">
          Quiz Complete! 🎉
        </h3>
        <div className="text-6xl mb-4">{emoji}</div>
        <div className="mb-4">
          <div className="text-4xl font-bold text-gradient mb-2">{titleAr}</div>
          <div className="text-xl text-gray-400">{title}</div>
        </div>
        <p className="text-2xl text-white mb-2">
          You scored {score} out of {questions.length}
        </p>
        <p className="text-xl text-gray-300 mb-6">
          {percentage}% Correct
        </p>
        <button
          onClick={resetQuiz}
          aria-label="Reset quiz and try again"
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white font-semibold hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all glow-purple focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-space-dark"
        >
          Try Again
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
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <div className="flex-1 h-2 bg-space-deep rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <h4 className="text-xl text-white mb-6 leading-relaxed">{question.question}</h4>

      <div className="space-y-3 mb-6 max-h-[600px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(139, 92, 246, 0.5) transparent' }}>
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
              aria-label={`Select answer ${String.fromCharCode(65 + index)}: ${option}`}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-space-dark ${bgClass} ${
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
            <strong>Explanation:</strong> {question.explanation}
          </p>
        </div>
      )}

      {isAnswered && (
        <button
          onClick={nextQuestion}
          aria-label={currentQuestion < questions.length - 1 ? 'Go to next question' : 'View quiz results'}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white font-semibold hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-space-dark"
        >
          {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
        </button>
      )}
    </div>
  )
}

