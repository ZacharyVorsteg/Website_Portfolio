import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export default function Container({ children, className = '' }: ContainerProps) {
  return (
    <div className={`max-w-5xl mx-auto px-6 md:px-8 ${className}`}>
      {children}
    </div>
  );
}

