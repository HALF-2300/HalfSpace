'use client'

import { useRef, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Sky } from '@react-three/drei'
import * as THREE from 'three'

// Mars Terrain
function MarsTerrain() {
  const meshRef = useRef<THREE.Mesh>(null)
  
  // Generate procedural terrain
  const geometry = new THREE.PlaneGeometry(100, 100, 128, 128)
  const positions = geometry.attributes.position.array as Float32Array
  
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i]
    const y = positions[i + 1]
    
    // Simple noise-based terrain
    const noise = Math.sin(x * 0.1) * Math.cos(y * 0.1) * 2 +
                  Math.sin(x * 0.05) * Math.cos(y * 0.05) * 4
    
    positions[i + 2] = noise
  }
  
  geometry.computeVertexNormals()
  
  return (
    <mesh ref={meshRef} geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <meshStandardMaterial 
        color="#cd5c5c"
        roughness={0.9}
        metalness={0.1}
      />
    </mesh>
  )
}

// Rocks scattered on terrain
function Rocks() {
  const rocks = []
  
  for (let i = 0; i < 50; i++) {
    const x = (Math.random() - 0.5) * 80
    const z = (Math.random() - 0.5) * 80
    const size = Math.random() * 0.5 + 0.3
    
    rocks.push(
      <mesh 
        key={i} 
        position={[x, size / 2, z]}
        castShadow
      >
        <boxGeometry args={[size, size, size]} />
        <meshStandardMaterial 
          color={`rgb(${180 + Math.random() * 40}, ${100 + Math.random() * 30}, ${80 + Math.random() * 30})`}
          roughness={0.95}
        />
      </mesh>
    )
  }
  
  return <>{rocks}</>
}

// Rover
function Rover({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Body */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[1, 0.5, 1.5]} />
        <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.3} />
      </mesh>
      
      {/* Solar panels */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[1.5, 0.05, 1]} />
        <meshStandardMaterial color="#1a1a3a" metalness={0.5} roughness={0.2} />
      </mesh>
      
      {/* Camera mast */}
      <mesh position={[0, 1.2, -0.3]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.8, 16]} />
        <meshStandardMaterial color="#cccccc" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Camera head */}
      <mesh position={[0, 1.6, -0.3]} castShadow>
        <boxGeometry args={[0.3, 0.2, 0.2]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
      
      {/* Wheels */}
      {[[-0.5, 0.2, -0.6], [-0.5, 0.2, 0.6], [0.5, 0.2, -0.6], [0.5, 0.2, 0.6]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.15, 16]} />
          <meshStandardMaterial color="#333333" roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

// Scene
function Scene({ roverPosition }: { roverPosition: [number, number, number] }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[5, 3, 5]} fov={75} />
      <OrbitControls 
        target={roverPosition}
        enablePan={false}
        minDistance={2}
        maxDistance={20}
        maxPolarAngle={Math.PI / 2 - 0.1}
        enableDamping
      />
      
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[50, 50, 50]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={200}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
        color="#ffddbb"
      />
      
      {/* Sky */}
      <Sky 
        sunPosition={[50, 20, 50]}
        turbidity={10}
        rayleigh={0.5}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />
      
      {/* Terrain */}
      <MarsTerrain />
      <Rocks />
      <Rover position={roverPosition} />
      
      {/* Fog */}
      <fog attach="fog" args={['#cd5c5c', 30, 100]} />
    </>
  )
}

// Main Component
export default function MarsExplorer() {
  const [isActive, setIsActive] = useState(false)
  const [roverPosition, setRoverPosition] = useState<[number, number, number]>([0, 0, 0])
  const [distance, setDistance] = useState(0)
  
  const handleMove = (direction: string) => {
    const speed = 0.5
    const [x, y, z] = roverPosition
    
    switch (direction) {
      case 'forward':
        setRoverPosition([x, y, z - speed])
        break
      case 'backward':
        setRoverPosition([x, y, z + speed])
        break
      case 'left':
        setRoverPosition([x - speed, y, z])
        break
      case 'right':
        setRoverPosition([x + speed, y, z])
        break
    }
    
    setDistance(prev => prev + speed)
  }
  
  if (!isActive) {
    return (
      <button
        onClick={() => setIsActive(true)}
        className="w-full min-h-[300px] bg-gradient-to-br from-red-900/30 via-orange-900/20 to-black backdrop-blur-sm rounded-2xl border border-red-500/30 hover:border-red-400/50 transition-all duration-300 group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(205,92,92,0.3)_0%,rgba(0,0,0,1)_100%)]" />
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-8">
          <div className="text-6xl mb-4">🔴</div>
          <h3 className="text-3xl font-bold text-white mb-3">Mars Surface Explorer</h3>
          <p className="text-gray-300 text-lg mb-4">Drive a rover on the Red Planet</p>
          <div className="px-6 py-3 bg-red-600 rounded-lg text-white font-bold hover:bg-red-500 transition-all">
            Land on Mars →
          </div>
        </div>
      </button>
    )
  }
  
  return (
    <div className="relative w-full h-[600px] bg-black rounded-2xl overflow-hidden">
      {/* Info Panel */}
      <div className="absolute top-4 left-4 z-20 glass rounded-lg px-6 py-4 space-y-2 text-white">
        <div className="font-bold text-lg">Mars Rover Control</div>
        <div className="text-sm space-y-1">
          <div>Position: <span className="font-mono">({roverPosition[0].toFixed(1)}, {roverPosition[2].toFixed(1)})</span></div>
          <div>Distance: <span className="font-mono">{distance.toFixed(1)}m</span></div>
          <div className="text-xs text-gray-400 mt-2">Use controls to drive the rover</div>
        </div>
      </div>
      
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => setIsActive(false)}
          className="px-4 py-2 bg-red-600/80 hover:bg-red-600 backdrop-blur-sm rounded-lg text-white font-semibold transition-all"
        >
          Exit
        </button>
      </div>
      
      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 glass rounded-lg px-6 py-4">
        <div className="grid grid-cols-3 gap-2">
          <div />
          <button
            onClick={() => handleMove('forward')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white font-bold"
          >
            ↑
          </button>
          <div />
          
          <button
            onClick={() => handleMove('left')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white font-bold"
          >
            ←
          </button>
          <div className="flex items-center justify-center text-white text-sm">
            Move
          </div>
          <button
            onClick={() => handleMove('right')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white font-bold"
          >
            →
          </button>
          
          <div />
          <button
            onClick={() => handleMove('backward')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white font-bold"
          >
            ↓
          </button>
          <div />
        </div>
      </div>
      
      <Canvas shadows>
        <Suspense fallback={null}>
          <Scene roverPosition={roverPosition} />
        </Suspense>
      </Canvas>
    </div>
  )
}
