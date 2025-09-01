'use client';
import React from 'react';
import { TrendingUp, DollarSign, BarChart3, Coins, Calculator, PieChart } from 'lucide-react';

export default function HorizontalShowcase() {
  const showcases = [
    {
      title: 'Financial Modeling',
      description: 'Complex financial models with real-time calculations',
      icon: <Calculator className="w-12 h-12" />,
      gradient: 'from-purple-600 to-pink-600',
    },
    {
      title: 'Market Analysis',
      description: 'Live market data visualization and trend analysis',
      icon: <TrendingUp className="w-12 h-12" />,
      gradient: 'from-blue-600 to-cyan-600',
    },
    {
      title: 'Portfolio Management',
      description: 'Advanced portfolio tracking with P&L analysis',
      icon: <PieChart className="w-12 h-12" />,
      gradient: 'from-green-600 to-emerald-600',
    },
    {
      title: 'DeFi Integration',
      description: 'Smart contract deployment and Web3 solutions',
      icon: <Coins className="w-12 h-12" />,
      gradient: 'from-orange-600 to-red-600',
    },
    {
      title: 'Risk Assessment',
      description: 'Quantitative risk models and stress testing',
      icon: <BarChart3 className="w-12 h-12" />,
      gradient: 'from-indigo-600 to-purple-600',
    },
  ];

  return (
    <section className="horizontal-scroll relative h-screen overflow-hidden bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="absolute inset-0 flex items-center">
        <div className="flex gap-8 px-8">
          {showcases.map((item, index) => (
            <div
              key={index}
              className="slide min-w-[400px] h-[500px] relative"
            >
              <div className={`h-full rounded-3xl bg-gradient-to-br ${item.gradient} p-1`}>
                <div className="h-full bg-background/95 backdrop-blur-xl rounded-3xl p-8 flex flex-col justify-center items-center text-center">
                  <div className={`p-6 rounded-2xl bg-gradient-to-br ${item.gradient} mb-6 text-white`}>
                    {item.icon}
                  </div>
                  <h3 className="text-3xl font-bold mb-4 gradient-text">{item.title}</h3>
                  <p className="text-lg text-muted-foreground">{item.description}</p>
                  
                  {/* Animated background elements */}
                  <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className={`absolute w-64 h-64 bg-gradient-to-br ${item.gradient} rounded-full blur-3xl opacity-10`}
                        style={{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          animation: `float ${10 + i * 2}s ease-in-out infinite`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="text-sm">Scroll horizontally</span>
          <div className="animate-pulse">→</div>
        </div>
      </div>
    </section>
  );
}
