'use client'

import type { AppDefinition, SpaceOSSession, WindowState, WindowRect } from '../windowing/types'

function newId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `w_${Math.random().toString(16).slice(2)}_${Date.now()}`
}

function defaultRect(index: number): WindowRect {
  const w = Math.min(920, Math.max(560, Math.floor(window.innerWidth * 0.58)))
  const h = Math.min(640, Math.max(380, Math.floor(window.innerHeight * 0.56)))
  const x = 80 + (index % 3) * 34
  const y = 90 + (index % 3) * 28
  return { x, y, w, h }
}

function nextZ(windows: WindowState[]) {
  return (windows.reduce((m, w) => Math.max(m, w.z), 0) || 0) + 1
}

export function Dock({
  apps,
  session,
  onSessionChange,
}: {
  apps: AppDefinition[]
  session: SpaceOSSession
  onSessionChange: (next: SpaceOSSession) => void
}) {
  const openForApp = (appId: AppDefinition['id']) =>
    session.windows.find((w) => w.appId === appId)

  const launch = (app: AppDefinition) => {
    if (app.href) {
      window.open(app.href, '_blank', 'noopener,noreferrer')
      return
    }
    if (session.uiMode === 'tabs') {
      onSessionChange({ ...session, activeTabAppId: app.id })
      return
    }

    const existing = openForApp(app.id)
    if (existing) {
      onSessionChange({
        ...session,
        windows: session.windows.map((w) =>
          w.id === existing.id ? { ...w, minimized: false, z: nextZ(session.windows) } : w
        ),
        activeWindowId: existing.id,
      })
      return
    }

    const win: WindowState = {
      id: newId(),
      appId: app.id,
      title: app.title,
      icon: app.icon,
      rect: defaultRect(session.windows.length),
      z: nextZ(session.windows),
      minimized: false,
      maximized: false,
    }

    onSessionChange({
      ...session,
      windows: [...session.windows, win],
      activeWindowId: win.id,
    })
  }

  const minimized = session.windows.filter((w) => w.minimized)

  return (
    <div className="absolute bottom-0 left-0 right-0 z-40 pb-4 px-4">
      <div className="max-w-4xl mx-auto">
        <div
          className="mx-auto w-fit flex items-center gap-2 rounded-2xl border border-white/15 bg-black/35 backdrop-blur-xl px-3 py-2 shadow-[0_10px_40px_rgba(0,0,0,0.35)]"
          role="navigation"
          aria-label="SPACE OS dock"
        >
          {apps.slice(0, 5).map((app) => {
            const opened = !!openForApp(app.id)
            return (
              <button
                key={app.id}
                onClick={() => launch(app)}
                className="relative h-11 w-11 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/90 transition"
                aria-label={`Open ${app.title}`}
                title={app.title}
              >
                <span className="text-xl">{app.icon}</span>
                {opened && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-4 rounded-full bg-cyan-300/80" />
                )}
              </button>
            )
          })}

          <div className="w-px h-8 bg-white/15 mx-1" aria-hidden="true" />

          <div className="flex items-center gap-2">
            {apps.slice(5).map((app) => (
              <button
                key={app.id}
                onClick={() => launch(app)}
                className="h-9 px-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 text-xs transition"
                aria-label={`Launch ${app.title}`}
                title={app.title}
              >
                <span className="mr-1">{app.icon}</span>
                <span className="hidden sm:inline">{app.title}</span>
              </button>
            ))}
          </div>

          {minimized.length > 0 && (
            <>
              <div className="w-px h-8 bg-white/15 mx-1" aria-hidden="true" />
              <div className="flex items-center gap-2">
                {minimized.slice(0, 3).map((w) => (
                  <button
                    key={w.id}
                    onClick={() =>
                      onSessionChange({
                        ...session,
                        windows: session.windows.map((x) =>
                          x.id === w.id ? { ...x, minimized: false, z: nextZ(session.windows) } : x
                        ),
                        activeWindowId: w.id,
                      })
                    }
                    className="h-9 px-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 text-xs transition"
                    title={`Restore ${w.title}`}
                    aria-label={`Restore ${w.title}`}
                  >
                    <span className="mr-1">{w.icon}</span>
                    <span className="hidden sm:inline">{w.title}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

