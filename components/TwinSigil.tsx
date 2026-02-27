'use client';

import React from 'react';

export default function TwinSigil({ size = 56 }: { size?: number }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        filter: 'drop-shadow(0 6px 18px rgba(120,180,255,0.25))',
      }}
    >
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <defs>
          <radialGradient id="p1" cx="35%" cy="35%">
            <stop offset="0%" stopColor="rgba(180,220,255,0.95)" />
            <stop offset="100%" stopColor="rgba(120,120,255,0.55)" />
          </radialGradient>
          <radialGradient id="p2" cx="35%" cy="35%">
            <stop offset="0%" stopColor="rgba(255,210,180,0.95)" />
            <stop offset="100%" stopColor="rgba(255,120,200,0.55)" />
          </radialGradient>
        </defs>

        <g style={{ transformOrigin: '50px 50px', animation: 'tw_orbit 10s linear infinite' }}>
          <ellipse cx="50" cy="50" rx="38" ry="18" fill="none" stroke="rgba(160,210,255,0.45)" strokeWidth="1.2" />
          <ellipse cx="50" cy="50" rx="18" ry="38" fill="none" stroke="rgba(255,180,220,0.35)" strokeWidth="1.1" />
        </g>

        <circle cx="37" cy="45" r="9" fill="url(#p1)" />
        <circle cx="63" cy="55" r="8" fill="url(#p2)" />

        <circle
          cx="50"
          cy="50"
          r="28"
          fill="none"
          stroke="rgba(170,220,255,0.18)"
          strokeWidth="1"
          style={{ transformOrigin: '50px 50px', animation: 'tw_pulse 2.8s ease-in-out infinite' }}
        />

        <style>{`
          @keyframes tw_orbit { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes tw_pulse { 0%,100% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.06); opacity: 1; } }
        `}</style>
      </svg>
    </div>
  );
}
