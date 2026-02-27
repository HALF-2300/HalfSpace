'use client';

import React, { useState } from 'react';
import OddityWhispers from '@/components/cosmic/OddityWhispers';

/**
 * Console for controlling cosmic oddity whispers
 * Shuffle button changes whispers without AI
 */
export default function OddityConsole() {
  const [salt, setSalt] = useState(0);

  return (
    <div className="max-w-3xl">
      {/* Control bar */}
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setSalt((s) => (s + 1) >>> 0)}
          className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-white/85 backdrop-blur transition hover:bg-white/10 hover:border-white/25 active:scale-[0.99]"
          aria-label="Shuffle whispers"
        >
          اقذفني لغرابة جديدة ✦
        </button>

        <span className="text-xs text-white/55">
          (بدون ذكاء اصطناعي — تبديل ذكي من نفس النصوص)
        </span>
      </div>

      {/* Whispers component with salt */}
      <OddityWhispers salt={salt} />
    </div>
  );
}
