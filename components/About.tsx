'use client'

import { Calendar, MapPin, Briefcase, GraduationCap, Heart, Coffee } from 'lucide-react'
import Image from 'next/image'

const About = () => {
  const timeline = [
    {
      year: '2021',
      title: 'Started Coding Journey',
      description: 'Began learning web development, starting with HTML, CSS, and JavaScript.',
      icon: <GraduationCap className="w-5 h-5" />,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      year: '2023',
      title: 'Deep Dive into React',
      description: 'Mastered React ecosystem, including hooks, state management, and modern patterns.',
      icon: <Briefcase className="w-5 h-5" />,
      color: 'from-green-500 to-emerald-500',
    },
    {
      year: '2024',
      title: 'Web3 & Blockchain',
      description: 'Expanded into blockchain development with Solidity and DeFi applications.',
      icon: <Heart className="w-5 h-5" />,
      color: 'from-purple-500 to-pink-500',
    },
    {
      year: '2025',
      title: 'Full-Stack Excellence',
      description: 'Building production-ready applications with modern tech stacks.',
      icon: <Coffee className="w-5 h-5" />,
      color: 'from-orange-500 to-red-500',
    },
  ]

  const interests = [
    '🎮 Gaming',
    '📚 Reading Tech Blogs',
    '🎨 UI/UX Design',
    '🏋️ Fitness',
    '🎵 Music',
    '☕ Coffee Enthusiast',
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
              <h3 className="text-2xl font-bold mb-4 gradient-text">Who I Am</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                I'm a passionate full-stack developer with a keen eye for design and a love for creating 
                exceptional digital experiences. My journey in tech began in 2021, and since then, I've been 
                on an exciting path of continuous learning and growth.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                What drives me is the ability to transform ideas into reality through code. I specialize in 
                building modern web applications using React, TypeScript, and cutting-edge technologies. 
                Recently, I've been exploring the Web3 space, diving into smart contract development and DeFi protocols.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, 
                or enjoying a good cup of coffee while planning my next big project.
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
