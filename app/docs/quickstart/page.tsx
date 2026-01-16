import Link from 'next/link';
import { Rocket, Terminal, Code2, CheckCircle2, ArrowRight, Flame } from 'lucide-react';

export default function QuickStartPage() {
  return (
    <div className="prose prose-invert max-w-none">
      {/* Hero */}
      <div className="not-prose mb-8">
        <div className="flex items-center gap-2 text-pyre-primary text-sm font-medium mb-4">
          <Rocket className="w-4 h-4" />
          <span>Getting Started</span>
        </div>
        <h1 className="text-4xl font-bold font-heading mb-4">Quick Start</h1>
        <p className="text-xl text-text-secondary">
          Get up and running with PYRE in under 5 minutes.
        </p>
      </div>

      {/* Prerequisites */}
      <h2 className="flex items-center gap-3">
        <CheckCircle2 className="w-6 h-6 text-accent" />
        Prerequisites
      </h2>

      <ul>
        <li>A Solana wallet (Phantom, Solflare, etc.)</li>
        <li>$PYRE tokens in your wallet</li>
        <li>Node.js 18+ (for SDK usage)</li>
      </ul>

      {/* Step 1: Connect Wallet */}
      <h2 className="flex items-center gap-3">
        <Terminal className="w-6 h-6 text-pyre-primary" />
        Step 1: Connect Your Wallet
      </h2>

      <p>
        Go to the PYRE app and connect your Solana wallet (Phantom, Solflare, etc.):
      </p>

      <div className="not-prose my-4">
        <Link href="/dashboard" className="btn-primary inline-flex items-center gap-2">
          Launch App & Connect Wallet
        </Link>
      </div>

      {/* Step 2: Make API Request */}
      <h2 className="flex items-center gap-3">
        <Code2 className="w-6 h-6 text-pyre-primary" />
        Step 2: Make Your First API Call
      </h2>

      <p>Use the Playground to test APIs interactively, or call them directly:</p>

      <div className="not-prose my-4">
        <div className="bg-dark-elevated rounded-lg border border-dark-border overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-dark-card border-b border-dark-border">
            <span className="text-xs text-text-muted">cURL</span>
          </div>
          <pre className="p-4 overflow-x-auto text-sm">
            <code>{`curl "https://pyrefm.xyz/api/data/crypto?symbol=SOL" \\
  -H "x-wallet-address: YOUR_WALLET_ADDRESS" \\
  -H "x-payment-proof: BASE64_PAYMENT_PROOF"`}</code>
          </pre>
        </div>
      </div>

      {/* Step 3: Payment */}
      <h2 className="flex items-center gap-3">
        <Flame className="w-6 h-6 text-burn" />
        Step 3: Approve Payment & Burn
      </h2>

      <p>
        When you make an API call, the system will prompt for $PYRE payment. 
        30% is burned forever, making the token deflationary!
      </p>

      <div className="not-prose my-4">
        <div className="bg-dark-elevated rounded-lg border border-dark-border overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-dark-card border-b border-dark-border">
            <span className="text-xs text-text-muted">Response Example</span>
          </div>
          <pre className="p-4 overflow-x-auto text-sm">
            <code>{`{
  "success": true,
  "data": {
    "symbol": "SOL",
    "price": 125.43,
    "change24h": "+5.67%"
  },
  "_payment": {
    "amount": 20,
    "burned": 6,  // 30% burned! 🔥
    "txHash": "abc123..."
  }
}`}</code>
          </pre>
        </div>
      </div>

      {/* Step 4: Handle Payments */}
      <h2>Step 4: Handling Payments</h2>

      <p>
        When you make an API call, the SDK will automatically prompt for payment approval.
        Here's how the flow works:
      </p>

      <div className="not-prose my-6 p-6 rounded-xl bg-dark-card border border-dark-border">
        <div className="space-y-4 text-sm">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-pyre-primary/20 flex items-center justify-center text-xs font-bold text-pyre-primary">1</div>
            <div>
              <p className="font-medium">SDK calculates required $PYRE</p>
              <p className="text-text-muted">Based on current token price and API cost</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-pyre-primary/20 flex items-center justify-center text-xs font-bold text-pyre-primary">2</div>
            <div>
              <p className="font-medium">Wallet prompts for approval</p>
              <p className="text-text-muted">Shows breakdown: burn, provider, holders, treasury</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-pyre-primary/20 flex items-center justify-center text-xs font-bold text-pyre-primary">3</div>
            <div>
              <p className="font-medium">Transaction executed</p>
              <p className="text-text-muted">30% burned, rest distributed</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">✓</div>
            <div>
              <p className="font-medium">API response returned</p>
              <p className="text-text-muted">Includes payment receipt with burn amount</p>
            </div>
          </div>
        </div>
      </div>

      {/* Example: JavaScript Fetch */}
      <h2>Complete Example: JavaScript</h2>

      <div className="not-prose my-4">
        <div className="bg-dark-elevated rounded-lg border border-dark-border overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-dark-card border-b border-dark-border">
            <span className="text-xs text-text-muted">JavaScript / fetch</span>
          </div>
          <pre className="p-4 overflow-x-auto text-sm">
            <code>{`// Example: AI Chat API
async function chatWithAI(message) {
  const response = await fetch('https://pyrefm.xyz/api/ai/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-wallet-address': 'YOUR_WALLET_ADDRESS',
      'x-payment-proof': paymentProof, // From wallet transaction
    },
    body: JSON.stringify({ message }),
  });

  const data = await response.json();
  
  console.log('AI Response:', data.data.message);
  console.log('Tokens burned:', data._payment.burned, '🔥');
  
  return data;
}

// Use it
chatWithAI('Explain blockchain in simple terms');`}</code>
          </pre>
        </div>
      </div>

      {/* cURL Example */}
      <h2>Example: cURL</h2>

      <div className="not-prose my-4">
        <div className="bg-dark-elevated rounded-lg border border-dark-border overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-dark-card border-b border-dark-border">
            <span className="text-xs text-text-muted">cURL</span>
          </div>
          <pre className="p-4 overflow-x-auto text-sm">
            <code>{`curl -X POST https://pyrefm.xyz/api/ai/chat \\
  -H "Content-Type: application/json" \\
  -H "x-wallet-address: YOUR_WALLET_ADDRESS" \\
  -H "x-payment-proof: BASE64_ENCODED_TX_PROOF" \\
  -d '{"message": "Hello, AI!"}'`}</code>
          </pre>
        </div>
      </div>

      {/* Next Steps */}
      <h2 className="flex items-center gap-3">
        <ArrowRight className="w-6 h-6 text-pyre-primary" />
        Next Steps
      </h2>

      <div className="not-prose grid sm:grid-cols-2 gap-4 my-6">
        <Link
          href="/docs/api/ai"
          className="p-4 rounded-lg bg-dark-elevated border border-dark-border hover:border-pyre-primary transition-colors"
        >
          <h4 className="font-semibold mb-1">API Reference →</h4>
          <p className="text-sm text-text-secondary">Explore all available endpoints</p>
        </Link>

        <Link
          href="/playground"
          className="p-4 rounded-lg bg-dark-elevated border border-dark-border hover:border-burn transition-colors"
        >
          <h4 className="font-semibold mb-1">Try Playground →</h4>
          <p className="text-sm text-text-secondary">Test APIs interactively</p>
        </Link>
      </div>
    </div>
  );
}
