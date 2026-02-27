'use client'

import { useRef, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Float, PerspectiveCamera, Environment } from '@react-three/drei'
import * as THREE from 'three'
import type { Locale } from '@/data/sitemap'

const flightStrings: Record<Locale, {
  enterMode: string
  experienceDesc: string
  launchShip: string
  exitFlight: string
  flightActive: string
  useMouse: string
  preparing: string
}> = {
  en: {
    enterMode: 'Enter Space Flight Mode',
    experienceDesc: 'Experience flying through the cosmos in your own spaceship',
    launchShip: 'Launch Ship →',
    exitFlight: 'Exit Flight',
    flightActive: 'FLIGHT ACTIVE',
    useMouse: 'Use mouse to look around',
    preparing: 'Preparing your ship... 🚀',
  },
  ar: {
    enterMode: 'وضع رحلة الفضاء',
    experienceDesc: 'جرّب الطيران عبر الكون في مركبتك الفضائية',
    launchShip: 'إطلاق المركبة ←',
    exitFlight: 'إنهاء الرحلة',
    flightActive: 'الرحلة نشطة',
    useMouse: 'استخدم الفأرة للنظر حولك',
    preparing: 'جاري تجهيز مركبتك... 🚀',
  },
  es: {
    enterMode: 'Modo vuelo espacial',
    experienceDesc: 'Vuela por el cosmos en tu propia nave espacial',
    launchShip: 'Lanzar nave →',
    exitFlight: 'Salir del vuelo',
    flightActive: 'VUELO ACTIVO',
    useMouse: 'Usa el ratón para mirar',
    preparing: 'Preparando tu nave... 🚀',
  },
  zh: {
    enterMode: '进入太空飞行模式',
    experienceDesc: '驾驶你的飞船穿越宇宙',
    launchShip: '发射飞船 →',
    exitFlight: '退出飞行',
    flightActive: '飞行中',
    useMouse: '使用鼠标环顾四周',
    preparing: '正在准备飞船... 🚀',
  },
}

// Spaceship component
function Spaceship() {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle bobbing motion
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.05
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Main body */}
      <mesh position={[0, 0, 0]} castShadow>
        <coneGeometry args={[0.5, 2, 8]} />
        <meshStandardMaterial 
          color="#4a90e2" 
          metalness={0.8} 
          roughness={0.2}
          emissive="#2060c0"
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Wings */}
      <mesh position={[-0.6, 0, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
        <boxGeometry args={[0.8, 0.1, 0.4]} />
        <meshStandardMaterial color="#3070d0" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0.6, 0, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow>
        <boxGeometry args={[0.8, 0.1, 0.4]} />
        <meshStandardMaterial color="#3070d0" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Cockpit glow */}
      <mesh position={[0, 0.5, 0.3]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial 
          color="#00ffff" 
          emissive="#00ffff"
          emissiveIntensity={2}
          transparent
          opacity={0.7}
        />
      </mesh>
      
      {/* Engine glow */}
      <mesh position={[0, -1, 0]}>
        <cylinderGeometry args={[0.2, 0.3, 0.5, 16]} />
        <meshStandardMaterial 
          color="#ff6600" 
          emissive="#ff3300"
          emissiveIntensity={1.5}
        />
      </mesh>
      
      {/* Engine particles */}
      <pointLight position={[0, -1.5, 0]} color="#ff6600" intensity={2} distance={5} />
    </group>
  )
}

// Flying particles/debris
function FlyingParticles() {
  const particlesRef = useRef<THREE.Points>(null)
  const particleCount = 1000
  
  const positions = new Float32Array(particleCount * 3)
  const velocities = new Float32Array(particleCount)
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 50
    positions[i * 3 + 1] = (Math.random() - 0.5) * 50
    positions[i * 3 + 2] = (Math.random() - 0.5) * 50
    velocities[i] = Math.random() * 0.5 + 0.5
  }
  
  useFrame((state, delta) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
      
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 2] += velocities[i] * delta * 5
        
        // Reset particle when it goes too far
        if (positions[i * 3 + 2] > 25) {
          positions[i * 3 + 2] = -25
          positions[i * 3] = (Math.random() - 0.5) * 50
          positions[i * 3 + 1] = (Math.random() - 0.5) * 50
        }
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#ffffff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

