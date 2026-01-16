import { Code2, Clock, Bell } from 'lucide-react';
import Link from 'next/link';

export default function JavaScriptSDKPage() {
  return (
    <div className="prose prose-invert max-w-none">
      {/* Hero */}
      <div className="not-prose mb-8">
        <div className="flex items-center gap-2 text-tier-gold text-sm font-medium mb-4">
          <Code2 className="w-4 h-4" />
          <span>SDKs</span>
        </div>
        <h1 className="text-4xl font-bold font-heading mb-4">JavaScript / Node.js SDK</h1>
        <p className="text-xl text-text-secondary">
          Official SDK for JavaScript and Node.js applications.
        </p>
      </div>

      {/* Coming Soon */}
      <div className="not-prose my-8 p-8 rounded-xl bg-gradient-to-br from-pyre-primary/10 to-burn/10 border border-pyre-primary/30 text-center">
        <div className="w-16 h-16 rounded-full bg-pyre-primary/20 flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-pyre-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
        <p className="text-text-secondary max-w-md mx-auto mb-6">
          The official PYRE JavaScript SDK is under development. 
          In the meantime, you can use our REST APIs directly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/docs/api/auth" className="btn-primary">
            View API Documentation
          </Link>
          <Link href="/playground" className="btn-secondary">
            Try API Playground
          </Link>
        </div>
      </div>

      {/* Current Option */}
      <h2>Using REST APIs Directly</h2>

      <p>
        While the SDK is in development, you can integrate PYRE APIs directly using fetch or axios:
      </p>

      <div className="not-prose my-4">
        <div className="bg-dark-elevated rounded-lg border border-dark-border overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-dark-card border-b border-dark-border">
            <span className="text-xs text-text-muted">JavaScript / fetch</span>
          </div>
          <pre className="p-4 overflow-x-auto text-sm">
            <code>{`// Example: Get crypto price
const response = await fetch('https://pyrefm.xyz/api/data/crypto?symbol=SOL', {
  headers: {
    'Content-Type': 'application/json',
    'x-wallet-address': 'YOUR_WALLET_ADDRESS',
    'x-payment-proof': 'BASE64_PAYMENT_PROOF',
  },
});

const data = await response.json();
console.log(data);`}</code>
          </pre>
        </div>
      </div>

      <div className="not-prose my-4">
        <div className="bg-dark-elevated rounded-lg border border-dark-border overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-dark-card border-b border-dark-border">
            <span className="text-xs text-text-muted">Node.js / axios</span>
          </div>
          <pre className="p-4 overflow-x-auto text-sm">
            <code>{`import axios from 'axios';

// Example: AI Chat
const response = await axios.post('https://pyrefm.xyz/api/ai/chat', 
  { message: 'Hello!' },
  {
    headers: {
      'x-wallet-address': 'YOUR_WALLET_ADDRESS',
      'x-payment-proof': 'BASE64_PAYMENT_PROOF',
    },
  }
);

console.log(response.data);`}</code>
          </pre>
        </div>
      </div>

      {/* Notify */}
      <div className="not-prose my-8 p-4 rounded-lg bg-accent/10 border border-accent/30">
        <div className="flex items-start gap-3">
          <Bell className="w-5 h-5 text-accent mt-0.5" />
          <div>
            <h4 className="font-semibold text-accent">Get Notified</h4>
            <p className="text-sm text-text-secondary mt-1">
              Follow us on Twitter <a href="https://x.com/pyrefm" className="text-pyre-primary hover:underline">@pyrefm</a> to 
              be notified when the SDK is released.
            </p>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="not-prose grid sm:grid-cols-2 gap-4 my-6">
        <Link
          href="/docs/api/auth"
          className="p-4 rounded-lg bg-dark-elevated border border-dark-border hover:border-pyre-primary transition-colors"
        >
          <h4 className="font-semibold mb-1">Authentication →</h4>
          <p className="text-sm text-text-secondary">Learn how to authenticate API requests</p>
        </Link>
        <Link
          href="/docs/api/ai"
          className="p-4 rounded-lg bg-dark-elevated border border-dark-border hover:border-pyre-primary transition-colors"
        >
          <h4 className="font-semibold mb-1">API Reference →</h4>
          <p className="text-sm text-text-secondary">Full list of available endpoints</p>
        </Link>
      </div>
    </div>
  );
}
