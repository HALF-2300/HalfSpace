'use client'

export type SpaceEventType = 'scene_change' | 'slider_move' | 'quiz_answer' | 'nav' | 'custom'

export interface SpaceEventPayloadMap {
  scene_change: { sceneId: string; label?: string; page?: string }
  slider_move: { controlId: string; value: number; page?: string }
  quiz_answer: {
    quizTitle: string
    questionIndex: number
    answerIndex?: number
    action: 'answer' | 'next' | 'reset'
    correct?: boolean
  }
  nav: { target: string; from?: string; method?: 'click' | 'programmatic' }
  custom: Record<string, unknown>
}

export type SpaceEvent<T extends SpaceEventType = SpaceEventType> = {
  id: string
  type: T
  payload: SpaceEventPayloadMap[T]
  source?: string
  createdAt: number
  meta?: {
    replay?: boolean
  }
}

type Listener = (event: SpaceEvent) => void

const uid = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `evt-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

class SpaceEventBus {
  private listeners = new Set<Listener>()

  emit<T extends SpaceEventType>(
    event: Omit<SpaceEvent<T>, 'id' | 'createdAt'> & { createdAt?: number }
  ): SpaceEvent<T> {
    const payload: SpaceEvent<T> = {
      ...event,
      id: 'id' in event && event.id ? event.id : uid(),
      createdAt: event.createdAt ?? Date.now(),
    } as SpaceEvent<T>

    this.listeners.forEach((listener) => listener(payload))
    return payload
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  listenerCount() {
    return this.listeners.size
  }
}

export const spaceEventBus = new SpaceEventBus()

export function emitSpaceEvent<T extends SpaceEventType>(
  type: T,
  payload: SpaceEventPayloadMap[T],
  options?: { source?: string; createdAt?: number; meta?: SpaceEvent['meta'] }
) {
  return spaceEventBus.emit<T>({
    type,
    payload,
    source: options?.source,
    createdAt: options?.createdAt,
    meta: options?.meta,
  })
}

export function onSpaceEvent(listener: Listener) {
  return spaceEventBus.subscribe(listener)
}
