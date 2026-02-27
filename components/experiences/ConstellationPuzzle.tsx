'use client'

import { useState, useRef, useEffect } from 'react'
import { awardXP } from '@/lib/gameEngine'

interface Star {
  id: number
  x: number
  y: number
  connected: boolean
}

interface Constellation {
  name: string
  stars: Array<{ x: number; y: number }>
  connections: Array<[number, number]>
  fact: string
  icon: string
}

const CONSTELLATIONS: Constellation[] = [
  {
    name: 'Orion',
    stars: [
      { x: 50, y: 30 },   // Betelgeuse
      { x: 50, y: 70 },   // Rigel
      { x: 40, y: 50 },   // Belt star 1
      { x: 50, y: 50 },   // Belt star 2
      { x: 60, y: 50 },   // Belt star 3
    ],
    connections: [[0, 2], [2, 3], [3, 4], [4, 1], [0, 3], [1, 3]],
    fact: 'Orion the Hunter is one of the most recognizable constellations!',
    icon: '🏹'
  },
  {
    name: 'Big Dipper',
    stars: [
      { x: 20, y: 40 },
      { x: 30, y: 35 },
      { x: 40, y: 35 },
      { x: 50, y: 40 },
      { x: 55, y: 55 },
      { x: 65, y: 65 },
      { x: 75, y: 70 }
    ],
    connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]],
    fact: 'The Big Dipper is part of Ursa Major and points to the North Star!',
    icon: '🐻'
  },
  {
    name: 'Leo',
    stars: [
      { x: 30, y: 40 },   // Regulus
      { x: 40, y: 35 },
      { x: 50, y: 30 },
      { x: 60, y: 35 },
      { x: 70, y: 40 },
      { x: 50, y: 60 }
    ],
    connections: [[0, 1], [1, 2], [2, 3], [3, 4], [1, 5]],
    fact: 'Leo the Lion contains Regulus, one of the brightest stars in the night sky!',
    icon: '🦁'
  }
]

