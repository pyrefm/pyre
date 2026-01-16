import { Zap, Wallet, Code2, Flame, CheckCircle2 } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="prose prose-invert max-w-none">
      <div className="not-prose mb-8">
        <div className="flex items-center gap-2 text-pyre-primary text-sm font-medium mb-4">
          <Zap className="w-4 h-4" />
          <span>Core Concepts</span>
        </div>
        <h1 className="text-4xl font-bold font-heading mb-4">How It Works</h1>
        <p className="text-xl text-text-secondary">
          Understanding the PYRE payment flow and token mechanics.
        </p>
      </div>

      <h2>The PYRE Payment Flow</h2>

      <div className="not-prose my-8">
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-dark-border" />
          
          <div className="space-y-8">
            <div className="flex gap-4 relative">
              <div className="w-12 h-12 rounded-full bg-pyre-primary/20 border-2 border-pyre-primary flex items-center justify-center z-10">
                <Wallet className="w-5 h-5 text-pyre-primary" />
              </div>
              <div className="pt-2">
                <h3 className="text-xl font-bold mb-2">1. Connect Wallet</h3>
                <p className="text-text-secondary">
                  Users connect their Solana wallet (Phantom, Solflare, etc.) to authenticate.
                  No API keys or passwords needed - your wallet is your identity.
                </p>
              </div>
            </div>

            <div className="flex gap-4 relative">
              <div className="w-12 h-12 rounded-full bg-pyre-primary/20 border-2 border-pyre-primary flex items-center justify-center z-10">
                <Code2 className="w-5 h-5 text-pyre-primary" />
              </div>
              <div className="pt-2">
                <h3 className="text-xl font-bold mb-2">2. Make API Request</h3>
                <p className="text-text-secondary">
                  Call any PYRE API endpoint. The system calculates the required $PYRE 
                  amount based on current token price and API cost.
                </p>
              </div>
            </div>

            <div className="flex gap-4 relative">
              <div className="w-12 h-12 rounded-full bg-burn/20 border-2 border-burn flex items-center justify-center z-10">
                <Flame className="w-5 h-5 text-burn" />
              </div>
              <div className="pt-2">
                <h3 className="text-xl font-bold mb-2">3. Payment & Burn</h3>
                <p className="text-text-secondary">
                  Approve the transaction in your wallet. 30% of tokens are burned permanently,
                  50% goes to the API provider, 15% to holder pool, 5% to treasury.
                </p>
              </div>
            </div>

            <div className="flex gap-4 relative">
              <div className="w-12 h-12 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center z-10">
                <CheckCircle2 className="w-5 h-5 text-accent" />
              </div>
              <div className="pt-2">
                <h3 className="text-xl font-bold mb-2">4. Receive Response</h3>
                <p className="text-text-secondary">
                  Get your API response along with a payment receipt showing how many 
                  tokens were burned. All transactions are verifiable on Solscan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2>Why This Model?</h2>

      <div className="not-prose grid sm:grid-cols-2 gap-4 my-6">
        <div className="p-4 rounded-lg bg-dark-elevated border border-dark-border">
          <h4 className="font-semibold text-burn mb-2">Deflationary Token</h4>
          <p className="text-sm text-text-secondary">
            Every API call reduces total supply, creating natural scarcity over time.
          </p>
        </div>
        <div className="p-4 rounded-lg bg-dark-elevated border border-dark-border">
          <h4 className="font-semibold text-pyre-primary mb-2">Usage = Value</h4>
          <p className="text-sm text-text-secondary">
            More API usage means more burns, directly tying utility to token value.
          </p>
        </div>
        <div className="p-4 rounded-lg bg-dark-elevated border border-dark-border">
          <h4 className="font-semibold text-accent mb-2">Holder Rewards</h4>
          <p className="text-sm text-text-secondary">
            Token holders benefit from platform usage through the reward pool.
          </p>
        </div>
        <div className="p-4 rounded-lg bg-dark-elevated border border-dark-border">
          <h4 className="font-semibold text-tier-gold mb-2">Transparent</h4>
          <p className="text-sm text-text-secondary">
            All payments and burns are on-chain, fully verifiable by anyone.
          </p>
        </div>
      </div>
    </div>
  );
}
