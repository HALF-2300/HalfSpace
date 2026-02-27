'use client'

import { useEffect, useRef } from 'react'

type Quality = 'low' | 'medium' | 'high'
type Intensity = 'low' | 'medium' | 'high'

interface BlackHoleSceneProps {
  intensity: Intensity
  motionEnabled: boolean
  quality: Quality
  onCanvasReady?: (canvas: HTMLCanvasElement | null) => void
}

interface AccretionParticle {
  angle: number
  radius: number
  speed: number
  thickness: number
  hue: number
}

export default function BlackHoleScene({
  intensity,
  motionEnabled,
  quality,
  onCanvasReady,
}: BlackHoleSceneProps) {
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

    const densityMap = { low: 140, medium: 200, high: 280 }
    const particleCount = densityMap[intensity]

    const particles: AccretionParticle[] = Array.from({ length: particleCount }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: 110 + Math.random() * 220,
      speed: (0.01 + Math.random() * 0.02) * (motionEnabled ? 1 : 0),
      thickness: Math.random() * 2 + 0.5,
      hue: 20 + Math.random() * 40,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#02030f'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const cx = canvas.width / (2 * deviceRatio)
      const cy = canvas.height / (2 * deviceRatio)

      const holeRadius = 80
      const shadowGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, holeRadius * 2.5)
      shadowGradient.addColorStop(0, 'rgba(0,0,0,0.9)')
      shadowGradient.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = shadowGradient
      ctx.beginPath()
      ctx.arc(cx, cy, holeRadius * 2.5, 0, Math.PI * 2)
      ctx.fill()

      const eventHorizonGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, holeRadius)
      eventHorizonGradient.addColorStop(0, 'rgba(0,0,0,1)')
      eventHorizonGradient.addColorStop(1, 'rgba(20,10,40,0.8)')
      ctx.fillStyle = eventHorizonGradient
      ctx.beginPath()
      ctx.arc(cx, cy, holeRadius, 0, Math.PI * 2)
      ctx.fill()

      particles.forEach((p) => {
        const x = cx + Math.cos(p.angle) * p.radius
        const y = cy + Math.sin(p.angle) * p.radius

        const gradient = ctx.createLinearGradient(
          x - Math.sin(p.angle) * p.thickness * 4,
          y + Math.cos(p.angle) * p.thickness * 4,
          x + Math.sin(p.angle) * p.thickness * 4,
          y - Math.cos(p.angle) * p.thickness * 4
        )
        gradient.addColorStop(0, `hsla(${p.hue}, 90%, 65%, 0.1)`)
        gradient.addColorStop(0.5, `hsla(${p.hue}, 90%, 70%, 0.8)`)
        gradient.addColorStop(1, `hsla(${p.hue + 20}, 90%, 70%, 0.15)`)
        ctx.strokeStyle = gradient
        ctx.lineWidth = p.thickness
        ctx.beginPath()
        ctx.arc(cx, cy, p.radius, p.angle, p.angle + 0.08 + p.thickness * 0.02)
        ctx.stroke()
      })

      // Gravitational lensing ring
      const lensGradient = ctx.createRadialGradient(cx, cy, holeRadius, cx, cy, holeRadius + 24)
      lensGradient.addColorStop(0, 'rgba(255,255,255,0.04)')
      lensGradient.addColorStop(1, 'rgba(255,255,255,0.0)')
      ctx.strokeStyle = lensGradient
      ctx.lineWidth = 8
      ctx.beginPath()
      ctx.arc(cx, cy, holeRadius + 10, 0, Math.PI * 2)
      ctx.stroke()
    }

    const animate = () => {
      draw()
      if (motionEnabled) {
        particles.forEach((p) => {
          p.angle += p.speed * (quality === 'high' ? 1.3 : 1)
          p.radius -= 0.08 * (quality === 'high' ? 1.1 : 1)
          if (p.radius < 95) {
            p.radius = 220 + Math.random() * 120
            p.angle = Math.random() * Math.PI * 2
          }
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
