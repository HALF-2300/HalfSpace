'use client'

import { useState } from 'react'
import CanvasStarfield from '@/components/space/CanvasStarfield'
import SpaceSectionSeparator from '@/components/SpaceSectionSeparator'
import SpaceDataGuard from '@/components/space/SpaceDataGuard'
import academyData from '@/data/spaceAcademy.json'
import quizData from '@/data/spaceAcademyQuizzes.json'
import '@/app/space/space-page.css'

type Step = {
  id: string
  title_en: string
  title_ar: string
  content_en: string
  content_ar: string
  keyNumber: string
  keyNumber_ar: string
  comparison_en: string
  comparison_ar: string
  prerequisite_en: string
  prerequisite_ar: string
  nextStep_en: string
  nextStep_ar: string
}

type Question = {
  id: string
  question_en: string
  question_ar: string
  options_en: string[]
  options_ar: string[]
  correct: number
  explanation_en?: string
  explanation_ar?: string
}

export default function SpaceAcademyPage() {
  const [activePath, setActivePath] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner')
  const [activeStep, setActiveStep] = useState<number>(0)
  const [lang, setLang] = useState<'ar' | 'en'>('ar')
  const [showQuiz, setShowQuiz] = useState<'none' | 'beginner' | 'advanced'>('none')
  const [quizAnswers, setQuizAnswers] = useState<number[]>([])
  const [showQuizResults, setShowQuizResults] = useState(false)

  // Safe data access with fallbacks
  const paths = academyData?.paths || {}
  const currentPath = paths[activePath] || { steps: [] }
  const steps = (currentPath.steps || []) as Step[]
  const currentStep = steps[activeStep] || steps[0]

  const beginnerQuestions = (quizData?.beginner?.questions || []) as Question[]
  const advancedQuestions = (quizData?.advanced?.questions || []) as Question[]
  const currentQuiz = showQuiz === 'beginner' ? beginnerQuestions : advancedQuestions

  // Guard: If no steps available, show empty state
  if (!currentStep || steps.length === 0) {
    return (
      <SpaceDataGuard
        dataSource="spaceAcademy.json"
        requiredFields={['paths']}
      >
        <div className="universe-portal min-h-screen relative overflow-hidden">
          <CanvasStarfield intensity="high" />
          <div className="relative z-10 pt-24 pb-12 px-4">
            <div className="max-w-6xl mx-auto text-center">
              <div className="glass rounded-3xl border border-purple-500/30 p-12">
                <div className="text-6xl mb-4">🛰️</div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  {lang === 'ar' ? 'البيانات غير متوفرة' : 'Data Not Available'}
                </h2>
                <p className="text-gray-300">
                  {lang === 'ar'
                    ? 'لا يمكن تحميل بيانات الأكاديمية حالياً.'
                    : 'Academy data cannot be loaded at this time.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </SpaceDataGuard>
    )
  }

  const handleNextStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1)
    }
  }

  const handleStartQuiz = (quizType: 'beginner' | 'advanced') => {
    setShowQuiz(quizType)
    setQuizAnswers(Array(currentQuiz.length).fill(-1))
    setShowQuizResults(false)
  }

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    if (showQuizResults) return
    const newAnswers = [...quizAnswers]
    newAnswers[questionIndex] = answerIndex
    setQuizAnswers(newAnswers)
  }

  const handleSubmitQuiz = () => {
    setShowQuizResults(true)
  }

  const calculateScore = () => {
    return currentQuiz.reduce((score, question, index) => {
      return score + (quizAnswers[index] === question.correct ? 1 : 0)
    }, 0)
  }

  const resetQuiz = () => {
    setShowQuiz('none')
    setQuizAnswers([])
    setShowQuizResults(false)
  }

  return (
    <SpaceDataGuard
      dataSource="spaceAcademy.json"
      requiredFields={['paths']}
    >
      <div className="universe-portal min-h-screen relative overflow-hidden">
        <CanvasStarfield intensity="high" />

      {/* Hero Section */}
      <section className="relative z-10 pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-3 px-4 py-2 glass border border-purple-500/40 rounded-full text-sm uppercase tracking-[0.2em] text-purple-200">
            <span>Space Academy</span>
            <span className="text-purple-400">|</span>
            <span>أكاديمية الفضاء</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-gradient space-heading-glow">
            {lang === 'ar' ? 'أكاديمية الفضاء' : 'Space Academy'}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
            {lang === 'ar'
              ? 'تعلم علوم الفضاء بطريقة منظمة ومتدرجة - من المبتدئ إلى المتقدم'
              : 'Learn space science in an organized, progressive way - from beginner to advanced'}
          </p>
        </div>
      </section>

      {/* Path Selector */}
      <section className="relative z-10 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-8 flex-wrap">
            <button
              onClick={() => {
                setActivePath('beginner')
                setActiveStep(0)
                setShowQuiz('none')
              }}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                activePath === 'beginner'
                  ? 'glass border-2 border-green-500/60 text-white bg-green-500/20 shadow-lg shadow-green-500/30'
                  : 'glass border border-green-500/30 text-gray-300 hover:border-green-500/50 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>🌱</span>
                <span>{lang === 'ar' ? 'مبتدئ' : 'Beginner'}</span>
                <span className="text-xs opacity-75">(10)</span>
              </span>
            </button>
            <button
              onClick={() => {
                setActivePath('intermediate')
                setActiveStep(0)
                setShowQuiz('none')
              }}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                activePath === 'intermediate'
                  ? 'glass border-2 border-blue-500/60 text-white bg-blue-500/20 shadow-lg shadow-blue-500/30'
                  : 'glass border border-blue-500/30 text-gray-300 hover:border-blue-500/50 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>📚</span>
                <span>{lang === 'ar' ? 'متوسط' : 'Intermediate'}</span>
                <span className="text-xs opacity-75">(12)</span>
              </span>
            </button>
            <button
              onClick={() => {
                setActivePath('advanced')
                setActiveStep(0)
                setShowQuiz('none')
              }}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                activePath === 'advanced'
                  ? 'glass border-2 border-purple-500/60 text-white bg-purple-500/20 shadow-lg shadow-purple-500/30'
                  : 'glass border border-purple-500/30 text-gray-300 hover:border-purple-500/50 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>🚀</span>
                <span>{lang === 'ar' ? 'متقدم' : 'Advanced'}</span>
                <span className="text-xs opacity-75">(15)</span>
              </span>
            </button>
          </div>

          {/* Language Toggle - Hidden until English language is fully implemented */}
          {/* <div className="flex justify-center mb-6">
            <div className="glass rounded-lg border border-purple-500/30 p-1 inline-flex gap-1">
              <button
                onClick={() => setLang('ar')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  lang === 'ar'
                    ? 'bg-purple-500/30 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                العربية
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  lang === 'en'
                    ? 'bg-purple-500/30 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                English
              </button>
            </div>
          </div> */}
        </div>
      </section>

      {/* Main Content */}
      {showQuiz === 'none' ? (
        <section className="relative z-10 px-4 pb-12">
          <div className="max-w-7xl mx-auto">
            {/* Step Navigation */}
            <div className="mb-6 flex items-center justify-between">
              <div className="glass rounded-xl border border-purple-500/30 px-6 py-3">
                <span className="text-sm text-purple-300">
                  {lang === 'ar' ? 'الخطوة' : 'Step'} {activeStep + 1} / {steps.length}
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handlePrevStep}
                  disabled={activeStep === 0}
                  className={`px-4 py-2 rounded-lg border transition-all ${
                    activeStep === 0
                      ? 'border-gray-600 text-gray-600 cursor-not-allowed'
                      : 'border-purple-500/50 text-purple-300 hover:border-purple-500 hover:text-white'
                  }`}
                >
                  {lang === 'ar' ? '← السابق' : '← Previous'}
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={activeStep === steps.length - 1}
                  className={`px-4 py-2 rounded-lg border transition-all ${
                    activeStep === steps.length - 1
                      ? 'border-gray-600 text-gray-600 cursor-not-allowed'
                      : 'border-purple-500/50 text-purple-300 hover:border-purple-500 hover:text-white'
                  }`}
                >
                  {lang === 'ar' ? 'التالي →' : 'Next →'}
                </button>
              </div>
            </div>

            {/* Current Step Content */}
            <div className="glass rounded-3xl border border-purple-500/30 p-8 space-y-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-3xl">
                  {activeStep + 1}
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">
                    {lang === 'ar' ? currentStep.title_ar : currentStep.title_en}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    {lang === 'ar' ? currentPath.description_ar : currentPath.description_en}
                  </p>
                </div>
              </div>

              {/* Main Content */}
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-200 leading-relaxed text-lg whitespace-pre-line">
                  {lang === 'ar' ? currentStep.content_ar : currentStep.content_en}
                </p>
              </div>

              {/* Key Number and Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="glass rounded-xl border border-emerald-500/30 p-4">
                  <div className="text-sm text-emerald-300 mb-2">
                    {lang === 'ar' ? 'رقم/وحدة مهمة' : 'Key Number/Unit'}
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">
                    {lang === 'ar' ? currentStep.keyNumber_ar : currentStep.keyNumber}
                  </div>
                </div>
                <div className="glass rounded-xl border border-blue-500/30 p-4">
                  <div className="text-sm text-blue-300 mb-2">
                    {lang === 'ar' ? 'مقارنة تساعد الفهم' : 'Comparison'}
                  </div>
                  <div className="text-white leading-relaxed">
                    {lang === 'ar' ? currentStep.comparison_ar : currentStep.comparison_en}
                  </div>
                </div>
              </div>

              {/* Prerequisites and Next Steps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-purple-500/20">
                <div className="glass rounded-xl border border-orange-500/30 p-4">
                  <div className="text-sm text-orange-300 mb-2 font-semibold">
                    {lang === 'ar' ? 'قبلها لازم تعرف' : 'Prerequisite'}
                  </div>
                  <div className="text-white">
                    {lang === 'ar' ? currentStep.prerequisite_ar : currentStep.prerequisite_en}
                  </div>
                </div>
                <div className="glass rounded-xl border border-cyan-500/30 p-4">
                  <div className="text-sm text-cyan-300 mb-2 font-semibold">
                    {lang === 'ar' ? 'بعدها اقرأ' : 'Next Step'}
                  </div>
                  <div className="text-white">
                    {lang === 'ar' ? currentStep.nextStep_ar : currentStep.nextStep_en}
                  </div>
                </div>
              </div>
            </div>

            {/* Quiz Buttons */}
            <div className="mt-8 flex justify-center gap-4">
              {activePath === 'beginner' && (
                <button
                  onClick={() => handleStartQuiz('beginner')}
                  className="px-6 py-3 glass rounded-xl border border-green-500/50 text-green-300 hover:border-green-500 hover:text-white transition-all font-semibold"
                >
                  {lang === 'ar' ? 'ابدأ اختبار المبتدئين' : 'Start Beginner Quiz'}
                </button>
              )}
              {activePath === 'advanced' && (
                <button
                  onClick={() => handleStartQuiz('advanced')}
                  className="px-6 py-3 glass rounded-xl border border-purple-500/50 text-purple-300 hover:border-purple-500 hover:text-white transition-all font-semibold"
                >
                  {lang === 'ar' ? 'ابدأ الاختبار المتقدم' : 'Start Advanced Quiz'}
                </button>
              )}
            </div>
          </div>
        </section>
      ) : (
        /* Quiz Section */
        <section className="relative z-10 px-4 pb-12">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gradient">
                {lang === 'ar'
                  ? showQuiz === 'beginner'
                    ? quizData.beginner.title_ar
                    : quizData.advanced.title_ar
                  : showQuiz === 'beginner'
                  ? quizData.beginner.title_en
                  : quizData.advanced.title_en}
              </h2>
              <button
                onClick={resetQuiz}
                className="px-4 py-2 glass rounded-lg border border-gray-500/50 text-gray-300 hover:border-gray-400 hover:text-white transition-all"
              >
                {lang === 'ar' ? 'رجوع' : 'Back'}
              </button>
            </div>

            <div className="space-y-6">
              {currentQuiz.map((question, qIndex) => {
                const isSelected = quizAnswers[qIndex] !== -1
                const isCorrect = quizAnswers[qIndex] === question.correct
                const showExplanation = showQuizResults

                return (
                  <div
                    key={question.id}
                    className={`glass rounded-2xl border p-6 transition-all ${
                      showExplanation
                        ? isCorrect
                          ? 'border-emerald-500/50 bg-emerald-500/10'
                          : 'border-rose-500/50 bg-rose-500/10'
                        : 'border-purple-500/30'
                    }`}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                          showExplanation
                            ? isCorrect
                              ? 'bg-emerald-500/30 text-emerald-300'
                              : 'bg-rose-500/30 text-rose-300'
                            : 'bg-purple-500/30 text-purple-300'
                        }`}
                      >
                        {qIndex + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-4">
                          {lang === 'ar' ? question.question_ar : question.question_en}
                        </h3>
                        <div className="space-y-2">
                          {question.options_en.map((option, oIndex) => {
                            const isSelectedOption = quizAnswers[qIndex] === oIndex
                            const isCorrectOption = oIndex === question.correct
                            const showAsCorrect = showExplanation && isCorrectOption
                            const showAsWrong = showExplanation && isSelectedOption && !isCorrectOption

                            return (
                              <button
                                key={oIndex}
                                onClick={() => handleAnswerSelect(qIndex, oIndex)}
                                disabled={showQuizResults}
                                className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                                  showAsCorrect
                                    ? 'border-emerald-400 bg-emerald-500/20 text-white'
                                    : showAsWrong
                                    ? 'border-rose-400 bg-rose-500/20 text-white'
                                    : isSelectedOption
                                    ? 'border-purple-400 bg-purple-500/20 text-white'
                                    : 'border-purple-500/30 text-gray-300 hover:border-purple-400 hover:text-white'
                                }`}
                              >
                                <span className="font-semibold mr-2">{String.fromCharCode(65 + oIndex)}.</span>
                                {lang === 'ar' ? question.options_ar[oIndex] : option}
                              </button>
                            )
                          })}
                        </div>
                        {showExplanation && question.explanation_en && (
                          <div className="mt-4 pt-4 border-t border-purple-500/20">
                            <div className="text-sm font-semibold text-purple-300 mb-2">
                              {lang === 'ar' ? 'شرح الإجابة:' : 'Explanation:'}
                            </div>
                            <div className="text-gray-300 leading-relaxed">
                              {lang === 'ar' ? question.explanation_ar : question.explanation_en}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-8 flex items-center justify-between">
              <div className="glass rounded-xl border border-purple-500/30 px-6 py-3">
                <span className="text-purple-300">
                  {lang === 'ar' ? 'النتيجة:' : 'Score:'}{' '}
                  {showQuizResults ? (
                    <span className="text-white font-bold">
                      {calculateScore()} / {currentQuiz.length}
                    </span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </span>
              </div>
              <div className="flex gap-3">
                {!showQuizResults ? (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={quizAnswers.some((a) => a === -1)}
                    className={`px-6 py-3 rounded-xl border font-semibold transition-all ${
                      quizAnswers.some((a) => a === -1)
                        ? 'border-gray-600 text-gray-600 cursor-not-allowed'
                        : 'border-purple-500/50 text-purple-300 hover:border-purple-500 hover:text-white bg-purple-500/10'
                    }`}
                  >
                    {lang === 'ar' ? 'تصحيح الإجابات' : 'Submit Answers'}
                  </button>
                ) : (
                  <button
                    onClick={resetQuiz}
                    className="px-6 py-3 rounded-xl border border-purple-500/50 text-purple-300 hover:border-purple-500 hover:text-white transition-all font-semibold"
                  >
                    {lang === 'ar' ? 'إعادة الاختبار' : 'Retake Quiz'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <SpaceSectionSeparator />
      </div>
    </SpaceDataGuard>
  )
}
