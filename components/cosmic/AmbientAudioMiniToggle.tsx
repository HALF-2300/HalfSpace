'use client';

import React, { useEffect, useState } from 'react';

const KEY = 'gharaib_ambient_audio_enabled_v1';
const EVENT = 'gharaib:audio';

/**
 * Mini audio toggle for Navbar
 * Broadcasts audio state via CustomEvent
 */
export default function AmbientAudioMiniToggle() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Load saved preference
    const saved = (() => {
      try {
        return window.localStorage.getItem(KEY) === '1';
      } catch {
        return false;
      }
    })();
    setEnabled(saved);

    // Listen for audio events from other components
    const onAudio = (e: Event) => {
      const ev = e as CustomEvent<{ enabled: boolean; source?: string }>;
      // Don't respond to our own events
      if (ev.detail?.source === 'navbar') return;
      setEnabled(!!ev.detail?.enabled);
    };

    window.addEventListener(EVENT, onAudio);
    return () => window.removeEventListener(EVENT, onAudio);
  }, []);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);

    // Save preference
    try {
      window.localStorage.setItem(KEY, next ? '1' : '0');
    } catch {
      // Ignore storage errors
    }

    // Broadcast to all listeners
    window.dispatchEvent(
      new CustomEvent(EVENT, {
        detail: { enabled: next, source: 'navbar' }
      })
    );
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs text-white/85 backdrop-blur transition hover:bg-white/10 hover:border-white/25 active:scale-[0.98]"
      aria-pressed={enabled}
      title={enabled ? 'إيقاف صوت الفضاء' : 'تفعيل صوت الفضاء'}
    >
      {enabled ? '🔊 صوت' : '🔇 صامت'}
    </button>
  );
}
