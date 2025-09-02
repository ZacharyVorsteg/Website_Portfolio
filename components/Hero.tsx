'use client'

import { useEffect, useRef } from 'react'
import { ArrowDown, Sparkles } from 'lucide-react'
import Typed from 'typed.js'

const Hero = () => {
  const typedRef = useRef(null)
  const heroRef = useRef(null)

  useEffect(() => {
    const typed = new Typed(typedRef.current, {
      strings: [
        'Fractional CFO',
        'CEO & Founder',
        'Data Scientist',
        'Full-Stack Developer',
        'Financial Architect',
        'ML Engineer',
        'Strategic Advisor',
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
    <section 
      ref={heroRef}
      id="hero" 
      className="hero-section color-section"
      data-bgcolor="#0A0A0B"
    >
      {/* Background with parallax */}
      <div className="hero-bg absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float opacity-0 animate-fade-in"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 20}s`,
            }}
          >
            <Sparkles className="w-2 h-2 md:w-3 md:h-3 text-primary/30" />
          </div>
        ))}
      </div>

      <div className="hero-content max-w-6xl mx-auto text-center z-10 px-4">
        {/* Main heading with split text animation */}
        <div className="mb-8">
          <h1 className="hero-title">
            <span className="block text-4xl md:text-5xl lg:text-6xl font-light text-muted-foreground mb-4 reveal">
              Hi, I'm
            </span>
            <span className="split-text gradient-text-animated text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight">
              Zachary Vorsteg
            </span>
          </h1>
        </div>

        {/* Typed text with enhanced styling */}
        <div className="hero-subtitle mb-8 reveal">
          <p className="text-xl md:text-2xl lg:text-3xl text-primary/80 font-light">
            <span ref={typedRef}></span>
          </p>
        </div>

        {/* Description with fade in */}
        <div className="hero-description max-w-3xl mx-auto mb-12 fade-in">
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Unique hybrid executive bridging finance, strategy, and technology. 
            <span className="text-foreground font-medium"> Fractional CFO</span> driving 
            operational excellence through 
            <span className="text-primary font-medium"> AI-powered financial models</span> and 
            <span className="text-accent font-medium"> full-stack development</span> expertise.
          </p>
        </div>

        {/* CTA Buttons with magnetic effect */}
        <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center mb-20">
          <a
            href="#projects"
            className="btn-primary magnetic inline-flex items-center justify-center gap-2 relative overflow-hidden group"
          >
            <span className="relative z-10">View My Work</span>
            <ArrowDown className="w-4 h-4 animate-bounce relative z-10" />
          </a>
          <a
            href="#contact"
            className="btn-secondary magnetic inline-flex items-center justify-center relative overflow-hidden group"
          >
            <span className="relative z-10">Get In Touch</span>
          </a>
        </div>

        {/* Stats with stagger animation */}
        <div className="grid grid-cols-3 gap-8 md:gap-12">
          <div className="text-center reveal">
            <div className="text-4xl md:text-5xl lg:text-6xl font-bold gradient-text-animated mb-2">
              13+
            </div>
            <div className="text-sm md:text-base text-muted-foreground">
              Demo Projects
            </div>
          </div>
          <div className="text-center reveal" style={{animationDelay: '0.1s'}}>
            <div className="text-4xl md:text-5xl lg:text-6xl font-bold gradient-text-animated mb-2">
              4+
            </div>
            <div className="text-sm md:text-base text-muted-foreground">
              Domains
            </div>
          </div>
          <div className="text-center reveal" style={{animationDelay: '0.2s'}}>
            <div className="text-4xl md:text-5xl lg:text-6xl font-bold gradient-text-animated mb-2">
              15+
            </div>
            <div className="text-sm md:text-base text-muted-foreground">
              Technologies
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-muted-foreground uppercase tracking-widest">
            Scroll
          </span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-muted-foreground to-transparent" />
          <ArrowDown className="w-5 h-5 text-muted-foreground animate-bounce" />
        </div>
      </div>
    </section>
  )
}

export default Hero
