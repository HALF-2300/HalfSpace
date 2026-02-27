'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useHalfspaceStore } from '../store/halfspaceStore';

interface LivingUniverseProps {
  isDarkDimension: boolean;
}

export default function LivingUniverse({ isDarkDimension }: LivingUniverseProps) {
  const { quantumTime, userGalaxies } = useHalfspaceStore();
  
  return (
    <>
      <ambientLight intensity={isDarkDimension ? 0.1 : 0.3} />
      <pointLight position={[10, 10, 10]} intensity={isDarkDimension ? 0.5 : 1} />
      
      <ReactiveStarfield isDarkDimension={isDarkDimension} quantumTime={quantumTime} />
      <EvolvingGalaxy quantumTime={quantumTime} isDarkDimension={isDarkDimension} />
      <UserCreatedGalaxies galaxies={userGalaxies} />
      <CosmicFog isDarkDimension={isDarkDimension} />
    </>
  );
}

// Reactive Starfield that "watches" the user
function ReactiveStarfield({ isDarkDimension, quantumTime }: { isDarkDimension: boolean, quantumTime: number }) {
  const starsRef = useRef<THREE.Points>(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  const starCount = 5000;
  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      // Distribute stars in a sphere
      const radius = 50 + Math.random() * 50;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Color varies
      const baseColor = isDarkDimension ? 0.2 : 1.0;
      colors[i * 3] = baseColor * (0.5 + Math.random() * 0.5);
      colors[i * 3 + 1] = baseColor * (0.5 + Math.random() * 0.5);
      colors[i * 3 + 2] = baseColor * (0.8 + Math.random() * 0.2);

      sizes[i] = 0.5 + Math.random() * 1.5;
    }

    return { positions, colors, sizes };
  }, [isDarkDimension]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePosition.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    if (!starsRef.current) return;

    const time = state.clock.elapsedTime;
    const geometry = starsRef.current.geometry;
    const positions = geometry.attributes.position.array as Float32Array;

    // Stars slowly drift based on quantum time
    const drift = quantumTime * 0.1;
    
    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      
      // Subtle breathing effect
      const breathe = Math.sin(time * 0.5 + i * 0.01) * 0.05;
      
      // React to mouse position (stars "watch" the cursor)
      const dx = positions[i3] - mousePosition.current.x * 10;
      const dy = positions[i3 + 1] - mousePosition.current.y * 10;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const influence = Math.max(0, 1 - distance / 20);
      
      positions[i3] += (Math.sin(time + i) * 0.001 + drift * 0.01) * (1 + breathe);
      positions[i3 + 1] += (Math.cos(time + i) * 0.001) * (1 + breathe);
      positions[i3 + 2] += influence * 0.02; // Stars move toward gaze
    }

    geometry.attributes.position.needsUpdate = true;

    // Rotate the entire field slowly
    starsRef.current.rotation.y = time * 0.02 + quantumTime * 0.1;
    starsRef.current.rotation.x = Math.sin(time * 0.01) * 0.1;
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
        opacity={isDarkDimension ? 0.4 : 0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Evolving Galaxy that changes with quantum time
function EvolvingGalaxy({ quantumTime, isDarkDimension }: { quantumTime: number, isDarkDimension: boolean }) {
  const galaxyRef = useRef<THREE.Points>(null);

  const particleCount = 10000;
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Spiral galaxy formation
      const angle = (i / particleCount) * Math.PI * 4;
      const radius = (i / particleCount) * 15;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      // Color based on position
      const distanceFromCenter = radius / 15;
      colors[i * 3] = 0.5 + distanceFromCenter * 0.5; // Red
      colors[i * 3 + 1] = 0.3 + (1 - distanceFromCenter) * 0.4; // Green
      colors[i * 3 + 2] = 0.8; // Blue
    }

    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (!galaxyRef.current) return;

    const time = state.clock.elapsedTime;
    const geometry = galaxyRef.current.geometry;
    const pos = geometry.attributes.position.array as Float32Array;

    // Evolution based on quantum time
    // -1 (past): galaxy forming, particles moving inward
    // 0 (present): stable rotation
    // +1 (future): collapsing into black hole

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const angle = (i / particleCount) * Math.PI * 4;
      const baseRadius = (i / particleCount) * 15;
      
      // Time evolution
      let radius = baseRadius;
      if (quantumTime < 0) {
        // Forming: particles moving outward from center
        radius = baseRadius * (1 + quantumTime); // radius decreases as we go back in time
      } else if (quantumTime > 0) {
        // Collapsing: particles moving inward
        radius = baseRadius * (1 - quantumTime * 0.8); // radius decreases toward black hole
      }

      const rotationSpeed = 0.2 + (1 - i / particleCount) * 0.3;
      const currentAngle = angle + time * rotationSpeed;

      pos[i3] = Math.cos(currentAngle) * Math.max(0.5, radius);
      pos[i3 + 2] = Math.sin(currentAngle) * Math.max(0.5, radius);
      
      // Vertical collapse at extreme future
      if (quantumTime > 0.7) {
        pos[i3 + 1] *= (1 - quantumTime);
      }
    }

    geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={galaxyRef} position={[0, 0, -20]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        vertexColors
        transparent
        opacity={isDarkDimension ? 0.3 : 0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// User-created galaxies
function UserCreatedGalaxies({ galaxies }: { galaxies: any[] }) {
  return (
    <>
      {galaxies.map((galaxy) => (
        <UserGalaxy key={galaxy.id} galaxy={galaxy} />
      ))}
    </>
  );
}

function UserGalaxy({ galaxy }: { galaxy: any }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += 0.01;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
  });

  return (
    <mesh ref={meshRef} position={galaxy.position}>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshStandardMaterial
        color={galaxy.color}
        emissive={galaxy.color}
        emissiveIntensity={0.5}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

// Cosmic fog effect
function CosmicFog({ isDarkDimension }: { isDarkDimension: boolean }) {
  const fogRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!fogRef.current) return;
    const time = state.clock.elapsedTime;
    fogRef.current.rotation.y = time * 0.03;
    fogRef.current.rotation.x = Math.sin(time * 0.02) * 0.1;
  });

  return (
    <mesh ref={fogRef} position={[0, 0, -30]}>
      <sphereGeometry args={[100, 32, 32]} />
      <meshBasicMaterial
        color={isDarkDimension ? "#0a0a0a" : "#0a0a2a"}
        side={THREE.BackSide}
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}
