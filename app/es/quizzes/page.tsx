'use client'

import { useState } from 'react'

export default function QuizzesPage() {
  const [quizType, setQuizType] = useState<'quick' | 'full' | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)

  const quickQuiz = {
    questions: [
      {
        question: 'ما هو أكبر كوكب في المجموعة الشمسية؟',
        options: ['الأرض', 'المشتري', 'زحل', 'نبتون'],
        correct: 1
      },
      {
        question: 'كم يستغرق الضوء للوصول من الشمس إلى الأرض؟',
        options: ['ثانية واحدة', '8 دقائق', 'ساعة', 'يوم'],
        correct: 1
      },
      {
        question: 'ما هو أقرب نجم إلى الأرض بعد الشمس؟',
        options: ['سيريوس', 'بروكسيما سنتوري', 'فيجا', 'أركتوروس'],
        correct: 1
      },
    ]
  }

  const fullQuiz = {
    questions: [
      {
        question: 'ما هو أكبر كوكب في المجموعة الشمسية؟',
        options: ['الأرض', 'المشتري', 'زحل', 'نبتون'],
        correct: 1
      },
      {
        question: 'كم يستغرق الضوء للوصول من الشمس إلى الأرض؟',
        options: ['ثانية واحدة', '8 دقائق', 'ساعة', 'يوم'],
        correct: 1
      },
      {
        question: 'ما هو أقرب نجم إلى الأرض بعد الشمس؟',
        options: ['سيريوس', 'بروكسيما سنتوري', 'فيجا', 'أركتوروس'],
        correct: 1
      },
      {
        question: 'ما هو لون النجم الأكثر حرارة؟',
        options: ['أحمر', 'أصفر', 'أزرق', 'أبيض'],
        correct: 2
      },
      {
        question: 'كم عدد الكواكب في المجموعة الشمسية؟',
        options: ['7', '8', '9', '10'],
        correct: 1
      },
      {
        question: 'ما هو اسم أكبر قمر للمشتري؟',
        options: ['أوروبا', 'جانيميد', 'آيو', 'كاليستو'],
        correct: 1
      },
      {
        question: 'ما هو نوع مجرة درب التبانة؟',
        options: ['إهليلجية', 'حلزونية', 'غير منتظمة', 'عدسية'],
        correct: 1
      },
      {
        question: 'كم يستغرق القمر للدوران حول الأرض؟',
        options: ['يوم واحد', 'أسبوع', 'شهر', 'سنة'],
        correct: 2
      },
      {
        question: 'ما هو اسم أول رائد فضاء؟',
        options: ['نيل أرمسترونغ', 'يوري جاجارين', 'جون غلين', 'ألان شيبرد'],
        correct: 1
      },
      {
        question: 'ما هو أبعد كوكب عن الشمس؟',
        options: ['أورانوس', 'نبتون', 'بلوتو', 'سيريس'],
        correct: 1
      },
    ]
  }

  const currentQuiz = quizType === 'quick' ? quickQuiz : fullQuiz
  const question = currentQuiz.questions[currentQuestion]

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index)
    if (index === question.correct) {
      setScore(score + 1)
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < currentQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
    } else {
      setShowResult(true)
    }
  }

  const getTitle = (percentage: number) => {
    if (percentage >= 90) return 'عالم فضاء خبير 🌟'
    if (percentage >= 70) return 'مستكشف فضاء ممتاز 🚀'
    if (percentage >= 50) return 'متعلم فضاء جيد ⭐'
    return 'مبتدئ في الفضاء 🌙'
  }

  const getSuggestions = (percentage: number) => {
    if (percentage >= 70) return 'أنت ممتاز في الفضاء! جرّب الثقوب السوداء أو المجرات.'
    return 'استمر في التعلم! جرّب صفحة الكواكب أو المهمات الفضائية.'
  }

  const resetQuiz = () => {
    setQuizType(null)
    setCurrentQuestion(0)
    setScore(0)
    setShowResult(false)
    setSelectedAnswer(null)
  }

  if (!quizType) {
    return (
      <div className="pt-20 relative min-h-screen">
        <section className="py-12 px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient">
            الاختبارات
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            اختبر معلوماتك عن الفضاء
          </p>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <button
              onClick={() => setQuizType('quick')}
              className="glass rounded-2xl p-12 border-2 border-purple-500/30 hover:border-purple-500/70 transition-all hover-lift"
            >
              <div className="text-6xl mb-4">⚡</div>
              <h2 className="text-3xl font-bold text-white mb-4">اختبار سريع</h2>
              <p className="text-gray-300 mb-4">3 أسئلة</p>
              <p className="text-gray-400">اختبر معلوماتك بسرعة</p>
            </button>

            <button
              onClick={() => setQuizType('full')}
              className="glass rounded-2xl p-12 border-2 border-purple-500/30 hover:border-purple-500/70 transition-all hover-lift"
            >
              <div className="text-6xl mb-4">🎯</div>
              <h2 className="text-3xl font-bold text-white mb-4">اختبار قسم كامل</h2>
              <p className="text-gray-300 mb-4">10 أسئلة</p>
              <p className="text-gray-400">اختبر معرفتك الشاملة</p>
            </button>
          </div>
        </section>
      </div>
    )
  }

  if (showResult) {
    const percentage = (score / currentQuiz.questions.length) * 100
    return (
      <div className="pt-20 relative min-h-screen flex items-center justify-center px-4">
        <div className="max-w-2xl mx-auto glass rounded-3xl p-12 border border-purple-500/30 text-center">
          <div className="text-8xl mb-6">🎉</div>
          <h2 className="text-4xl font-bold text-gradient mb-4">{getTitle(percentage)}</h2>
          <div className="text-6xl font-bold text-white mb-4">{percentage.toFixed(0)}%</div>
          <p className="text-xl text-gray-300 mb-6">
            {score} من {currentQuiz.questions.length} إجابة صحيحة
          </p>
          <p className="text-gray-400 mb-8">{getSuggestions(percentage)}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={resetQuiz}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-bold hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              اختبار جديد
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="px-8 py-4 glass border border-purple-500/30 rounded-xl text-white hover:bg-purple-500/20 transition-all"
            >
              العودة للرئيسية
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 relative min-h-screen flex items-center justify-center px-4">
      <div className="max-w-3xl mx-auto w-full">
        <div className="glass rounded-3xl p-8 border border-purple-500/30">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>سؤال {currentQuestion + 1} من {currentQuiz.questions.length}</span>
              <span>النقاط: {score}</span>
            </div>
            <div className="w-full bg-space-deep rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${((currentQuestion + 1) / currentQuiz.questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <h2 className="text-3xl font-bold text-white mb-8">{question.question}</h2>

          {/* Options */}
          <div className="space-y-4 mb-8">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => !selectedAnswer && handleAnswer(index)}
                disabled={selectedAnswer !== null}
                className={`w-full text-right px-6 py-4 rounded-xl transition-all ${
                  selectedAnswer === index
                    ? index === question.correct
                      ? 'bg-green-500/20 border-2 border-green-500'
                      : 'bg-red-500/20 border-2 border-red-500'
                    : selectedAnswer !== null && index === question.correct
                    ? 'bg-green-500/20 border-2 border-green-500'
                    : 'glass border border-purple-500/30 hover:bg-purple-500/20 hover:border-purple-500/70'
                } ${selectedAnswer !== null ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <span className="text-white text-lg">{option}</span>
              </button>
            ))}
          </div>

          {/* Next Button */}
          {selectedAnswer !== null && (
            <button
              onClick={nextQuestion}
              className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-bold hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              {currentQuestion < currentQuiz.questions.length - 1 ? 'السؤال التالي →' : 'انظر النتيجة'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

