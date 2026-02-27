'use client';

import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import NavigationSystem from '../components/NavigationSystem';
import CosmicBackground from './CosmicBackground';
import { useHalfspaceStore } from '../store/halfspaceStore';
import { initializeVisitorSession } from '../lib/visitorTracking';

export default function CognitiveExperience() {
  const { setVisitorId, incrementVisit } = useHalfspaceStore();

  useEffect(() => {
    // Initialize visitor session
    const visitorId = initializeVisitorSession();
    setVisitorId(visitorId);
    incrementVisit();
  }, [setVisitorId, incrementVisit]);

  return (
    <div className="cognitive-experience">
      {/* Background 3D Cosmos */}
      <div className="cosmic-canvas">
        <Canvas
          camera={{ position: [0, 0, 30], fov: 60 }}
          gl={{ 
            antialias: true, 
            alpha: true,
            powerPreference: 'high-performance'
          }}
        >
          <CosmicBackground />
        </Canvas>
      </div>

      {/* Knowledge Navigation Overlay */}
      <div className="knowledge-overlay">
        <NavigationSystem />
      </div>

      {/* Ambient Info */}
      <div className="ambient-info">
        <div className="info-top-left">
          <div className="mode-label">
            <span className="mode-icon">🧠</span>
            <span className="mode-text">COGNITIVE MODE</span>
          </div>
          <p className="mode-desc whisper">Navigate the knowledge matrix</p>
        </div>
      </div>
    </div>
  );
}
