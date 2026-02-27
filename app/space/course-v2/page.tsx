'use client'

import { useEffect, useMemo, useState } from 'react'
import courseData from '@/data/courseV2.json'
import quizzesData from '@/data/quizzes.json'
import ProgressTracker from '@/components/progress/ProgressTracker'
import QuizBlock from '@/components/progress/QuizBlock'
import CertificateCard from '@/components/progress/CertificateCard'
import ReadingMode from '@/components/space/handbook/ReadingMode'

interface Lesson {
  id: string
  title: string
  points: string[]
}

export default function CourseV2Page() {
  const lessons = (courseData as any).lessons as Lesson[]
  const quizzes = (quizzesData as any).quizzes as any[]
  const [overallPercent, setOverallPercent] = useState(0)
  const [readingMode, setReadingMode] = useState(false)
  const [fontScale, setFontScale] = useState(1.02)
  const [lineHeightScale, setLineHeightScale] = useState(1.08)

  useEffect(() => {
    const root = document.documentElement
    if (readingMode) {
      document.body.classList.add('course-reading-mode')
      root.style.setProperty('--course-font-scale', fontScale.toString())
      root.style.setProperty('--course-line-height', lineHeightScale.toString())
    } else {
      document.body.classList.remove('course-reading-mode')
      root.style.removeProperty('--course-font-scale')
      root.style.removeProperty('--course-line-height')
    }

    return () => {
      document.body.classList.remove('course-reading-mode')
      root.style.removeProperty('--course-font-scale')
      root.style.removeProperty('--course-line-height')
    }
  }, [readingMode, fontScale, lineHeightScale])

  const quizByCover = useMemo(() => {
    const map: Record<string, any> = {}
    quizzes.forEach(q => {
      q.covers.forEach((id: string) => {
        map[id] = q
      })
    })
    return map
  }, [quizzes])

  const chunkedLessons = useMemo(() => {
    const chunkSize = 3
    const chunks: Lesson[][] = []
    for (let i = 0; i < lessons.length; i += chunkSize) {
      chunks.push(lessons.slice(i, i + chunkSize))
    }
    return chunks
  }, [lessons])

  return (
    <div
      className={`min-h-screen pt-20 px-4 py-12 bg-gradient-to-b from-black via-slate-900 to-black ${
        readingMode ? 'course-reading-active' : ''
      }`}
    >
      <div className="max-w-6xl mx-auto space-y-10">
        <ReadingMode
          isActive={readingMode}
          onToggle={() => setReadingMode(!readingMode)}
          lang="en"
        />

        <header className="text-center space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] text-purple-300">Mini Course · 3 hours</p>
          <h1 className="text-5xl md:text-6xl font-bold text-gradient">Space Science Course v2</h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            12 focused lessons, 4 quizzes, progress tracking, and a shareable certificate UI. Learn the story of the universe end-to-end.
          </p>
        </header>

        {readingMode && (
          <div className="glass rounded-xl border border-purple-500/40 p-4 flex flex-wrap gap-4 items-center course-reading-controls">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-300">Text</span>
              <div className="flex gap-1" role="group" aria-label="Adjust text size">
                <button
                  type="button"
                  className={`course-chip ${fontScale < 1 ? 'active' : ''}`}
                  onClick={() => setFontScale(Math.max(0.95, parseFloat((fontScale - 0.05).toFixed(2))))}
                  aria-label="Decrease text size"
                  aria-pressed={fontScale < 1}
                >
                  A-
                </button>
                <button
                  type="button"
                  className={`course-chip ${Math.abs(fontScale - 1.02) < 0.01 ? 'active' : ''}`}
                  onClick={() => setFontScale(1.02)}
                  aria-label="Reset text size"
                  aria-pressed={Math.abs(fontScale - 1.02) < 0.01}
                >
                  A
                </button>
                <button
                  type="button"
                  className={`course-chip ${fontScale > 1.05 ? 'active' : ''}`}
                  onClick={() => setFontScale(Math.min(1.25, parseFloat((fontScale + 0.05).toFixed(2))))}
                  aria-label="Increase text size"
                  aria-pressed={fontScale > 1.05}
                >
                  A+
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-300">Spacing</span>
              <div className="flex gap-1" role="group" aria-label="Adjust line spacing">
                {[1, 1.08, 1.16].map(value => (
                  <button
                    key={value}
                    type="button"
                    className={`course-chip ${lineHeightScale === value ? 'active' : ''}`}
                    onClick={() => setLineHeightScale(value)}
                    aria-pressed={lineHeightScale === value}
                  >
                    {value === 1 ? 'Snug' : value === 1.08 ? 'Comfort' : 'Relaxed'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <ProgressTracker
          lessons={lessons.map(l => ({ id: l.id, title: l.title }))}
          onChange={setOverallPercent}
        />

        <div className="space-y-10">
          {chunkedLessons.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                {group.map(lesson => (
                  <article
                    key={lesson.id}
                    className="glass rounded-2xl border border-purple-500/30 p-5 space-y-3"
                    id={lesson.id}
                  >
                    <div className="text-xs text-purple-300 uppercase tracking-wide">Lesson</div>
                    <h3 className="text-xl font-semibold text-white">{lesson.title}</h3>
                    <ul className="space-y-2 text-sm text-gray-200 list-disc list-inside">
                      {lesson.points.map((p, idx) => (
                        <li key={idx}>{p}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>

              {quizzes[groupIdx] && (
                <QuizBlock
                  title={quizzes[groupIdx].title}
                  questions={quizzes[groupIdx].questions}
                />
              )}
            </div>
          ))}
        </div>

        <CertificateCard percent={overallPercent} />
      </div>

      <style jsx>{`
        :global(body.course-reading-mode) {
          background: radial-gradient(circle at 15% 20%, rgba(139, 92, 246, 0.1), transparent 35%),
            radial-gradient(circle at 80% 10%, rgba(59, 130, 246, 0.08), transparent 30%),
            #050814;
        }

        .course-reading-controls .course-chip {
          padding: 8px 10px;
          border-radius: 10px;
          border: 1px solid rgba(139, 92, 246, 0.35);
          background: rgba(255, 255, 255, 0.02);
          color: #e5e7eb;
          font-weight: 600;
        }

        .course-reading-controls .course-chip:hover,
        .course-reading-controls .course-chip.active {
          background: rgba(139, 92, 246, 0.2);
          border-color: #8b5cf6;
          box-shadow: 0 0 12px rgba(139, 92, 246, 0.35);
        }

        .course-reading-active article,
        .course-reading-active .glass,
        .course-reading-active .glass * {
          font-size: calc(1rem * var(--course-font-scale, 1));
          line-height: calc(1.6 * var(--course-line-height, 1));
        }

        .course-reading-active .glass {
          background: rgba(10, 14, 28, 0.85);
          border-color: rgba(139, 92, 246, 0.35);
        }
      `}</style>
    </div>
  )
}
