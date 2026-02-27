'use client';

import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
}

interface StarfieldProps {
  density?: number;
  maxLinks?: number;
  onStarClick?: () => void;
  className?: string;
}

/**
 * High-performance starfield with constellation links
 * Optimized with FPS cap and visibility detection
 */
export default function Starfield({
  density = 0.00016,
  maxLinks = 70,
  onStarClick,
  className = ''
}: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>();
  const starsRef = useRef<Star[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Set canvas size
    const updateSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    updateSize();

    const w = canvas.width;
    const h = canvas.height;

    // Generate stars based on density
    const numStars = Math.floor(w * h * density);
    const stars: Star[] = [];

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random() * 1000,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2
      });
    }

    starsRef.current = stars;

    // Performance optimization: FPS cap
    let last = 0;
    const FPS = 45;
    const MIN_DT = 1000 / FPS;

    // Animation loop with throttling
    const step = (ts: number) => {
      rafRef.current = window.requestAnimationFrame(step);

      // Throttle to target FPS
      if (ts - last < MIN_DT) return;
      last = ts;

      // Stop drawing when tab is hidden
      if (document.hidden) return;

      // Clear canvas
      ctx.clearRect(0, 0, w, h);

      // Draw stars
      stars.forEach((star) => {
        // Update position
        star.x += star.vx;
        star.y += star.vy;

        // Wrap around edges
        if (star.x < 0) star.x = w;
        if (star.x > w) star.x = 0;
        if (star.y < 0) star.y = h;
        if (star.y > h) star.y = 0;

        // Calculate size and opacity based on depth
        const scale = 1000 / (star.z + 1000);
        const size = scale * 2;
        const opacity = Math.min(1, scale * 2);

        // Draw star
        ctx.beginPath();
        ctx.arc(star.x, star.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
      });

      // Draw constellation links
      let linkCount = 0;
      for (let i = 0; i < stars.length && linkCount < maxLinks; i++) {
        for (let j = i + 1; j < stars.length && linkCount < maxLinks; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            const opacity = (1 - dist / 150) * 0.15;
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
            linkCount++;
          }
        }
      }
    };

    // Start animation
    rafRef.current = window.requestAnimationFrame(step);

    // Handle resize
    const onResize = () => {
      updateSize();
    };

    // Handle visibility change (reset last timestamp)
    const onVis = () => {
      last = 0;
    };

    // Handle clicks
    const onClick = (e: MouseEvent) => {
      if (onStarClick) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Check if clicked near a star
        for (const star of stars) {
          const dx = x - star.x;
          const dy = y - star.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 10) {
            onStarClick();
            break;
          }
        }
      }
    };

    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVis);
    canvas.addEventListener('click', onClick);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVis);
      canvas.removeEventListener('click', onClick);
    };
  }, [density, maxLinks, onStarClick]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 -z-10 ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
