'use client'

import { useEffect, useMemo, useState } from 'react'
import type { BundleCompact, BundleHistoryEntry } from '../types'

const STORAGE_KEY = 'space:packager:bundles:v1'

function nowIso() {
  return new Date().toISOString()
}

function safeParse(raw: string | null): BundleHistoryEntry[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed
      .map((x) => x as Partial<BundleHistoryEntry>)
      .filter((x) => typeof x.id === 'string' && typeof x.createdAt === 'string' && typeof x.title === 'string' && x.compact)
      .map((x) => ({
        id: x.id!,
        createdAt: x.createdAt!,
        title: x.title!,
        compact: x.compact as BundleCompact,
      }))
  } catch {
    return []
  }
}

function randomId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

export function useBundleHistory() {
  const [items, setItems] = useState<BundleHistoryEntry[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setItems(safeParse(window.localStorage.getItem(STORAGE_KEY)))
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 10)))
  }, [items, hydrated])

  const byId = useMemo(() => {
    const m: Record<string, BundleHistoryEntry> = {}
    for (const it of items) m[it.id] = it
    return m
  }, [items])

  function push(title: string, compact: BundleCompact) {
    const entry: BundleHistoryEntry = { id: randomId(), createdAt: nowIso(), title, compact }
    setItems((prev) => [entry, ...prev].slice(0, 10))
    return entry
  }

  function remove(id: string) {
    setItems((prev) => prev.filter((x) => x.id !== id))
  }

  function clear() {
    setItems([])
  }

  return { items, byId, push, remove, clear, hydrated }
}

