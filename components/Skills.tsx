'use client'

import { useState } from 'react'
import { Code2, Database, Brain, TrendingUp, Calculator, BarChart, Users, Briefcase, Shield, DollarSign, LineChart, Target } from 'lucide-react'
import { motion } from 'framer-motion'

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState('finance')

  const proficiencyLevels = {
    'Expert': { color: '#10b981', bgColor: 'bg-emerald-500/20', textColor: 'text-emerald-400', description: '5+ years' },
    'Advanced': { color: '#3b82f6', bgColor: 'bg-blue-500/20', textColor: 'text-blue-400', description: '3-5 years' },
    'Proficient': { color: '#8b5cf6', bgColor: 'bg-purple-500/20', textColor: 'text-purple-400', description: '1-3 years' }
  }

  const skillCategories = {
    finance: {
      title: 'CFO & Finance',
      icon: <Calculator className="w-5 h-5" />,
      color: 'from-emerald-500 to-teal-500',
      skills: [
        { name: 'Financial Modeling', proficiency: 'Expert', experience: 'SaaS, Real Estate, M&A' },
        { name: 'FP&A / Budgeting', proficiency: 'Expert', experience: 'OneStream, Excel, Python' },
        { name: 'Cash Flow Management', proficiency: 'Expert', experience: '13-week rolling forecasts' },
        { name: 'GAAP / Accounting', proficiency: 'Advanced', experience: 'Revenue recognition, accruals' },
        { name: 'Fundraising / VC', proficiency: 'Advanced', experience: 'Pitch decks, data rooms' },
        { name: 'M&A Due Diligence', proficiency: 'Advanced', experience: 'Buy & sell-side' },
      ],
    },
    strategy: {
      title: 'CEO & Strategy',
      icon: <Target className="w-5 h-5" />,
      color: 'from-blue-500 to-indigo-500',
      skills: [
        { name: 'Go-to-Market Strategy', proficiency: 'Expert', experience: 'B2B SaaS, PLG' },
        { name: 'Product Management', proficiency: 'Advanced', experience: 'Roadmaps, prioritization' },
        { name: 'Operations & Scaling', proficiency: 'Expert', experience: '0→1, 1→10 growth' },
        { name: 'Team Building', proficiency: 'Advanced', experience: 'Hiring, culture, retention' },
        { name: 'Board Management', proficiency: 'Advanced', experience: 'Reporting, governance' },
        { name: 'Strategic Partnerships', proficiency: 'Advanced', experience: 'BD, channel sales' },
      ],
    },
    datascience: {
      title: 'Data Science & ML',
      icon: <Brain className="w-5 h-5" />,
      color: 'from-purple-500 to-pink-500',
      skills: [
        { name: 'Python (Pandas/NumPy)', proficiency: 'Expert', experience: 'Data analysis, automation' },
        { name: 'Machine Learning', proficiency: 'Advanced', experience: 'Scikit-learn, XGBoost' },
        { name: 'Statistical Analysis', proficiency: 'Expert', experience: 'Regression, time series' },
        { name: 'Data Visualization', proficiency: 'Expert', experience: 'Plotly, D3.js, Tableau' },
        { name: 'SQL / Database', proficiency: 'Advanced', experience: 'PostgreSQL, BigQuery' },
        { name: 'Deep Learning', proficiency: 'Proficient', experience: 'TensorFlow, PyTorch' },
      ],
    },
    development: {
      title: 'Full-Stack Development',
      icon: <Code2 className="w-5 h-5" />,
      color: 'from-orange-500 to-red-500',
      skills: [
        { name: 'React / Next.js', proficiency: 'Expert', experience: '3+ years production' },
        { name: 'TypeScript / JavaScript', proficiency: 'Expert', experience: 'ES6+, async patterns' },
        { name: 'Python (FastAPI/Flask)', proficiency: 'Advanced', experience: 'REST APIs, microservices' },
        { name: 'Node.js / Express', proficiency: 'Advanced', experience: 'Backend services' },
        { name: 'PostgreSQL / Supabase', proficiency: 'Advanced', experience: 'Schema design, optimization' },
        { name: 'DevOps / CI/CD', proficiency: 'Proficient', experience: 'Docker, GitHub Actions' },
      ],
    },
  }

  const crossFunctionalSkills = [
    { 
      icon: <DollarSign className="w-6 h-6" />, 
      title: 'Financial Engineering', 
      description: 'Building financial models as production software with APIs and UIs' 
    },
    { 
      icon: <BarChart className="w-6 h-6" />, 
      title: 'Data-Driven Leadership', 
      description: 'Making strategic decisions backed by quantitative analysis and ML insights' 
    },
    { 
      icon: <Shield className="w-6 h-6" />, 
      title: 'Risk Management', 
      description: 'Quantifying and mitigating financial, operational, and technical risks' 
    },
    { 
      icon: <Users className="w-6 h-6" />, 
      title: 'Stakeholder Communication', 
      description: 'Translating between technical teams, executives, and investors' 
    },
  ]

  const toolsAndPlatforms = [
    // Finance Tools
    'Excel (Advanced)', 'OneStream', 'NetSuite', 'QuickBooks',
    // Data Science
    'Jupyter', 'Streamlit', 'Plotly', 'Scikit-learn',
    // Development
    'VS Code', 'Git', 'Docker', 'Vercel',
    // Cloud & APIs
    'AWS', 'Supabase', 'Stripe', 'SendGrid',
    // Collaboration
    'Slack', 'Notion', 'Linear', 'Figma'
  ]

  return (
    <section id="skills" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Skills & Expertise</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Unique combination of financial acumen, strategic vision, data science capabilities, 
            and full-stack development skills. The rare executive who can model it, code it, and scale it.
          </p>
        </div>

        {/* Skill Categories Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {Object.entries(skillCategories).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeCategory === key
                  ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {category.icon}
              {category.title}
            </button>
          ))}
        </div>

        {/* Skills Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {skillCategories[activeCategory as keyof typeof skillCategories].skills.map((skill, index) => {
            const proficiency = proficiencyLevels[skill.proficiency as keyof typeof proficiencyLevels];
            return (
              <motion.div
                key={skill.name}
                className="glass-card p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-2">{skill.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{skill.experience}</p>
                </div>
                <div className="ml-4 text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${proficiency.bgColor} ${proficiency.textColor} border border-current/30`}>
                    {skill.proficiency}
                  </span>
                  <div className="text-xs text-muted-foreground mt-1">
                    {proficiency.description}
                  </div>
                </div>
              </div>
              </motion.div>
            );
          })}
        </div>

        {/* Cross-Functional Skills */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-center mb-12">
            <span className="gradient-text">Cross-Functional Expertise</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {crossFunctionalSkills.map((skill, index) => (
              <div
                key={skill.title}
                className="glass-card p-6 text-center hover:scale-105 transition-transform duration-200"
                style={{
                  animation: `fadeUp 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20 text-primary mb-4">
                  {skill.icon}
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2">{skill.title}</h4>
                <p className="text-sm text-muted-foreground">{skill.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tools & Platforms */}
        <div className="mt-20">
          <div className="glass-card p-8 max-w-5xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-6">
              <span className="gradient-text">Tools & Platforms</span>
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {toolsAndPlatforms.map((tool) => (
                <span 
                  key={tool} 
                  className="px-4 py-2 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg text-sm font-medium text-foreground border border-primary/20 hover:scale-105 transition-transform duration-200"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Current Focus */}
        <div className="mt-20 text-center">
          <div className="glass-card p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              <span className="gradient-text">Current Focus Areas</span>
            </h3>
            <p className="text-muted-foreground mb-6">
              Actively exploring the intersection of AI and financial operations, building autonomous 
              financial systems, and developing next-generation CFO tools that leverage ML for 
              predictive insights and automated decision-making.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {['AI-Powered FP&A', 'Autonomous Accounting', 'Real-time Financial APIs', 'Predictive Cash Flow', 'Smart Contract Finance'].map((tech) => (
                <span key={tech} className="px-4 py-2 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg text-sm font-medium text-foreground border border-primary/20">
                  🚀 {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Skills