'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { 
  COSMIC_FRAGMENTS_AR, 
  COSMIC_FRAGMENTS_EN, 
  COSMIC_ODDITIES_AR,
  COSMIC_ODDITIES_EN 
} from '@/data/cosmicOddities';
import { daySeedUTC, pickOne, pickN, SEED_VARIANTS, seedVariant } from '@/lib/seed';

interface OddityWhispersProps {
  language?: 'ar' | 'en';
  className?: string;
  salt?: number; // NEW: للـ shuffle بدون تغيير التاريخ
}

/**
 * Check if user prefers reduced motion (accessibility)
 */
function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
}

/**
 * Daily deterministic whispers with subtle parallax effect
 * نفس اليوم = نفس الهمسة، بكرة تتبدّل
 * مع دعم salt للـ shuffle
 */
export default function OddityWhispers({ language = 'ar', className = '', salt = 0 }: OddityWhispersProps) {
  // Generate deterministic daily seed with salt support
  const base = useMemo(() => daySeedUTC(), []);
  const seed = useMemo(() => (base ^ (salt >>> 0)) >>> 0, [base, salt]);
  
  // Check for reduced motion preference
  const reduced = useMemo(() => prefersReducedMotion(), []);

  // Pick daily content (same seed = same content for everyone today)
  const oddities = language === 'ar' ? COSMIC_ODDITIES_AR : COSMIC_ODDITIES_EN;
  const fragments = language === 'ar' ? COSMIC_FRAGMENTS_AR : COSMIC_FRAGMENTS_EN;

  const dailyMain = useMemo(
    () => pickOne(oddities, seedVariant(seed, SEED_VARIANTS.MAIN)), 
    [seed, oddities]
  );

  const dailyFragments = useMemo(
    () => pickN(fragments, 6, seedVariant(seed, SEED_VARIANTS.FRAGMENTS)), 
    [seed, fragments]
  );

  // Rotating fragment index
  const [fragmentIndex, setFragmentIndex] = useState(0);

  // Parallax position (subtle mouse tracking)
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  // Mouse tracking for parallax (only if motion not reduced)
  useEffect(() => {
    if (reduced) return;

    const onMove = (e: PointerEvent) => {
      // Normalize to -1..1 range
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setParallax({ x, y });
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduced]);

  // Rotate fragments every 9 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setFragmentIndex((prev) => (prev + 1) % dailyFragments.length);
    }, 9000);

    return () => clearInterval(interval);
  }, [dailyFragments.length]);

  // Calculate parallax transform (very subtle)
  const translateX = reduced ? 0 : parallax.x * 10; // Max 10px movement
  const translateY = reduced ? 0 : parallax.y * 6;  // Max 6px movement

  const isRTL = language === 'ar';

  return (
    <div
      className={`relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-transform duration-300 ease-out ${className}`}
      style={{
        transform: `translate3d(${translateX}px, ${translateY}px, 0)`,
        direction: isRTL ? 'rtl' : 'ltr'
      }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Label */}
      <p 
        className="text-xs tracking-[0.35em] text-white/60 uppercase"
        style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Courier New, monospace' }}
      >
        {language === 'ar' ? 'همسة' : 'WHISPER'}
      </p>

      {/* Main daily oddity */}
      <p 
        className="mt-3 text-lg leading-8 text-white/90 md:text-xl"
        style={{ 
          fontFamily: isRTL ? 'Cairo, serif' : 'Georgia, serif',
          lineHeight: '1.9'
        }}
      >
        {dailyMain}
      </p>

      {/* Divider */}
      <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      {/* Rotating fragment */}
      <p 
        className="mt-4 text-sm leading-7 text-white/70 transition-opacity duration-500"
        style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Georgia, serif' }}
      >
        {dailyFragments[fragmentIndex]}
        <span className="opacity-50"> …</span>
      </p>

      {/* Info text */}
      <p 
        className="mt-4 text-xs text-white/45"
        style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Courier New, monospace' }}
      >
        {language === 'ar' 
          ? '(نفس اليوم = نفس الهمسة. بكرة تتبدّل.)'
          : '(Same day = same whisper. Tomorrow it changes.)'}
      </p>

      {/* Subtle glow effect */}
      <div 
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 transition-opacity duration-500 pointer-events-none"
        style={{
          opacity: reduced ? 0 : Math.abs(parallax.x) * 0.3 + Math.abs(parallax.y) * 0.3
        }}
      />
    </div>
  );
}
