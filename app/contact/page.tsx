'use client';

import { useState } from 'react';
import Container from '@/components/Container';
import Section from '@/components/Section';
import contactData from '@/content/contact.json';

export default function Contact() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    type: '',
    timeline: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors: Record<string, string> = {};
    
    if (!formState.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formState.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      newErrors.email = 'Valid email is required';
    }
    
    if (!formState.type) {
      newErrors.type = 'Please select a project type';
    }
    
    if (!formState.timeline) {
      newErrors.timeline = 'Please select a timeline';
    }
    
    if (!formState.message.trim()) {
      newErrors.message = 'Please describe the problem';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // If validation passes, the form will submit to Formspree
    // (This is handled by the form action attribute)
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <Section className="pt-24 pb-16">
      <Container>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              {contactData.title}
            </h1>
            <p className="text-gray-600 italic">
              {contactData.microcopy}
            </p>
          </div>

          {/* 
            REPLACE THE ACTION BELOW WITH YOUR FORMSPREE ENDPOINT
            Example: action="https://formspree.io/f/your-form-id"
          */}
          <form
            method="POST"
            action="https://formspree.io/f/YOUR_FORM_ID_HERE"
            onSubmit={handleSubmit}
            className="space-y-6"
            noValidate
          >
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                {contactData.fields.name}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formState.name}
                onChange={handleChange}
                required
                aria-required="true"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0B2D5B] focus:border-[#0B2D5B] outline-none transition"
              />
              {errors.name && (
                <p id="name-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {contactData.fields.email}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formState.email}
                onChange={handleChange}
                required
                aria-required="true"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0B2D5B] focus:border-[#0B2D5B] outline-none transition"
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Project Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Project Type
              </label>
              <select
                id="type"
                name="type"
                value={formState.type}
                onChange={handleChange}
                required
                aria-required="true"
                aria-invalid={!!errors.type}
                aria-describedby={errors.type ? 'type-error' : undefined}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0B2D5B] focus:border-[#0B2D5B] outline-none transition"
              >
                <option value="">Select one...</option>
                {contactData.fields.type.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p id="type-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.type}
                </p>
              )}
            </div>

            {/* Timeline */}
            <div>
              <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
                Timeline
              </label>
              <select
                id="timeline"
                name="timeline"
                value={formState.timeline}
                onChange={handleChange}
                required
                aria-required="true"
                aria-invalid={!!errors.timeline}
                aria-describedby={errors.timeline ? 'timeline-error' : undefined}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0B2D5B] focus:border-[#0B2D5B] outline-none transition"
              >
                <option value="">Select one...</option>
                {contactData.fields.timeline.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.timeline && (
                <p id="timeline-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.timeline}
                </p>
              )}
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                {contactData.fields.message}
              </label>
              <textarea
                id="message"
                name="message"
                value={formState.message}
                onChange={handleChange}
                required
                aria-required="true"
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? 'message-error' : undefined}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0B2D5B] focus:border-[#0B2D5B] outline-none transition resize-none"
              />
              {errors.message && (
                <p id="message-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#0B2D5B] text-white px-6 py-4 rounded-md font-medium hover:bg-[#0a2651] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0B2D5B] transition"
            >
              {contactData.submit}
            </button>
          </form>
        </div>
      </Container>
    </Section>
  );
}

