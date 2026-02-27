'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import '../../../../app/globals.css';
import '../halfspace.css';

// Dynamic import
const CognitiveExperience = dynamic(() => import('./CognitiveExperience'), {
  ssr: false,
  loading: () => <CognitiveLoader />
});

function CognitiveLoader() {
  return (
    <div className="halfspace-loader">
      <div className="cosmic-spinner"></div>
      <p className="glitch-text">INITIALIZING COGNITIVE ARCHITECTURE</p>
      <p className="whisper">Building the knowledge matrix...</p>
    </div>
  );
}

export default function CognitivePage() {
  return (
    <div className="halfspace-root cognitive-mode">
      <Suspense fallback={<CognitiveLoader />}>
        <CognitiveExperience />
      </Suspense>
    </div>
  );
}
