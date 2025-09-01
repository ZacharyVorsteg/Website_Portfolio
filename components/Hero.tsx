'use client'

import { useEffect, useRef } from 'react'
import { ArrowDown, Sparkles } from 'lucide-react'
import Typed from 'typed.js'

const Hero = () => {
  const typedRef = useRef(null)

  useEffect(() => {
    const typed = new Typed(typedRef.current, {
      strings: [
        'Full-Stack Developer',
        'React Specialist',
        'UI/UX Enthusiast',
        'Problem Solver',
        'Creative Thinker',
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
    <section id="hero" className="min-h-screen flex items-center justify-center relative px-4">
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
        <div className="animate-fade-down">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="block text-foreground mb-2">Hi, I'm</span>
            <span className="gradient-text text-6xl md:text-8xl">Zachary Vorsteg</span>
          </h1>
        </div>

        {/* Typed text */}
        <div className="animate-fade-up animation-delay-200">
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            <span ref={typedRef}></span>
          </p>
        </div>

        {/* Description */}
        <div className="animate-fade-up animation-delay-400">
          <p className="text-lg text-secondary-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
            Crafting exceptional digital experiences with modern web technologies.
            Specialized in building scalable, performant applications that delight users.
          </p>
        </div>

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
    </section>
  )
}

export default Hero
