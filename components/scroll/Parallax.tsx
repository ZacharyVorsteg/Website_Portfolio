'use client';
import React, { useEffect, useRef } from 'react';
import { ensureGSAP, gsap, ScrollTrigger } from './gsap';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

type Props = {
  children: React.ReactNode;
  speed?: number; // 0.1..0.6 typical
  className?: string;
  markers?: boolean;
};

export default function Parallax({ children, speed = 0.25, className, markers = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    ensureGSAP();
    if (!ref.current || reduced) return;

    const el = ref.current;
    const distance = 200 * speed; // px
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: -distance },
        {
          y: distance,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            markers,
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [speed, markers, reduced]);

  return (
    <div ref={ref} className={className} style={{ willChange: 'transform' }}>
      {children}
    </div>
  );
}
