import type { Metadata } from 'next'
import { Inter, Sora } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const sora = Sora({ 
  subsets: ['latin'],
  variable: '--font-sora',
})

export const metadata: Metadata = {
  title: 'Zachary Vorsteg | Fractional CFO • CEO • Data Scientist',
  description: 'Unique hybrid executive bridging finance, strategy, and technology. Interactive demos showcasing AI-powered financial models and full-stack development expertise.',
  keywords: 'Zachary Vorsteg, Fractional CFO, CEO, Data Scientist, Full-Stack Developer, Financial Models, AI, Machine Learning',
  authors: [{ name: 'Zachary Vorsteg' }],
  openGraph: {
    title: 'Zachary Vorsteg | Fractional CFO • CEO • Data Scientist',
    description: 'Interactive demos showcasing the intersection of financial expertise and technical execution.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zachary Vorsteg | Fractional CFO • CEO • Data Scientist',
    description: 'Interactive demos showcasing the intersection of financial expertise and technical execution.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${sora.variable} font-sans bg-background text-foreground antialiased`}>
        {children}
      </body>
    </html>
  )
}
