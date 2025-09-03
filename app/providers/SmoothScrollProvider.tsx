'use client';

import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

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
          lerp: 0.075,          // Smoother, more cinematic
          wheelMultiplier: 0.8,  // Slightly slower for better control
          smoothWheel: true,
          touchMultiplier: 1.5,
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          infinite: false
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

        // Animation for scroll progress bar
        gsap.to('.scroll-progress-bar', {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
          }
        });

        // Hero section animations
        const setupHeroAnimations = () => {
          // Hero parallax
          gsap.to('.hero-bg', {
            y: 200,
            ease: 'none',
            scrollTrigger: {
              trigger: '.hero-section',
              start: 'top top',
              end: 'bottom top',
              scrub: 1.5,
            }
          });

          // Hero content fade out on scroll
          gsap.to('.hero-content', {
            opacity: 0,
            y: -50,
            ease: 'none',
            scrollTrigger: {
              trigger: '.hero-section',
              start: 'top top',
              end: '50% top',
              scrub: 1,
            }
          });
        };

        // Split text animations
        const setupSplitTextAnimations = () => {
          const splitTexts = document.querySelectorAll('.split-text');
          splitTexts.forEach((element) => {
            const split = new SplitType(element as HTMLElement, { 
              types: 'chars,words',
              tagName: 'span'
            });
            
            gsap.from(split.chars, {
              opacity: 0,
              y: 20,
              rotateX: -90,
              stagger: 0.02,
              duration: 0.5,
              ease: 'back.out(1.7)',
              scrollTrigger: {
                trigger: element,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
              }
            });
          });
        };

        // Reveal animations
        const setupRevealAnimations = () => {
          gsap.utils.toArray('.reveal').forEach((element: any) => {
            gsap.from(element, {
              y: 60,
              opacity: 0,
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: element,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
              }
            });
          });

          // Fade in animations
          gsap.utils.toArray('.fade-in').forEach((element: any) => {
            gsap.from(element, {
              opacity: 0,
              duration: 1.2,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: element,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
              }
            });
          });
        };

        // Project cards animations
        const setupProjectAnimations = () => {
          gsap.utils.toArray('.project-card-3d').forEach((card: any, index: number) => {
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
              }
            });
            
            tl.from(card, {
              rotateY: 30,
              opacity: 0,
              x: index % 2 === 0 ? -50 : 50,
              duration: 1,
              ease: 'power3.out'
            });
          });
        };

        // Background color transitions
        const setupColorTransitions = () => {
          const sections = gsap.utils.toArray('.color-section');
          sections.forEach((section: any) => {
            const bgColor = section.dataset.bgcolor || '#0A0A0B';
            
            ScrollTrigger.create({
              trigger: section,
              start: 'top 50%',
              end: 'bottom 50%',
              onEnter: () => gsap.to('body', { backgroundColor: bgColor, duration: 0.6 }),
              onEnterBack: () => gsap.to('body', { backgroundColor: bgColor, duration: 0.6 }),
            });
          });
        };

        // Magnetic hover effect
        const setupMagneticButtons = () => {
          const magneticElements = document.querySelectorAll('.magnetic');
          
          magneticElements.forEach((elem) => {
            elem.addEventListener('mousemove', (e: any) => {
              const rect = elem.getBoundingClientRect();
              const x = e.clientX - rect.left - rect.width / 2;
              const y = e.clientY - rect.top - rect.height / 2;
              
              gsap.to(elem, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: 'power2.out'
              });
            });
            
            elem.addEventListener('mouseleave', () => {
              gsap.to(elem, {
                x: 0,
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
              });
            });
          });
        };

        // Initialize all animations after DOM is ready
        setTimeout(() => {
          setupHeroAnimations();
          setupSplitTextAnimations();
          // setupRevealAnimations(); // Disabled - conflicts with Framer Motion
          // setupProjectAnimations(); // Disabled - conflicts with Framer Motion
          setupColorTransitions();
          setupMagneticButtons();
          ScrollTrigger.refresh();
        }, 100);

        // Refresh after images load
        window.addEventListener('load', () => {
          ScrollTrigger.refresh();
        });

        console.log('Enhanced smooth scroll initialized with cinematic animations');
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

  return (
    <>
      {/* Scroll progress bar */}
      <div className="scroll-progress-bar fixed top-0 left-0 h-1 w-full bg-gradient-to-r from-primary to-accent transform-gpu origin-left scale-x-0 z-50" />
      {children}
    </>
  );
}
