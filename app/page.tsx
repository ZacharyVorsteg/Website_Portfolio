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
    // Check if visited recently (within 24 hours)
    const hasVisitedRecently = localStorage.getItem('lastVisit')
    const now = Date.now()
    
    if (hasVisitedRecently && (now - parseInt(hasVisitedRecently)) < 86400000) {
      // Skip animation if visited recently
      setIsLoading(false)
      return
    }
    
    // Set last visit time
    localStorage.setItem('lastVisit', now.toString())
    
    // Reduced loading time to 1.5 seconds
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleSkipLoading = () => {
    setIsLoading(false)
  }

  if (isLoading) {
    return <LoadingScreen onSkip={handleSkipLoading} />
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
