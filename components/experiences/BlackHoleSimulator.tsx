'use client'

import { useRef, useState, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Sphere, Stars, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

// Gravitational Lensing Shader
const lensingVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const lensingFragmentShader = `
  uniform sampler2D tBackground;
  uniform vec2 uBlackHolePos;
  uniform float uStrength;
  uniform float uEventHorizon;
  varying vec2 vUv;
  
  void main() {
    vec2 toBlackHole = vUv - uBlackHolePos;
    float dist = length(toBlackHole);
    
    // Gravitational lensing effect
    float lensStrength = uStrength / (dist + 0.1);
    vec2 distortion = normalize(toBlackHole) * lensStrength;
    vec2 distortedUV = vUv + distortion;
    
    // Event horizon (pure black)
    if (dist < uEventHorizon) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    } else {
      // Accretion disk glow
      float diskGlow = smoothstep(uEventHorizon + 0.15, uEventHorizon, dist);
      vec3 diskColor = vec3(1.0, 0.5, 0.0) * diskGlow;
      
      // Sample background with distortion
      vec4 bgColor = texture2D(tBackground, distortedUV);
      gl_FragColor = vec4(bgColor.rgb + diskColor, 1.0);
    }
  }
`

// Accretion Disk
function AccretionDisk({ radius }: { radius: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001
    }
  })
  
  return (
    <mesh ref={meshRef} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius * 1.5, radius * 3, 64]} />
      <meshStandardMaterial
        color="#ff6600"
        emissive="#ff3300"
        emissiveIntensity={2}
        side={THREE.DoubleSide}
        transparent
        opacity={0.7}
      />
    </mesh>
  )
}

// Black Hole Core
function BlackHole({ radius }: { radius: number }) {
  return (
    <group>
      {/* Event Horizon */}
      <Sphere args={[radius, 64, 64]}>
        <meshBasicMaterial color="#000000" />
      </Sphere>
      
      {/* Photon Sphere (light orbit) */}
      <Sphere args={[radius * 1.5, 64, 64]}>
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.1}
          wireframe
        />
      </Sphere>
      
      {/* Accretion Disk */}
      <AccretionDisk radius={radius} />
      
      {/* Glow */}
      <pointLight position={[0, 0, 0]} color="#ff6600" intensity={5} distance={15} />
    </group>
  )
}

// Spaceship approaching
function ApproachingShip({ distance }: { distance: number }) {
  const meshRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.z = -distance
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
    }
  })
  
  return (
    <group ref={meshRef}>
      <mesh>
        <coneGeometry args={[0.3, 1, 8]} />
        <meshStandardMaterial color="#4a90e2" emissive="#2060c0" emissiveIntensity={0.5} />
      </mesh>
      <pointLight position={[0, 0, 0.5]} color="#00ffff" intensity={1} distance={3} />
    </group>
  )
}

// Info Panel
function InfoPanel({ distance, timeDilation }: { distance: number; timeDilation: number }) {
  const getWarningLevel = () => {
    if (distance < 3) return 'CRITICAL'
    if (distance < 5) return 'DANGER'
    if (distance < 8) return 'WARNING'
    return 'SAFE'
  }
  
  const warningLevel = getWarningLevel()
  const warningColor = {
    CRITICAL: 'bg-red-600',
    DANGER: 'bg-orange-600',
    WARNING: 'bg-yellow-600',
    SAFE: 'bg-green-600'
  }[warningLevel]
  
  return (
    <div className="absolute top-4 left-4 glass rounded-lg px-4 py-3 space-y-2 text-white">
      <div className={`${warningColor} px-3 py-1 rounded text-center font-bold animate-pulse`}>
        {warningLevel}
      </div>
      <div className="text-sm space-y-1">
        <div>Distance: <span className="font-mono">{distance.toFixed(1)} Rs</span></div>
        <div>Time Dilation: <span className="font-mono">{timeDilation.toFixed(2)}x</span></div>
        <div className="text-xs text-gray-400 mt-2">
          Rs = Schwarzschild radius
        </div>
      </div>
      {distance < 2 && (
        <div className="text-xs text-red-400 animate-pulse">
          ⚠️ Event horizon approaching!
        </div>
      )}
    </div>
  )
}

// Main Scene
function Scene({ distance }: { distance: number }) {
  const eventHorizonRadius = 2
  
  // Calculate time dilation (simplified)
  const timeDilation = 1 / Math.sqrt(1 - (2 * eventHorizonRadius) / distance)
  
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 5, 15]} fov={60} />
      <OrbitControls 
        enablePan={false}
        minDistance={5}
        maxDistance={30}
        enableDamping
      />
      
      <ambientLight intensity={0.1} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />
      
      <BlackHole radius={eventHorizonRadius} />
      <ApproachingShip distance={distance} />
      
      <color attach="background" args={['#000010']} />
    </>
  )
}

// Main Component
export default function BlackHoleSimulator() {
  const [isActive, setIsActive] = useState(false)
  const [distance, setDistance] = useState(15)
  
  // Calculate time dilation
  const eventHorizonRadius = 2
  const timeDilation = Math.max(1, 1 / Math.sqrt(Math.abs(1 - (2 * eventHorizonRadius) / distance)))
  
  if (!isActive) {
    return (
      <button
        onClick={() => setIsActive(true)}
        className="w-full min-h-[300px] bg-gradient-to-br from-black via-purple-900/20 to-black backdrop-blur-sm rounded-2xl border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,1)_0%,rgba(139,0,255,0.3)_100%)]" />
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-8">
          <div className="text-6xl mb-4">🕳️</div>
          <h3 className="text-3xl font-bold text-white mb-3">Black Hole Simulator</h3>
          <p className="text-gray-300 text-lg mb-4">Experience gravitational lensing and time dilation</p>
          <div className="px-6 py-3 bg-purple-600 rounded-lg text-white font-bold hover:bg-purple-500 transition-all">
            Enter →
          </div>
        </div>
      </button>
    )
  }
  
  return (
    <div className="relative w-full h-[600px] bg-black rounded-2xl overflow-hidden">
      <InfoPanel distance={distance} timeDilation={timeDilation} />
      
      <div className="absolute top-4 right-4 z-20 space-y-2">
        <button
          onClick={() => setIsActive(false)}
          className="px-4 py-2 bg-red-600/80 hover:bg-red-600 backdrop-blur-sm rounded-lg text-white font-semibold transition-all"
        >
          Exit
        </button>
      </div>
      
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 glass rounded-lg px-6 py-4">
        <div className="text-white text-center mb-2 text-sm">Approach Distance</div>
        <input
          type="range"
          min="2.1"
          max="20"
          step="0.1"
          value={distance}
          onChange={(e) => setDistance(parseFloat(e.target.value))}
          className="w-64"
        />
        <div className="text-center text-xs text-gray-400 mt-2">
          {distance < 3 && "⚠️ Spaghettification zone!"}
          {distance >= 3 && distance < 5 && "Extreme gravity"}
          {distance >= 5 && distance < 10 && "Light bending visible"}
          {distance >= 10 && "Safe distance"}
        </div>
      </div>
      
      <Canvas>
        <Suspense fallback={null}>
          <Scene distance={distance} />
        </Suspense>
      </Canvas>
    </div>
  )
}
