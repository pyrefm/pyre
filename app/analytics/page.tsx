'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Flame,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  Zap,
  Download,
} from 'lucide-react';

// Mock analytics data
const mockData = {
  burnStats: {
    total: 15847293,
    today: 523891,
    week: 3892145,
    month: 12456789,
    rate: 21828, // per hour
    percentOfSupply: 1.58,
  },
  apiStats: {
    totalCalls: 847293,
    callsToday: 12483,
    avgResponseTime: 234,
    successRate: 99.2,
  },
  revenueStats: {
    totalVolume: 42891.5,
    volumeToday: 1234.5,
    avgTransaction: 0.05,
  },
  topEndpoints: [
    { endpoint: '/api/ai/chat', calls: 324891, revenue: 16244.55 },
    { endpoint: '/api/data/crypto', calls: 198234, revenue: 3964.68 },
    { endpoint: '/api/ai/image', calls: 145678, revenue: 14567.80 },
    { endpoint: '/api/data/weather', calls: 98234, revenue: 982.34 },
  ],
  burnHistory: [
    { date: '2024-01-01', amount: 523891 },
    { date: '2024-01-02', amount: 612345 },
    { date: '2024-01-03', amount: 478234 },
    { date: '2024-01-04', amount: 589123 },
    { date: '2024-01-05', amount: 534567 },
    { date: '2024-01-06', amount: 623456 },
    { date: '2024-01-07', amount: 512345 },
  ],
};

