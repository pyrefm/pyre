'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Play,
  Copy,
  Check,
  Loader2,
  Flame,
  Code2,
  FileJson,
  Terminal,
  Sparkles,
  Database,
  Coins,
  AlertCircle,
  Wallet,
} from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { createPaymentProof } from '@/lib/payments/middleware';
import { PaymentModal } from '@/components/payment/PaymentModal';
import ConnectButton from '@/components/wallet/ConnectButton';
import { useTokenBalance } from '@/hooks/useTokenBalance';
import { isTokenConfigured } from '@/lib/solana/config';

interface ApiEndpoint {
  path: string;
  method: 'GET' | 'POST';
  priceUSD: number;
  description: string;
  category: 'AI' | 'Data' | 'Tools';
  params?: { name: string; type: string; description: string }[];
  bodyExample?: Record<string, unknown>;
}

const endpoints: ApiEndpoint[] = [
  {
    path: '/api/ai/chat',
    method: 'POST',
    priceUSD: 0.05,
    category: 'AI',
    description: 'AI Chat Completion - Get intelligent responses powered by GPT-4',
    params: [
      { name: 'message', type: 'string', description: 'Your message to the AI' },
      { name: 'model', type: 'string', description: 'AI model (optional)' },
    ],
    bodyExample: { message: 'What is PYRE token?', model: 'gpt-4o-mini' },
  },
  {
    path: '/api/ai/image',
    method: 'POST',
    priceUSD: 0.10,
    category: 'AI',
    description: 'AI Image Generation - Create images with DALL-E 3',
    params: [
      { name: 'prompt', type: 'string', description: 'Image description' },
      { name: 'size', type: 'string', description: 'Image size (optional)' },
    ],
    bodyExample: { prompt: 'A futuristic token burning in flames', size: '1024x1024' },
  },
  {
    path: '/api/data/crypto',
    method: 'GET',
    priceUSD: 0.02,
    category: 'Data',
    description: 'Cryptocurrency Prices - Real-time data from CoinGecko',
    params: [{ name: 'symbol', type: 'string', description: 'Crypto symbol (BTC, ETH, SOL)' }],
  },
  {
    path: '/api/data/weather',
    method: 'GET',
    priceUSD: 0.01,
    category: 'Data',
    description: 'Weather Data - Current weather from wttr.in',
    params: [{ name: 'city', type: 'string', description: 'City name' }],
  },
];

const categoryIcons = {
  AI: Sparkles,
  Data: Database,
  Tools: Coins,
};

interface TokenPriceData {
  price: number;
  priceAvailable: boolean;
}

