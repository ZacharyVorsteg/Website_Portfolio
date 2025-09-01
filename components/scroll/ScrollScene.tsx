'use client';
import React, { useEffect, useRef, useState } from 'react';
import { ensureGSAP, gsap, ScrollTrigger } from './gsap';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

type Props = {
  children: (progress: number) => React.ReactNode; // 0..1
  start?: string;   // e.g., 'top top'
  end?: string;     // e.g., '+=200%'
  pin?: boolean;
  scrub?: boolean | number;
  heightVh?: number; // container height in vh to create scroll room
  className?: string;
  markers?: boolean;
};

export default function ScrollScene({
  children,
  start = 'top top',
  end = '+=200%',
  pin = true,
  scrub = true,
  heightVh = 200,
  className,
  markers = false,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    ensureGSAP();
    if (!containerRef.current || !contentRef.current) return;

    if (reduced) {
      setProgress(0);
      return;
    }

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: containerRef.current!,
        start,
        end,
        pin,
        scrub,
        markers,
        onUpdate: (self) => setProgress(self.progress),
      });
      return () => st.kill();
    }, containerRef);

    return () => ctx.revert();
  }, [start, end, pin, scrub, markers, reduced]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ height: `${heightVh}vh`, position: 'relative' }}
    >
      <div
        ref={contentRef}
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'grid',
          placeItems: 'center',
          overflow: 'hidden',
        }}
      >
        {children(progress)}
      </div>
    </div>
  );
}
