'use client'

import { useState } from 'react'
import { ExternalLink, Github, Play, Code, TrendingUp, DollarSign, BarChart, Brain, Calculator, AlertCircle, LineChart, Target, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'

const Projects = () => {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)


  const projects = [
    // FINANCIAL STATEMENTS - Core CFO Competency
    {
      id: 1,
      title: 'P&L Statement',
      subtitle: 'Hierarchical Chart of Accounts',
      description: 'Interactive Income Statement with proper GAAP account hierarchy, real-time consolidation, and drill-down capabilities.',
      metrics: {
        accounts: '25+',
        views: '3 modes',
        metrics: 'Auto-calc'
      },
      liveUrl: '/projects/01-pl-statement/',
      githubUrl: 'https://github.com/ZacharyVorsteg/Website_Portfolio/tree/main/public/projects/01-pl-statement',
      category: 'cfo',
      tech: ['JavaScript', 'Chart.js', 'HTML5', 'CSS3'],
      gradient: 'from-emerald-600 to-teal-600',
      icon: <TrendingUp className="w-6 h-6" />,
      status: 'Live Demo',
      featured: true,
      demoNote: 'Full P&L with expandable account categories. Shows revenue → gross profit → operating income → net income flow. Includes variance analysis.'
    },
    {
      id: 2,
      title: 'Balance Sheet',
      subtitle: 'Financial Position Analysis',
      description: 'Complete Balance Sheet with automated ratio calculations, liquidity analysis, and working capital metrics.',
      metrics: {
        ratios: '12 KPIs',
        views: 'Multi-period',
        accuracy: 'Self-balancing'
      },
      liveUrl: '/projects/02-balance-sheet/',
      githubUrl: 'https://github.com/ZacharyVorsteg/Website_Portfolio/tree/main/public/projects/02-balance-sheet',
      category: 'cfo',
      tech: ['JavaScript', 'Chart.js', 'Financial Modeling'],
      gradient: 'from-blue-600 to-indigo-600',
      icon: <DollarSign className="w-6 h-6" />,
      status: 'Live Demo',
      featured: true,
      demoNote: 'Assets = Liabilities + Equity with automatic balance checking. Calculates current ratio, quick ratio, debt-to-equity, and more.'
    },
    {
      id: 3,
      title: 'Cash Flow Statement',
      subtitle: 'Direct & Indirect Methods',
      description: 'Sophisticated cash flow analysis with operating, investing, and financing activities. Includes reconciliation.',
      metrics: {
        methods: 'Both',
        sections: '3 activities',
        fcf: 'Auto-calc'
      },
      liveUrl: '/projects/03-cash-flow-statement/',
      githubUrl: 'https://github.com/ZacharyVorsteg/Website_Portfolio/tree/main/public/projects/03-cash-flow-statement',
      category: 'cfo',
      tech: ['JavaScript', 'Chart.js', 'GAAP Standards'],
      gradient: 'from-purple-600 to-pink-600',
      icon: <LineChart className="w-6 h-6" />,
      status: 'Live Demo',
      featured: true,
      demoNote: 'Shows both indirect (from Net Income) and direct (cash receipts/payments) methods. Auto-reconciles to Balance Sheet cash.'
    },
    
    // SECOND ROW - Technical Financial Tools
    {
      id: 4,
      title: 'Working Capital Optimizer',
      subtitle: 'Cash Conversion Cycle Analysis',
      description: 'Interactive dashboard for optimizing DSO, DIO, and DPO. Shows real-time cash release potential.',
      metrics: {
        impact: 'Cash release',
        sliders: 'Real-time',
        benchmarks: 'Industry'
      },
      liveUrl: '/projects/04-working-capital-optimizer/',
      githubUrl: 'https://github.com/ZacharyVorsteg/Website_Portfolio/tree/main/public/projects/04-working-capital-optimizer',
      category: 'cfo',
      tech: ['JavaScript', 'Chart.js', 'Financial Analytics'],
      gradient: 'from-cyan-600 to-teal-600',
      icon: <Zap className="w-6 h-6" />,
      status: 'Live Demo',
      featured: true,
      demoNote: 'Adjust payment terms and see immediate cash impact. Calculates CCC and provides optimization recommendations.'
    },
    {
      id: 5,
      title: 'Budget Variance Analysis',
      subtitle: 'Real-time Performance Tracking',
      description: 'Comprehensive budget vs actual analysis with drill-down capabilities, threshold alerts, and action items.',
      metrics: {
        views: 'Heatmap',
        alerts: 'Threshold',
        export: 'PDF/Excel'
      },
      liveUrl: '/projects/05-budget-variance-analysis/',
      githubUrl: 'https://github.com/ZacharyVorsteg/Website_Portfolio/tree/main/public/projects/05-budget-variance-analysis',
      category: 'cfo',
      tech: ['JavaScript', 'Chart.js', 'Data Visualization'],
      gradient: 'from-indigo-600 to-purple-600',
      icon: <BarChart className="w-6 h-6" />,
      status: 'Live Demo',
      featured: true,
      demoNote: 'Identifies variances exceeding thresholds. Includes forecast accuracy metrics and required action items.'
    },
    {
      id: 6,
      title: 'Valuation Simulator',
      subtitle: 'DCF + Multiples Analysis',
      description: 'Advanced valuation tool with DCF modeling, comparable company analysis, and Monte Carlo simulation.',
      metrics: {
        methods: 'DCF + Comps',
        sensitivity: 'Real-time',
        scenarios: 'Monte Carlo'
      },
      liveUrl: '/projects/06-valuation-simulator/',
      githubUrl: 'https://github.com/ZacharyVorsteg/Website_Portfolio/tree/main/public/projects/06-valuation-simulator',
      category: 'cfo',
      tech: ['JavaScript', 'Financial Modeling', 'Statistics'],
      gradient: 'from-emerald-600 to-green-600',
      icon: <Calculator className="w-6 h-6" />,
      status: 'Live Demo',
      featured: true,
      demoNote: 'Enterprise valuation with WACC calculation, terminal value, and football field chart. Includes CAPM and sensitivity tables.'
    },
    
    // THIRD ROW - Cross-functional Tools
    {
      id: 7,
      title: 'Growth Funnel Simulator',
      subtitle: 'Marketing → MRR Projections',
      description: 'Visualize how marketing spend and conversion rates cascade through your funnel to MRR. Real-time funnel charts.',
      metrics: {
        stages: '5 funnel',
        metrics: 'CAC/LTV',
        output: 'MRR forecast'
      },
      liveUrl: '/projects/07-growth-funnel-simulator/',
      githubUrl: 'https://github.com/ZacharyVorsteg/Website_Portfolio/tree/main/public/projects/07-growth-funnel-simulator',
      category: 'ceo',
      tech: ['JavaScript', 'Chart.js', 'Growth Modeling'],
      gradient: 'from-blue-600 to-indigo-600',
      icon: <Target className="w-6 h-6" />,
      status: 'Live Demo',
      featured: false,
      demoNote: 'Adjust CAC, conversion rates, and see instant MRR impact. Shows strategic thinking + technical execution.'
    },
    {
      id: 8,
      title: 'Customer Churn Predictor',
      subtitle: 'ML with Business Impact',
      description: 'Machine learning model predicting customer churn with direct revenue impact calculations and intervention strategies.',
      metrics: {
        accuracy: '89%',
        saved: '$612k/mo',
        roi: '551%'
      },
      liveUrl: '/projects/08-churn-predictor/',
      githubUrl: 'https://github.com/ZacharyVorsteg/Website_Portfolio/tree/main/public/projects/08-churn-predictor',
      category: 'datascience',
      tech: ['JavaScript', 'ML Algorithms', 'Predictive Analytics'],
      gradient: 'from-red-600 to-orange-600',
      icon: <AlertCircle className="w-6 h-6" />,
      status: 'Live Demo',
      featured: false,
      demoNote: 'Interactive risk gauge shows churn probability. Calculates revenue at risk and optimal intervention strategies.'
    },
    {
      id: 9,
      title: 'Revenue Forecast Engine',
      subtitle: 'Advanced Time Series Analysis',
      description: 'Sophisticated forecasting with Holt-Winters, cohort modeling, and seasonal decomposition. Includes confidence intervals.',
      metrics: {
        horizon: '12 months',
        methods: '3 models',
        accuracy: 'Backtested'
      },
      liveUrl: '/projects/09-revenue-forecast-engine/',
      githubUrl: 'https://github.com/ZacharyVorsteg/Website_Portfolio/tree/main/public/projects/09-revenue-forecast-engine',
      category: 'datascience',
      tech: ['JavaScript', 'Statistics', 'Time Series'],
      gradient: 'from-purple-600 to-pink-600',
      icon: <TrendingUp className="w-6 h-6" />,
      status: 'Live Demo',
      featured: false,
      demoNote: 'Triple exponential smoothing with cohort-based revenue modeling. Shows seasonal patterns and growth trends.'
    },

    // DATA SCIENTIST PROJECTS - Advanced Analytics
    {
      id: 10,
      title: 'Predictive Healthcare Outcomes',
      subtitle: 'Heart Disease Risk Prediction',
      description: 'ML model analyzing patient data to predict heart disease risk using logistic regression with interactive ROC curves and feature importance.',
      metrics: {
        accuracy: '89.2%',
        patients: '500 records',
        features: '6 variables'
      },
      liveUrl: '/projects/10-healthcare-predictor/',
      githubUrl: 'https://github.com/ZacharyVorsteg/Website_Portfolio/tree/main/public/projects/10-healthcare-predictor',
      category: 'datascience',
      tech: ['JavaScript', 'ML.js', 'Chart.js', 'Statistics'],
      gradient: 'from-green-600 to-emerald-600',
      icon: <Brain className="w-6 h-6" />,
      status: 'Live Demo',
      featured: false,
      demoNote: 'Interactive thresholds, ROC analysis, and SHAP-like feature importance. Demonstrates clinical ML applications.'
    },
    {
      id: 11,
      title: 'Fraud Detection System',
      subtitle: 'Anomaly Detection Engine',
      description: 'Real-time fraud detection using Isolation Forest algorithm on credit card transactions with interactive anomaly scoring.',
      metrics: {
        precision: '94.7%',
        transactions: '1000+ daily',
        detection: 'Real-time'
      },
      liveUrl: '/projects/11-fraud-detection/',
      githubUrl: 'https://github.com/ZacharyVorsteg/Website_Portfolio/tree/main/public/projects/11-fraud-detection',
      category: 'datascience',
      tech: ['JavaScript', 'Anomaly Detection', 'Data Visualization'],
      gradient: 'from-red-600 to-pink-600',
      icon: <AlertCircle className="w-6 h-6" />,
      status: 'Live Demo',
      featured: false,
      demoNote: 'Isolation Forest implementation with transaction scoring and interactive threshold adjustment for fraud detection.'
    },
    {
      id: 12,
      title: 'Startup Survival Predictor',
      subtitle: '3-Year Survival Analysis',
      description: 'Random Forest model predicting startup survival based on funding, burn rate, team size, and growth metrics.',
      metrics: {
        accuracy: '87.4%',
        startups: '300 companies',
        features: '5 key metrics'
      },
      liveUrl: '/projects/12-startup-survival/',
      githubUrl: 'https://github.com/ZacharyVorsteg/Website_Portfolio/tree/main/public/projects/12-startup-survival',
      category: 'datascience',
      tech: ['JavaScript', 'Random Forest', 'Business Analytics'],
      gradient: 'from-purple-600 to-indigo-600',
      icon: <TrendingUp className="w-6 h-6" />,
      status: 'Live Demo',
      featured: false,
      demoNote: 'Feature importance analysis and survival probability calculator with interactive input sliders.'
    },

    // RSM PROJECTS - Sales Management Analytics
    {
      id: 13,
      title: 'Territory Performance Dashboard',
      subtitle: 'Sales Rep Analytics',
      description: 'Comprehensive sales performance tracking across territories with quota attainment, revenue analysis, and rep leaderboards.',
      metrics: {
        territories: '3 regions',
        reps: '10 active',
        metrics: 'Real-time'
      },
      liveUrl: '/projects/13-territory-performance/',
      githubUrl: 'https://github.com/ZacharyVorsteg/Website_Portfolio/tree/main/public/projects/13-territory-performance',
      category: 'rsm',
      tech: ['JavaScript', 'Chart.js', 'Sales Analytics'],
      gradient: 'from-blue-600 to-cyan-600',
      icon: <BarChart className="w-6 h-6" />,
      status: 'Live Demo',
      featured: false,
      demoNote: 'Interactive territory comparison with attainment tracking, revenue breakdowns, and performance rankings.'
    },
    {
      id: 14,
      title: 'Pipeline Health Analyzer',
      subtitle: 'Opportunity Management',
      description: 'Advanced pipeline analysis with stage progression funnels, weighted forecasting, and win-rate optimization insights.',
      metrics: {
        opportunities: '200+ deals',
        stages: '6 pipeline',
        forecasting: 'Weighted'
      },
      liveUrl: '/projects/14-pipeline-analyzer/',
      githubUrl: 'https://github.com/ZacharyVorsteg/Website_Portfolio/tree/main/public/projects/14-pipeline-analyzer',
      category: 'rsm',
      tech: ['JavaScript', 'Pipeline Analytics', 'Forecasting'],
      gradient: 'from-orange-600 to-yellow-600',
      icon: <Target className="w-6 h-6" />,
      status: 'Live Demo',
      featured: false,
      demoNote: 'Funnel visualization with conversion rates, deal velocity analysis, and quota vs pipeline tracking.'
    },
    {
      id: 15,
      title: 'Forecast Accuracy Tracker',
      subtitle: 'Sales Prediction Analytics',
      description: 'Track and improve forecast accuracy with variance analysis, rep reliability scoring, and predictive insights.',
      metrics: {
        accuracy: '91.3%',
        periods: '12 months',
        reps: 'Individual'
      },
      liveUrl: '/projects/15-forecast-accuracy/',
      githubUrl: 'https://github.com/ZacharyVorsteg/Website_Portfolio/tree/main/public/projects/15-forecast-accuracy',
      category: 'rsm',
      tech: ['JavaScript', 'Time Series', 'Forecast Analytics'],
      gradient: 'from-teal-600 to-green-600',
      icon: <LineChart className="w-6 h-6" />,
      status: 'Live Demo',
      featured: false,
      demoNote: 'Forecast vs actual variance tracking with rep reliability rankings and accuracy improvement insights.'
    },
  ]

  // Show only the 6 fully functional featured projects
  const displayedProjects = projects.filter(p => p.featured)
  
  return (
    <section id="projects" className="py-20 px-4 relative" style={{ backgroundColor: '#0f172a' }}>
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
              Six fully functional financial and data science tools showcasing the intersection of 
              <span className="text-primary font-medium"> financial expertise</span> and 
              <span className="text-accent font-medium"> technical execution</span>.
            </p>
          </motion.div>
        </div>


        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {displayedProjects.map((project, index) => (
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

                  <div className="p-6">
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
                    <div className="flex gap-2">
                      {project.liveUrl !== '#' && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`
                            flex-1 py-3 px-3 rounded-xl font-medium text-sm
                            bg-gradient-to-r ${project.gradient} text-white
                            hover:shadow-lg transition-all duration-300
                            flex items-center justify-center gap-2
                            magnetic relative overflow-hidden group/btn
                          `}
                        >
                          <Play className="w-4 h-4" />
                          Demo
                        </a>
                      )}
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          flex-1 py-3 px-3 rounded-xl font-medium text-sm
                          bg-white/5 text-gray-300 border border-white/10
                          hover:bg-white/10 transition-all duration-300
                          flex items-center justify-center gap-2
                          magnetic relative overflow-hidden group/btn
                        "
                      >
                        <Code className="w-4 h-4" />
                        Source
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
              Each project is modular and self-contained. Click "Demo" to try it live, 
              or "Source" to view the code on GitHub.
            </p>
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