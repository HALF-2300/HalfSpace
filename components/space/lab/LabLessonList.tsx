'use client'

import labData from '@/data/spaceLabContent.json'

interface Lesson {
  id: string
  title: string
  subtitle: string
  summary: string
  points: string[]
}

const lessons = labData.lessons as Lesson[]

export default function LabLessonList() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {lessons.map((lesson) => (
        <article
          key={lesson.id}
          className="glass border-2 border-purple-500/30 rounded-2xl p-6 space-y-3 hover:border-purple-400/60 transition-all"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold text-white">{lesson.title}</h3>
              <p className="text-sm text-purple-200/90">{lesson.subtitle}</p>
            </div>
            <span className="px-3 py-1 text-xs rounded-full bg-purple-500/20 border border-purple-400/60 text-purple-100">
              Lab module
            </span>
          </div>
          <p className="text-gray-200">{lesson.summary}</p>
          <ul className="list-disc list-inside space-y-2 text-gray-100/90">
            {lesson.points.map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  )
}
