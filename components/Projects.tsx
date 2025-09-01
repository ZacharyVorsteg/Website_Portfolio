'use client'

import { useState } from 'react'
import { ExternalLink, Github, Play, Code, Layers, Zap, TrendingUp, DollarSign, BarChart, Shield, Coins, Activity } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import BatchReveal from './scroll/BatchReveal'

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)

  const categories = [
    { id: 'all', label: 'All Projects', count: 6 },
    { id: 'fintech', label: 'FinTech', count: 3 },
    { id: 'defi', label: 'DeFi', count: 1 },
    { id: 'analytics', label: 'Analytics', count: 2 },
  ]

  const projects = [
    {
      id: 1,
      title: 'Professional Finance Toolkit',
      subtitle: 'Financial Modeling Demo',
      description: 'Interactive demonstration of financial calculations including compound interest, loan amortization, and Black-Scholes options pricing.',
      metrics: {
        features: '6 Calculators',
        charts: 'Interactive',
        type: 'Demo'
      },
      liveUrl: '/demos/fintech-calculator.html',
      githubUrl: 'https://github.com/ZacharyVorsteg/Website_Portfolio',
      category: 'fintech',
      tech: ['JavaScript', 'Chart.js', 'HTML5', 'CSS3'],
      gradient: 'from-violet-600 to-indigo-600',
      icon: <TrendingUp className="w-6 h-6" />,
      status: 'Live Demo',
      featured: true,
    },
    {
      id: 2,
      title: 'Professional Trading Terminal',
      subtitle: 'Interactive Trading Platform Demo',
      description: 'Full-featured trading terminal with real-time charts, Level 2 data, order entry system, and portfolio management.',
      metrics: {
        features: 'Order Entry',
        data: 'Level 2',
        type: 'Demo'
      },
      liveUrl: '/demos/market-analytics.html',
      githubUrl: 'https://github.com/ZacharyVorsteg/Website_Portfolio',
      category: 'fintech',
      tech: ['JavaScript', 'Chart.js', 'HTML5', 'CSS3'],
      gradient: 'from-blue-600 to-cyan-600',
      icon: <Activity className="w-6 h-6" />,
      status: 'Live Demo',
      featured: true,
    },
    {
      id: 3,
      title: 'Portfolio Risk Dashboard',
      subtitle: 'Risk Management Demo',
      description: 'Demonstration of institutional portfolio risk management including VaR calculations, stress testing, and correlation matrices.',
      metrics: {
        features: 'Risk Metrics',
        visualizations: '5 Types',
        type: 'Demo'
      },
      liveUrl: '/demos/crypto-portfolio.html',
      githubUrl: 'https://github.com/ZacharyVorsteg/Website_Portfolio',
      category: 'defi',
      tech: ['JavaScript', 'Chart.js', 'HTML5', 'CSS3'],
      gradient: 'from-emerald-600 to-green-600',
      icon: <Coins className="w-6 h-6" />,
      status: 'Live Demo',
      featured: true,
    },
    {
      id: 4,
      title: 'Executive P&L Dashboard',
      subtitle: 'Financial Reporting Demo',
      description: 'Interactive P&L statement with variance analysis, department breakdowns, and cash flow visualization.',
      metrics: {
        features: 'P&L Analysis',
        charts: '4 Types',
        type: 'Demo'
      },
      liveUrl: '/demos/executive-financials.html',
      githubUrl: 'https://github.com/ZacharyVorsteg/Website_Portfolio',
      category: 'analytics',
      tech: ['JavaScript', 'Chart.js', 'HTML5', 'CSS3'],
      gradient: 'from-orange-600 to-red-600',
      icon: <Shield className="w-6 h-6" />,
      status: 'Live Demo',
      featured: false,
    },
    {
      id: 5,
      title: 'Enterprise CRM System',
      subtitle: 'Sales Pipeline Demo',
      description: 'CRM interface demonstration featuring pipeline management, activity tracking, and revenue forecasting.',
      metrics: {
        features: 'Pipeline View',
        stages: '5 Stages',
        type: 'Demo'
      },
      liveUrl: '/demos/enterprise-crm.html',
      githubUrl: 'https://github.com/ZacharyVorsteg/Website_Portfolio',
      category: 'analytics',
      tech: ['JavaScript', 'Chart.js', 'HTML5', 'CSS3'],
      gradient: 'from-purple-600 to-pink-600',
      icon: <BarChart className="w-6 h-6" />,
      status: 'Live Demo',
      featured: false,
    },
    {
      id: 6,
      title: 'Deal Estate CRM',
      subtitle: 'Real Estate Platform',
      description: 'Full-featured real estate CRM currently in development. Features property management and deal tracking.',
      metrics: {
        status: 'In Progress',
        stack: 'React/Supabase',
        type: 'Active Project'
      },
      liveUrl: 'https://deal-estate.vercel.app',
      githubUrl: 'https://github.com/ZacharyVorsteg/deal-estate',
      category: 'defi',
      tech: ['React', 'Supabase', 'Tailwind', 'Vercel'],
      gradient: 'from-slate-600 to-zinc-600',
      icon: <Code className="w-6 h-6" />,
      status: 'In Development',
      featured: false,
    },
  ]

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(p => p.category === selectedCategory)

  return (
    <section id="projects" className="py-20 px-4 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="gradient-text">Featured Projects</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Enterprise-grade financial applications leveraging cutting-edge technology 
              and institutional-level analytics
            </p>
          </motion.div>
        </div>

        {/* Category Filter - Premium Design */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                relative px-6 py-3 rounded-2xl font-medium transition-all duration-300
                ${selectedCategory === category.id
                  ? 'text-white'
                  : 'text-muted-foreground hover:text-white'
                }
              `}
            >
              {/* Active background */}
              {selectedCategory === category.id && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              {/* Content */}
              <span className="relative z-10 flex items-center gap-2">
                {category.label}
                <span className={`
                  text-xs px-2 py-0.5 rounded-full
                  ${selectedCategory === category.id
                    ? 'bg-white/20'
                    : 'bg-white/5'
                  }
                `}>
                  {category.count}
                </span>
              </span>
            </motion.button>
          ))}
        </div>

        {/* Projects Grid - Premium Cards */}
        <BatchReveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                className="group relative reveal"
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
              >
                {/* Card Container */}
                <div className="relative h-full bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  {/* Status Badge */}
                  <div className="absolute top-6 right-6 z-10">
                    <span className={`
                      px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md
                      ${project.status === 'Production' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                        project.status === 'Live Demo' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        project.status === 'Beta' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                        'bg-gray-500/20 text-gray-400 border border-gray-500/30'}
                    `}>
                      {project.status}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    {/* Icon */}
                    <div className={`
                      w-14 h-14 rounded-2xl bg-gradient-to-br ${project.gradient} 
                      flex items-center justify-center text-white mb-6
                      shadow-lg shadow-black/20
                    `}>
                      {project.icon}
                    </div>

                    {/* Title & Subtitle */}
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold text-white mb-1">
                        {project.title}
                      </h3>
                      <p className="text-sm text-muted-foreground font-medium">
                        {project.subtitle}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-gray-400 leading-relaxed mb-6">
                      {project.description}
                    </p>

                    {/* Live Preview Window */}
                    {project.liveUrl !== '#' && !project.liveUrl.includes('deal-estate') && (
                      <div className="mb-6 rounded-xl overflow-hidden border border-white/10 bg-black/50">
                        <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                          </div>
                          <span className="text-xs text-gray-500">Live Preview</span>
                        </div>
                        <div className="relative w-full aspect-video bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden">
                          {hoveredProject === project.id ? (
                            <iframe
                              src={project.liveUrl}
                              className="absolute inset-0 w-full h-full"
                              title={project.title}
                              loading="lazy"
                              style={{ 
                                border: 'none',
                                pointerEvents: 'none',
                                transform: 'scale(1)',
                                transformOrigin: 'center'
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="text-center">
                                <Play className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">Hover to preview</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {Object.entries(project.metrics).map(([key, value], index) => (
                        <div key={key} className="text-center">
                          <div className="text-lg font-bold text-white">{value}</div>
                          <div className="text-xs text-gray-500 capitalize">{key}</div>
                        </div>
                      ))}
                    </div>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tech.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-white/5 backdrop-blur-sm rounded-lg text-xs text-gray-300 border border-white/10"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      {project.liveUrl !== '#' && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`
                            flex-1 py-3 px-4 rounded-xl font-medium text-sm
                            bg-gradient-to-r ${project.gradient} text-white
                            hover:shadow-lg transition-all duration-300
                            flex items-center justify-center gap-2
                          `}
                        >
                          <Play className="w-4 h-4" />
                          Live Demo
                        </a>
                      )}
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          flex-1 py-3 px-4 rounded-xl font-medium text-sm
                          bg-white/5 text-gray-300 border border-white/10
                          hover:bg-white/10 transition-all duration-300
                          flex items-center justify-center gap-2
                        "
                      >
                        <Github className="w-4 h-4" />
                        Source
                      </a>
                    </div>
                  </div>

                  {/* Hover Effect - Glow */}
                  <div className={`
                    absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none
                  `}>
                    <div className={`absolute inset-x-0 bottom-0 h-px bg-gradient-to-r ${project.gradient}`} />
                    <div className={`absolute inset-y-0 left-0 w-px bg-gradient-to-b ${project.gradient}`} />
                    <div className={`absolute inset-y-0 right-0 w-px bg-gradient-to-b ${project.gradient}`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </BatchReveal>

        {/* View More */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
        >
          <a
            href="https://github.com/ZacharyVorsteg"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 backdrop-blur-sm rounded-2xl text-white font-medium hover:bg-white/10 transition-all duration-300 border border-white/10"
          >
            <Github className="w-5 h-5" />
            View All Projects on GitHub
            <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export default Projects