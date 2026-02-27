'use client'

import { useRef, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, Text, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

// Planet data
const planets = [
  { name: 'Mercury', radius: 0.4, distance: 4, color: '#8C7853', speed: 4.74, info: 'Smallest planet, closest to Sun' },
  { name: 'Venus', radius: 0.95, distance: 7, color: '#FFC649', speed: 3.50, info: 'Hottest planet, thick atmosphere' },
  { name: 'Earth', radius: 1, distance: 10, color: '#4A90E2', speed: 2.98, info: 'Our home, the blue marble' },
  { name: 'Mars', radius: 0.53, distance: 15, color: '#E27B58', speed: 2.41, info: 'The Red Planet, future colony' },
  { name: 'Jupiter', radius: 2.5, distance: 25, color: '#C88B3A', speed: 1.31, info: 'Largest planet, Great Red Spot' },
  { name: 'Saturn', radius: 2.3, distance: 35, color: '#FAD5A5', speed: 0.97, info: 'Beautiful rings, 82 moons' },
  { name: 'Uranus', radius: 1.5, distance: 45, color: '#4FD0E0', speed: 0.68, info: 'Ice giant, tilted 98°' },
  { name: 'Neptune', radius: 1.5, distance: 55, color: '#4166F5', speed: 0.54, info: 'Windiest planet, deep blue' }
]

// Sun
function Sun() {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001
    }
  })
  
  return (
    <group>
      <Sphere ref={meshRef} args={[3, 64, 64]}>
        <meshBasicMaterial color="#FDB813" />
      </Sphere>
      <Sphere args={[3.1, 64, 64]}>
        <meshBasicMaterial color="#FDB813" transparent opacity={0.3} />
      </Sphere>
      <pointLight position={[0, 0, 0]} intensity={2} distance={100} color="#FDB813" />
    </group>
  )
}

// Planet component
function Planet({ data, selected, onClick }: { 
  data: typeof planets[0]
  selected: boolean
  onClick: () => void
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const orbitRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y += 0.001 * data.speed
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
    }
  })
  
  return (
    <group ref={orbitRef}>
      {/* Orbit line */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[data.distance - 0.05, data.distance + 0.05, 128]} />
        <meshBasicMaterial color="#444444" side={THREE.DoubleSide} transparent opacity={0.3} />
      </mesh>
      
      {/* Planet */}
      <group position={[data.distance, 0, 0]}>
        <Sphere
          ref={meshRef}
          args={[data.radius, 32, 32]}
          onClick={onClick}
        >
          <meshStandardMaterial 
            color={data.color}
            emissive={data.color}
            emissiveIntensity={selected ? 0.5 : 0.2}
          />
        </Sphere>
        
        {/* Selection ring */}
        {selected && (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[data.radius * 1.5, data.radius * 1.6, 32]} />
            <meshBasicMaterial color="#00ff00" side={THREE.DoubleSide} />
          </mesh>
        )}
        
        {/* Label */}
        <Text
          position={[0, data.radius + 0.5, 0]}
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {data.name}
        </Text>
      </group>
    </group>
  )
}

// Scene
function Scene({ selectedPlanet, onSelectPlanet }: { 
  selectedPlanet: number | null
  onSelectPlanet: (index: number) => void 
}) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 40, 40]} fov={60} />
      <OrbitControls 
        enablePan={false}
        minDistance={10}
        maxDistance={100}
        enableDamping
      />
      
      <ambientLight intensity={0.1} />
      <Sun />
      
      {planets.map((planet, index) => (
        <Planet
          key={planet.name}
          data={planet}
          selected={selectedPlanet === index}
          onClick={() => onSelectPlanet(index)}
        />
      ))}
      
      <color attach="background" args={['#000510']} />
      <fog attach="fog" args={['#000510', 50, 100]} />
    </>
  )
}

// Info Panel
function PlanetInfo({ planet }: { planet: typeof planets[0] | null }) {
  if (!planet) {
    return (
      <div className="glass rounded-lg px-4 py-3 text-white">
        <p className="text-sm">Click on a planet to learn more</p>
      </div>
    )
  }
  
  return (
    <div className="glass rounded-lg px-6 py-4 text-white space-y-2">
      <h3 className="text-2xl font-bold text-gradient">{planet.name}</h3>
      <div className="space-y-1 text-sm">
        <div>Radius: <span className="font-mono">{planet.radius}x Earth</span></div>
        <div>Distance: <span className="font-mono">{planet.distance} AU</span></div>
        <div>Orbital Speed: <span className="font-mono">{planet.speed} km/s</span></div>
        <p className="text-gray-300 mt-2">{planet.info}</p>
      </div>
    </div>
  )
}

// Main Component
export default function SolarSystemExplorer() {
  const [isActive, setIsActive] = useState(false)
  const [selectedPlanet, setSelectedPlanet] = useState<number | null>(null)
  const [speed, setSpeed] = useState(1)
  
  if (!isActive) {
    return (
      <button
        onClick={() => setIsActive(true)}
        className="w-full min-h-[300px] bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-black backdrop-blur-sm rounded-2xl border border-indigo-500/30 hover:border-indigo-400/50 transition-all duration-300 group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.2)_0%,rgba(0,0,0,1)_100%)]" />
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-8">
          <div className="text-6xl mb-4">🪐</div>
          <h3 className="text-3xl font-bold text-white mb-3">Solar System Explorer</h3>
          <p className="text-gray-300 text-lg mb-4">Fly between planets and explore our cosmic neighborhood</p>
          <div className="px-6 py-3 bg-indigo-600 rounded-lg text-white font-bold hover:bg-indigo-500 transition-all">
            Explore →
          </div>
        </div>
      </button>
    )
  }
  
  return (
    <div className="relative w-full h-[600px] bg-black rounded-2xl overflow-hidden">
      <div className="absolute top-4 left-4 z-20">
        <PlanetInfo planet={selectedPlanet !== null ? planets[selectedPlanet] : null} />
      </div>
      
      <div className="absolute top-4 right-4 z-20 space-y-2">
        <button
          onClick={() => setIsActive(false)}
          className="px-4 py-2 bg-red-600/80 hover:bg-red-600 backdrop-blur-sm rounded-lg text-white font-semibold transition-all"
        >
          Exit
        </button>
      </div>
      
      <div className="absolute bottom-4 left-4 z-20 glass rounded-lg px-4 py-3">
        <div className="text-white text-sm mb-2">Orbit Speed</div>
        <input
          type="range"
          min="0"
          max="5"
          step="0.1"
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
          className="w-48"
        />
        <div className="text-xs text-gray-400 mt-1">{speed.toFixed(1)}x</div>
      </div>
      
      <Canvas>
        <Suspense fallback={null}>
          <Scene selectedPlanet={selectedPlanet} onSelectPlanet={setSelectedPlanet} />
        </Suspense>
      </Canvas>
    </div>
  )
}
