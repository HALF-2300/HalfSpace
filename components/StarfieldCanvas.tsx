'use client';

import React, { useEffect, useRef } from 'react';

type Star = { x: number; y: number; z: number; r: number; vx: number; vy: number };

export default function StarfieldCanvas() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const mouse = useRef({ x: 0, y: 0, has: false });

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0, h = 0, dpr = 1;
    const stars: Star[] = [];
    const STAR_COUNT = 220;

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      stars.length = 0;
      for (let i = 0; i < STAR_COUNT; i++) {
        const z = rand(0.25, 1);
        stars.push({
          x: rand(0, w),
          y: rand(0, h),
          z,
          r: rand(0.6, 1.9) * z,
          vx: rand(-0.05, 0.05) * z,
          vy: rand(-0.035, 0.035) * z,
        });
      }
    };

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY, has: true };
    };
    const onLeave = () => {
      mouse.current.has = false;
    };

    const onResize = () => {
      resize();
      seed();
    };

    resize();
    seed();

    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);

    let raf = 0;

    const step = () => {
      raf = requestAnimationFrame(step);
      ctx.clearRect(0, 0, w, h);

      // subtle vignette glow
      const g = ctx.createRadialGradient(w * 0.5, h * 0.55, 0, w * 0.5, h * 0.55, Math.max(w, h) * 0.75);
      g.addColorStop(0, 'rgba(20, 40, 90, 0.18)');
      g.addColorStop(1, 'rgba(0, 0, 0, 0.0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      const mx = mouse.current.has ? mouse.current.x : w * 0.5;
      const my = mouse.current.has ? mouse.current.y : h * 0.5;

      // stars
      for (const s of stars) {
        s.x += s.vx;
        s.y += s.vy;

        if (s.x < -10) s.x = w + 10;
        if (s.x > w + 10) s.x = -10;
        if (s.y < -10) s.y = h + 10;
        if (s.y > h + 10) s.y = -10;

        const px = (mx - w * 0.5) * (0.012 * s.z);
        const py = (my - h * 0.5) * (0.012 * s.z);

        const x = s.x - px;
        const y = s.y - py;

        ctx.beginPath();
        ctx.fillStyle = `rgba(190, 220, 255, ${0.35 * s.z})`;
        ctx.arc(x, y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // constellation lines
      const THRESH = 90;
      for (let i = 0; i < stars.length; i++) {
        const a = stars[i];
        const ax = a.x - (mx - w * 0.5) * (0.012 * a.z);
        const ay = a.y - (my - h * 0.5) * (0.012 * a.z);

        for (let j = i + 1; j < stars.length; j++) {
          const b = stars[j];
          const bx = b.x - (mx - w * 0.5) * (0.012 * b.z);
          const by = b.y - (my - h * 0.5) * (0.012 * b.z);

          const dist = Math.hypot(ax - bx, ay - by);
          if (dist < THRESH) {
            const alpha = (1 - dist / THRESH) * 0.22 * Math.min(a.z, b.z);
            ctx.strokeStyle = `rgba(140, 190, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(bx, by);
            ctx.stroke();
          }
        }
      }
    };

    step();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
