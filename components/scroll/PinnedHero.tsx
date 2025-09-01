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
    // Initialize Typed.js
    const typed = new Typed(typedRef.current, {
      strings: [
        'Full-Stack Developer',
        'FinTech Innovator',
        'React Specialist',
        'Problem Solver',
        'Finance + Tech Expert'
      ],
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 2000,
      loop: true,
      showCursor: true,
      cursorChar: '|'
    });

    // GSAP Timeline for smooth scrubbed animations
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=150%',
          scrub: 0.3,          // Very responsive
          pin: true,
          anticipatePin: 1,
          fastScrollEnd: true,
          invalidateOnRefresh: true
        }
      });

      // Smooth, performant animations using only transform and opacity
      tl.to(bgRef.current, { 
        scale: 1.3,
        opacity: 0.4
      }, 0)
      .to(contentRef.current, {
        y: -80,
        opacity: 0.3
      }, 0)
      .to(titleRef.current, { 
        letterSpacing: '0.2em',
        scale: 1.1
      }, 0)
      .to(subRef.current, { 
        y: -20,
        opacity: 0
      }, 0.1);

    }, sectionRef);

    return () => {
      typed.destroy();
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
            <span ref={typedRef}></span>
          </p>
          <p className="hero-description">
            Transforming finance expertise into innovative tech solutions
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-60">
        <div className="animate-bounce">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 5v14M19 12l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </section>
  );
}
