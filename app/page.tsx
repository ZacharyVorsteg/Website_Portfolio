'use client'

import { useEffect, useState } from 'react'
import PinnedHero from '@/components/scroll/PinnedHero'
import Navigation from '@/components/Navigation'
import Projects from '@/components/Projects'
import Skills from '@/components/Skills'
import About from '@/components/About'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import LoadingScreen from '@/components/LoadingScreen'
import BatchReveal from '@/components/scroll/BatchReveal'
import OptimizedScroll from '@/components/OptimizedScroll'
import HorizontalShowcase from '@/components/HorizontalShowcase'
// import ScrollDemoButton from '@/components/ScrollDemoButton' - Removed

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
      <OptimizedScroll />
      <Navigation />
      <main className="relative">
        {/* Animated background gradient - optimized */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        </div>

        {/* Content sections */}
        <PinnedHero />
        <HorizontalShowcase />
        <Projects />
        <Skills />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
