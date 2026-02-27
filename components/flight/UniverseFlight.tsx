'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import styles from './UniverseFlight.module.css'

// Types for stars and destinations
interface Star {
  x: number
  y: number
  z: number
  size: number
  brightness: number
  color: string
}

interface Destination {
  id: string
  name: string
  type: 'planet' | 'star' | 'galaxy' | 'nebula' | 'other'
  x: number
  y: number
  z: number
  size: number
  color: string
  url: string
  icon: string
}

interface FlightState {
  x: number
  y: number
  z: number
  velocityX: number
  velocityY: number
  velocityZ: number
  rotationX: number
  rotationY: number
  warpSpeed: boolean
}

// Destination data based on content
const DESTINATIONS: Destination[] = [
  { id: 'sun', name: 'The Sun', type: 'star', x: 0, y: 0, z: 0, size: 60, color: '#fbbf24', url: '/sun', icon: '☀️' },
  { id: 'mercury', name: 'Mercury', type: 'planet', x: 100, y: 10, z: 50, size: 8, color: '#9ca3af', url: '/mercury', icon: '☿️' },
  { id: 'venus', name: 'Venus', type: 'planet', x: 150, y: -20, z: 80, size: 12, color: '#fcd34d', url: '/venus', icon: '♀️' },
  { id: 'earth', name: 'Earth', type: 'planet', x: 200, y: 0, z: 120, size: 13, color: '#3b82f6', url: '/earth', icon: '🌍' },
  { id: 'mars', name: 'Mars', type: 'planet', x: 280, y: 15, z: 160, size: 10, color: '#ef4444', url: '/mars', icon: '🔴' },
  { id: 'jupiter', name: 'Jupiter', type: 'planet', x: 500, y: -30, z: 300, size: 40, color: '#f97316', url: '/jupiter', icon: '🪐' },
  { id: 'saturn', name: 'Saturn', type: 'planet', x: 700, y: 20, z: 400, size: 35, color: '#fbbf24', url: '/saturn', icon: '🪐' },
  { id: 'uranus', name: 'Uranus', type: 'planet', x: 900, y: -10, z: 500, size: 20, color: '#06b6d4', url: '/uranus', icon: '🔵' },
  { id: 'neptune', name: 'Neptune', type: 'planet', x: 1100, y: 5, z: 600, size: 19, color: '#3b82f6', url: '/neptune', icon: '🔵' },
  { id: 'black-holes', name: 'Black Holes', type: 'other', x: -500, y: 200, z: 800, size: 50, color: '#1f2937', url: '/black-holes', icon: '⚫' },
  { id: 'nebulae', name: 'Nebulae', type: 'nebula', x: 300, y: 400, z: 1000, size: 80, color: '#a855f7', url: '/nebulae', icon: '🌫️' },
  { id: 'galaxies', name: 'Galaxies', type: 'galaxy', x: -200, y: -300, z: 1500, size: 100, color: '#ec4899', url: '/galaxies', icon: '🌌' },
]

interface UniverseFlightProps {
  onExit?: () => void
  startPosition?: { x: number; y: number; z: number }
}

