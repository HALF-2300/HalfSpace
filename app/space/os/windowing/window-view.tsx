'use client'

import type React from 'react'
import { useRef } from 'react'
import { AppRenderer } from '../apps/app-renderer'
import type { AppDefinition, PerfMode, WindowRect, WindowState } from './types'

type DragMode = 'move' | 'resize' | null

function stop(e: React.SyntheticEvent) {
  e.stopPropagation()
}

export function WindowView({
  windowState,
  app,
  active,
  perfMode,
  onFocus,
  onClose,
  onMinimize,
  onToggleMaximize,
  onRectChange,
}: {
  windowState: WindowState
  app?: AppDefinition
  active: boolean
  perfMode: PerfMode
  onFocus: () => void
  onClose: () => void
  onMinimize: () => void
  onToggleMaximize: () => void
  onRectChange: (rect: WindowRect) => void
}) {
  const rafRef = useRef<number | null>(null)
  const dragRef = useRef<{
    mode: DragMode
    startX: number
    startY: number
    startRect: WindowRect
  } | null>(null)

  if (windowState.minimized) return null

  const scheduleRect = (next: WindowRect) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => onRectChange(next))
  }

  const startDrag = (e: React.PointerEvent, mode: DragMode) => {
    if (windowState.maximized) return
    onFocus()
    stop(e)
    ;(e.currentTarget as Element).setPointerCapture?.(e.pointerId)
    dragRef.current = {
      mode,
      startX: e.clientX,
      startY: e.clientY,
      startRect: windowState.rect,
    }
  }

  const moveDrag = (e: React.PointerEvent) => {
    const d = dragRef.current
    if (!d) return
    stop(e)
    const dx = e.clientX - d.startX
    const dy = e.clientY - d.startY

    if (d.mode === 'move') {
      scheduleRect({ ...d.startRect, x: d.startRect.x + dx, y: d.startRect.y + dy })
    } else if (d.mode === 'resize') {
      scheduleRect({
        ...d.startRect,
        w: Math.max(320, d.startRect.w + dx),
        h: Math.max(240, d.startRect.h + dy),
      })
    }
  }

  const endDrag = (e: React.PointerEvent) => {
    if (!dragRef.current) return
    stop(e)
    dragRef.current = null
  }

  const glass =
    perfMode === 'high'
      ? 'bg-black/30 backdrop-blur-xl'
      : 'bg-black/45'

  return (
    <div
      className={`absolute rounded-2xl border shadow-[0_18px_70px_rgba(0,0,0,0.55)] overflow-hidden ${
        active ? 'border-white/25' : 'border-white/12'
      } ${glass}`}
      style={{
        left: windowState.rect.x,
        top: windowState.rect.y,
        width: windowState.rect.w,
        height: windowState.rect.h,
        zIndex: windowState.z,
      }}
      onPointerDown={(e) => {
        stop(e)
        onFocus()
      }}
      onPointerMove={moveDrag}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div
        className="h-11 px-3 flex items-center justify-between gap-2 border-b border-white/10 bg-black/25"
        onPointerDown={(e) => startDrag(e, 'move')}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg">{windowState.icon}</span>
          <div className="text-sm text-white/90 font-medium truncate">{windowState.title}</div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              stop(e)
              onMinimize()
            }}
            className="h-7 w-7 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white/75 text-xs"
            aria-label="Minimize"
            title="Minimize"
          >
            —
          </button>
          <button
            onClick={(e) => {
              stop(e)
              onToggleMaximize()
            }}
            className="h-7 w-7 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white/75 text-xs"
            aria-label={windowState.maximized ? 'Restore' : 'Maximize'}
            title={windowState.maximized ? 'Restore' : 'Maximize'}
          >
            {windowState.maximized ? '❐' : '▢'}
          </button>
          <button
            onClick={(e) => {
              stop(e)
              onClose()
            }}
            className="h-7 w-7 rounded-lg border border-red-300/20 bg-red-500/15 hover:bg-red-500/20 text-white/85 text-xs"
            aria-label="Close"
            title="Close"
          >
            ×
          </button>
        </div>
      </div>

      <div className="h-[calc(100%-44px)] overflow-auto">
        {app?.href ? (
          <div className="p-4 text-sm text-white/85">
            <div className="font-semibold mb-1">{app.title}</div>
            <div className="text-white/65 mb-4">
              This app is an existing Space page. Open it in a new tab:
            </div>
            <a
              href={app.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-xl bg-cyan-400/15 border border-cyan-300/30 text-white hover:bg-cyan-400/20"
            >
              Open {app.title}
              <span className="text-white/60">↗</span>
            </a>
          </div>
        ) : (
          <AppRenderer appId={windowState.appId} />
        )}
      </div>

      {!windowState.maximized && (
        <div
          className="absolute right-0 bottom-0 h-5 w-5 cursor-nwse-resize"
          onPointerDown={(e) => startDrag(e, 'resize')}
          aria-hidden="true"
          title="Resize"
        >
          <div className="absolute right-1 bottom-1 h-3 w-3 border-r border-b border-white/25 opacity-70" />
        </div>
      )}
    </div>
  )
}

