'use client'

import { useState, useEffect } from 'react'
import SpaceportLobby from '@/components/spaceport/SpaceportLobby'
import PlanetariumDome from '@/components/spaceport/PlanetariumDome'
import ControlPanel from '@/components/spaceport/ControlPanel'

type Scene = 'lobby' | 'planetarium'
type Quality = 'low' | 'medium' | 'high'

export default function SpaceportPage() {
  const [scene, setScene] = useState<Scene>('lobby')
  const [quality, setQuality] = useState<Quality>('medium')
  const [animationEnabled, setAnimationEnabled] = useState(true)
  const [starDensity, setStarDensity] = useState(1)
  const [spaceportData, setSpaceportData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load spaceport data
  useEffect(() => {
    fetch('/data/spaceportData.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load spaceport data')
        return res.json()
      })
      .then(data => {
        setSpaceportData(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading spaceport data:', err)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  // Auto-detect performance and adjust quality
  useEffect(() => {
    // Check for low-end devices
    const isLowEnd = () => {
      if (typeof window === 'undefined') return false
      
      // Check for mobile
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      
      // Check for hardware concurrency
      const cores = navigator.hardwareConcurrency || 2
      
      // Check memory (if available)
      const memory = (navigator as any).deviceMemory || 4
      
      return isMobile || cores < 4 || memory < 4
    }

    if (isLowEnd()) {
      setQuality('low')
      setAnimationEnabled(true) // Keep animations but lower quality
      setStarDensity(0.7)
    }
  }, [])

  if (loading) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        background: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1rem',
        color: 'white'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '3px solid rgba(74, 158, 255, 0.3)',
          borderTop: '3px solid #4a9eff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p>Loading Galaxy City Spaceport...</p>
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        background: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1rem',
        color: 'white',
        padding: '2rem'
      }}>
        <h1 style={{ color: '#ff4a4a', fontSize: '2rem', margin: 0 }}>⚠️ Error</h1>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            background: 'linear-gradient(135deg, #4a9eff, #9d4aff)',
            border: 'none',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '25px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold'
          }}
        >
          Reload
        </button>
      </div>
    )
  }

  return (
    <>
      {scene === 'lobby' && (
        <SpaceportLobby
          onEnterPlanetarium={() => setScene('planetarium')}
          quality={quality}
          animationEnabled={animationEnabled}
        />
      )}
      
      {scene === 'planetarium' && spaceportData && (
        <PlanetariumDome
          quality={quality}
          animationEnabled={animationEnabled}
          starDensity={starDensity}
          onBack={() => setScene('lobby')}
          spaceportData={spaceportData}
        />
      )}

      {/* Control Panel (always available) */}
      <ControlPanel
        quality={quality}
        animationEnabled={animationEnabled}
        starDensity={starDensity}
        onQualityChange={setQuality}
        onAnimationToggle={setAnimationEnabled}
        onDensityChange={setStarDensity}
      />
    </>
  )
}
