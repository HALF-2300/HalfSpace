'use client'

import { useState, useMemo } from 'react'
import mythsData from '@/data/myths.json'
import quizData from '@/data/mythQuiz.json'
import CanvasStarfield from '@/components/space/CanvasStarfield'

type Myth = {
  id: string
  category: string
  myth: string
  reality: string
  whyBelieve: string
}

type QuizQuestion = {
  id: string
  question: string
  question_ar: string
  answer: boolean
  explanation: string
  explanation_ar: string
}

const categories = [
  { id: 'all', label: 'All Categories', label_ar: 'جميع الفئات' },
  { id: 'Black holes', label: 'Black Holes', label_ar: 'الثقوب السوداء' },
  { id: 'Stars', label: 'Stars', label_ar: 'النجوم' },
  { id: 'Moon', label: 'Moon', label_ar: 'القمر' },
  { id: 'Planets', label: 'Planets', label_ar: 'الكواكب' },
  { id: 'Time', label: 'Time', label_ar: 'الوقت' },
  { id: 'Space travel', label: 'Space Travel', label_ar: 'السفر في الفضاء' },
]

export default function MythBustersPage() {
  const [lang, setLang] = useState<'en' | 'ar'>('ar')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showQuiz, setShowQuiz] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set())

  const myths = (mythsData as any).myths as Myth[]
  const quizQuestions = (quizData as any).quiz.questions as QuizQuestion[]

  const filteredMyths = useMemo(() => {
    if (selectedCategory === 'all') return myths
    return myths.filter(m => m.category === selectedCategory)
  }, [selectedCategory, myths])

  const handleQuizAnswer = (answer: boolean) => {
    if (answeredQuestions.has(currentQuestion)) return

    setSelectedAnswer(answer)
    setAnsweredQuestions(new Set([...answeredQuestions, currentQuestion]))

    const question = quizQuestions[currentQuestion]
    if (answer === question.answer) {
      setScore(score + 1)
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
    } else {
      setShowResult(true)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setScore(0)
    setShowResult(false)
    setAnsweredQuestions(new Set())
  }

  const startQuiz = () => {
    setShowQuiz(true)
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setScore(0)
    setShowResult(false)
    setAnsweredQuestions(new Set())
  }

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <CanvasStarfield intensity="medium" />

      {/* Main Content */}
      <div className="relative z-10 pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 text-gradient">
              {lang === 'ar' ? 'تصحيح مفاهيم الفضاء' : 'Space MythBusters'}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              {lang === 'ar'
                ? 'افصل الحقيقة عن الخيال واكتشف الحقائق العلمية وراء الخرافات الشائعة'
                : 'Separate fact from fiction and discover the science behind common space myths'}
            </p>

            {/* Language Toggle - Hidden until English language is fully implemented */}
            {/* <div className="flex justify-center gap-4 mb-8">
              <button
                onClick={() => setLang('ar')}
                className={`px-6 py-2 rounded-lg border-2 transition-all ${
                  lang === 'ar'
                    ? 'border-purple-500 bg-purple-500/20 text-white'
                    : 'border-purple-500/30 hover:border-purple-500/50 text-gray-300'
                }`}
              >
                عربي
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-6 py-2 rounded-lg border-2 transition-all ${
                  lang === 'en'
                    ? 'border-purple-500 bg-purple-500/20 text-white'
                    : 'border-purple-500/30 hover:border-purple-500/50 text-gray-300'
                }`}
              >
                English
              </button>
            </div> */}
          </header>

          {/* Quiz Section */}
          {!showQuiz ? (
            <>
              {/* Category Filters */}
              <div className="mb-8 flex flex-wrap justify-center gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      selectedCategory === cat.id
                        ? 'border-purple-500 bg-purple-500/20 text-white'
                        : 'border-purple-500/30 hover:border-purple-500/50 text-gray-300'
                    }`}
                  >
                    {lang === 'ar' ? cat.label_ar : cat.label}
                  </button>
                ))}
              </div>

              {/* Quiz Button */}
              <div className="text-center mb-12">
                <button
                  onClick={startQuiz}
                  className="px-8 py-4 glass rounded-2xl border-2 border-purple-500/50 hover:border-purple-500 text-xl font-bold text-gradient hover:scale-105 transition-all transform shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50"
                >
                  {lang === 'ar' ? 'ابدأ الاختبار' : 'Start Quiz'}
                </button>
              </div>

              {/* Myths Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMyths.map((myth) => (
                  <div
                    key={myth.id}
                    className="glass rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/50 transition-all"
                  >
                    <div className="mb-3">
                      <span className="text-xs uppercase tracking-wide text-purple-300 bg-purple-500/20 px-3 py-1 rounded-full">
                        {myth.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white">
                      {lang === 'ar' ? 'خرافة:' : 'Myth:'}
                    </h3>
                    <p className="text-red-300 mb-4 italic">{myth.myth}</p>
                    <h4 className="text-lg font-semibold mb-2 text-green-300">
                      {lang === 'ar' ? 'الحقيقة:' : 'Reality:'}
                    </h4>
                    <p className="text-gray-200 mb-4 text-sm leading-relaxed">{myth.reality}</p>
                    <div className="pt-3 border-t border-purple-500/20">
                      <p className="text-xs text-gray-400">
                        <span className="font-semibold text-purple-300">
                          {lang === 'ar' ? 'لماذا يعتقد الناس ذلك:' : 'Why people believe it:'}
                        </span>{' '}
                        {myth.whyBelieve}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* Quiz Interface */
            <div className="max-w-4xl mx-auto">
              {!showResult ? (
                <div className="glass rounded-2xl p-8 border border-purple-500/20">
                  {/* Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                      <span>
                        {lang === 'ar' ? 'السؤال' : 'Question'} {currentQuestion + 1} / {quizQuestions.length}
                      </span>
                      <span>
                        {lang === 'ar' ? 'النقاط:' : 'Score:'} {score}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Question */}
                  <h2 className="text-2xl md:text-3xl font-bold mb-8 text-white text-center">
                    {lang === 'ar'
                      ? quizQuestions[currentQuestion].question_ar
                      : quizQuestions[currentQuestion].question}
                  </h2>

                  {/* Answer Buttons */}
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <button
                      onClick={() => handleQuizAnswer(true)}
                      disabled={answeredQuestions.has(currentQuestion)}
                      className={`px-8 py-6 rounded-xl border-2 text-xl font-bold transition-all ${
                        selectedAnswer === true
                          ? quizQuestions[currentQuestion].answer === true
                            ? 'border-green-500 bg-green-500/20 text-green-300'
                            : 'border-red-500 bg-red-500/20 text-red-300'
                          : answeredQuestions.has(currentQuestion)
                          ? 'border-gray-600 bg-gray-700/50 text-gray-500 cursor-not-allowed'
                          : 'border-purple-500/30 hover:border-purple-500 bg-purple-500/10 text-white hover:bg-purple-500/20'
                      }`}
                    >
                      {lang === 'ar' ? 'صحيح' : 'True'}
                    </button>
                    <button
                      onClick={() => handleQuizAnswer(false)}
                      disabled={answeredQuestions.has(currentQuestion)}
                      className={`px-8 py-6 rounded-xl border-2 text-xl font-bold transition-all ${
                        selectedAnswer === false
                          ? quizQuestions[currentQuestion].answer === false
                            ? 'border-green-500 bg-green-500/20 text-green-300'
                            : 'border-red-500 bg-red-500/20 text-red-300'
                          : answeredQuestions.has(currentQuestion)
                          ? 'border-gray-600 bg-gray-700/50 text-gray-500 cursor-not-allowed'
                          : 'border-purple-500/30 hover:border-purple-500 bg-purple-500/10 text-white hover:bg-purple-500/20'
                      }`}
                    >
                      {lang === 'ar' ? 'خطأ' : 'False'}
                    </button>
                  </div>

                  {/* Explanation */}
                  {answeredQuestions.has(currentQuestion) && (
                    <div className="mb-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {lang === 'ar'
                          ? quizQuestions[currentQuestion].explanation_ar
                          : quizQuestions[currentQuestion].explanation}
                      </p>
                    </div>
                  )}

                  {/* Next Button */}
                  {answeredQuestions.has(currentQuestion) && (
                    <div className="text-center">
                      <button
                        onClick={nextQuestion}
                        className="px-8 py-3 glass rounded-xl border-2 border-purple-500/50 hover:border-purple-500 text-lg font-semibold text-gradient hover:scale-105 transition-all"
                      >
                        {currentQuestion < quizQuestions.length - 1
                          ? lang === 'ar'
                            ? 'السؤال التالي'
                            : 'Next Question'
                          : lang === 'ar'
                          ? 'عرض النتيجة'
                          : 'Show Results'}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Results */
                <div className="glass rounded-2xl p-8 text-center border border-purple-500/20">
                  <h3 className="text-3xl font-bold text-gradient mb-4">
                    {lang === 'ar' ? 'اكتمل الاختبار! 🎉' : 'Quiz Complete! 🎉'}
                  </h3>
                  <div className="text-6xl mb-4">
                    {score >= 18 ? '🚀' : score >= 15 ? '⭐' : score >= 12 ? '🛸' : '🌙'}
                  </div>
                  <div className="mb-4">
                    <div className="text-4xl font-bold text-gradient mb-2">
                      {score >= 18
                        ? lang === 'ar'
                          ? 'خبير الفضاء'
                          : 'Space Expert'
                        : score >= 15
                        ? lang === 'ar'
                          ? 'مستكشف النجوم'
                          : 'Star Explorer'
                        : score >= 12
                        ? lang === 'ar'
                          ? 'رائد الفضاء'
                          : 'Space Cadet'
                        : lang === 'ar'
                        ? 'مبتدئ'
                        : 'Beginner'}
                    </div>
                  </div>
                  <p className="text-2xl text-white mb-2">
                    {lang === 'ar' ? 'لقد حصلت على' : 'You scored'} {score} {lang === 'ar' ? 'من' : 'out of'}{' '}
                    {quizQuestions.length}
                  </p>
                  <p className="text-xl text-gray-300 mb-6">
                    {Math.round((score / quizQuestions.length) * 100)}% {lang === 'ar' ? 'صحيح' : 'Correct'}
                  </p>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={resetQuiz}
                      className="px-6 py-3 glass rounded-xl border-2 border-purple-500/50 hover:border-purple-500 text-lg font-semibold text-gradient hover:scale-105 transition-all"
                    >
                      {lang === 'ar' ? 'إعادة الاختبار' : 'Retake Quiz'}
                    </button>
                    <button
                      onClick={() => setShowQuiz(false)}
                      className="px-6 py-3 glass rounded-xl border-2 border-blue-500/50 hover:border-blue-500 text-lg font-semibold text-white hover:scale-105 transition-all"
                    >
                      {lang === 'ar' ? 'العودة للخرافات' : 'Back to Myths'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
