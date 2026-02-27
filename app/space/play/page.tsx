'use client'

import { useMemo, useState } from 'react'
import {
  SpaceBadge,
  SpaceButton,
  SpaceCard,
  SpaceHeroOverlay,
  SpaceModal,
  SpaceSeparator
} from '@/components/space/play-kit'
import styles from './page.module.css'

const playFacts = [
  {
    title: 'Nebula Light',
    description: 'Nebulae glow because young stars ionize surrounding gas, painting the sky in lavender and cyan.',
    badge: 'Glow',
    accent: '✨'
  },
  {
    title: 'Cosmic Classics',
    description: 'The Milky Way hosts over 100 billion stars—let that constellation trivia fuel your curiosity.',
    badge: 'Fact',
    accent: '🌌'
  },
  {
    title: 'Voyager Legacy',
    description: 'Voyager 1 still transmits, proving human-made photons can cross the solar frontier.',
    badge: 'Mission',
    accent: '🛰️'
  }
]

const gameQuestions = [
  {
    type: 'constellation',
    prompt: 'Which constellation proudly shows a “belt” of three bright stars in a row?',
    answer: 'Orion',
    options: ['Orion', 'Lyra', 'Cassiopeia'],
    hint: 'It is a hunter with a glowing shield.'
  },
  {
    type: 'planet',
    prompt: 'Match the planet: bright rings, icon of the solar system rings.',
    answer: 'Saturn',
    options: ['Jupiter', 'Venus', 'Saturn'],
    hint: 'Its rings are wide and icy.'
  },
  {
    type: 'constellation',
    prompt: 'This constellation looks like a swan gliding across a starry river—who is it?',
    answer: 'Cygnus',
    options: ['Cygnus', 'Gemini', 'Taurus'],
    hint: 'Its tail points toward the bright Deneb star.'
  }
]

export default function SpacePlayPage() {
  const [mode, setMode] = useState<'fun' | 'learn'>('fun')
  const [density, setDensity] = useState(78)
  const [motion, setMotion] = useState(60)
  const [factIndex, setFactIndex] = useState(0)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const currentFact = playFacts[factIndex]
  const currentQuestion = gameQuestions[questionIndex]
  const modeBadgeLabel = mode === 'fun' ? 'Fun Mode' : 'Learn Mode'
  const motionDuration = useMemo(() => `${Math.max(18, 60 - motion * 0.3)}s`, [motion])
  const isFunMode = mode === 'fun'

  const handleNextFact = () => {
    setFactIndex((prev) => (prev + 1) % playFacts.length)
  }

  const handleOptionClick = (option: string) => {
    setSelectedOption(option)
    if (option === currentQuestion.answer) {
      setFeedback('Correct! Ready for another cosmic clue?')
      setModalOpen(true)
    } else {
      setFeedback('Close! Look for subtle clues in the prompt.')
    }
  }

  const advanceQuestion = () => {
    setQuestionIndex((prev) => (prev + 1) % gameQuestions.length)
    setSelectedOption(null)
    setFeedback(null)
  }

  const handleModalNext = () => {
    advanceQuestion()
    setModalOpen(false)
  }

  return (
    <main className={styles.pageRoot}>
      <section className={styles.heroSection}>
        <SpaceHeroOverlay intensity={isFunMode ? 'bold' : 'soft'} />
        <div className={styles.heroContent}>
          <p className={styles.heroSubtitle}>Space Fun + Learn UI</p>
          <h1 className={styles.heroTitle}>Playground of Stars</h1>
          <p className={styles.heroSubtitle}>
            A playful mission control to explore shimmering visuals, mini facts, and micro-games in one orbit.
          </p>
          <div className={styles.modeSwitch}>
            <SpaceButton variant={isFunMode ? 'primary' : 'secondary'} onClick={() => setMode('fun')}>
              Fun Mode
            </SpaceButton>
            <SpaceButton variant={!isFunMode ? 'primary' : 'secondary'} onClick={() => setMode('learn')}>
              Learn Mode
            </SpaceButton>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <SpaceBadge label={modeBadgeLabel} icon={isFunMode ? '🚀' : '🧭'} />
          </div>
          <div className={isFunMode ? styles.funGlow : styles.learnCalm} />
        </div>
      </section>

      <div className={styles.zoneGroup}>
        <div className={styles.zoneCard}>
          <div className={styles.zoneHeading}>Visual Zone</div>
          <div className={styles.visualCanvas}>
            <div
              className={styles.nebulaMist}
              data-mode={mode}
              style={{ animationDuration: `${Math.max(16, 24 - motion * 0.1)}s`, opacity: density / 100 }}
            />
            <div className={styles.starLayer} data-mode={mode} style={{ animationDuration: motionDuration }} />
            <SpaceHeroOverlay intensity={mode === 'fun' ? 'bold' : 'soft'} />
          </div>
          <div className={styles.controlRow}>
            <div className={styles.sliderLabel}>
              <span>Starfield Density</span>
              <span className={styles.modeBadge}>{density}%</span>
            </div>
            <input
              type="range"
              min="40"
              max="100"
              value={density}
              onChange={(event) => setDensity(Number(event.target.value))}
            />
          </div>
          <div className={styles.controlRow}>
            <div className={styles.sliderLabel}>
              <span>Nebula Motion</span>
              <span className={styles.modeBadge}>{motion}</span>
            </div>
            <input
              type="range"
              min="20"
              max="90"
              value={motion}
              onChange={(event) => setMotion(Number(event.target.value))}
            />
          </div>
        </div>

        <div className={styles.zoneCard}>
          <div className={styles.zoneHeading}>Cards Zone</div>
          <SpaceCard
            title={currentFact.title}
            description={
              <span className={styles.factInfo}>
                {currentFact.description}
              </span>
            }
            badgeLabel={currentFact.badge}
            accentEmoji={currentFact.accent}
            footer={
              <div className={styles.cardFooter}>
                <SpaceButton variant="secondary" onClick={handleNextFact}>
                  Next Fact
                </SpaceButton>
              </div>
            }
          />
        </div>
      </div>

      <div className={styles.zoneDivider}>
        <SpaceSeparator />
      </div>

      <section className={styles.zoneCard}>
        <div className={styles.zoneHeading}>Mini Game</div>
        <p className={styles.question}>{currentQuestion.prompt}</p>
        <p className={styles.modeBadge}>{currentQuestion.hint}</p>
        <div className={styles.options}>
          {currentQuestion.options.map((option) => (
            <button
              key={option}
              className={styles.gameOption}
              type="button"
              data-selected={selectedOption === option}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </button>
          ))}
        </div>
        {feedback && <p className={styles.feedback}>{feedback}</p>}
      </section>

      <SpaceModal
        open={modalOpen}
        title="Stellar Win!"
        description="Your intuition just matched the stars. Ready to push your score to the next orbit?"
        onClose={() => setModalOpen(false)}
        actions={
          <SpaceButton variant="primary" onClick={handleModalNext}>
            Next Challenge
          </SpaceButton>
        }
      />
    </main>
  )
}
