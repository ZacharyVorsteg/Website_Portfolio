'use client'

import { useState } from 'react'
import { ExternalLink, Github, Play, Code, TrendingUp, DollarSign, BarChart, Brain, Calculator, AlertCircle, LineChart, Target, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)

  const categories = [
    { id: 'all', label: 'All Projects', count: 9 },
    { id: 'cfo', label: 'CFO Tools', count: 3 },
    { id: 'ceo', label: 'CEO Strategy', count: 2 },
    { id: 'datascience', label: 'Data Science', count: 2 },
    { id: 'crossover', label: 'AI + Finance', count: 2 },
  ]

  const projects = [
    // TOP PRIORITY - Most Visual & Impactful
    {
      id: 1,
      title: 'Valuation Simulator',
      subtitle: 'DCF + Multiples Analysis',
      description: 'Interactive valuation tool with DCF modeling and comparable company analysis. Sliders adjust assumptions in real-time.',
      metrics: {
        runtime: '< 1 min',
        tech: 'Streamlit',
        value: 'CFO-grade'
      },
      liveUrl: '/demos/valuation-simulator-enhanced.html',
      githubUrl: 'https://github.com/ZacharyVorsteg/Website_Portfolio/blob/main/demo-scripts/valuation_simulator.py',
      demoScript: '/demo-scripts/valuation_simulator.py',
      category: 'cfo',
      tech: ['Python', 'Streamlit', 'Plotly', 'Pandas'],
      gradient: 'from-emerald-600 to-teal-600',
      icon: <Calculator className="w-6 h-6" />,
      status: 'Live Demo',
      featured: true,
      demoNote: 'DCF valuation with sensitivity analysis. Calculates enterprise value using multiple methods. Single Python file, runs instantly.'
    },
    {
      id: 2,
      title: 'Growth Funnel Simulator',
      subtitle: 'Marketing → MRR Projections',
      description: 'Visualize how marketing spend and conversion rates cascade through your funnel to MRR. Real-time funnel charts.',
      metrics: {
        runtime: 'Instant',
        tech: 'Streamlit',
        value: 'Scale-ready'
      },
      liveUrl: '/demos/growth-funnel.html',
      githubUrl: 'https://github.com/ZacharyVorsteg/Website_Portfolio/blob/main/demo-scripts/growth_funnel.py',
      demoScript: '/demo-scripts/growth_funnel.py',
      category: 'ceo',
      tech: ['Python', 'Streamlit', 'Plotly'],
      gradient: 'from-blue-600 to-indigo-600',
      icon: <Target className="w-6 h-6" />,
      status: 'Live Demo',
      featured: true,
      demoNote: 'Adjust CAC, conversion rates, and see instant MRR impact. Shows strategic thinking + technical execution.'
    },
    {
      id: 3,
      title: 'Customer Churn Predictor',
      subtitle: 'ML with ROC Curves',
      description: 'Logistic regression model predicting customer churn. Includes feature importance and ROC curve visualization.',
      metrics: {
        accuracy: '89%',
        features: '15 signals',
        output: 'Risk scores'
      },
      liveUrl: '/demos/churn-predictor-simple.html',
      githubUrl: 'https://github.com/ZacharyVorsteg/Website_Portfolio',
      demoScript: '/demo-scripts/churn_predictor.py',
      category: 'datascience',
      tech: ['Python', 'Scikit-learn', 'Matplotlib'],
      gradient: 'from-red-600 to-orange-600',
      icon: <AlertCircle className="w-6 h-6" />,
      status: 'Live Demo',
      featured: true,
      demoNote: 'Train/test on synthetic data. Outputs churn probability per customer + ROC curve. Pure Python, no external APIs.'
    },
    {
      id: 4,
      title: 'Revenue Forecast',
      subtitle: 'Time Series + Confidence Bands',
      description: 'ARIMA/Prophet forecasting with uncertainty intervals. Predicts next 12 months of revenue with confidence bands.',
      metrics: {
        horizon: '12 months',
        confidence: '95% CI',
        method: 'Prophet'
      },
      liveUrl: '/demos/revenue-forecast-enhanced.html',
      githubUrl: 'https://github.com/ZacharyVorsteg/Website_Portfolio',
      demoScript: '/demo-scripts/revenue_forecast.py',
      category: 'datascience',
      tech: ['Python', 'Prophet', 'Plotly'],
      gradient: 'from-purple-600 to-pink-600',
      icon: <TrendingUp className="w-6 h-6" />,
      status: 'Live Demo',
      featured: true,
      demoNote: 'Synthetic time series → fit Prophet model → beautiful forecast charts with uncertainty bands. CFO + Data Science credibility.'
    },

    // ADDITIONAL HIGH-IMPACT DEMOS
    {
      id: 5,
      title: 'Cash Flow Optimizer',
      subtitle: 'Allocation + Projections',
      description: 'Optimizes cash allocation across categories with linear programming. Shows surplus/deficit timeline.',
      metrics: {
        optimization: 'PuLP',
        categories: '8 types',
        horizon: '6 months'
      },
      liveUrl: '/demos/cashflow-optimizer.html',
      githubUrl: 'https://github.com/ZacharyVorsteg/Website_Portfolio',
      demoScript: '/demo-scripts/cashflow_optimizer.py',
      category: 'cfo',
      tech: ['Python', 'PuLP', 'Streamlit', 'Plotly'],
      gradient: 'from-green-600 to-emerald-600',
      icon: <DollarSign className="w-6 h-6" />,
      status: 'Live Demo',
      featured: false,
      demoNote: 'Linear optimization for cash management. Prevents cash crunches through automated allocation.'
    },
    {
      id: 6,
      title: 'Exit Scenario Calculator',
      subtitle: 'IRR/MOIC Analysis',
      description: 'Calculate investor returns based on exit multiples and timing. Generates IRR/MOIC charts instantly.',
      metrics: {
        scenarios: 'Unlimited',
        metrics: 'IRR + MOIC',
        export: 'PNG charts'
      },
      liveUrl: '/demos/exit-calculator-optimized.html',
      githubUrl: 'https://github.com/ZacharyVorsteg/Website_Portfolio',
      demoScript: '/demo-scripts/exit_calculator.py',
      category: 'ceo',
      tech: ['Python', 'Matplotlib', 'NumPy'],
      gradient: 'from-indigo-600 to-blue-600',
      icon: <BarChart className="w-6 h-6" />,
      status: 'Live Demo',
      featured: false,
      demoNote: 'Single Python file. Input exit year/multiple → outputs investor return metrics. Shows VC/PE math fluency.'
    },
    {
      id: 7,
      title: 'AI CFO Assistant',
      subtitle: 'Chat-based Q&A',
      description: 'Ask financial questions, get instant calculated answers. "What\'s my burn rate?" → computed response.',
      metrics: {
        queries: 'Natural language',
        data: 'Mock P&L',
        response: 'Instant'
      },
      liveUrl: '/demos/ai-cfo.html',
      githubUrl: 'https://github.com/ZacharyVorsteg/Website_Portfolio',
      demoScript: '/demo-scripts/ai_cfo_assistant.py',
      category: 'crossover',
      tech: ['Python', 'LangChain', 'Streamlit'],
      gradient: 'from-violet-600 to-purple-600',
      icon: <Brain className="w-6 h-6" />,
      status: 'Live Demo',
      featured: false,
      demoNote: 'Lightweight NLP for financial Q&A. Hard-coded mock data, no external LLM needed. Shows AI + finance fusion.'
    },
    {
      id: 8,
      title: 'M&A Target Screener',
      subtitle: 'Strategic Filtering',
      description: 'Screen 50 mock companies by growth, margin, and valuation. Outputs ranked acquisition targets.',
      metrics: {
        companies: '50 targets',
        filters: '6 criteria',
        output: 'Ranked list'
      },
      liveUrl: '/demos/ma-screener.html',
      githubUrl: 'https://github.com/ZacharyVorsteg/Website_Portfolio',
      demoScript: '/demo-scripts/ma_screener.py',
      category: 'crossover',
      tech: ['Python', 'Pandas', 'Streamlit'],
      gradient: 'from-orange-600 to-red-600',
      icon: <Zap className="w-6 h-6" />,
      status: 'Live Demo',
      featured: false,
      demoNote: 'Strategic analysis meets code. Filter/sort potential acquisitions. All synthetic data baked in.'
    },
    {
      id: 9,
      title: 'KPI Report Generator',
      subtitle: 'Automated PDF Reports',
      description: 'Load mock P&L data, calculate EBITDA/burn/runway, export polished PDF. Shows automation prowess.',
      metrics: {
        metrics: '15+ KPIs',
        format: 'PDF export',
        time: '< 10 sec'
      },
      liveUrl: '/demos/kpi-generator.html',
      githubUrl: 'https://github.com/ZacharyVorsteg/Website_Portfolio',
      demoScript: '/demo-scripts/kpi_generator.py',
      category: 'cfo',
      tech: ['Python', 'ReportLab', 'Pandas'],
      gradient: 'from-slate-600 to-zinc-600',
      icon: <LineChart className="w-6 h-6" />,
      status: 'Script Only',
      featured: false,
      demoNote: 'Python script that generates professional financial reports. Demonstrates automation + financial rigor.'
    },
  ]

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(p => p.category === selectedCategory)
  
  console.log('Projects:', projects.length, 'Filtered:', filteredProjects.length)

  return (
    <section id="projects" className="py-20 px-4 relative color-section" data-bgcolor="#0f172a">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
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
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="split-text gradient-text-animated">Demo-Ready Projects</span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Tight, modular demos with synthetic data baked in. Each project runs in under a minute, 
              showcasing the intersection of <span className="text-primary font-medium">financial expertise</span> and <span className="text-accent font-medium">technical execution</span>.
            </p>
            <div className="mt-4 flex justify-center gap-4 text-sm">
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg">
                ✓ Single-file builds
              </span>
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg">
                ✓ No external APIs
              </span>
              <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg">
                ✓ Instant results
              </span>
            </div>
          </motion.div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                relative px-6 py-3 rounded-2xl font-medium transition-all duration-300 magnetic
                ${selectedCategory === category.id
                  ? 'text-white shadow-lg shadow-primary/30'
                  : 'text-muted-foreground hover:text-white'
                }
              `}
            >
              {selectedCategory === category.id && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
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

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              className="group relative"
              style={{ opacity: 1, visibility: 'visible' }}
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                ease: [0.215, 0.61, 0.355, 1] 
              }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
                <div className="relative h-full glass-card rounded-3xl overflow-hidden transform-gpu">
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  {/* Status Badge */}
                  <div className="absolute top-6 right-6 z-10">
                    <span className={`
                      px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md
                      ${project.status === 'Live Demo' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        'bg-gray-500/20 text-gray-400 border border-gray-500/30'}
                    `}>
                      {project.status}
                    </span>
                  </div>

                  <div className="p-8">
                    {/* Icon */}
                    <div className={`
                      w-14 h-14 rounded-2xl bg-gradient-to-br ${project.gradient} 
                      flex items-center justify-center text-white mb-6
                      shadow-lg shadow-black/20 transform transition-all duration-300
                      ${hoveredProject === project.id ? 'rotate-12 scale-110' : ''}
                    `}>
                      {project.icon}
                    </div>

                    {/* Title & Subtitle */}
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold text-white mb-1 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent group-hover:bg-clip-text group-hover:text-transparent">
                        {project.title}
                      </h3>
                      <p className="text-sm text-muted-foreground font-medium">
                        {project.subtitle}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-gray-400 leading-relaxed mb-4">
                      {project.description}
                    </p>

                    {/* Demo Note */}
                    <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
                      <p className="text-xs text-gray-300">
                        💡 {project.demoNote}
                      </p>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {Object.entries(project.metrics).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="text-sm font-bold text-white">{value}</div>
                          <div className="text-xs text-gray-500 capitalize">{key}</div>
                        </div>
                      ))}
                    </div>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tech.map((tech, i) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-white/5 backdrop-blur-sm rounded-lg text-xs text-gray-300 border border-white/10 tech-badge transition-all duration-300 hover:bg-white/10 hover:border-white/20"
                          style={{
                            animationDelay: `${i * 0.05}s`,
                            transform: hoveredProject === project.id ? 'translateY(-2px)' : 'translateY(0)'
                          }}
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
                            magnetic relative overflow-hidden group/btn
                          `}
                        >
                          <Play className="w-4 h-4" />
                          Try Demo
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
                          magnetic relative overflow-hidden group/btn
                        "
                      >
                        <Code className="w-4 h-4" />
                        View Code
                      </a>
                    </div>
                  </div>

                  {/* Hover Glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className={`absolute inset-x-0 bottom-0 h-px bg-gradient-to-r ${project.gradient}`} />
                    <div className={`absolute inset-y-0 left-0 w-px bg-gradient-to-b ${project.gradient}`} />
                    <div className={`absolute inset-y-0 right-0 w-px bg-gradient-to-b ${project.gradient}`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        {/* Call to Action */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="glass-card rounded-2xl p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              <span className="gradient-text">Run These Demos Locally</span>
            </h3>
            <p className="text-gray-400 mb-6">
              Each project is a single Python file with all dependencies clearly documented. 
              Clone the repo and run any demo in under a minute.
            </p>
            <div className="bg-black/50 rounded-lg p-4 font-mono text-sm text-left mb-6">
              <div className="text-emerald-400"># Install and run any demo</div>
              <div className="text-gray-300">pip install streamlit pandas plotly</div>
              <div className="text-gray-300">streamlit run valuation_simulator.py</div>
            </div>
            <a
              href="https://github.com/ZacharyVorsteg"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl text-white font-medium hover:shadow-lg transition-all duration-300"
            >
              <Github className="w-5 h-5" />
              View All on GitHub
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Projects