'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BlackHoleEffectProps {
  position: [number, number, number];
}

export const BlackHoleEffect: React.FC<BlackHoleEffectProps> = ({ position }) => {
  const ringRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.02;
    }
    if (coreRef.current) {
      // Pulsing effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      coreRef.current.scale.set(scale, scale, scale);
    }
  });
  
  return (
    <group position={position}>
      {/* Accretion disk */}
      <mesh ref={ringRef}>
        <torusGeometry args={[30, 3, 16, 100]} />
        <meshBasicMaterial
          color="#ff6b35"
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Event horizon (black core) */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[15, 32, 32]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Glow effect */}
      <mesh>
        <sphereGeometry args={[25, 32, 32]} />
        <meshBasicMaterial
          color="#ff6b35"
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
};
