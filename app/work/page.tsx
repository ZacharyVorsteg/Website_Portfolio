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
              <Card key={item.slug} className="cursor-pointer" onClick={() => setExpandedSlug(isExpanded ? null : item.slug)}>
                <article>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    {item.title}
                  </h2>
                  
                  {!isExpanded ? (
                    <p className="text-gray-600">
                      Click to see details
                    </p>
                  ) : (
                    <div className="space-y-4 text-sm">
                      <div>
                        <h3 className="font-semibold text-[#0B2D5B] mb-1">Challenge</h3>
                        <p className="text-gray-600">{item.challenge}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#0B2D5B] mb-1">Build</h3>
                        <p className="text-gray-600">{item.build}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#0B2D5B] mb-1">Impact</h3>
                        <p className="text-gray-600 font-medium">{item.impact}</p>
                      </div>
                      
                      {/* Placeholder for image */}
                      <div className="mt-4 bg-gray-100 rounded-md h-32 flex items-center justify-center text-gray-400 text-sm">
                        [Project visualization]
                      </div>
                    </div>
                  )}
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

