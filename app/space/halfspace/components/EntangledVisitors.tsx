'use client';

import { useState, useEffect, useRef } from 'react';
import { useHalfspaceStore } from '../store/halfspaceStore';

export default function EntangledVisitors() {
  const [isEntangled, setIsEntangled] = useState(false);
  const [partnerCursor, setPartnerCursor] = useState<{ x: number, y: number } | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [pulses, setPulses] = useState<Array<{ x: number, y: number, id: number }>>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { visitorId } = useHalfspaceStore();

  useEffect(() => {
    // Simulate entanglement detection
    // In production, this would use WebSockets to detect simultaneous visitors
    const checkInterval = setInterval(() => {
      const isAloneNow = Math.random() > 0.7; // 30% chance of entanglement
      
      if (isAloneNow !== isEntangled) {
        setIsEntangled(!isAloneNow);
        
        if (!isAloneNow) {
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 5000);
        }
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(checkInterval);
  }, [isEntangled]);

  // Track local cursor and simulate partner cursor
  useEffect(() => {
    if (!isEntangled) {
      setPartnerCursor(null);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      // In production, send to WebSocket server
      // For now, simulate a delayed, slightly offset partner cursor
      setTimeout(() => {
        setPartnerCursor({
          x: e.clientX + (Math.random() - 0.5) * 100,
          y: e.clientY + (Math.random() - 0.5) * 100
        });
      }, 200 + Math.random() * 300);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isEntangled]);

  // Handle click to send light pulse
  useEffect(() => {
    if (!isEntangled) return;

    const handleClick = (e: MouseEvent) => {
      const newPulse = {
        x: e.clientX,
        y: e.clientY,
        id: Date.now()
      };
      
      setPulses(prev => [...prev, newPulse]);
      
      // Remove pulse after animation
      setTimeout(() => {
        setPulses(prev => prev.filter(p => p.id !== newPulse.id));
      }, 2000);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [isEntangled]);

  // Draw connection line
  useEffect(() => {
    if (!isEntangled || !partnerCursor || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw subtle line to partner cursor (from screen center)
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(partnerCursor.x, partnerCursor.y);
    ctx.strokeStyle = 'rgba(100, 200, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }, [isEntangled, partnerCursor]);

  return (
    <>
      <canvas 
        ref={canvasRef} 
        className="entanglement-canvas"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 1000
        }}
      />

      {isEntangled && (
        <>
          {/* Partner cursor trail */}
          {partnerCursor && (
            <div 
              className="partner-cursor"
              style={{
                position: 'fixed',
                left: partnerCursor.x,
                top: partnerCursor.y,
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: 'rgba(100, 200, 255, 0.3)',
                border: '2px solid rgba(100, 200, 255, 0.6)',
                pointerEvents: 'none',
                transform: 'translate(-50%, -50%)',
                zIndex: 10000,
                boxShadow: '0 0 20px rgba(100, 200, 255, 0.8)'
              }}
            />
          )}

          {/* Light pulses */}
          {pulses.map(pulse => (
            <div
              key={pulse.id}
              className="light-pulse"
              style={{
                position: 'fixed',
                left: pulse.x,
                top: pulse.y,
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#00ffff',
                pointerEvents: 'none',
                transform: 'translate(-50%, -50%)',
                zIndex: 10001,
                animation: 'pulse-expand 2s ease-out forwards'
              }}
            />
          ))}

          {/* Entanglement indicator */}
          <div className="entanglement-indicator">
            <div className="indicator-icon">🔗</div>
            <p className="indicator-text">Quantum Entangled</p>
            <p className="indicator-hint">Click to send light pulses</p>
          </div>
        </>
      )}

      {/* Notification */}
      {showNotification && (
        <div className="entanglement-notification fade-in">
          <h3>⚛️ Quantum Entanglement Detected</h3>
          <p>You are not alone in the void.</p>
          <p className="whisper">Another consciousness shares this space with you.</p>
          <p className="hint">You see their cursor's ghost. They see yours.</p>
        </div>
      )}
    </>
  );
}