export default function PlaygroundPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('AI');
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint>(endpoints[0]);
  const [activeTab, setActiveTab] = useState<'request' | 'response' | 'code'>('request');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [requestBody, setRequestBody] = useState(JSON.stringify(endpoints[0].bodyExample || {}, null, 2));
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [tokenPrice, setTokenPrice] = useState<TokenPriceData>({ price: 0, priceAvailable: false });
  const [priceLoading, setPriceLoading] = useState(true);
  
  // Wallet integration
  const { connected, publicKey } = useWallet();
  const { balance } = useTokenBalance();
  const tokenConfigured = isTokenConfigured();
  
  const filteredEndpoints = endpoints.filter(e => e.category === selectedCategory);

  // Fetch real token price on mount
  useEffect(() => {
    const fetchTokenPrice = async () => {
      try {
        const res = await fetch('/api/token/price');
        const data = await res.json();
        if (data.success) {
          setTokenPrice({
            price: data.token.price,
            priceAvailable: data.token.priceAvailable,
          });
        }
      } catch (err) {
        console.error('Failed to fetch token price:', err);
      } finally {
        setPriceLoading(false);
      }
    };

    fetchTokenPrice();
    // Refresh price every 60 seconds
    const interval = setInterval(fetchTokenPrice, 60000);
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    // Reset when endpoint changes
    setResponse(null);
    setError(null);
    setActiveTab('request');
    
    if (selectedEndpoint.bodyExample) {
      setRequestBody(JSON.stringify(selectedEndpoint.bodyExample, null, 2));
    } else {
      setRequestBody('{}');
    }
    
    // Set default query params
    const params: Record<string, string> = {};
    selectedEndpoint.params?.forEach(p => {
      if (selectedEndpoint.method === 'GET') {
        params[p.name] = p.name === 'symbol' ? 'SOL' : p.name === 'city' ? 'London' : '';
      }
    });
    setQueryParams(params);
  }, [selectedEndpoint]);
  
  const calculateTokenCost = (): number | null => {
    if (!tokenPrice.priceAvailable || tokenPrice.price <= 0) {
      return null;
    }
    return Math.ceil(selectedEndpoint.priceUSD / tokenPrice.price);
  };
  
  // For executing after successful payment
  const executeRequest = (txSignature: string) => makeRequest(txSignature);
  
  const handlePayButtonClick = () => {
    if (!tokenConfigured) {
      setError('$PYRE token is not yet launched. Payment will be enabled after token launch.');
      setActiveTab('response');
      return;
    }

    if (!connected || !publicKey) {
      setError('Please connect your wallet to make a payment.');
      setActiveTab('response');
      return;
    }

    const cost = calculateTokenCost();
    if (cost === null) {
      setError('Token price not available. Please try again later.');
      setActiveTab('response');
      return;
    }

    if (balance < cost) {
      setError(`Insufficient balance. You need ${cost} $PYRE but only have ${balance.toFixed(2)} $PYRE.`);
      setActiveTab('response');
      return;
    }

    setShowPaymentModal(true);
  };
  
  const makeRequest = async (txSignature?: string) => {
    setLoading(true);
    setError(null);
    setResponse(null);
    
    try {
      let url = selectedEndpoint.path;
      
      // Add query params for GET requests
      if (selectedEndpoint.method === 'GET' && Object.keys(queryParams).length > 0) {
        const params = new URLSearchParams(queryParams);
        url += `?${params.toString()}`;
      }
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Add wallet address if connected
      if (publicKey) {
        headers['x-wallet-address'] = publicKey.toString();
      }
      
      // Add payment proof if we have a transaction signature
      if (txSignature) {
        headers['x-payment-proof'] = createPaymentProof(txSignature);
      }
      
      const options: RequestInit = {
        method: selectedEndpoint.method,
        headers,
      };
      
      if (selectedEndpoint.method === 'POST' && requestBody.trim()) {
        options.body = requestBody;
      }
      
      const res = await fetch(url, options);
      const data = await res.json();
      
      setResponse(data);
      
      if (res.status === 402) {
        setError('Payment required! Connect your wallet and click "Pay & Burn" to proceed.');
      } else if (res.status === 503) {
        setError(data.message || 'Service temporarily unavailable.');
      } else if (!res.ok) {
        setError(data.error || 'Request failed');
      } else {
        setActiveTab('response');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setLoading(false);
    }
  };
  
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };
  
  const generateCode = (): string => {
    const tokenCost = calculateTokenCost();
    const costDisplay = tokenCost !== null ? tokenCost : 'CALCULATE_FROM_PRICE';
    
    return `// PYRE API Request with Token Payment
import { createPaymentProof } from '@pyre/sdk';

const walletAddress = 'YOUR_WALLET_ADDRESS';
const tokenAmount = ${costDisplay}; // $${selectedEndpoint.priceUSD} in $PYRE

// Create and sign payment transaction
const { signature } = await signPaymentTransaction(
  walletAddress,
  tokenAmount,
  PYRE_TOKEN_MINT
);

// Create payment proof from signature
const paymentProof = createPaymentProof(signature);

// Make API request
const response = await fetch('${selectedEndpoint.path}', {
  method: '${selectedEndpoint.method}',
  headers: {
    'Content-Type': 'application/json',
    'x-wallet-address': walletAddress,
    'x-payment-proof': paymentProof,
  },${selectedEndpoint.method === 'POST' ? `
  body: JSON.stringify(${requestBody}),` : ''}
});

const data = await response.json();

// Payment breakdown:
// - 30% tokens BURNED 🔥
// - 50% tokens to API provider
// - 15% tokens to holders
// - 5% tokens to treasury`;
  };

  const tokenCost = calculateTokenCost();

  return (
    <div className="min-h-screen bg-dark relative">
      {/* Background Video */}
      <div className="fixed inset-0 z-0">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        >
          <source src="/assets/demo-video-1.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-dark/80" />
      </div>

      {/* Header */}
      <header className="bg-dark-card/80 backdrop-blur-lg border-b border-dark-border sticky top-0 z-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
            <div className="flex items-center gap-4">
              <Flame className="w-6 h-6 text-burn" />
              <h1 className="text-xl font-bold font-heading">API Playground</h1>
            </div>
            <div className="flex items-center gap-3">
              <ConnectButton />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Token Not Configured Warning */}
        {!tokenConfigured && (
          <div className="mb-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-500">Token Not Launched</h3>
              <p className="text-sm text-text-secondary">
                $PYRE token is not yet configured. API payments will be enabled after the token launch.
                You can still test the &quot;Try Without Payment&quot; feature to see pricing info.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-24">
              {/* Categories */}
              <h2 className="text-lg font-semibold mb-4">Categories</h2>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {Object.entries(categoryIcons).map(([cat, Icon]) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      const first = endpoints.find(e => e.category === cat);
                      if (first) setSelectedEndpoint(first);
                    }}
                    className={`flex items-center gap-2 p-3 rounded-lg transition-all ${
                      selectedCategory === cat
                        ? 'bg-pyre-primary text-white'
                        : 'bg-dark-elevated text-text-secondary hover:bg-dark-border'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{cat}</span>
                  </button>
                ))}
              </div>

              {/* Endpoints */}
              <h3 className="text-lg font-semibold mb-3">Endpoints</h3>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {filteredEndpoints.map((endpoint) => (
                  <button
                    key={endpoint.path}
                    onClick={() => setSelectedEndpoint(endpoint)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedEndpoint.path === endpoint.path
                        ? 'bg-pyre-primary text-white'
                        : 'bg-dark-elevated text-text-secondary hover:bg-dark-border'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono">{endpoint.method}</span>
                      <span className="text-xs font-semibold">${endpoint.priceUSD}</span>
                    </div>
                    <div className="text-sm font-medium truncate">{endpoint.path}</div>
                  </button>
                ))}
              </div>

              {/* Token Cost Info */}
              <div className="mt-6 p-4 rounded-lg bg-burn/10 border border-burn/30">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="w-4 h-4 text-burn" />
                  <span className="text-sm font-semibold text-burn">Token Cost</span>
                </div>
                {priceLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-text-muted" />
                    <span className="text-text-muted">Loading price...</span>
                  </div>
                ) : tokenCost !== null ? (
                  <>
                    <div className="text-2xl font-bold text-white mb-1">
                      {tokenCost.toLocaleString()} $PYRE
                    </div>
                    <div className="text-xs text-text-muted">
                      ≈ ${selectedEndpoint.priceUSD} • 30% will be burned 🔥
                    </div>
                    {connected && (
                      <div className="mt-2 text-xs">
                        <span className="text-text-muted">Balance: </span>
                        <span className={balance >= tokenCost ? 'text-accent' : 'text-red-400'}>
                          {balance.toLocaleString()} $PYRE
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-text-muted text-sm">
                    Price unavailable
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-6">
                {(['request', 'response', 'code'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg transition-all capitalize flex items-center gap-2 ${
                      activeTab === tab
                        ? 'bg-pyre-primary text-white'
                        : 'bg-dark-elevated text-text-secondary hover:bg-dark-border'
                    }`}
                  >
                    {tab === 'request' && <Terminal className="w-4 h-4" />}
                    {tab === 'response' && <FileJson className="w-4 h-4" />}
                    {tab === 'code' && <Code2 className="w-4 h-4" />}
                    {tab}
                  </button>
                ))}
              </div>

              {/* Request Tab */}
              {activeTab === 'request' && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-lg bg-pyre-primary text-white text-sm font-semibold">
                      {selectedEndpoint.method}
                    </span>
                    <code className="text-text-secondary font-mono">{selectedEndpoint.path}</code>
                  </div>
                  
                  <p className="text-text-secondary mb-6">{selectedEndpoint.description}</p>

                  {/* Query Params for GET */}
                  {selectedEndpoint.method === 'GET' && selectedEndpoint.params && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold mb-3">Query Parameters</h3>
                      <div className="space-y-3">
                        {selectedEndpoint.params.map((param) => (
                          <div key={param.name}>
                            <label className="text-xs text-text-muted mb-1 block">{param.name}</label>
                            <input
                              type="text"
                              value={queryParams[param.name] || ''}
                              onChange={(e) => setQueryParams({ ...queryParams, [param.name]: e.target.value })}
                              placeholder={param.description}
                              className="input"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Body for POST */}
                  {selectedEndpoint.method === 'POST' && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold mb-3">Request Body</h3>
                      <textarea
                        value={requestBody}
                        onChange={(e) => setRequestBody(e.target.value)}
                        className="input font-mono text-sm h-32"
                      />
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => makeRequest()}
                      disabled={loading}
                      className="flex-1 btn-secondary flex items-center justify-center gap-2"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                      Try Without Payment
                    </button>
                    <button
                      onClick={handlePayButtonClick}
                      disabled={loading || !tokenConfigured || tokenCost === null}
                      className="flex-1 btn-burn flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : !connected ? (
                        <Wallet className="w-4 h-4" />
                      ) : (
                        <Flame className="w-4 h-4" />
                      )}
                      {!connected ? 'Connect Wallet' : 'Pay & Burn'}
                    </button>
                  </div>
                </div>
              )}

              {/* Response Tab */}
              {activeTab === 'response' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Response</h3>
                    {response && (
                      <button
                        onClick={() => copyToClipboard(JSON.stringify(response, null, 2), 'response')}
                        className="p-2 rounded-lg hover:bg-dark-elevated transition-colors"
                      >
                        {copied === 'response' ? (
                          <Check className="w-4 h-4 text-accent" />
                        ) : (
                          <Copy className="w-4 h-4 text-text-muted" />
                        )}
                      </button>
                    )}
                  </div>

                  {error && (
                    <div className={`mb-4 p-4 rounded-lg ${
                      error.includes('Payment required')
                        ? 'bg-burn/10 border border-burn/30 text-burn'
                        : 'bg-red-500/10 border border-red-500/30 text-red-400'
                    }`}>
                      {error}
                    </div>
                  )}

                  {response ? (
                    <pre className="code-block text-sm max-h-96 overflow-auto">
                      {JSON.stringify(response, null, 2)}
                    </pre>
                  ) : (
                    <div className="p-12 text-center text-text-muted">
                      <FileJson className="w-16 h-16 mx-auto mb-4 opacity-30" />
                      <p>No response yet. Make a request to see results.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Code Tab */}
              {activeTab === 'code' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Integration Code</h3>
                    <button
                      onClick={() => copyToClipboard(generateCode(), 'code')}
                      className="p-2 rounded-lg hover:bg-dark-elevated transition-colors"
                    >
                      {copied === 'code' ? (
                        <Check className="w-4 h-4 text-accent" />
                      ) : (
                        <Copy className="w-4 h-4 text-text-muted" />
                      )}
                    </button>
                  </div>

                  <pre className="code-block text-sm max-h-96 overflow-auto">
                    {generateCode()}
                  </pre>

                  <div className="mt-4 p-4 rounded-lg bg-pyre-primary/10 border border-pyre-primary/30">
                    <p className="text-sm text-pyre-primary-light">
                      💡 <strong>Tip:</strong> Install the PYRE SDK for easier integration:{' '}
                      <code className="bg-dark-elevated px-2 py-0.5 rounded">npm install @pyre/sdk</code>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {tokenCost !== null && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={(signature) => {
            setShowPaymentModal(false);
            // Proceed with API call after successful payment
            executeRequest(signature);
          }}
          tokenAmount={tokenCost}
          endpoint={selectedEndpoint.path}
          usdPrice={selectedEndpoint.priceUSD}
        />
      )}
    </div>
  );
}
