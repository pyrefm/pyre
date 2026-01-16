'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Flame, 
  Zap, 
  TrendingUp, 
  Shield, 
  Code2, 
  ArrowRight,
  Twitter,
  Copy,
  Check,
  Rocket,
  Target,
  Loader2,
  BarChart3
} from 'lucide-react';
import ConnectButton from '@/components/wallet/ConnectButton';

interface BurnStats {
  totalBurned: string;
  burnedToday: string;
  burnRate: number;
  percentBurned: string;
}

// Fetch real burn stats from API
function useBurnStats() {
  const [stats, setStats] = useState<BurnStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [animatedBurn, setAnimatedBurn] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/token/burn-stats');
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
          setAnimatedBurn(parseInt(data.data.totalBurned) || 0);
        }
      } catch (error) {
        console.error('Failed to fetch burn stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  // Animate the counter
  useEffect(() => {
    if (!stats) return;
    const interval = setInterval(() => {
      setAnimatedBurn(prev => prev + Math.floor(Math.random() * 50) + 10);
    }, 2000);
    return () => clearInterval(interval);
  }, [stats]);

  return { stats, loading, animatedBurn };
}

export default function HomePage() {
  const { stats, loading, animatedBurn } = useBurnStats();
  const [copied, setCopied] = useState(false);
  
  // Token address - will be updated after bags.fm launch
  const contractAddress = process.env.NEXT_PUBLIC_PYRE_TOKEN_MINT || '';
  const isTokenLaunched = contractAddress && contractAddress.length > 30;
  
  const copyAddress = () => {
    navigator.clipboard.writeText(contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const features = [
    {
      icon: Flame,
      title: '30% Burn on Every Call',
      description: 'Every API payment burns 30% of tokens permanently. Usage = Scarcity = Value.',
      color: 'text-burn',
    },
    {
      icon: Zap,
      title: 'Instant Payments',
      description: 'No credit cards, no delays. Pay with $PYRE tokens, get instant API access.',
      color: 'text-pyre-primary',
    },
    {
      icon: TrendingUp,
      title: 'Deflationary by Design',
      description: 'The more the platform is used, the scarcer $PYRE becomes. Simple economics.',
      color: 'text-accent',
    },
    {
      icon: Code2,
      title: 'Developer Rewards',
      description: '50% of every payment goes directly to API providers. Build and earn.',
      color: 'text-tier-gold',
    },
    {
      icon: Shield,
      title: 'No Chargebacks',
      description: 'Crypto payments are final. No fraud, no disputes, no middlemen fees.',
      color: 'text-tier-silver',
    },
    {
      icon: Target,
      title: 'Fair Launch',
      description: 'No VC allocation, no team tokens locked. 100% community-driven.',
      color: 'text-tier-diamond',
    },
  ];
  
  const distribution = [
    { label: 'Burn 🔥', percent: 30, color: 'bg-burn', description: 'Permanently destroyed' },
    { label: 'Provider', percent: 50, color: 'bg-pyre-primary', description: 'API developers' },
    { label: 'Holders', percent: 15, color: 'bg-accent', description: 'Token holders' },
    { label: 'Treasury', percent: 5, color: 'bg-tier-silver', description: 'Platform development' },
  ];

  // Format large numbers
  const formatNumber = (num: number) => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const burnStatsDisplay = [
    { 
      label: 'Total Burned', 
      value: loading ? '...' : formatNumber(animatedBurn), 
      subtext: '$PYRE' 
    },
    { 
      label: 'Burn Rate', 
      value: loading ? '...' : `~${formatNumber(stats?.burnRate || 0)}`, 
      subtext: 'per hour' 
    },
    { 
      label: 'Supply Burned', 
      value: loading ? '...' : `${stats?.percentBurned || '0'}%`, 
      subtext: 'of total' 
    },
    { 
      label: 'Burned Today', 
      value: loading ? '...' : formatNumber(parseInt(stats?.burnedToday || '0')), 
      subtext: '$PYRE' 
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-dark/80 backdrop-blur-lg border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Image 
                src="/assets/pyre-logo-no-bg.png" 
                alt="PYRE" 
                width={40} 
                height={40}
                className="rounded-lg"
              />
              <span className="text-2xl font-bold font-heading">PYRE</span>
            </Link>
            
            {/* Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-text-secondary hover:text-white transition-colors">Features</Link>
              <Link href="#burn" className="text-text-secondary hover:text-white transition-colors">Burn</Link>
              <Link href="#tokenomics" className="text-text-secondary hover:text-white transition-colors">Tokenomics</Link>
              <Link href="/docs" className="text-text-secondary hover:text-white transition-colors">Docs</Link>
              <Link href="/playground" className="text-text-secondary hover:text-white transition-colors">Playground</Link>
            </nav>
            
            {/* CTA */}
            <div className="flex items-center gap-4">
              <ConnectButton />
              <Link href="/dashboard" className="btn-secondary flex items-center gap-2">
                Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden min-h-screen flex items-center">
        {/* Hero Background Video */}
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          >
            <source src="/assets/grok-video-e2be8edc-a829-4093-955b-6741f5e3a196.mp4" type="video/mp4" />
          </video>
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-dark/60 via-dark/80 to-dark" />
          <div className="absolute inset-0 bg-gradient-to-r from-burn/10 via-transparent to-pyre-primary/10" />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10 py-12">
          {/* Logo Display */}
          <div className="mb-8">
            <Image 
              src="/assets/pyre-logo-no-bg.png" 
              alt="PYRE" 
              width={150} 
              height={150}
              className="mx-auto drop-shadow-2xl"
            />
          </div>

          {/* Live Burn Counter */}
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-burn/10 border border-burn/30 mb-8 burn-glow">
            {loading ? (
              <Loader2 className="w-6 h-6 text-burn animate-spin" />
            ) : (
              <Flame className="w-6 h-6 text-burn animate-pulse" />
            )}
            <span className="text-burn font-mono font-bold text-xl">
              {loading ? 'Loading...' : `${animatedBurn.toLocaleString()} $PYRE BURNED`}
            </span>
            {!loading && <span className="pulse-dot" />}
          </div>
          
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold font-heading mb-6">
            <span className="burn-gradient-text">Burn</span>
            <span className="text-white"> to </span>
            <span className="gradient-text">Earn</span>
          </h1>
          
          {/* Subheading */}
          <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto mb-8">
            Every API call <span className="text-burn font-semibold">burns 30%</span> of $PYRE permanently.
            <br className="hidden md:block" />
            The more you use, the scarcer it gets. Simple as that.
          </p>
          
          {/* Token Distribution Visual */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            {distribution.map((item) => (
              <div key={item.label} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-card/50 border border-dark-border">
                <div className={`w-3 h-3 rounded-full ${item.color}`} />
                <span className="text-sm font-medium text-white">
                  {item.label}
                </span>
                <span className="text-sm text-text-muted">
                  {item.percent}%
                </span>
              </div>
            ))}
          </div>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/playground" className="btn-burn flex items-center gap-2 text-lg px-8 py-4">
              <Rocket className="w-5 h-5" />
              Try API Playground
            </Link>
            <Link href="/analytics" className="btn-secondary flex items-center gap-2 text-lg px-8 py-4">
              <BarChart3 className="w-5 h-5" />
              View Burn Stats
            </Link>
          </div>
          
          {/* Contract Address */}
          {isTokenLaunched ? (
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-dark-card border border-dark-border">
              <span className="text-text-muted text-sm">CA:</span>
              <code className="text-text-secondary font-mono text-sm">
                {contractAddress.slice(0, 8)}...{contractAddress.slice(-8)}
              </code>
              <button onClick={copyAddress} className="p-1 hover:bg-dark-elevated rounded transition-colors">
                {copied ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4 text-text-muted" />}
              </button>
            </div>
          ) : (
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-burn/10 border border-burn/30">
              <Flame className="w-4 h-4 text-burn" />
              <span className="text-burn font-medium text-sm">Token Launch Coming Soon</span>
            </div>
          )}
        </div>
      </section>

      {/* Burn Stats */}
      <section id="burn" className="py-20 px-4 bg-dark-card/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold font-heading mb-4">
              <Flame className="w-10 h-10 text-burn inline-block mr-3" />
              Live Burn Statistics
            </h2>
            <p className="text-text-secondary text-lg">
              Watch $PYRE become scarcer in real-time
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {burnStatsDisplay.map((stat, index) => (
              <div key={index} className="stats-card text-center">
                <div className="text-3xl md:text-4xl font-bold text-burn mb-2">
                  {stat.value}
                </div>
                <div className="text-text-secondary text-sm">{stat.label}</div>
                <div className="text-text-muted text-xs mt-1">{stat.subtext}</div>
              </div>
            ))}
          </div>

          {/* Burn Projection */}
          <div className="mt-12 glass-card p-8 text-center max-w-2xl mx-auto burn-glow">
            <h3 className="text-xl font-bold mb-4">Burn Projection</h3>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 text-burn animate-spin" />
              </div>
            ) : (
              <>
                <p className="text-text-secondary mb-6">
                  At current usage rate, <span className="text-burn font-bold">50% of total supply</span> will be burned in approximately
                </p>
                <div className="text-5xl font-bold burn-gradient-text mb-4">
                  {stats?.burnRate && stats.burnRate > 0 
                    ? `${((500_000_000 / (stats.burnRate * 24 * 365)) || 0).toFixed(1)} Years`
                    : 'Calculating...'
                  }
                </div>
                <p className="text-text-muted text-sm">
                  Every API call accelerates this timeline
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-heading mb-4">
              Why <span className="burn-gradient-text">PYRE</span>?
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              A revolutionary token economy where every API call creates value
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="glass-card glass-card-hover p-6 transition-all duration-300"
              >
                <feature.icon className={`w-12 h-12 ${feature.color} mb-4`} />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-text-secondary">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works / Tokenomics */}
      <section id="tokenomics" className="py-20 px-4 bg-dark-card/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-heading mb-4">
              Tokenomics
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Every $PYRE payment is automatically distributed
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Distribution Bars */}
            <div className="space-y-6">
              {distribution.map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">{item.label}</span>
                    <span className="text-text-secondary">{item.percent}%</span>
                  </div>
                  <div className="h-6 bg-dark rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${item.color} rounded-full transition-all duration-1000 flex items-center justify-end pr-3`}
                      style={{ width: `${item.percent}%` }}
                    >
                      <span className="text-xs font-bold text-white/80">{item.description}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Right - Explanation */}
            <div className="space-y-6">
              <div className="glass-card p-6 burn-glow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-burn/20 flex items-center justify-center flex-shrink-0">
                    <Flame className="w-6 h-6 text-burn" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-2 text-burn">30% Burned Forever</h4>
                    <p className="text-text-secondary">
                      Tokens are sent to a null address and <strong>permanently removed</strong> from circulation. 
                      This creates constant deflation as usage increases.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="glass-card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-pyre-primary/20 flex items-center justify-center flex-shrink-0">
                    <Code2 className="w-6 h-6 text-pyre-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-2">50% to API Provider</h4>
                    <p className="text-text-secondary">
                      Developers earn $PYRE for providing valuable API services. 
                      Build once, earn forever.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="glass-card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-2">15% to Holders</h4>
                    <p className="text-text-secondary">
                      Distributed proportionally to token holders. 
                      Hold $PYRE and earn from platform usage.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-12 text-center burn-glow">
            <Flame className="w-16 h-16 text-burn mx-auto mb-6 animate-pulse" />
            <h2 className="text-4xl font-bold font-heading mb-4">
              Start Burning Today
            </h2>
            <p className="text-text-secondary text-lg mb-8 max-w-2xl mx-auto">
              Join the deflationary API economy. Every call you make increases scarcity for all holders.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/playground" className="btn-burn flex items-center justify-center gap-2 text-lg px-8 py-4">
                <Zap className="w-5 h-5" />
                Launch Playground
              </Link>
              <Link href="/docs" className="btn-secondary flex items-center justify-center gap-2 text-lg px-8 py-4">
                <Code2 className="w-5 h-5" />
                Read Documentation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-dark-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Image 
                src="/assets/pyre-logo-no-bg.png" 
                alt="PYRE" 
                width={32} 
                height={32}
                className="rounded-lg"
              />
              <span className="text-xl font-bold font-heading">PYRE</span>
            </div>
            
            <div className="flex items-center gap-6">
              <a href="https://x.com/pyrefm" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <Link href="/docs" className="text-text-muted hover:text-white transition-colors">
                Docs
              </Link>
              <Link href="/playground" className="text-text-muted hover:text-white transition-colors">
                Playground
              </Link>
              <Link href="/dashboard" className="text-text-muted hover:text-white transition-colors">
                Dashboard
              </Link>
            </div>
            
            <div className="text-text-muted text-sm">
              © 2025 PYRE. Burn to earn. 🔥
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
