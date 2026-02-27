'use client'

import { emitSpaceEvent, onSpaceEvent, type SpaceEvent } from './eventBus'

export interface RecordedSpaceEvent extends SpaceEvent {
  offsetMs: number
}

const STORAGE_KEY = 'space-recorder:last'

const now = () => {
  if (typeof performance !== 'undefined' && performance.now) return performance.now()
  return Date.now()
}

class SpaceRecorder {
  private recording = false
  private startedAt = 0
  private buffer: RecordedSpaceEvent[] = []
  private unsubscribe: (() => void) | null = null

  start() {
    if (this.recording) return
    this.buffer = []
    this.startedAt = now()
    this.unsubscribe = onSpaceEvent((event) => {
      if (event.meta?.replay) return
      const offsetMs = Math.max(0, now() - this.startedAt)
      this.buffer.push({ ...event, offsetMs })
    })
    this.recording = true
  }

  stop(): RecordedSpaceEvent[] {
    if (!this.recording) return []
    this.unsubscribe?.()
    this.unsubscribe = null
    this.recording = false
    const snapshot = [...this.buffer]
    this.save(snapshot)
    return snapshot
  }

  isRecording() {
    return this.recording
  }

  clear() {
    this.buffer = []
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  save(events: RecordedSpaceEvent[]) {
    if (typeof localStorage === 'undefined') return
    const payload = {
      savedAt: Date.now(),
      events,
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } catch (error) {
      console.warn('space-recorder save failed', error)
    }
  }

  loadLast():
    | {
        savedAt: number
        events: RecordedSpaceEvent[]
      }
    | null {
    if (typeof localStorage === 'undefined') return null
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return null
      const parsed = JSON.parse(raw)
      if (!Array.isArray(parsed.events)) return null
      return parsed
    } catch (error) {
      console.warn('space-recorder load failed', error)
      return null
    }
  }

  importFromFile(data: { events?: RecordedSpaceEvent[] }) {
    if (!data || !Array.isArray(data.events)) return []
    this.save(data.events)
    return data.events
  }
}

export const spaceRecorder = new SpaceRecorder()

export function replayableEmit<T extends SpaceEvent['type']>(
  type: T,
  payload: SpaceEvent['payload'],
  options?: { source?: string }
) {
  return emitSpaceEvent(type, payload as never, options)
}
