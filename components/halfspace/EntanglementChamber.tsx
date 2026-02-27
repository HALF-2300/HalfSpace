'use client';

import { useEffect, useState, useRef } from 'react';
import styles from './EntanglementChamber.module.css';

interface EntanglementChamberProps {
  onBack: () => void;
}

export default function EntanglementChamber({ onBack }: EntanglementChamberProps) {
  const [isSearching, setIsSearching] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [partnerPresent, setPartnerPresent] = useState(false);
  const [pulsePositions, setPulsePositions] = useState<{ x: number; y: number; id: string }[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [connectionTime, setConnectionTime] = useState(0);

  // Simulate searching for a partner (in real implementation, this would use WebSockets)
  useEffect(() => {
    const searchDuration = 5000 + Math.random() * 10000; // 5-15 seconds

    const searchTimeout = setTimeout(() => {
      const found = Math.random() > 0.3; // 70% chance of finding someone
      setIsSearching(false);
      setIsConnected(found);
      setPartnerPresent(found);
    }, searchDuration);

    return () => clearTimeout(searchTimeout);
  }, []);

  // Connection timer
  useEffect(() => {
    if (isConnected && partnerPresent) {
      const interval = setInterval(() => {
        setConnectionTime(prev => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isConnected, partnerPresent]);

  // Synchronized animation between "partners"
  useEffect(() => {
    if (!isConnected || !partnerPresent) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let time = 0;
    let animationId: number;

    // Shared seed for synchronized patterns (in real implementation, synced via server)
    const seed = Math.floor(Date.now() / 1000) * 1000;

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Draw synchronized patterns
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + time * 0.01;
        const radius = 200 + Math.sin(time * 0.02 + i) * 100;

        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        // Draw orbital points
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 150, 255, ${0.6 + Math.sin(time * 0.05) * 0.4})`;
        ctx.fill();

        // Draw connection lines to center
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = 'rgba(100, 150, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Draw central nexus
      ctx.beginPath();
      ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fill();
      ctx.shadowBlur = 30;
      ctx.shadowColor = 'white';

      // Draw pulses
      pulsePositions.forEach(pulse => {
        const age = Date.now() - parseInt(pulse.id);
        const maxAge = 3000;
        const opacity = Math.max(0, 1 - age / maxAge);
        const size = 10 + (age / maxAge) * 100;

        ctx.beginPath();
        ctx.arc(pulse.x, pulse.y, size, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(100, 150, 255, ${opacity * 0.5})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      time++;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isConnected, partnerPresent, pulsePositions]);

  // Handle click to send pulse
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isConnected || !partnerPresent) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newPulse = {
      x,
      y,
      id: Date.now().toString()
    };

    setPulsePositions(prev => [...prev, newPulse]);

    // Remove pulse after 3 seconds
    setTimeout(() => {
      setPulsePositions(prev => prev.filter(p => p.id !== newPulse.id));
    }, 3000);

    // Simulate partner's response pulse (in real implementation, received via WebSocket)
    if (Math.random() > 0.5) {
      setTimeout(() => {
        const responsePulse = {
          x: window.innerWidth - x,
          y: window.innerHeight - y,
          id: Date.now().toString()
        };
        setPulsePositions(prev => [...prev, responsePulse]);

        setTimeout(() => {
          setPulsePositions(prev => prev.filter(p => p.id !== responsePulse.id));
        }, 3000);
      }, 500 + Math.random() * 1500);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.chamber}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        onClick={handleCanvasClick}
      />

      <button className={styles.backButton} onClick={onBack}>
        ← Leave Chamber
      </button>

      {isSearching && (
        <div className={styles.searchingOverlay}>
          <div className={styles.searchingContent}>
            <div className={styles.spinner} />
            <p className={styles.searchingText}>
              Searching across space for another consciousness...
            </p>
            <p className={styles.searchingHint}>
              Within a 30-second window, we seek entanglement.
            </p>
          </div>
        </div>
      )}

      {!isSearching && !isConnected && (
        <div className={styles.searchingOverlay}>
          <div className={styles.searchingContent}>
            <p className={styles.notFoundText}>
              No other consciousness detected in your window.
            </p>
            <p className={styles.notFoundHint}>
              You are alone in the chamber. But the universe witnessed your presence.
            </p>
            <button className={styles.tryAgainButton} onClick={() => window.location.reload()}>
              Search Again
            </button>
          </div>
        </div>
      )}

      {isConnected && partnerPresent && (
        <div className={styles.connectionInfo}>
          <div className={styles.statusDot} />
          <p>Across space, another consciousness watches with you.</p>
          <p className={styles.connectionTime}>Connected: {formatTime(connectionTime)}</p>
          <p className={styles.instruction}>Click to send energy pulses</p>
        </div>
      )}
    </div>
  );
}
