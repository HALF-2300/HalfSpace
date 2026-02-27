'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createAmbientEngine, type AmbientEngine } from '../lib/audio/ambient';

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
}

// Optional: not widely supported; safe fallback
function prefersReducedTransparency(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.matchMedia?.('(prefers-reduced-transparency: reduce)')?.matches ?? false;
  } catch {
    return false;
  }
}

const KEY = 'halfspace_ambient_audio_enabled_v1';

export default function AmbientAudioToggle({ level = 0.35 }: { level?: number }) {
  const reducedMotion = useMemo(() => prefersReducedMotion(), []);
  const reducedTransparency = useMemo(() => prefersReducedTransparency(), []);

  const engineRef = useRef<AmbientEngine | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [armed, setArmed] = useState(false); // "ready to start on first gesture"
  const [running, setRunning] = useState(false);

  useEffect(() => {
    engineRef.current = createAmbientEngine();
    const saved = (() => {
      try { return window.localStorage.getItem(KEY) === '1'; } catch { return false; }
    })();

    // Respect reduced motion: default OFF even if saved (user choice > default, but we keep it conservative)
    if (saved && !reducedMotion) {
      setEnabled(true);
      setArmed(true);
    } else {
      setEnabled(false);
      setArmed(false);
    }

    return () => {
      engineRef.current?.stop();
      setRunning(false);
    };
  }, [reducedMotion]);

  useEffect(() => {
    // If enabled (saved) but browser needs gesture, start on first pointerdown
    if (!armed || !enabled) return;

    const onFirstGesture = async () => {
      const eng = engineRef.current;
      if (!eng) return;
      eng.setLevel(level);
      await eng.start();
      setRunning(eng.isRunning());
      setArmed(false);
    };

    window.addEventListener('pointerdown', onFirstGesture, { passive: true, once: true });
    return () => window.removeEventListener('pointerdown', onFirstGesture);
  }, [armed, enabled, level]);

  const toggle = async () => {
    const eng = engineRef.current;
    if (!eng) return;

    if (!enabled) {
      // turn ON
      setEnabled(true);
      try { window.localStorage.setItem(KEY, '1'); } catch {}

      if (reducedMotion) {
        // user wants reduced motion; keep audio off by default
        setArmed(false);
        setRunning(false);
        return;
      }

      eng.setLevel(level);
      // start attempts; if blocked, it'll start on next gesture via "armed"
      await eng.start();
      const ok = eng.isRunning();
      setRunning(ok);
      if (!ok) setArmed(true);
      else setArmed(false);
    } else {
      // turn OFF
      setEnabled(false);
      try { window.localStorage.setItem(KEY, '0'); } catch {}
      eng.stop();
      setRunning(false);
      setArmed(false);
    }
  };

  const label = !enabled
    ? 'صوت الفضاء: إيقاف'
    : running
      ? 'صوت الفضاء: تشغيل'
      : 'صوت الفضاء: جاهز (المس الشاشة)';

  const labelEn = !enabled
    ? 'Space Sound: Off'
    : running
      ? 'Space Sound: On'
      : 'Space Sound: Ready (tap screen)';

  const hint =
    reducedMotion
      ? 'Reduced motion enabled — audio kept off'
      : reducedTransparency
        ? 'Reduced transparency enabled — no audio impact'
        : 'Subtle ambient sound';

  const hintAr =
    reducedMotion
      ? 'مفعّل تقليل الحركة — الصوت محفوظ "إيقاف"'
      : reducedTransparency
        ? 'تقليل الشفافية مفعّل — ما يأثر على الصوت'
        : 'صوت خفيف جدًا';

  return (
    <div className="ambient-audio-toggle">
      <button
        type="button"
        onClick={toggle}
        className="audio-toggle-btn"
        aria-pressed={enabled}
        title={hint}
      >
        <span className="toggle-icon">{enabled && running ? '🔊' : '🔇'}</span>
        <span className="toggle-label">{label}</span>
        <span className="toggle-label-en">{labelEn}</span>
      </button>

      <span className="audio-hint">
        <span className="hint-ar">{hintAr}</span>
        <span className="hint-en">{hint}</span>
      </span>
    </div>
  );
}
