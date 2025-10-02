'use client';

import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Typed from 'typed.js';

gsap.registerPlugin(ScrollTrigger);

export default function PinnedHero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const typedRef = useRef<HTMLSpanElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {

    // GSAP Timeline for smooth scrubbed animations
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=100%',
          scrub: 1,              // Smoother scrubbing
          pin: true,
          anticipatePin: 1,
          fastScrollEnd: false,  // Prevent jumpy stops
          invalidateOnRefresh: true,
          preventOverlaps: true
        }
      });

      // Simplified animations to prevent glitching
      tl.to(bgRef.current, { 
        scale: 1.15,
        opacity: 0.7
      }, 0)
      .to(contentRef.current, {
        y: -50,
        opacity: 0.9
      }, 0);

    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="hero-section">
      <div ref={bgRef} className="hero-bg gpu">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-transparent to-black/50" />
      </div>
      
      <div ref={contentRef} className="hero-content">
        <div className="hero-inner">
          <h1 ref={titleRef} className="hero-title">
            Zachary Vorsteg
          </h1>
          <p ref={subRef} className="hero-subtitle">
            Full-Stack Developer | FinTech Innovator | Real Estate Tech
          </p>
          <p className="hero-description">
            Transforming finance expertise into innovative tech solutions
          </p>
        </div>
      </div>

      {/* Scroll indicator - clickable with pulse animation */}
      <button 
        onClick={() => document.getElementById('fintech-expertise')?.scrollIntoView({ behavior: 'smooth' })}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-70 hover:opacity-100 transition-opacity duration-300 cursor-pointer p-2"
        aria-label="Scroll to next section"
      >
        <div className="animate-bounce">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="animate-pulse">
            <path d="M12 5v14M19 12l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </button>
    </section>
  );
}
