'use client'

import { useState } from 'react'
import { Code2, Database, Palette, Wrench, TrendingUp, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import BatchReveal from './scroll/BatchReveal'

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState('frontend')

  const skillCategories = {
    frontend: {
      title: 'Frontend Development',
      icon: <Code2 className="w-5 h-5" />,
      color: 'from-blue-500 to-cyan-500',
      skills: [
        { name: 'React', level: 90, experience: '3+ years' },
        { name: 'TypeScript', level: 85, experience: '2+ years' },
        { name: 'Next.js', level: 80, experience: '2+ years' },
        { name: 'Tailwind CSS', level: 95, experience: '3+ years' },
        { name: 'JavaScript', level: 92, experience: '4+ years' },
        { name: 'HTML/CSS', level: 95, experience: '4+ years' },
      ],
    },
    backend: {
      title: 'Backend & Database',
      icon: <Database className="w-5 h-5" />,
      color: 'from-green-500 to-emerald-500',
      skills: [
        { name: 'Node.js', level: 75, experience: '2+ years' },
        { name: 'Express.js', level: 70, experience: '2+ years' },
        { name: 'PostgreSQL', level: 65, experience: '1+ year' },
        { name: 'MongoDB', level: 60, experience: '1+ year' },
        { name: 'Supabase', level: 70, experience: '1+ year' },
        { name: 'REST APIs', level: 80, experience: '2+ years' },
      ],
    },
    web3: {
      title: 'Web3 & Blockchain',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'from-purple-500 to-pink-500',
      skills: [
        { name: 'Solidity', level: 60, experience: '1+ year' },
        { name: 'Ethers.js', level: 65, experience: '1+ year' },
        { name: 'Smart Contracts', level: 55, experience: '1+ year' },
        { name: 'DeFi Protocols', level: 50, experience: '6+ months' },
        { name: 'Hardhat', level: 55, experience: '6+ months' },
        { name: 'Web3 Integration', level: 70, experience: '1+ year' },
      ],
    },
    tools: {
      title: 'Tools & Others',
      icon: <Wrench className="w-5 h-5" />,
      color: 'from-orange-500 to-red-500',
      skills: [
        { name: 'Git & GitHub', level: 85, experience: '3+ years' },
        { name: 'VS Code', level: 90, experience: '4+ years' },
        { name: 'Figma', level: 70, experience: '2+ years' },
        { name: 'Vercel/Netlify', level: 80, experience: '2+ years' },
        { name: 'Docker', level: 50, experience: '6+ months' },
        { name: 'CI/CD', level: 60, experience: '1+ year' },
      ],
    },
  }

  const softSkills = [
    { icon: <Users className="w-6 h-6" />, title: 'Team Collaboration', description: 'Effective communication and teamwork' },
    { icon: <Palette className="w-6 h-6" />, title: 'UI/UX Design', description: 'Creating intuitive user experiences' },
    { icon: <TrendingUp className="w-6 h-6" />, title: 'Problem Solving', description: 'Analytical thinking and debugging' },
    { icon: <Code2 className="w-6 h-6" />, title: 'Clean Code', description: 'Writing maintainable, scalable code' },
  ]

  return (
    <section id="skills" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Skills & Expertise</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A comprehensive overview of my technical skills and proficiencies across various technologies.
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
        <BatchReveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {skillCategories[activeCategory as keyof typeof skillCategories].skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                className="glass-card p-6 reveal"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{skill.name}</h3>
                  <p className="text-sm text-muted-foreground">{skill.experience}</p>
                </div>
                <span className="text-2xl font-bold gradient-text">{skill.level}%</span>
              </div>
              
              {/* Progress Bar */}
              <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${skill.level}%`,
                    animation: `slideIn 1s ease-out ${index * 0.1}s both`,
                  }}
                />
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-white/20 to-transparent rounded-full"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
              </motion.div>
            ))}
          </div>
        </BatchReveal>

        {/* Soft Skills */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-center mb-12">
            <span className="gradient-text">Soft Skills</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {softSkills.map((skill, index) => (
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

        {/* Learning Journey */}
        <div className="mt-20 text-center">
          <div className="glass-card p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              <span className="gradient-text">Always Learning</span>
            </h3>
            <p className="text-muted-foreground mb-6">
              Currently exploring advanced React patterns, Web3 development, and AI integration.
              Committed to staying at the forefront of web technology.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {['React Native', 'GraphQL', 'Rust', 'AI/ML', 'Advanced Solidity'].map((tech) => (
                <span key={tech} className="px-4 py-2 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg text-sm font-medium text-foreground border border-primary/20">
                  📚 {tech}
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
