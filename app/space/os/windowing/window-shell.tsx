'use client'

import type { AppDefinition, PerfMode, SpaceOSSession, WindowRect, WindowState } from './types'
import { WindowView } from './window-view'

function nextZ(windows: WindowState[]) {
  return (windows.reduce((m, w) => Math.max(m, w.z), 0) || 0) + 1
}

function clampRect(rect: WindowRect) {
  const pad = 8
  const maxW = Math.max(320, window.innerWidth - pad * 2)
  const maxH = Math.max(240, window.innerHeight - pad * 2)
  const w = Math.max(320, Math.min(maxW, rect.w))
  const h = Math.max(220, Math.min(maxH, rect.h))
  const x = Math.max(-w + 120, Math.min(window.innerWidth - 120, rect.x))
  const y = Math.max(48, Math.min(window.innerHeight - 120, rect.y))
  return { x, y, w, h }
}

export function WindowShell({
  apps,
  session,
  onSessionChange,
  perfMode,
}: {
  apps: AppDefinition[]
  session: SpaceOSSession
  onSessionChange: (next: SpaceOSSession) => void
  perfMode: PerfMode
}) {
  const appById = new Map(apps.map((a) => [a.id, a]))

  const focus = (id: string) => {
    onSessionChange({
      ...session,
      windows: session.windows.map((w) =>
        w.id === id ? { ...w, z: nextZ(session.windows), minimized: false } : w
      ),
      activeWindowId: id,
    })
  }

  const close = (id: string) => {
    const nextWindows = session.windows.filter((w) => w.id !== id)
    const activeWindowId =
      session.activeWindowId && session.activeWindowId === id
        ? nextWindows.sort((a, b) => b.z - a.z)[0]?.id ?? null
        : session.activeWindowId
    onSessionChange({ ...session, windows: nextWindows, activeWindowId })
  }

  const minimize = (id: string) => {
    onSessionChange({
      ...session,
      windows: session.windows.map((w) => (w.id === id ? { ...w, minimized: true } : w)),
      activeWindowId: session.activeWindowId === id ? null : session.activeWindowId,
    })
  }

  const toggleMaximize = (id: string) => {
    onSessionChange({
      ...session,
      windows: session.windows.map((w) => {
        if (w.id !== id) return w
        if (!w.maximized) {
          const restoreRect = w.rect
          const rect = {
            x: 12,
            y: 56,
            w: window.innerWidth - 24,
            h: window.innerHeight - 56 - 92,
          }
          return { ...w, maximized: true, restoreRect, rect: clampRect(rect) }
        }
        return { ...w, maximized: false, rect: w.restoreRect ?? w.rect, restoreRect: undefined }
      }),
      activeWindowId: id,
    })
  }

  const setRect = (id: string, rect: WindowRect) => {
    onSessionChange({
      ...session,
      windows: session.windows.map((w) => (w.id === id ? { ...w, rect: clampRect(rect) } : w)),
    })
  }

  return (
    <div
      className="absolute inset-0 z-20 pt-14 pb-20"
      onPointerDown={() => onSessionChange({ ...session, activeWindowId: null })}
    >
      {session.windows
        .slice()
        .sort((a, b) => a.z - b.z)
        .map((w) => {
          const def = appById.get(w.appId)
          return (
            <WindowView
              key={w.id}
              windowState={w}
              app={def}
              active={session.activeWindowId === w.id}
              perfMode={perfMode}
              onFocus={() => focus(w.id)}
              onClose={() => close(w.id)}
              onMinimize={() => minimize(w.id)}
              onToggleMaximize={() => toggleMaximize(w.id)}
              onRectChange={(rect) => setRect(w.id, rect)}
            />
          )
        })}
    </div>
  )
}

