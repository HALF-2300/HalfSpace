'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './StarField.module.css';

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  brightness: number;
  data?: string; // Whisper data for hover
}

interface StarFieldProps {
  negativeMode: boolean;
  timeDilation: number;
  scrollDepth: number;
}

export default function StarField({ negativeMode, timeDilation, scrollDepth }: StarFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stars, setStars] = useState<Star[]>([]);
  const [hoveredStar, setHoveredStar] = useState<Star | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  // Generate stars based on device time and location
  useEffect(() => {
    const generateStars = () => {
      const now = Date.now();
      const seed = now + (typeof window !== 'undefined' ? window.screen.width * window.screen.height : 1000);
      const starCount = 500;
      
      const newStars: Star[] = [];
      for (let i = 0; i < starCount; i++) {
        const angle = (i / starCount) * Math.PI * 2;
        const radius = Math.random();
        
        newStars.push({
          x: Math.cos(angle + seed) * radius * 100,
          y: Math.sin(angle + seed) * radius * 100,
          z: Math.random() * 1000,
          size: Math.random() * 2 + 0.5,
          brightness: Math.random(),
          data: getRandomWhisper()
        });
      }
      
      setStars(newStars);
    };

    generateStars();
  }, []);

  // Animate stars
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const animate = () => {
      ctx.fillStyle = negativeMode ? '#ffffff' : '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2 + mousePos.x * 0.1;
      const centerY = canvas.height / 2 + mousePos.y * 0.1;

      stars.forEach((star, index) => {
        // Move stars based on time dilation
        star.z -= (1 + scrollDepth * 2) * timeDilation;
        
        if (star.z <= 0) {
          star.z = 1000;
        }

        // 3D projection
        const scale = 1000 / (star.z + 1000);
        const x = centerX + star.x * scale;
        const y = centerY + star.y * scale;
        const size = star.size * scale;

        // Brightness varies with depth and time
        const brightness = star.brightness * (1 - star.z / 1000) * (0.5 + Math.sin(Date.now() * 0.001 + index) * 0.5);

        // Draw star
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        
        if (negativeMode) {
          ctx.fillStyle = `rgba(0, 0, 0, ${brightness})`;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
        }
        
        ctx.fill();

        // Add glow for brighter stars
        if (brightness > 0.7) {
          ctx.shadowBlur = 10 * brightness;
          ctx.shadowColor = negativeMode ? '#000000' : '#ffffff';
        } else {
          ctx.shadowBlur = 0;
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [stars, mousePos, timeDilation, scrollDepth, negativeMode]);

  // Handle mouse movement
  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX - window.innerWidth / 2, y: e.clientY - window.innerHeight / 2 });

    // Check for star hover
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = canvas.width / 2 + mousePos.x * 0.1;
    const centerY = canvas.height / 2 + mousePos.y * 0.1;

    let found = false;
    for (const star of stars) {
      const scale = 1000 / (star.z + 1000);
      const starX = centerX + star.x * scale;
      const starY = centerY + star.y * scale;
      const distance = Math.sqrt((x - starX) ** 2 + (y - starY) ** 2);

      if (distance < 20) {
        setHoveredStar(star);
        found = true;
        break;
      }
    }

    if (!found) {
      setHoveredStar(null);
    }
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className={styles.starField}
        onMouseMove={handleMouseMove}
      />
      
      {hoveredStar && (
        <div 
          className={styles.whisper}
          style={{
            left: mousePos.x + window.innerWidth / 2 + 20,
            top: mousePos.y + window.innerHeight / 2
          }}
        >
          {hoveredStar.data}
        </div>
      )}
    </>
  );
}

function getRandomWhisper(): string {
  const whispers = [
    "light remembers its source",
    "time is a circle, not a line",
    "we are made of star dust",
    "the void is not empty",
    "entropy whispers secrets",
    "gravity bends more than space",
    "dark matter dreams",
    "photons carry memories",
    "the universe expands, then forgets",
    "quantum foam bubbles with possibility",
    "singularities sing",
    "cosmic strings vibrate",
    "neutron stars pulse with ancient rhythm",
    "black holes remember everything",
    "the speed of light is not absolute",
    "dimensions fold into themselves",
    "antimatter reflects reality",
    "superposition is truth",
    "entanglement knows no distance",
    "observation changes everything"
  ];

  return whispers[Math.floor(Math.random() * whispers.length)];
}
