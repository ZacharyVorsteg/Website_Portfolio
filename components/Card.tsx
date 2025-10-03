import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div 
      className={`bg-white border border-gray-200 rounded-lg p-6 hover:border-[#0B2D5B] transition-colors ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

