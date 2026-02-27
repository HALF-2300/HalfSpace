'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
}

export default function Reveal({
  children,
  delayMs = 0,
}: {
  children: React.ReactNode;
  delayMs?: number;
}) {
  const reduced = useMemo(() => prefersReducedMotion(), []);
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(reduced); // If reduced motion, show immediately

  useEffect(() => {
    if (reduced) return; // Skip animation if reduced motion
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e?.isIntersecting) {
          setShown(true);
          io.disconnect(); // Stop observing once shown
        }
      },
      { threshold: 0.12 } // Trigger when 12% visible
    );

    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delayMs}ms` }}
      className={`reveal-container ${shown ? 'revealed' : 'hidden'}`}
    >
      {children}
    </div>
  );
}
