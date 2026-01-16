import Link from 'next/link';
import { Shield, Wallet, Key, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function AuthPage() {
  return (
    <div className="prose prose-invert max-w-none">
      {/* Hero */}
      <div className="not-prose mb-8">
        <div className="flex items-center gap-2 text-pyre-primary text-sm font-medium mb-4">
          <Shield className="w-4 h-4" />
          <span>API Reference</span>
        </div>
        <h1 className="text-4xl font-bold font-heading mb-4">Authentication</h1>
        <p className="text-xl text-text-secondary">
          Learn how to authenticate your API requests with $PYRE token payments.
        </p>
      </div>

      {/* Overview */}
      <h2 className="flex items-center gap-3">
        <Wallet className="w-6 h-6 text-tier-gold" />
        Overview
      </h2>

      <p>
        PYRE uses a <strong>wallet-based authentication</strong> system. Instead of API keys, 
        you authenticate using your Solana wallet address and prove payment with transaction signatures.
      </p>

      <div className="not-prose my-6 p-4 rounded-lg bg-accent/10 border border-accent/30">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-accent mt-0.5" />
          <div>
            <h4 className="font-semibold text-accent">No API Keys Required</h4>
            <p className="text-sm text-text-secondary mt-1">
              Your wallet address is your identity. No need to manage API keys or secrets.
            </p>
          </div>
        </div>
      </div>

      {/* Required Headers */}
      <h2 className="flex items-center gap-3">
        <Key className="w-6 h-6 text-pyre-primary" />
        Required Headers
      </h2>

      <p>Every API request must include the following headers:</p>

      <div className="not-prose my-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left py-3 px-4 text-text-muted">Header</th>
                <th className="text-left py-3 px-4 text-text-muted">Required</th>
                <th className="text-left py-3 px-4 text-text-muted">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-dark-border">
                <td className="py-3 px-4 font-mono text-burn">x-wallet-address</td>
                <td className="py-3 px-4"><span className="text-accent">Yes</span></td>
                <td className="py-3 px-4 text-text-secondary">Your Solana wallet address</td>
              </tr>
              <tr className="border-b border-dark-border">
                <td className="py-3 px-4 font-mono text-burn">x-payment-proof</td>
                <td className="py-3 px-4"><span className="text-accent">Yes*</span></td>
                <td className="py-3 px-4 text-text-secondary">Base64-encoded payment transaction proof</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono">Content-Type</td>
                <td className="py-3 px-4"><span className="text-text-muted">Yes</span></td>
                <td className="py-3 px-4 text-text-secondary">application/json</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-text-muted mt-2">
          * Not required for free endpoints like /api/health
        </p>
      </div>

      {/* Example Request */}
      <h2>Example Request</h2>

      <div className="not-prose my-4">
        <div className="bg-dark-elevated rounded-lg border border-dark-border overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-dark-card border-b border-dark-border">
            <span className="text-xs text-text-muted">cURL</span>
          </div>
          <pre className="p-4 overflow-x-auto text-sm">
            <code>{`curl -X POST https://pyrefm.xyz/api/ai/chat \\
  -H "Content-Type: application/json" \\
  -H "x-wallet-address: 9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM" \\
  -H "x-payment-proof: eyJ3YWxsZXQiOiI5V3pEWHdCYm..." \\
  -d '{"message": "Hello!"}'`}</code>
          </pre>
        </div>
      </div>

      {/* Payment Flow */}
      <h2>Payment Flow</h2>

      <p>Here's how authentication with payment works:</p>

      <div className="not-prose my-6">
        <div className="space-y-4">
          <div className="flex gap-4 p-4 rounded-lg bg-dark-elevated border border-dark-border">
            <div className="w-8 h-8 rounded-full bg-pyre-primary/20 flex items-center justify-center text-sm font-bold text-pyre-primary">1</div>
            <div>
              <h4 className="font-semibold">Request Without Payment</h4>
              <p className="text-sm text-text-secondary mt-1">
                Call the API with just your wallet address (no payment proof)
              </p>
              <div className="mt-2 p-2 rounded bg-dark font-mono text-xs">
                Response: 402 Payment Required + pricing info
              </div>
            </div>
          </div>

          <div className="flex gap-4 p-4 rounded-lg bg-dark-elevated border border-dark-border">
            <div className="w-8 h-8 rounded-full bg-pyre-primary/20 flex items-center justify-center text-sm font-bold text-pyre-primary">2</div>
            <div>
              <h4 className="font-semibold">Make Payment</h4>
              <p className="text-sm text-text-secondary mt-1">
                Send required $PYRE tokens to the payment wallet
              </p>
              <div className="mt-2 p-2 rounded bg-dark font-mono text-xs">
                Transaction: burn 30%, transfer rest
              </div>
            </div>
          </div>

          <div className="flex gap-4 p-4 rounded-lg bg-dark-elevated border border-dark-border">
            <div className="w-8 h-8 rounded-full bg-pyre-primary/20 flex items-center justify-center text-sm font-bold text-pyre-primary">3</div>
            <div>
              <h4 className="font-semibold">Request With Payment Proof</h4>
              <p className="text-sm text-text-secondary mt-1">
                Include the transaction signature in x-payment-proof header
              </p>
              <div className="mt-2 p-2 rounded bg-dark font-mono text-xs">
                Response: 200 OK + API data + payment receipt
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 402 Response */}
      <h2>402 Payment Required Response</h2>

      <p>When you call a paid endpoint without payment, you'll receive:</p>

      <div className="not-prose my-4">
        <div className="bg-dark-elevated rounded-lg border border-dark-border overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-dark-card border-b border-dark-border">
            <span className="text-xs text-text-muted">Response (402)</span>
          </div>
          <pre className="p-4 overflow-x-auto text-sm">
            <code>{`{
  "error": "Payment required",
  "code": "PAYMENT_REQUIRED",
  "pricing": {
    "endpoint": "/api/ai/chat",
    "priceUSD": 0.05,
    "tokenPrice": 0.001,
    "requiredTokens": 50
  },
  "distribution": {
    "burn": "30%",
    "provider": "50%",
    "holders": "15%",
    "treasury": "5%"
  },
  "burnInfo": {
    "percentage": 30,
    "tokensToBurn": 15
  },
  "paymentWallet": "71w4H4CyT8PfyAzEcmmh7DLjeqg6eA84McvvdRkYM3Rp",
  "tokenMint": "PYRE_TOKEN_MINT_ADDRESS"
}`}</code>
          </pre>
        </div>
      </div>

      {/* Error Codes */}
      <h2 className="flex items-center gap-3">
        <AlertTriangle className="w-6 h-6 text-yellow-500" />
        Error Codes
      </h2>

      <div className="not-prose my-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left py-3 px-4 text-text-muted">Code</th>
                <th className="text-left py-3 px-4 text-text-muted">Status</th>
                <th className="text-left py-3 px-4 text-text-muted">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-dark-border">
                <td className="py-3 px-4 font-mono">NO_WALLET</td>
                <td className="py-3 px-4">401</td>
                <td className="py-3 px-4 text-text-secondary">Missing x-wallet-address header</td>
              </tr>
              <tr className="border-b border-dark-border">
                <td className="py-3 px-4 font-mono">PAYMENT_REQUIRED</td>
                <td className="py-3 px-4">402</td>
                <td className="py-3 px-4 text-text-secondary">Payment needed to access endpoint</td>
              </tr>
              <tr className="border-b border-dark-border">
                <td className="py-3 px-4 font-mono">INVALID_PAYMENT</td>
                <td className="py-3 px-4">402</td>
                <td className="py-3 px-4 text-text-secondary">Payment proof is invalid or expired</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono">INSUFFICIENT_BALANCE</td>
                <td className="py-3 px-4">402</td>
                <td className="py-3 px-4 text-text-secondary">Wallet doesn't have enough $PYRE</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Free Endpoints */}
      <h2>Free Endpoints</h2>

      <p>The following endpoints don't require payment:</p>

      <div className="not-prose my-4">
        <ul className="space-y-2">
          <li className="flex items-center gap-2 p-2 rounded bg-dark-elevated">
            <span className="px-2 py-0.5 rounded bg-accent/20 text-accent text-xs font-mono">GET</span>
            <span className="font-mono text-sm">/api/health</span>
            <span className="text-text-muted text-sm ml-auto">API status</span>
          </li>
          <li className="flex items-center gap-2 p-2 rounded bg-dark-elevated">
            <span className="px-2 py-0.5 rounded bg-accent/20 text-accent text-xs font-mono">GET</span>
            <span className="font-mono text-sm">/api/token/price</span>
            <span className="text-text-muted text-sm ml-auto">$PYRE price</span>
          </li>
          <li className="flex items-center gap-2 p-2 rounded bg-dark-elevated">
            <span className="px-2 py-0.5 rounded bg-accent/20 text-accent text-xs font-mono">GET</span>
            <span className="font-mono text-sm">/api/token/burn-stats</span>
            <span className="text-text-muted text-sm ml-auto">Burn statistics</span>
          </li>
        </ul>
      </div>

      {/* Next Steps */}
      <h2>Next Steps</h2>

      <div className="not-prose grid sm:grid-cols-2 gap-4 my-6">
        <Link
          href="/docs/api/ai"
          className="p-4 rounded-lg bg-dark-elevated border border-dark-border hover:border-pyre-primary transition-colors"
        >
          <h4 className="font-semibold mb-1">AI Endpoints →</h4>
          <p className="text-sm text-text-secondary">Chat, image generation, and more</p>
        </Link>

        <Link
          href="/docs/sdk/javascript"
          className="p-4 rounded-lg bg-dark-elevated border border-dark-border hover:border-pyre-primary transition-colors"
        >
          <h4 className="font-semibold mb-1">Use the SDK →</h4>
          <p className="text-sm text-text-secondary">Handles auth automatically</p>
        </Link>
      </div>
    </div>
  );
}
