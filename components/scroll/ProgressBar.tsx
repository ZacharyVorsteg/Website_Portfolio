'use client';
import React, { useEffect, useRef } from 'react';
import { ensureGSAP, gsap } from './gsap';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

export default function ProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    ensureGSAP();
    if (!barRef.current || reduced) return;

    const el = barRef.current;
    const ctx = gsap.context(() => {
      gsap.set(el, { scaleX: 0, transformOrigin: '0 0' });
      gsap.to(el, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          scrub: 0.2,
          start: 0,
          end: () =>
            document.documentElement.scrollHeight -
            document.documentElement.clientHeight,
        },
      });
    }, barRef);

    return () => ctx.revert();
  }, [reduced]);

  return <div ref={barRef} className="scroll-progress-bar" />;
}
