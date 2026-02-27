'use client'

import { useEffect, useRef } from 'react'

interface UltraStarfieldProps {
  quality?: 'low' | 'medium' | 'high' | 'ultra'
  density?: number
  animationEnabled?: boolean
  className?: string
  colorful?: boolean
}

interface Star {
  x: number
  y: number
  z: number
  brightness: number
  twinkle: number
  twinkleSpeed: number
  size: number
  color: { r: number; g: number; b: number }
}

export default function UltraStarfield({
  quality = 'high',
  density = 1,
  animationEnabled = true,
  className = '',
  colorful = true,
}: UltraStarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>()
  const starsRef = useRef<Star[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    // High DPI support
    const pixelRatio = Math.min(
      window.devicePixelRatio || 1,
      quality === 'ultra' ? 3 : quality === 'high' ? 2.5 : quality === 'medium' ? 2 : 1.5
    )

    const setSize = () => {
      canvas.width = canvas.clientWidth * pixelRatio
      canvas.height = canvas.clientHeight * pixelRatio
      ctx.scale(pixelRatio, pixelRatio)
    }
    setSize()

    // Generate stars based on quality
    const starCountMap = {
      low: 150,
      medium: 400,
      high: 800,
      ultra: 1500,
    }
    const starCount = Math.floor(starCountMap[quality] * density)

    // Initialize stars
    if (starsRef.current.length === 0) {
      starsRef.current = Array.from({ length: starCount }, () => {
        const brightness = Math.random()
        const size = 
          brightness > 0.95 ? 2.5 : 
          brightness > 0.85 ? 2 : 
          brightness > 0.7 ? 1.5 : 
          1

        // Realistic star colors
        let color = { r: 255, g: 255, b: 255 }
        if (colorful) {
          const temp = Math.random()
          if (temp > 0.97) {
            // Red giant
            color = { r: 255, g: 150, b: 100 }
          } else if (temp > 0.93) {
            // Blue supergiant
            color = { r: 150, g: 180, b: 255 }
          } else if (temp > 0.88) {
            // Yellow star
            color = { r: 255, g: 245, b: 200 }
          } else if (temp > 0.83) {
            // Orange star
            color = { r: 255, g: 210, b: 150 }
          } else if (temp > 0.78) {
            // Blue-white
            color = { r: 200, g: 220, b: 255 }
          }
        }

        return {
          x: Math.random() * canvas.clientWidth,
          y: Math.random() * canvas.clientHeight,
          z: Math.random() * 2 + 0.3,
          brightness,
          twinkle: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.01 + Math.random() * 0.03,
          size,
          color,
        }
      })
    }

    const stars = starsRef.current
    let frame = 0

    const draw = () => {
      // Clear canvas with full transparency
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw stars
      stars.forEach((star) => {
        let finalBrightness = star.brightness

        if (animationEnabled) {
          finalBrightness = 
            0.3 + 
            Math.sin(frame * star.twinkleSpeed + star.twinkle) * 0.35 + 
            star.brightness * 0.35
        }

        const { r, g, b } = star.color
        const scaledSize = star.size * star.z

        // Draw glow for larger/brighter stars
        if (quality !== 'low' && scaledSize > 1.2) {
          const glowSize = scaledSize * (quality === 'ultra' ? 5 : quality === 'high' ? 4 : 3)
          const glowGradient = ctx.createRadialGradient(
            star.x,
            star.y,
            0,
            star.x,
            star.y,
            glowSize
          )
          glowGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${finalBrightness * 0.7})`)
          glowGradient.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, ${finalBrightness * 0.4})`)
          glowGradient.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, ${finalBrightness * 0.15})`)
          glowGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
          ctx.fillStyle = glowGradient
          ctx.beginPath()
          ctx.arc(star.x, star.y, glowSize, 0, Math.PI * 2)
          ctx.fill()
        }

        // Draw star core with gradient
        const coreGradient = ctx.createRadialGradient(
          star.x - scaledSize * 0.2,
          star.y - scaledSize * 0.2,
          0,
          star.x,
          star.y,
          scaledSize
        )
        coreGradient.addColorStop(0, `rgba(255, 255, 255, ${finalBrightness})`)
        coreGradient.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, ${finalBrightness})`)
        coreGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${finalBrightness * 0.7})`)
        ctx.fillStyle = coreGradient
        ctx.beginPath()
        ctx.arc(star.x, star.y, scaledSize, 0, Math.PI * 2)
        ctx.fill()

        // Add cross sparkle for brightest stars
        if ((quality === 'high' || quality === 'ultra') && star.brightness > 0.92) {
          const sparkleSize = scaledSize * 3
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${finalBrightness * 0.6})`
          ctx.lineWidth = quality === 'ultra' ? 1 : 0.7
          ctx.shadowBlur = quality === 'ultra' ? 4 : 2
          ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${finalBrightness * 0.8})`

          // Horizontal line
          ctx.beginPath()
          ctx.moveTo(star.x - sparkleSize, star.y)
          ctx.lineTo(star.x + sparkleSize, star.y)
          ctx.stroke()

          // Vertical line
          ctx.beginPath()
          ctx.moveTo(star.x, star.y - sparkleSize)
          ctx.lineTo(star.x, star.y + sparkleSize)
          ctx.stroke()

          // Diagonal lines for ultra quality
          if (quality === 'ultra') {
            const diagSize = sparkleSize * 0.7
            ctx.beginPath()
            ctx.moveTo(star.x - diagSize, star.y - diagSize)
            ctx.lineTo(star.x + diagSize, star.y + diagSize)
            ctx.stroke()
            ctx.beginPath()
            ctx.moveTo(star.x - diagSize, star.y + diagSize)
            ctx.lineTo(star.x + diagSize, star.y - diagSize)
            ctx.stroke()
          }

          ctx.shadowBlur = 0
        }
      })

      frame++
      if (animationEnabled) {
        frameRef.current = requestAnimationFrame(draw)
      }
    }

    draw()

    const handleResize = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      setSize()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [quality, density, animationEnabled, colorful])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
    />
  )
}
