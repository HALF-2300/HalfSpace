'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function InteractiveStarscape() {
  const starsRef = useRef<THREE.Points>(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  const starCount = 3000;
  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      // Distribute stars in a large sphere
      const radius = 30 + Math.random() * 70;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Varied colors
      colors[i * 3] = 0.5 + Math.random() * 0.5; // R
      colors[i * 3 + 1] = 0.5 + Math.random() * 0.5; // G
      colors[i * 3 + 2] = 0.8 + Math.random() * 0.2; // B

      sizes[i] = 0.5 + Math.random() * 2;
    }

    return { positions, colors, sizes };
  }, []);

  useFrame((state) => {
    if (!starsRef.current) return;

    const time = state.clock.elapsedTime;
    const geometry = starsRef.current.geometry;
    const positions = geometry.attributes.position.array as Float32Array;

    // Slow rotation
    starsRef.current.rotation.y = time * 0.03;
    starsRef.current.rotation.x = Math.sin(time * 0.01) * 0.1;

    // Subtle breathing effect
    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      const originalZ = positions[i3 + 2];
      positions[i3 + 2] = originalZ + Math.sin(time * 0.5 + i * 0.01) * 0.1;
    }

    geometry.attributes.position.needsUpdate = true;
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={starCount}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={starCount}
            array={colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={starCount}
            array={sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.5}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
}
