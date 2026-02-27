'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { QualityManager } from './engine/qualityManager';
import { FPSMonitor } from './engine/fpsMonitor';
import { SwimControls } from './engine/controls';
import { QualityPreset, ControlMode, Hotspot, ScienceOverlay as ScienceOverlayType } from './engine/types';
import { detectWebGL } from './utils/webglDetect';
import { HUD } from './ui/HUD';
import { MomentCard } from './ui/MomentCard';
import { LearnMoreModal } from './ui/LearnMoreModal';
import { TeleportMenu } from './ui/TeleportMenu';
import { ScienceOverlay } from './ui/ScienceOverlay';
import { Toast } from './ui/Toast';
import hotspotData from './data/hotspots.json';
import scienceOverlayData from './data/scienceOverlay.json';
import './galaxy-swim.css';

// Dynamic imports for 3D scenes (avoid SSR issues)
const GalaxyScene = dynamic(
  () => import('./scene/GalaxyScene').then((mod) => mod.GalaxyScene),
  { ssr: false }
);

const FallbackScene = dynamic(
  () => import('./scene/FallbackScene').then((mod) => mod.FallbackScene),
  { ssr: false }
);

export default function GalaxySwimPage() {
  // Core state
  const [webglSupported, setWebglSupported] = useState(true);
  const [quality, setQuality] = useState<QualityPreset>('medium');
  const [mode, setMode] = useState<ControlMode>('auto-cruise');
  const [fps, setFps] = useState(60);
  const [speed, setSpeed] = useState(10);
  const [coordinates, setCoordinates] = useState<[number, number, number]>([0, 100, 500]);
  const [cameraState, setCameraState] = useState({
    position: [0, 100, 500] as [number, number, number],
    target: [0, 0, 0] as [number, number, number],
    fov: 75,
  });
  
  // UI state
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [learnMoreHotspot, setLearnMoreHotspot] = useState<Hotspot | null>(null);
  const [showTeleportMenu, setShowTeleportMenu] = useState(false);
  const [scienceOverlayActive, setScienceOverlayActive] = useState(false);
  const [activeOverlays, setActiveOverlays] = useState<ScienceOverlayType[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'info' | 'warning' | 'success'>('info');
  
  // Refs for managers
  const qualityManagerRef = useRef<QualityManager | null>(null);
  const fpsMonitorRef = useRef<FPSMonitor | null>(null);
  const controlsRef = useRef<SwimControls | null>(null);
  
  // Initialize
  useEffect(() => {
    // Check WebGL support
    const supported = detectWebGL();
    setWebglSupported(supported);
    
    // Initialize managers
    const recommendedQuality = QualityManager.detectRecommendedPreset();
    setQuality(recommendedQuality);
    
    qualityManagerRef.current = new QualityManager(recommendedQuality);
    
    fpsMonitorRef.current = new FPSMonitor({
      lowFPSThreshold: 30,
      lowFPSDuration: 5000,
    });
    
    // FPS monitor callbacks
    fpsMonitorRef.current.onLowFPSDetected(() => {
      const newQuality = qualityManagerRef.current?.downgradeQuality();
      if (newQuality) {
        setQuality(newQuality);
        showToast(`Quality downgraded to ${newQuality.toUpperCase()} for better performance`, 'warning');
      } else {
        showToast('Performance issue detected, but already at lowest quality', 'warning');
      }
    });
    
    fpsMonitorRef.current.onFPSUpdate((newFps) => {
      setFps(newFps);
    });
    
    // Initialize controls
    controlsRef.current = new SwimControls();
    
    return () => {
      controlsRef.current?.cleanup();
    };
  }, []);
  
  // Animation loop
  useEffect(() => {
    let animationId: number;
    let lastTime = performance.now();
    
    const animate = () => {
      const now = performance.now();
      const deltaTime = now - lastTime;
      lastTime = now;
      
      // Update FPS monitor
      fpsMonitorRef.current?.update();
      
      // Update controls
      if (controlsRef.current) {
        const newCameraState = controlsRef.current.update(deltaTime);
        setCameraState(newCameraState);
        
        const position = controlsRef.current.getPosition();
        setCoordinates([position.x, position.y, position.z]);
        setSpeed(controlsRef.current.getSpeed());
        
        // Check for nearby hotspots
        checkNearbyHotspots(position.x, position.y, position.z);
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);
  
  // Check for nearby hotspots and science overlays
  const checkNearbyHotspots = useCallback((x: number, y: number, z: number) => {
    const hotspots = hotspotData.hotspots as Hotspot[];
    
    // Find nearest hotspot
    let nearest: Hotspot | null = null;
    let nearestDistance = Infinity;
    
    hotspots.forEach((hotspot) => {
      const dx = x - hotspot.position[0];
      const dy = y - hotspot.position[1];
      const dz = z - hotspot.position[2];
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
      
      if (distance < hotspot.radius && distance < nearestDistance) {
        nearest = hotspot;
        nearestDistance = distance;
      }
    });
    
    // Update active hotspot (for moment card)
    if (nearest && nearest !== activeHotspot) {
      setActiveHotspot(nearest);
    } else if (!nearest && activeHotspot) {
      setActiveHotspot(null);
    }
    
    // Update science overlays (if active)
    if (scienceOverlayActive) {
      const overlays = scienceOverlayData.overlays as ScienceOverlayType[];
      const activeOnes = overlays.filter((overlay) => {
        return overlay.triggerConditions.zones.some((zoneId) => {
          const zone = hotspots.find((h) => h.id === zoneId);
          if (!zone) return false;
          
          const dx = x - zone.position[0];
          const dy = y - zone.position[1];
          const dz = z - zone.position[2];
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
          
          return distance < overlay.triggerConditions.minProximity;
        });
      });
      
      setActiveOverlays(activeOnes);
    } else {
      setActiveOverlays([]);
    }
  }, [activeHotspot, scienceOverlayActive]);
  
  // Handlers
  const handleModeChange = useCallback((newMode: ControlMode) => {
    setMode(newMode);
    controlsRef.current?.setMode(newMode);
    showToast(`Switched to ${newMode === 'auto-cruise' ? 'Auto Cruise' : 'Free Swim'} mode`, 'info');
  }, []);
  
  const handleQualityChange = useCallback((newQuality: QualityPreset) => {
    setQuality(newQuality);
    qualityManagerRef.current?.setPreset(newQuality);
    showToast(`Quality set to ${newQuality.toUpperCase()}`, 'success');
  }, []);
  
  const handleRecenter = useCallback(() => {
    controlsRef.current?.recenter();
    showToast('Position reset', 'info');
  }, []);
  
  const handleTeleport = useCallback(() => {
    setShowTeleportMenu(true);
  }, []);
  
  const handleTeleportTo = useCallback((point: any) => {
    controlsRef.current?.teleportTo(point);
    showToast(`Teleported to ${point.name}`, 'success');
  }, []);
  
  const handleToggleScience = useCallback(() => {
    setScienceOverlayActive((prev) => !prev);
    showToast(
      scienceOverlayActive ? 'Science Mode disabled' : 'Science Mode enabled',
      'info'
    );
  }, [scienceOverlayActive]);
  
  const showToast = useCallback((message: string, type: 'info' | 'warning' | 'success') => {
    setToastMessage(message);
    setToastType(type);
  }, []);
  
  const handleRender = useCallback(() => {
    // Called every frame by the scene
  }, []);
  
  // Get current quality settings
  const currentQualitySettings = qualityManagerRef.current?.getCurrentSettings() || {
    particleCount: 150000,
    nebulaResolution: 1024,
    enableBloom: true,
    enableFog: true,
    shadowQuality: 'low' as const,
    renderScale: 0.85,
  };
  
  return (
    <div className="galaxy-swim-container">
      {/* Main scene */}
      <div className="galaxy-swim-scene">
        {webglSupported ? (
          <GalaxyScene
            quality={currentQualitySettings}
            cameraState={cameraState}
            onRender={handleRender}
          />
        ) : (
          <FallbackScene cameraState={cameraState} onRender={handleRender} />
        )}
      </div>
      
      {/* HUD */}
      <HUD
        fps={fps}
        speed={speed}
        mode={mode}
        quality={quality}
        coordinates={coordinates}
        onModeChange={handleModeChange}
        onQualityChange={handleQualityChange}
        onRecenter={handleRecenter}
        onTeleport={handleTeleport}
        onToggleScience={handleToggleScience}
        scienceOverlayActive={scienceOverlayActive}
      />
      
      {/* Moment card */}
      {activeHotspot && (
        <MomentCard
          hotspot={activeHotspot}
          onLearnMore={setLearnMoreHotspot}
          onClose={() => setActiveHotspot(null)}
        />
      )}
      
      {/* Learn more modal */}
      <LearnMoreModal
        hotspot={learnMoreHotspot}
        onClose={() => setLearnMoreHotspot(null)}
      />
      
      {/* Teleport menu */}
      {showTeleportMenu && (
        <TeleportMenu
          points={SwimControls.getTeleportPoints()}
          onTeleport={handleTeleportTo}
          onClose={() => setShowTeleportMenu(false)}
        />
      )}
      
      {/* Science overlay */}
      <ScienceOverlay overlays={activeOverlays} active={scienceOverlayActive} />
      
      {/* Toast notifications */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
}
