import Link from 'next/link';
import { Database, TrendingUp, Cloud, BarChart3, Newspaper } from 'lucide-react';

const endpoints = [
  {
    name: 'Crypto Prices',
    path: '/api/data/crypto',
    method: 'GET',
    price: 0.02,
    icon: TrendingUp,
    description: 'Real-time cryptocurrency prices from CoinGecko',
    params: [
      { name: 'symbol', type: 'string', required: true, desc: 'Crypto symbol (BTC, ETH, SOL, etc.)' },
    ],
    example: {
      request: '?symbol=SOL',
      response: {
        success: true,
        data: {
          symbol: 'SOL',
          price: 125.43,
          change24h: '+5.67%',
          volume24h: 1500000000,
          marketCap: 52000000000,
        },
      },
    },
  },
  {
    name: 'Weather Data',
    path: '/api/data/weather',
    method: 'GET',
    price: 0.01,
    icon: Cloud,
    description: 'Current weather conditions for any city',
    params: [
      { name: 'city', type: 'string', required: true, desc: 'City name (London, Tokyo, etc.)' },
    ],
    example: {
      request: '?city=Istanbul',
      response: {
        success: true,
        data: {
          location: { city: 'Istanbul', country: 'Turkey' },
          current: {
            temperature: { celsius: 18, fahrenheit: 64 },
            humidity: 65,
            description: 'Partly cloudy',
          },
        },
      },
    },
  },
  {
    name: 'Stock Prices',
    path: '/api/data/stock',
    method: 'GET',
    price: 0.02,
    icon: BarChart3,
    description: 'Real-time stock market data',
    params: [
      { name: 'symbol', type: 'string', required: true, desc: 'Stock ticker (AAPL, GOOGL, TSLA)' },
    ],
    example: {
      request: '?symbol=AAPL',
      response: {
        success: true,
        data: {
          symbol: 'AAPL',
          price: 178.50,
          change: '+2.35',
          changePercent: '+1.33%',
          volume: 45000000,
        },
      },
    },
  },
  {
    name: 'News Feed',
    path: '/api/data/news',
    method: 'GET',
    price: 0.025,
    icon: Newspaper,
    description: 'Latest news articles by category or keyword',
    params: [
      { name: 'category', type: 'string', required: false, desc: 'Category: tech, business, crypto, etc.' },
      { name: 'query', type: 'string', required: false, desc: 'Search keyword' },
      { name: 'limit', type: 'number', required: false, desc: 'Number of articles (default: 10)' },
    ],
    example: {
      request: '?category=crypto&limit=5',
      response: {
        success: true,
        data: {
          articles: [
            {
              title: 'Bitcoin Reaches New High',
              source: 'CryptoNews',
              url: 'https://...',
              publishedAt: '2024-01-15T10:30:00Z',
            },
          ],
          total: 5,
        },
      },
    },
  },
];

export default function DataEndpointsPage() {
  return (
    <div className="prose prose-invert max-w-none">
      {/* Hero */}
      <div className="not-prose mb-8">
        <div className="flex items-center gap-2 text-accent text-sm font-medium mb-4">
          <Database className="w-4 h-4" />
          <span>API Reference</span>
        </div>
        <h1 className="text-4xl font-bold font-heading mb-4">Data Endpoints</h1>
        <p className="text-xl text-text-secondary">
          Real-time data from various sources including crypto, weather, stocks, and news.
        </p>
      </div>

      {/* Endpoints */}
      <div className="not-prose space-y-8">
        {endpoints.map((endpoint) => {
          const Icon = endpoint.icon;
          return (
            <div
              key={endpoint.path}
              className="p-6 rounded-xl bg-dark-card border border-dark-border"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{endpoint.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 rounded bg-accent/20 text-accent text-xs font-mono">
                        {endpoint.method}
                      </span>
                      <span className="font-mono text-sm text-text-secondary">{endpoint.path}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-burn">${endpoint.price.toFixed(3)}</div>
                  <div className="text-xs text-text-muted">per request</div>
                </div>
              </div>

              <p className="text-text-secondary mb-4">{endpoint.description}</p>

              {/* Parameters */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-text-muted mb-2">Query Parameters</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-dark-border">
                        <th className="text-left py-2 pr-4 text-text-muted font-medium">Name</th>
                        <th className="text-left py-2 pr-4 text-text-muted font-medium">Type</th>
                        <th className="text-left py-2 pr-4 text-text-muted font-medium">Required</th>
                        <th className="text-left py-2 text-text-muted font-medium">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {endpoint.params.map((param) => (
                        <tr key={param.name} className="border-b border-dark-border/50">
                          <td className="py-2 pr-4 font-mono text-burn">{param.name}</td>
                          <td className="py-2 pr-4 font-mono text-text-secondary">{param.type}</td>
                          <td className="py-2 pr-4">
                            {param.required ? (
                              <span className="text-accent">Yes</span>
                            ) : (
                              <span className="text-text-muted">No</span>
                            )}
                          </td>
                          <td className="py-2 text-text-secondary">{param.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Example */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-text-muted mb-2">Request</h4>
                  <div className="bg-dark-elevated rounded-lg border border-dark-border overflow-hidden">
                    <pre className="p-3 overflow-x-auto text-xs">
                      <code>GET {endpoint.path}{endpoint.example.request}</code>
                    </pre>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-text-muted mb-2">Response</h4>
                  <div className="bg-dark-elevated rounded-lg border border-dark-border overflow-hidden">
                    <pre className="p-3 overflow-x-auto text-xs">
                      <code>{JSON.stringify(endpoint.example.response, null, 2)}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* More Endpoints */}
      <div className="not-prose mt-8">
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            href="/docs/api/ai"
            className="p-4 rounded-lg bg-dark-elevated border border-dark-border hover:border-pyre-primary transition-colors"
          >
            <h4 className="font-semibold mb-1">← AI Endpoints</h4>
            <p className="text-sm text-text-secondary">Chat, images, translation</p>
          </Link>
          <Link
            href="/docs/api/tools"
            className="p-4 rounded-lg bg-dark-elevated border border-dark-border hover:border-pyre-primary transition-colors"
          >
            <h4 className="font-semibold mb-1">Tool Endpoints →</h4>
            <p className="text-sm text-text-secondary">QR codes, screenshots, PDFs</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
