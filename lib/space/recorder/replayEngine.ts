'use client'

import { spaceEventBus, type SpaceEvent } from './eventBus'
import type { RecordedSpaceEvent } from './recorder'

type ReplayHandlers = {
  onEvent?: (event: SpaceEvent, index: number) => void
  onStop?: () => void
  onDone?: () => void
}

class SpaceReplayEngine {
  private timers: number[] = []
  private playing = false
  private handlers: ReplayHandlers = {}

  play(events: RecordedSpaceEvent[], speed: number, handlers?: ReplayHandlers) {
    if (!events.length) return
    this.stop()
    this.handlers = handlers ?? {}
    this.playing = true
    const normalizedSpeed = speed > 0 ? speed : 1
    const ordered = [...events].sort((a, b) => a.offsetMs - b.offsetMs)

    ordered.forEach((event, index) => {
      const delay = event.offsetMs / normalizedSpeed
      const timer = window.setTimeout(() => {
        if (!this.playing) return
        const { offsetMs, ...rest } = event
        const emitted = spaceEventBus.emit({
          ...rest,
          meta: { ...(rest.meta ?? {}), replay: true },
        })
        this.handlers.onEvent?.(emitted, index)
        if (index === ordered.length - 1) {
          this.playing = false
          this.handlers.onDone?.()
        }
      }, delay)
      this.timers.push(timer)
    })
  }

  stop() {
    if (!this.timers.length && !this.playing) return
    this.timers.forEach((id) => clearTimeout(id))
    this.timers = []
    const wasPlaying = this.playing
    this.playing = false
    if (wasPlaying) {
      this.handlers.onStop?.()
    }
  }

  isPlaying() {
    return this.playing
  }
}

export const spaceReplayEngine = new SpaceReplayEngine()
