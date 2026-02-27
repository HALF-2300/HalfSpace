'use client'

import { useEffect, useRef } from 'react'

type Quality = 'low' | 'medium' | 'high'
type Intensity = 'low' | 'medium' | 'high'

interface SolarSystemSceneProps {
  intensity: Intensity
  motionEnabled: boolean
  quality: Quality
  onCanvasReady?: (canvas: HTMLCanvasElement | null) => void
}

interface OrbitPlanet {
  radius: number
  size: number
  speed: number
  hue: number
  angle: number
}

export default function SolarSystemScene({
  intensity,
  motionEnabled,
  quality,
  onCanvasReady,
}: SolarSystemSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    onCanvasReady?.(canvas)

    const deviceRatio = Math.min(window.devicePixelRatio || 1, quality === 'high' ? 3 : quality === 'medium' ? 2 : 1.5)
    const setSize = () => {
      canvas.width = canvas.clientWidth * deviceRatio
      canvas.height = canvas.clientHeight * deviceRatio
      ctx.scale(deviceRatio, deviceRatio)
    }
    setSize()

    const basePlanets: OrbitPlanet[] = [
      { radius: 50, size: 6, speed: 0.02, hue: 35, angle: Math.random() * Math.PI * 2 },
      { radius: 90, size: 8, speed: 0.015, hue: 210, angle: Math.random() * Math.PI * 2 },
      { radius: 130, size: 10, speed: 0.01, hue: 120, angle: Math.random() * Math.PI * 2 },
      { radius: 175, size: 12, speed: 0.007, hue: 280, angle: Math.random() * Math.PI * 2 },
      { radius: 230, size: 16, speed: 0.005, hue: 45, angle: Math.random() * Math.PI * 2 },
    ]

    const intensityFactor = intensity === 'high' ? 1.25 : intensity === 'medium' ? 1 : 0.8
    const qualityFactor = quality === 'high' ? 1.3 : quality === 'medium' ? 1.1 : 0.9
    const planets = basePlanets.map((p) => ({
      ...p,
      radius: p.radius * intensityFactor,
      size: p.size * qualityFactor,
      speed: p.speed * (motionEnabled ? 1 : 0),
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#050716'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / (2 * deviceRatio)
      const centerY = canvas.height / (2 * deviceRatio)

      // Ultra high-quality sun with multi-layer glow
      const sunSize = 25
      const glowSize = quality === 'high' ? 120 : quality === 'medium' ? 90 : 70
      
      // Outer glow (large, soft)
      const outerGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, glowSize)
      outerGlow.addColorStop(0, 'rgba(255, 200, 100, 0.6)')
      outerGlow.addColorStop(0.3, 'rgba(255, 180, 80, 0.4)')
      outerGlow.addColorStop(0.6, 'rgba(255, 150, 50, 0.15)')
      outerGlow.addColorStop(1, 'rgba(255, 130, 30, 0)')
      ctx.fillStyle = outerGlow
      ctx.beginPath()
      ctx.arc(centerX, centerY, glowSize, 0, Math.PI * 2)
      ctx.fill()
      
      // Middle glow
      const midGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, glowSize * 0.5)
      midGlow.addColorStop(0, 'rgba(255, 220, 120, 0.9)')
      midGlow.addColorStop(0.5, 'rgba(255, 196, 87, 0.6)')
      midGlow.addColorStop(1, 'rgba(255, 170, 60, 0)')
      ctx.fillStyle = midGlow
      ctx.beginPath()
      ctx.arc(centerX, centerY, glowSize * 0.5, 0, Math.PI * 2)
      ctx.fill()
      
      // Sun core (bright white center)
      const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, sunSize)
      coreGradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
      coreGradient.addColorStop(0.3, 'rgba(255, 240, 180, 1)')
      coreGradient.addColorStop(0.7, 'rgba(255, 200, 100, 0.95)')
      coreGradient.addColorStop(1, 'rgba(255, 180, 80, 0.8)')
      ctx.fillStyle = coreGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, sunSize, 0, Math.PI * 2)
      ctx.fill()

      planets.forEach((planet, idx) => {
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.08 + idx * 0.02})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(centerX, centerY, planet.radius, 0, Math.PI * 2)
        ctx.stroke()
      })

      planets.forEach((planet) => {
        const x = centerX + Math.cos(planet.angle) * planet.radius
        const y = centerY + Math.sin(planet.angle) * planet.radius
        const glowMultiplier = quality === 'high' ? 5 : quality === 'medium' ? 4 : 3

        // Outer atmospheric glow (largest, most diffuse)
        const outerAtmosphere = ctx.createRadialGradient(x, y, 0, x, y, planet.size * glowMultiplier)
        outerAtmosphere.addColorStop(0, `hsla(${planet.hue}, 90%, 75%, 0.4)`)
        outerAtmosphere.addColorStop(0.3, `hsla(${planet.hue}, 85%, 65%, 0.25)`)
        outerAtmosphere.addColorStop(0.6, `hsla(${planet.hue}, 80%, 55%, 0.1)`)
        outerAtmosphere.addColorStop(1, `hsla(${planet.hue}, 75%, 50%, 0)`)
        ctx.fillStyle = outerAtmosphere
        ctx.beginPath()
        ctx.arc(x, y, planet.size * glowMultiplier, 0, Math.PI * 2)
        ctx.fill()

        // Mid-layer atmosphere
        const midAtmosphere = ctx.createRadialGradient(x, y, 0, x, y, planet.size * 2.5)
        midAtmosphere.addColorStop(0, `hsla(${planet.hue}, 85%, 70%, 0.7)`)
        midAtmosphere.addColorStop(0.5, `hsla(${planet.hue}, 80%, 60%, 0.4)`)
        midAtmosphere.addColorStop(1, `hsla(${planet.hue}, 75%, 50%, 0)`)
        ctx.fillStyle = midAtmosphere
        ctx.beginPath()
        ctx.arc(x, y, planet.size * 2.5, 0, Math.PI * 2)
        ctx.fill()

        // Planet surface with gradient
        const surfaceGradient = ctx.createRadialGradient(
          x - planet.size * 0.3, 
          y - planet.size * 0.3, 
          0, 
          x, 
          y, 
          planet.size * 1.4
        )
        surfaceGradient.addColorStop(0, `hsla(${planet.hue}, 85%, 75%, 1)`)
        surfaceGradient.addColorStop(0.4, `hsla(${planet.hue}, 80%, 65%, 1)`)
        surfaceGradient.addColorStop(0.8, `hsla(${planet.hue}, 75%, 50%, 1)`)
        surfaceGradient.addColorStop(1, `hsla(${planet.hue}, 70%, 35%, 1)`)
        ctx.fillStyle = surfaceGradient
        ctx.beginPath()
        ctx.arc(x, y, planet.size, 0, Math.PI * 2)
        ctx.fill()

        // Add subtle ring for gas giants (larger planets)
        if (planet.radius > 200) {
          ctx.strokeStyle = `hsla(${planet.hue}, 75%, 70%, 0.4)`
          ctx.lineWidth = quality === 'high' ? 3 : 2
          ctx.beginPath()
          ctx.ellipse(x, y, planet.size * 2.8, planet.size * 1.2, 0, 0, Math.PI * 2)
          ctx.stroke()
          
          // Ring shadow
          ctx.strokeStyle = `hsla(${planet.hue}, 70%, 50%, 0.2)`
          ctx.lineWidth = quality === 'high' ? 2 : 1
          ctx.beginPath()
          ctx.ellipse(x, y, planet.size * 2.6, planet.size * 1.1, 0, 0, Math.PI * 2)
          ctx.stroke()
        }

        // Add a bright specular highlight
        if (quality !== 'low') {
          const highlight = ctx.createRadialGradient(
            x - planet.size * 0.4, 
            y - planet.size * 0.4, 
            0, 
            x - planet.size * 0.3, 
            y - planet.size * 0.3, 
            planet.size * 0.6
          )
          highlight.addColorStop(0, `hsla(${planet.hue}, 100%, 95%, 0.6)`)
          highlight.addColorStop(0.5, `hsla(${planet.hue}, 95%, 85%, 0.3)`)
          highlight.addColorStop(1, `hsla(${planet.hue}, 90%, 75%, 0)`)
          ctx.fillStyle = highlight
          ctx.beginPath()
          ctx.arc(x - planet.size * 0.35, y - planet.size * 0.35, planet.size * 0.4, 0, Math.PI * 2)
          ctx.fill()
        }
      })
    }

    const animate = () => {
      draw()
      if (motionEnabled) {
        planets.forEach((planet) => {
          planet.angle += planet.speed * (quality === 'high' ? 1.2 : 1)
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
