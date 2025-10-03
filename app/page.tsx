'use client'

import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import HorizontalShowcase from '@/components/HorizontalShowcase'
import Projects from '@/components/Projects'
import Skills from '@/components/Skills'
import About from '@/components/About'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="relative">
        {/* Simple background gradient */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        </div>

        {/* Content sections */}
        <Hero />
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
