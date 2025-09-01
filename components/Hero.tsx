'use client'

import { useEffect, useRef } from 'react'
import { ArrowDown, Sparkles } from 'lucide-react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import Typed from 'typed.js'
import { FadeIn } from './ScrollEffects'

const Hero = () => {
  const typedRef = useRef(null)
  const heroRef = useRef(null)
  const shouldReduceMotion = useReducedMotion()
  
  // Scroll-based animations
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  })
  
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, 0.3])
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100])

  useEffect(() => {
    const typed = new Typed(typedRef.current, {
      strings: [
        'Full-Stack Developer',
        'FinTech Engineer',
        'FAU Finance Graduate',
        'Economics Minor',
        'DeFi Enthusiast',
        'Data Analyst',
        'Problem Solver',
      ],
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 2000,
      loop: true,
      showCursor: true,
      cursorChar: '|',
    })

    return () => typed.destroy()
  }, [])

  return (
    <motion.section 
      ref={heroRef}
      id="hero" 
      className="min-h-screen flex items-center justify-center relative px-4 overflow-hidden hero-cinematic"
      style={{
        scale: shouldReduceMotion ? 1 : heroScale,
        opacity: shouldReduceMotion ? 1 : heroOpacity,
        y: shouldReduceMotion ? 0 : heroY,
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
    >
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 20}s`,
            }}
          >
            <Sparkles className="w-3 h-3 text-primary/20" />
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto text-center z-10">
        {/* Main heading with animation */}
        <FadeIn direction="down">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="block text-foreground mb-2">Hi, I'm</span>
            <span className="gradient-text text-6xl md:text-8xl">Zachary Vorsteg</span>
          </h1>
        </FadeIn>

        {/* Typed text */}
        <FadeIn delay={0.2}>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            <span ref={typedRef}></span>
          </p>
        </FadeIn>

        {/* Description */}
        <FadeIn delay={0.4}>
          <p className="text-lg text-secondary-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
            Bridging finance and technology with a unique perspective. FAU Finance graduate (2020) 
            turned Full-Stack Developer, specializing in FinTech solutions and data-driven applications.
          </p>
        </FadeIn>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up animation-delay-600">
          <a
            href="#projects"
            className="btn-primary inline-flex items-center justify-center gap-2"
          >
            View My Work
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </a>
          <a
            href="#contact"
            className="btn-secondary inline-flex items-center justify-center"
          >
            Get In Touch
          </a>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-3 gap-8 animate-fade-up animation-delay-800">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold gradient-text">10+</div>
            <div className="text-sm text-muted-foreground mt-1">Projects</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold gradient-text">3+</div>
            <div className="text-sm text-muted-foreground mt-1">Years Experience</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold gradient-text">5+</div>
            <div className="text-sm text-muted-foreground mt-1">Technologies</div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowDown className="w-6 h-6 text-muted-foreground" />
      </div>
    </motion.section>
  )
}

export default Hero
