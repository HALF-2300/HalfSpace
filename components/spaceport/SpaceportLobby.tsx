'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './spaceport.module.css'

interface SpaceportLobbyProps {
  onEnterPlanetarium: () => void
  quality: 'low' | 'medium' | 'high'
  animationEnabled: boolean
}

export default function SpaceportLobby({ 
  onEnterPlanetarium, 
  quality,
  animationEnabled 
}: SpaceportLobbyProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [quote] = useState(() => {
    const quotes = [
      { text: "Welcome to the edge of infinity", author: "Spaceport Command" },
      { text: "Every journey begins with a single step into the unknown", author: "Explorer's Guild" },
      { text: "The cosmos awaits your arrival", author: "Station Master" }
    ]
    return quotes[Math.floor(Math.random() * quotes.length)]
  })

  useEffect(() => {
    if (!animationEnabled) return
    
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Resize canvas
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Star field
    const starCount = quality === 'low' ? 50 : quality === 'medium' ? 100 : 200
    const stars: Array<{ x: number; y: number; z: number; size: number }> = []
    
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 2,
        size: Math.random() * 2 + 0.5
      })
    }

    let frame = 0
    const animate = () => {
      if (!ctx || !canvas) return
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw and move stars
      stars.forEach(star => {
        ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + Math.sin(frame * 0.01 + star.z) * 0.5})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()

        // Slow drift
        star.y += star.z * 0.2
        if (star.y > canvas.height) {
          star.y = 0
          star.x = Math.random() * canvas.width
        }
      })

      frame++
      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [quality, animationEnabled])

  return (
    <div className={styles.lobby}>
      <canvas ref={canvasRef} className={styles.lobbyCanvas} />
      
      <div className={styles.lobbyContent}>
        {/* HUD Header */}
        <div className={styles.hud}>
          <div className={styles.hudLeft}>
            <div className={styles.hudLabel}>SPACEPORT</div>
            <div className={styles.hudValue}>GALAXY CITY</div>
          </div>
          <div className={styles.hudRight}>
            <div className={styles.hudStatus}>
              <span className={styles.statusDot}></span>
              SYSTEMS ONLINE
            </div>
          </div>
        </div>

        {/* Main Gateway */}
        <div className={styles.gateway}>
          <div className={styles.gatewayGlow}></div>
          <h1 className={styles.gatewayTitle}>
            مدينة المجرة
            <span className={styles.gatewaySubtitle}>Galaxy City Spaceport</span>
          </h1>
          
          <div className={styles.quote}>
            <p className={styles.quoteText}>"{quote.text}"</p>
            <p className={styles.quoteAuthor}>— {quote.author}</p>
          </div>

          <button 
            onClick={onEnterPlanetarium}
            className={styles.enterButton}
          >
            <span className={styles.enterIcon}>🌌</span>
            <span className={styles.enterText}>
              Enter Planetarium
              <small>دخول القبة الفلكية</small>
            </span>
            <span className={styles.enterArrow}>→</span>
          </button>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <div className={styles.statValue}>∞</div>
              <div className={styles.statLabel}>Destinations</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statValue}>13.8B</div>
              <div className={styles.statLabel}>Years Old</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statValue}>100B</div>
              <div className={styles.statLabel}>Galaxies</div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className={styles.lobbyFooter}>
          <div className={styles.footerItem}>
            <span className={styles.footerIcon}>📡</span>
            <span>Real-time stellar data</span>
          </div>
          <div className={styles.footerItem}>
            <span className={styles.footerIcon}>🛸</span>
            <span>Interactive exploration</span>
          </div>
          <div className={styles.footerItem}>
            <span className={styles.footerIcon}>✨</span>
            <span>Cosmic wonders await</span>
          </div>
        </div>
      </div>
    </div>
  )
}
