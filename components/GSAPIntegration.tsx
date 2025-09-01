'use client';
import React, { useEffect, useRef } from 'react';
import { ensureGSAP, gsap, ScrollTrigger } from './scroll/gsap';
import { usePrefersReducedMotion } from './scroll/usePrefersReducedMotion';

export default function GSAPIntegration() {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    ensureGSAP();

    // Animate all sections with class "gsap-fade"
    const fadeElements = gsap.utils.toArray('.gsap-fade');
    fadeElements.forEach((element: any) => {
      gsap.fromTo(element, 
        { 
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: element,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    });

    // Animate project cards with stagger
    ScrollTrigger.batch('.project-card-gsap', {
      onEnter: (batch) => gsap.to(batch, {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        overwrite: true,
        duration: 0.8,
        ease: 'power2.out'
      }),
      onLeave: (batch) => gsap.to(batch, {
        opacity: 0,
        y: 100,
        stagger: 0.15,
        overwrite: true,
        duration: 0.5
      }),
      onEnterBack: (batch) => gsap.to(batch, {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        overwrite: true,
        duration: 0.8
      }),
      onLeaveBack: (batch) => gsap.to(batch, {
        opacity: 0,
        y: -100,
        stagger: 0.15,
        overwrite: true,
        duration: 0.5
      }),
      start: 'top bottom-=100',
      end: 'bottom top+=100'
    });

    // Set initial state for project cards
    gsap.set('.project-card-gsap', { opacity: 0, y: 100 });

    // Animate skill bars
    const skillBars = gsap.utils.toArray('.skill-bar-fill');
    skillBars.forEach((bar: any) => {
      const width = bar.getAttribute('data-width') || '0%';
      gsap.fromTo(bar,
        { width: '0%' },
        {
          width: width,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: bar,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // Text reveal animation for headers
    const headers = gsap.utils.toArray('.gsap-text-reveal');
    headers.forEach((header: any) => {
      const chars = header.textContent.split('');
      header.innerHTML = chars.map((char: string) => 
        `<span class="inline-block">${char === ' ' ? '&nbsp;' : char}</span>`
      ).join('');
      
      gsap.fromTo(header.children,
        { 
          opacity: 0,
          y: 20,
          rotateX: -90
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.02,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: header,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // Floating animation for decorative elements
    const floatingElements = gsap.utils.toArray('.gsap-float');
    floatingElements.forEach((element: any, i) => {
      gsap.to(element, {
        y: -20,
        duration: 2 + i * 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        delay: i * 0.2
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [reduced]);

  return null;
}