export default function AnalyticsPage() {
  const [burnCounter, setBurnCounter] = useState(mockData.burnStats.total);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | 'all'>('7d');

  // Animate burn counter
  useEffect(() => {
    const interval = setInterval(() => {
      setBurnCounter(prev => prev + Math.floor(Math.random() * 100) + 50);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const maxBurn = Math.max(...mockData.burnHistory.map(d => d.amount));

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
          <source src="/assets/another-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-dark/85" />
      </div>

      {/* Header */}
      <header className="bg-dark-card/80 backdrop-blur-lg border-b border-dark-border sticky top-0 z-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </Link>
            <div className="flex items-center gap-4">
              <BarChart3 className="w-6 h-6 text-pyre-primary" />
              <h1 className="text-xl font-bold font-heading">Analytics</h1>
            </div>
            <button className="btn-secondary flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Live Burn Counter */}
        <div className="glass-card p-8 mb-8 burn-glow text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Flame className="w-10 h-10 text-burn animate-pulse" />
            <span className="text-text-secondary text-lg">Total $PYRE Burned</span>
          </div>
          <div className="burn-counter text-5xl md:text-7xl mb-4">
            {burnCounter.toLocaleString()}
          </div>
          <div className="text-text-muted">
            {mockData.burnStats.percentOfSupply}% of total supply • 
            ~{mockData.burnStats.rate.toLocaleString()} per hour
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2 mb-8">
          {(['24h', '7d', '30d', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg transition-all ${
                timeRange === range
                  ? 'bg-pyre-primary text-white'
                  : 'bg-dark-elevated text-text-secondary hover:bg-dark-border'
              }`}
            >
              {range === 'all' ? 'All Time' : range.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="stats-card">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-burn/20 flex items-center justify-center">
                <Flame className="w-5 h-5 text-burn" />
              </div>
              <span className="text-text-secondary">Burned Today</span>
            </div>
            <div className="text-3xl font-bold text-burn">
              {(mockData.burnStats.today / 1000).toFixed(0)}K
            </div>
            <div className="text-sm text-accent mt-1">+12.5% vs yesterday</div>
          </div>

          <div className="stats-card">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-pyre-primary/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-pyre-primary" />
              </div>
              <span className="text-text-secondary">API Calls Today</span>
            </div>
            <div className="text-3xl font-bold">
              {mockData.apiStats.callsToday.toLocaleString()}
            </div>
            <div className="text-sm text-accent mt-1">+8.3% vs yesterday</div>
          </div>

          <div className="stats-card">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-tier-gold/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-tier-gold" />
              </div>
              <span className="text-text-secondary">Volume Today</span>
            </div>
            <div className="text-3xl font-bold">
              ${mockData.revenueStats.volumeToday.toFixed(0)}
            </div>
            <div className="text-sm text-accent mt-1">+15.2% vs yesterday</div>
          </div>

          <div className="stats-card">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                <Activity className="w-5 h-5 text-accent" />
              </div>
              <span className="text-text-secondary">Success Rate</span>
            </div>
            <div className="text-3xl font-bold text-accent">
              {mockData.apiStats.successRate}%
            </div>
            <div className="text-sm text-text-muted mt-1">
              Avg response: {mockData.apiStats.avgResponseTime}ms
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Burn Chart */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Flame className="w-5 h-5 text-burn" />
              Daily Burn Rate
            </h2>
            
            <div className="space-y-4">
              {mockData.burnHistory.map((day, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-text-secondary">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                    <span className="text-burn font-semibold">
                      {(day.amount / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="h-6 bg-dark rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-burn to-burn-red rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                      style={{ width: `${(day.amount / maxBurn) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Endpoints */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-pyre-primary" />
              Top Endpoints
            </h2>
            
            <div className="space-y-4">
              {mockData.topEndpoints.map((endpoint, index) => (
                <div key={index} className="p-4 rounded-lg bg-dark-elevated">
                  <div className="flex items-center justify-between mb-2">
                    <code className="text-sm text-pyre-primary">{endpoint.endpoint}</code>
                    <span className="text-xs text-text-muted">
                      #{index + 1}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary text-sm">
                      {endpoint.calls.toLocaleString()} calls
                    </span>
                    <span className="text-tier-gold font-semibold">
                      ${endpoint.revenue.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Burn Summary */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold mb-6">Burn Summary</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-dark-elevated">
                <div className="text-text-muted text-sm mb-1">Today</div>
                <div className="text-xl font-bold text-burn">
                  {(mockData.burnStats.today / 1000).toFixed(0)}K
                </div>
              </div>
              <div className="p-4 rounded-lg bg-dark-elevated">
                <div className="text-text-muted text-sm mb-1">This Week</div>
                <div className="text-xl font-bold text-burn">
                  {(mockData.burnStats.week / 1000000).toFixed(2)}M
                </div>
              </div>
              <div className="p-4 rounded-lg bg-dark-elevated">
                <div className="text-text-muted text-sm mb-1">This Month</div>
                <div className="text-xl font-bold text-burn">
                  {(mockData.burnStats.month / 1000000).toFixed(2)}M
                </div>
              </div>
              <div className="p-4 rounded-lg bg-dark-elevated">
                <div className="text-text-muted text-sm mb-1">All Time</div>
                <div className="text-xl font-bold text-burn">
                  {(mockData.burnStats.total / 1000000).toFixed(2)}M
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-lg bg-burn/10 border border-burn/30">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-burn" />
                <span className="text-sm font-semibold text-burn">Burn Projection</span>
              </div>
              <p className="text-sm text-text-secondary">
                At current rate, 50% of supply will be burned in approximately{' '}
                <span className="text-burn font-semibold">2.3 years</span>
              </p>
            </div>
          </div>

          {/* API Performance */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold mb-6">API Performance</h2>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-text-secondary">Total Calls</span>
                  <span className="font-semibold">{mockData.apiStats.totalCalls.toLocaleString()}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: '75%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-text-secondary">Success Rate</span>
                  <span className="font-semibold text-accent">{mockData.apiStats.successRate}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="h-full bg-accent rounded-full transition-all"
                    style={{ width: `${mockData.apiStats.successRate}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-text-secondary">Avg Response Time</span>
                  <span className="font-semibold">{mockData.apiStats.avgResponseTime}ms</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="h-full bg-tier-gold rounded-full transition-all"
                    style={{ width: '23%' }}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-dark-border">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Total Volume</span>
                  <span className="font-bold text-tier-gold">
                    ${mockData.revenueStats.totalVolume.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
