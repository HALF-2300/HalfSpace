'use client'

import { useEffect, useState } from 'react'
import styles from './space-os.module.css'
import { Dock } from './ui/dock'
import { SpaceBackground } from './ui/space-background'
import { TabsShell } from './ui/tabs-shell'
import { WindowShell } from './windowing/window-shell'
import type { AppDefinition, PerfMode, SpaceOSSession, UiMode } from './windowing/types'
import { loadSession, saveSession } from './windowing/storage'
import { useWeakDevice } from './windowing/use-weak-device'

const SESSION_KEY = 'space_os_session_v1'

const APPS: AppDefinition[] = [
  { id: 'atlas', title: 'Universe Atlas', icon: '🗺️' },
  { id: 'tools', title: 'Cosmology Tools', icon: '🧮' },
  { id: 'gallery', title: 'Gallery', icon: '🖼️' },
  // Launchers to existing Space apps (optional, opens in new tab)
  { id: 'encyclopedia', title: 'Encyclopedia', icon: '📚', href: '/space/encyclopedia' },
  { id: 'lab', title: 'Lab', icon: '🧪', href: '/space/lab-pro' },
  { id: 'observatory', title: 'Observatory', icon: '🔭', href: '/space/observatory' },
  { id: 'graph', title: 'Graph', icon: '📈', href: '/space/graph' },
  { id: 'odyssey', title: 'Odyssey', icon: '🚀', href: '/space/universe-experience' },
]

function defaultSession(isWeak: boolean): SpaceOSSession {
  return {
    uiMode: isWeak ? 'tabs' : 'windows',
    perfMode: isWeak ? 'low' : 'high',
    windows: [],
    activeWindowId: null,
  }
}

export default function SpaceOS() {
  const weak = useWeakDevice()
  const [ready, setReady] = useState(false)
  const [session, setSession] = useState<SpaceOSSession>(() => defaultSession(false))

  // Load once (client-only).
  useEffect(() => {
    const restored = loadSession(SESSION_KEY)
    setSession(restored ?? defaultSession(weak))
    setReady(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // If we had no stored session and we later discover device is weak,
  // auto-fallback to tabs + low once, without overriding explicit user choice.
  useEffect(() => {
    if (!ready) return
    const restored = loadSession(SESSION_KEY)
    if (restored) return
    if (weak) setSession(defaultSession(true))
  }, [ready, weak])

  // Persist session.
  useEffect(() => {
    if (!ready) return
    saveSession(SESSION_KEY, session)
  }, [ready, session])

  const setUiMode = (uiMode: UiMode) => setSession((s) => ({ ...s, uiMode }))
  const setPerfMode = (perfMode: PerfMode) => setSession((s) => ({ ...s, perfMode }))

  if (!ready) {
    return (
      <div className={`${styles.shell} fixed inset-0 z-[9999]`}>
        <div className="h-full w-full flex items-center justify-center text-white/80">
          Loading SPACE OS…
        </div>
      </div>
    )
  }

  return (
    <div className={`${styles.shell} fixed inset-0 z-[9999]`}>
      <SpaceBackground perfMode={session.perfMode} />

      <header className="absolute top-0 left-0 right-0 z-30 px-4 pt-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-white/90">
            <div className="text-lg font-semibold tracking-wide">SPACE OS</div>
            <div className="text-xs text-white/60 hidden sm:block">/space/os</div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className={styles.pillButton}
              onClick={() => setPerfMode(session.perfMode === 'high' ? 'low' : 'high')}
              aria-label="Toggle performance mode"
              title="Performance mode"
            >
              {session.perfMode === 'high' ? 'High' : 'Low'}
            </button>
            <button
              className={styles.pillButton}
              onClick={() => setUiMode(session.uiMode === 'windows' ? 'tabs' : 'windows')}
              aria-label="Toggle UI mode"
              title="UI mode"
            >
              {session.uiMode === 'windows' ? 'Windows' : 'Tabs'}
            </button>
          </div>
        </div>
      </header>

      {session.uiMode === 'windows' ? (
        <WindowShell
          apps={APPS}
          session={session}
          onSessionChange={setSession}
          perfMode={session.perfMode}
        />
      ) : (
        <TabsShell apps={APPS} session={session} onSessionChange={setSession} />
      )}

      <Dock
        apps={APPS}
        session={session}
        onSessionChange={setSession}
      />
    </div>
  )
}

