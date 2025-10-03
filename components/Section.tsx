import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  title?: string;
  eyebrow?: string;
  className?: string;
}

export default function Section({ children, title, eyebrow, className = '' }: SectionProps) {
  return (
    <section className={`py-16 md:py-24 ${className}`}>
      {(eyebrow || title) && (
        <div className="mb-12 text-center">
          {eyebrow && (
            <p className="text-sm font-medium tracking-wide uppercase text-[#0B2D5B] mb-3">
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              {title}
            </h2>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