// Nebula clouds
function NebulaClouds() {
  const cloudsRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0001
      cloudsRef.current.position.z = (state.clock.elapsedTime * 0.5) % 30 - 15
    }
  })
  
  return (
    <group ref={cloudsRef}>
      {[...Array(5)].map((_, i) => (
        <Float key={i} speed={1 + i * 0.2} rotationIntensity={0.2} floatIntensity={0.5}>
          <mesh 
            position={[
              (Math.random() - 0.5) * 20,
              (Math.random() - 0.5) * 20,
              -10 - i * 5
            ]}
          >
            <sphereGeometry args={[2 + Math.random() * 3, 16, 16]} />
            <meshStandardMaterial
              color={['#8b00ff', '#4a00ff', '#ff006a', '#00d4ff'][i % 4]}
              transparent
              opacity={0.1}
              emissive={['#8b00ff', '#4a00ff', '#ff006a', '#00d4ff'][i % 4]}
              emissiveIntensity={0.2}
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

// Camera movement
function CameraRig() {
  useFrame((state) => {
    const t = state.clock.elapsedTime
    state.camera.position.x = Math.sin(t * 0.1) * 2
    state.camera.position.y = Math.cos(t * 0.15) * 1
    state.camera.lookAt(0, 0, -5)
  })
  return null
}

// Main scene
function Scene() {
  return (
    <>
      {/* Camera */}
      <PerspectiveCamera makeDefault position={[0, 2, 10]} fov={75} />
      <CameraRig />
      
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} color="#4a00ff" intensity={0.5} />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={1}
        intensity={1}
        castShadow
      />
      
      {/* Spaceship */}
      <Spaceship />
      
      {/* Environment */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <FlyingParticles />
      <NebulaClouds />
      
      {/* Background */}
      <color attach="background" args={['#000510']} />
      <fog attach="fog" args={['#000510', 10, 50]} />
    </>
  )
}

// Loading fallback
function Loader({ locale = 'en' }: { locale?: Locale }) {
  const t = flightStrings[locale] || flightStrings.en
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-white text-xl">{t.preparing}</div>
    </div>
  )
}

// Main component
export default function SpaceFlightExperience({ className = '', locale = 'en' }: { className?: string; locale?: Locale }) {
  const [isActive, setIsActive] = useState(false)
  const t = flightStrings[locale] || flightStrings.en

  if (!isActive) {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsActive(true)}
          className="w-full h-full min-h-[400px] bg-gradient-to-b from-purple-900/20 to-black/40 backdrop-blur-sm rounded-2xl border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001435/GSFC_20171208_Archive_e001435~orig.jpg')] bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity" />
          
          <div className="relative z-10 flex flex-col items-center justify-center h-full p-8">
            <div className="text-6xl mb-4 animate-bounce">🚀</div>
            <h3 className="text-3xl font-bold text-white mb-3 text-gradient">
              {t.enterMode}
            </h3>
            <p className="text-gray-300 text-lg mb-6">
              {t.experienceDesc}
            </p>
            <div className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-bold text-xl hover:from-blue-500 hover:to-purple-500 transition-all shadow-2xl group-hover:scale-105">
              {t.launchShip}
            </div>
          </div>
        </button>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <button
          onClick={() => setIsActive(false)}
          className="px-4 py-2 bg-red-600/80 hover:bg-red-600 backdrop-blur-sm rounded-lg text-white font-semibold transition-all"
        >
          {t.exitFlight}
        </button>
      </div>
      
      <div className="absolute top-4 left-4 z-20 glass rounded-lg px-4 py-3">
        <div className="text-white text-sm space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="font-semibold">{t.flightActive}</span>
          </div>
          <div className="text-gray-300 text-xs">{t.useMouse}</div>
        </div>
      </div>
      
      <Canvas className="w-full h-full min-h-[600px]">
        <Suspense fallback={<Loader locale={locale} />}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  )
}
