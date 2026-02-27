'use client'

import { useEffect, useRef } from 'react'

type Quality = 'low' | 'medium' | 'high'
type Intensity = 'low' | 'medium' | 'high'

interface GalaxySceneProps {
  intensity: Intensity
  motionEnabled: boolean
  quality: Quality
  onCanvasReady?: (canvas: HTMLCanvasElement | null) => void
}

interface GalaxyStar {
  angle: number
  radius: number
  speed: number
  size: number
  arm: number
}

export default function GalaxyScene({
  intensity,
  motionEnabled,
  quality,
  onCanvasReady,
}: GalaxySceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    onCanvasReady?.(canvas)

    const deviceRatio = Math.min(window.devicePixelRatio || 1, quality === 'high' ? 2 : 1.5)
    const setSize = () => {
      canvas.width = canvas.clientWidth * deviceRatio
      canvas.height = canvas.clientHeight * deviceRatio
      ctx.scale(deviceRatio, deviceRatio)
    }
    setSize()

    const densityMap = { low: 450, medium: 650, high: 900 }
    const starCount = densityMap[intensity]
    const arms = 3
    const stars: GalaxyStar[] = []

    for (let i = 0; i < starCount; i++) {
      const arm = i % arms
      const radius = Math.random() * 260 + 40
      const angle = ((arm / arms) * Math.PI * 2 + radius * 0.02 + Math.random() * 0.6) % (Math.PI * 2)
      stars.push({
        angle,
        radius,
        speed: (0.0006 + Math.random() * 0.0008) * (motionEnabled ? 1 : 0),
        size: Math.random() * 1.6 + 0.4,
        arm,
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#050716'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const cx = canvas.width / (2 * deviceRatio)
      const cy = canvas.height / (2 * deviceRatio)

      const coreGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 120)
      coreGradient.addColorStop(0, 'rgba(255,255,255,0.6)')
      coreGradient.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = coreGradient
      ctx.beginPath()
      ctx.arc(cx, cy, 130, 0, Math.PI * 2)
      ctx.fill()

      stars.forEach((star) => {
        const swirl = star.radius * 0.015
        const x = cx + Math.cos(star.angle + swirl) * star.radius
        const y = cy + Math.sin(star.angle + swirl) * star.radius

        const brightness = 0.4 + Math.random() * 0.6
        ctx.fillStyle = `rgba(255,255,255,${brightness})`
        ctx.beginPath()
        ctx.arc(x, y, star.size, 0, Math.PI * 2)
        ctx.fill()
      })
    }

    const animate = () => {
      draw()
      if (motionEnabled) {
        stars.forEach((star) => {
          star.angle += star.speed * (quality === 'high' ? 1.4 : 1)
        })
        frameRef.current = requestAnimationFrame(animate)
      }
    }

    animate()

    const handleResize = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      setSize()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
      onCanvasReady?.(null)
    }
  }, [intensity, motionEnabled, quality, onCanvasReady])

  return <canvas ref={canvasRef} className="w-full h-[420px] md:h-[520px] experience-v2-canvas" />
}
