'use client'

import { useEffect, useState } from 'react'

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
}

function heuristicWeakDevice(): boolean {
  if (typeof navigator === 'undefined') return false
  const mem = (navigator as any).deviceMemory as number | undefined
  const cores = navigator.hardwareConcurrency
  const ua = navigator.userAgent.toLowerCase()
  const isMobile = /android|iphone|ipad|ipod/.test(ua)
  const lowMem = typeof mem === 'number' && mem > 0 && mem <= 4
  const lowCores = typeof cores === 'number' && cores > 0 && cores <= 4
  return prefersReducedMotion() || lowMem || lowCores || isMobile
}

async function fpsProbe(ms = 600): Promise<number> {
  return await new Promise((resolve) => {
    let frames = 0
    const start = performance.now()
    const tick = () => {
      frames += 1
      const now = performance.now()
      if (now - start >= ms) {
        resolve((frames * 1000) / (now - start))
        return
      }
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  })
}

export function useWeakDevice() {
  const [weak, setWeak] = useState(false)

  useEffect(() => {
    let cancelled = false
    const base = heuristicWeakDevice()
    setWeak(base)

    // One-shot probe: if rendering is struggling, prefer the tabs fallback.
    // (kept short to avoid impacting perceived load)
    fpsProbe(500).then((fps) => {
      if (cancelled) return
      if (fps < 45) setWeak(true)
    })

    return () => {
      cancelled = true
    }
  }, [])

  return weak
}

