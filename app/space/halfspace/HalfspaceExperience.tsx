'use client';

import { useEffect, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import LivingUniverse from './components/LivingUniverse';
import QuantumTimeline from './components/QuantumTimeline';
import ParallelRealities from './components/ParallelRealities';
import UserGalaxyCreator from './components/UserGalaxyCreator';
import EntangledVisitors from './components/EntangledVisitors';
import CosmicWhispers from './components/CosmicWhispers';
import DreamSyncProtocol from './components/DreamSyncProtocol';
import InfiniteScroll from './components/InfiniteScroll';
import AIConsciousness from './components/AIConsciousness';
import KnowledgeOrbs from './components/KnowledgeOrbs';
import ContentViewer from './components/ContentViewer';
import LiveDataFeed from './components/LiveDataFeed';
import HumanityEssays from './components/HumanityEssays';
import WarpTransition from './components/WarpTransition';
import { useHalfspaceStore } from './store/halfspaceStore';
import { initializeVisitorSession } from './lib/visitorTracking';

export default function HalfspaceExperience() {
  const [isReady, setIsReady] = useState(false);
  const [isDarkDimension, setIsDarkDimension] = useState(false);
  const [showDreamSync, setShowDreamSync] = useState(false);
  const [showInfiniteScroll, setShowInfiniteScroll] = useState(false);
  const [selectedZone, setSelectedZone] = useState<{ domain: string; zoneId: string } | null>(null);
  const [showLiveData, setShowLiveData] = useState(true);
  const [showEssays, setShowEssays] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { setVisitorId, addGlitch } = useHalfspaceStore();

  useEffect(() => {
    // Initialize visitor session
    const visitorId = initializeVisitorSession();
    setVisitorId(visitorId);
    
    // Welcome whisper after a moment
    setTimeout(() => {
      setIsReady(true);
    }, 1000);

    // Listen for secret dimension flip command
    const handleKeyPress = (e: KeyboardEvent) => {
      // Secret command: Type "VOID" to flip dimensions
      const key = e.key.toLowerCase();
      const recentKeys = (window as any).recentKeys || [];
      recentKeys.push(key);
      if (recentKeys.length > 4) recentKeys.shift();
      (window as any).recentKeys = recentKeys;
      
      if (recentKeys.join('') === 'void') {
        setIsDarkDimension(!isDarkDimension);
        addGlitch({
          type: 'dimension_flip',
          message: isDarkDimension 
            ? 'Welcome back to the light...' 
            : 'You have entered the void. The side that was never meant to be seen.',
          intensity: 1.0
        });
        recentKeys.length = 0;
      }

      // "DREAM" opens dream sync
      if (recentKeys.join('').includes('dream')) {
        setShowDreamSync(true);
        recentKeys.length = 0;
      }

      // "INFINITE" opens infinite scroll
      if (recentKeys.join('').includes('infinite')) {
        setShowInfiniteScroll(true);
        recentKeys.length = 0;
      }

      // "KNOW" opens knowledge orbs hint
      if (recentKeys.join('').includes('know')) {
        addGlitch({
          type: 'hint',
          message: 'Click the glowing orbs to access deep knowledge...',
          intensity: 0.8
        });
        recentKeys.length = 0;
      }

      // "READ" toggles humanity essays
      if (recentKeys.join('').includes('read')) {
        setShowEssays(!showEssays);
        recentKeys.length = 0;
      }
    };

    window.addEventListener('keypress', handleKeyPress);

    // Random cosmic events
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.95) { // 5% chance every 5 seconds
        addGlitch({
          type: 'cosmic_whisper',
          message: getRandomCosmicMessage(),
          intensity: 0.3 + Math.random() * 0.4
        });
      }
    }, 5000);

    return () => {
      window.removeEventListener('keypress', handleKeyPress);
      clearInterval(glitchInterval);
    };
  }, [isDarkDimension, setVisitorId, addGlitch]);

  if (!isReady) {
    return null;
  }

  return (
    <div 
      ref={containerRef} 
      className={`halfspace-experience ${isDarkDimension ? 'dark-dimension' : ''}`}
    >
      {/* Warp Transition - Automatic after 12 seconds */}
      <WarpTransition 
        delay={12000} 
        enabled={true}
        targetPath="/space/halfspace/cosmic-wonders"
      />

      {/* 3D Universe Canvas */}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance'
        }}
      >
        <LivingUniverse isDarkDimension={isDarkDimension} />
        <KnowledgeOrbs 
          onZoneSelect={(domain, zoneId) => setSelectedZone({ domain, zoneId })}
          activeZone={selectedZone?.zoneId || null}
        />
      </Canvas>

      {/* UI Overlays */}
      <div className="halfspace-ui">
        <AIConsciousness isDarkDimension={isDarkDimension} />
        <QuantumTimeline />
        <ParallelRealities 
          isDarkDimension={isDarkDimension}
          onFlip={() => setIsDarkDimension(!isDarkDimension)}
        />
        <UserGalaxyCreator />
        <EntangledVisitors />
        <CosmicWhispers />
        
        {/* Conditional UI */}
        {showDreamSync && (
          <DreamSyncProtocol onClose={() => setShowDreamSync(false)} />
        )}
        
        {showInfiniteScroll && (
          <InfiniteScroll onClose={() => setShowInfiniteScroll(false)} />
        )}

        {/* Deep Content Viewer */}
        {selectedZone && (
          <ContentViewer 
            domain={selectedZone.domain}
            zoneId={selectedZone.zoneId}
            onClose={() => setSelectedZone(null)}
          />
        )}

        {/* Live Data Feed */}
        {showLiveData && !selectedZone && (
          <LiveDataFeed />
        )}

        {/* Humanity Essays */}
        {showEssays && (
          <HumanityEssays />
        )}

        {/* Secret Commands Hint */}
        <div className="secret-hint">
          <p>The universe has secrets...</p>
          <p className="hint-fade">Try typing: VOID, DREAM, INFINITE, READ</p>
          <p className="hint-fade-more">Click glowing orbs for deep knowledge...</p>
        </div>
      </div>
    </div>
  );
}

function getRandomCosmicMessage(): string {
  const messages = [
    "You've been here before.",
    "Time is not what you think.",
    "We are stardust, thinking about itself.",
    "The void watches back.",
    "You are not alone in the darkness.",
    "This moment has happened before.",
    "Reality is thinner here.",
    "Listen to the stars.",
    "The universe remembers you.",
    "Some paths should remain hidden.",
    "You are the first. Or the last.",
    "The cosmos speaks in silence.",
    "What you seek is seeking you.",
    "This time should not exist."
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}
