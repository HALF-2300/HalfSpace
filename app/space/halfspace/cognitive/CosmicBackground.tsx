'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function CosmicBackground() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      
      <SubtleStarfield />
      <FloatingNodes />
      <CosmicFog />
    </>
  );
}

function SubtleStarfield() {
  const starsRef = useRef<THREE.Points>(null);

  const starCount = 2000;
  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 100;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 100;

    colors[i * 3] = 0.5 + Math.random() * 0.5;
    colors[i * 3 + 1] = 0.5 + Math.random() * 0.5;
    colors[i * 3 + 2] = 0.8 + Math.random() * 0.2;
  }

  useFrame((state) => {
    if (!starsRef.current) return;
    starsRef.current.rotation.y = state.clock.elapsedTime * 0.01;
    starsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.005) * 0.1;
  });

  return (
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
      </bufferGeometry>
      <pointsMaterial
        size={0.3}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function FloatingNodes() {
  const nodesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!nodesRef.current) return;
    nodesRef.current.rotation.y = state.clock.elapsedTime * 0.03;
  });

  return (
    <group ref={nodesRef}>
      {Array.from({ length: 20 }).map((_, i) => (
        <FloatingNode
          key={i}
          position={[
            (Math.random() - 0.5) * 40,
            (Math.random() - 0.5) * 40,
            (Math.random() - 0.5) * 40
          ]}
          color={getRealmColorByIndex(i % 3)}
        />
      ))}
    </group>
  );
}

function FloatingNode({ position, color }: { position: [number, number, number], color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.position.y += Math.sin(state.clock.elapsedTime + position[0]) * 0.005;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <octahedronGeometry args={[0.3, 0]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        transparent
        opacity={0.6}
        wireframe
      />
    </mesh>
  );
}

function CosmicFog() {
  return (
    <mesh position={[0, 0, -50]}>
      <sphereGeometry args={[80, 32, 32]} />
      <meshBasicMaterial
        color="#0a0a2a"
        side={THREE.BackSide}
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}

function getRealmColorByIndex(index: number): string {
  const colors = ['#0080FF', '#8B00FF', '#FF6B35'];
  return colors[index];
}
