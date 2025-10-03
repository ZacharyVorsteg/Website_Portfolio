'use client';

import { useState } from 'react';
import Container from '@/components/Container';
import Section from '@/components/Section';
import Card from '@/components/Card';
import workData from '@/content/work.json';
import type { Metadata } from 'next';

// Note: Metadata export removed for client component - add in layout if needed

export default function Work() {
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  return (
    <Section className="pt-24 pb-16">
      <Container>
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Work
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            Selected projects demonstrating financial analysis, automation, and system-building capabilities.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {workData.items.map((item) => {
            const isExpanded = expandedSlug === item.slug;
            
            return (
              <Card key={item.slug}>
                <article>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    {item.title}
                  </h2>
                  
                  <div className="space-y-3 text-sm">
                    {/* Always visible summary */}
                    <p className="text-gray-600 leading-relaxed">
                      {item.challenge}
                    </p>
                    
                    {/* Expandable details */}
                    {isExpanded && (
                      <div className="space-y-4 border-t border-gray-200 pt-4 animate-fade-in">
                        <div>
                          <h3 className="font-semibold text-[#0B2D5B] mb-2">Solution</h3>
                          <p className="text-gray-600 leading-relaxed">{item.build}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#0B2D5B] mb-2">Results</h3>
                          <p className="text-gray-700 font-medium leading-relaxed">{item.impact}</p>
                        </div>
                      </div>
                    )}
                    
                    <button 
                      className="text-[#0B2D5B] hover:text-[#0a2651] font-medium text-sm flex items-center gap-1 mt-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedSlug(isExpanded ? null : item.slug);
                      }}
                    >
                      {isExpanded ? '− Show less' : '+ Show details'}
                    </button>
                  </div>
                </article>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-600 mb-6">
            These represent a subset of completed work. Each project delivered measurable business value.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0B2D5B] bg-[#0B2D5B] text-white hover:bg-[#0a2651]"
          >
            Discuss your project
          </a>
        </div>
      </Container>
    </Section>
  );
}

