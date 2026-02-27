'use client';

import React from 'react';

interface BackPillProps {
  href?: string;
  label?: string;
}

/**
 * Cosmic-themed back button
 * Small pill-shaped link for navigation
 */
export default function BackPill({ href = '/all-pages', label }: BackPillProps) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs text-white/85 backdrop-blur transition hover:bg-white/10 hover:border-white/25 active:scale-[0.98]"
    >
      <span aria-hidden="true">←</span>
      <span>{label ?? 'العودة'}</span>
    </a>
  );
}
