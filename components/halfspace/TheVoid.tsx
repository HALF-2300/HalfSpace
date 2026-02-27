'use client';

import { useEffect, useState, useRef } from 'react';
import styles from './TheVoid.module.css';

interface TheVoidProps {
  onBack: () => void;
}

interface FloatingObject {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  shape: 'circle' | 'square' | 'triangle' | 'text';
  text?: string;
  rotation: number;
  rotationSpeed: number;
}

export default function TheVoid({ onBack }: TheVoidProps) {
  const [objects, setObjects] = useState<FloatingObject[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [voidPhrase, setVoidPhrase] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Generate surreal floating objects
  useEffect(() => {
    const newObjects: FloatingObject[] = [];
    const phrases = [
      'nothing',
      'everything',
      '?',
      'void',
      'existence',
      '∞',
      '0',
      '1',
      'here',
      'nowhere',
      'always',
      'never',
      'is',
      'isn\'t'
    ];

    for (let i = 0; i < 30; i++) {
      newObjects.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 40 + 20,
        shape: Math.random() > 0.7 ? 'text' : ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)] as any,
        text: phrases[Math.floor(Math.random() * phrases.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02
      });
    }

    setObjects(newObjects);
  }, []);

  // Random void phrases that appear
  useEffect(() => {
    const phrases = [
      'You call it a black hole. But what if it\'s a seed, not a grave?',
      'The void is not empty. It is full of potential.',
      'Nothing exists here. Everything is possible here.',
      'What if absence is the truest form of presence?',
      'You are drifting through the space between thoughts.',
      'This is where ideas go before they become real.',
      'The void does not judge. It simply waits.'
    ];

    const showPhrase = () => {
      setVoidPhrase(phrases[Math.floor(Math.random() * phrases.length)]);
      setTimeout(() => setVoidPhrase(''), 5000);
    };

    showPhrase();
    const interval = setInterval(showPhrase, 15000);

    return () => clearInterval(interval);
  }, []);

  // Animate objects
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw objects
      setObjects(prevObjects => {
        return prevObjects.map(obj => {
          const newObj = { ...obj };

          // Update position
          newObj.x += newObj.vx;
          newObj.y += newObj.vy;

          // Wrap around edges
          if (newObj.x < -100) newObj.x = canvas.width + 100;
          if (newObj.x > canvas.width + 100) newObj.x = -100;
          if (newObj.y < -100) newObj.y = canvas.height + 100;
          if (newObj.y > canvas.height + 100) newObj.y = -100;

          // Update rotation
          newObj.rotation += newObj.rotationSpeed;

          // Mouse interaction - objects avoid mouse
          const dx = newObj.x - mousePos.x;
          const dy = newObj.y - mousePos.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            const force = (150 - distance) / 150;
            newObj.vx += (dx / distance) * force * 0.1;
            newObj.vy += (dy / distance) * force * 0.1;
          }

          // Friction
          newObj.vx *= 0.99;
          newObj.vy *= 0.99;

          // Draw object
          ctx.save();
          ctx.translate(newObj.x, newObj.y);
          ctx.rotate(newObj.rotation);

          const alpha = Math.min(1, Math.max(0.2, 1 - distance / 300));

          if (newObj.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, newObj.size / 2, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.6})`;
            ctx.lineWidth = 2;
            ctx.stroke();
          } else if (newObj.shape === 'square') {
            ctx.beginPath();
            ctx.rect(-newObj.size / 2, -newObj.size / 2, newObj.size, newObj.size);
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.6})`;
            ctx.lineWidth = 2;
            ctx.stroke();
          } else if (newObj.shape === 'triangle') {
            ctx.beginPath();
            ctx.moveTo(0, -newObj.size / 2);
            ctx.lineTo(-newObj.size / 2, newObj.size / 2);
            ctx.lineTo(newObj.size / 2, newObj.size / 2);
            ctx.closePath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.6})`;
            ctx.lineWidth = 2;
            ctx.stroke();
          } else if (newObj.shape === 'text') {
            ctx.font = `${newObj.size}px Courier New`;
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(newObj.text || '', 0, 0);
          }

          ctx.restore();

          return newObj;
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePos]);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div className={styles.void} onMouseMove={handleMouseMove}>
      <canvas ref={canvasRef} className={styles.canvas} />

      <button className={styles.backButton} onClick={onBack}>
        ← Escape the Void
      </button>

      {voidPhrase && (
        <div className={styles.voidPhrase}>
          <p>{voidPhrase}</p>
        </div>
      )}

      <div className={styles.instructions}>
        <p>Move your cursor. Watch the void react.</p>
      </div>
    </div>
  );
}
