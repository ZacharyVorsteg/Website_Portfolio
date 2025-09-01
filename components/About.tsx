'use client'

import { Calendar, MapPin, Briefcase, GraduationCap, Heart, Coffee } from 'lucide-react'
import Image from 'next/image'

const About = () => {
  const timeline = [
    {
      year: '2020',
      title: 'FAU Graduate - Finance & Economics',
      description: 'Graduated from Florida Atlantic University with a major in Finance and minor in Economics. Strong foundation in quantitative analysis, market dynamics, and financial modeling.',
      icon: <GraduationCap className="w-5 h-5" />,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      year: '2021',
      title: 'Pivot to Tech',
      description: 'Leveraged analytical skills from finance to transition into software development. Started with web technologies and data visualization.',
      icon: <Briefcase className="w-5 h-5" />,
      color: 'from-green-500 to-emerald-500',
    },
    {
      year: '2023',
      title: 'FinTech Focus',
      description: 'Combined finance expertise with coding skills to build financial applications, trading algorithms, and market analysis tools.',
      icon: <Heart className="w-5 h-5" />,
      color: 'from-purple-500 to-pink-500',
    },
    {
      year: '2024-25',
      title: 'Full-Stack FinTech Developer',
      description: 'Creating innovative solutions at the intersection of finance and technology. Specializing in DeFi, market analytics, and automated trading systems.',
      icon: <Coffee className="w-5 h-5" />,
      color: 'from-orange-500 to-red-500',
    },
  ]

  const interests = [
    '📈 Market Analysis',
    '💹 Algorithmic Trading',
    '🏦 FinTech Innovation',
    '📊 Data Visualization',
    '₿ Cryptocurrency',
    '🎯 Investment Strategy',
    '📚 Economics Research',
    '☕ Coffee & Code',
  ]

  return (
    <section id="about" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">About Me</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get to know the person behind the code and my journey in tech.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Personal Info */}
          <div className="space-y-6">
            <div className="glass-card p-8">
              <h3 className="text-2xl font-bold mb-4 gradient-text">Finance Meets Technology</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                I'm a unique blend of financial analyst turned full-stack developer. With a degree in Finance 
                and Economics from Florida Atlantic University (Class of 2020), I bring a distinctive perspective 
                to software development that sets me apart in the tech industry.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                My finance background gives me an edge in building FinTech applications, understanding market 
                dynamics, and creating data-driven solutions. I don't just code – I understand the business logic, 
                financial models, and economic principles behind the applications I build. This allows me to create 
                more intelligent, practical, and valuable software solutions.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Whether it's building trading algorithms, creating financial dashboards, or developing DeFi protocols, 
                I leverage my dual expertise to deliver solutions that are both technically excellent and financially sound. 
                My goal is to bridge the gap between traditional finance and modern technology.
              </p>
            </div>

            {/* Quick Facts */}
            <div className="glass-card p-6">
              <h4 className="text-lg font-semibold mb-4 text-foreground">Quick Facts</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>Based in United States</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Briefcase className="w-4 h-4 text-primary" />
                  <span>Open to opportunities</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>3+ years of experience</span>
                </div>
              </div>
            </div>
          </div>

          {/* Image and Stats */}
          <div className="space-y-6">
            {/* Profile Image Placeholder */}
            <div className="glass-card p-2">
              <div className="relative h-96 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                      <span className="text-5xl font-bold text-white">ZV</span>
                    </div>
                    <p className="text-muted-foreground">Zachary Vorsteg</p>
                    <p className="text-sm text-muted-foreground mt-1">Full-Stack Developer</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interests */}
            <div className="glass-card p-6">
              <h4 className="text-lg font-semibold mb-4 text-foreground">Interests</h4>
              <div className="flex flex-wrap gap-3">
                {interests.map((interest) => (
                  <span
                    key={interest}
                    className="px-4 py-2 bg-muted/50 rounded-lg text-sm text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-center mb-12">
            <span className="gradient-text">My Journey</span>
          </h3>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-primary via-accent to-primary opacity-20" />
            
            {/* Timeline Items */}
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div
                  key={item.year}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'justify-start' : 'justify-end'
                  }`}
                  style={{
                    animation: `fadeUp 0.5s ease-out ${index * 0.2}s both`,
                  }}
                >
                  <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                    <div className="glass-card p-6 hover:scale-105 transition-transform duration-200">
                      <div className={`flex items-center gap-3 mb-3 ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${item.color} text-white`}>
                          {item.icon}
                        </div>
                        <span className="text-2xl font-bold gradient-text">{item.year}</span>
                      </div>
                      <h4 className="text-lg font-semibold text-foreground mb-2">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  
                  {/* Center Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <div className="glass-card p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              <span className="gradient-text">Let's Build Something Amazing</span>
            </h3>
            <p className="text-muted-foreground mb-6">
              I'm always excited to work on new projects and collaborate with talented people.
              If you have an idea or opportunity, I'd love to hear from you!
            </p>
            <a href="#contact" className="btn-primary inline-flex items-center gap-2">
              Get In Touch
              <Heart className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
