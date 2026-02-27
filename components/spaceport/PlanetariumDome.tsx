'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import styles from './spaceport.module.css'

interface PlanetariumProps {
  quality: 'low' | 'medium' | 'high'
  animationEnabled: boolean
  starDensity: number
  onBack: () => void
  spaceportData: any
}

interface CelestialObject {
  id: string
  name: string
  name_ar: string
  description: string
  description_ar: string
  position: { x: number; y: number; z: number }
  color: string
  type: 'constellation' | 'nebula' | 'deepspace'
  data: any
}

export default function PlanetariumDome({ 
  quality, 
  animationEnabled, 
  starDensity,
  onBack,
  spaceportData
}: PlanetariumProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedObject, setSelectedObject] = useState<CelestialObject | null>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [currentScene, setCurrentScene] = useState<string | null>(null)
  const [webGLSupported, setWebGLSupported] = useState(true)

  // Combine all celestial objects
  const celestialObjects: CelestialObject[] = [
    ...(spaceportData?.constellations?.map((c: any) => ({ ...c, type: 'constellation' as const, data: c })) || []),
    ...(spaceportData?.nebulae?.map((n: any) => ({ ...n, type: 'nebula' as const, data: n })) || []),
    ...(spaceportData?.deepSpaceObjects?.map((d: any) => ({ ...d, type: 'deepspace' as const, data: d })) || [])
  ]

  // Check WebGL support
  useEffect(() => {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    setWebGLSupported(!!gl)
  }, [])

  // Handle mouse interactions
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    
    const deltaX = e.clientX - dragStart.x
    const deltaY = e.clientY - dragStart.y
    
    setRotation(prev => ({
      x: prev.x + deltaY * 0.005,
      y: prev.y + deltaX * 0.005
    }))
    
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    setZoom(prev => Math.max(0.5, Math.min(3, prev + e.deltaY * -0.001)))
  }

  // Render 2D fallback or 3D scene
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

    // Star background - Ultra high quality
    const starCount = Math.floor((quality === 'low' ? 150 : quality === 'medium' ? 400 : 800) * starDensity)
    const stars: Array<{ x: number; y: number; brightness: number; twinkle: number; size: number; color: string }> = []
    
    for (let i = 0; i < starCount; i++) {
      const brightness = Math.random()
      const size = brightness > 0.9 ? 2 : brightness > 0.7 ? 1.5 : 1
      const colorChoice = Math.random()
      let color = 'rgb(255, 255, 255)'
      
      // Add star color variation for realism
      if (colorChoice > 0.95) {
        color = 'rgb(255, 200, 150)' // Orange-ish (cool star)
      } else if (colorChoice > 0.9) {
        color = 'rgb(150, 180, 255)' // Blue-ish (hot star)
      } else if (colorChoice > 0.85) {
        color = 'rgb(255, 240, 200)' // Yellow-ish
      }
      
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        brightness,
        twinkle: Math.random() * Math.PI * 2,
        size,
        color
      })
    }

    let frame = 0
    const animate = () => {
      if (!ctx || !canvas) return
      
      // Clear with dark space
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw stars with enhanced quality
      stars.forEach(star => {
        const baseBrightness = star.brightness
        let finalBrightness = baseBrightness
        
        if (animationEnabled) {
          finalBrightness = 0.4 + Math.sin(frame * 0.02 + star.twinkle) * 0.3 + baseBrightness * 0.3
        }
        
        // Parse color
        const colorMatch = star.color.match(/\d+/g)
        if (colorMatch) {
          const [r, g, b] = colorMatch.map(Number)
          
          // Draw glow for brighter stars
          if (quality !== 'low' && star.size > 1) {
            const glowGradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 3)
            glowGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${finalBrightness * 0.6})`)
            glowGradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${finalBrightness * 0.3})`)
            glowGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
            ctx.fillStyle = glowGradient
            ctx.beginPath()
            ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2)
            ctx.fill()
          }
          
          // Draw star core
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${finalBrightness})`
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
          ctx.fill()
          
          // Add cross sparkle for brightest stars
          if (quality === 'high' && star.brightness > 0.9) {
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${finalBrightness * 0.5})`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(star.x - star.size * 2, star.y)
            ctx.lineTo(star.x + star.size * 2, star.y)
            ctx.stroke()
            ctx.beginPath()
            ctx.moveTo(star.x, star.y - star.size * 2)
            ctx.lineTo(star.x, star.y + star.size * 2)
            ctx.stroke()
          }
        }
      })

      // Draw celestial objects
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      
      celestialObjects.forEach(obj => {
        // Apply rotation and zoom
        const rotatedX = obj.position.x * Math.cos(rotation.y) - obj.position.z * Math.sin(rotation.y)
        const rotatedZ = obj.position.x * Math.sin(rotation.y) + obj.position.z * Math.cos(rotation.y)
        const rotatedY = obj.position.y * Math.cos(rotation.x) - rotatedZ * Math.sin(rotation.x)
        
        const screenX = centerX + rotatedX * 300 * zoom
        const screenY = centerY + rotatedY * 300 * zoom
        
        // Draw outer glow (large, diffuse)
        const outerGlow = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, 35 * zoom)
        outerGlow.addColorStop(0, obj.color + (quality === 'high' ? '60' : '40'))
        outerGlow.addColorStop(0.5, obj.color + (quality === 'high' ? '30' : '20'))
        outerGlow.addColorStop(1, obj.color + '00')
        ctx.fillStyle = outerGlow
        ctx.beginPath()
        ctx.arc(screenX, screenY, 35 * zoom, 0, Math.PI * 2)
        ctx.fill()
        
        // Draw mid glow
        const midGlow = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, 18 * zoom)
        midGlow.addColorStop(0, obj.color + (quality === 'high' ? 'A0' : '80'))
        midGlow.addColorStop(0.6, obj.color + (quality === 'high' ? '50' : '30'))
        midGlow.addColorStop(1, obj.color + '00')
        ctx.fillStyle = midGlow
        ctx.beginPath()
        ctx.arc(screenX, screenY, 18 * zoom, 0, Math.PI * 2)
        ctx.fill()
        
        // Draw bright core with gradient
        const coreGradient = ctx.createRadialGradient(
          screenX - zoom, 
          screenY - zoom, 
          0, 
          screenX, 
          screenY, 
          4 * zoom
        )
        coreGradient.addColorStop(0, '#ffffff')
        coreGradient.addColorStop(0.4, obj.color + 'FF')
        coreGradient.addColorStop(1, obj.color + 'CC')
        ctx.fillStyle = coreGradient
        ctx.beginPath()
        ctx.arc(screenX, screenY, 4 * zoom, 0, Math.PI * 2)
        ctx.fill()
        
        // Draw label
        if (zoom > 0.8) {
          ctx.fillStyle = '#ffffff'
          ctx.font = `${12 * zoom}px monospace`
          ctx.fillText(obj.name, screenX + 10 * zoom, screenY)
        }
      })

      frame++
      if (animationEnabled) {
        requestAnimationFrame(animate)
      }
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [quality, animationEnabled, starDensity, rotation, zoom, celestialObjects, currentScene])

  const handleObjectClick = useCallback((obj: CelestialObject) => {
    setSelectedObject(obj)
  }, [])

  const takeMeSomewhere = () => {
    const scenes = spaceportData?.scenes || []
    if (scenes.length > 0) {
      const randomScene = scenes[Math.floor(Math.random() * scenes.length)]
      setCurrentScene(randomScene.name)
      
      // Random rotation and zoom
      setRotation({
        x: Math.random() * Math.PI * 2,
        y: Math.random() * Math.PI * 2
      })
      setZoom(0.8 + Math.random() * 1.2)
      
      // Show scene info briefly
      setTimeout(() => setCurrentScene(null), 3000)
    }
  }

  return (
    <div 
      ref={containerRef}
      className={styles.planetarium}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      <canvas ref={canvasRef} className={styles.planetariumCanvas} />
      
      {!webGLSupported && (
        <div className={styles.fallbackNotice}>
          2D Mode (WebGL not available)
        </div>
      )}

      {/* HUD */}
      <div className={styles.planetariumHud}>
        <button onClick={onBack} className={styles.backButton}>
          ← Exit Dome
        </button>
        
        <div className={styles.coordinates}>
          <div>Rotation: X:{rotation.x.toFixed(2)} Y:{rotation.y.toFixed(2)}</div>
          <div>Zoom: {zoom.toFixed(2)}x</div>
        </div>

        <button onClick={takeMeSomewhere} className={styles.randomButton}>
          🎲 Take me somewhere
        </button>
      </div>

      {/* Current Scene Banner */}
      {currentScene && (
        <div className={styles.sceneBanner}>
          <h3>Now entering: {currentScene}</h3>
        </div>
      )}

      {/* Clickable objects overlay */}
      <div className={styles.objectsOverlay}>
        {celestialObjects.map((obj, idx) => {
          const centerX = window.innerWidth / 2
          const centerY = window.innerHeight / 2
          
          const rotatedX = obj.position.x * Math.cos(rotation.y) - obj.position.z * Math.sin(rotation.y)
          const rotatedZ = obj.position.x * Math.sin(rotation.y) + obj.position.z * Math.cos(rotation.y)
          const rotatedY = obj.position.y * Math.cos(rotation.x) - rotatedZ * Math.sin(rotation.x)
          
          const screenX = centerX + rotatedX * 300 * zoom
          const screenY = centerY + rotatedY * 300 * zoom
          
          return (
            <button
              key={obj.id}
              className={styles.objectHotspot}
              style={{
                left: screenX,
                top: screenY,
                transform: 'translate(-50%, -50%)'
              }}
              onClick={() => handleObjectClick(obj)}
              title={obj.name}
            />
          )
        })}
      </div>

      {/* Selected Object Card */}
      {selectedObject && (
        <div className={styles.objectCard}>
          <button 
            className={styles.cardClose}
            onClick={() => setSelectedObject(null)}
          >
            ×
          </button>
          
          <div className={styles.cardHeader}>
            <h3>{selectedObject.name}</h3>
            <p className={styles.cardNameAr}>{selectedObject.name_ar}</p>
          </div>
          
          <div className={styles.cardBody}>
            <p>{selectedObject.description}</p>
            <p className={styles.cardDescAr}>{selectedObject.description_ar}</p>
            
            {selectedObject.type === 'constellation' && selectedObject.data.facts && (
              <div className={styles.cardFacts}>
                <strong>Facts:</strong>
                <ul>
                  {selectedObject.data.facts.map((fact: string, i: number) => (
                    <li key={i}>{fact}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {selectedObject.data.distance && (
              <div className={styles.cardInfo}>
                <strong>Distance:</strong> {selectedObject.data.distance}
              </div>
            )}
          </div>
          
          <button className={styles.cardAction}>
            📖 Open Full Record
          </button>
        </div>
      )}
    </div>
  )
}
