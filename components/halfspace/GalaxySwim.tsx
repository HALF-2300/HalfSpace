'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import styles from './GalaxySwim.module.css';

interface GalaxySwimProps {
  onBack: () => void;
}

interface Star {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  hue?: number;
}

interface Nebula {
  x: number;
  y: number;
  radius: number;
  hue: number;
  opacity: number;
  drift: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  hue: number;
}

interface Bubble {
  id: string;
  x: number;
  y: number;
  text: string;
  textAr: string;
  visible: boolean;
}

interface SwimPhysics {
  velocityX: number;
  velocityY: number;
  momentum: number;
}

export default function GalaxySwim({ onBack }: GalaxySwimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [activeBubble, setActiveBubble] = useState<Bubble | null>(null);
  const [introMessage, setIntroMessage] = useState(true);
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [swimDepth, setSwimDepth] = useState(0);
  const [ambientMood, setAmbientMood] = useState<'calm' | 'epic' | 'mysterious'>('calm');
  const mouseRef = useRef({ x: 0, y: 0, prevX: 0, prevY: 0 });
  const starsRef = useRef<Star[]>([]);
  const nebulaeRef = useRef<Nebula[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const physicsRef = useRef<SwimPhysics>({ velocityX: 0, velocityY: 0, momentum: 0 });
  const animationRef = useRef<number>();
  const audioContextRef = useRef<AudioContext | null>(null);
  const ambientNodeRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Cosmic facts in both languages
  const cosmicFacts = [
    {
      en: "Space has no echo, yet it preserves the memories of light.",
      ar: "الفضاء لا صدى له، لكنه يحتفظ بذكريات الضوء."
    },
    {
      en: "You swim now in a region where gravity sleeps.",
      ar: "تسبح الآن في منطقة لا جاذبية فيها، فقط الاحتمالات."
    },
    {
      en: "Every atom around you carries part of a dead star's past.",
      ar: "كل ذرة حولك تحمل جزءًا من ماضي نجم ميت."
    },
    {
      en: "Here, time slows until it nearly vanishes.",
      ar: "هنا، الزمن يتباطأ حتى يكاد يختفي."
    },
    {
      en: "You don't swim in space. Space swims in you.",
      ar: "أنت لا تسبح في الفضاء، الفضاء يسبح فيك."
    },
    {
      en: "Between galaxies, there are only hydrogen atoms and possibilities.",
      ar: "بين المجرات، لا يوجد سوى ذرات الهيدروجين والاحتمالات."
    },
    {
      en: "Every particle here passes through you at the speed of light.",
      ar: "كل جسيم حولك الآن يمر بك بسرعة الضوء تقريبًا."
    },
    {
      en: "The void is not empty. It breathes.",
      ar: "الفراغ ليس خاليًا. إنه يتنفس."
    },
    {
      en: "You are made of stardust, swimming among your ancestors.",
      ar: "أنت مصنوع من غبار النجوم، تسبح بين أجدادك."
    },
    {
      en: "In the intergalactic void, you are the only warmth.",
      ar: "في الفراغ بين المجرات، أنت الدفء الوحيد."
    }
  ];

  // Initialize stars and nebulae
  useEffect(() => {
    const numStars = 800;
    const numNebulae = 5;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Generate stars with color variation
    const newStars: Star[] = [];
    for (let i = 0; i < numStars; i++) {
      const baseX = (Math.random() - 0.5) * canvas.width * 2;
      const baseY = (Math.random() - 0.5) * canvas.height * 2;
      newStars.push({
        x: baseX,
        y: baseY,
        z: Math.random() * canvas.width,
        baseX,
        baseY,
        hue: 180 + Math.random() * 100 // Blue to purple spectrum
      });
    }
    starsRef.current = newStars;

    // Generate nebulae (cosmic clouds)
    const newNebulae: Nebula[] = [];
    for (let i = 0; i < numNebulae; i++) {
      newNebulae.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 150 + Math.random() * 250,
        hue: [200, 270, 320, 180, 240][i % 5], // Various cosmic colors
        opacity: 0.03 + Math.random() * 0.04,
        drift: (Math.random() - 0.5) * 0.3
      });
    }
    nebulaeRef.current = newNebulae;

    // Initialize ambient audio
    initAmbientAudio();

    return () => {
      stopAmbientAudio();
    };
  }, []);

  // Initialize continuous ambient audio
  const initAmbientAudio = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = ctx;

      // Create ambient drone
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      oscillator.type = 'sine';
      oscillator.frequency.value = 60; // Deep bass
      
      filter.type = 'lowpass';
      filter.frequency.value = 200;
      filter.Q.value = 5;

      oscillator.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      gain.gain.value = 0.05; // Very quiet ambient

      oscillator.start();
      ambientNodeRef.current = oscillator;
      gainNodeRef.current = gain;
    } catch {
      // Audio not supported
    }
  }, []);

  const stopAmbientAudio = useCallback(() => {
    try {
      ambientNodeRef.current?.stop();
      audioContextRef.current?.close();
    } catch {
      // Ignore cleanup errors
    }
  }, []);

  // Animation loop with enhanced physics
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const animate = () => {
      const physics = physicsRef.current;
      
      // Calculate movement delta
      const dx = mouseRef.current.x - mouseRef.current.prevX;
      const dy = mouseRef.current.y - mouseRef.current.prevY;
      
      // Apply momentum (drift effect)
      physics.velocityX = physics.velocityX * 0.95 + dx * 0.1;
      physics.velocityY = physics.velocityY * 0.95 + dy * 0.1;
      physics.momentum = Math.sqrt(physics.velocityX ** 2 + physics.velocityY ** 2);
      
      // Update previous mouse position
      mouseRef.current.prevX = mouseRef.current.x;
      mouseRef.current.prevY = mouseRef.current.y;

      // Update swim depth based on momentum
      setSwimDepth(prev => prev + physics.momentum * 0.01);

      // Clear with slight fade for trails
      ctx.fillStyle = 'rgba(3, 7, 18, 0.12)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Draw nebulae (background cosmic clouds)
      nebulaeRef.current.forEach(nebula => {
        // Drift nebulae slightly
        nebula.x += nebula.drift + physics.velocityX * 0.02;
        nebula.y += nebula.drift * 0.5 + physics.velocityY * 0.02;
        
        // Wrap around
        if (nebula.x < -nebula.radius) nebula.x = canvas.width + nebula.radius;
        if (nebula.x > canvas.width + nebula.radius) nebula.x = -nebula.radius;
        if (nebula.y < -nebula.radius) nebula.y = canvas.height + nebula.radius;
        if (nebula.y > canvas.height + nebula.radius) nebula.y = -nebula.radius;

        // Draw nebula with gradient
        const gradient = ctx.createRadialGradient(
          nebula.x, nebula.y, 0,
          nebula.x, nebula.y, nebula.radius
        );
        gradient.addColorStop(0, `hsla(${nebula.hue}, 70%, 50%, ${nebula.opacity * 1.5})`);
        gradient.addColorStop(0.4, `hsla(${nebula.hue}, 60%, 40%, ${nebula.opacity})`);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(nebula.x, nebula.y, nebula.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Calculate swimming offset with momentum
      const mouseOffsetX = (mouseRef.current.x - centerX) * 0.3 + physics.velocityX * 2;
      const mouseOffsetY = (mouseRef.current.y - centerY) * 0.3 + physics.velocityY * 2;

      // Generate particles on movement
      if (physics.momentum > 2) {
        particlesRef.current.push({
          x: mouseRef.current.x + (Math.random() - 0.5) * 50,
          y: mouseRef.current.y + (Math.random() - 0.5) * 50,
          vx: -physics.velocityX * 0.3 + (Math.random() - 0.5) * 2,
          vy: -physics.velocityY * 0.3 + (Math.random() - 0.5) * 2,
          size: 1 + Math.random() * 2,
          life: 1,
          maxLife: 60 + Math.random() * 40,
          hue: 200 + Math.random() * 80
        });
      }

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        
        if (p.life > p.maxLife) return false;

        const progress = p.life / p.maxLife;
        const opacity = 1 - progress;
        const size = p.size * (1 - progress * 0.5);

        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${opacity * 0.6})`;
        ctx.fill();

        return true;
      });

      // Draw stars with enhanced effects
      ctx.shadowBlur = 0;
      starsRef.current.forEach(star => {
        // Move star forward with variable speed based on momentum
        star.z -= 2.5 + physics.momentum * 0.3;

        if (star.z <= 0) {
          star.z = canvas.width;
          star.baseX = (Math.random() - 0.5) * canvas.width * 2;
          star.baseY = (Math.random() - 0.5) * canvas.height * 2;
          star.x = star.baseX;
          star.y = star.baseY;
          star.hue = 180 + Math.random() * 100;
        }

        // Apply swimming influence with momentum
        star.x = star.baseX - mouseOffsetX * (1 - star.z / canvas.width);
        star.y = star.baseY - mouseOffsetY * (1 - star.z / canvas.width);

        // 3D projection
        const k = 200 / star.z;
        const px = star.x * k + centerX;
        const py = star.y * k + centerY;

        if (px >= -50 && px <= canvas.width + 50 && py >= -50 && py <= canvas.height + 50) {
          const size = (1 - star.z / canvas.width) * 3;
          const opacity = 1 - star.z / canvas.width;
          const hue = star.hue || 220;

          // Draw star streak when moving fast
          if (physics.momentum > 5 && opacity > 0.5) {
            const streakLength = physics.momentum * 0.5;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px + physics.velocityX * streakLength * 0.1, py + physics.velocityY * streakLength * 0.1);
            ctx.strokeStyle = `hsla(${hue}, 80%, 80%, ${opacity * 0.3})`;
            ctx.lineWidth = size * 0.5;
            ctx.stroke();
          }

          // Draw star
          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${hue}, 80%, 80%, ${opacity})`;
          ctx.fill();

          // Glow for closer stars
          if (opacity > 0.7) {
            ctx.beginPath();
            ctx.arc(px, py, size * 2, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${hue}, 80%, 80%, ${opacity * 0.2})`;
            ctx.fill();
          }
        }
      });

      // Draw refraction effect (underwater-like light)
      if (physics.momentum > 0.5) {
        const gradient = ctx.createRadialGradient(
          mouseRef.current.x, mouseRef.current.y, 0,
          mouseRef.current.x, mouseRef.current.y, 150 + physics.momentum * 10
        );
        gradient.addColorStop(0, `rgba(139, 92, 246, ${0.05 + physics.momentum * 0.005})`);
        gradient.addColorStop(0.5, `rgba(59, 130, 246, ${0.03})`);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, 150 + physics.momentum * 10, 0, Math.PI * 2);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Mouse tracking with improved responsiveness
  useEffect(() => {
    let lastSoundTime = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;

      // Play subtle sound on significant movement (throttled)
      const now = Date.now();
      const momentum = physicsRef.current.momentum;
      if (momentum > 3 && now - lastSoundTime > 100) {
        playSwimSound(momentum);
        lastSoundTime = now;
      }

      // Modulate ambient audio based on movement
      if (gainNodeRef.current && momentum > 1) {
        const targetGain = 0.05 + momentum * 0.005;
        gainNodeRef.current.gain.setTargetAtTime(
          Math.min(0.15, targetGain),
          audioContextRef.current?.currentTime || 0,
          0.1
        );
      }
    };

    // Touch support for mobile
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.x = e.touches[0].clientX;
        mouseRef.current.y = e.touches[0].clientY;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // Generate bubbles periodically
  useEffect(() => {
    const generateBubble = () => {
      const fact = cosmicFacts[Math.floor(Math.random() * cosmicFacts.length)];
      const newBubble: Bubble = {
        id: Date.now().toString(),
        x: Math.random() * (window.innerWidth - 300) + 50,
        y: Math.random() * (window.innerHeight - 200) + 50,
        text: fact.en,
        textAr: fact.ar,
        visible: true
      };

      setBubbles(prev => [...prev, newBubble]);

      // Remove bubble after 7 seconds
      setTimeout(() => {
        setBubbles(prev => prev.filter(b => b.id !== newBubble.id));
      }, 7000);
    };

    // Hide intro message
    setTimeout(() => setIntroMessage(false), 8000);

    // First bubble after 5 seconds
    const firstTimeout = setTimeout(generateBubble, 5000);

    // Generate bubble every 8-12 seconds
    const interval = setInterval(() => {
      generateBubble();
    }, 8000 + Math.random() * 4000);

    return () => {
      clearTimeout(firstTimeout);
      clearInterval(interval);
    };
  }, []);

  // Play enhanced swim sound based on momentum
  const playSwimSound = useCallback((momentum: number = 1) => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const now = ctx.currentTime;

    // Create ethereal swimming sound
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Frequency varies with momentum
    const baseFreq = 150 + Math.random() * 100;
    oscillator.frequency.value = baseFreq + momentum * 10;
    oscillator.type = 'sine';

    // Low-pass filter for underwater effect
    filter.type = 'lowpass';
    filter.frequency.value = 400 + momentum * 50;
    filter.Q.value = 2;

    // Volume based on momentum
    const volume = Math.min(0.06, 0.02 + momentum * 0.003);
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(volume, now + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    oscillator.start(now);
    oscillator.stop(now + 0.4);
  }, []);

  const handleBubbleClick = (bubble: Bubble) => {
    setActiveBubble(bubble);
  };

  const handleResize = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={styles.galaxySwim}>
      <canvas ref={canvasRef} className={styles.canvas} />

      <button className={styles.backButton} onClick={onBack}>
        ← {language === 'en' ? 'Return to HalfSpace' : 'العودة إلى HalfSpace'}
      </button>

      <button 
        className={styles.languageToggle}
        onClick={() => setLanguage(prev => prev === 'en' ? 'ar' : 'en')}
      >
        {language === 'en' ? 'العربية' : 'English'}
      </button>

      {introMessage && (
        <div className={styles.introMessage}>
          <p className={styles.introTextEn}>
            In this place, gravity sleeps.
            <br />
            You are free to swim between galaxies.
          </p>
          <p className={styles.introTextAr}>
            في هذا المكان، الجاذبية نائمة.
            <br />
            أنت حر في السباحة بين المجرات.
          </p>
          <p className={styles.introHint}>
            {language === 'en' ? 'Move your cursor to swim...' : 'حرّك الماوس للسباحة...'}
          </p>
        </div>
      )}

      {bubbles.map(bubble => (
        <div
          key={bubble.id}
          className={`${styles.bubble} ${bubble.visible ? styles.bubbleVisible : ''}`}
          style={{ left: bubble.x, top: bubble.y }}
          onClick={() => handleBubbleClick(bubble)}
        >
          <div className={styles.bubbleGlow} />
          <div className={styles.bubbleText}>
            {language === 'en' ? bubble.text : bubble.textAr}
          </div>
        </div>
      ))}

      {activeBubble && (
        <div className={styles.detailModal} onClick={() => setActiveBubble(null)}>
          <div className={styles.detailContent} onClick={(e) => e.stopPropagation()}>
            <h2>{language === 'en' ? 'Cosmic Truth' : 'حقيقة كونية'}</h2>
            <p className={styles.detailTextEn}>{activeBubble.text}</p>
            <p className={styles.detailTextAr}>{activeBubble.textAr}</p>
            <button onClick={() => setActiveBubble(null)}>
              {language === 'en' ? 'Continue Swimming' : 'متابعة السباحة'}
            </button>
          </div>
        </div>
      )}

      <div className={styles.speedIndicator}>
        <div className={styles.speedLine} />
        <span>{language === 'en' ? 'Swimming...' : 'السباحة...'}</span>
      </div>

      {/* Depth Indicator */}
      <div className={styles.depthIndicator}>
        <div className={styles.depthLabel}>
          {language === 'en' ? 'DEPTH' : 'العمق'}
        </div>
        <div className={styles.depthValue}>
          {Math.floor(swimDepth).toLocaleString()}
        </div>
        <div className={styles.depthUnit}>
          {language === 'en' ? 'light-years' : 'سنة ضوئية'}
        </div>
      </div>

      {/* Mood Selector */}
      <div className={styles.moodSelector}>
        <span className={styles.moodLabel}>
          {language === 'en' ? 'Mood' : 'المزاج'}
        </span>
        <div className={styles.moodButtons}>
          <button
            className={`${styles.moodButton} ${ambientMood === 'calm' ? styles.moodActive : ''}`}
            onClick={() => setAmbientMood('calm')}
            title="Calm"
          >
            🌊
          </button>
          <button
            className={`${styles.moodButton} ${ambientMood === 'epic' ? styles.moodActive : ''}`}
            onClick={() => setAmbientMood('epic')}
            title="Epic"
          >
            ⚡
          </button>
          <button
            className={`${styles.moodButton} ${ambientMood === 'mysterious' ? styles.moodActive : ''}`}
            onClick={() => setAmbientMood('mysterious')}
            title="Mysterious"
          >
            🌀
          </button>
        </div>
      </div>
    </div>
  );
}
