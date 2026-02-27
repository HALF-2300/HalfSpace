'use client'

import { useEffect, useMemo, useState } from 'react'

interface LessonProgress {
  id: string
  completed: boolean
}

interface ProgressTrackerProps {
  lessons: { id: string; title: string }[]
  onChange?: (value: number) => void
}

const STORAGE_KEY = 'course-v2-progress'

export default function ProgressTracker({ lessons, onChange }: ProgressTrackerProps) {
  const [progress, setProgress] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null
    if (saved) {
      try {
        setProgress(JSON.parse(saved))
      } catch {
        // ignore parse errors
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    }
  }, [progress])

  const completedCount = useMemo(() => lessons.filter(lesson => progress[lesson.id]).length, [lessons, progress])
  const percent = lessons.length ? Math.round((completedCount / lessons.length) * 100) : 0

  useEffect(() => {
    if (onChange) onChange(percent)
  }, [percent, onChange])

  const toggleLesson = (id: string) => {
    setProgress(prev => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <div className="glass rounded-2xl border border-purple-500/30 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">Progress</h3>
          <p className="text-sm text-gray-300">{completedCount} / {lessons.length} lessons completed</p>
        </div>
        <span className="text-lg font-bold text-purple-200">{percent}%</span>
      </div>

      <div className="h-2 w-full bg-purple-500/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-2">
        {lessons.map(lesson => (
          <button
            key={lesson.id}
            onClick={() => toggleLesson(lesson.id)}
            className={`flex items-center justify-between px-3 py-2 rounded-lg border text-sm transition ${
              progress[lesson.id]
                ? 'border-green-400/70 bg-green-500/10 text-green-100'
                : 'border-purple-500/30 bg-black/20 text-gray-200 hover:border-purple-400/60'
            }`}
          >
            <span className="text-left">{lesson.title}</span>
            <span>{progress[lesson.id] ? '✓' : '○'}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
