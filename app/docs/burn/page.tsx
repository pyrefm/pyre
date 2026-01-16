import Link from 'next/link';
import { Flame, TrendingDown, Eye, ExternalLink } from 'lucide-react';

export default function BurnPage() {
  return (
    <div className="prose prose-invert max-w-none">
      {/* Hero */}
      <div className="not-prose mb-8">
        <div className="flex items-center gap-2 text-burn text-sm font-medium mb-4">
          <Flame className="w-4 h-4" />
          <span>Core Concepts</span>
        </div>
        <h1 className="text-4xl font-bold font-heading mb-4">Burn Mechanism</h1>
        <p className="text-xl text-text-secondary">
          How the $PYRE burn creates deflationary pressure and value.
        </p>
      </div>

      {/* Burn Explanation */}
      <h2 className="flex items-center gap-3">
        <Flame className="w-6 h-6 text-burn" />
        What is Token Burning?
      </h2>

      <p>
        Token burning is the process of permanently removing tokens from circulation. 
        In PYRE, <strong>30% of every API payment is burned</strong> by sending it to a 
        null address that no one can access.
      </p>

      <div className="not-prose my-6 p-6 rounded-xl bg-burn/10 border border-burn/30">
        <div className="text-center">
          <div className="text-4xl font-bold text-burn mb-2">30%</div>
          <div className="text-text-secondary">of every payment is burned forever</div>
        </div>
      </div>

      {/* Why Burn */}
      <h2 className="flex items-center gap-3">
        <TrendingDown className="w-6 h-6 text-accent" />
        Why Burn Tokens?
      </h2>

      <div className="not-prose grid sm:grid-cols-2 gap-4 my-6">
        <div className="p-4 rounded-lg bg-dark-elevated border border-dark-border">
          <h4 className="font-semibold text-burn mb-2">📉 Reduces Supply</h4>
          <p className="text-sm text-text-secondary">
            Every burn permanently decreases total supply, creating scarcity over time.
          </p>
        </div>
        <div className="p-4 rounded-lg bg-dark-elevated border border-dark-border">
          <h4 className="font-semibold text-accent mb-2">📈 Increases Scarcity</h4>
          <p className="text-sm text-text-secondary">
            As supply decreases, remaining tokens become more scarce.
          </p>
        </div>
        <div className="p-4 rounded-lg bg-dark-elevated border border-dark-border">
          <h4 className="font-semibold text-pyre-primary mb-2">💎 Ties Utility to Value</h4>
          <p className="text-sm text-text-secondary">
            More API usage = more burns = more deflation. Utility drives value.
          </p>
        </div>
        <div className="p-4 rounded-lg bg-dark-elevated border border-dark-border">
          <h4 className="font-semibold text-tier-gold mb-2">🔒 Permanent & Irreversible</h4>
          <p className="text-sm text-text-secondary">
            Burned tokens can never be recovered. The burn is final.
          </p>
        </div>
      </div>

      {/* How it Works */}
      <h2>How Burning Works</h2>

      <p>When you make an API call:</p>

      <div className="not-prose my-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-lg bg-dark-card border border-dark-border">
            <div className="w-10 h-10 rounded-full bg-pyre-primary/20 flex items-center justify-center font-bold text-pyre-primary">1</div>
            <div>
              <div className="font-semibold">You pay 100 $PYRE for an API call</div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-lg bg-burn/10 border border-burn/30">
            <div className="w-10 h-10 rounded-full bg-burn/20 flex items-center justify-center font-bold text-burn">2</div>
            <div>
              <div className="font-semibold text-burn">30 $PYRE sent to burn address</div>
              <div className="text-sm text-text-muted">Permanently removed from supply</div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-lg bg-dark-card border border-dark-border">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center font-bold text-accent">3</div>
            <div>
              <div className="font-semibold">70 $PYRE distributed</div>
              <div className="text-sm text-text-muted">50% provider, 15% holders, 5% treasury</div>
            </div>
          </div>
        </div>
      </div>

      {/* Verify Burns */}
      <h2 className="flex items-center gap-3">
        <Eye className="w-6 h-6 text-pyre-primary" />
        Verify Burns On-Chain
      </h2>

      <p>
        All burns are transparent and verifiable on the Solana blockchain. 
        Every API payment includes a transaction hash that you can verify on Solscan.
      </p>

      <div className="not-prose my-4">
        <div className="bg-dark-elevated rounded-lg border border-dark-border overflow-hidden">
          <pre className="p-4 overflow-x-auto text-sm">
            <code>{`// Every API response includes payment info
{
  "success": true,
  "data": { ... },
  "_payment": {
    "amount": 100,
    "burned": 30,
    "txHash": "5KtP3Jx..."  // Verify this on Solscan
  }
}`}</code>
          </pre>
        </div>
      </div>

      <div className="not-prose my-4">
        <a 
          href="https://solscan.io" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-pyre-primary hover:underline"
        >
          View burns on Solscan <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Live Stats */}
      <h2>Live Burn Statistics</h2>

      <p>
        Track real-time burn statistics on the dashboard:
      </p>

      <div className="not-prose my-4">
        <Link href="/dashboard" className="btn-burn inline-flex items-center gap-2">
          <Flame className="w-4 h-4" />
          View Live Burn Stats
        </Link>
      </div>
    </div>
  );
}
