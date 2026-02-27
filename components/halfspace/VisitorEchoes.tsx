'use client';

import { useEffect, useState } from 'react';
import styles from './VisitorEchoes.module.css';

interface Echo {
  id: string;
  x: number;
  y: number;
  message: string;
  timestamp: number;
  age: number;
}

export default function VisitorEchoes() {
  const [echoes, setEchoes] = useState<Echo[]>([]);
  const [hoveredEcho, setHoveredEcho] = useState<Echo | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Load echoes from localStorage and add current visitor's echo
  useEffect(() => {
    const loadEchoes = () => {
      try {
        const stored = localStorage.getItem('halfspace_echoes');
        const existingEchoes: Echo[] = stored ? JSON.parse(stored) : [];

        // Filter out old echoes (older than 24 hours)
        const now = Date.now();
        const recentEchoes = existingEchoes.filter(
          echo => now - echo.timestamp < 24 * 60 * 60 * 1000
        );

        // Add current visitor's echo
        const newEcho: Echo = {
          id: Math.random().toString(36),
          x: Math.random() * 100,
          y: Math.random() * 100,
          message: getRandomMessage(),
          timestamp: now,
          age: 0
        };

        const updatedEchoes = [...recentEchoes, newEcho].slice(-50); // Keep max 50 echoes

        setEchoes(updatedEchoes);
        localStorage.setItem('halfspace_echoes', JSON.stringify(updatedEchoes));
      } catch (error) {
        console.error('Could not load echoes:', error);
      }
    };

    loadEchoes();
  }, []);

  // Update ages of echoes
  useEffect(() => {
    const interval = setInterval(() => {
      setEchoes(prev =>
        prev.map(echo => ({
          ...echo,
          age: Date.now() - echo.timestamp
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Check for nearby echoes
  useEffect(() => {
    const checkProximity = () => {
      const threshold = 100; // pixels

      for (const echo of echoes) {
        const echoX = (echo.x / 100) * window.innerWidth;
        const echoY = (echo.y / 100) * window.innerHeight;
        const distance = Math.sqrt(
          Math.pow(mousePos.x - echoX, 2) + Math.pow(mousePos.y - echoY, 2)
        );

        if (distance < threshold && echo.age > 5000) {
          // Only show echoes older than 5 seconds (not current user's echo)
          setHoveredEcho(echo);
          return;
        }
      }
      setHoveredEcho(null);
    };

    checkProximity();
  }, [mousePos, echoes]);

  const handleMouseMove = (e: MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const formatTimeAgo = (age: number): string => {
    const seconds = Math.floor(age / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return `${seconds}s ago`;
  };

  return (
    <>
      {echoes.map(echo => {
        if (echo.age < 5000) return null; // Don't show current user's echo

        const opacity = Math.max(0.1, 1 - echo.age / (24 * 60 * 60 * 1000));

        return (
          <div
            key={echo.id}
            className={styles.echo}
            style={{
              left: `${echo.x}%`,
              top: `${echo.y}%`,
              opacity
            }}
          >
            <div className={styles.echoMarker} />
          </div>
        );
      })}

      {hoveredEcho && (
        <div
          className={styles.echoMessage}
          style={{
            left: mousePos.x + 20,
            top: mousePos.y
          }}
        >
          <p className={styles.echoText}>{hoveredEcho.message}</p>
          <span className={styles.echoTime}>
            Someone was here... {formatTimeAgo(hoveredEcho.age)}
          </span>
        </div>
      )}
    </>
  );
}

function getRandomMessage(): string {
  const messages = [
    'they asked about light',
    'seeking the origin',
    'wondering about time',
    'searching for meaning',
    'questioning existence',
    'feeling cosmic dread',
    'experiencing awe',
    'contemplating infinity',
    'lost in the void',
    'finding peace in chaos',
    'they whispered to the stars',
    'touched by the infinite',
    'measuring the immeasurable',
    'counting photons',
    'listening to silence',
    'watching the universe breathe',
    'became part of the pattern',
    'dissolved into starlight',
    'merged with the cosmos',
    'transcended understanding'
  ];

  return messages[Math.floor(Math.random() * messages.length)];
}
