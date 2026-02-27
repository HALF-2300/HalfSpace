'use client'

import { useRef, useState, useEffect } from 'react'

interface LaunchStats {
  altitude: number
  velocity: number
  fuel: number
  thrust: number
  angle: number
  status: 'ready' | 'launching' | 'orbit' | 'crashed'
}

export default function RocketLaunchSimulator() {
  const [isActive, setIsActive] = useState(false)
  const [isLaunching, setIsLaunching] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  
  const [stats, setStats] = useState<LaunchStats>({
    altitude: 0,
    velocity: 0,
    fuel: 100,
    thrust: 0,
    angle: 90,
    status: 'ready'
  })
  
  const [controls, setControls] = useState({
    thrust: 50,
    angle: 90
  })
  
  useEffect(() => {
    if (!isLaunching || !canvasRef.current) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    
    let altitude = 0
    let velocity = 0
    let fuel = 100
    let posX = canvas.width / 2
    let posY = canvas.height - 50
    const angle = controls.angle
    let crashed = false
    let inOrbit = false
    
    const gravity = 0.05
    const orbitalAltitude = 300
    
    const animate = () => {
      if (!ctx || crashed || inOrbit) return
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Draw Earth
      ctx.fillStyle = '#4A90E2'
      ctx.beginPath()
      ctx.arc(canvas.width / 2, canvas.height, canvas.height * 0.8, 0, Math.PI * 2)
      ctx.fill()
      
      // Draw atmosphere
      ctx.fillStyle = 'rgba(100, 150, 255, 0.2)'
      ctx.beginPath()
      ctx.arc(canvas.width / 2, canvas.height, canvas.height * 0.85, 0, Math.PI * 2)
      ctx.fill()
      
      // Draw horizon line
      ctx.strokeStyle = '#333'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, canvas.height - 40)
      ctx.lineTo(canvas.width, canvas.height - 40)
      ctx.stroke()
      
      // Physics
      if (fuel > 0) {
        const thrustForce = (controls.thrust / 100) * 0.3
        const angleRad = (angle * Math.PI) / 180
        velocity += thrustForce - gravity
        fuel -= controls.thrust / 500
        
        // Adjust position based on angle
        posX += Math.cos(angleRad - Math.PI / 2) * velocity
        posY -= Math.sin(angleRad - Math.PI / 2) * velocity
      } else {
        velocity -= gravity
        posY -= velocity
      }
      
      altitude = (canvas.height - posY - 50) / 2
      
      // Check for crash
      if (posY > canvas.height - 50) {
        crashed = true
        setStats(prev => ({ ...prev, status: 'crashed' }))
        setIsLaunching(false)
        return
      }
      
      // Check for orbit
      if (altitude >= orbitalAltitude && Math.abs(velocity) < 2) {
        inOrbit = true
        setStats(prev => ({ ...prev, status: 'orbit' }))
        setIsLaunching(false)
      }
      
      // Draw rocket
      ctx.save()
      ctx.translate(posX, posY)
      ctx.rotate((angle * Math.PI) / 180 - Math.PI / 2)
      
      // Rocket body
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(-10, -30, 20, 60)
      
      // Rocket nose
      ctx.fillStyle = '#ff0000'
      ctx.beginPath()
      ctx.moveTo(-10, -30)
      ctx.lineTo(0, -50)
      ctx.lineTo(10, -30)
      ctx.closePath()
      ctx.fill()
      
      // Fins
      ctx.fillStyle = '#cccccc'
      ctx.beginPath()
      ctx.moveTo(-10, 30)
      ctx.lineTo(-20, 40)
      ctx.lineTo(-10, 40)
      ctx.closePath()
      ctx.fill()
      
      ctx.beginPath()
      ctx.moveTo(10, 30)
      ctx.lineTo(20, 40)
      ctx.lineTo(10, 40)
      ctx.closePath()
      ctx.fill()
      
      // Thrust flame
      if (fuel > 0 && controls.thrust > 0) {
        const flameLength = (controls.thrust / 100) * 40
        ctx.fillStyle = '#ff6600'
        ctx.beginPath()
        ctx.moveTo(-8, 30)
        ctx.lineTo(0, 30 + flameLength + Math.random() * 10)
        ctx.lineTo(8, 30)
        ctx.closePath()
        ctx.fill()
        
        ctx.fillStyle = '#ffaa00'
        ctx.beginPath()
        ctx.moveTo(-5, 30)
        ctx.lineTo(0, 30 + flameLength * 0.6)
        ctx.lineTo(5, 30)
        ctx.closePath()
        ctx.fill()
      }
      
      ctx.restore()
      
      // Draw altitude markers
      for (let i = 1; i <= 5; i++) {
        const y = canvas.height - 50 - (i * 100)
        ctx.strokeStyle = '#444'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
        
        ctx.fillStyle = '#888'
        ctx.font = '12px monospace'
        ctx.fillText(`${i * 100}km`, 10, y - 5)
      }
      
      // Update stats
      setStats({
        altitude: Math.max(0, altitude),
        velocity: velocity,
        fuel: Math.max(0, fuel),
        thrust: controls.thrust,
        angle: angle,
        status: 'launching'
      })
      
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isLaunching, controls])
  
  const handleLaunch = () => {
    setIsLaunching(true)
    setStats({
      altitude: 0,
      velocity: 0,
      fuel: 100,
      thrust: controls.thrust,
      angle: controls.angle,
      status: 'launching'
    })
  }
  
  const handleReset = () => {
    setIsLaunching(false)
    setStats({
      altitude: 0,
      velocity: 0,
      fuel: 100,
      thrust: 0,
      angle: 90,
      status: 'ready'
    })
  }
  
  if (!isActive) {
    return (
      <button
        onClick={() => setIsActive(true)}
        className="w-full min-h-[300px] bg-gradient-to-br from-orange-900/20 via-red-900/20 to-black backdrop-blur-sm rounded-2xl border border-orange-500/30 hover:border-orange-400/50 transition-all duration-300 group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.2)_0%,rgba(0,0,0,1)_100%)]" />
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-8">
          <div className="text-6xl mb-4">🚀</div>
          <h3 className="text-3xl font-bold text-white mb-3">Rocket Launch Simulator</h3>
          <p className="text-gray-300 text-lg mb-4">Control thrust and angle to reach orbit</p>
          <div className="px-6 py-3 bg-orange-600 rounded-lg text-white font-bold hover:bg-orange-500 transition-all">
            Launch →
          </div>
        </div>
      </button>
    )
  }
  
  return (
    <div className="relative w-full min-h-[600px] bg-black rounded-2xl overflow-hidden">
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => setIsActive(false)}
          className="px-4 py-2 bg-red-600/80 hover:bg-red-600 backdrop-blur-sm rounded-lg text-white font-semibold transition-all"
        >
          Exit
        </button>
      </div>
      
      {/* Stats Panel */}
      <div className="absolute top-4 left-4 z-20 glass rounded-lg px-6 py-4 space-y-2 text-white">
        <div className={`px-3 py-1 rounded text-center font-bold mb-2 ${
          stats.status === 'orbit' ? 'bg-green-600' :
          stats.status === 'crashed' ? 'bg-red-600' :
          stats.status === 'launching' ? 'bg-blue-600 animate-pulse' :
          'bg-gray-600'
        }`}>
          {stats.status.toUpperCase()}
        </div>
        <div className="text-sm space-y-1">
          <div>Altitude: <span className="font-mono">{stats.altitude.toFixed(1)} km</span></div>
          <div>Velocity: <span className="font-mono">{stats.velocity.toFixed(2)} km/s</span></div>
          <div>Fuel: <span className="font-mono">{stats.fuel.toFixed(0)}%</span></div>
          <div>Angle: <span className="font-mono">{stats.angle}°</span></div>
        </div>
        {stats.status === 'orbit' && (
          <div className="text-green-400 text-sm mt-2">
            ✓ Orbital velocity achieved!
          </div>
        )}
        {stats.status === 'crashed' && (
          <div className="text-red-400 text-sm mt-2">
            ✗ Mission failed
          </div>
        )}
      </div>
      
      {/* Controls */}
      <div className="absolute bottom-4 left-4 z-20 glass rounded-lg px-6 py-4 space-y-4">
        <div>
          <label className="text-white text-sm block mb-2">Thrust: {controls.thrust}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={controls.thrust}
            onChange={(e) => setControls(prev => ({ ...prev, thrust: parseInt(e.target.value) }))}
            disabled={isLaunching}
            className="w-48"
          />
        </div>
        
        <div>
          <label className="text-white text-sm block mb-2">Launch Angle: {controls.angle}°</label>
          <input
            type="range"
            min="45"
            max="135"
            value={controls.angle}
            onChange={(e) => setControls(prev => ({ ...prev, angle: parseInt(e.target.value) }))}
            disabled={isLaunching}
            className="w-48"
          />
        </div>
        
        <div className="flex gap-2">
          {!isLaunching && stats.status === 'ready' && (
            <button
              onClick={handleLaunch}
              className="px-6 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white font-bold transition-all"
            >
              Launch 🚀
            </button>
          )}
          {(stats.status === 'orbit' || stats.status === 'crashed') && (
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-bold transition-all"
            >
              Reset
            </button>
          )}
        </div>
        
        <div className="text-xs text-gray-400">
          Goal: Reach 300km altitude with low velocity
        </div>
      </div>
      
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-[600px]"
      />
    </div>
  )
}
