'use client'

import { useState } from 'react'
import { ExternalLink, Github, Play, Code, Layers, Zap } from 'lucide-react'
import Image from 'next/image'

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)

  const categories = ['all', 'web-app', 'defi', 'ui-design']

  const projects = [
    {
      id: 1,
      title: 'Splitter UI',
      description: 'Advanced DeFi payment splitting application with smart contract integration, real-time gas tracking, and ENS support.',
      longDescription: 'A sophisticated Web3 application that enables users to deploy payment splitter smart contracts on multiple chains. Features include real-time gas estimation, wallet connection, and transaction monitoring.',
      image: '/projects/splitter-ui.png',
      liveUrl: 'https://splitter-ui.netlify.app',
      githubUrl: 'https://github.com/ZacharyVorsteg/splitter-ui',
      category: 'defi',
      tech: ['TypeScript', 'React', 'Solidity', 'Ethers.js', 'Tailwind CSS'],
      features: [
        'Smart contract deployment',
        'Multi-chain support',
        'Real-time gas tracking',
        'ENS integration',
        'Responsive design'
      ],
      color: 'from-purple-500 to-pink-500',
      icon: <Zap className="w-5 h-5" />,
      status: 'Production Ready',
    },
    {
      id: 2,
      title: 'Deal Estate CRM',
      description: 'Professional real estate CRM with advanced property management, client tracking, and analytics dashboard.',
      longDescription: 'A comprehensive CRM solution designed for real estate professionals. Features a modern dark theme with neumorphic design, real-time notifications, and detailed analytics.',
      image: '/projects/deal-estate.png',
      liveUrl: 'https://lively-gecko-d1d0de.netlify.app',
      githubUrl: 'https://github.com/ZacharyVorsteg/deal-estate',
      category: 'web-app',
      tech: ['JavaScript', 'React', 'Tailwind CSS', 'Supabase', 'Chart.js'],
      features: [
        'Property management',
        'Client database',
        'Analytics dashboard',
        'Real-time notifications',
        'Dark mode UI'
      ],
      color: 'from-blue-500 to-cyan-500',
      icon: <Layers className="w-5 h-5" />,
      status: 'Live',
    },
    {
      id: 3,
      title: 'Portfolio Website',
      description: 'Modern portfolio website with interactive animations, project showcases, and contact integration.',
      longDescription: 'This portfolio website you\'re currently viewing! Built with Next.js and TypeScript, featuring smooth animations, responsive design, and optimized performance.',
      image: '/projects/portfolio.png',
      liveUrl: '#',
      githubUrl: 'https://github.com/ZacharyVorsteg/Website_Portfolio',
      category: 'ui-design',
      tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
      features: [
        'Interactive animations',
        'Project showcases',
        'Responsive design',
        'Dark theme',
        'SEO optimized'
      ],
      color: 'from-green-500 to-emerald-500',
      icon: <Code className="w-5 h-5" />,
      status: 'Active Development',
    },
  ]

  const filteredProjects = projects.filter(
    project => selectedCategory === 'all' || project.category === selectedCategory
  )

  return (
    <section id="projects" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Featured Projects</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore my latest work showcasing full-stack development, modern design, and innovative solutions.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className="group relative"
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
              style={{
                animation: `fadeUp 0.5s ease-out ${index * 0.1}s both`,
              }}
            >
              <div className="glass-card p-6 h-full project-card">
                {/* Project Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${project.color} text-white`}>
                      {project.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{project.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${project.color} text-white`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Project Image with Live Preview */}
                <div className="relative h-64 mb-6 rounded-lg overflow-hidden bg-muted">
                  {hoveredProject === project.id && project.liveUrl !== '#' ? (
                    <iframe
                      src={project.liveUrl}
                      className="w-full h-full"
                      title={project.title}
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-muted to-card flex items-center justify-center">
                      <div className="text-center">
                        <Play className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Hover for live preview</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Overlay with quick actions */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-background/90 to-transparent flex items-end p-4 transition-opacity duration-300 ${
                    hoveredProject === project.id ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <div className="flex gap-2">
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-primary/20 backdrop-blur-sm rounded-lg text-primary hover:bg-primary/30 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-primary/20 backdrop-blur-sm rounded-lg text-primary hover:bg-primary/30 transition-colors"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {project.longDescription}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech) => (
                    <span key={tech} className="skill-badge">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Features */}
                <div className="space-y-2 mb-6">
                  {project.features.slice(0, 3).map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 btn-primary text-center text-sm"
                  >
                    View Live
                  </a>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 btn-secondary text-center text-sm"
                  >
                    Source Code
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More */}
        <div className="text-center mt-12">
          <a
            href="https://github.com/ZacharyVorsteg"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            View all projects on GitHub
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  )
}

export default Projects
