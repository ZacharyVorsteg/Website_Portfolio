'use client';
import React from 'react';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function ScrollDemoButton() {
  return (
    <Link
      href="/scroll-demo"
      className="fixed bottom-8 right-8 z-50 group"
      title="View Advanced Scroll Demo"
    >
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
        
        {/* Button */}
        <button className="relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold shadow-2xl hover:scale-105 transition-transform">
          <Sparkles className="w-5 h-5" />
          <span>View Scroll Magic</span>
        </button>
        
        {/* Pulse animation */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 animate-ping opacity-20" />
      </div>
    </Link>
  );
}
