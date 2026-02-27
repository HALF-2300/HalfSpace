'use client'

import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

// Audio-reactive sphere
function AudioSphere({ frequency, audioData }: { frequency: number; audioData: number[] }) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame(() => {
    if (meshRef.current && audioData.length > 0) {
      const avgFreq = audioData.reduce((a, b) => a + b, 0) / audioData.length
      meshRef.current.scale.setScalar(1 + avgFreq * 2)
      meshRef.current.rotation.y += 0.01 * avgFreq
    }
  })
  
  const color = `hsl(${frequency % 360}, 70%, 60%)`
  
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        wireframe
      />
    </mesh>
  )
}

// Audio bars
function AudioBars({ audioData }: { audioData: number[] }) {
  const groupRef = useRef<THREE.Group>(null)
  
  return (
    <group ref={groupRef}>
      {audioData.map((value, i) => {
        const angle = (i / audioData.length) * Math.PI * 2
        const radius = 5
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        const height = 0.5 + value * 3
        const hue = (i / audioData.length) * 360
        
        return (
          <mesh key={i} position={[x, 0, z]}>
            <boxGeometry args={[0.1, height, 0.1]} />
            <meshStandardMaterial
              color={`hsl(${hue}, 70%, 60%)`}
              emissive={`hsl(${hue}, 70%, 60%)`}
              emissiveIntensity={value}
            />
          </mesh>
        )
      })}
    </group>
  )
}

// Scene
function MusicScene({ audioData }: { audioData: number[] }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={75} />
      
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      <AudioSphere frequency={Date.now() / 100} audioData={audioData} />
      <AudioBars audioData={audioData} />
      
      <CameraRotation />
      
      <color attach="background" args={['#000']} />
    </>
  )
}

function CameraRotation() {
  useFrame((state) => {
    const time = state.clock.elapsedTime
    state.camera.position.x = Math.cos(time * 0.3) * 10
    state.camera.position.z = Math.sin(time * 0.3) * 10
    state.camera.lookAt(0, 0, 0)
  })
  return null
}

// Synth engine
class SimpleSynth {
  private audioContext: AudioContext
  private oscillators: OscillatorNode[] = []
  private gainNodes: GainNode[] = []
  
  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  }
  
  playNote(frequency: number, duration: number = 0.5) {
    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)
    
    oscillator.frequency.value = frequency
    oscillator.type = 'sine'
    
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)
    
    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + duration)
    
    this.oscillators.push(oscillator)
    this.gainNodes.push(gainNode)
  }
  
  playChord(frequencies: number[]) {
    frequencies.forEach(freq => this.playNote(freq, 1))
  }
}

// Cosmic scale to musical scale
const cosmicScales = {
  'Planetary': [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88], // C Major
  'Stellar': [277.18, 311.13, 369.99, 415.30, 466.16], // C# Minor Pentatonic
  'Galactic': [329.63, 369.99, 415.30, 493.88, 554.37], // E Minor Pentatonic
  'Cosmic': [246.94, 277.18, 329.63, 369.99, 440.00, 493.88] // B Minor
}

export default function SpaceMusicVisualizer() {
  const [isActive, setIsActive] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioData, setAudioData] = useState<number[]>(new Array(64).fill(0))
  const [scale, setScale] = useState<keyof typeof cosmicScales>('Planetary')
  const [tempo, setTempo] = useState(120)
  const synthRef = useRef<SimpleSynth | null>(null)
  const intervalRef = useRef<number | null>(null)
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = new SimpleSynth()
    }
  }, [])
  
  const generateMusicPattern = () => {
    if (!synthRef.current) return
    
    const frequencies = cosmicScales[scale]
    const randomFreq = frequencies[Math.floor(Math.random() * frequencies.length)]
    
    synthRef.current.playNote(randomFreq)
    
    // Update audio data for visualization
    setAudioData(prev => {
      const newData = [...prev]
      newData.shift()
      newData.push(Math.random())
      return newData
    })
  }
  
  const startMusic = () => {
    if (intervalRef.current) return
    
    setIsPlaying(true)
    const interval = 60000 / tempo // Convert BPM to ms
    
    intervalRef.current = window.setInterval(() => {
      generateMusicPattern()
    }, interval)
  }
  
  const stopMusic = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsPlaying(false)
    setAudioData(new Array(64).fill(0))
  }
  
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])
  
  if (!isActive) {
    return (
      <button
        onClick={() => setIsActive(true)}
        className="w-full min-h-[300px] bg-gradient-to-br from-indigo-900/20 via-pink-900/20 to-purple-900/20 backdrop-blur-sm rounded-2xl border border-pink-500/30 hover:border-pink-400/50 transition-all duration-300 group relative overflow-hidden"
      >
        <div className="absolute inset-0 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-pink-500/20 to-purple-500/20 blur-xl" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-8">
          <div className="text-6xl mb-4">🎵</div>
          <h3 className="text-3xl font-bold text-white mb-3">Space Music Visualizer</h3>
          <p className="text-gray-300 text-lg mb-4">Turn cosmic scales into procedural music</p>
          <div className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg text-white font-bold hover:from-pink-500 hover:to-purple-500 transition-all">
            Create Music →
          </div>
        </div>
      </button>
    )
  }
  
  return (
    <div className="relative w-full h-[700px] bg-black rounded-2xl overflow-hidden">
      <div className="absolute top-4 left-4 z-20 glass rounded-lg px-6 py-4 space-y-3">
        <div className="text-white font-bold text-lg">Music Generator</div>
        
        <div>
          <label className="text-white text-sm block mb-2">Cosmic Scale</label>
          <select
            value={scale}
            onChange={(e) => setScale(e.target.value as any)}
            className="w-full px-3 py-2 bg-white/10 text-white rounded border border-white/20"
            disabled={isPlaying}
          >
            {Object.keys(cosmicScales).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="text-white text-sm block mb-2">Tempo: {tempo} BPM</label>
          <input
            type="range"
            min="60"
            max="180"
            value={tempo}
            onChange={(e) => setTempo(parseInt(e.target.value))}
            disabled={isPlaying}
            className="w-full"
          />
        </div>
        
        <button
          onClick={isPlaying ? stopMusic : startMusic}
          className={`w-full px-4 py-2 rounded-lg font-bold transition-all ${
            isPlaying
              ? 'bg-red-600 hover:bg-red-500 text-white'
              : 'bg-green-600 hover:bg-green-500 text-white'
          }`}
        >
          {isPlaying ? '⏸ Stop' : '▶ Play'}
        </button>
      </div>
      
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => {
            stopMusic()
            setIsActive(false)
          }}
          className="px-4 py-2 bg-red-600/80 hover:bg-red-600 backdrop-blur-sm rounded-lg text-white font-semibold transition-all"
        >
          Exit
        </button>
      </div>
      
      <div className="absolute bottom-4 left-4 z-20 glass rounded-lg px-4 py-3">
        <div className="text-white text-xs space-y-1">
          <div><strong>Planetary:</strong> Major scale (happy)</div>
          <div><strong>Stellar:</strong> Minor pentatonic (mysterious)</div>
          <div><strong>Galactic:</strong> Minor pentatonic (deep)</div>
          <div><strong>Cosmic:</strong> Minor scale (vast)</div>
        </div>
      </div>
      
      <Canvas>
        <MusicScene audioData={audioData} />
      </Canvas>
    </div>
  )
}
