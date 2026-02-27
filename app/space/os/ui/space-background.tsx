'use client'

import { useEffect, useMemo, useRef } from 'react'
import type { PerfMode } from '../windowing/types'

type Star = { x: number; y: number; z: number; r: number; tw: number }

function rand(min: number, max: number) {
  return min + Math.random() * (max - min)
}

export function SpaceBackground({ perfMode }: { perfMode: PerfMode }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const config = useMemo(() => {
    if (perfMode === 'low') return { stars: 180, fpsCap: 24, glow: false }
    return { stars: 520, fpsCap: 60, glow: true }
  }, [perfMode])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let last = 0
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
    const stars: Star[] = []

    const resize = () => {
      const { innerWidth: w, innerHeight: h } = window
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const init = () => {
      stars.length = 0
      for (let i = 0; i < config.stars; i += 1) {
        stars.push({
          x: rand(0, window.innerWidth),
          y: rand(0, window.innerHeight),
          z: rand(0.2, 1.2),
          r: rand(0.3, 1.6),
          tw: rand(0, Math.PI * 2),
        })
      }
    }

    const draw = (t: number) => {
      const minDelta = 1000 / config.fpsCap
      if (t - last < minDelta) {
        raf = requestAnimationFrame(draw)
        return
      }
      last = t

      const w = window.innerWidth
      const h = window.innerHeight
      ctx.clearRect(0, 0, w, h)

      // very subtle “nebula haze”
      const haze = ctx.createRadialGradient(w * 0.2, h * 0.15, 40, w * 0.2, h * 0.15, Math.max(w, h))
      haze.addColorStop(0, 'rgba(140, 116, 255, 0.10)')
      haze.addColorStop(0.5, 'rgba(0, 210, 240, 0.06)')
      haze.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = haze
      ctx.fillRect(0, 0, w, h)

      for (const s of stars) {
        s.tw += 0.015 * s.z
        // slow drift
        s.x += 0.06 * s.z
        s.y += 0.02 * s.z
        if (s.x > w + 30) s.x = -30
        if (s.y > h + 30) s.y = -30

        const a = 0.35 + 0.25 * Math.sin(s.tw)
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${a})`
        ctx.fill()

        if (config.glow && s.r > 1.2) {
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.r * 3.2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(140, 116, 255, ${a * 0.08})`
          ctx.fill()
        }
      }

      raf = requestAnimationFrame(draw)
    }

    resize()
    init()
    raf = requestAnimationFrame(draw)

    const onResize = () => {
      resize()
      init()
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [config.fpsCap, config.glow, config.stars])

  return (
    <div className="absolute inset-0 z-0">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 opacity-90"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(900px 500px at 70% 20%, rgba(0, 200, 255, 0.08), transparent 55%), radial-gradient(900px 650px at 30% 80%, rgba(255, 84, 180, 0.06), transparent 60%)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(180deg, rgba(0,0,0,0.0), rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.55))',
        }}
        aria-hidden="true"
      />
    </div>
  )
}

