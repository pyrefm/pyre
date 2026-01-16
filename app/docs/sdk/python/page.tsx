import { Code2, Clock } from 'lucide-react';
import Link from 'next/link';

export default function PythonSDKPage() {
  return (
    <div className="prose prose-invert max-w-none">
      <div className="not-prose mb-8">
        <div className="flex items-center gap-2 text-tier-gold text-sm font-medium mb-4">
          <Code2 className="w-4 h-4" />
          <span>SDKs</span>
        </div>
        <h1 className="text-4xl font-bold font-heading mb-4">Python SDK</h1>
        <p className="text-xl text-text-secondary">
          Official SDK for Python applications.
        </p>
      </div>

      {/* Coming Soon */}
      <div className="not-prose my-8 p-8 rounded-xl bg-gradient-to-br from-pyre-primary/10 to-burn/10 border border-pyre-primary/30 text-center">
        <div className="w-16 h-16 rounded-full bg-pyre-primary/20 flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-pyre-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
        <p className="text-text-secondary max-w-md mx-auto mb-6">
          The Python SDK is under development. Use REST APIs directly for now.
        </p>
        <Link href="/docs/api/auth" className="btn-primary">
          View API Documentation
        </Link>
      </div>

      {/* Python Example */}
      <h2>Using REST APIs with Python</h2>

      <div className="not-prose my-4">
        <div className="bg-dark-elevated rounded-lg border border-dark-border overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-dark-card border-b border-dark-border">
            <span className="text-xs text-text-muted">Python / requests</span>
          </div>
          <pre className="p-4 overflow-x-auto text-sm">
            <code>{`import requests

response = requests.get(
    'https://pyrefm.xyz/api/data/weather',
    params={'city': 'Istanbul'},
    headers={
        'x-wallet-address': 'YOUR_WALLET_ADDRESS',
        'x-payment-proof': 'BASE64_PAYMENT_PROOF',
    }
)

data = response.json()
print(data)`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
