'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, Ring } from '@react-three/drei'
import * as THREE from 'three'

type PlanetType = 'terrestrial' | 'gas-giant' | 'ice-giant' | 'dwarf'

interface Planet3DProps {
  type: PlanetType
  color: string
  rotationSpeed?: number
  hasRings?: boolean
}

export default function Planet3D({ type, color, rotationSpeed = 0.002, hasRings = false }: Planet3DProps) {
  const planetRef = useRef<THREE.Mesh>(null)
  const ringsRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (planetRef.current) {
      planetRef.current.rotation.y += rotationSpeed
    }
    if (ringsRef.current) {
      ringsRef.current.rotation.z += rotationSpeed * 0.5
    }
  })

  const getPlanetTexture = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 512
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    // Create texture based on planet type
    switch (type) {
      case 'terrestrial':
        // Rocky planet texture with craters
        ctx.fillStyle = color
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        for (let i = 0; i < 50; i++) {
          ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.3})`
          ctx.beginPath()
          ctx.arc(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            Math.random() * 30,
            0,
            Math.PI * 2
          )
          ctx.fill()
        }
        break

      case 'gas-giant':
        // Banded gas giant
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
        gradient.addColorStop(0, color)
        gradient.addColorStop(0.5, lightenColor(color, 20))
        gradient.addColorStop(1, darkenColor(color, 20))
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        // Add bands
        for (let i = 0; i < 10; i++) {
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.1})`
          ctx.fillRect(0, i * canvas.height / 10, canvas.width, canvas.height / 20)
        }
        break

      case 'ice-giant':
        // Smooth ice giant
        const iceGradient = ctx.createRadialGradient(
          canvas.width / 2,
          canvas.height / 2,
          0,
          canvas.width / 2,
          canvas.height / 2,
          canvas.width / 2
        )
        iceGradient.addColorStop(0, lightenColor(color, 40))
        iceGradient.addColorStop(1, color)
        ctx.fillStyle = iceGradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        break

      default:
        ctx.fillStyle = color
        ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    return new THREE.CanvasTexture(canvas)
  }

  const texture = getPlanetTexture()

  return (
    <group>
      {/* Planet */}
      <Sphere ref={planetRef} args={[1, 32, 32]}>
        <meshStandardMaterial
          map={texture || undefined}
          color={color}
          roughness={type === 'ice-giant' ? 0.3 : 0.7}
          metalness={type === 'ice-giant' ? 0.5 : 0.1}
        />
      </Sphere>

      {/* Rings for Saturn-like planets */}
      {hasRings && (
        <Ring ref={ringsRef} args={[1.3, 2, 64]} rotation={[Math.PI / 2.5, 0, 0]}>
          <meshStandardMaterial
            color="#d4af37"
            transparent
            opacity={0.7}
            side={THREE.DoubleSide}
          />
        </Ring>
      )}

      {/* Atmosphere glow for gas giants */}
      {(type === 'gas-giant' || type === 'ice-giant') && (
        <Sphere args={[1.05, 32, 32]}>
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.1}
            side={THREE.BackSide}
          />
        </Sphere>
      )}
    </group>
  )
}

// Helper functions
function lightenColor(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = Math.min(255, (num >> 16) + amt)
  const G = Math.min(255, ((num >> 8) & 0x00ff) + amt)
  const B = Math.min(255, (num & 0x0000ff) + amt)
  return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)
}

function darkenColor(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = Math.max(0, (num >> 16) - amt)
  const G = Math.max(0, ((num >> 8) & 0x00ff) - amt)
  const B = Math.max(0, (num & 0x0000ff) - amt)
  return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)
}
