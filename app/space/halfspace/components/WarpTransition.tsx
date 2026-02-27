'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface WarpTransitionProps {
  delay?: number; // milliseconds before transition starts
  enabled?: boolean;
  targetPath?: string;
}

export default function WarpTransition({ 
  delay = 12000, 
  enabled = true,
  targetPath = '/space/halfspace/cosmic-wonders'
}: WarpTransitionProps) {
  const [isWarping, setIsWarping] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!enabled) return;

    // Wait for the specified delay
    const warpTimer = setTimeout(() => {
      setIsWarping(true);

      // Navigate after the warp animation completes
      const navigationTimer = setTimeout(() => {
        router.push(targetPath);
      }, 4000);

      return () => clearTimeout(navigationTimer);
    }, delay);

    return () => clearTimeout(warpTimer);
  }, [delay, enabled, targetPath, router]);

  if (!isWarping) return null;

  return (
    <div className="warp-transition">
      <div className="warp-point"></div>
      <div className="warp-sound-fade"></div>
    </div>
  );
}
