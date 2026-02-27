'use client'

import { useEffect, useMemo, useState } from 'react'
import CanvasStarfield from '@/components/space/CanvasStarfield'
import NebulaFog from '@/components/space/experience/NebulaFog'
import Link from 'next/link'
import './universe-cinematic.css'

type Intensity = 'light' | 'medium'

const journeyCards = [
  {
    id: 'origins',
    title: 'Origins',
    emoji: '🌌',
    blurb: 'From the first moments after the Big Bang to the cosmic web we see today.',
    href: '/space/big-bang',
  },
  {
    id: 'stars',
    title: 'Stars',
    emoji: '✨',
    blurb: 'Fusion engines that forge the elements and light the universe.',
    href: '/space/stars',
  },
  {
    id: 'galaxies',
    title: 'Galaxies',
    emoji: '🌀',
    blurb: 'Spiral, elliptical, and irregular cities of stars bound by dark matter.',
    href: '/space/galaxies',
  },
  {
    id: 'black-holes',
    title: 'Black Holes',
    emoji: '🕳️',
    blurb: 'Gravity so strong that even light can’t escape; the architects of cosmic drama.',
    href: '/space/black-holes',
  },
]

export default function UniverseExperienceCinematicPage() {
  const [motionEnabled, setMotionEnabled] = useState(true)
  const [intensity, setIntensity] = useState<Intensity>('medium')
  const [activeCard, setActiveCard] = useState<string | null>(null)
  const [prefersReduced, setPrefersReduced] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReduced(media.matches)
    const handler = (event: MediaQueryListEvent) => setPrefersReduced(event.matches)
    media.addEventListener('change', handler)
    return () => media.removeEventListener('change', handler)
  }, [])

  const motionOff = prefersReduced || !motionEnabled

  const starIntensity = useMemo(() => {
    if (motionOff) return 'low' as const
    return intensity === 'medium' ? ('high' as const) : ('medium' as const)
  }, [intensity, motionOff])

  const nebulaDensity = useMemo(() => {
    if (motionOff) return 0
    return intensity === 'medium' ? 0.8 : 0.4
  }, [intensity, motionOff])

  return (
    <div className={`universe-cinematic ${motionOff ? 'reduce-motion' : ''}`}>
      {/* Background layers */}
      {!motionOff && <CanvasStarfield intensity={starIntensity} className="universe-cinematic__stars" />}
      <div className="universe-cinematic__backdrop" />
      <NebulaFog density={nebulaDensity} reducedMotion={motionOff} />
      <div className="universe-cinematic__vignette" aria-hidden="true" />

      <main className="universe-cinematic__content" aria-label="Universe cinematic experience">
        <header className="universe-cinematic__hero fade-in">
          <p className="eyebrow">Immersive space journey</p>
          <h1 className="title">Universe Experience</h1>
          <p className="lede">
            Drift through a living starfield with nebula glow, subtle shooting stars, and cinematic overlays. Tune the motion to
            your taste and jump into a short reading journey.
          </p>
          <div className="controls" role="group" aria-label="Experience controls">
            <div className="control-block">
              <span className="label">Motion</span>
              <div className="chip-row">
                <button
                  type="button"
                  className={`chip ${motionEnabled ? 'active' : ''}`}
                  onClick={() => setMotionEnabled(true)}
                  aria-pressed={motionEnabled}
                >
                  On
                </button>
                <button
                  type="button"
                  className={`chip ${!motionEnabled ? 'active' : ''}`}
                  onClick={() => setMotionEnabled(false)}
                  aria-pressed={!motionEnabled}
                >
                  Off
                </button>
              </div>
            </div>
            <div className="control-block">
              <span className="label">Density</span>
              <div className="chip-row">
                {(['light', 'medium'] as Intensity[]).map(level => (
                  <button
                    key={level}
                    type="button"
                    className={`chip ${intensity === level ? 'active' : ''}`}
                    onClick={() => setIntensity(level)}
                    aria-pressed={intensity === level}
                  >
                    {level === 'light' ? 'Light' : 'Medium'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        <section className="universe-cinematic__journey slide-up" aria-label="Short journey cards">
          <div className="journey-header">
            <div>
              <p className="eyebrow">Short journey</p>
              <h2>Pick a quick stop</h2>
            </div>
            <span className="hint">Tap a card for a bite-sized read</span>
          </div>
          <div className="journey-grid">
            {journeyCards.map(card => (
              <button
                key={card.id}
                type="button"
                className="journey-card"
                onClick={() => setActiveCard(card.id)}
                aria-pressed={activeCard === card.id}
              >
                <div className="journey-card__icon">{card.emoji}</div>
                <div className="journey-card__text">
                  <h3>{card.title}</h3>
                  <p>{card.blurb}</p>
                </div>
                <span className="journey-card__cta">Open</span>
              </button>
            ))}
          </div>
        </section>
      </main>

      {activeCard && (
        <div className="journey-modal fade-in" role="dialog" aria-modal="true" aria-label="Journey detail">
          <div className="journey-modal__backdrop" onClick={() => setActiveCard(null)} />
          <div className="journey-modal__panel">
            {journeyCards
              .filter(card => card.id === activeCard)
              .map(card => (
                <div key={card.id}>
                  <div className="journey-modal__header">
                    <span className="journey-modal__icon">{card.emoji}</span>
                    <div>
                      <p className="eyebrow">Brief stop</p>
                      <h3>{card.title}</h3>
                    </div>
                  </div>
                  <p className="journey-modal__body">{card.blurb}</p>
                  <div className="journey-modal__footer">
                    <Link href={card.href} className="journey-modal__link">
                      Read more →
                    </Link>
                    <button type="button" className="chip" onClick={() => setActiveCard(null)} aria-label="Close dialog">
                      Close
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
