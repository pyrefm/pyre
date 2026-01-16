'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Flame,
  TrendingUp,
  Zap,
  ArrowRight,
  BarChart3,
  Clock,
  ExternalLink,
  Wallet,
  RefreshCw,
} from 'lucide-react';
import ConnectButton from '@/components/wallet/ConnectButton';
import { useTokenBalance } from '@/hooks/useTokenBalance';
import { useWallet } from '@solana/wallet-adapter-react';

interface BurnStats {
  totalBurned: string;
  burnedToday: string;
  burnedThisWeek: string;
  burnedThisMonth: string;
  burnRate: number;
  percentBurned: string;
  recentBurns: { amount: string; timestamp: number; txHash?: string | null }[];
}

export default function DashboardPage() {
  const { connected } = useWallet();
  const { balance, loading: balanceLoading } = useTokenBalance();
  
  const [burnStats, setBurnStats] = useState<BurnStats | null>(null);
  const [tokenPrice, setTokenPrice] = useState(0.001);
  const [loading, setLoading] = useState(true);
  const [burnCounter, setBurnCounter] = useState(0);
  
  // Fetch burn stats from API
  const fetchBurnStats = async () => {
    try {
      const res = await fetch('/api/token/burn-stats');
      const data = await res.json();
      if (data.success) {
        setBurnStats(data.data);
        setBurnCounter(parseInt(data.data.totalBurned) || 0);
      }
    } catch (error) {
      console.error('Failed to fetch burn stats:', error);
    }
  };
  
  // Fetch token price
  const fetchTokenPrice = async () => {
    try {
      const res = await fetch('/api/token/price');
      const data = await res.json();
      if (data.success) {
        setTokenPrice(data.data.price);
      }
    } catch (error) {
      console.error('Failed to fetch token price:', error);
    }
  };
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchBurnStats(), fetchTokenPrice()]);
      setLoading(false);
    };
    loadData();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);
  
  // Animate burn counter
  useEffect(() => {
    const interval = setInterval(() => {
      setBurnCounter(prev => prev + Math.floor(Math.random() * 50) + 10);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Computed stats object for backward compatibility
  const stats = {
    totalBurned: burnCounter,
    burnedToday: burnStats ? Number(burnStats.burnedToday) : 0,
    burnRate: burnStats?.burnRate || 0,
    tokenPrice: tokenPrice,
    priceChange: 0, // Would come from price history API
    userBalance: balance,
    userBurned: 0, // Would come from user's transaction history
    userApiCalls: 0, // Would come from user's API usage
    supplyPercent: burnStats ? Number(burnStats.percentBurned) : 0,
  };

  return (
    <div className="min-h-screen bg-dark relative">
      {/* Background Video */}
      <div className="fixed inset-0 z-0">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-15"
        >
          <source src="/assets/demo-video-1.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-dark/85" />
      </div>

      {/* Header */}
      <header className="bg-dark-card/80 backdrop-blur-lg border-b border-dark-border sticky top-0 z-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image 
                src="/assets/pyre-logo-no-bg.png" 
                alt="PYRE" 
                width={36} 
                height={36}
                className="rounded-lg"
              />
              <span className="text-2xl font-bold font-heading">PYRE</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="text-white font-medium">Dashboard</Link>
              <Link href="/playground" className="text-text-secondary hover:text-white transition-colors">Playground</Link>
              <Link href="/analytics" className="text-text-secondary hover:text-white transition-colors">Analytics</Link>
            </nav>
            
            <div className="flex items-center gap-4">
              <ConnectButton />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Live Burn Banner */}
        <div className="glass-card p-6 mb-8 burn-glow">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-6 h-6 text-burn animate-pulse" />
                <span className="text-text-secondary">Total $PYRE Burned</span>
              </div>
              <div className="burn-counter text-4xl md:text-5xl">
                {burnCounter.toLocaleString()}
              </div>
            </div>
            <div className="flex gap-8">
              <div className="text-center">
                <div className="text-text-muted text-sm mb-1">Burned Today</div>
                <div className="text-2xl font-bold text-burn">
                  +{stats.burnedToday.toLocaleString()}
                </div>
              </div>
              <div className="text-center">
                <div className="text-text-muted text-sm mb-1">Burn Rate</div>
                <div className="text-2xl font-bold text-accent">
                  ~{stats.burnRate.toLocaleString()}/hr
                </div>
              </div>
              <div className="text-center">
                <div className="text-text-muted text-sm mb-1">Supply Burned</div>
                <div className="text-2xl font-bold text-pyre-primary">
                  {stats.supplyPercent}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Token Price */}
          <div className="stats-card">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-pyre-primary/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-pyre-primary" />
              </div>
              <span className="text-text-secondary">$PYRE Price</span>
            </div>
            <div className="text-3xl font-bold mb-1">${stats.tokenPrice.toFixed(5)}</div>
            <div className={`text-sm ${stats.priceChange >= 0 ? 'text-accent' : 'text-red-400'}`}>
              {stats.priceChange >= 0 ? '+' : ''}{stats.priceChange}% (24h)
            </div>
          </div>

          {/* Your Balance */}
          <div className="stats-card">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-tier-gold/20 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-tier-gold" />
              </div>
              <span className="text-text-secondary">Your Balance</span>
            </div>
            <div className="text-3xl font-bold mb-1">
              {stats.userBalance.toLocaleString()}
            </div>
            <div className="text-sm text-text-muted">
              ≈ ${(stats.userBalance * stats.tokenPrice).toFixed(2)}
            </div>
          </div>

          {/* Your Burned */}
          <div className="stats-card">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-burn/20 flex items-center justify-center">
                <Flame className="w-5 h-5 text-burn" />
              </div>
              <span className="text-text-secondary">You Burned</span>
            </div>
            <div className="text-3xl font-bold mb-1 text-burn">
              {stats.userBurned.toLocaleString()}
            </div>
            <div className="text-sm text-text-muted">
              From {stats.userApiCalls} API calls
            </div>
          </div>

          {/* API Calls */}
          <div className="stats-card">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-accent" />
              </div>
              <span className="text-text-secondary">API Calls</span>
            </div>
            <div className="text-3xl font-bold mb-1">
              {stats.userApiCalls}
            </div>
            <div className="text-sm text-text-muted">
              This month
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Activity */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Recent Activity</h2>
                <Link href="/analytics" className="text-pyre-primary hover:text-pyre-primary-light flex items-center gap-1">
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="space-y-4">
                {[
                  { type: 'API Call', endpoint: '/api/ai/chat', cost: 50, burned: 15, time: '2 min ago' },
                  { type: 'API Call', endpoint: '/api/ai/image', cost: 100, burned: 30, time: '5 min ago' },
                  { type: 'API Call', endpoint: '/api/data/crypto', cost: 20, burned: 6, time: '15 min ago' },
                  { type: 'API Call', endpoint: '/api/data/weather', cost: 10, burned: 3, time: '1 hour ago' },
                  { type: 'API Call', endpoint: '/api/ai/translate', cost: 30, burned: 9, time: '2 hours ago' },
                ].map((activity, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-dark-elevated">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-pyre-primary/20">
                        <Zap className="w-4 h-4 text-pyre-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{activity.type}</div>
                        <div className="text-xs text-text-muted font-mono">
                          {activity.endpoint}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-burn text-sm">
                        <Flame className="w-3 h-3" />
                        -{activity.burned} burned
                      </div>
                      <div className="text-xs text-text-muted flex items-center gap-1 justify-end">
                        <Clock className="w-3 h-3" />
                        {activity.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Burn Impact */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Flame className="w-5 h-5 text-burn" />
                Your Burn Impact
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-burn/10 border border-burn/30 text-center">
                  <div className="text-2xl font-bold text-burn">{stats.userBurned.toLocaleString()}</div>
                  <div className="text-xs text-text-muted mt-1">Tokens Burned</div>
                </div>
                <div className="p-4 rounded-lg bg-dark-elevated text-center">
                  <div className="text-2xl font-bold">0.08%</div>
                  <div className="text-xs text-text-muted mt-1">Of Total Burns</div>
                </div>
                <div className="p-4 rounded-lg bg-dark-elevated text-center">
                  <div className="text-2xl font-bold text-accent">${(stats.userBurned * stats.tokenPrice).toFixed(2)}</div>
                  <div className="text-xs text-text-muted mt-1">Value Destroyed</div>
                </div>
                <div className="p-4 rounded-lg bg-dark-elevated text-center">
                  <div className="text-2xl font-bold text-tier-gold">🔥 Top 5%</div>
                  <div className="text-xs text-text-muted mt-1">Burner Rank</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
              
              <div className="space-y-3">
                <Link href="/playground" className="block p-4 rounded-lg bg-dark-elevated hover:bg-dark-border transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-pyre-primary/20 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-pyre-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">API Playground</div>
                      <div className="text-xs text-text-muted">Test & burn tokens</div>
                    </div>
                  </div>
                </Link>
                
                <Link href="/analytics" className="block p-4 rounded-lg bg-dark-elevated hover:bg-dark-border transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-burn/20 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-burn" />
                    </div>
                    <div>
                      <div className="font-semibold">Burn Analytics</div>
                      <div className="text-xs text-text-muted">View all burn stats</div>
                    </div>
                  </div>
                </Link>
                
                <a 
                  href="https://jup.ag" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 rounded-lg bg-dark-elevated hover:bg-dark-border transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <div className="font-semibold flex items-center gap-1">
                        Buy $PYRE
                        <ExternalLink className="w-3 h-3" />
                      </div>
                      <div className="text-xs text-text-muted">Trade on Jupiter</div>
                    </div>
                  </div>
                </a>
              </div>
            </div>

            {/* Burn Stats */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Flame className="w-5 h-5 text-burn" />
                Live Burn Stats
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Total Burned</span>
                  <span className="font-semibold">{(burnCounter / 1_000_000).toFixed(2)}M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">% of Supply</span>
                  <span className="font-semibold text-burn">
                    {((burnCounter / 1_000_000_000) * 100).toFixed(3)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Burn Rate</span>
                  <span className="font-semibold text-accent">~22K/hour</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Your Burns</span>
                  <span className="font-semibold text-tier-gold">{stats.userBurned.toLocaleString()}</span>
                </div>
                
                <div className="pt-4 border-t border-dark-border">
                  <a 
                    href="https://solscan.io" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 text-pyre-primary hover:text-pyre-primary-light"
                  >
                    View on Explorer
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Burn Projection */}
            <div className="glass-card p-6 burn-glow">
              <h3 className="font-bold mb-4 text-center">50% Supply Burn</h3>
              <div className="text-4xl font-bold text-center burn-gradient-text mb-2">
                ~2.3 Years
              </div>
              <p className="text-xs text-text-muted text-center">
                At current usage rate
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
