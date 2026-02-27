'use client'

import { useEffect, useRef } from 'react'

interface SandboxStarfieldProps {
  density: number
  speed: number
  nebulaIntensity: number
  travelBoost?: boolean
  className?: string
}

interface Star {
  x: number
  y: number
  size: number
  velocity: number
  opacity: number
}

export default function SandboxStarfield({
  density,
  speed,
  nebulaIntensity,
  travelBoost = false,
  className = '',
}: SandboxStarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const starCount = Math.max(50, Math.min(2000, Math.round(density)))
    const speedScale = 0.4 + Math.min(speed, 2) * 0.8 + (travelBoost ? 0.4 : 0)

    const stars: Star[] = Array.from({ length: starCount }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.6 + 0.3,
      velocity: (Math.random() * 0.8 + 0.2) * speedScale,
      opacity: Math.random() * 0.6 + 0.2,
    }))

    const animate = () => {
      ctx.fillStyle = 'rgba(5, 8, 20, 0.35)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      stars.forEach((star) => {
        star.y += star.velocity
        if (star.y > canvas.height) {
          star.y = -2
          star.x = Math.random() * canvas.width
        }

        ctx.beginPath()
        ctx.fillStyle = `rgba(255,255,255,${star.opacity})`
        ctx.shadowBlur = 6
        ctx.shadowColor = 'rgba(139,92,246,0.4)'
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      })

      rafRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [density, speed, travelBoost])

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`} style={{ zIndex: 1 }}>
      <canvas ref={canvasRef} className="w-full h-full" />
      <div
        className="absolute inset-0 mix-blend-screen blur-3xl"
        style={{
          opacity: Math.min(1, nebulaIntensity * 1.3),
          background:
            'radial-gradient(circle at 30% 30%, rgba(139,92,246,0.45), transparent 45%), radial-gradient(circle at 70% 60%, rgba(59,130,246,0.35), transparent 40%), radial-gradient(circle at 50% 50%, rgba(236,72,153,0.25), transparent 35%)',
        }}
      />
      {travelBoost && (
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-purple-500/10 to-transparent" style={{ opacity: 0.6 }} />
      )}
    </div>
  )
}
