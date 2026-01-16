import Link from 'next/link';
import { 
  Flame, 
  Zap, 
  Shield, 
  Code2, 
  ArrowRight, 
  Coins,
  TrendingUp,
  Users,
} from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="prose prose-invert max-w-none">
      {/* Hero */}
      <div className="not-prose mb-12">
        <div className="flex items-center gap-2 text-burn text-sm font-medium mb-4">
          <Flame className="w-4 h-4" />
          <span>Welcome to PYRE</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">
          The Deflationary API Economy
        </h1>
        <p className="text-xl text-text-secondary max-w-2xl">
          PYRE is a token-native API platform where every API call burns $PYRE tokens, 
          creating scarcity and value for token holders.
        </p>
      </div>

      {/* Quick Links */}
      <div className="not-prose grid md:grid-cols-2 gap-4 mb-12">
        <Link
          href="/docs/quickstart"
          className="group p-6 rounded-xl bg-dark-card border border-dark-border hover:border-pyre-primary transition-colors"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-pyre-primary/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-pyre-primary" />
            </div>
            <h3 className="font-bold text-lg">Quick Start</h3>
          </div>
          <p className="text-text-secondary text-sm mb-3">
            Get up and running with PYRE in under 5 minutes.
          </p>
          <span className="text-pyre-primary text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
            Start building <ArrowRight className="w-4 h-4" />
          </span>
        </Link>

        <Link
          href="/playground"
          className="group p-6 rounded-xl bg-dark-card border border-dark-border hover:border-burn transition-colors"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-burn/20 flex items-center justify-center">
              <Code2 className="w-5 h-5 text-burn" />
            </div>
            <h3 className="font-bold text-lg">API Playground</h3>
          </div>
          <p className="text-text-secondary text-sm mb-3">
            Test our APIs interactively before integrating.
          </p>
          <span className="text-burn text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
            Try it now <ArrowRight className="w-4 h-4" />
          </span>
        </Link>
      </div>

      {/* What is PYRE */}
      <h2 className="flex items-center gap-3">
        <Flame className="w-6 h-6 text-burn" />
        What is PYRE?
      </h2>
      
      <p>
        PYRE is revolutionizing how developers pay for API services. Instead of traditional 
        subscription models or credit card payments, PYRE uses a <strong>token-native payment system</strong> where:
      </p>

      <div className="not-prose grid sm:grid-cols-2 gap-4 my-6">
        <div className="p-4 rounded-lg bg-dark-elevated border border-dark-border">
          <div className="flex items-center gap-2 mb-2">
            <Coins className="w-5 h-5 text-tier-gold" />
            <span className="font-semibold">Pay with $PYRE</span>
          </div>
          <p className="text-sm text-text-secondary">
            All API calls are paid using $PYRE tokens. No credit cards, no subscriptions.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-dark-elevated border border-dark-border">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5 text-burn" />
            <span className="font-semibold">30% Burned</span>
          </div>
          <p className="text-sm text-text-secondary">
            Every payment permanently burns 30% of tokens, reducing supply forever.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-dark-elevated border border-dark-border">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            <span className="font-semibold">Deflationary</span>
          </div>
          <p className="text-sm text-text-secondary">
            More API usage = more burns = less supply = potential value increase.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-dark-elevated border border-dark-border">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-pyre-primary" />
            <span className="font-semibold">Holder Rewards</span>
          </div>
          <p className="text-sm text-text-secondary">
            15% of each payment goes to the holder reward pool.
          </p>
        </div>
      </div>

      {/* How it Works */}
      <h2 className="flex items-center gap-3">
        <Zap className="w-6 h-6 text-pyre-primary" />
        How It Works
      </h2>

      <div className="not-prose my-6">
        <div className="relative">
          {/* Timeline */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-dark-border" />
          
          <div className="space-y-6">
            {[
              { step: '1', title: 'Connect Wallet', desc: 'Connect your Solana wallet (Phantom, Solflare, etc.)' },
              { step: '2', title: 'Hold $PYRE', desc: 'Acquire $PYRE tokens to pay for API calls' },
              { step: '3', title: 'Make API Call', desc: 'Call any PYRE API endpoint' },
              { step: '4', title: 'Approve Payment', desc: 'Confirm the $PYRE payment in your wallet' },
              { step: '5', title: 'Tokens Distributed', desc: '30% burned 🔥, 50% to provider, 15% to holders, 5% treasury' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 relative">
                <div className="w-12 h-12 rounded-full bg-pyre-primary/20 border-2 border-pyre-primary flex items-center justify-center font-bold text-pyre-primary z-10">
                  {item.step}
                </div>
                <div className="pt-2">
                  <h4 className="font-semibold mb-1">{item.title}</h4>
                  <p className="text-text-secondary text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Distribution */}
      <h2 className="flex items-center gap-3">
        <Coins className="w-6 h-6 text-tier-gold" />
        Payment Distribution
      </h2>

      <p>
        Every API payment is automatically distributed according to our tokenomics:
      </p>

      <div className="not-prose my-6 p-6 rounded-xl bg-dark-card border border-dark-border">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-burn font-medium">🔥 Burn (Permanent)</span>
              <span className="font-bold">30%</span>
            </div>
            <div className="h-3 rounded-full bg-dark-elevated overflow-hidden">
              <div className="h-full w-[30%] bg-burn rounded-full" />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-pyre-primary font-medium">👨‍💻 API Provider</span>
              <span className="font-bold">50%</span>
            </div>
            <div className="h-3 rounded-full bg-dark-elevated overflow-hidden">
              <div className="h-full w-[50%] bg-pyre-primary rounded-full" />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-accent font-medium">📈 Holder Pool</span>
              <span className="font-bold">15%</span>
            </div>
            <div className="h-3 rounded-full bg-dark-elevated overflow-hidden">
              <div className="h-full w-[15%] bg-accent rounded-full" />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-tier-silver font-medium">🏦 Treasury</span>
              <span className="font-bold">5%</span>
            </div>
            <div className="h-3 rounded-full bg-dark-elevated overflow-hidden">
              <div className="h-full w-[5%] bg-tier-silver rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Available APIs */}
      <h2 className="flex items-center gap-3">
        <Code2 className="w-6 h-6 text-accent" />
        Available APIs
      </h2>

      <p>
        PYRE offers a variety of APIs across different categories:
      </p>

      <div className="not-prose grid sm:grid-cols-3 gap-4 my-6">
        <div className="p-4 rounded-lg bg-dark-elevated border border-dark-border">
          <h4 className="font-semibold mb-2">🤖 AI APIs</h4>
          <ul className="text-sm text-text-secondary space-y-1">
            <li>• Chat Completion</li>
            <li>• Image Generation</li>
            <li>• Translation</li>
            <li>• Text-to-Speech</li>
          </ul>
        </div>

        <div className="p-4 rounded-lg bg-dark-elevated border border-dark-border">
          <h4 className="font-semibold mb-2">📊 Data APIs</h4>
          <ul className="text-sm text-text-secondary space-y-1">
            <li>• Crypto Prices</li>
            <li>• Weather Data</li>
            <li>• Stock Market</li>
            <li>• News Feed</li>
          </ul>
        </div>

        <div className="p-4 rounded-lg bg-dark-elevated border border-dark-border">
          <h4 className="font-semibold mb-2">🛠️ Tool APIs</h4>
          <ul className="text-sm text-text-secondary space-y-1">
            <li>• QR Code Generator</li>
            <li>• Screenshot Capture</li>
            <li>• PDF Generation</li>
            <li>• And more...</li>
          </ul>
        </div>
      </div>

      {/* Next Steps */}
      <h2 className="flex items-center gap-3">
        <ArrowRight className="w-6 h-6 text-pyre-primary" />
        Next Steps
      </h2>

      <div className="not-prose grid sm:grid-cols-2 gap-4 my-6">
        <Link
          href="/docs/quickstart"
          className="p-4 rounded-lg bg-pyre-primary/10 border border-pyre-primary/30 hover:border-pyre-primary transition-colors"
        >
          <h4 className="font-semibold text-pyre-primary mb-1">Quick Start Guide →</h4>
          <p className="text-sm text-text-secondary">Get your first API call working in minutes</p>
        </Link>

        <Link
          href="/docs/tokenomics"
          className="p-4 rounded-lg bg-burn/10 border border-burn/30 hover:border-burn transition-colors"
        >
          <h4 className="font-semibold text-burn mb-1">Tokenomics →</h4>
          <p className="text-sm text-text-secondary">Learn about the $PYRE burn mechanism</p>
        </Link>
      </div>
    </div>
  );
}
