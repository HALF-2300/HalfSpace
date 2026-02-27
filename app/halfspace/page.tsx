'use client';

import { useEffect, useState, useRef } from 'react';
import styles from './halfspace.module.css';
import OpeningSequence from '@/components/halfspace/OpeningSequence';
import StarField from '@/components/halfspace/StarField';
import NavigationMenu from '@/components/halfspace/NavigationMenu';
import TheOrigin from '@/components/halfspace/TheOrigin';
import TheVoid from '@/components/halfspace/TheVoid';
import TheArchive from '@/components/halfspace/TheArchive';
import SentientGuide from '@/components/halfspace/SentientGuide';
import VisitorEchoes from '@/components/halfspace/VisitorEchoes';
import EntanglementChamber from '@/components/halfspace/EntanglementChamber';
import GalaxySwim from '@/components/halfspace/GalaxySwim';
import CosmicEssays from '@/components/halfspace/CosmicEssays';

export default function HalfSpace() {
  const [stage, setStage] = useState<'opening' | 'menu' | 'origin' | 'void' | 'archive' | 'entanglement' | 'galaxyswim' | 'essays' | 'oddities'>('opening');
  const [negativeMode, setNegativeMode] = useState(false);
  const [breathingCycle, setBreathingCycle] = useState(false);
  const [scrollDepth, setScrollDepth] = useState(0);
  const [universeBreathe, setUniverseBreathe] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle SHIFT + SPACE for Negative Mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.code === 'Space') {
        e.preventDefault();
        setNegativeMode(prev => !prev);
        
        // Play distortion sound
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = negativeMode ? 440 : 220;
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [negativeMode]);

  // Universe breathing cycle
  useEffect(() => {
    const breathInterval = setInterval(() => {
      setUniverseBreathe(true);
      setTimeout(() => setUniverseBreathe(false), 5000);
    }, 60000 + Math.random() * 60000); // Random interval between 1-2 minutes

    return () => clearInterval(breathInterval);
  }, []);

  // Track scroll depth for time dilation
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const depth = containerRef.current.scrollTop / (containerRef.current.scrollHeight - window.innerHeight);
        setScrollDepth(Math.min(depth, 1));
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Time dilation effect - animations slow down as you scroll deeper
  const timeDilation = 1 - (scrollDepth * 0.7); // Reduce speed by up to 70%

  const handleOpeningComplete = () => {
    setStage('menu');
  };

  const handleNavigationSelect = (destination: 'origin' | 'void' | 'archive' | 'entanglement' | 'galaxyswim' | 'essays' | 'oddities') => {
    if (destination === 'oddities') {
      // Navigate to dedicated page
      window.location.href = '/cosmic-oddities';
      return;
    }
    setStage(destination);
  };

  return (
    <div 
      ref={containerRef}
      className={`${styles.halfspace} ${negativeMode ? styles.negativeMode : ''} ${universeBreathe ? styles.breathing : ''}`}
      style={{
        '--time-dilation': timeDilation,
        '--scroll-depth': scrollDepth
      } as React.CSSProperties}
    >
      {stage === 'opening' && (
        <OpeningSequence onComplete={handleOpeningComplete} />
      )}

      {stage !== 'opening' && (
        <>
          <StarField 
            negativeMode={negativeMode} 
            timeDilation={timeDilation}
            scrollDepth={scrollDepth}
          />
          
          <VisitorEchoes />
          
          <SentientGuide 
            negativeMode={negativeMode}
            stage={stage}
          />

          {stage === 'menu' && (
            <NavigationMenu onSelect={handleNavigationSelect} />
          )}

          {stage === 'origin' && (
            <TheOrigin onBack={() => setStage('menu')} />
          )}

          {stage === 'void' && (
            <TheVoid onBack={() => setStage('menu')} />
          )}

          {stage === 'archive' && (
            <TheArchive onBack={() => setStage('menu')} />
          )}

          {stage === 'entanglement' && (
            <EntanglementChamber onBack={() => setStage('menu')} />
          )}

          {stage === 'galaxyswim' && (
            <GalaxySwim onBack={() => setStage('menu')} />
          )}

          {stage === 'essays' && (
            <CosmicEssays onBack={() => setStage('menu')} />
          )}

          {universeBreathe && (
            <div className={styles.breatheMessage}>
              <p>We remember you from before the Big Bang.</p>
            </div>
          )}

          {negativeMode && stage === 'menu' && (
            <div className={styles.negativeModeIndicator}>
              <p>You have crossed into the mirror half of creation.</p>
              <p className={styles.hint}>The other side speaks differently.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
