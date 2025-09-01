'use client'

import { useState } from 'react'
import { ExternalLink, Github, Play, Code, Layers, Zap, TrendingUp, DollarSign, BarChart, Shield, Coins, Activity, Brain, Users, Calculator, ChartBar, AlertCircle, Database, Cpu, LineChart, PieChart, Target, Briefcase, Building } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import BatchReveal from './scroll/BatchReveal'

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)

  const categories = [
    { id: 'all', label: 'All Projects', count: 13 },
    { id: 'cfo', label: 'CFO Projects', count: 3 },
    { id: 'ceo', label: 'CEO Projects', count: 3 },
    { id: 'datascience', label: 'Data Science', count: 3 },
    { id: 'crossover', label: 'Cross-Over', count: 4 },
  ]

  const projects = [
    // CFO Projects with Developer Edge
    {
      id: 1,
      title: 'Dynamic SaaS Financial Model',
      subtitle: 'Interactive Web App + REST API',
      description: 'Live React app where visitors toggle growth rate, churn, and capex assumptions to watch financial models recalculate in real-time. Includes REST API endpoint for programmatic access.',
      metrics: {
        features: '10+ Metrics',
        api: 'REST/JSON',
        type: 'Live Demo'
      },
      liveUrl: '/demos/saas-financial-model',
      githubUrl: 'https://github.com/ZacharyVorsteg/saas-financial-model',
      category: 'cfo',
      tech: ['React', 'FastAPI', 'Python', 'Chart.js', 'Excel Export'],
      gradient: 'from-emerald-600 to-teal-600',
      icon: <Calculator className="w-6 h-6" />,
      status: 'Live Demo',
      featured: true,
      demoNote: 'Interactive financial model with live assumption toggles. Demonstrates both frontend expertise and financial modeling depth.'
    },
    {
      id: 2,
      title: 'Automated Commission Engine',
      subtitle: 'Python + Pandas + FastAPI',
      description: 'Automated system that ingests payroll CSVs, applies complex accrual rules, and reconciles to OneStream. Reduces 10 hours of manual entry to 2-minute script execution.',
      metrics: {
        efficiency: '300x Faster',
        accuracy: '100%',
        type: 'API + Excel'
      },
      liveUrl: '/demos/commission-engine',
      githubUrl: 'https://github.com/ZacharyVorsteg/commission-engine',
      category: 'cfo',
      tech: ['Python', 'Pandas', 'FastAPI', 'NumPy', 'Excel'],
      gradient: 'from-violet-600 to-purple-600',
      icon: <DollarSign className="w-6 h-6" />,
      status: 'Live Demo',
      featured: true,
      demoNote: 'Upload sample payroll CSV to see automated accrual calculations and reconciliation. Shows before vs. after efficiency gains.'
    },
    {
      id: 3,
      title: 'Cash Flow Forecast AI',
      subtitle: 'ML-Powered Dashboard + Alerts',
      description: 'Python ML model forecasts cash flows with automated variance alerts. React dashboard shows inflows, outflows, and triggers Slack/Email when variance exceeds 10%.',
      metrics: {
        accuracy: '94%',
        alerts: 'Automated',
        type: 'ML + Dashboard'
      },
      liveUrl: '/demos/cashflow-ai',
      githubUrl: 'https://github.com/ZacharyVorsteg/cashflow-ai',
      category: 'cfo',
      tech: ['Python', 'Scikit-learn', 'React', 'PostgreSQL', 'Slack API'],
      gradient: 'from-blue-600 to-cyan-600',
      icon: <TrendingUp className="w-6 h-6" />,
      status: 'Live Demo',
      featured: true,
      demoNote: 'Interactive dashboard with AI-powered cash flow predictions. Demonstrates finance + ML + full-stack development skills.'
    },

    // CEO Projects with Developer Edge
    {
      id: 4,
      title: 'Go-to-Market Playbook',
      subtitle: 'AI-Powered Scenario Tool',
      description: 'Web-based tool where users adjust ad spend, sales headcount, and CAC to see instant funnel projections. Shows strategic thinking with operational execution.',
      metrics: {
        scenarios: 'Unlimited',
        metrics: '15+ KPIs',
        type: 'Interactive'
      },
      liveUrl: '/demos/gtm-playbook',
      githubUrl: 'https://github.com/ZacharyVorsteg/gtm-playbook',
      category: 'ceo',
      tech: ['Next.js', 'Python', 'D3.js', 'PostgreSQL'],
      gradient: 'from-orange-600 to-red-600',
      icon: <Target className="w-6 h-6" />,
      status: 'Live Demo',
      featured: true,
      demoNote: 'Adjust growth levers to see real-time impact on funnel metrics. Demonstrates strategic + technical capabilities.'
    },
    {
      id: 5,
      title: 'Operational Efficiency Dashboard',
      subtitle: 'Full-Stack BI Clone',
      description: 'Next.js + Supabase dashboard pulling mock data from Stripe, HubSpot, and payroll. Role-based views for CEO vs CFO with key metrics.',
      metrics: {
        integrations: '5 APIs',
        views: 'Role-based',
        type: 'Full-Stack'
      },
      liveUrl: '/demos/ops-dashboard',
      githubUrl: 'https://github.com/ZacharyVorsteg/ops-dashboard',
      category: 'ceo',
      tech: ['Next.js', 'Supabase', 'Stripe API', 'HubSpot API', 'Tailwind'],
      gradient: 'from-indigo-600 to-blue-600',
      icon: <BarChart className="w-6 h-6" />,
      status: 'Live Demo',
      featured: false,
      demoNote: 'Enterprise dashboard with role-based access. Toggle between CEO and CFO views to see different metric priorities.'
    },
    {
      id: 6,
      title: 'Investor Pitch + Exit Model',
      subtitle: 'Interactive Valuation Tool',
      description: 'Web app lets VCs toggle revenue multiples and exit years to generate instant IRR/MOIC charts. Exports to boardroom-ready PDF reports.',
      metrics: {
        models: '5 Methods',
        export: 'PDF Ready',
        type: 'Interactive'
      },
      liveUrl: '/demos/investor-model',
      githubUrl: 'https://github.com/ZacharyVorsteg/investor-model',
      category: 'ceo',
      tech: ['React', 'Python', 'Chart.js', 'PDF Generation'],
      gradient: 'from-green-600 to-emerald-600',
      icon: <Briefcase className="w-6 h-6" />,
      status: 'Live Demo',
      featured: false,
      demoNote: 'Toggle valuation assumptions to see instant IRR/MOIC impact. Generates professional PDF reports for board meetings.'
    },

    // Data Science Projects with Developer Edge
    {
      id: 7,
      title: 'Options Auto-Sell Bot',
      subtitle: 'Backtest Engine + API',
      description: 'Python backtest engine for 5% exit strategy with Streamlit charts comparing bot performance vs S&P. Wrapped in REST API for programmatic access.',
      metrics: {
        backtest: '10 Years',
        returns: '+18% CAGR',
        type: 'Quant + API'
      },
      liveUrl: '/demos/options-bot',
      githubUrl: 'https://github.com/ZacharyVorsteg/options-bot',
      category: 'datascience',
      tech: ['Python', 'Streamlit', 'Plotly', 'FastAPI', 'NumPy'],
      gradient: 'from-purple-600 to-pink-600',
      icon: <Activity className="w-6 h-6" />,
      status: 'Live Demo',
      featured: true,
      demoNote: 'Interactive backtest with customizable parameters. Shows quantitative finance and engineering capabilities.'
    },
    {
      id: 8,
      title: 'Churn Prediction Model',
      subtitle: 'SaaS ML Pipeline + API',
      description: 'Train model on mock SaaS data, deployed with FastAPI. Upload CSV to get churn risk flags with full ML→API→UI pipeline.',
      metrics: {
        accuracy: '89%',
        features: '25 Signals',
        type: 'ML Pipeline'
      },
      liveUrl: '/demos/churn-prediction',
      githubUrl: 'https://github.com/ZacharyVorsteg/churn-prediction',
      category: 'datascience',
      tech: ['Python', 'Scikit-learn', 'FastAPI', 'React', 'PostgreSQL'],
      gradient: 'from-red-600 to-orange-600',
      icon: <AlertCircle className="w-6 h-6" />,
      status: 'Live Demo',
      featured: false,
      demoNote: 'Upload sample customer CSV to see churn predictions. Full ML pipeline from training to deployment.'
    },
    {
      id: 9,
      title: 'Real Estate Demand Heatmap',
      subtitle: 'AI Clustering + Maps',
      description: 'Scrapes Palm Beach flex warehouse listings, clusters by price/sqft with Scikit-learn, plots on interactive Mapbox with filters.',
      metrics: {
        listings: '500+',
        clusters: 'AI-Powered',
        type: 'Geo + ML'
      },
      liveUrl: '/demos/realestate-heatmap',
      githubUrl: 'https://github.com/ZacharyVorsteg/realestate-heatmap',
      category: 'datascience',
      tech: ['Python', 'Scikit-learn', 'Mapbox', 'BeautifulSoup', 'React'],
      gradient: 'from-teal-600 to-cyan-600',
      icon: <Building className="w-6 h-6" />,
      status: 'Live Demo',
      featured: false,
      demoNote: 'Interactive map with AI-powered clustering. Filter by size, price, and loading docks to find opportunities.'
    },

    // Cross-Over Projects
    {
      id: 10,
      title: 'AI-Powered CFO Dashboard',
      subtitle: 'KPIs + Anomaly Detection',
      description: 'Comprehensive hub with financial KPIs, ML-powered anomaly detection, and predictive cash flows. Built with Next.js + Python API.',
      metrics: {
        kpis: '50+ Metrics',
        ml: 'Anomaly Detection',
        type: 'AI + Finance'
      },
      liveUrl: '/demos/ai-cfo-dashboard',
      githubUrl: 'https://github.com/ZacharyVorsteg/ai-cfo-dashboard',
      category: 'crossover',
      tech: ['Next.js', 'Python', 'TensorFlow', 'PostgreSQL', 'Redis'],
      gradient: 'from-slate-600 to-zinc-600',
      icon: <Brain className="w-6 h-6" />,
      status: 'Live Demo',
      featured: true,
      demoNote: 'Enterprise CFO dashboard with AI-powered insights. Bridges finance, data science, and engineering expertise.'
    },
    {
      id: 11,
      title: 'Insurance Lead Scoring',
      subtitle: 'AI + Profitability Filter',
      description: 'AI agent evaluates insurance leads with quality scores and expected loss ratios. Web form frontend with ML backend pipeline.',
      metrics: {
        accuracy: '92%',
        roi: '3.5x',
        type: 'AI Agent'
      },
      liveUrl: '/demos/insurance-scoring',
      githubUrl: 'https://github.com/ZacharyVorsteg/insurance-scoring',
      category: 'crossover',
      tech: ['Python', 'XGBoost', 'FastAPI', 'React', 'Docker'],
      gradient: 'from-blue-600 to-indigo-600',
      icon: <Shield className="w-6 h-6" />,
      status: 'Live Demo',
      featured: false,
      demoNote: 'Submit test insurance leads to see AI scoring and profitability analysis. Shows insurtech domain expertise.'
    },
    {
      id: 12,
      title: 'SubTap Marketplace Simulator',
      subtitle: 'Mini Subcontractor Platform',
      description: 'Lightweight prototype showcasing subcontractor marketplace architecture: proposals, bids, completion rates. Product CEO + dev architect perspective.',
      metrics: {
        features: 'Full CRUD',
        architecture: 'Scalable',
        type: 'Platform Demo'
      },
      liveUrl: '/demos/subtap-simulator',
      githubUrl: 'https://github.com/ZacharyVorsteg/subtap-simulator',
      category: 'crossover',
      tech: ['Next.js', 'Prisma', 'PostgreSQL', 'Stripe', 'WebSockets'],
      gradient: 'from-yellow-600 to-orange-600',
      icon: <Users className="w-6 h-6" />,
      status: 'Live Demo',
      featured: false,
      demoNote: 'Interactive marketplace simulator. Create jobs, submit proposals, track completion rates. Shows platform architecture skills.'
    },
    {
      id: 13,
      title: 'Deal Estate CRM',
      subtitle: 'Real Estate Platform',
      description: 'Full-featured real estate CRM with property management, client tracking, and deal pipeline. Production-ready with Supabase backend.',
      metrics: {
        status: 'Production',
        stack: 'React/Supabase',
        type: 'Full Platform'
      },
      liveUrl: 'https://deal-estate.vercel.app',
      githubUrl: 'https://github.com/ZacharyVorsteg/deal-estate',
      category: 'crossover',
      tech: ['React', 'Supabase', 'Tailwind', 'SendGrid', 'Cloudinary'],
      gradient: 'from-gray-600 to-slate-600',
      icon: <Building className="w-6 h-6" />,
      status: 'Production',
      featured: false,
      demoNote: 'Full production CRM platform. Login with demo credentials to explore property management and deal tracking features.'
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
              Enterprise-grade applications bridging finance, strategy, and technology. 
              Each project demonstrates the unique intersection of CFO analytics, CEO vision, and developer execution.
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
                    <p className="text-gray-400 leading-relaxed mb-4">
                      {project.description}
                    </p>

                    {/* Demo Note - Professional Context */}
                    {project.demoNote && (
                      <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
                        <p className="text-xs text-gray-300 italic">
                          💡 {project.demoNote}
                        </p>
                      </div>
                    )}

                    {/* Live Preview Window - Only for actual demos */}
                    {project.liveUrl && !project.liveUrl.includes('deal-estate') && project.liveUrl.startsWith('/demos/') && (
                      <div className="mb-6 rounded-xl overflow-hidden border border-white/10 bg-black/50">
                        <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                          </div>
                          <span className="text-xs text-gray-500">Demo Preview</span>
                        </div>
                        <div className="relative w-full aspect-video bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden">
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center">
                              <Play className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                              <p className="text-sm text-gray-500">Click Live Demo to interact</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {Object.entries(project.metrics).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="text-lg font-bold text-white">{value}</div>
                          <div className="text-xs text-gray-500 capitalize">{key}</div>
                        </div>
                      ))}
                    </div>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tech.slice(0, 5).map((tech) => (
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
                      {project.liveUrl && (
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
                          {project.status === 'Production' ? 'View App' : 'Live Demo'}
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