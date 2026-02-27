'use client'

import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, MeshDistortMaterial, Float, Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { getCosmicSignature } from '@/lib/personalization'

// Morphing cosmic objects based on user's cosmic signature
function DreamObject({ position, index, visualTone }: any) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime
      meshRef.current.rotation.x = time * 0.2 * (index % 2 ? 1 : -1)
      meshRef.current.rotation.y = time * 0.3 * visualTone.starfieldDrift
      meshRef.current.position.y = position[1] + Math.sin(time + index) * 2
    }
  })
  
  // Shape based on user's dominant hue
  const shape = visualTone.dominantHue % 4
  const color = `hsl(${visualTone.dominantHue + index * 30}, 70%, 60%)`
  
  return (
    <Float speed={visualTone.starfieldDrift * 2} rotationIntensity={visualTone.nebulaDensity}>
      <mesh ref={meshRef} position={position}>
        {shape === 0 && <octahedronGeometry args={[2, 0]} />}
        {shape === 1 && <icosahedronGeometry args={[2, 0]} />}
        {shape === 2 && <torusKnotGeometry args={[1, 0.3, 100, 16]} />}
        {shape === 3 && <dodecahedronGeometry args={[2, 0]} />}
        
        <MeshDistortMaterial
          color={color}
          speed={visualTone.starfieldDrift * 5}
          distort={visualTone.nebulaDensity}
          radius={1}
          emissive={color}
          emissiveIntensity={visualTone.glowStrength}
        />
      </mesh>
    </Float>
  )
}

// Particles that react to audio/movement
function DreamParticles({ count, visualTone }: any) {
  const pointsRef = useRef<THREE.Points>(null)
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 50
    positions[i * 3 + 1] = (Math.random() - 0.5) * 50
    positions[i * 3 + 2] = (Math.random() - 0.5) * 50
    
    const hue = (visualTone.dominantHue + i * 10) % 360
    const color = new THREE.Color(`hsl(${hue}, 70%, 60%)`)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b
  }
  
  useFrame((state) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
      const time = state.clock.elapsedTime
      
      for (let i = 0; i < count; i++) {
        const i3 = i * 3
        positions[i3 + 1] += Math.sin(time + i) * 0.01 * visualTone.starfieldDrift
        
        // Spiral motion
        const angle = time * 0.5 + i
        const radius = 20 + Math.sin(time * 0.3 + i) * 5
        positions[i3] = Math.cos(angle) * radius * visualTone.nebulaDensity
        positions[i3 + 2] = Math.sin(angle) * radius * visualTone.nebulaDensity
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true
    }
  })
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.3}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  )
}

// Dream Scene
function DreamScene({ visualTone }: any) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={75} />
      
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={2} color={`hsl(${visualTone.dominantHue}, 70%, 60%)`} />
      <pointLight position={[-10, -10, -10]} intensity={1} color={`hsl(${visualTone.secondaryHue}, 70%, 60%)`} />
      
      {/* Dream Objects */}
      {[...Array(8)].map((_, i) => (
        <DreamObject
          key={i}
          position={[
            Math.cos(i / 8 * Math.PI * 2) * 10,
            Math.sin(i / 8 * Math.PI * 2) * 5,
            Math.sin(i / 8 * Math.PI * 4) * 10
          ]}
          index={i}
          visualTone={visualTone}
        />
      ))}
      
      {/* Particle System */}
      <DreamParticles count={500} visualTone={visualTone} />
      
      {/* Rotating camera */}
      <CameraRotation speed={visualTone.starfieldDrift * 0.1} />
      
      <color attach="background" args={['#000']} />
      <fog attach="fog" args={['#000', 10, 50]} />
    </>
  )
}

function CameraRotation({ speed }: { speed: number }) {
  useFrame((state) => {
    const time = state.clock.elapsedTime * speed
    state.camera.position.x = Math.cos(time) * 20
    state.camera.position.z = Math.sin(time) * 20
    state.camera.lookAt(0, 0, 0)
  })
  return null
}

// Main Component
export default function CosmicDreamMode() {
  const [isActive, setIsActive] = useState(false)
  const [visualTone, setVisualTone] = useState<any>(null)
  const [intensity, setIntensity] = useState(1)
  
  useEffect(() => {
    const signature = getCosmicSignature()
    setVisualTone(signature.visualTone)
  }, [])
  
  if (!visualTone) return null
  
  if (!isActive) {
    return (
      <button
        onClick={() => setIsActive(true)}
        className="w-full min-h-[300px] bg-gradient-to-br from-pink-900/30 via-purple-900/30 to-indigo-900/30 backdrop-blur-sm rounded-2xl border border-pink-500/30 hover:border-pink-400/50 transition-all duration-300 group relative overflow-hidden"
      >
        <div className="absolute inset-0 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20 blur-xl" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-8">
          <div className="text-6xl mb-4 animate-bounce">✨</div>
          <h3 className="text-3xl font-bold text-white mb-3">Cosmic Dream Mode</h3>
          <p className="text-gray-300 text-lg mb-2">A surreal journey through YOUR cosmic signature</p>
          <p className="text-sm text-purple-300 mb-4">Unique to your cosmic DNA</p>
          <div className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg text-white font-bold hover:from-pink-500 hover:to-purple-500 transition-all">
            Enter Dream →
          </div>
        </div>
      </button>
    )
  }
  
  return (
    <div className="relative w-full h-[700px] bg-black rounded-2xl overflow-hidden">
      {/* Info */}
      <div className="absolute top-4 left-4 z-20 glass rounded-lg px-6 py-4 space-y-2">
        <div className="text-white font-bold text-lg">Your Cosmic Dream</div>
        <div className="text-sm text-gray-300 space-y-1">
          <div>Nebula: <span className="font-mono">{(visualTone.nebulaDensity * 100).toFixed(0)}%</span></div>
          <div>Drift: <span className="font-mono">{(visualTone.starfieldDrift * 100).toFixed(0)}%</span></div>
          <div>Glow: <span className="font-mono">{(visualTone.glowStrength * 100).toFixed(0)}%</span></div>
          <div className="text-xs text-purple-400 mt-2">
            Based on your cosmic signature
          </div>
        </div>
      </div>
      
      <div className="absolute top-4 right-4 z-20 space-y-2">
        <button
          onClick={() => setIsActive(false)}
          className="px-4 py-2 bg-red-600/80 hover:bg-red-600 backdrop-blur-sm rounded-lg text-white font-semibold transition-all"
        >
          Exit Dream
        </button>
      </div>
      
      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 glass rounded-lg px-6 py-4">
        <div className="text-white text-sm mb-2 text-center">Dream Intensity</div>
        <input
          type="range"
          min="0.1"
          max="2"
          step="0.1"
          value={intensity}
          onChange={(e) => setIntensity(parseFloat(e.target.value))}
          className="w-64"
        />
        <div className="text-xs text-gray-400 text-center mt-2">
          {intensity < 0.5 && "Peaceful"}
          {intensity >= 0.5 && intensity < 1 && "Flowing"}
          {intensity >= 1 && intensity < 1.5 && "Vibrant"}
          {intensity >= 1.5 && "Transcendent"}
        </div>
      </div>
      
      <Canvas>
        <DreamScene visualTone={{ ...visualTone, starfieldDrift: visualTone.starfieldDrift * intensity }} />
      </Canvas>
    </div>
  )
}
