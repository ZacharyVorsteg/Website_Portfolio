'use client';
import React, { useEffect, useRef } from 'react';
import { ensureGSAP, gsap, ScrollTrigger } from './scroll/gsap';
import { usePrefersReducedMotion } from './scroll/usePrefersReducedMotion';

export default function CinematicScroll() {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced || typeof window === 'undefined') return;
    
    // Delay to ensure DOM is ready
    const timer = setTimeout(() => {
      ensureGSAP();
      
      // Refresh ScrollTrigger after page loads
      ScrollTrigger.refresh();
      
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
          scrub: 1,
          pin: true,
          pinSpacing: true,
          markers: false, // Set to true to debug
          onUpdate: (self) => {
            console.log('Hero scroll progress:', self.progress);
          }
        }
      })
      .to(hero, {
        scale: 1.5,
        opacity: 0.3,
        ease: 'power2.inOut',
      })
      .to(hero.querySelectorAll('h1, p, div'), {
        y: -200,
        opacity: 0,
        stagger: 0.05,
        ease: 'power2.inOut',
      }, 0);
    } else {
      console.log('Hero not found!');
    }

    // 3D CARD FLIP ON PROJECTS
    const projectCards = gsap.utils.toArray('.project-card-3d');
    projectCards.forEach((card: any, i) => {
      gsap.set(card, {
        transformPerspective: 1000,
        transformStyle: 'preserve-3d',
      });

      gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: 'top bottom-=100',
          end: 'top center',
          scrub: 1,
        }
      })
      .from(card, {
        rotateY: i % 2 === 0 ? -90 : 90,
        opacity: 0,
        scale: 0.8,
        duration: 1,
      });
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
          scrub: 1,
          snap: 1 / (slides.length - 1),
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
        scale: 0,
        y: 100,
        rotateZ: () => gsap.utils.random(-20, 20),
        duration: 0.8,
        stagger: 0.02,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: text,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
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

    }, 100); // Small delay for DOM
    
    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [reduced]);

  return null;
}
