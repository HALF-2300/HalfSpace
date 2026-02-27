'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface KnowledgeOrbProps {
  position: [number, number, number];
  title: string;
  color: string;
  onClick: () => void;
  isActive: boolean;
}

function KnowledgeOrb({ position, title, color, onClick, isActive }: KnowledgeOrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current && glowRef.current) {
      // Gentle floating animation
      const time = state.clock.elapsedTime;
      meshRef.current.position.y = position[1] + Math.sin(time * 0.5 + position[0]) * 0.2;
      
      // Rotation
      meshRef.current.rotation.y += 0.005;
      
      // Glow pulse
      const scale = 1 + Math.sin(time * 2) * 0.1;
      glowRef.current.scale.setScalar(scale * (hovered ? 1.3 : 1) * (isActive ? 1.5 : 1));
      
      // Glow color intensity
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.3 + Math.sin(time * 2) * 0.1 + (hovered ? 0.2 : 0);
    }
  });

  const orbColor = useMemo(() => new THREE.Color(color), [color]);

  return (
    <group position={position}>
      {/* Main orb */}
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color={orbColor}
          emissive={orbColor}
          emissiveIntensity={isActive ? 0.8 : hovered ? 0.5 : 0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Glow effect */}
      <mesh ref={glowRef} scale={1.2}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial
          color={orbColor}
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Label */}
      {hovered && (
        <sprite position={[0, 1, 0]} scale={[2, 0.5, 1]}>
          <spriteMaterial
            color="#ffffff"
            transparent
            opacity={0.9}
          />
        </sprite>
      )}
    </group>
  );
}

interface KnowledgeOrbsProps {
  onZoneSelect: (domain: string, zoneId: string) => void;
  activeZone: string | null;
}

export default function KnowledgeOrbs({ onZoneSelect, activeZone }: KnowledgeOrbsProps) {
  // Define orb positions in 3D space - arranged in a subtle pattern
  const orbsData = useMemo(() => [
    {
      id: 'cosmic-structure',
      domain: 'cosmicStructure',
      title: 'Cosmic Structure',
      position: [-8, 2, -5] as [number, number, number],
      color: '#8b5cf6', // Purple
    },
    {
      id: 'time',
      domain: 'time',
      title: 'Time Itself',
      position: [8, -2, -5] as [number, number, number],
      color: '#06b6d4', // Cyan
    },
    {
      id: 'astrobiology',
      domain: 'astrobiology',
      title: 'Life & Mind',
      position: [-6, -3, -8] as [number, number, number],
      color: '#10b981', // Green
    },
    {
      id: 'civilizations',
      domain: 'civilizations',
      title: 'Civilizations',
      position: [6, 3, -8] as [number, number, number],
      color: '#f59e0b', // Amber
    },
    {
      id: 'metaphysics',
      domain: 'metaphysics',
      title: 'Metaphysics',
      position: [0, 0, -10] as [number, number, number],
      color: '#ec4899', // Pink
    },
    {
      id: 'data',
      domain: 'data',
      title: 'Living Archive',
      position: [-3, 1, -6] as [number, number, number],
      color: '#3b82f6', // Blue
    },
    {
      id: 'humanity',
      domain: 'humanity',
      title: "Humanity's Place",
      position: [3, -1, -6] as [number, number, number],
      color: '#ef4444', // Red
    },
    {
      id: 'strangest',
      domain: 'strangest',
      title: 'The Strangest Things',
      titleAr: 'أغرب الأشياء',
      position: [0, 4, -7] as [number, number, number],
      color: '#f97316', // Orange - للغرابة والدهشة
    },
  ], []);

  return (
    <>
      {orbsData.map((orb) => (
        <KnowledgeOrb
          key={orb.id}
          position={orb.position}
          title={orb.title}
          color={orb.color}
          onClick={() => onZoneSelect(orb.domain, orb.id)}
          isActive={activeZone === orb.id}
        />
      ))}
      
      {/* Ambient light for orbs */}
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 0]} intensity={1} />
    </>
  );
}
