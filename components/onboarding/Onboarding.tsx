'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import styles from './Onboarding.module.css'
import { getRandomJump } from '@/lib/jumpEngine'

const ONBOARDING_KEY = 'halfspace_onboarding_complete'

interface OnboardingStep {
  key: string
  title: string
  description: string
  icon: string
  action: string
  keyHint: string
}

const STEPS: OnboardingStep[] = [
  {
    key: 'launch',
    title: 'Launch into Space',
    description: 'Press J to jump to a random discovery',
    icon: '🚀',
    action: 'Press J or tap to jump',
    keyHint: 'J'
  },
  {
    key: 'guide',
    title: 'Your AI Guide',
    description: 'Press G for explanations, quizzes, and connections',
    icon: '🤖',
    action: 'Press G or tap to open',
    keyHint: 'G'
  },
  {
    key: 'save',
    title: 'Save Discoveries',
    description: 'Press S to save anything to your collections',
    icon: '⭐',
    action: 'Press S or tap to save',
    keyHint: 'S'
  },
  {
    key: 'journey',
    title: 'Start a Journey',
    description: 'Guided adventures personalized for you',
    icon: '🌙',
    action: 'Let\'s go!',
    keyHint: ''
  }
]

export default function Onboarding() {
  const router = useRouter()
  const [show, setShow] = useState(false)
  const [step, setStep] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [demoAction, setDemoAction] = useState<string | null>(null)

  useEffect(() => {
    // Check if onboarding already completed
    if (typeof window !== 'undefined') {
      const completed = localStorage.getItem(ONBOARDING_KEY)
      if (!completed) {
        // Small delay for page to settle
        setTimeout(() => setShow(true), 500)
      }
    }
  }, [])

  const handleStepAction = useCallback(() => {
    setAnimating(true)
    setDemoAction(STEPS[step].key)

    setTimeout(() => {
      setAnimating(false)
      setDemoAction(null)

      if (step < STEPS.length - 1) {
        setStep(s => s + 1)
      } else {
        // Complete onboarding
        localStorage.setItem(ONBOARDING_KEY, 'true')
        setShow(false)
        // Navigate to journey
        router.push('/journey')
      }
    }, 800)
  }, [step, router])

  const handleSkip = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true')
    setShow(false)
  }

  // Keyboard handler
  useEffect(() => {
    if (!show) return

    const handleKey = (e: KeyboardEvent) => {
      const currentStep = STEPS[step]
      
      if (e.key.toLowerCase() === currentStep.keyHint.toLowerCase() || e.key === 'Enter') {
        e.preventDefault()
        handleStepAction()
      } else if (e.key === 'Escape') {
        handleSkip()
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [show, step, handleStepAction])

  if (!show) return null

  const currentStep = STEPS[step]

  return (
    <div className={styles.overlay}>
      {/* Demo visual feedback */}
      {demoAction === 'launch' && (
        <div className={styles.demoJump}>
          <span>🚀</span>
          <span className={styles.demoText}>Jumping...</span>
        </div>
      )}
      {demoAction === 'guide' && (
        <div className={styles.demoGuide}>
          <span>🤖</span>
          <span className={styles.demoText}>AI Guide opened</span>
        </div>
      )}
      {demoAction === 'save' && (
        <div className={styles.demoSave}>
          <span>⭐</span>
          <span className={styles.demoText}>Saved!</span>
        </div>
      )}

      <div className={styles.modal}>
        {/* Progress dots */}
        <div className={styles.progress}>
          {STEPS.map((_, i) => (
            <div 
              key={i} 
              className={`${styles.dot} ${i === step ? styles.dotActive : ''} ${i < step ? styles.dotComplete : ''}`}
            />
          ))}
        </div>

        {/* Step content */}
        <div className={styles.content}>
          <span className={styles.icon}>{currentStep.icon}</span>
          <h2 className={styles.title}>{currentStep.title}</h2>
          <p className={styles.description}>{currentStep.description}</p>
        </div>

        {/* Action button */}
        <button 
          className={`${styles.actionButton} ${animating ? styles.actionAnimating : ''}`}
          onClick={handleStepAction}
        >
          {currentStep.keyHint && (
            <kbd className={styles.keyHint}>{currentStep.keyHint}</kbd>
          )}
          <span>{currentStep.action}</span>
        </button>

        {/* Skip */}
        <button className={styles.skipButton} onClick={handleSkip}>
          Skip intro
        </button>
      </div>

      {/* Step indicator */}
      <div className={styles.stepIndicator}>
        {step + 1} / {STEPS.length}
      </div>
    </div>
  )
}

// Hero component for landing page
export function LaunchHero() {
  const router = useRouter()
  const [isLaunching, setIsLaunching] = useState(false)

  const handleLaunch = () => {
    setIsLaunching(true)
    const destination = getRandomJump()
    
    setTimeout(() => {
      if (destination) {
        router.push(destination.url)
      }
    }, 400)
  }

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'j' && !e.ctrlKey && !e.metaKey) {
        // Let the global handler deal with it, but add visual feedback
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <div className={styles.heroSection}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          Your Universe Awaits
        </h1>
        <p className={styles.heroSubtitle}>
          Jump into space discoveries. No searching, no scrolling — just launch.
        </p>
        
        <button 
          className={`${styles.launchButton} ${isLaunching ? styles.launching : ''}`}
          onClick={handleLaunch}
        >
          <span className={styles.launchIcon}>🚀</span>
          <span className={styles.launchText}>Press J to Launch</span>
          <kbd className={styles.launchKey}>J</kbd>
        </button>

        <div className={styles.heroHints}>
          <span className={styles.heroHint}>
            <kbd>/</kbd> Search
          </span>
          <span className={styles.heroHint}>
            <kbd>?</kbd> All shortcuts
          </span>
        </div>
      </div>
    </div>
  )
}

// Reset onboarding (for testing)
export function resetOnboarding() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ONBOARDING_KEY)
  }
}
