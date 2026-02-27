'use client'

import { useEffect, useRef } from 'react'

type Quality = 'low' | 'medium' | 'high'
type Intensity = 'low' | 'medium' | 'high'

interface DeepSpaceSceneProps {
  intensity: Intensity
  motionEnabled: boolean
  quality: Quality
  onCanvasReady?: (canvas: HTMLCanvasElement | null) => void
}

interface Star {
  x: number
  y: number
  z: number
  baseSize: number
  twinkle: number
  twinkleSpeed: number
}

interface Fog {
  x: number
  y: number
  radius: number
  hue: number
  alpha: number
}

export default function DeepSpaceScene({
  intensity,
  motionEnabled,
  quality,
  onCanvasReady,
}: DeepSpaceSceneProps) {
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

    const densityMap = { low: 180, medium: 320, high: 520 }
    const fogMap = { low: 12, medium: 18, high: 26 }
    const starCount = densityMap[intensity]
    const fogCount = fogMap[intensity]

    const stars: Star[] = Array.from({ length: starCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      z: Math.random() * 2 + 0.2,
      baseSize: Math.random() * 1.4 + 0.6,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.01 + Math.random() * 0.02,
    }))

    const fogs: Fog[] = Array.from({ length: fogCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 260 + 160,
      hue: 230 + Math.random() * 60,
      alpha: 0.05 + Math.random() * 0.08,
    }))

    const drawStatic = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#050716'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      fogs.forEach((fog) => {
        const gradient = ctx.createRadialGradient(fog.x, fog.y, fog.radius * 0.1, fog.x, fog.y, fog.radius)
        gradient.addColorStop(0, `hsla(${fog.hue}, 80%, 60%, ${fog.alpha})`)
        gradient.addColorStop(1, 'hsla(0, 0%, 0%, 0)')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(fog.x, fog.y, fog.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      stars.forEach((star) => {
        const twinkle = (Math.sin(star.twinkle) + 1) * 0.5
        const size = star.baseSize + twinkle * 1.2
        ctx.fillStyle = `rgba(255,255,255,${0.6 + twinkle * 0.4})`
        ctx.beginPath()
        ctx.arc(star.x / deviceRatio, star.y / deviceRatio, size, 0, Math.PI * 2)
        ctx.fill()

        if (size > 1.6) {
          const glow = ctx.createRadialGradient(
            star.x / deviceRatio,
            star.y / deviceRatio,
            0,
            star.x / deviceRatio,
            star.y / deviceRatio,
            size * 6
          )
          glow.addColorStop(0, `rgba(255,255,255,${0.08 + twinkle * 0.06})`)
          glow.addColorStop(1, 'rgba(255,255,255,0)')
          ctx.fillStyle = glow
          ctx.beginPath()
          ctx.arc(star.x / deviceRatio, star.y / deviceRatio, size * 6, 0, Math.PI * 2)
          ctx.fill()
        }
      })
    }

    const animate = () => {
      drawStatic()

      if (motionEnabled) {
        stars.forEach((star) => {
          star.twinkle += star.twinkleSpeed
          star.y -= (0.05 + star.z * 0.05) * (quality === 'high' ? 1.2 : 1)
          if (star.y < -10) {
            star.y = canvas.height + 10
            star.x = Math.random() * canvas.width
          }
        })
        fogs.forEach((fog) => {
          fog.x += (Math.sin(fog.hue) * 0.05) * (intensity === 'high' ? 1.5 : 1)
          fog.y += (Math.cos(fog.hue) * 0.03) * (intensity === 'high' ? 1.3 : 1)
          if (fog.x > canvas.width + fog.radius) fog.x = -fog.radius
          if (fog.y > canvas.height + fog.radius) fog.y = -fog.radius
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
