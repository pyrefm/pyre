'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Book,
  Rocket,
  Code2,
  Coins,
  Flame,
  FileCode,
  Terminal,
  Zap,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
  Github,
} from 'lucide-react';

const navigation = [
  {
    title: 'Getting Started',
    items: [
      { name: 'Introduction', href: '/docs', icon: Book },
      { name: 'Quick Start', href: '/docs/quickstart', icon: Rocket },
      { name: 'Installation', href: '/docs/installation', icon: Terminal },
    ],
  },
  {
    title: 'Core Concepts',
    items: [
      { name: 'How It Works', href: '/docs/how-it-works', icon: Zap },
      { name: 'Tokenomics', href: '/docs/tokenomics', icon: Coins },
      { name: 'Burn Mechanism', href: '/docs/burn', icon: Flame },
    ],
  },
  {
    title: 'API Reference',
    items: [
      { name: 'Authentication', href: '/docs/api/auth', icon: Code2 },
      { name: 'AI Endpoints', href: '/docs/api/ai', icon: FileCode },
      { name: 'Data Endpoints', href: '/docs/api/data', icon: FileCode },
      { name: 'Tools', href: '/docs/api/tools', icon: FileCode },
    ],
  },
  {
    title: 'SDKs',
    items: [
      { name: 'JavaScript/Node.js', href: '/docs/sdk/javascript', icon: FileCode },
      { name: 'Python', href: '/docs/sdk/python', icon: FileCode },
      { name: 'React Native', href: '/docs/sdk/react-native', icon: FileCode },
    ],
  },
];

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-dark/95 backdrop-blur-lg border-b border-dark-border">
        <div className="flex items-center justify-between px-4 lg:px-8 h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-dark-elevated rounded-lg"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/assets/pyre-logo-no-bg.png"
                alt="PYRE"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-xl font-bold font-heading">PYRE</span>
              <span className="text-text-muted text-sm ml-2">Docs</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/playground"
              className="hidden sm:flex items-center gap-2 text-sm text-text-secondary hover:text-white transition-colors"
            >
              <Zap className="w-4 h-4" />
              Playground
            </Link>
            <a
              href="https://github.com/pyre-protocol"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-text-secondary hover:text-white transition-colors"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
            <Link href="/dashboard" className="btn-primary text-sm">
              Launch App
            </Link>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:sticky top-16 left-0 z-40 w-72 h-[calc(100vh-4rem)] 
            bg-dark-card border-r border-dark-border overflow-y-auto
            transition-transform duration-300 lg:translate-x-0
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <nav className="p-4 space-y-6">
            {navigation.map((section) => (
              <div key={section.title}>
                <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 px-3">
                  {section.title}
                </h3>
                <ul className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`
                            flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
                            ${isActive
                              ? 'bg-pyre-primary/10 text-pyre-primary border-l-2 border-pyre-primary'
                              : 'text-text-secondary hover:text-white hover:bg-dark-elevated'
                            }
                          `}
                        >
                          <Icon className="w-4 h-4" />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-dark-border">
            <div className="p-4 rounded-lg bg-burn/10 border border-burn/30">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-5 h-5 text-burn" />
                <span className="font-semibold text-burn">$PYRE Token</span>
              </div>
              <p className="text-xs text-text-secondary mb-3">
                Every API call burns tokens, creating scarcity.
              </p>
              <Link
                href="/docs/tokenomics"
                className="text-xs text-burn hover:underline flex items-center gap-1"
              >
                Learn more <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </aside>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
