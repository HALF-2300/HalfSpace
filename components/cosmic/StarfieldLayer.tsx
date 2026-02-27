'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Starfield from '@/components/cosmic/Starfield';
import { playStarChime } from '@/lib/audio/chime';

type QualityMode = 'calm' | 'normal' | 'dense';

const KEY = 'gharaib_starfield_quality_v1';
const EVENT = 'gharaib:quality';

/**
 * Read quality mode from localStorage
 */
function readMode(): QualityMode {
  try {
    const v = window.localStorage.getItem(KEY);
    if (v === 'calm' || v === 'normal' || v === 'dense') return v;
  } catch {}
  return 'normal';
}

/**
 * Convert quality mode to starfield parameters
 */
function modeToParams(mode: QualityMode) {
  switch (mode) {
    case 'calm':
      return { density: 0.00010, maxLinks: 40 };
    case 'dense':
      return { density: 0.00024, maxLinks: 110 };
    default:
      return { density: 0.00016, maxLinks: 70 };
  }
}

/**
 * Smart starfield layer that:
 * - Reads quality from localStorage
 * - Listens to quality change events
 * - Syncs across tabs via storage event
 */
export default function StarfieldLayer() {
  const [mode, setMode] = useState<QualityMode>('normal');

  useEffect(() => {
    // Initialize from localStorage
    setMode(readMode());

    // Listen to quality change events (from UI)
    const onQuality = (e: Event) => {
      const ev = e as CustomEvent<{ mode?: QualityMode }>;
      const m = ev.detail?.mode;
      if (m === 'calm' || m === 'normal' || m === 'dense') {
        setMode(m);
      }
    };

    // Listen to storage events (from other tabs)
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) {
        setMode(readMode());
      }
    };

    window.addEventListener(EVENT, onQuality);
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener(EVENT, onQuality);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  // Get parameters based on current mode
  const params = useMemo(() => modeToParams(mode), [mode]);

  return (
    <Starfield
      density={params.density}
      maxLinks={params.maxLinks}
      onStarClick={() => {
        void playStarChime();
      }}
    />
  );
}
