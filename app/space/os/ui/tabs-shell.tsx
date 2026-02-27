'use client'

import type { AppDefinition, SpaceOSSession, WindowAppId } from '../windowing/types'
import { AppRenderer } from '../apps/app-renderer'

const INTERNAL: WindowAppId[] = ['atlas', 'tools', 'gallery']

export function TabsShell({
  apps,
  session,
  onSessionChange,
}: {
  apps: AppDefinition[]
  session: SpaceOSSession
  onSessionChange: (next: SpaceOSSession) => void
}) {
  const active = (session.activeTabAppId ?? 'atlas') as WindowAppId
  const current = INTERNAL.includes(active) ? active : 'atlas'

  const setActive = (id: WindowAppId) =>
    onSessionChange({
      ...session,
      activeTabAppId: id,
    })

  const appById = new Map(apps.map((a) => [a.id, a]))

  return (
    <div className="absolute inset-0 z-20 pt-14 pb-20 px-4">
      <div className="max-w-6xl mx-auto h-full">
        <div className="h-full rounded-2xl border border-white/12 bg-black/30 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.35)] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between gap-3 px-3 py-2 border-b border-white/10 bg-black/25">
            <div className="flex items-center gap-2 overflow-auto">
              {INTERNAL.map((id) => {
                const app = appById.get(id)!
                const selected = current === id
                return (
                  <button
                    key={id}
                    onClick={() => setActive(id)}
                    className={`h-9 px-3 rounded-xl border text-sm transition whitespace-nowrap ${
                      selected
                        ? 'bg-white/10 border-white/20 text-white'
                        : 'bg-white/5 border-white/10 text-white/75 hover:bg-white/10'
                    }`}
                  >
                    <span className="mr-2">{app.icon}</span>
                    {app.title}
                  </button>
                )
              })}
            </div>

            <div className="text-xs text-white/55 hidden sm:block">
              Fallback mode (weak device)
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <AppRenderer appId={current} />
          </div>

          <div className="px-4 py-3 border-t border-white/10 bg-black/20 text-xs text-white/60">
            Tip: use the Dock to launch other Space apps (opens in a new tab).
          </div>
        </div>
      </div>
    </div>
  )
}

