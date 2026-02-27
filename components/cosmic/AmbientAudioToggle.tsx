'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createAmbientEngine, type AmbientEngine } from '@/app/space/halfspace/lib/audio/ambient';

const KEY = 'gharaib_ambient_audio_enabled_v1';
const EVENT = 'gharaib:audio';
type AudioEventDetail = { enabled: boolean; source?: string };

interface AmbientAudioToggleProps {
  level?: number;
  className?: string;
}

/**
 * Ambient Audio Toggle with CustomEvent support
 * Responds to global audio events from navbar or other components
 */
export default function AmbientAudioToggle({ 
  level = 0.3, 
  className = '' 
}: AmbientAudioToggleProps) {
  const [enabled, setEnabled] = useState(false);
  const [armed, setArmed] = useState(false);
  const [running, setRunning] = useState(false);
  const engineRef = useRef<AmbientEngine | null>(null);
  const reducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
  }, []);

  // Initialize engine
  useEffect(() => {
    const eng = createAmbientEngine();
    engineRef.current = eng;

    // Load saved preference
    const saved = (() => {
      try {
        return window.localStorage.getItem(KEY) === '1';
      } catch {
        return false;
      }
    })();

    setEnabled(saved);
    if (saved && !reducedMotion) {
      setArmed(true);
    }

    return () => {
      eng.stop();
      engineRef.current = null;
    };
  }, [reducedMotion]);

  // Toggle function
  const toggle = async () => {
    const next = !enabled;
    setEnabled(next);

    try {
      window.localStorage.setItem(KEY, next ? '1' : '0');
    } catch {
      // Ignore storage errors
    }

    const eng = engineRef.current;
    if (!eng) return;

    if (next) {
      // Enable audio
      window.dispatchEvent(
        new CustomEvent<AudioEventDetail>(EVENT, {
          detail: { enabled: true, source: 'page' }
        })
      );

      if (reducedMotion) {
        setArmed(false);
        setRunning(false);
        return;
      }

      eng.setLevel(level);
      await eng.start();
      const ok = eng.isRunning();
      setRunning(ok);
      setArmed(!ok);
    } else {
      // Disable audio
      window.dispatchEvent(
        new CustomEvent<AudioEventDetail>(EVENT, {
          detail: { enabled: false, source: 'page' }
        })
      );

      eng.stop();
      setRunning(false);
      setArmed(false);
    }
  };

  // Listen for global audio events (from navbar, etc)
  useEffect(() => {
    const onAudio = async (e: Event) => {
      const ev = e as CustomEvent<AudioEventDetail>;
      const want = !!ev.detail?.enabled;

      // Don't respond to our own events
      if (ev.detail?.source === 'page') return;

      const eng = engineRef.current;
      if (!eng) return;

      if (want) {
        setEnabled(true);
        try {
          window.localStorage.setItem(KEY, '1');
        } catch {}

        if (reducedMotion) {
          setArmed(false);
          setRunning(false);
          return;
        }

        eng.setLevel(level);
        await eng.start();
        const ok = eng.isRunning();
        setRunning(ok);
        setArmed(!ok);
      } else {
        setEnabled(false);
        try {
          window.localStorage.setItem(KEY, '0');
        } catch {}

        eng.stop();
        setRunning(false);
        setArmed(false);
      }
    };

    window.addEventListener(EVENT, onAudio);
    return () => window.removeEventListener(EVENT, onAudio);
  }, [level, reducedMotion]);

  return (
    <button
      type="button"
      onClick={toggle}
      className={`rounded-full border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white/90 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/30 ${className}`}
      aria-pressed={enabled}
      aria-label={enabled ? 'Disable ambient audio' : 'Enable ambient audio'}
    >
      <span className="flex items-center gap-2">
        <span className="text-base">
          {enabled ? (running ? '🔊' : armed ? '🎵' : '🔇') : '🔇'}
        </span>
        <span>
          {enabled
            ? running
              ? 'صوت نشط'
              : armed
              ? 'جاهز'
              : 'صامت'
            : 'صامت'}
        </span>
      </span>
    </button>
  );
}
