'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import './entry.css';

export default function HalfSpaceEntry() {
  const [phase, setPhase] = useState<'void' | 'awakening' | 'manifest' | 'ready'>('void');
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [audioUnavailable, setAudioUnavailable] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const router = useRouter();

  // Set page title
  useEffect(() => {
    document.title = 'HalfSpace - Look at the universe as if it\'s looking back at you';
  }, []);

  useEffect(() => {
    // Phase 1: Void (2 seconds)
    const timer1 = setTimeout(() => setPhase('awakening'), 2000);
    
    // Phase 2: Awakening (4 seconds)
    const timer2 = setTimeout(() => setPhase('manifest'), 6000);
    
    // Phase 3: Manifest (ready for entry)
    const timer3 = setTimeout(() => setPhase('ready'), 10000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Star field configuration
    const stars: Array<{
      x: number;
      y: number;
      z: number;
      prevX?: number;
      prevY?: number;
    }> = [];
    
    const numStars = 800;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Initialize stars
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: (Math.random() - 0.5) * canvas.width,
        y: (Math.random() - 0.5) * canvas.height,
        z: Math.random() * canvas.width,
      });
    }

    let speed = phase === 'void' ? 0.1 : phase === 'awakening' ? 0.5 : 1.5;

    function animate() {
      if (!ctx || !canvas) return;

      // Adjust speed based on phase
      if (phase === 'void') speed = 0.1;
      else if (phase === 'awakening') speed = Math.min(speed + 0.01, 1);
      else if (phase === 'manifest') speed = Math.min(speed + 0.02, 2);
      else if (phase === 'ready') speed = Math.min(speed + 0.01, 1.5);

      // Fade trail effect
      ctx.fillStyle = 'rgba(0, 0, 5, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (const star of stars) {
        // Save previous position
        star.prevX = star.x;
        star.prevY = star.y;

        // Move star
        star.z -= speed;
        
        // Reset star if it goes behind camera
        if (star.z <= 0) {
          star.z = canvas.width;
          star.x = (Math.random() - 0.5) * canvas.width;
          star.y = (Math.random() - 0.5) * canvas.height;
          star.prevX = undefined;
          star.prevY = undefined;
        }

        // Project 3D to 2D
        const k = 200 / star.z;
        const px = star.x * k + centerX;
        const py = star.y * k + centerY;

        // Calculate size based on depth
        const size = (1 - star.z / canvas.width) * 3;
        const alpha = Math.min(1 - star.z / canvas.width, 0.8);

        // Enhanced star rendering with glow
        const gradient = ctx.createRadialGradient(px, py, 0, px, py, size * 2);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
        gradient.addColorStop(0.3, `rgba(200, 220, 255, ${alpha * 0.8})`);
        gradient.addColorStop(0.6, `rgba(150, 180, 255, ${alpha * 0.4})`);
        gradient.addColorStop(1, `rgba(100, 150, 255, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(px, py, size * 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner bright core
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 1.2})`;
        ctx.beginPath();
        ctx.arc(px, py, size * 0.6, 0, Math.PI * 2);
        ctx.fill();

        // Draw motion trail for faster stars with glow
        if (star.prevX !== undefined && star.prevY !== undefined && speed > 0.5) {
          const prevK = 200 / (star.z + speed);
          const prevPx = star.prevX * prevK + centerX;
          const prevPy = star.prevY * prevK + centerY;

          // Gradient trail
          const trailGradient = ctx.createLinearGradient(prevPx, prevPy, px, py);
          trailGradient.addColorStop(0, `rgba(150, 200, 255, ${alpha * 0.4})`);
          trailGradient.addColorStop(0.5, `rgba(118, 175, 255, ${alpha * 0.6})`);
          trailGradient.addColorStop(1, `rgba(79, 172, 254, ${alpha * 0.3})`);
          
          ctx.strokeStyle = trailGradient;
          ctx.lineWidth = size * 0.8;
          ctx.lineCap = 'round';
          ctx.shadowBlur = size * 2;
          ctx.shadowColor = `rgba(150, 200, 255, ${alpha * 0.5})`;
          ctx.beginPath();
          ctx.moveTo(prevPx, prevPy);
          ctx.lineTo(px, py);
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      }

      requestAnimationFrame(animate);
    }

    animate();

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [phase]);

  const enableAudio = () => {
    const el = audioRef.current;
    if (!el || audioEnabled || audioUnavailable) return;

    // Optional audio: if the file is missing/blocked, fail silently and disable.
    el.onerror = () => {
      setAudioUnavailable(true);
      setAudioEnabled(false);
      try {
        el.removeAttribute('src');
        el.load();
      } catch {}
    };

    if (!el.src) {
      el.src = '/audio/cosmic-ambient.mp3';
      el.load();
    }

    el.play()
      .then(() => setAudioEnabled(true))
      .catch(() => {
        setAudioUnavailable(true);
        setAudioEnabled(false);
      });
  };

  const enterHalfSpace = () => {
    enableAudio();
    setTimeout(() => {
      router.push('/space/halfspace');
    }, 1000);
  };

  return (
    <div className="halfspace-entry">
      <canvas ref={canvasRef} className="universe-canvas" />
      
      {/* Audio element */}
      <audio 
        ref={audioRef} 
        loop 
        preload="none"
      >
      </audio>

      {/* Central light expanding */}
      {phase !== 'void' && (
        <div className={`central-light phase-${phase}`} />
      )}

      {/* Main content */}
      <div className={`entry-content phase-${phase}`}>
        {phase === 'awakening' && (
          <div className="awakening-pulse">
            <div className="pulse-ring" />
            <div className="pulse-ring delay-1" />
            <div className="pulse-ring delay-2" />
          </div>
        )}

        {(phase === 'manifest' || phase === 'ready') && (
          <>
            <div className="title-wrapper">
              <h1 className="main-title">
                <span className="title-half shimmer-text">Half</span>
                <span className="title-space shimmer-text">Space</span>
              </h1>
              <div className="title-reflection" aria-hidden="true">
                <span className="title-half">Half</span>
                <span className="title-space">Space</span>
              </div>
            </div>
            
            <p className="tagline arabic">
              انظر إلى الكون كما لو كان ينظر إليك
            </p>
            
            <p className="tagline english">
              Look at the universe as if it's looking back at you
            </p>

            {phase === 'ready' && (
              <>
                <button 
                  className="enter-button"
                  onClick={enterHalfSpace}
                >
                  <span className="button-text">ادخل الفضاء</span>
                  <span className="button-glow" />
                </button>

                {!audioEnabled && (
                  <p className="audio-hint">
                    🔊 انقر لتفعيل الصوت • Click to enable sound
                  </p>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Shimmer overlay */}
      {phase === 'ready' && (
        <div className="shimmer-overlay" />
      )}

      {/* Floating particles */}
      {phase === 'ready' && (
        <div className="floating-particles">
          {[...Array(30)].map((_, i) => (
            <div 
              key={i} 
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${15 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Ambient glow rings */}
      {phase === 'ready' && (
        <>
          <div className="glow-ring ring-1" />
          <div className="glow-ring ring-2" />
          <div className="glow-ring ring-3" />
        </>
      )}

      {/* Bottom hint */}
      {phase === 'ready' && (
        <div className="scroll-hint">
          <span className="hint-text">Scroll to explore • مرر للاستكشاف</span>
          <div className="hint-arrow">↓</div>
        </div>
      )}
    </div>
  );
}
