'use client';

import { useEffect, useState, useRef } from 'react';
import styles from './TheOrigin.module.css';

interface TheOriginProps {
  onBack: () => void;
}

export default function TheOrigin({ onBack }: TheOriginProps) {
  const [phase, setPhase] = useState<'singularity' | 'expansion' | 'particles' | 'atoms' | 'present'>('singularity');
  const [timeFromBigBang, setTimeFromBigBang] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const sequence = async () => {
      await sleep(3000);
      setPhase('expansion');
      await sleep(4000);
      setPhase('particles');
      await sleep(4000);
      setPhase('atoms');
      await sleep(4000);
      setPhase('present');
    };

    sequence();
  }, []);

  // Animate Big Bang
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let time = 0;
    let animationId: number;

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      if (phase === 'singularity') {
        // Single point
        ctx.beginPath();
        ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.shadowBlur = 50;
        ctx.shadowColor = 'white';
      } else if (phase === 'expansion') {
        // Expanding energy
        const radius = time * 5;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${Math.max(0, 1 - time * 0.01)})`;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Create multiple expanding rings
        for (let i = 0; i < 5; i++) {
          const r = radius - i * 50;
          if (r > 0) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 200, 100, ${Math.max(0, 0.5 - i * 0.1)})`;
            ctx.stroke();
          }
        }
      } else if (phase === 'particles') {
        // Particle soup
        for (let i = 0; i < 200; i++) {
          const angle = (i / 200) * Math.PI * 2;
          const distance = Math.random() * 300 + time * 2;
          const x = centerX + Math.cos(angle + time * 0.01) * distance;
          const y = centerY + Math.sin(angle + time * 0.01) * distance;

          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fillStyle = `hsl(${i * 2}, 100%, 50%)`;
          ctx.fill();
        }
      } else if (phase === 'atoms') {
        // Forming structures
        for (let i = 0; i < 10; i++) {
          for (let j = 0; j < 10; j++) {
            const x = (i / 10) * canvas.width + Math.sin(time * 0.02 + i) * 20;
            const y = (j / 10) * canvas.height + Math.cos(time * 0.02 + j) * 20;
            
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(100, 150, 255, 0.6)`;
            ctx.fill();
          }
        }
      } else if (phase === 'present') {
        // Complex patterns
        for (let i = 0; i < 50; i++) {
          const angle = (i / 50) * Math.PI * 2;
          const distance = 200 + Math.sin(time * 0.05 + i) * 100;
          const x = centerX + Math.cos(angle) * distance;
          const y = centerY + Math.sin(angle) * distance;

          ctx.beginPath();
          ctx.arc(x, y, 5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, 0.8)`;
          ctx.fill();

          // Connect nearby points
          for (let k = i + 1; k < Math.min(i + 3, 50); k++) {
            const angle2 = (k / 50) * Math.PI * 2;
            const distance2 = 200 + Math.sin(time * 0.05 + k) * 100;
            const x2 = centerX + Math.cos(angle2) * distance2;
            const y2 = centerY + Math.sin(angle2) * distance2;

            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.stroke();
          }
        }
      }

      time++;
      setTimeFromBigBang(time);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [phase]);

  const getPhaseDescription = () => {
    switch (phase) {
      case 'singularity':
        return {
          title: 'The Singularity',
          time: 't = 0',
          description: 'All energy, all matter, all space-time compressed into a point smaller than an atom. Infinity contained in nothing.'
        };
      case 'expansion':
        return {
          title: 'Inflation',
          time: 't = 10⁻³⁶ seconds',
          description: 'The universe doubles in size every 10⁻³⁴ seconds. Space itself expands faster than light. The impossible becomes inevitable.'
        };
      case 'particles':
        return {
          title: 'Particle Formation',
          time: 't = 10⁻⁶ seconds',
          description: 'Quarks and leptons emerge from the quantum foam. The first building blocks of reality crystallize from pure energy.'
        };
      case 'atoms':
        return {
          title: 'Nuclear Fusion',
          time: 't = 3 minutes',
          description: 'Protons and neutrons bind together. Hydrogen, helium, lithium. The periodic table begins its story.'
        };
      case 'present':
        return {
          title: 'The Present',
          time: 't = 13.8 billion years',
          description: 'Stars ignite. Galaxies form. Life emerges. Consciousness observes itself. You are here, witnessing your own origin.'
        };
    }
  };

  const info = getPhaseDescription();

  return (
    <div className={styles.origin}>
      <canvas ref={canvasRef} className={styles.canvas} />
      
      <div className={styles.info}>
        <h1 className={styles.title}>{info.title}</h1>
        <p className={styles.time}>{info.time}</p>
        <p className={styles.description}>{info.description}</p>
        <div className={styles.progress}>
          <div 
            className={styles.progressBar}
            style={{ width: `${(timeFromBigBang / 200) * 100}%` }}
          />
        </div>
      </div>

      <button className={styles.backButton} onClick={onBack}>
        ← Return to HalfSpace
      </button>

      <div className={styles.philosophicalNote}>
        "The universe is not only stranger than we imagine, it is stranger than we can imagine."
        <span className={styles.author}>— J.B.S. Haldane</span>
      </div>
    </div>
  );
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
