'use client';

import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function OptimizedScroll() {
  const mainRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Horizontal scroll section - ultra smooth
      const horizontalSection = document.querySelector('.horizontal-scroll');
      if (horizontalSection) {
        const slides = horizontalSection.querySelectorAll('.slide');
        
        if (slides.length > 0) {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: horizontalSection,
              start: 'top top',
              end: () => `+=${slides.length * 100}%`,
              scrub: 0.25,  // Very responsive
              pin: true,
              anticipatePin: 1,
              fastScrollEnd: true,
              snap: {
                snapTo: 1 / (slides.length - 1),
                duration: { min: 0.2, max: 0.3 },
                ease: 'power1.inOut'
              }
            }
          });

          tl.to(slides, {
            xPercent: -100 * (slides.length - 1),
            ease: 'none'
          });
        }
      }

      // Background color morphing between sections
      const sections = gsap.utils.toArray('section');
      const colors = [
        '#0b1020', // Dark blue
        '#0f152e', // Darker blue
        '#10224a', // Navy
        '#0b1020', // Back to dark
      ];

      sections.forEach((section: any, i) => {
        const nextColor = colors[i % colors.length];
        
        ScrollTrigger.create({
          trigger: section,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter: () => {
            gsap.to('body', {
              backgroundColor: nextColor,
              duration: 0.6,
              ease: 'power2.inOut'
            });
          },
          onEnterBack: () => {
            gsap.to('body', {
              backgroundColor: nextColor,
              duration: 0.6,
              ease: 'power2.inOut'
            });
          }
        });
      });

      // Sticky scale sections
      gsap.utils.toArray('.sticky-scale').forEach((element: any) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: element,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 0.3,
            fastScrollEnd: true
          }
        });

        tl.fromTo(element, 
          { scale: 0.9, opacity: 0.5 },
          { scale: 1, opacity: 1, ease: 'power2.out' }
        );
      });

      // Parallax layers with different speeds
      gsap.utils.toArray('.parallax-layer').forEach((layer: any) => {
        const speed = layer.dataset.speed || 0.5;
        
        gsap.to(layer, {
          yPercent: -50 * parseFloat(speed),
          ease: 'none',
          scrollTrigger: {
            trigger: layer,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.3,
            fastScrollEnd: true
          }
        });
      });

      // Text reveal animations (lightweight)
      gsap.utils.toArray('.text-reveal').forEach((text: any) => {
        gsap.fromTo(text,
          { 
            opacity: 0,
            y: 20
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: text,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });

    }, mainRef);

    return () => ctx.revert();
  }, []);

  return <div ref={mainRef} className="optimized-scroll-container" />;
}
