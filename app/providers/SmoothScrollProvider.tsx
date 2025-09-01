'use client';

import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let lenis: any | null = null;
    let rafId = 0;

    const reduced = typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

    // Don't force smoothing for reduced-motion users
    if (reduced) {
      console.log('Reduced motion detected, skipping smooth scroll');
      return;
    }

    (async () => {
      try {
        const { default: Lenis } = await import('lenis');
        
        lenis = new Lenis({
          lerp: 0.08,            // Slightly crisper for better response
          wheelMultiplier: 0.85,  // Better control on all devices
          smoothWheel: true,
          touchMultiplier: 1.2,
          duration: 1.0,          // Faster response
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          infinite: false,
          autoResize: true
        });

        // Single RAF to drive both Lenis and ScrollTrigger
        const raf = (time: number) => {
          lenis!.raf(time);
          ScrollTrigger.update(); // Update ST in sync with Lenis
          rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);

        // Optimize ScrollTrigger settings
        ScrollTrigger.defaults({ 
          anticipatePin: 1,
          fastScrollEnd: true 
        });
        
        ScrollTrigger.config({
          ignoreMobileResize: true,
          autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
          limitCallbacks: true,
          syncInterval: 40
        });

        // Refresh after images load
        window.addEventListener('load', () => {
          ScrollTrigger.refresh();
        });

        console.log('Smooth scroll initialized with Lenis + ScrollTrigger sync');
      } catch (error) {
        console.error('Failed to initialize smooth scroll:', error);
      }
    })();

    return () => {
      cancelAnimationFrame(rafId);
      try { 
        lenis?.destroy?.(); 
        // Don't kill all ScrollTriggers - let components manage their own
      } catch {}
    };
  }, []);

  return <>{children}</>;
}
