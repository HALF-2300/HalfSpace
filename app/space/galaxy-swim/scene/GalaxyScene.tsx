'use client';

import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { QualitySettings, CameraState } from '../engine/types';
import { Galaxy } from './Galaxy';
import { NebulaField } from './Nebula';
import { BackgroundStars, ShootingStars } from './Stars';
import { BlackHoleEffect } from './BlackHoleEffect';

interface GalaxySceneProps {
  quality: QualitySettings;
  cameraState: CameraState;
  onRender?: () => void;
}

// Camera controller component
const CameraController: React.FC<{ cameraState: CameraState }> = ({ cameraState }) => {
  const { camera } = useThree();
  
  useFrame(() => {
    // Smooth camera movement
    const targetPos = new THREE.Vector3(...cameraState.position);
    const targetLookAt = new THREE.Vector3(...cameraState.target);
    
    camera.position.lerp(targetPos, 0.05);
    camera.lookAt(targetLookAt);
    
    // Only update fov if it's a PerspectiveCamera
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = cameraState.fov;
      camera.updateProjectionMatrix();
    }
  });
  
  return null;
};

// Main scene component
const Scene: React.FC<GalaxySceneProps> = ({ quality, cameraState, onRender }) => {
  useFrame(() => {
    if (onRender) {
      onRender();
    }
  });
  
  return (
    <>
      <CameraController cameraState={cameraState} />
      
      {/* Ambient light */}
      <ambientLight intensity={0.1} />
      
      {/* Background stars */}
      <BackgroundStars />
      
      {/* Shooting stars */}
      <ShootingStars />
      
      {/* Main galaxy */}
      <Galaxy quality={quality} />
      
      {/* Nebula clouds */}
      <NebulaField quality={quality} />
      
      {/* Black hole at center */}
      <BlackHoleEffect position={[0, -10, 0]} />
      
      {/* Fog effect */}
      {quality.enableFog && <fog attach="fog" args={['#000510', 400, 2000]} />}
      
      {/* Post-processing - Disabled: requires @react-three/postprocessing */}
      {/* {quality.enableBloom && (
        <EffectComposer>
          <Bloom
            intensity={0.5}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
          />
        </EffectComposer>
      )} */}
    </>
  );
};

export const GalaxyScene: React.FC<GalaxySceneProps> = (props) => {
  return (
    <Canvas
      camera={{ position: [0, 100, 500], fov: 75 }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      }}
      dpr={props.quality.renderScale}
      style={{ width: '100%', height: '100%' }}
    >
      <color attach="background" args={['#000510']} />
      <Scene {...props} />
    </Canvas>
  );
};
