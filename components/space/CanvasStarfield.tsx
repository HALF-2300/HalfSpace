'use client'

import { useEffect, useRef } from 'react'

interface CanvasStarfieldProps {
  intensity?: 'low' | 'medium' | 'high'
  className?: string
}

export default function CanvasStarfield({ 
  intensity = 'medium',
  className = '' 
}: CanvasStarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Star configuration based on intensity
    const starCounts = { low: 200, medium: 400, high: 800 }
    const starCount = starCounts[intensity]

    // Create stars
    interface Star {
      x: number
      y: number
      z: number
      size: number
      speed: number
      opacity: number
      twinkle: number
      twinkleSpeed: number
    }

    const stars: Star[] = []
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width * 2 - canvas.width,
        y: Math.random() * canvas.height * 2 - canvas.height,
        z: Math.random() * 2000,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.8 + 0.2,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.05 + 0.02,
      })
    }

    // Nebula particles
    interface NebulaParticle {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      opacity: number
      color: string
    }

    const nebulaCount = intensity === 'high' ? 150 : intensity === 'medium' ? 100 : 50
    const nebulaParticles: NebulaParticle[] = []
    for (let i = 0; i < nebulaCount; i++) {
      nebulaParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 100 + 50,
        opacity: Math.random() * 0.3 + 0.1,
        color: ['rgba(139, 92, 246, ', 'rgba(59, 130, 246, ', 'rgba(236, 72, 153, '][
          Math.floor(Math.random() * 3)
        ],
      })
    }

    // Shooting stars
    interface ShootingStar {
      x: number
      y: number
      vx: number
      vy: number
      life: number
      maxLife: number
    }

    const shootingStars: ShootingStar[] = []
    const addShootingStar = () => {
      shootingStars.push({
        x: Math.random() * canvas.width,
        y: -10,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        life: 0,
        maxLife: Math.random() * 50 + 30,
      })
    }

    // Initial shooting stars
    for (let i = 0; i < 3; i++) {
      setTimeout(() => addShootingStar(), i * 2000)
    }

    let frame = 0

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 14, 39, 0.3)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw nebula
      nebulaParticles.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy

        // Wrap around edges
        if (particle.x < -particle.size) particle.x = canvas.width + particle.size
        if (particle.x > canvas.width + particle.size) particle.x = -particle.size
        if (particle.y < -particle.size) particle.y = canvas.height + particle.size
        if (particle.y > canvas.height + particle.size) particle.y = -particle.size

        // Draw nebula particle with gradient
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size
        )
        gradient.addColorStop(0, `${particle.color}${particle.opacity})`)
        gradient.addColorStop(0.5, `${particle.color}${particle.opacity * 0.5})`)
        gradient.addColorStop(1, `${particle.color}0)`)

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
      })

      // Update and draw stars
      stars.forEach((star) => {
        // Move star
        star.z -= star.speed

        // Reset star when it goes too close
        if (star.z <= 0) {
          star.x = Math.random() * canvas.width * 2 - canvas.width
          star.y = Math.random() * canvas.height * 2 - canvas.height
          star.z = 2000
        }

        // Calculate 3D position
        const k = 128 / star.z
        const px = star.x * k + canvas.width / 2
        const py = star.y * k + canvas.height / 2

        // Twinkle effect
        star.twinkle += star.twinkleSpeed
        const twinkleOpacity = (Math.sin(star.twinkle) + 1) / 2
        const finalOpacity = star.opacity * (0.5 + twinkleOpacity * 0.5)

        // Draw star
        if (px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height) {
          ctx.fillStyle = `rgba(255, 255, 255, ${finalOpacity})`
          ctx.beginPath()
          ctx.arc(px, py, star.size * k, 0, Math.PI * 2)
          ctx.fill()

          // Add glow for larger stars
          if (star.size > 1.5) {
            const glowGradient = ctx.createRadialGradient(px, py, 0, px, py, star.size * k * 3)
            glowGradient.addColorStop(0, `rgba(255, 255, 255, ${finalOpacity * 0.5})`)
            glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
            ctx.fillStyle = glowGradient
            ctx.beginPath()
            ctx.arc(px, py, star.size * k * 3, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      })

      // Update and draw shooting stars
      shootingStars.forEach((star, index) => {
        star.x += star.vx
        star.y += star.vy
        star.life++

        if (star.life < star.maxLife && star.y < canvas.height + 10 && star.x > -10 && star.x < canvas.width + 10) {
          const opacity = 1 - star.life / star.maxLife
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(star.x, star.y)
          ctx.lineTo(star.x - star.vx * 10, star.y - star.vy * 10)
          ctx.stroke()

          // Add glow
          ctx.shadowBlur = 10
          ctx.shadowColor = 'rgba(255, 255, 255, 0.8)'
          ctx.beginPath()
          ctx.arc(star.x, star.y, 3, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
          ctx.fill()
          ctx.shadowBlur = 0
        } else {
          shootingStars.splice(index, 1)
        }
      })

      // Add new shooting star occasionally
      frame++
      if (frame % 180 === 0 && shootingStars.length < 3) {
        addShootingStar()
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [intensity])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
    />
  )
}
