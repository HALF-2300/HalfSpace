'use client'

import { useEffect, useMemo, useState } from 'react'
import type { LearningLevel, StoredProgressV1 } from '../types'

const STORAGE_KEY = 'space:twin:progress:v1'

function nowIso() {
  return new Date().toISOString()
}

function emptyProgress(): StoredProgressV1 {
  return {
    version: 1,
    updatedAt: nowIso(),
    completedByLevel: {
      Beginner: [],
      Intermediate: [],
      Expert: [],
    },
  }
}

function safeParse(raw: string | null): StoredProgressV1 | null {
  if (!raw) return null
  try {
    const v = JSON.parse(raw) as Partial<StoredProgressV1>
    if (v.version !== 1) return null
    if (!v.completedByLevel) return null
    return {
      version: 1,
      updatedAt: typeof v.updatedAt === 'string' ? v.updatedAt : nowIso(),
      completedByLevel: {
        Beginner: Array.isArray(v.completedByLevel.Beginner) ? (v.completedByLevel.Beginner as string[]) : [],
        Intermediate: Array.isArray(v.completedByLevel.Intermediate) ? (v.completedByLevel.Intermediate as string[]) : [],
        Expert: Array.isArray(v.completedByLevel.Expert) ? (v.completedByLevel.Expert as string[]) : [],
      },
    }
  } catch {
    return null
  }
}

export function useTwinProgress() {
  const [progress, setProgress] = useState<StoredProgressV1>(() => emptyProgress())
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const parsed = safeParse(window.localStorage.getItem(STORAGE_KEY))
    setProgress(parsed ?? emptyProgress())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...progress, updatedAt: nowIso() }))
  }, [progress, hydrated])

  const completedSetByLevel = useMemo(() => {
    return {
      Beginner: new Set(progress.completedByLevel.Beginner),
      Intermediate: new Set(progress.completedByLevel.Intermediate),
      Expert: new Set(progress.completedByLevel.Expert),
    } satisfies Record<LearningLevel, Set<string>>
  }, [progress])

  function toggleStep(level: LearningLevel, entityId: string) {
    setProgress((prev) => {
      const list = prev.completedByLevel[level]
      const next = list.includes(entityId) ? list.filter((id) => id !== entityId) : [...list, entityId]
      return {
        ...prev,
        completedByLevel: {
          ...prev.completedByLevel,
          [level]: next,
        },
      }
    })
  }

  function resetAll() {
    setProgress(emptyProgress())
  }

  return { progress, completedSetByLevel, toggleStep, resetAll, hydrated }
}

