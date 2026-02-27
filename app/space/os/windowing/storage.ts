import type { SpaceOSSession, WindowState } from './types'

function isFiniteNumber(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v)
}

function sanitizeWindow(w: any): WindowState | null {
  if (!w || typeof w !== 'object') return null
  if (typeof w.id !== 'string') return null
  if (typeof w.appId !== 'string') return null
  if (typeof w.title !== 'string') return null
  if (typeof w.icon !== 'string') return null
  if (!w.rect || typeof w.rect !== 'object') return null
  const { x, y, w: width, h: height } = w.rect
  if (![x, y, width, height].every(isFiniteNumber)) return null
  const rect = {
    x: Math.max(-2000, Math.min(2000, x)),
    y: Math.max(-2000, Math.min(2000, y)),
    w: Math.max(320, Math.min(1600, width)),
    h: Math.max(220, Math.min(1200, height)),
  }
  const z = isFiniteNumber(w.z) ? w.z : 1
  const minimized = typeof w.minimized === 'boolean' ? w.minimized : false
  const maximized = typeof w.maximized === 'boolean' ? w.maximized : false
  const restoreRect =
    w.restoreRect &&
    typeof w.restoreRect === 'object' &&
    [w.restoreRect.x, w.restoreRect.y, w.restoreRect.w, w.restoreRect.h].every(isFiniteNumber)
      ? {
          x: w.restoreRect.x,
          y: w.restoreRect.y,
          w: w.restoreRect.w,
          h: w.restoreRect.h,
        }
      : undefined

  return {
    id: w.id,
    appId: w.appId,
    title: w.title,
    icon: w.icon,
    rect,
    z,
    minimized,
    maximized,
    restoreRect,
  } as WindowState
}

export function loadSession(key: string): SpaceOSSession | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    const uiMode = parsed.uiMode === 'tabs' ? 'tabs' : 'windows'
    const perfMode = parsed.perfMode === 'low' ? 'low' : 'high'
    const windows = Array.isArray(parsed.windows)
      ? parsed.windows.map(sanitizeWindow).filter(Boolean)
      : []
    const activeWindowId =
      typeof parsed.activeWindowId === 'string' ? parsed.activeWindowId : null
    const activeTabAppId = typeof parsed.activeTabAppId === 'string' ? parsed.activeTabAppId : undefined
    return { uiMode, perfMode, windows, activeWindowId, activeTabAppId }
  } catch {
    return null
  }
}

let saveTimer: number | null = null

export function saveSession(key: string, session: SpaceOSSession) {
  if (typeof window === 'undefined') return
  if (saveTimer) window.clearTimeout(saveTimer)
  saveTimer = window.setTimeout(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(session))
    } catch {
      // ignore storage errors (quota, privacy mode)
    }
  }, 200)
}

