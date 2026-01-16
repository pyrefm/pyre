import Link from 'next/link';
import { Terminal, CheckCircle2, Clock, Code2 } from 'lucide-react';

export default function InstallationPage() {
  return (
    <div className="prose prose-invert max-w-none">
      <div className="not-prose mb-8">
        <div className="flex items-center gap-2 text-pyre-primary text-sm font-medium mb-4">
          <Terminal className="w-4 h-4" />
          <span>Getting Started</span>
        </div>
        <h1 className="text-4xl font-bold font-heading mb-4">Installation</h1>
        <p className="text-xl text-text-secondary">
          Get started with PYRE APIs.
        </p>
      </div>

      <h2 className="flex items-center gap-3">
        <CheckCircle2 className="w-6 h-6 text-accent" />
        Requirements
      </h2>

      <ul>
        <li>A Solana wallet (Phantom, Solflare, etc.)</li>
        <li>$PYRE tokens in your wallet</li>
        <li>Any HTTP client (fetch, axios, curl, etc.)</li>
      </ul>

      <h2 className="flex items-center gap-3">
        <Code2 className="w-6 h-6 text-pyre-primary" />
        No Installation Required
      </h2>

      <p>
        PYRE uses standard REST APIs - no SDK installation needed! 
        You can call our APIs directly from any language or platform.
      </p>

      <div className="not-prose my-4">
        <div className="bg-dark-elevated rounded-lg border border-dark-border overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-dark-card border-b border-dark-border">
            <span className="text-xs text-text-muted">JavaScript</span>
          </div>
          <pre className="p-4 overflow-x-auto text-sm">
            <code>{`// Just use fetch - no SDK needed!
const response = await fetch('https://pyrefm.xyz/api/data/crypto?symbol=SOL', {
  headers: {
    'x-wallet-address': 'YOUR_WALLET_ADDRESS',
    'x-payment-proof': 'PAYMENT_PROOF',
  }
});`}</code>
          </pre>
        </div>
      </div>

      <h2 className="flex items-center gap-3">
        <Clock className="w-6 h-6 text-tier-gold" />
        SDKs Coming Soon
      </h2>

      <p>
        Official SDKs for JavaScript, Python, and React Native are under development. 
        In the meantime, use our REST APIs directly.
      </p>

      <div className="not-prose my-4">
        <Link href="/docs/quickstart" className="btn-primary">
          Continue to Quick Start →
        </Link>
      </div>
    </div>
  );
}