export default function ConstellationPuzzle() {
  const [isActive, setIsActive] = useState(false)
  const [currentLevel, setCurrentLevel] = useState(0)
  const [stars, setStars] = useState<Star[]>([])
  const [connections, setConnections] = useState<Array<[number, number]>>([])
  const [selectedStar, setSelectedStar] = useState<number | null>(null)
  const [completed, setCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  const constellation = CONSTELLATIONS[currentLevel]
  
  useEffect(() => {
    if (isActive && constellation) {
      // Initialize stars
      const newStars = constellation.stars.map((star, i) => ({
        id: i,
        x: (star.x / 100) * 500,
        y: (star.y / 100) * 500,
        connected: false
      }))
      setStars(newStars)
      setConnections([])
      setCompleted(false)
    }
  }, [isActive, currentLevel, constellation])
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    canvas.width = 500
    canvas.height = 500
    
    // Clear
    ctx.fillStyle = '#000510'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Draw stars in background
    for (let i = 0; i < 100; i++) {
      ctx.fillStyle = '#ffffff'
      ctx.globalAlpha = Math.random() * 0.5
      ctx.fillRect(Math.random() * 500, Math.random() * 500, 1, 1)
    }
    ctx.globalAlpha = 1
    
    // Draw connections
    ctx.strokeStyle = '#4a90e2'
    ctx.lineWidth = 2
    connections.forEach(([a, b]) => {
      const starA = stars[a]
      const starB = stars[b]
      if (starA && starB) {
        ctx.beginPath()
        ctx.moveTo(starA.x, starA.y)
        ctx.lineTo(starB.x, starB.y)
        ctx.stroke()
      }
    })
    
    // Draw selection line
    if (selectedStar !== null) {
      const star = stars[selectedStar]
      const rect = canvas.getBoundingClientRect()
      ctx.strokeStyle = '#ffff00'
      ctx.setLineDash([5, 5])
      ctx.lineWidth = 2
      // Would draw to mouse position in full implementation
      ctx.setLineDash([])
    }
    
    // Draw stars
    stars.forEach(star => {
      ctx.beginPath()
      ctx.arc(star.x, star.y, star.connected ? 8 : 6, 0, Math.PI * 2)
      ctx.fillStyle = star.connected ? '#ffff00' : '#ffffff'
      ctx.fill()
      
      // Glow
      ctx.shadowBlur = 10
      ctx.shadowColor = star.connected ? '#ffff00' : '#ffffff'
      ctx.fill()
      ctx.shadowBlur = 0
    })
    
  }, [stars, connections, selectedStar])
  
  const handleStarClick = (starId: number) => {
    if (completed) return
    
    if (selectedStar === null) {
      setSelectedStar(starId)
    } else {
      if (selectedStar !== starId) {
        // Create connection
        const newConnection: [number, number] = [selectedStar, starId]
        
        // Check if this connection exists in the constellation
        const isCorrect = constellation.connections.some(
          ([a, b]) => 
            (a === selectedStar && b === starId) || 
            (a === starId && b === selectedStar)
        )
        
        if (isCorrect && !connections.some(([a, b]) => 
          (a === selectedStar && b === starId) || (a === starId && b === selectedStar)
        )) {
          setConnections([...connections, newConnection])
          setScore(score + 10)
          
          // Mark stars as connected
          setStars(stars.map(s => 
            s.id === selectedStar || s.id === starId 
              ? { ...s, connected: true } 
              : s
          ))
          
          // Check if puzzle complete
          if (connections.length + 1 === constellation.connections.length) {
            setCompleted(true)
            awardXP(150 + currentLevel * 50, `Constellation Complete: ${constellation.name}`)
          }
        }
      }
      setSelectedStar(null)
    }
  }
  
  const handleNext = () => {
    if (currentLevel < CONSTELLATIONS.length - 1) {
      setCurrentLevel(currentLevel + 1)
      setScore(0)
    } else {
      // All complete!
      awardXP(500, 'All Constellations Mastered!')
    }
  }
  
  const handleSkip = () => {
    // Show solution
    setConnections(constellation.connections)
    setStars(stars.map(s => ({ ...s, connected: true })))
    setCompleted(true)
  }
  
  if (!isActive) {
    return (
      <button
        onClick={() => setIsActive(true)}
        className="w-full min-h-[300px] bg-gradient-to-br from-indigo-900/20 via-blue-900/20 to-cyan-900/20 backdrop-blur-sm rounded-2xl border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.2)_0%,rgba(0,0,0,1)_100%)]" />
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-8">
          <div className="text-6xl mb-4">⭐</div>
          <h3 className="text-3xl font-bold text-white mb-3">Constellation Puzzle</h3>
          <p className="text-gray-300 text-lg mb-4">Connect the stars to form constellations!</p>
          <div className="px-6 py-3 bg-blue-600 rounded-lg text-white font-bold hover:bg-blue-500 transition-all">
            Start →
          </div>
        </div>
      </button>
    )
  }
  
  return (
    <div className="relative w-full min-h-[700px] bg-black rounded-2xl overflow-hidden p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gradient mb-1">{constellation.icon} {constellation.name}</h2>
          <p className="text-gray-400 text-sm">{constellation.fact}</p>
        </div>
        <button
          onClick={() => setIsActive(false)}
          className="px-4 py-2 bg-red-600/80 hover:bg-red-600 rounded-lg text-white font-semibold transition-all"
        >
          Exit
        </button>
      </div>
      
      {/* Stats */}
      <div className="flex gap-4 mb-6">
        <div className="glass rounded-lg px-4 py-2">
          <span className="text-gray-400 text-sm">Level: </span>
          <span className="text-white font-bold">{currentLevel + 1}/{CONSTELLATIONS.length}</span>
        </div>
        <div className="glass rounded-lg px-4 py-2">
          <span className="text-gray-400 text-sm">Connections: </span>
          <span className="text-white font-bold">{connections.length}/{constellation.connections.length}</span>
        </div>
        <div className="glass rounded-lg px-4 py-2">
          <span className="text-gray-400 text-sm">Score: </span>
          <span className="text-yellow-400 font-bold">+{score} XP</span>
        </div>
      </div>
      
      {/* Canvas */}
      <div className="flex justify-center mb-6">
        <canvas
          ref={canvasRef}
          className="border border-purple-500/30 rounded-lg cursor-crosshair"
          onClick={(e) => {
            const canvas = canvasRef.current
            if (!canvas) return
            
            const rect = canvas.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            
            // Find clicked star
            const clickedStar = stars.findIndex(star => 
              Math.sqrt((star.x - x) ** 2 + (star.y - y) ** 2) < 15
            )
            
            if (clickedStar !== -1) {
              handleStarClick(clickedStar)
            }
          }}
        />
      </div>
      
      {/* Instructions */}
      <div className="text-center mb-6">
        <p className="text-gray-400">Click two stars to connect them!</p>
        {selectedStar !== null && (
          <p className="text-yellow-400 mt-2">Star selected! Click another to connect.</p>
        )}
      </div>
      
      {/* Actions */}
      {completed && (
        <div className="flex justify-center gap-4">
          {currentLevel < CONSTELLATIONS.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-green-600 hover:bg-green-500 rounded-lg text-white font-bold transition-all"
            >
              Next Constellation →
            </button>
          ) : (
            <button
              onClick={() => setIsActive(false)}
              className="px-8 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg text-white font-bold transition-all"
            >
              Complete! 🎉
            </button>
          )}
        </div>
      )}
      
      {!completed && (
        <div className="text-center">
          <button
            onClick={handleSkip}
            className="px-6 py-2 bg-gray-600/50 hover:bg-gray-600 rounded-lg text-white text-sm transition-all"
          >
            Show Solution
          </button>
        </div>
      )}
    </div>
  )
}
