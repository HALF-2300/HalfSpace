'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import './stationMap.css'

interface StationRoom {
  id: string
  name: string
  nameAr: string
  icon: string
  description: string
  url: string
  color: string
}

const STATION_ROOMS: StationRoom[] = [
  {
    id: 'observation',
    name: 'Observation Deck',
    nameAr: 'سطح المراقبة',
    icon: '🔭',
    description: 'Stunning cosmic imagery & cinematic gallery',
    url: '/space/gallery',
    color: 'from-blue-600 to-cyan-500'
  },
  {
    id: 'control',
    name: 'Mission Control',
    nameAr: 'مركز التحكم',
    icon: '🎮',
    description: 'Space missions & exploration history',
    url: '/missions',
    color: 'from-purple-600 to-pink-500'
  },
  {
    id: 'archive',
    name: 'Archive',
    nameAr: 'الأرشيف',
    icon: '📚',
    description: 'Knowledge hub & space encyclopedia',
    url: '/space/guide',
    color: 'from-green-600 to-emerald-500'
  },
  {
    id: 'lab',
    name: 'Research Lab',
    nameAr: 'المختبر',
    icon: '🧪',
    description: 'Interactive simulations & experiments',
    url: '/space/black-hole-lab',
    color: 'from-orange-600 to-red-500'
  },
  {
    id: 'terminal',
    name: 'Today Terminal',
    nameAr: 'محطة اليوم',
    icon: '📅',
    description: 'Daily cosmic updates & discoveries',
    url: '/today',
    color: 'from-indigo-600 to-purple-500'
  }
]

interface StationMapProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * StationMap - Visualizes the "Place" metaphor
 * 
 * Shows HalfSpace as a space station with 5 rooms.
 * Makes navigation feel like exploring a physical location.
 */
export default function StationMap({ isOpen, onClose }: StationMapProps) {
  const router = useRouter()

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
      // Number keys 1-5 to jump to rooms
      const num = parseInt(e.key)
      if (num >= 1 && num <= 5) {
        handleNavigate(STATION_ROOMS[num - 1].url)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handleNavigate = (url: string) => {
    router.push(url)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="station-map-overlay">
      {/* Backdrop */}
      <div 
        className="station-map-backdrop"
        onClick={onClose}
      />

      {/* Main Container */}
      <div className="station-map-container">
        {/* Header */}
        <div className="station-map-header">
          <div>
            <h2 className="station-map-title">HalfSpace Station</h2>
            <p className="station-map-subtitle">Choose your destination</p>
          </div>
          <button
            onClick={onClose}
            className="station-map-close"
            aria-label="Close (ESC)"
          >
            ✕
          </button>
        </div>

        {/* Station Grid */}
        <div className="station-rooms-grid">
          {STATION_ROOMS.map((room, index) => (
            <button
              key={room.id}
              onClick={() => handleNavigate(room.url)}
              className="station-room-card"
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              {/* Hexagonal Background */}
              <div className={`station-room-bg bg-gradient-to-br ${room.color}`} />
              
              {/* Content */}
              <div className="station-room-content">
                <div className="station-room-icon">{room.icon}</div>
                <div className="station-room-number">{index + 1}</div>
                <h3 className="station-room-name">{room.name}</h3>
                <p className="station-room-name-ar">{room.nameAr}</p>
                <p className="station-room-desc">{room.description}</p>
              </div>

              {/* Hover Ring */}
              <div className="station-room-ring" />
            </button>
          ))}
        </div>

        {/* Keyboard Hints */}
        <div className="station-map-hints">
          <span>1-5 Quick access</span>
          <span>Click to navigate</span>
          <span>ESC Close</span>
        </div>

        {/* Station Logo */}
        <div className="station-map-logo">
          <div className="station-logo-ring" />
          <div className="station-logo-center">HS</div>
        </div>
      </div>
    </div>
  )
}
