'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Container from './Container';
import siteData from '@/content/site.json';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#0B2D5B] focus:text-white focus:rounded-md">
        Skip to content
      </a>
      <Container>
        <nav className="flex items-center justify-between h-16" aria-label="Main navigation">
          <Link 
            href="/" 
            className="text-xl font-bold text-[#0B2D5B] hover:text-[#0a2651] focus:outline-none focus:ring-2 focus:ring-[#0B2D5B] focus:ring-offset-2 rounded"
            aria-label="Home"
          >
            {siteData.brand}
          </Link>
          <ul className="flex items-center gap-6 md:gap-8" role="list">
            {siteData.nav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#0B2D5B] focus:ring-offset-2 rounded px-2 py-1 ${
                      isActive
                        ? 'text-[#0B2D5B] font-semibold'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </Container>
    </header>
  );
}

