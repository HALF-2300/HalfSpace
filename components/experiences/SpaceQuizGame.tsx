'use client'

import { useState, useEffect } from 'react'
import { awardXP } from '@/lib/gameEngine'

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
  xp: number
}

const SPACE_QUESTIONS: Question[] = [
  {
    id: 'q1',
    question: 'What is the closest star to Earth?',
    options: ['Alpha Centauri', 'The Sun', 'Sirius', 'Proxima Centauri'],
    correctAnswer: 1,
    explanation: 'The Sun is our closest star at only 8 light-minutes away!',
    difficulty: 'easy',
    category: 'Stars',
    xp: 50
  },
  {
    id: 'q2',
    question: 'How long does it take light from the Sun to reach Earth?',
    options: ['1 minute', '8 minutes', '1 hour', '1 day'],
    correctAnswer: 1,
    explanation: 'Light from the Sun takes about 8 minutes and 20 seconds to reach Earth.',
    difficulty: 'easy',
    category: 'Solar System',
    xp: 50
  },
  {
    id: 'q3',
    question: 'What is the largest planet in our solar system?',
    options: ['Saturn', 'Jupiter', 'Neptune', 'Uranus'],
    correctAnswer: 1,
    explanation: 'Jupiter is the largest planet - you could fit all other planets inside it!',
    difficulty: 'easy',
    category: 'Planets',
    xp: 50
  },
  {
    id: 'q4',
    question: 'What happens at a black hole\'s event horizon?',
    options: ['Time stops completely', 'Nothing escapes, not even light', 'Matter converts to energy', 'Gravity becomes zero'],
    correctAnswer: 1,
    explanation: 'The event horizon is the point of no return - nothing can escape once it crosses, not even light!',
    difficulty: 'medium',
    category: 'Black Holes',
    xp: 100
  },
  {
    id: 'q5',
    question: 'How old is the universe?',
    options: ['4.6 billion years', '13.8 billion years', '100 billion years', '1 trillion years'],
    correctAnswer: 1,
    explanation: 'The universe is approximately 13.8 billion years old, born from the Big Bang.',
    difficulty: 'medium',
    category: 'Cosmology',
    xp: 100
  },
  {
    id: 'q6',
    question: 'What percentage of the universe is dark energy?',
    options: ['5%', '27%', '68%', '95%'],
    correctAnswer: 2,
    explanation: 'About 68% of the universe is dark energy, 27% is dark matter, and only 5% is normal matter!',
    difficulty: 'hard',
    category: 'Cosmology',
    xp: 150
  },
  {
    id: 'q7',
    question: 'What is a quasar?',
    options: ['A type of star', 'An extremely bright galactic nucleus', 'A planet', 'A nebula'],
    correctAnswer: 1,
    explanation: 'Quasars are incredibly bright and distant galactic nuclei powered by supermassive black holes.',
    difficulty: 'hard',
    category: 'Galaxies',
    xp: 150
  },
  {
    id: 'q8',
    question: 'Which planet has the most moons?',
    options: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'],
    correctAnswer: 1,
    explanation: 'Saturn has 146 known moons, making it the planet with the most moons!',
    difficulty: 'medium',
    category: 'Planets',
    xp: 100
  },
  {
    id: 'q9',
    question: 'What is the name of our galaxy?',
    options: ['Andromeda', 'Milky Way', 'Triangulum', 'Sombrero'],
    correctAnswer: 1,
    explanation: 'We live in the Milky Way galaxy, a barred spiral galaxy with 200-400 billion stars!',
    difficulty: 'easy',
    category: 'Galaxies',
    xp: 50
  },
  {
    id: 'q10',
    question: 'What is Hawking Radiation?',
    options: ['Radiation from stars', 'Radiation that allows black holes to evaporate', 'Solar radiation', 'Cosmic background radiation'],
    correctAnswer: 1,
    explanation: 'Stephen Hawking discovered that black holes can slowly evaporate by emitting radiation!',
    difficulty: 'hard',
    category: 'Black Holes',
    xp: 150
  }
]

