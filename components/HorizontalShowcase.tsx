'use client';
import React from 'react';
import { TrendingUp, DollarSign, BarChart3, Coins, Calculator, PieChart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HorizontalShowcase() {

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


  return (
    <section id="fintech-expertise" className="py-20 px-4 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background" />
      
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">FinTech Expertise</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Specialized areas where finance meets technology
            </p>
          </motion.div>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {showcases.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative"
            >
              <div className="relative h-full">
                {/* Glow effect */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500`}
                />
                
                {/* Card content */}
                <div className="relative bg-background/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center h-full">
                  {/* Icon */}
                  <div className="mx-auto mb-6">
                    <div 
                      className={`inline-flex p-6 rounded-3xl bg-gradient-to-br ${item.gradient} text-white shadow-xl transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
                      style={{
                        boxShadow: `0 20px 40px ${item.bgColor}`,
                      }}
                    >
                      {item.icon}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl md:text-2xl font-bold mb-4">
                    <span className={`bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}>
                      {item.title}
                    </span>
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>

                  {/* Card number indicator */}
                  <div className="absolute top-4 right-4 text-2xl font-bold text-white/5">
                    0{index + 1}
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-lg" />
                  <div className="absolute -top-2 -left-2 w-20 h-20 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-lg" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}