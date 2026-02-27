'use client';

import React, { useEffect, useRef } from 'react';
import { CameraState } from '../engine/types';

interface FallbackSceneProps {
  cameraState: CameraState;
  onRender?: () => void;
}

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

export const FallbackScene: React.FC<FallbackSceneProps> = ({
  cameraState,
  onRender,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationRef = useRef<number>();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create stars
    if (starsRef.current.length === 0) {
      for (let i = 0; i < 2000; i++) {
        starsRef.current.push({
          x: (Math.random() - 0.5) * 2000,
          y: (Math.random() - 0.5) * 1000,
          z: (Math.random() - 0.5) * 2000,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.5 + 0.5,
          twinkleSpeed: Math.random() * 0.02 + 0.01,
          twinkleOffset: Math.random() * Math.PI * 2,
        });
      }
    }
    
    let time = 0;
    
    // Animation loop
    const animate = () => {
      time += 0.016;
      
      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(0, 5, 16, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw stars
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      starsRef.current.forEach((star) => {
        // Simple 3D projection
        const scale = 1000 / (1000 + star.z);
        const x = centerX + star.x * scale;
        const y = centerY + star.y * scale;
        
        if (x < 0 || x > canvas.width || y < 0 || y > canvas.height) return;
        
        // Twinkle effect
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
        const opacity = star.opacity + twinkle * 0.2;
        
        // Color based on depth
        const brightness = Math.floor((1 - star.z / 1000) * 255);
        ctx.fillStyle = `rgba(${brightness}, ${brightness}, 255, ${opacity})`;
        
        ctx.beginPath();
        ctx.arc(x, y, star.size * scale, 0, Math.PI * 2);
        ctx.fill();
        
        // Move stars slightly based on camera
        star.x += (cameraState.position[0] - star.x) * 0.0001;
        star.y += (cameraState.position[1] - star.y) * 0.0001;
      });
      
      // Draw galaxy core (simple gradient)
      const coreGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        200
      );
      coreGradient.addColorStop(0, 'rgba(255, 200, 100, 0.3)');
      coreGradient.addColorStop(0.5, 'rgba(100, 150, 255, 0.1)');
      coreGradient.addColorStop(1, 'rgba(0, 5, 16, 0)');
      
      ctx.fillStyle = coreGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw spiral arms (simple arcs)
      ctx.strokeStyle = 'rgba(150, 180, 255, 0.1)';
      ctx.lineWidth = 40;
      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2 + time * 0.1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 150 + i * 50, angle, angle + Math.PI * 0.5);
        ctx.stroke();
      }
      
      if (onRender) {
        onRender();
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [cameraState, onRender]);
  
  return (
    <div className="fallback-scene-container">
      <canvas ref={canvasRef} className="fallback-scene-canvas" />
      <div className="fallback-scene-notice">
        <p>WebGL not available - Running in 2D fallback mode</p>
        <p className="fallback-scene-notice-subtitle">
          For the full experience, please use a WebGL-compatible browser
        </p>
      </div>
    </div>
  );
};
