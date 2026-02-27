import type { LearningLevel } from './universeModel'

export type LearningProgress = Record<LearningLevel, string[]>

const STORAGE_KEY = 'space.twin.learningProgress.v1'

const EMPTY: LearningProgress = {
  Beginner: [],
  Intermediate: [],
  Expert: [],
}

export function readLearningProgress(): LearningProgress {
  if (typeof window === 'undefined') return EMPTY
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY
    const parsed = JSON.parse(raw) as Partial<LearningProgress>
    return {
      Beginner: Array.isArray(parsed.Beginner) ? parsed.Beginner : [],
      Intermediate: Array.isArray(parsed.Intermediate) ? parsed.Intermediate : [],
      Expert: Array.isArray(parsed.Expert) ? parsed.Expert : [],
    }
  } catch {
    return EMPTY
  }
}

export function writeLearningProgress(next: LearningProgress) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}

export function toggleStep(progress: LearningProgress, level: LearningLevel, entityId: string) {
  const cur = new Set(progress[level] ?? [])
  if (cur.has(entityId)) cur.delete(entityId)
  else cur.add(entityId)
  return { ...progress, [level]: [...cur] } as LearningProgress
}

export function clearPath(progress: LearningProgress, level: LearningLevel) {
  return { ...progress, [level]: [] } as LearningProgress
}

