'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface BatchRevealProps {
  children: React.ReactNode;
  selector?: string;
  stagger?: number;
  duration?: number;
}

export default function BatchReveal({ 
  children, 
  selector = '.reveal',
  stagger = 0.04,
  duration = 0.45
}: BatchRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Batch reveal for better performance
      ScrollTrigger.batch(selector, {
        interval: 0.1,          // More stable gathering
        batchMax: 4,            // Smaller batches for smoother reveals
        onEnter: (batch) => {
          gsap.fromTo(batch,
            { 
              y: 20,
              opacity: 0
            },
            { 
              y: 0,
              opacity: 1,
              duration: 0.6,
              stagger: 0.08,
              ease: 'power2.out',
              overwrite: 'auto'
            }
          );
        },
        onLeave: (batch) => {
          gsap.set(batch, { opacity: 0, y: 30 });
        },
        onEnterBack: (batch) => {
          gsap.to(batch, { 
            opacity: 1, 
            y: 0,
            scale: 1,
            duration: duration * 0.7,
            stagger: stagger * 0.5,
            overwrite: 'auto'
          });
        },
        onLeaveBack: (batch) => {
          gsap.set(batch, { opacity: 0, y: -30 });
        },
        start: 'top bottom-=50',
        end: 'bottom top+=50'
      });

      // Set initial state
      gsap.set(selector, {
        opacity: 0,
        y: 20
      });
    }, containerRef);

    return () => ctx.revert();
  }, [selector, stagger, duration]);

  return (
    <div ref={containerRef}>
      {children}
    </div>
  );
}

// Hook version for more control
export function useBatchReveal(selector = '.reveal', options = {}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const elements = gsap.utils.toArray(selector);
      
      ScrollTrigger.batch(elements as Element[], {
        interval: 0.1,
        batchMax: 6,
        ...options,
        onEnter: (batch) => {
          gsap.fromTo(batch,
            { y: 40, opacity: 0 },
            { 
              y: 0, 
              opacity: 1, 
              duration: 0.5, 
              stagger: 0.05, 
              ease: 'power2.out',
              overwrite: true
            }
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [selector, options]);

  return containerRef;
}
