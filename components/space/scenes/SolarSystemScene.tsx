'use client'

import { useEffect, useRef } from 'react'

export default function SolarSystemScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const container = canvas.parentElement
    if (!container) return

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // Planets configuration
    interface Planet {
      name: string
      distance: number
      size: number
      color: string
      speed: number
      angle: number
      glowColor: string
    }

    const planets: Planet[] = [
      { name: 'Mercury', distance: 80, size: 8, color: '#8B7355', speed: 0.02, angle: 0, glowColor: 'rgba(139, 115, 85, 0.3)' },
      { name: 'Venus', distance: 110, size: 12, color: '#FFC649', speed: 0.015, angle: Math.PI / 3, glowColor: 'rgba(255, 198, 73, 0.3)' },
      { name: 'Earth', distance: 150, size: 13, color: '#4A90E2', speed: 0.012, angle: Math.PI / 2, glowColor: 'rgba(74, 144, 226, 0.3)' },
      { name: 'Mars', distance: 190, size: 10, color: '#CD5C5C', speed: 0.01, angle: Math.PI, glowColor: 'rgba(205, 92, 92, 0.3)' },
      { name: 'Jupiter', distance: 250, size: 28, color: '#D8CA9D', speed: 0.006, angle: Math.PI * 1.5, glowColor: 'rgba(216, 202, 157, 0.3)' },
      { name: 'Saturn', distance: 320, size: 24, color: '#FAD5A5', speed: 0.005, angle: Math.PI * 1.8, glowColor: 'rgba(250, 213, 165, 0.3)' },
    ]

    // Background stars
    const stars: Array<{ x: number; y: number; size: number; opacity: number }> = []
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.6 + 0.2,
      })
    }

    const animate = () => {
      // Clear with space background
      ctx.fillStyle = 'rgba(5, 8, 16, 0.8)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw stars
      stars.forEach((star) => {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw sun
      const sunGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 35)
      sunGradient.addColorStop(0, 'rgba(255, 255, 200, 1)')
      sunGradient.addColorStop(0.5, 'rgba(255, 200, 100, 1)')
      sunGradient.addColorStop(1, 'rgba(255, 150, 50, 0.8)')
      ctx.fillStyle = sunGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, 35, 0, Math.PI * 2)
      ctx.fill()

      // Sun glow
      const sunGlow = ctx.createRadialGradient(centerX, centerY, 35, centerX, centerY, 60)
      sunGlow.addColorStop(0, 'rgba(255, 200, 100, 0.6)')
      sunGlow.addColorStop(1, 'rgba(255, 150, 50, 0)')
      ctx.fillStyle = sunGlow
      ctx.beginPath()
      ctx.arc(centerX, centerY, 60, 0, Math.PI * 2)
      ctx.fill()

      // Draw orbits
      planets.forEach((planet) => {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(centerX, centerY, planet.distance, 0, Math.PI * 2)
        ctx.stroke()
      })

      // Update and draw planets
      planets.forEach((planet) => {
        planet.angle += planet.speed

        const x = centerX + Math.cos(planet.angle) * planet.distance
        const y = centerY + Math.sin(planet.angle) * planet.distance

        // Planet glow
        const planetGlow = ctx.createRadialGradient(x, y, 0, x, y, planet.size * 3)
        planetGlow.addColorStop(0, planet.glowColor)
        planetGlow.addColorStop(1, 'transparent')
        ctx.fillStyle = planetGlow
        ctx.beginPath()
        ctx.arc(x, y, planet.size * 3, 0, Math.PI * 2)
        ctx.fill()

        // Planet
        ctx.fillStyle = planet.color
        ctx.beginPath()
        ctx.arc(x, y, planet.size, 0, Math.PI * 2)
        ctx.fill()

        // Planet highlight
        const highlight = ctx.createRadialGradient(
          x - planet.size * 0.3,
          y - planet.size * 0.3,
          0,
          x - planet.size * 0.3,
          y - planet.size * 0.3,
          planet.size * 0.6
        )
        highlight.addColorStop(0, 'rgba(255, 255, 255, 0.4)')
        highlight.addColorStop(1, 'transparent')
        ctx.fillStyle = highlight
        ctx.beginPath()
        ctx.arc(x - planet.size * 0.3, y - planet.size * 0.3, planet.size * 0.6, 0, Math.PI * 2)
        ctx.fill()

        // Saturn's rings
        if (planet.name === 'Saturn') {
          ctx.strokeStyle = 'rgba(200, 200, 200, 0.6)'
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.ellipse(x, y, planet.size * 1.5, planet.size * 0.8, planet.angle, 0, Math.PI * 2)
          ctx.stroke()
          ctx.strokeStyle = 'rgba(150, 150, 150, 0.4)'
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.ellipse(x, y, planet.size * 1.8, planet.size * 1, planet.angle, 0, Math.PI * 2)
          ctx.stroke()
        }
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return (
    <div className="relative w-full h-full min-h-[600px]">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center px-4">
          <h3 className="text-4xl md:text-5xl font-bold mb-4 text-gradient space-heading-glow">
            Solar System
          </h3>
          <p className="text-xl text-gray-300 max-w-2xl">
            Watch the planets orbit the sun in this simplified but mesmerizing view of our cosmic neighborhood
          </p>
        </div>
      </div>
    </div>
  )
}
