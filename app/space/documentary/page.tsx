'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import episodesData from '@/data/documentary/episodes.json'
import assetsData from '@/data/documentary/assets.json'
import './documentary.css'

type KeyNumber = {
  label: string
  value: string
}

type Attachment = {
  label: string
  href: string
}

type Episode = {
  id: string
  title: string
  narrative: string
  assetId: string
  keyNumbers: KeyNumber[]
  pauseQuestion: string
  attachments: Attachment[]
}

type Asset = {
  id: string
  type: 'image' | 'video'
  src: string
  credit?: string
  tone?: string
}

const EPISODES = episodesData as Episode[]
const ASSETS = assetsData as Asset[]
const ASSET_MAP = ASSETS.reduce<Record<string, Asset>>((map, asset) => {
  map[asset.id] = asset
  return map
}, {})

const STORAGE_KEY = 'space_documentary_last_episode'

export default function DocumentaryPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [cinematic, setCinematic] = useState(false)
  const [resumeIndex, setResumeIndex] = useState<number | null>(null)
  const totalEpisodes = EPISODES.length

  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = window.localStorage.getItem(STORAGE_KEY)
    const parsed = stored ? Number.parseInt(stored, 10) : NaN
    if (!Number.isNaN(parsed) && parsed >= 0 && parsed < totalEpisodes) {
      setCurrentIndex(parsed)
      setResumeIndex(parsed)
    }
  }, [totalEpisodes])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, String(currentIndex))
  }, [currentIndex])

  const currentEpisode = EPISODES[currentIndex]
  const background = ASSET_MAP[currentEpisode.assetId]
  const progressPercent = Math.round(((currentIndex + 1) / totalEpisodes) * 100)

  const chapterList = useMemo(
    () =>
      EPISODES.map((episode, index) => ({
        ...episode,
        index,
        isActive: index === currentIndex,
      })),
    [currentIndex],
  )

  const handlePrevious = () => {
    setCurrentIndex(prev => (prev - 1 + totalEpisodes) % totalEpisodes)
  }

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % totalEpisodes)
  }

  const handleResume = () => {
    if (resumeIndex === null) return
    setCurrentIndex(resumeIndex)
  }

  return (
    <div className={`documentary-shell ${cinematic ? 'is-cinematic' : ''}`}>
      <Background asset={background} />
      <div className="documentary-vignette" aria-hidden="true" />

      <div className="documentary-content">
        <header className="documentary-chrome">
          <div className="chrome-meta">
            <p className="eyebrow">Deep Space Documentary Mode</p>
            <h1>Watch, read, and think like a cosmic documentary</h1>
            <p className="lede">
              Ten short, cinematic chapters with guided prompts, key numbers, and quick “Read more” jumps to the encyclopedia,
              lab, and atlas.
            </p>
          </div>

          <div className="chrome-controls">
            <div className="control-row" role="group" aria-label="View toggles">
              <button
                type="button"
                className={`chip-button ${!cinematic ? 'is-active' : ''}`}
                onClick={() => setCinematic(false)}
                aria-pressed={!cinematic}
              >
                Reading mode
              </button>
              <button
                type="button"
                className={`chip-button ${cinematic ? 'is-active' : ''}`}
                onClick={() => setCinematic(value => !value)}
                aria-pressed={cinematic}
              >
                🎞 Cinematic mode
              </button>
              <button
                type="button"
                className="chip-button"
                onClick={handleResume}
                disabled={resumeIndex === null || resumeIndex === currentIndex}
                aria-disabled={resumeIndex === null || resumeIndex === currentIndex}
              >
                Resume last stop
              </button>
            </div>

            <div className="progress-block" aria-label="Progress indicator">
              <div className="progress-header">
                <span>
                  Episode {currentIndex + 1} of {totalEpisodes}
                </span>
                <span>{progressPercent}% complete</span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar__fill" style={{ width: `${progressPercent}%` }} />
              </div>
              <div className="nav-row" aria-label="Episode navigation">
                <button type="button" className="nav-button" onClick={handlePrevious}>
                  ← Previous
                </button>
                <button type="button" className="nav-button" onClick={handleNext}>
                  Next →
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="episode-grid">
          <article className="episode-card" aria-live="polite">
            <p className="episode-kicker">
              Episode {currentIndex + 1} · {currentEpisode.id}
            </p>
            <h2 className="episode-title">{currentEpisode.title}</h2>
            <p className="episode-narrative">{currentEpisode.narrative}</p>

            <div className="key-numbers" aria-label="Key numbers">
              {currentEpisode.keyNumbers.map(number => (
                <div className="key-number" key={number.label}>
                  <div className="label">{number.label}</div>
                  <div className="value">{number.value}</div>
                </div>
              ))}
            </div>

            <div className="pause-card">
              <strong>Pause &amp; Think</strong>
              <p>{currentEpisode.pauseQuestion}</p>
            </div>

            <div className="attachments" aria-label="Read more links">
              {currentEpisode.attachments.map(attachment => (
                <Link className="attachment-link" key={attachment.href} href={attachment.href}>
                  <span>Read more</span>
                  <span aria-hidden="true">→</span>
                  <span className="attachment-label">{attachment.label}</span>
                </Link>
              ))}
            </div>
          </article>

          <aside className="episode-rail" aria-label="Episode list">
            <div className="rail-title">
              <span>Chapters</span>
              <span>{progressPercent}%</span>
            </div>
            {chapterList.map(chapter => (
              <button
                type="button"
                key={chapter.id}
                className={`episode-chip ${chapter.isActive ? 'is-active' : ''}`}
                onClick={() => setCurrentIndex(chapter.index)}
                aria-pressed={chapter.isActive}
              >
                <div className="label">Ep {chapter.index + 1}</div>
                <div className="title">{chapter.title}</div>
                <div className="cta">{chapter.isActive ? 'Now playing' : 'Open'}</div>
              </button>
            ))}
          </aside>
        </div>
      </div>
    </div>
  )
}

function Background({ asset }: { asset?: Asset }) {
  if (!asset) return null

  return (
    <div className="documentary-bg" aria-hidden="true">
      {asset.type === 'video' ? (
        <div className="documentary-bg__media">
          <video autoPlay muted loop playsInline poster={asset.src}>
            <source src={asset.src} type="video/mp4" />
          </video>
        </div>
      ) : (
        <div className="documentary-bg__media" style={{ backgroundImage: `url(${asset.src})` }} />
      )}
      <div className="documentary-bg__overlay" />
    </div>
  )
}
