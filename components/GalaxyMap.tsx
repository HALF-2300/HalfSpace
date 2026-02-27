'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface GalaxyNode {
  id: string
  name: string
  type: 'planet' | 'mission' | 'telescope' | 'image' | 'event'
  href?: string
  position: { x: number; y: number }
  size: number
  color: string
  description: string
  icon: string
  image?: string
}

export default function GalaxyMap() {
  const [selectedNode, setSelectedNode] = useState<GalaxyNode | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const nodes: GalaxyNode[] = [
    {
      id: 'solar-system',
      name: 'Solar System',
      type: 'planet',
      href: '/solar-system',
      position: { x: 15, y: 30 },
      size: 140,
      color: 'from-yellow-500 to-orange-500',
      description: 'Our cosmic neighborhood - 8 planets and more',
      icon: '🪐'
    },
    {
      id: 'earth',
      name: 'Earth',
      type: 'planet',
      href: '/earth',
      position: { x: 25, y: 45 },
      size: 100,
      color: 'from-blue-500 to-cyan-500',
      description: 'Our blue planet - home of life',
      icon: '🌍'
    },
    {
      id: 'mars',
      name: 'Mars',
      type: 'planet',
      href: '/mars',
      position: { x: 35, y: 50 },
      size: 90,
      color: 'from-red-500 to-orange-500',
      description: 'The Red Planet - exploration target',
      icon: '🔴'
    },
    {
      id: 'jupiter',
      name: 'Jupiter',
      type: 'planet',
      href: '/jupiter',
      position: { x: 50, y: 35 },
      size: 160,
      color: 'from-orange-500 to-yellow-500',
      description: 'Gas giant - largest planet',
      icon: '🪐'
    },
    {
      id: 'apollo-11',
      name: 'Apollo 11',
      type: 'mission',
      href: '/missions',
      position: { x: 20, y: 70 },
      size: 80,
      color: 'from-blue-600 to-indigo-600',
      description: 'First moon landing - 1969',
      icon: '🚀'
    },
    {
      id: 'hubble',
      name: 'Hubble Telescope',
      type: 'telescope',
      href: '/telescopes',
      position: { x: 70, y: 25 },
      size: 95,
      color: 'from-purple-500 to-pink-500',
      description: 'Our window to the universe - since 1990',
      icon: '🔭'
    },
    {
      id: 'jwst',
      name: 'James Webb',
      type: 'telescope',
      href: '/telescopes',
      position: { x: 75, y: 40 },
      size: 100,
      color: 'from-cyan-500 to-blue-500',
      description: 'Most powerful space telescope - 2021',
      icon: '🔭'
    },
    {
      id: 'earthrise',
      name: 'Earthrise',
      type: 'image',
      href: '/historical-images',
      position: { x: 30, y: 15 },
      size: 85,
      color: 'from-green-500 to-blue-500',
      description: 'Apollo 8 - 1968 - Image that changed history',
      icon: '📸'
    },
    {
      id: 'black-hole',
      name: 'First Black Hole Image',
      type: 'image',
      href: '/historical-images',
      position: { x: 85, y: 60 },
      size: 90,
      color: 'from-gray-800 to-black',
      description: 'Event Horizon Telescope - 2019',
      icon: '🕳️'
    },
    {
      id: 'iss',
      name: 'Space Station',
      type: 'mission',
      href: '/space-stations',
      position: { x: 60, y: 75 },
      size: 110,
      color: 'from-sky-500 to-blue-500',
      description: 'International Space Station - laboratory in the sky',
      icon: '🛰️'
    },
    {
      id: 'voyager',
      name: 'Voyager',
      type: 'mission',
      href: '/missions',
      position: { x: 90, y: 20 },
      size: 75,
      color: 'from-indigo-500 to-purple-500',
      description: 'Farthest human-made object - 1977',
      icon: '🛸'
    },
    {
      id: 'galaxy',
      name: 'Galaxies',
      type: 'planet',
      href: '/galaxies',
      position: { x: 80, y: 80 },
      size: 130,
      color: 'from-purple-600 to-pink-600',
      description: 'Island universes - billions of stars',
      icon: '🌌'
    }
  ]

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setMousePos({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height
        })
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('mousemove', handleMouseMove)
      return () => container.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const handleNodeClick = (node: GalaxyNode) => {
    setSelectedNode(node)
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen pt-20 px-4 py-12 relative overflow-hidden">
      {/* Parallax Stars Background */}
      <div className="fixed inset-0 pointer-events-none opacity-40 z-0">
        {[...Array(500)].map((_, i) => {
          const parallaxX = mousePos.x * 20 - 10
          const parallaxY = mousePos.y * 20 - 10
          return (
            <div
              key={i}
              className="absolute rounded-full bg-white animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 4 + 3}s`,
                transform: `translate(${parallaxX}px, ${parallaxY}px)`,
                transition: 'transform 0.1s ease-out'
              }}
            />
          )
        })}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-8">
            <span className="text-7xl animate-float">🌌</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-gradient portal-title">
            Interactive Galaxy Map
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore the universe through interactive points - each star opens a new world
          </p>
        </div>

        {/* Interactive Galaxy Map */}
        <div 
          ref={containerRef}
          className="relative w-full h-[80vh] min-h-[700px] glass rounded-3xl border-2 border-purple-500/30 overflow-hidden"
        >
          <div 
            className="relative w-full h-full"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
          >
            {/* Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {nodes.map((node, i) => {
                if (i === 0) return null
                const prev = nodes[i - 1]
                return (
                  <line
                    key={i}
                    x1={`${prev.position.x}%`}
                    y1={`${prev.position.y}%`}
                    x2={`${node.position.x}%`}
                    y2={`${node.position.y}%`}
                    stroke="rgba(139, 92, 246, 0.2)"
                    strokeWidth="1.5"
                    strokeDasharray="3,3"
                    className="animate-pulse-slow"
                  />
                )
              })}
            </svg>

            {/* Galaxy Nodes */}
            {nodes.map((node) => (
              <div
                key={node.id}
                className="absolute group cursor-pointer"
                style={{
                  left: `${node.position.x}%`,
                  top: `${node.position.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                onClick={() => handleNodeClick(node)}
                onMouseEnter={() => setSelectedNode(node)}
                onMouseLeave={() => setSelectedNode(null)}
              >
                <div
                  className={`relative rounded-full bg-gradient-to-br ${node.color} p-4 border-4 border-white/20 group-hover:border-white/60 transition-all transform group-hover:scale-125 glow-purple`}
                  style={{
                    width: `${node.size}px`,
                    height: `${node.size}px`,
                  }}
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
                  <div className="relative z-10 flex items-center justify-center h-full">
                    <span className="text-4xl group-hover:scale-125 transition-transform">
                      {node.icon}
                    </span>
                  </div>
                  
                  {/* Pulse Ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-white/40 animate-ping opacity-0 group-hover:opacity-100" />
                  
                  {/* Type Badge */}
                  <div className="absolute -top-2 -right-2 px-2 py-1 bg-purple-600 rounded-full text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    {node.type === 'planet' && 'Planet'}
                    {node.type === 'mission' && 'Mission'}
                    {node.type === 'telescope' && 'Telescope'}
                    {node.type === 'image' && 'Image'}
                    {node.type === 'event' && 'Event'}
                  </div>
                </div>

                {/* Label */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 whitespace-nowrap">
                  <div className="px-4 py-2 glass rounded-lg border border-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-white font-bold text-sm">{node.name}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Node Info */}
        {selectedNode && !isModalOpen && (
          <div className="mt-12 glass rounded-2xl p-8 border-2 border-purple-500/30 max-w-2xl mx-auto animate-fade-in">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-5xl">{selectedNode.icon}</span>
              <div>
                <h3 className="text-3xl font-bold text-gradient">{selectedNode.name}</h3>
                <p className="text-gray-400">{selectedNode.description}</p>
              </div>
            </div>
            {selectedNode.href && (
              <Link
                href={selectedNode.href}
                className="inline-block mt-6 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-bold hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all"
              >
                Explore {selectedNode.name} →
              </Link>
            )}
          </div>
        )}

        {/* Modal */}
        {isModalOpen && selectedNode && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          >
            <div 
              className="glass rounded-3xl p-8 max-w-2xl w-full border-2 border-purple-500/50 animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <span className="text-6xl">{selectedNode.icon}</span>
                  <div>
                    <h2 className="text-4xl font-bold text-gradient">{selectedNode.name}</h2>
                    <p className="text-gray-400">{selectedNode.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-3xl text-gray-400 hover:text-white transition-colors"
                >
                  ×
                </button>
              </div>
              
              {selectedNode.href && (
                <Link
                  href={selectedNode.href}
                  className="inline-block w-full text-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-bold hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all"
                >
                  Go to {selectedNode.name} →
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Quick Navigation */}
        <div className="mt-16">
          <h2 className="text-4xl font-bold text-center mb-8 text-gradient">Quick Navigation</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {nodes.map((node) => (
              <button
                key={node.id}
                onClick={() => handleNodeClick(node)}
                className="group p-6 glass rounded-xl border border-purple-500/20 hover:border-purple-500/50 text-center transition-all transform hover:scale-105"
              >
                <div className="text-4xl mb-2 group-hover:scale-125 transition-transform">
                  {node.icon}
                </div>
                <div className="text-sm font-semibold text-white">{node.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