export default function UniverseFlight({ onExit, startPosition }: UniverseFlightProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()
  const router = useRouter()
  
  const [isLoading, setIsLoading] = useState(true)
  const [nearestDestination, setNearestDestination] = useState<Destination | null>(null)
  const [showControls, setShowControls] = useState(true)
  const [showHUD, setShowHUD] = useState(true)
  const [warpActive, setWarpActive] = useState(false)
  
  // Stars array ref
  const starsRef = useRef<Star[]>([])
  
  // Flight state ref (for animation loop)
  const flightRef = useRef<FlightState>({
    x: startPosition?.x ?? 200,
    y: startPosition?.y ?? 50,
    z: startPosition?.z ?? -300,
    velocityX: 0,
    velocityY: 0,
    velocityZ: 0,
    rotationX: 0,
    rotationY: 0,
    warpSpeed: false
  })
  
  // Input state ref
  const keysRef = useRef<Set<string>>(new Set())
  const mouseRef = useRef({ x: 0, y: 0, isDown: false })

  // Generate stars
  const generateStars = useCallback((count: number): Star[] => {
    const stars: Star[] = []
    const colors = ['#ffffff', '#fef3c7', '#dbeafe', '#fce7f3', '#e0e7ff']
    
    for (let i = 0; i < count; i++) {
      stars.push({
        x: (Math.random() - 0.5) * 4000,
        y: (Math.random() - 0.5) * 4000,
        z: (Math.random() - 0.5) * 4000,
        size: Math.random() * 2 + 0.5,
        brightness: Math.random() * 0.5 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)]
      })
    }
    
    return stars
  }, [])

  // Project 3D point to 2D screen
  const project = useCallback((x: number, y: number, z: number, width: number, height: number, flight: FlightState) => {
    const relX = x - flight.x
    const relY = y - flight.y
    const relZ = z - flight.z
    
    // Apply rotation
    const cosY = Math.cos(flight.rotationY)
    const sinY = Math.sin(flight.rotationY)
    const cosX = Math.cos(flight.rotationX)
    const sinX = Math.sin(flight.rotationX)
    
    const rotatedX = relX * cosY - relZ * sinY
    const rotatedZ = relX * sinY + relZ * cosY
    const rotatedY = relY * cosX - rotatedZ * sinX
    const finalZ = relY * sinX + rotatedZ * cosX
    
    if (finalZ <= 0) return null
    
    const fov = 500
    const scale = fov / finalZ
    
    return {
      screenX: width / 2 + rotatedX * scale,
      screenY: height / 2 - rotatedY * scale,
      scale,
      distance: Math.sqrt(relX * relX + relY * relY + relZ * relZ)
    }
  }, [])

  // Main render loop
  const render = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const width = canvas.width
    const height = canvas.height
    const flight = flightRef.current
    const keys = keysRef.current

    // Update physics
    const acceleration = flight.warpSpeed ? 2 : 0.3
    const friction = 0.98
    const maxSpeed = flight.warpSpeed ? 50 : 10

    // Apply input
    if (keys.has('w') || keys.has('arrowup')) flight.velocityZ += acceleration
    if (keys.has('s') || keys.has('arrowdown')) flight.velocityZ -= acceleration
    if (keys.has('a') || keys.has('arrowleft')) flight.velocityX -= acceleration
    if (keys.has('d') || keys.has('arrowright')) flight.velocityX += acceleration
    if (keys.has('q') || keys.has(' ')) flight.velocityY += acceleration
    if (keys.has('e') || keys.has('shift')) flight.velocityY -= acceleration

    // Mouse look
    if (mouseRef.current.isDown) {
      flight.rotationY += mouseRef.current.x * 0.002
      flight.rotationX += mouseRef.current.y * 0.002
      flight.rotationX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, flight.rotationX))
      mouseRef.current.x = 0
      mouseRef.current.y = 0
    }

    // Apply friction and clamp velocity
    flight.velocityX *= friction
    flight.velocityY *= friction
    flight.velocityZ *= friction

    const speed = Math.sqrt(flight.velocityX ** 2 + flight.velocityY ** 2 + flight.velocityZ ** 2)
    if (speed > maxSpeed) {
      const scale = maxSpeed / speed
      flight.velocityX *= scale
      flight.velocityY *= scale
      flight.velocityZ *= scale
    }

    // Move camera (in direction we're facing)
    const cosY = Math.cos(flight.rotationY)
    const sinY = Math.sin(flight.rotationY)
    
    flight.x += flight.velocityX * cosY + flight.velocityZ * sinY
    flight.y += flight.velocityY
    flight.z += -flight.velocityX * sinY + flight.velocityZ * cosY

    // Clear canvas
    ctx.fillStyle = '#030712'
    ctx.fillRect(0, 0, width, height)

    // Draw warp streaks if warping
    if (flight.warpSpeed && speed > 5) {
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)'
      ctx.lineWidth = 1
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * width
        const y = Math.random() * height
        const length = speed * 3
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x, y + length)
        ctx.stroke()
      }
    }

    // Draw stars
    starsRef.current.forEach(star => {
      const projected = project(star.x, star.y, star.z, width, height, flight)
      if (!projected || projected.screenX < 0 || projected.screenX > width || projected.screenY < 0 || projected.screenY > height) return

      const alpha = Math.min(1, projected.scale * star.brightness)
      const size = Math.max(0.5, star.size * projected.scale * 0.1)

      ctx.beginPath()
      ctx.arc(projected.screenX, projected.screenY, size, 0, Math.PI * 2)
      ctx.fillStyle = star.color.replace(')', `, ${alpha})`)
      ctx.fill()
    })

    // Draw destinations
    let closest: Destination | null = null
    let closestDistance = Infinity

    DESTINATIONS.forEach(dest => {
      const projected = project(dest.x, dest.y, dest.z, width, height, flight)
      if (!projected || projected.distance > 2000) return

      const size = Math.max(5, dest.size * projected.scale * 0.5)
      
      // Track closest
      if (projected.distance < closestDistance && projected.distance < 200) {
        closestDistance = projected.distance
        closest = dest
      }

      // Glow effect
      const gradient = ctx.createRadialGradient(
        projected.screenX, projected.screenY, 0,
        projected.screenX, projected.screenY, size * 2
      )
      gradient.addColorStop(0, dest.color)
      gradient.addColorStop(0.5, dest.color + '80')
      gradient.addColorStop(1, 'transparent')
      
      ctx.beginPath()
      ctx.arc(projected.screenX, projected.screenY, size * 2, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()

      // Core
      ctx.beginPath()
      ctx.arc(projected.screenX, projected.screenY, size, 0, Math.PI * 2)
      ctx.fillStyle = dest.color
      ctx.fill()

      // Label if close enough
      if (projected.distance < 500 && size > 10) {
        ctx.font = '14px system-ui'
        ctx.fillStyle = 'white'
        ctx.textAlign = 'center'
        ctx.fillText(dest.name, projected.screenX, projected.screenY + size + 20)
      }
    })

    setNearestDestination(closest)

    // Continue animation
    animationRef.current = requestAnimationFrame(render)
  }, [project])

  // Initialize
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    // Set canvas size
    const resize = () => {
      canvas.width = container.clientWidth
      canvas.height = container.clientHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Generate stars
    starsRef.current = generateStars(3000)
    
    // Start rendering
    setIsLoading(false)
    animationRef.current = requestAnimationFrame(render)

    // Input handlers
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key.toLowerCase())
      
      if (e.key.toLowerCase() === 'f') {
        flightRef.current.warpSpeed = !flightRef.current.warpSpeed
        setWarpActive(flightRef.current.warpSpeed)
      }
      
      if (e.key === 'Escape') {
        onExit?.()
      }
      
      if (e.key === 'Enter' && nearestDestination) {
        router.push(nearestDestination.url)
      }
      
      if (e.key.toLowerCase() === 'h') {
        setShowHUD(prev => !prev)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key.toLowerCase())
    }

    const handleMouseDown = () => {
      mouseRef.current.isDown = true
      container.requestPointerLock?.()
    }

    const handleMouseUp = () => {
      mouseRef.current.isDown = false
      document.exitPointerLock?.()
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (mouseRef.current.isDown || document.pointerLockElement === container) {
        mouseRef.current.x += e.movementX
        mouseRef.current.y += e.movementY
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    container.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mousemove', handleMouseMove)

    // Hide controls after 5 seconds
    const hideTimer = setTimeout(() => setShowControls(false), 5000)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      container.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('mousemove', handleMouseMove)
      clearTimeout(hideTimer)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [generateStars, render, onExit, router, nearestDestination])

  const handleLand = () => {
    if (nearestDestination) {
      router.push(nearestDestination.url)
    }
  }

  return (
    <div ref={containerRef} className={styles.container}>
      {isLoading && (
        <div className={styles.loading}>
          <div className={styles.loadingSpinner} />
          <p>Initializing Universe Flight...</p>
        </div>
      )}

      <canvas ref={canvasRef} className={styles.canvas} />

      {/* HUD */}
      {showHUD && (
        <div className={styles.hud}>
          {/* Speed Indicator */}
          <div className={styles.speedometer}>
            <div className={styles.speedLabel}>SPEED</div>
            <div className={`${styles.speedValue} ${warpActive ? styles.warp : ''}`}>
              {Math.round(Math.sqrt(
                flightRef.current.velocityX ** 2 + 
                flightRef.current.velocityY ** 2 + 
                flightRef.current.velocityZ ** 2
              ) * 10)}
            </div>
            <div className={styles.speedUnit}>km/s</div>
            {warpActive && <div className={styles.warpIndicator}>WARP ACTIVE</div>}
          </div>

          {/* Nearest Destination */}
          {nearestDestination && (
            <div className={styles.destination}>
              <div className={styles.destIcon}>{nearestDestination.icon}</div>
              <div className={styles.destInfo}>
                <div className={styles.destName}>{nearestDestination.name}</div>
                <div className={styles.destHint}>Press ENTER to land</div>
              </div>
              <button className={styles.landButton} onClick={handleLand}>
                Land
              </button>
            </div>
          )}

          {/* Crosshair */}
          <div className={styles.crosshair}>
            <span>+</span>
          </div>
        </div>
      )}

      {/* Controls Help */}
      {showControls && (
        <div className={styles.controls}>
          <h3>Flight Controls</h3>
          <div className={styles.controlGrid}>
            <div><kbd>W/S</kbd> Forward/Back</div>
            <div><kbd>A/D</kbd> Strafe</div>
            <div><kbd>Q/E</kbd> Up/Down</div>
            <div><kbd>Mouse</kbd> Look</div>
            <div><kbd>F</kbd> Toggle Warp</div>
            <div><kbd>H</kbd> Toggle HUD</div>
            <div><kbd>Enter</kbd> Land</div>
            <div><kbd>Esc</kbd> Exit</div>
          </div>
          <button 
            className={styles.dismissButton}
            onClick={() => setShowControls(false)}
          >
            Got it
          </button>
        </div>
      )}

      {/* Exit Button */}
      <button className={styles.exitButton} onClick={onExit}>
        ✕ Exit Flight
      </button>
    </div>
  )
}
