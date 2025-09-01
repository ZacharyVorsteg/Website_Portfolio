'use client';
import React, { useEffect, useRef } from 'react';
import { ensureGSAP, gsap, ScrollTrigger } from './gsap';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

type Props = {
  markers?: boolean;
};

export default function SVGDraw({ markers = false }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    ensureGSAP();
    if (!wrapRef.current || !pathRef.current || reduced) return;

    const path = pathRef.current;
    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len}`;
    path.style.strokeDashoffset = `${len}`;

    const ctx = gsap.context(() => {
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapRef.current!,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: true,
          markers,
        },
      });
    }, wrapRef);

    return () => ctx.revert();
  }, [markers, reduced]);

  return (
    <div ref={wrapRef} className="svgdraw-wrap">
      <svg
        className="svgdraw"
        viewBox="0 0 800 300"
        role="img"
        aria-label="Drawing path"
      >
        <path
          ref={pathRef}
          d="M20,250 C200,50 600,50 780,250
             M60,220 C240,120 560,120 740,220"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </svg>
      <p className="muted">SVG path self-draws as you scroll.</p>
    </div>
  );
}