export default function SpaceQuizGame() {
  const [isActive, setIsActive] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [totalXP, setTotalXP] = useState(0)
  const [questions, setQuestions] = useState<Question[]>([])
  const [streak, setStreak] = useState(0)
  
  useEffect(() => {
    // Shuffle questions
    const shuffled = [...SPACE_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 5)
    setQuestions(shuffled)
  }, [isActive])
  
  const handleAnswer = (index: number) => {
    if (showResult) return
    
    setSelectedAnswer(index)
    setShowResult(true)
    
    const question = questions[currentQuestion]
    const isCorrect = index === question.correctAnswer
    
    if (isCorrect) {
      setScore(score + 1)
      const streakBonus = streak * 10
      const xpEarned = question.xp + streakBonus
      setTotalXP(totalXP + xpEarned)
      setStreak(streak + 1)
      
      // Award XP in game engine
      awardXP(xpEarned, `Quiz Correct! (${streak + 1}x streak)`)
    } else {
      setStreak(0)
    }
  }
  
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      // Quiz complete!
      const bonusXP = score * 50
      awardXP(bonusXP, `Quiz Complete! ${score}/${questions.length} correct`)
    }
  }
  
  const handleRestart = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setTotalXP(0)
    setStreak(0)
    const shuffled = [...SPACE_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 5)
    setQuestions(shuffled)
  }
  
  if (!isActive) {
    return (
      <button
        onClick={() => setIsActive(true)}
        className="w-full min-h-[300px] bg-gradient-to-br from-green-900/20 via-emerald-900/20 to-teal-900/20 backdrop-blur-sm rounded-2xl border border-green-500/30 hover:border-green-400/50 transition-all duration-300 group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.2)_0%,rgba(0,0,0,1)_100%)]" />
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-8">
          <div className="text-6xl mb-4">🧠</div>
          <h3 className="text-3xl font-bold text-white mb-3">Space Knowledge Quiz</h3>
          <p className="text-gray-300 text-lg mb-4">Test your space knowledge and earn XP!</p>
          <div className="px-6 py-3 bg-green-600 rounded-lg text-white font-bold hover:bg-green-500 transition-all">
            Start Quiz →
          </div>
        </div>
      </button>
    )
  }
  
  if (questions.length === 0) {
    return <div className="text-white">Loading questions...</div>
  }
  
  const question = questions[currentQuestion]
  const isQuizComplete = currentQuestion === questions.length - 1 && showResult
  
  return (
    <div className="relative w-full min-h-[600px] bg-gradient-to-b from-black via-green-900/10 to-black rounded-2xl overflow-hidden p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="glass rounded-lg px-4 py-2">
          <div className="text-white">
            Question {currentQuestion + 1} / {questions.length}
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="glass rounded-lg px-4 py-2">
            <div className="text-green-400 font-bold">
              {streak > 0 && `🔥 ${streak}x Streak`}
              {streak === 0 && 'No Streak'}
            </div>
          </div>
          
          <div className="glass rounded-lg px-4 py-2">
            <div className="text-yellow-400 font-bold">+{totalXP} XP</div>
          </div>
          
          <button
            onClick={() => setIsActive(false)}
            className="px-4 py-2 bg-red-600/80 hover:bg-red-600 rounded-lg text-white font-semibold transition-all"
          >
            Exit
          </button>
        </div>
      </div>
      
      {/* Question */}
      <div className="max-w-3xl mx-auto">
        <div className="glass rounded-2xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              question.difficulty === 'easy' ? 'bg-green-600/30 text-green-300' :
              question.difficulty === 'medium' ? 'bg-yellow-600/30 text-yellow-300' :
              'bg-red-600/30 text-red-300'
            }`}>
              {question.difficulty}
            </span>
            <span className="px-3 py-1 bg-purple-600/30 text-purple-300 rounded-full text-xs">
              {question.category}
            </span>
            <span className="ml-auto text-yellow-400 font-bold">+{question.xp} XP</span>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-6">{question.question}</h2>
          
          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={showResult}
                className={`w-full p-4 rounded-lg text-left transition-all ${
                  showResult
                    ? index === question.correctAnswer
                      ? 'bg-green-600/30 border-2 border-green-500'
                      : index === selectedAnswer
                        ? 'bg-red-600/30 border-2 border-red-500'
                        : 'bg-white/5 opacity-50'
                    : 'bg-white/5 hover:bg-white/10 border border-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    showResult && index === question.correctAnswer
                      ? 'bg-green-500 text-white'
                      : showResult && index === selectedAnswer
                        ? 'bg-red-500 text-white'
                        : 'bg-white/10 text-gray-400'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-white">{option}</span>
                </div>
              </button>
            ))}
          </div>
          
          {/* Explanation */}
          {showResult && (
            <div className={`mt-6 p-4 rounded-lg ${
              selectedAnswer === question.correctAnswer
                ? 'bg-green-600/20 border border-green-500/30'
                : 'bg-red-600/20 border border-red-500/30'
            }`}>
              <div className={`font-bold text-lg mb-2 ${
                selectedAnswer === question.correctAnswer ? 'text-green-400' : 'text-red-400'
              }`}>
                {selectedAnswer === question.correctAnswer ? '✓ Correct!' : '✗ Incorrect'}
              </div>
              <p className="text-gray-300">{question.explanation}</p>
            </div>
          )}
        </div>
        
        {/* Navigation */}
        {showResult && (
          <div className="text-center">
            {!isQuizComplete ? (
              <button
                onClick={handleNext}
                className="px-8 py-4 bg-purple-600 hover:bg-purple-500 rounded-xl text-white font-bold text-lg transition-all"
              >
                Next Question →
              </button>
            ) : (
              <div className="space-y-4">
                <div className="glass rounded-xl p-8">
                  <h2 className="text-4xl font-bold text-gradient mb-4">Quiz Complete! 🎉</h2>
                  <div className="text-6xl font-bold text-white mb-4">{score}/{questions.length}</div>
                  <div className="text-xl text-yellow-400 mb-4">Total XP Earned: +{totalXP}</div>
                  <div className="text-gray-400">
                    {score === questions.length && '🏆 Perfect Score!'}
                    {score >= questions.length * 0.8 && score < questions.length && '⭐ Excellent!'}
                    {score >= questions.length * 0.6 && score < questions.length * 0.8 && '👍 Good Job!'}
                    {score < questions.length * 0.6 && 'Keep learning! 📚'}
                  </div>
                </div>
                
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={handleRestart}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-bold transition-all"
                  >
                    Play Again
                  </button>
                  <button
                    onClick={() => setIsActive(false)}
                    className="px-8 py-3 bg-gray-600 hover:bg-gray-500 rounded-lg text-white font-bold transition-all"
                  >
                    Exit
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
