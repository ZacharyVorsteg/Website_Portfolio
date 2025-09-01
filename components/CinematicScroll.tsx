'use client';
import React, { useEffect, useRef } from 'react';
import { ensureGSAP, gsap, ScrollTrigger } from './scroll/gsap';
import { usePrefersReducedMotion } from './scroll/usePrefersReducedMotion';

export default function CinematicScroll() {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced || typeof window === 'undefined') return;
    
    // Initialize immediately without delay
    ensureGSAP();
    
    // Configure ScrollTrigger for better performance
    ScrollTrigger.config({
      limitCallbacks: true,
      syncInterval: 40
    });
    
    // Kill existing ScrollTriggers to avoid conflicts
    ScrollTrigger.getAll().forEach(st => st.kill());

    // CINEMATIC ZOOM EFFECT ON HERO
    const hero = document.querySelector('#hero');
    if (hero) {
      console.log('Hero found, applying cinematic zoom');
      
      // Set initial state
      gsap.set(hero, {
        transformOrigin: 'center center',
        willChange: 'transform, opacity'
      });
      
      gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: '+=100%',
          scrub: 0.5, // Reduced scrub for more responsive feel
          pin: true,
          pinSpacing: true,
          anticipatePin: 1, // Improves pin smoothness
          fastScrollEnd: true,
          preventOverlaps: true,
          markers: false
        }
      })
      .to(hero, {
        scale: 1.3, // Reduced scale for smoother animation
        opacity: 0.4,
        ease: 'none', // Linear for smooth scrubbing
        duration: 1
      })
      .to(hero.querySelectorAll('h1, p, div'), {
        y: -100, // Reduced movement
        opacity: 0,
        stagger: 0.02, // Faster stagger
        ease: 'none',
        duration: 1
      }, 0);
    } else {
      console.log('Hero not found!');
    }

    // 3D CARD FLIP ON PROJECTS - Optimized for smoothness
    const projectCards = gsap.utils.toArray('.project-card-3d') as Element[];
    
    // Use batch for better performance
    ScrollTrigger.batch(projectCards as Element[], {
      onEnter: (batch) => gsap.to(batch, {
        opacity: 1,
        y: 0,
        rotateY: 0,
        scale: 1,
        stagger: 0.08,
        duration: 0.5,
        ease: 'power2.out',
        overwrite: 'auto'
      }),
      onLeave: (batch) => gsap.to(batch, {
        opacity: 0,
        y: 50,
        duration: 0.3
      }),
      onEnterBack: (batch) => gsap.to(batch, {
        opacity: 1,
        y: 0,
        rotateY: 0,
        scale: 1,
        stagger: 0.05,
        duration: 0.3,
        overwrite: 'auto'
      }),
      onLeaveBack: (batch) => gsap.to(batch, {
        opacity: 0,
        y: -50,
        duration: 0.3
      }),
      start: 'top bottom-=100',
      end: 'bottom top+=100'
    });
    
    // Set initial state
    gsap.set(projectCards, {
      opacity: 0,
      y: 60,
      rotateY: -15,
      scale: 0.95,
      transformPerspective: 800,
      transformStyle: 'preserve-3d'
    });

    // HORIZONTAL SCROLL SECTION
    const horizontalSection = document.querySelector('.horizontal-scroll');
    if (horizontalSection) {
      const slides = horizontalSection.querySelectorAll('.slide');
      const totalWidth = slides.length * 100;

      gsap.to(slides, {
        xPercent: -100 * (slides.length - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: horizontalSection,
          pin: true,
          scrub: 0.3, // Much more responsive
          snap: {
            snapTo: 1 / (slides.length - 1),
            duration: { min: 0.2, max: 0.4 },
            delay: 0,
            ease: 'power1.inOut'
          },
          anticipatePin: 1,
          fastScrollEnd: true,
          end: () => `+=${totalWidth}%`,
        }
      });
    }

    // SPLIT TEXT ZOOM EFFECT
    const splitTexts = gsap.utils.toArray('.split-text');
    splitTexts.forEach((text: any) => {
      const chars = text.innerText.split('');
      text.innerHTML = chars.map((char: string) => 
        `<span class="inline-block">${char === ' ' ? '&nbsp;' : char}</span>`
      ).join('');

      gsap.from(text.children, {
        opacity: 0,
        y: 30,
        duration: 0.4,
        stagger: 0.008, // Faster stagger
        ease: 'power2.out',
        scrollTrigger: {
          trigger: text,
          start: 'top 85%',
          toggleActions: 'play none none none', // Only play once for performance
          fastScrollEnd: true
        }
      });
    });

    // MORPH BACKGROUND GRADIENT
    const sections = gsap.utils.toArray('section');
    sections.forEach((section: any, i) => {
      const colors = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      ];

      ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          gsap.to('body', {
            background: colors[i % colors.length],
            duration: 1,
          });
        },
        onEnterBack: () => {
          gsap.to('body', {
            background: colors[i % colors.length],
            duration: 1,
          });
        },
      });
    });

    // STICKY ELEMENTS WITH SCALE
    const stickyElements = gsap.utils.toArray('.sticky-scale');
    stickyElements.forEach((el: any) => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        pin: true,
        pinSpacing: false,
        onUpdate: (self) => {
          const scale = 1 + (self.progress * 0.5);
          const opacity = 1 - (self.progress * 0.5);
          gsap.set(el, { scale, opacity });
        }
      });
    });

    // REVEAL WITH CLIP PATH
    const revealElements = gsap.utils.toArray('.clip-reveal');
    revealElements.forEach((el: any) => {
      gsap.set(el, {
        clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
      });

      gsap.to(el, {
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        duration: 1.5,
        ease: 'power4.inOut',
        scrollTrigger: {
          trigger: el,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        }
      });
    });

    // SMOOTH SCROLL WITH LERP
    let currentScroll = 0;
    let targetScroll = 0;
    const ease = 0.1;

    const smoothScroll = () => {
      targetScroll = window.scrollY;
      currentScroll += (targetScroll - currentScroll) * ease;
      
      gsap.set('.smooth-container', {
        y: -currentScroll,
      });

      requestAnimationFrame(smoothScroll);
    };

    // Start smooth scroll if container exists
    if (document.querySelector('.smooth-container')) {
      smoothScroll();
    }

    // Refresh after images load
    window.addEventListener('load', () => {
      ScrollTrigger.refresh();
    });
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      window.removeEventListener('load', () => {});
    };
  }, [reduced]);

  return null;
}
