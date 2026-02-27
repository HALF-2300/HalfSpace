'use client';

import React, { useEffect, useMemo, useRef } from 'react';

type Star = {
  x: number;
  y: number;
  z: number;     // depth (0..1)
  r: number;     // radius
  vx: number;
  vy: number;
  tw: number;    // twinkle phase
};

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
}

export default function Starfield({
  density = 0.00016, // stars per px^2 (auto scales with size)
  maxLinks = 70,     // cap for line links to avoid heavy draw
  onStarClick,
}: {
  density?: number;
  maxLinks?: number;
  onStarClick?: (x: number, y: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const pointer = useMemo(() => ({ x: 0, y: 0, active: false }), []);
  const ripple = useMemo(() => ({ x: 0, y: 0, t: 9999 }), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let stars: Star[] = [];
    let w = 0;
    let h = 0;
    let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const reduced = prefersReducedMotion();

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const n = Math.max(80, Math.floor(w * h * density));
      stars = new Array(n).fill(0).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random(), // depth
        r: 0.4 + Math.random() * 1.6,
        vx: (Math.random() - 0.5) * (0.08 + Math.random() * 0.18),
        vy: (Math.random() - 0.5) * (0.08 + Math.random() * 0.18),
        tw: Math.random() * Math.PI * 2,
      }));
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };
    const onLeave = () => { pointer.active = false; };
    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      ripple.x = e.clientX - rect.left;
      ripple.y = e.clientY - rect.top;
      ripple.t = 0;
      
      // Call callback if provided
      onStarClick?.(ripple.x, ripple.y);
    };

    const step = () => {
      rafRef.current = window.requestAnimationFrame(step);

      ctx.clearRect(0, 0, w, h);

      // subtle space haze
      const g = ctx.createRadialGradient(w * 0.5, h * 0.45, 40, w * 0.5, h * 0.45, Math.max(w, h) * 0.7);
      g.addColorStop(0, 'rgba(120, 160, 255, 0.10)');
      g.addColorStop(0.4, 'rgba(80, 120, 255, 0.06)');
      g.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // ripple pulse (on click)
      if (ripple.t < 240) {
        ripple.t += reduced ? 6 : 3;
        const R = ripple.t * 2.2;
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, R, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(180, 210, 255, ${Math.max(0, 0.25 - ripple.t / 700)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // update + draw stars
      for (const s of stars) {
        // parallax: deeper stars move slower
        const speedScale = 0.35 + (1 - s.z) * 0.9;

        // pointer influence (gentle)
        if (pointer.active && !reduced) {
          const dx = s.x - pointer.x;
          const dy = s.y - pointer.y;
          const dist2 = dx * dx + dy * dy;
          const influence = Math.max(0, 1 - dist2 / (220 * 220));
          // slight repulsion
          s.vx += (dx / (Math.sqrt(dist2) + 0.001)) * influence * 0.02;
          s.vy += (dy / (Math.sqrt(dist2) + 0.001)) * influence * 0.02;
        }

        s.x += s.vx * speedScale;
        s.y += s.vy * speedScale;

        // wrap
        if (s.x < -20) s.x = w + 20;
        if (s.x > w + 20) s.x = -20;
        if (s.y < -20) s.y = h + 20;
        if (s.y > h + 20) s.y = -20;

        // twinkle
        s.tw += reduced ? 0.01 : 0.02;
        const tw = 0.65 + Math.sin(s.tw) * 0.35;

        const alpha = (0.25 + (1 - s.z) * 0.55) * tw;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * (0.8 + (1 - s.z) * 0.8), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(235, 245, 255, ${alpha.toFixed(3)})`;
        ctx.fill();
      }

      // link lines between nearest stars (capped)
      const sampleCount = Math.min(220, stars.length);
      let links = 0;

      for (let i = 0; i < sampleCount && links < maxLinks; i++) {
        const a = stars[(i * 13) % stars.length];
        for (let j = i + 1; j < sampleCount && links < maxLinks; j++) {
          const b = stars[(j * 17) % stars.length];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist2 = dx * dx + dy * dy;
          const maxD = 140;
          if (dist2 < maxD * maxD) {
            const t = 1 - Math.sqrt(dist2) / maxD;
            ctx.strokeStyle = `rgba(170, 210, 255, ${(t * 0.10).toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
            links++;
          }
        }
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave, { passive: true });
    window.addEventListener('click', onClick, { passive: true });

    // If reduced motion: draw once, no animation loop
    if (reduced) {
      step();
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    } else {
      rafRef.current = window.requestAnimationFrame(step);
    }

    return () => {
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('click', onClick);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [density, maxLinks, pointer, ripple, onStarClick]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
      }}
      aria-hidden="true"
    />
  );
}
