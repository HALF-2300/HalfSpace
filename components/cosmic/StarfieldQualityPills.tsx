'use client';

import React, { useEffect, useState } from 'react';

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
 * UI for selecting starfield quality
 * Saves to localStorage and dispatches event
 */
export default function StarfieldQualityPills() {
  const [mode, setMode] = useState<QualityMode>('normal');

  useEffect(() => {
    setMode(readMode());
  }, []);

  const set = (m: QualityMode) => {
    setMode(m);

    // Save to localStorage
    try {
      window.localStorage.setItem(KEY, m);
    } catch {}

    // Dispatch event for StarfieldLayer to catch
    window.dispatchEvent(
      new CustomEvent(EVENT, {
        detail: { mode: m }
      })
    );
  };

  const pill = (m: QualityMode, labelAr: string, labelEn: string) => {
    const active = mode === m;
    return (
      <button
        key={m}
        type="button"
        onClick={() => set(m)}
        className={[
          'rounded-full border px-3 py-1 text-xs backdrop-blur transition-all duration-200',
          active
            ? 'border-white/25 bg-white/12 text-white shadow-sm'
            : 'border-white/15 bg-white/5 text-white/75 hover:bg-white/8 hover:border-white/20'
        ].join(' ')}
        aria-pressed={active}
        title={labelEn}
      >
        {labelAr}
      </button>
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-white/55" style={{ fontFamily: 'Cairo, sans-serif' }}>
        جودة النجوم:
      </span>
      {pill('calm', 'هادئ', 'Calm')}
      {pill('normal', 'عادي', 'Normal')}
      {pill('dense', 'كثيف', 'Dense')}
    </div>
  );
}
