import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import SmoothScrollProvider from './providers/SmoothScrollProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Zachary Vorsteg | Full-Stack Developer',
  description: 'Professional portfolio showcasing web development projects, skills, and expertise in React, TypeScript, and modern web technologies.',
  keywords: 'Zachary Vorsteg, web developer, portfolio, React, TypeScript, Next.js, full-stack developer',
  authors: [{ name: 'Zachary Vorsteg' }],
  openGraph: {
    title: 'Zachary Vorsteg | Full-Stack Developer',
    description: 'Professional portfolio showcasing web development projects and expertise.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zachary Vorsteg | Full-Stack Developer',
    description: 'Professional portfolio showcasing web development projects and expertise.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
