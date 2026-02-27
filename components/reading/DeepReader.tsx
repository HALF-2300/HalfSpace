'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import styles from './Reading.module.css'
import {
  Chapter,
  Section,
  ContentBlock,
  getChapter,
  getAllChapters,
  getChapterProgress,
  updateReadingProgress,
  markChapterComplete,
  formatReadingTime,
  loadStats
} from '@/lib/deepReading'

// ============================================================================
// Chapter Library
// ============================================================================

export function ChapterLibrary() {
  const chapters = getAllChapters()
  const stats = loadStats()

  return (
    <div className={styles.library}>
      <div className={styles.libraryHeader}>
        <h1 className={styles.libraryTitle}>📚 Space Library</h1>
        <p className={styles.librarySubtitle}>
          Deep reading for curious minds. Hours of content to explore.
        </p>
        
        <div className={styles.libraryStats}>
          <div className={styles.libraryStat}>
            <span className={styles.statValue}>{chapters.length}</span>
            <span className={styles.statLabel}>Chapters</span>
          </div>
          <div className={styles.libraryStat}>
            <span className={styles.statValue}>{chapters.reduce((s, c) => s + c.sections.length, 0)}</span>
            <span className={styles.statLabel}>Sections</span>
          </div>
          <div className={styles.libraryStat}>
            <span className={styles.statValue}>{Math.round(chapters.reduce((s, c) => s + c.estimatedMinutes, 0) / 60)}h</span>
            <span className={styles.statLabel}>Reading Time</span>
          </div>
          {stats.totalTimeRead > 0 && (
            <div className={styles.libraryStat}>
              <span className={styles.statValue}>{Math.round(stats.totalTimeRead / 60)}m</span>
              <span className={styles.statLabel}>You&apos;ve Read</span>
            </div>
          )}
        </div>
      </div>

      <div className={styles.chapterGrid}>
        {chapters.map(chapter => (
          <ChapterCard key={chapter.id} chapter={chapter} />
        ))}
      </div>
    </div>
  )
}

function ChapterCard({ chapter }: { chapter: Chapter }) {
  const progress = getChapterProgress(chapter.id)
  const progressPercent = progress 
    ? ((progress.sectionIndex + 1) / chapter.sections.length) * 100 
    : 0

  return (
    <Link href={`/library/${chapter.id}`} className={styles.chapterCard}>
      <div className={styles.chapterIcon}>{chapter.icon}</div>
      
      <div className={styles.chapterContent}>
        <div className={styles.chapterMeta}>
          <span className={`${styles.difficulty} ${styles[chapter.difficulty]}`}>
            {chapter.difficulty}
          </span>
          <span className={styles.chapterTime}>
            {formatReadingTime(chapter.estimatedMinutes)}
          </span>
        </div>
        
        <h3 className={styles.chapterTitle}>{chapter.title}</h3>
        <p className={styles.chapterDescription}>{chapter.description}</p>
        
        <div className={styles.chapterSections}>
          {chapter.sections.length} sections
        </div>
        
        {progress && !progress.completed && (
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
        
        {progress?.completed && (
          <div className={styles.completedBadge}>✓ Completed</div>
        )}
      </div>
    </Link>
  )
}

// ============================================================================
// Deep Reader
// ============================================================================

interface DeepReaderProps {
  chapterId: string
}

export default function DeepReader({ chapterId }: DeepReaderProps) {
  const router = useRouter()
  const chapter = getChapter(chapterId)
  const [currentSection, setCurrentSection] = useState(0)
  const [startTime, setStartTime] = useState(Date.now())
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load saved progress
    const progress = getChapterProgress(chapterId)
    if (progress && !progress.completed) {
      setCurrentSection(progress.sectionIndex)
    }
    setStartTime(Date.now())
  }, [chapterId])

  // Save progress on section change
  useEffect(() => {
    if (chapter) {
      const timeSpent = Math.round((Date.now() - startTime) / 1000)
      updateReadingProgress(chapterId, currentSection, 0, timeSpent)
      setStartTime(Date.now())
    }
  }, [currentSection, chapterId, chapter])

  // Save on unmount
  useEffect(() => {
    return () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000)
      if (timeSpent > 5) {
        updateReadingProgress(chapterId, currentSection, 0, timeSpent)
      }
    }
  }, [chapterId, currentSection, startTime])

  const handleNext = () => {
    if (!chapter) return
    
    if (currentSection < chapter.sections.length - 1) {
      setCurrentSection(s => s + 1)
      contentRef.current?.scrollTo(0, 0)
    } else {
      // Complete chapter
      markChapterComplete(chapterId)
      router.push('/library')
    }
  }

  const handlePrev = () => {
    if (currentSection > 0) {
      setCurrentSection(s => s - 1)
      contentRef.current?.scrollTo(0, 0)
    }
  }

  if (!chapter) {
    return (
      <div className={styles.notFound}>
        <h2>Chapter not found</h2>
        <Link href="/library">Back to Library</Link>
      </div>
    )
  }

  const section = chapter.sections[currentSection]
  const isLastSection = currentSection === chapter.sections.length - 1

  return (
    <div className={styles.reader}>
      {/* Header */}
      <div className={styles.readerHeader}>
        <Link href="/library" className={styles.backLink}>
          ← Library
        </Link>
        <div className={styles.readerProgress}>
          <span>{currentSection + 1} / {chapter.sections.length}</span>
          <div className={styles.readerProgressBar}>
            <div 
              className={styles.readerProgressFill}
              style={{ width: `${((currentSection + 1) / chapter.sections.length) * 100}%` }}
            />
          </div>
        </div>
        <span className={styles.readerTime}>
          ~{section.estimatedMinutes} min
        </span>
      </div>

      {/* Chapter Title (first section only) */}
      {currentSection === 0 && (
        <div className={styles.chapterHeader}>
          <span className={styles.chapterHeaderIcon}>{chapter.icon}</span>
          <h1 className={styles.chapterHeaderTitle}>{chapter.title}</h1>
        </div>
      )}

      {/* Section Content */}
      <div className={styles.sectionContent} ref={contentRef}>
        <h2 className={styles.sectionTitle}>{section.title}</h2>
        
        <div className={styles.contentBlocks}>
          {section.content.map((block, i) => (
            <ContentBlockRenderer key={i} block={block} />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className={styles.readerNav}>
        <button 
          className={styles.navButton}
          onClick={handlePrev}
          disabled={currentSection === 0}
        >
          ← Previous
        </button>
        
        <div className={styles.sectionIndicators}>
          {chapter.sections.map((_, i) => (
            <button
              key={i}
              className={`${styles.sectionDot} ${i === currentSection ? styles.sectionDotActive : ''} ${i < currentSection ? styles.sectionDotComplete : ''}`}
              onClick={() => setCurrentSection(i)}
            />
          ))}
        </div>
        
        <button 
          className={`${styles.navButton} ${styles.navButtonPrimary}`}
          onClick={handleNext}
        >
          {isLastSection ? 'Complete ✓' : 'Next →'}
        </button>
      </div>

      {/* Table of Contents */}
      <div className={styles.toc}>
        <h4>Contents</h4>
        {chapter.sections.map((s, i) => (
          <button
            key={s.id}
            className={`${styles.tocItem} ${i === currentSection ? styles.tocItemActive : ''}`}
            onClick={() => setCurrentSection(i)}
          >
            <span className={styles.tocNumber}>{i + 1}</span>
            <span className={styles.tocTitle}>{s.title}</span>
            <span className={styles.tocTime}>{s.estimatedMinutes}m</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// Content Block Renderer
// ============================================================================

function ContentBlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'text':
      return (
        <p 
          className={styles.textBlock}
          dangerouslySetInnerHTML={{ 
            __html: block.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
          }}
        />
      )
    
    case 'fact':
      return (
        <div className={styles.factBlock}>
          <span className={styles.factIcon}>💡</span>
          <p>{block.content}</p>
        </div>
      )
    
    case 'quote':
      return (
        <blockquote className={styles.quoteBlock}>
          <p>{block.content}</p>
        </blockquote>
      )
    
    case 'comparison':
      return (
        <div className={styles.comparisonBlock}>
          <span className={styles.comparisonIcon}>⚖️</span>
          <p>{block.content}</p>
        </div>
      )
    
    case 'timeline':
      return (
        <div className={styles.timelineBlock}>
          <span className={styles.timelineIcon}>📅</span>
          <p>{block.content}</p>
        </div>
      )
    
    default:
      return <p className={styles.textBlock}>{block.content}</p>
  }
}

// ============================================================================
// Continue Reading Card
// ============================================================================

export function ContinueReading() {
  const chapters = getAllChapters()
  const [resumeChapter, setResumeChapter] = useState<Chapter | null>(null)
  const [progress, setProgress] = useState<any>(null)

  useEffect(() => {
    for (const chapter of chapters) {
      const p = getChapterProgress(chapter.id)
      if (p && !p.completed) {
        setResumeChapter(chapter)
        setProgress(p)
        break
      }
    }
  }, [chapters])

  if (!resumeChapter) return null

  const progressPercent = ((progress.sectionIndex + 1) / resumeChapter.sections.length) * 100

  return (
    <Link href={`/library/${resumeChapter.id}`} className={styles.continueCard}>
      <div className={styles.continueHeader}>
        <span className={styles.continueLabel}>Continue Reading</span>
        <span className={styles.continueProgress}>{Math.round(progressPercent)}%</span>
      </div>
      <div className={styles.continueContent}>
        <span className={styles.continueIcon}>{resumeChapter.icon}</span>
        <div>
          <h3 className={styles.continueTitle}>{resumeChapter.title}</h3>
          <p className={styles.continueSection}>
            Section {progress.sectionIndex + 1}: {resumeChapter.sections[progress.sectionIndex]?.title}
          </p>
        </div>
      </div>
      <div className={styles.continueBar}>
        <div 
          className={styles.continueBarFill}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </Link>
  )
}
