'use client'

import { useEffect, useState } from 'react'
import Hero from '@/components/Hero'
import Navigation from '@/components/Navigation'
import Projects from '@/components/Projects'
import Skills from '@/components/Skills'
import About from '@/components/About'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import LoadingScreen from '@/components/LoadingScreen'
import ScrollEffects from '@/components/ScrollEffects'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <>
      <ScrollEffects />
      <Navigation />
      <main className="relative">
        {/* Animated background gradient */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        </div>

        {/* Content sections */}
        <Hero />
        <Projects />
        <Skills />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
