'use client'

import React, { useEffect, useRef, ReactNode } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

// Optional smooth scrolling (only run in browser)
let LenisInstance: any = null

function useLenisSmoothScroll() {
  const shouldReduceMotion = useReducedMotion()
  
  useEffect(() => {
    if (shouldReduceMotion) return
    
    try {
      if (typeof window !== 'undefined') {
        import('lenis').then(({ default: Lenis }) => {
          // Avoid double init in fast refresh
          if (!LenisInstance) {
            const lenis = new Lenis({ 
              lerp: 0.12, 
              smoothWheel: true,
              wheelMultiplier: 1,
              touchMultiplier: 2,
              infinite: false
            })
            LenisInstance = lenis
            
            const raf = (time: number) => {
              lenis.raf(time)
              requestAnimationFrame(raf)
            }
            requestAnimationFrame(raf)
          }
        }).catch(() => {
          console.log('Lenis not loaded, using native scroll')
        })
      }
    } catch (error) {
      console.log('Smooth scroll initialization error:', error)
    }
    
    return () => {
      if (LenisInstance) {
        LenisInstance.destroy()
        LenisInstance = null
      }
    }
  }, [shouldReduceMotion])
}

interface RevealProps {
  children: ReactNode
  delay?: number
}

export const Reveal: React.FC<RevealProps> = ({ children, delay = 0 }) => {
  const shouldReduceMotion = useReducedMotion()
  
  if (shouldReduceMotion) {
    return <>{children}</>
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ 
        duration: 0.6, 
        ease: 'easeOut',
        delay
      }}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  )
}

interface ParallaxProps {
  children: ReactNode
  offset?: number
}

export const Parallax: React.FC<ParallaxProps> = ({ children, offset = 50 }) => {
  const shouldReduceMotion = useReducedMotion()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset])
  
  if (shouldReduceMotion) {
    return <div ref={ref}>{children}</div>
  }
  
  return (
    <motion.div ref={ref} style={{ y }} className="will-change-transform">
      {children}
    </motion.div>
  )
}

interface ScaleInProps {
  children: ReactNode
}

export const ScaleIn: React.FC<ScaleInProps> = ({ children }) => {
  const shouldReduceMotion = useReducedMotion()
  
  if (shouldReduceMotion) {
    return <>{children}</>
  }
  
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  )
}

interface FadeInProps {
  children: ReactNode
  direction?: 'up' | 'down' | 'left' | 'right'
  delay?: number
}

export const FadeIn: React.FC<FadeInProps> = ({ 
  children, 
  direction = 'up',
  delay = 0 
}) => {
  const shouldReduceMotion = useReducedMotion()
  
  const directionOffset = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: 40 },
    right: { x: -40 }
  }
  
  if (shouldReduceMotion) {
    return <>{children}</>
  }
  
  return (
    <motion.div
      initial={{ 
        opacity: 0,
        ...directionOffset[direction]
      }}
      whileInView={{ 
        opacity: 1,
        x: 0,
        y: 0
      }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ 
        duration: 0.6,
        delay,
        ease: 'easeOut'
      }}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  )
}

export default function ScrollEffects() {
  useLenisSmoothScroll()
  
  const shouldReduceMotion = useReducedMotion()
  
  // Hero zoom effect
  const heroRef = useRef(null)
  const { scrollYProgress: heroProg } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  })
  
  const heroScale = useTransform(heroProg, [0, 1], [1, 1.15])
  const heroOpacity = useTransform(heroProg, [0, 0.8, 1], [1, 1, 0.8])
  
  // Page parallax
  const { scrollY } = useScroll()
  const parallaxY = useTransform(scrollY, [0, 1200], [0, -120])
  
  return (
    <>
      {/* Export the hero ref for use in Hero component */}
      <div className="hidden" data-hero-ref={heroRef} />
      
      {/* Demo Section - Hidden by default, can be enabled for testing */}
      {false && (
        <div className="scroll-effects-demo">
          {/* Hero with zoom */}
          <section ref={heroRef} className="se-section se-hero">
            <motion.div
              style={{ 
                scale: shouldReduceMotion ? 1 : heroScale, 
                opacity: shouldReduceMotion ? 1 : heroOpacity,
                willChange: 'transform, opacity'
              }}
              className="se-hero-img-wrapper"
            >
              <div className="se-hero-content">
                <h1>Scroll Magic Demo</h1>
                <p>This hero zooms as you scroll</p>
              </div>
            </motion.div>
          </section>

          {/* Parallax cards */}
          <section className="se-section se-parallax">
            <motion.div 
              style={{ y: shouldReduceMotion ? 0 : parallaxY }} 
              className="se-parallax-inner"
            >
              <h2>Parallax Cards</h2>
              <div className="se-card-row">
                {[1, 2, 3].map(i => (
                  <Reveal key={i} delay={i * 0.1}>
                    <div className="se-card">
                      <h3>Card {i}</h3>
                      <p>Reveals on scroll with parallax</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </motion.div>
          </section>
        </div>
      )}
    </>
  )
}

// Export animation hooks for use in other components
export function useScrollProgress() {
  return useScroll()
}

export function useParallax(offset = 50) {
  const { scrollY } = useScroll()
  return useTransform(scrollY, [0, 1000], [0, offset])
}
