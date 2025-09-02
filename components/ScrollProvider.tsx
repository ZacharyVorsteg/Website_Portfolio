'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'

gsap.registerPlugin(ScrollTrigger)

export default function ScrollProvider() {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })
    
    lenisRef.current = lenis

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

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
    })

    // Hero animations
    const heroTimeline = gsap.timeline()
    
    heroTimeline
      .from('.hero-title', {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out'
      })
      .from('.hero-subtitle', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      }, '-=0.8')
      .from('.hero-description', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.6')
      .from('.hero-buttons > *', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out'
      }, '-=0.4')

    // Parallax effect for hero background
    gsap.to('.hero-bg', {
      y: 200,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }
    })

    // Split text animations
    const splitTexts = document.querySelectorAll('.split-text')
    splitTexts.forEach((element) => {
      const split = new SplitType(element as HTMLElement, { 
        types: 'chars,words',
        tagName: 'span'
      })
      
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
      })
    })

    // Reveal animations for sections
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
      })
    })

    // Project cards 3D effect
    gsap.utils.toArray('.project-card-3d').forEach((card: any) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      })
      
      tl.from(card, {
        rotateY: 45,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      })
    })

    // Background color transitions
    const sections = gsap.utils.toArray('.color-section')
    sections.forEach((section: any, i) => {
      const bgColor = section.dataset.bgcolor || '#0A0A0B'
      
      ScrollTrigger.create({
        trigger: section,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => gsap.to('body', { backgroundColor: bgColor, duration: 0.6 }),
        onEnterBack: () => gsap.to('body', { backgroundColor: bgColor, duration: 0.6 }),
      })
    })

    // Sticky scale effect
    gsap.utils.toArray('.sticky-scale').forEach((element: any) => {
      gsap.fromTo(element, 
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: element,
            start: 'top bottom',
            end: 'center center',
            scrub: true,
          }
        }
      )
    })

    // Clean up
    return () => {
      lenis.destroy()
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <>
      {/* Scroll progress bar */}
      <div className="scroll-progress-bar fixed top-0 left-0 h-1 w-full bg-gradient-to-r from-primary to-accent transform-gpu transform-origin-left z-50" />
    </>
  )
}
