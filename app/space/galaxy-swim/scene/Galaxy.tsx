'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { QualitySettings } from '../engine/types';

interface GalaxyProps {
  quality: QualitySettings;
}

export const Galaxy: React.FC<GalaxyProps> = ({ quality }) => {
  const particlesRef = useRef<THREE.Points>(null);
  
  const { positions, colors } = useMemo(() => {
    const count = quality.particleCount;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    // Create spiral galaxy structure
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Spiral arms parameters
      const radius = Math.pow(Math.random(), 0.5) * 800;
      const spinAngle = radius * 0.005;
      const branchAngle = ((i % 4) / 4) * Math.PI * 2;
      
      const angle = branchAngle + spinAngle;
      
      // Add randomness for natural look
      const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 30;
      const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 30;
      const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 30;
      
      positions[i3] = Math.cos(angle) * radius + randomX;
      positions[i3 + 1] = randomY * 0.3; // Flatten for disk
      positions[i3 + 2] = Math.sin(angle) * radius + randomZ;
      
      // Color based on distance from center
      const distanceRatio = radius / 800;
      
      // Core is more yellow/white, outer arms more blue
      if (distanceRatio < 0.1) {
        // Core - hot white/yellow
        colors[i3] = 1.0;
        colors[i3 + 1] = 0.9 + Math.random() * 0.1;
        colors[i3 + 2] = 0.6 + Math.random() * 0.2;
      } else if (distanceRatio < 0.5) {
        // Inner arms - white to blue
        colors[i3] = 0.8 + Math.random() * 0.2;
        colors[i3 + 1] = 0.8 + Math.random() * 0.2;
        colors[i3 + 2] = 1.0;
      } else {
        // Outer arms - blue with some variation
        colors[i3] = 0.5 + Math.random() * 0.3;
        colors[i3 + 1] = 0.6 + Math.random() * 0.3;
        colors[i3 + 2] = 1.0;
      }
    }
    
    return { positions, colors };
  }, [quality.particleCount]);
  
  // Slow rotation
  useFrame((state, delta) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.02;
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
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={2}
        vertexColors
        sizeAttenuation
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
