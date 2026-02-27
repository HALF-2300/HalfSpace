'use client';

import { Suspense, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import '../../../../app/globals.css';
import '../halfspace.css';
import './cosmic-wonders.css';

const CosmicWondersExperience = dynamic(() => import('./CosmicWondersExperience'), {
  ssr: false,
  loading: () => <CosmicLoader />
});

function CosmicLoader() {
  return (
    <div className="cosmic-loader">
      <div className="cosmic-spinner"></div>
      <p className="glitch-text">ENTERING THE UNKNOWN</p>
      <p className="whisper">في هذا الاتساع، لا توجد قوانين ثابتة...</p>
    </div>
  );
}

export default function CosmicWondersPage() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Fade in effect after warp
    setTimeout(() => setIsReady(true), 500);
  }, []);

  return (
    <div className={`cosmic-wonders-root ${isReady ? 'ready' : ''}`}>
      <Suspense fallback={<CosmicLoader />}>
        <CosmicWondersExperience />
      </Suspense>
    </div>
  );
}
