'use client'

import { useEffect, useState } from 'react'

interface LoadingScreenProps {
  onSkip?: () => void
}

const LoadingScreen = ({ onSkip }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0)
  const [showSkip, setShowSkip] = useState(false)

  useEffect(() => {
    // Show skip button after 500ms
    const skipTimer = setTimeout(() => setShowSkip(true), 500)
    
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer)
          return 100
        }
        return prev + 8 // Increased from 5 for faster completion (1.5s total)
      })
    }, 120) // Reduced from 100ms

    return () => {
      clearInterval(timer)
      clearTimeout(skipTimer)
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      {/* Skip Button */}
      {showSkip && (
        <button
          onClick={onSkip}
          className="absolute top-6 right-6 px-4 py-2 text-sm text-muted-foreground hover:text-white border border-white/20 rounded-lg hover:bg-white/10 transition-all duration-200"
        >
          Skip Animation
        </button>
      )}
      
      <div className="text-center">
        {/* Logo Animation */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent animate-spin" style={{ animationDuration: '2s' }} />
            <div className="absolute inset-2 rounded-full bg-background flex items-center justify-center">
              <span className="text-3xl font-bold gradient-text">ZV</span>
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <h2 className="text-2xl font-bold mb-4 gradient-text">Loading Portfolio</h2>
        
        {/* Progress Bar */}
        <div className="w-64 mx-auto">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">{progress}%</p>
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen
