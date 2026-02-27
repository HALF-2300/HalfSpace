'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Background starfield (distant stars)
export const BackgroundStars: React.FC = () => {
  const particlesRef = useRef<THREE.Points>(null);
  
  const { positions, sizes } = useMemo(() => {
    const count = 5000;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Random position in large sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 1500 + Math.random() * 500;
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
      
      sizes[i] = Math.random() * 2 + 0.5;
    }
    
    return { positions, sizes };
  }, []);
  
  // Twinkle effect
  useFrame((state) => {
    if (particlesRef.current) {
      const material = particlesRef.current.material as THREE.PointsMaterial;
      material.opacity = 0.6 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={1.5}
        color="#ffffff"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};

// Shooting stars
export const ShootingStars: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((star, i) => {
        star.position.x -= delta * (50 + i * 10);
        star.position.y -= delta * (20 + i * 5);
        
        // Reset position when off screen
        if (star.position.x < -1000) {
          star.position.x = 1000;
          star.position.y = Math.random() * 500 - 250;
          star.position.z = Math.random() * 500 - 250;
        }
      });
    }
  });
  
  const shootingStars = useMemo(() => {
    return Array.from({ length: 3 }, (_, i) => ({
      key: i,
      position: [
        Math.random() * 2000 - 1000,
        Math.random() * 500 - 250,
        Math.random() * 500 - 250,
      ] as [number, number, number],
    }));
  }, []);
  
  return (
    <group ref={groupRef}>
      {shootingStars.map(({ key, position }) => (
        <mesh key={key} position={position}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
};
