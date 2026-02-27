'use client'

import { useRef, useState, useEffect } from 'react'

interface NebulaConfig {
  colorPrimary: string
  colorSecondary: string
  density: number
  scale: number
  speed: number
  complexity: number
}

export default function NebulaGenerator() {
  const [isActive, setIsActive] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  
  const [config, setConfig] = useState<NebulaConfig>({
    colorPrimary: '#8b00ff',
    colorSecondary: '#ff006a',
    density: 50,
    scale: 2,
    speed: 1,
    complexity: 5
  })
  
  useEffect(() => {
    if (!canvasRef.current) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    
    let time = 0
    
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 139, g: 0, b: 255 }
    }
    
    const noise = (x: number, y: number) => {
      const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453
      return n - Math.floor(n)
    }
    
    const fbm = (x: number, y: number, octaves: number) => {
      let value = 0
      let amplitude = 0.5
      let frequency = 1
      
      for (let i = 0; i < octaves; i++) {
        value += amplitude * noise(x * frequency, y * frequency)
        frequency *= 2
        amplitude *= 0.5
      }
      
      return value
    }
    
    const animate = () => {
      ctx.fillStyle = '#000510'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      
      const primary = hexToRgb(config.colorPrimary)
      const secondary = hexToRgb(config.colorSecondary)
      
      for (let y = 0; y < canvas.height; y += 2) {
        for (let x = 0; x < canvas.width; x += 2) {
          const nx = x / canvas.width * config.scale
          const ny = y / canvas.height * config.scale
          
          // Multi-octave noise for complexity
          const n1 = fbm(nx + time * 0.001 * config.speed, ny, config.complexity)
          const n2 = fbm(nx * 2 - time * 0.002 * config.speed, ny * 2, config.complexity)
          const n3 = fbm(nx * 4, ny * 4 + time * 0.003 * config.speed, config.complexity)
          
          const combined = (n1 + n2 * 0.5 + n3 * 0.25) / 1.75
          const intensity = Math.pow(combined, 2) * (config.density / 50)
          
          if (intensity > 0.1) {
            const mix = Math.sin(combined * Math.PI * 2) * 0.5 + 0.5
            
            const r = Math.floor(primary.r * (1 - mix) + secondary.r * mix)
            const g = Math.floor(primary.g * (1 - mix) + secondary.g * mix)
            const b = Math.floor(primary.b * (1 - mix) + secondary.b * mix)
            const a = Math.floor(intensity * 255)
            
            const index = (y * canvas.width + x) * 4
            data[index] = r
            data[index + 1] = g
            data[index + 2] = b
            data[index + 3] = a
          }
        }
      }
      
      ctx.putImageData(imageData, 0, 0)
      
      // Add stars
      for (let i = 0; i < 100; i++) {
        const sx = Math.random() * canvas.width
        const sy = Math.random() * canvas.height
        const brightness = Math.random()
        
        ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`
        ctx.fillRect(sx, sy, 1, 1)
      }
      
      time += 1
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [config])
  
  const presets = [
    { name: 'Purple Dream', colorPrimary: '#8b00ff', colorSecondary: '#ff006a', density: 50, scale: 2, speed: 1, complexity: 5 },
    { name: 'Blue Lagoon', colorPrimary: '#0080ff', colorSecondary: '#00d4ff', density: 60, scale: 3, speed: 0.5, complexity: 6 },
    { name: 'Fire Storm', colorPrimary: '#ff3300', colorSecondary: '#ff9900', density: 70, scale: 1.5, speed: 2, complexity: 4 },
    { name: 'Emerald Mist', colorPrimary: '#00ff88', colorSecondary: '#00ffcc', density: 40, scale: 2.5, speed: 0.8, complexity: 5 },
    { name: 'Cosmic Aurora', colorPrimary: '#ff00ff', colorSecondary: '#00ffff', density: 55, scale: 2, speed: 1.5, complexity: 7 }
  ]
  
  if (!isActive) {
    return (
      <button
        onClick={() => setIsActive(true)}
        className="w-full min-h-[300px] bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-black backdrop-blur-sm rounded-2xl border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,0,255,0.3)_0%,rgba(0,0,0,1)_100%)]" />
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-8">
          <div className="text-6xl mb-4">🌌</div>
          <h3 className="text-3xl font-bold text-white mb-3">Nebula Generator</h3>
          <p className="text-gray-300 text-lg mb-4">Create your own cosmic clouds</p>
          <div className="px-6 py-3 bg-purple-600 rounded-lg text-white font-bold hover:bg-purple-500 transition-all">
            Create →
          </div>
        </div>
      </button>
    )
  }
  
  return (
    <div className="relative w-full min-h-[700px] bg-black rounded-2xl overflow-hidden">
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => setIsActive(false)}
          className="px-4 py-2 bg-red-600/80 hover:bg-red-600 backdrop-blur-sm rounded-lg text-white font-semibold transition-all"
        >
          Exit
        </button>
      </div>
      
      {/* Presets */}
      <div className="absolute top-4 left-4 z-20 glass rounded-lg px-4 py-3">
        <div className="text-white text-sm font-bold mb-2">Presets</div>
        <div className="space-y-1">
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => setConfig(preset)}
              className="block w-full text-left px-3 py-1 text-sm text-white hover:bg-white/10 rounded transition-colors"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Controls */}
      <div className="absolute bottom-4 left-4 right-4 z-20 glass rounded-lg px-6 py-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="text-white text-sm block mb-2">Primary Color</label>
            <input
              type="color"
              value={config.colorPrimary}
              onChange={(e) => setConfig(prev => ({ ...prev, colorPrimary: e.target.value }))}
              className="w-full h-10 rounded cursor-pointer"
            />
          </div>
          
          <div>
            <label className="text-white text-sm block mb-2">Secondary Color</label>
            <input
              type="color"
              value={config.colorSecondary}
              onChange={(e) => setConfig(prev => ({ ...prev, colorSecondary: e.target.value }))}
              className="w-full h-10 rounded cursor-pointer"
            />
          </div>
          
          <div>
            <label className="text-white text-sm block mb-2">Density: {config.density}%</label>
            <input
              type="range"
              min="10"
              max="100"
              value={config.density}
              onChange={(e) => setConfig(prev => ({ ...prev, density: parseInt(e.target.value) }))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="text-white text-sm block mb-2">Scale: {config.scale.toFixed(1)}x</label>
            <input
              type="range"
              min="0.5"
              max="5"
              step="0.1"
              value={config.scale}
              onChange={(e) => setConfig(prev => ({ ...prev, scale: parseFloat(e.target.value) }))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="text-white text-sm block mb-2">Speed: {config.speed}x</label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={config.speed}
              onChange={(e) => setConfig(prev => ({ ...prev, speed: parseFloat(e.target.value) }))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="text-white text-sm block mb-2">Complexity: {config.complexity}</label>
            <input
              type="range"
              min="1"
              max="10"
              value={config.complexity}
              onChange={(e) => setConfig(prev => ({ ...prev, complexity: parseInt(e.target.value) }))}
              className="w-full"
            />
          </div>
        </div>
      </div>
      
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-[700px]"
      />
    </div>
  )
}
