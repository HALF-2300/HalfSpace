'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import '../../../app/globals.css';
import './halfspace.css';
import './deep-content.css';
import './interactive-styles.css';

// Dynamic import to avoid SSR issues with Three.js
const HalfspaceExperience = dynamic(() => import('./HalfspaceExperience'), {
  ssr: false,
  loading: () => <HalfspaceLoader />
});

function HalfspaceLoader() {
  return (
    <div className="halfspace-loader">
      <div className="cosmic-spinner"></div>
      <p className="glitch-text">INITIALIZING HALFSPACE</p>
      <p className="whisper">The universe is preparing to meet you...</p>
    </div>
  );
}

export default function HalfspacePage() {
  return (
    <div className="halfspace-root">
      <Suspense fallback={<HalfspaceLoader />}>
        <HalfspaceExperience />
      </Suspense>
    </div>
  );
}
