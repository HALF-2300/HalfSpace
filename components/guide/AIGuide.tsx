'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './Guide.module.css'
import {
  generateExplanation,
  generateQuiz,
  findConnections,
  ExplanationLevel,
  QuizQuestion,
  Connection
} from '@/lib/aiGuide'
import { useShortcuts } from '@/components/keyboard'

interface AIGuideProps {
  pageId: string
  pageName?: string
}

export default function AIGuide({ pageId, pageName }: AIGuideProps) {
  const { showGuide, setShowGuide } = useShortcuts()
  const [activeTab, setActiveTab] = useState<'explain' | 'quiz' | 'connect'>('explain')
  const [explanationLevel, setExplanationLevel] = useState<ExplanationLevel>('standard')
  const [explanation, setExplanation] = useState('')
  const [quiz, setQuiz] = useState<QuizQuestion[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [quizState, setQuizState] = useState<Record<string, number | null>>({})
  const [quizScore, setQuizScore] = useState<number | null>(null)

  useEffect(() => {
    if (showGuide && pageId) {
      // Load content
      setExplanation(generateExplanation(pageId, explanationLevel))
      setQuiz(generateQuiz(pageId, 4))
      setConnections(findConnections(pageId, 4))
      setQuizState({})
      setQuizScore(null)
    }
  }, [showGuide, pageId, explanationLevel])

  const handleLevelChange = (level: ExplanationLevel) => {
    setExplanationLevel(level)
    setExplanation(generateExplanation(pageId, level))
  }

  const handleQuizAnswer = (questionId: string, answerIndex: number) => {
    setQuizState(prev => ({ ...prev, [questionId]: answerIndex }))
  }

  const handleCheckAnswers = () => {
    let correct = 0
    quiz.forEach(q => {
      if (quizState[q.id] === q.correctIndex) {
        correct++
      }
    })
    setQuizScore(correct)
  }

  if (!showGuide) {
    return (
      <button 
        className={styles.floatingButton}
        onClick={() => setShowGuide(true)}
        title="Open AI Guide (G)"
      >
        <span className={styles.buttonIcon}>🤖</span>
        <span className={styles.buttonLabel}>Guide</span>
        <kbd className={styles.buttonKey}>G</kbd>
      </button>
    )
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <span className={styles.headerIcon}>🤖</span>
          <div>
            <h2 className={styles.title}>AI Guide</h2>
            {pageName && <p className={styles.subtitle}>{pageName}</p>}
          </div>
        </div>
        <button className={styles.closeButton} onClick={() => setShowGuide(false)}>
          ✕
        </button>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'explain' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('explain')}
        >
          💡 Explain
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'quiz' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('quiz')}
        >
          🧠 Quiz
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'connect' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('connect')}
        >
          🔗 Connect
        </button>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {activeTab === 'explain' && (
          <div className={styles.explainTab}>
            <div className={styles.levelSelector}>
              <span className={styles.levelLabel}>Explain like I&apos;m:</span>
              <div className={styles.levelButtons}>
                <button
                  className={`${styles.levelButton} ${explanationLevel === 'simple' ? styles.levelActive : ''}`}
                  onClick={() => handleLevelChange('simple')}
                >
                  12 👶
                </button>
                <button
                  className={`${styles.levelButton} ${explanationLevel === 'standard' ? styles.levelActive : ''}`}
                  onClick={() => handleLevelChange('standard')}
                >
                  18 🎓
                </button>
                <button
                  className={`${styles.levelButton} ${explanationLevel === 'advanced' ? styles.levelActive : ''}`}
                  onClick={() => handleLevelChange('advanced')}
                >
                  College 🔬
                </button>
              </div>
            </div>

            <div className={styles.explanationBox}>
              {explanation.split('\n').map((line, i) => (
                <p key={i} className={styles.explanationText}>{line}</p>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className={styles.quizTab}>
            {quiz.length === 0 ? (
              <p className={styles.emptyState}>No quiz available for this page.</p>
            ) : (
              <>
                {quiz.map((question, qIndex) => (
                  <div key={question.id} className={styles.quizQuestion}>
                    <p className={styles.questionText}>
                      {qIndex + 1}. {question.question}
                    </p>
                    <div className={styles.options}>
                      {question.options.map((option, oIndex) => {
                        const isSelected = quizState[question.id] === oIndex
                        const isCorrect = quizScore !== null && oIndex === question.correctIndex
                        const isWrong = quizScore !== null && isSelected && oIndex !== question.correctIndex

                        return (
                          <button
                            key={oIndex}
                            className={`${styles.option} 
                              ${isSelected ? styles.optionSelected : ''} 
                              ${isCorrect ? styles.optionCorrect : ''} 
                              ${isWrong ? styles.optionWrong : ''}`}
                            onClick={() => handleQuizAnswer(question.id, oIndex)}
                            disabled={quizScore !== null}
                          >
                            <span className={styles.optionLetter}>
                              {String.fromCharCode(65 + oIndex)}
                            </span>
                            <span className={styles.optionText}>{option}</span>
                          </button>
                        )
                      })}
                    </div>
                    {quizScore !== null && quizState[question.id] !== question.correctIndex && (
                      <p className={styles.questionExplanation}>{question.explanation}</p>
                    )}
                  </div>
                ))}

                {quizScore === null ? (
                  <button 
                    className={styles.checkButton}
                    onClick={handleCheckAnswers}
                    disabled={Object.keys(quizState).length < quiz.length}
                  >
                    Check Answers
                  </button>
                ) : (
                  <div className={styles.scoreCard}>
                    <span className={styles.scoreIcon}>
                      {quizScore === quiz.length ? '🎉' : quizScore >= quiz.length / 2 ? '👍' : '📚'}
                    </span>
                    <span className={styles.scoreText}>
                      You got {quizScore}/{quiz.length} correct!
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'connect' && (
          <div className={styles.connectTab}>
            <p className={styles.connectIntro}>
              Based on what you&apos;re exploring, you might also like:
            </p>
            <div className={styles.connectionList}>
              {connections.map((connection) => (
                <Link
                  key={connection.id}
                  href={connection.url}
                  className={styles.connectionCard}
                  onClick={() => setShowGuide(false)}
                >
                  <span className={styles.connectionIcon}>{connection.icon}</span>
                  <div className={styles.connectionInfo}>
                    <span className={styles.connectionName}>{connection.name}</span>
                    <span className={styles.connectionReason}>{connection.reason}</span>
                  </div>
                  <span className={styles.connectionArrow}>→</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Floating button only (no panel)
export function AIGuideButton() {
  const { setShowGuide } = useShortcuts()

  return (
    <button 
      className={styles.floatingButton}
      onClick={() => setShowGuide(true)}
      title="Open AI Guide (G)"
    >
      <span className={styles.buttonIcon}>🤖</span>
      <span className={styles.buttonLabel}>Guide</span>
      <kbd className={styles.buttonKey}>G</kbd>
    </button>
  )
}
