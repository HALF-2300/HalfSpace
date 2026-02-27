'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { QualitySettings } from '../engine/types';

interface NebulaProps {
  quality: QualitySettings;
  position: [number, number, number];
  color: string;
  size?: number;
}

export const Nebula: React.FC<NebulaProps> = ({
  quality,
  position,
  color,
  size = 150,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Slow pulsing animation
  useFrame((state) => {
    if (meshRef.current && meshRef.current.material) {
      const material = meshRef.current.material;
      // Check if material is a single material (not an array) and has opacity property
      if (!Array.isArray(material) && 'opacity' in material) {
        (material as THREE.MeshBasicMaterial).opacity = 0.15 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      }
    }
  });
  
  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.15}
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
};

// Multiple nebula clouds
export const NebulaField: React.FC<{ quality: QualitySettings }> = ({ quality }) => {
  return (
    <>
      <Nebula
        quality={quality}
        position={[-300, 50, 400]}
        color="#ff6b9d"
        size={120}
      />
      <Nebula
        quality={quality}
        position={[400, -30, 300]}
        color="#4ecdc4"
        size={100}
      />
      <Nebula
        quality={quality}
        position={[-200, 80, -350]}
        color="#a06cd5"
        size={140}
      />
      <Nebula
        quality={quality}
        position={[500, 120, -200]}
        color="#ffa69e"
        size={90}
      />
    </>
  );
};
