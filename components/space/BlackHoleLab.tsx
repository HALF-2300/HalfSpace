'use client'

import { useEffect, useRef, useState } from 'react'
import blackHoleLabCopy from '@/data/blackHoleLab.copy.json'

interface BlackHoleSettings {
  mass: number // 1-100 solar masses
  distance: number // 1-20 Schwarzschild radii
  spin: number // 0-1 (0 = no spin, 1 = maximum Kerr)
  quality: 'low' | 'medium' | 'high'
}

const DEFAULT_SETTINGS: BlackHoleSettings = {
  mass: 10,
  distance: 5,
  spin: 0.5,
  quality: 'medium',
}

const STORAGE_KEY = 'blackHoleLabSettings'

export default function BlackHoleLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()
  const [settings, setSettings] = useState<BlackHoleSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        try {
          return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
        } catch {
          return DEFAULT_SETTINGS
        }
      }
    }
    return DEFAULT_SETTINGS
  })

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      const container = canvas.parentElement
      if (container) {
        canvas.width = container.clientWidth
        canvas.height = container.clientHeight
      }
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Quality settings
    const qualitySettings = {
      low: { starCount: 500, rayCount: 200, accretionParticles: 100 },
      medium: { starCount: 1000, rayCount: 400, accretionParticles: 200 },
      high: { starCount: 2000, rayCount: 800, accretionParticles: 400 },
    }

    const q = qualitySettings[settings.quality]

    // Background stars
    interface Star {
      x: number
      y: number
      brightness: number
      originalX: number
      originalY: number
    }

    const stars: Star[] = []
    for (let i = 0; i < q.starCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * Math.min(canvas.width, canvas.height) * 0.8
      stars.push({
        x: canvas.width / 2 + Math.cos(angle) * radius,
        y: canvas.height / 2 + Math.sin(angle) * radius,
        brightness: Math.random() * 0.8 + 0.2,
        originalX: canvas.width / 2 + Math.cos(angle) * radius,
        originalY: canvas.height / 2 + Math.sin(angle) * radius,
      })
    }

    // Black hole center
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // Schwarzschild radius (proportional to mass)
    const schwarzschildRadius = (settings.mass * 3) / 2 // Simplified: ~3km per solar mass, scaled for visualization
    const eventHorizonRadius = schwarzschildRadius

    // Accretion disk particles
    interface AccretionParticle {
      angle: number
      radius: number
      speed: number
      brightness: number
      size: number
    }

    const accretionParticles: AccretionParticle[] = []
    for (let i = 0; i < q.accretionParticles; i++) {
      const radius = eventHorizonRadius * 1.5 + Math.random() * eventHorizonRadius * 3
      accretionParticles.push({
        angle: Math.random() * Math.PI * 2,
        radius,
        speed: (0.02 + Math.random() * 0.03) / Math.sqrt(radius / eventHorizonRadius), // Keplerian motion
        brightness: Math.random() * 0.5 + 0.5,
        size: Math.random() * 2 + 1,
      })
    }

    let frame = 0

    const animate = () => {
      // Clear with dark space background
      ctx.fillStyle = 'rgba(5, 5, 15, 0.3)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update accretion disk
      accretionParticles.forEach((particle) => {
        particle.angle += particle.speed
        if (particle.angle > Math.PI * 2) particle.angle -= Math.PI * 2
      })

      // Draw gravitational lensing effect
      // Simplified gravitational lensing: displace stars based on distance from black hole
      stars.forEach((star) => {
        const dx = star.originalX - centerX
        const dy = star.originalY - centerY
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < eventHorizonRadius * 10) {
          // Calculate lensing displacement
          const impactParam = dist
          const deflectionAngle = (4 * settings.mass * 3) / impactParam // Simplified Einstein deflection
          const deflection = Math.min(deflectionAngle * 50, dist * 0.3) // Cap deflection

          const angle = Math.atan2(dy, dx)
          const newAngle = angle + deflection / dist

          star.x = centerX + Math.cos(newAngle) * dist
          star.y = centerY + Math.sin(newAngle) * dist

          // Brighten stars near the black hole (gravitational lensing amplification)
          const amplification = 1 + (eventHorizonRadius * 5) / (dist + 1)
          star.brightness = Math.min(1, star.brightness * amplification)
        } else {
          star.x = star.originalX
          star.y = star.originalY
        }
      })

      // Draw background stars with lensing
      stars.forEach((star) => {
        if (star.x >= 0 && star.x <= canvas.width && star.y >= 0 && star.y <= canvas.height) {
          ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness * 0.8})`
          ctx.beginPath()
          ctx.arc(star.x, star.y, 1, 0, Math.PI * 2)
          ctx.fill()

          // Add glow for bright stars
          if (star.brightness > 0.7) {
            const glowGradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, 3)
            glowGradient.addColorStop(0, `rgba(255, 255, 255, ${star.brightness * 0.3})`)
            glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
            ctx.fillStyle = glowGradient
            ctx.beginPath()
            ctx.arc(star.x, star.y, 3, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      })

      // Draw accretion disk
      accretionParticles.forEach((particle) => {
        const x = centerX + Math.cos(particle.angle) * particle.radius
        const y = centerY + Math.sin(particle.angle) * particle.radius

        // Doppler beaming: brighter on approaching side
        const velocity = particle.speed * particle.radius
        const dopplerFactor = 1 + velocity * 0.1
        const brightness = Math.min(1, particle.brightness * dopplerFactor)

        // Color gradient: blue (cool) to red (hot) based on radius
        const temp = 1 - (particle.radius - eventHorizonRadius * 1.5) / (eventHorizonRadius * 3)
        const r = Math.floor(100 + temp * 155)
        const g = Math.floor(50 + temp * 100)
        const b = Math.floor(200 - temp * 100)

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${brightness})`
        ctx.beginPath()
        ctx.arc(x, y, particle.size, 0, Math.PI * 2)
        ctx.fill()

        // Add glow
        const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, particle.size * 2)
        glowGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${brightness * 0.5})`)
        glowGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
        ctx.fillStyle = glowGradient
        ctx.beginPath()
        ctx.arc(x, y, particle.size * 2, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw event horizon (black hole shadow)
      const shadowGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, eventHorizonRadius * 1.2)
      shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 1)')
      shadowGradient.addColorStop(0.8, 'rgba(0, 0, 0, 0.8)')
      shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = shadowGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, eventHorizonRadius * 1.2, 0, Math.PI * 2)
      ctx.fill()

      // Draw photon sphere (subtle ring)
      ctx.strokeStyle = 'rgba(100, 100, 200, 0.3)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(centerX, centerY, eventHorizonRadius * 1.5, 0, Math.PI * 2)
      ctx.stroke()

      // Draw Einstein ring effect (bright ring around black hole)
      const ringGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        eventHorizonRadius * 2,
        centerX,
        centerY,
        eventHorizonRadius * 3
      )
      ringGradient.addColorStop(0, 'rgba(255, 255, 255, 0)')
      ringGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)')
      ringGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
      ctx.fillStyle = ringGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, eventHorizonRadius * 3, 0, Math.PI * 2)
      ctx.fill()

      frame++
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [settings])

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS)
  }

  const lang = 'en' // Could be made dynamic based on locale

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Canvas Container */}
      <div className="flex-1 relative rounded-2xl overflow-hidden border border-purple-500/30 bg-black/50">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      {/* Controls Panel */}
      <div className="lg:w-80 space-y-6">
        {/* Controls */}
        <div className="glass rounded-2xl border border-purple-500/30 p-6 space-y-6">
          <h3 className="text-xl font-bold text-gradient">Controls</h3>

          {/* Mass Slider */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              {blackHoleLabCopy.controls.mass.label[lang]}: {settings.mass.toFixed(1)}{' '}
              {blackHoleLabCopy.controls.mass.unit[lang]}
            </label>
            <input
              type="range"
              min="1"
              max="100"
              step="0.5"
              value={settings.mass}
              onChange={(e) => setSettings({ ...settings, mass: parseFloat(e.target.value) })}
              className="w-full h-2 bg-purple-500/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>

          {/* Distance Slider */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              {blackHoleLabCopy.controls.distance.label[lang]}: {settings.distance.toFixed(1)}{' '}
              {blackHoleLabCopy.controls.distance.unit[lang]}
            </label>
            <input
              type="range"
              min="1"
              max="20"
              step="0.1"
              value={settings.distance}
              onChange={(e) => setSettings({ ...settings, distance: parseFloat(e.target.value) })}
              className="w-full h-2 bg-purple-500/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>

          {/* Spin Slider */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              {blackHoleLabCopy.controls.spin.label[lang]}: {settings.spin.toFixed(2)}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={settings.spin}
              onChange={(e) => setSettings({ ...settings, spin: parseFloat(e.target.value) })}
              className="w-full h-2 bg-purple-500/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>

          {/* Quality Preset */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              {blackHoleLabCopy.controls.quality.label[lang]}
            </label>
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as const).map((preset) => (
                <button
                  key={preset}
                  onClick={() => setSettings({ ...settings, quality: preset })}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    settings.quality === preset
                      ? 'bg-purple-500/30 text-white border border-purple-500/50'
                      : 'bg-purple-500/10 text-gray-300 border border-purple-500/20 hover:bg-purple-500/20'
                  }`}
                >
                  {blackHoleLabCopy.controls.quality.presets[preset][lang]}
                </button>
              ))}
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="w-full px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-white rounded-lg border border-purple-500/30 transition-all font-medium"
          >
            {blackHoleLabCopy.controls.reset[lang]}
          </button>
        </div>

        {/* Explanation Panel */}
        <div className="glass rounded-2xl border border-purple-500/30 p-6 space-y-6">
          <h3 className="text-xl font-bold text-gradient">What You're Seeing</h3>
          <ul className="space-y-3 text-sm text-gray-300">
            {blackHoleLabCopy.whatYoureSeeing[lang].map((point, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>

          <div className="pt-4 border-t border-purple-500/20">
            <h4 className="text-lg font-bold text-gradient mb-3">Common Misconceptions</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              {blackHoleLabCopy.misconceptions[lang].map((point, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-amber-400 mt-1">⚠</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
