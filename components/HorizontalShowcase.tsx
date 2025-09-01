'use client';
import React, { useLayoutEffect, useRef } from 'react';
import { TrendingUp, DollarSign, BarChart3, Coins, Calculator, PieChart } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HorizontalShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const showcases = [
    {
      title: 'Financial Modeling',
      description: 'Complex financial models with real-time calculations',
      icon: <Calculator className="w-16 h-16" />,
      gradient: 'from-purple-600 to-pink-600',
      bgColor: 'rgba(147, 51, 234, 0.1)',
    },
    {
      title: 'Market Analysis',
      description: 'Live market data visualization and trend analysis',
      icon: <TrendingUp className="w-16 h-16" />,
      gradient: 'from-blue-600 to-cyan-600',
      bgColor: 'rgba(59, 130, 246, 0.1)',
    },
    {
      title: 'Portfolio Management',
      description: 'Advanced portfolio tracking with P&L analysis',
      icon: <PieChart className="w-16 h-16" />,
      gradient: 'from-green-600 to-emerald-600',
      bgColor: 'rgba(34, 197, 94, 0.1)',
    },
    {
      title: 'DeFi Integration',
      description: 'Smart contract deployment and Web3 solutions',
      icon: <Coins className="w-16 h-16" />,
      gradient: 'from-orange-600 to-red-600',
      bgColor: 'rgba(251, 146, 60, 0.1)',
    },
    {
      title: 'Risk Assessment',
      description: 'Quantitative risk models and stress testing',
      icon: <BarChart3 className="w-16 h-16" />,
      gradient: 'from-indigo-600 to-purple-600',
      bgColor: 'rgba(99, 102, 241, 0.1)',
    },
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const slides = gsap.utils.toArray('.showcase-slide');
      
      if (slides.length > 0) {
        // Create horizontal scroll
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: () => `+=${slides.length * 100}%`,
            scrub: 0.5,
            pin: true,
            anticipatePin: 1,
            fastScrollEnd: true,
          }
        });

        // Animate slides horizontally
        tl.to(slides, {
          xPercent: -100 * (slides.length - 1),
          ease: 'none',
        });

        // Add parallax effect to each card
        slides.forEach((slide: any, i) => {
          const card = slide.querySelector('.showcase-card');
          const icon = slide.querySelector('.showcase-icon');
          
          gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: () => `top+=${i * window.innerHeight} top`,
              end: () => `top+=${(i + 1) * window.innerHeight} top`,
              scrub: 0.5,
            }
          })
          .fromTo(card, 
            { scale: 0.8, opacity: 0.5 },
            { scale: 1, opacity: 1, ease: 'power2.out' }
          )
          .fromTo(icon,
            { rotate: -10 },
            { rotate: 10, ease: 'power2.inOut' },
            0
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="horizontal-showcase-section relative h-screen overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background" />
      
      {/* Title that stays fixed */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-2">
          <span className="gradient-text">FinTech Expertise</span>
        </h2>
        <p className="text-muted-foreground">Scroll to explore my specialized areas</p>
      </div>

      {/* Horizontal container */}
      <div ref={containerRef} className="absolute inset-0 flex items-center">
        <div className="flex">
          {showcases.map((item, index) => (
            <div
              key={index}
              className="showcase-slide flex-shrink-0 w-screen h-screen flex items-center justify-center px-8"
            >
              <div className="showcase-card relative max-w-md w-full">
                {/* Glow effect */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-20 blur-3xl`}
                  style={{ transform: 'scale(1.2)' }}
                />
                
                {/* Card content */}
                <div className="relative bg-background/80 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center">
                  {/* Focal point - Icon */}
                  <div className="showcase-icon mx-auto mb-8">
                    <div 
                      className={`inline-flex p-8 rounded-3xl bg-gradient-to-br ${item.gradient} text-white shadow-2xl`}
                      style={{
                        boxShadow: `0 20px 40px ${item.bgColor}`,
                      }}
                    >
                      {item.icon}
                    </div>
                  </div>

                  {/* Title - Secondary focal point */}
                  <h3 className="text-3xl md:text-4xl font-bold mb-4">
                    <span className={`bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}>
                      {item.title}
                    </span>
                  </h3>

                  {/* Description */}
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>

                  {/* Card number indicator */}
                  <div className="absolute top-6 right-6 text-4xl font-bold text-white/5">
                    0{index + 1}
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-xl" />
                  <div className="absolute -top-4 -left-4 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center gap-3">
          {showcases.map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full bg-white/30 transition-all duration-300 showcase-dot"
              data-index={index}
            />
          ))}
        </div>
        <p className="text-center text-xs text-muted-foreground mt-2">Scroll horizontally →</p>
      </div>
    </section>
  );
}