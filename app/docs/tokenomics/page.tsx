import Link from 'next/link';
import { Coins, Flame, TrendingUp, Users, Building, PieChart, ArrowRight } from 'lucide-react';

export default function TokenomicsPage() {
  return (
    <div className="prose prose-invert max-w-none">
      {/* Hero */}
      <div className="not-prose mb-8">
        <div className="flex items-center gap-2 text-tier-gold text-sm font-medium mb-4">
          <Coins className="w-4 h-4" />
          <span>Core Concepts</span>
        </div>
        <h1 className="text-4xl font-bold font-heading mb-4">Tokenomics</h1>
        <p className="text-xl text-text-secondary">
          Understanding $PYRE token economics and the burn mechanism.
        </p>
      </div>

      {/* Token Overview */}
      <div className="not-prose mb-12 p-6 rounded-xl bg-gradient-to-br from-burn/20 to-pyre-primary/10 border border-burn/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-burn/30 flex items-center justify-center">
            <Flame className="w-6 h-6 text-burn" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">$PYRE Token</h3>
            <p className="text-text-secondary">The fuel that powers the API economy</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-4 mt-6">
          <div className="text-center p-4 rounded-lg bg-dark/50">
            <div className="text-2xl font-bold text-white">1B</div>
            <div className="text-xs text-text-muted">Total Supply</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-dark/50">
            <div className="text-2xl font-bold text-burn">30%</div>
            <div className="text-xs text-text-muted">Burn Rate</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-dark/50">
            <div className="text-2xl font-bold text-accent">Solana</div>
            <div className="text-xs text-text-muted">Network</div>
          </div>
        </div>
      </div>

      {/* Payment Distribution */}
      <h2 className="flex items-center gap-3">
        <PieChart className="w-6 h-6 text-pyre-primary" />
        Payment Distribution
      </h2>

      <p>
        Every API payment in $PYRE is automatically distributed to four destinations:
      </p>

      <div className="not-prose my-8">
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Burn */}
          <div className="p-6 rounded-xl bg-burn/10 border border-burn/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-burn/20 flex items-center justify-center">
                <Flame className="w-6 h-6 text-burn" />
              </div>
              <div>
                <div className="text-3xl font-bold text-burn">30%</div>
                <div className="text-sm text-text-muted">Burned Forever</div>
              </div>
            </div>
            <p className="text-sm text-text-secondary">
              Permanently removed from circulation. Sent to a null address, 
              reducing total supply with every API call.
            </p>
          </div>

          {/* Provider */}
          <div className="p-6 rounded-xl bg-pyre-primary/10 border border-pyre-primary/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-pyre-primary/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-pyre-primary" />
              </div>
              <div>
                <div className="text-3xl font-bold text-pyre-primary">50%</div>
                <div className="text-sm text-text-muted">API Provider</div>
              </div>
            </div>
            <p className="text-sm text-text-secondary">
              Goes directly to the API provider. This incentivizes developers 
              to build and maintain high-quality APIs.
            </p>
          </div>

          {/* Holders */}
          <div className="p-6 rounded-xl bg-accent/10 border border-accent/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <div>
                <div className="text-3xl font-bold text-accent">15%</div>
                <div className="text-sm text-text-muted">Holder Pool</div>
              </div>
            </div>
            <p className="text-sm text-text-secondary">
              Distributed to $PYRE token holders. The more you hold, 
              the more you earn from platform activity.
            </p>
          </div>

          {/* Treasury */}
          <div className="p-6 rounded-xl bg-tier-silver/10 border border-tier-silver/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-tier-silver/20 flex items-center justify-center">
                <Building className="w-6 h-6 text-tier-silver" />
              </div>
              <div>
                <div className="text-3xl font-bold text-tier-silver">5%</div>
                <div className="text-sm text-text-muted">Treasury</div>
              </div>
            </div>
            <p className="text-sm text-text-secondary">
              Platform development and operations. Used for infrastructure, 
              marketing, and ecosystem growth.
            </p>
          </div>
        </div>
      </div>

      {/* Burn Mechanism */}
      <h2 className="flex items-center gap-3">
        <Flame className="w-6 h-6 text-burn" />
        The Burn Mechanism
      </h2>

      <p>
        The burn mechanism is at the core of PYRE's value proposition. Here's why it matters:
      </p>

      <div className="not-prose my-6 space-y-4">
        <div className="p-4 rounded-lg bg-dark-elevated border border-dark-border">
          <h4 className="font-semibold mb-2">📉 Deflationary Pressure</h4>
          <p className="text-sm text-text-secondary">
            With 30% of every payment burned, the total supply decreases over time. 
            More API usage = more burns = less supply.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-dark-elevated border border-dark-border">
          <h4 className="font-semibold mb-2">📈 Scarcity Creates Value</h4>
          <p className="text-sm text-text-secondary">
            As supply decreases and demand for API services grows, 
            the remaining tokens become increasingly scarce.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-dark-elevated border border-dark-border">
          <h4 className="font-semibold mb-2">🔥 Transparent & Verifiable</h4>
          <p className="text-sm text-text-secondary">
            Every burn is recorded on-chain. You can verify all burns on Solscan 
            in real-time.
          </p>
        </div>
      </div>

      {/* Example Calculation */}
      <h2>Example: API Payment Flow</h2>

      <p>
        Let's say you make an AI chat API call that costs 100 $PYRE:
      </p>

      <div className="not-prose my-6 p-6 rounded-xl bg-dark-card border border-dark-border">
        <div className="font-mono text-sm space-y-2">
          <div className="flex justify-between py-2 border-b border-dark-border">
            <span className="text-text-secondary">API Call Cost</span>
            <span className="font-bold">100 $PYRE</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-burn">🔥 Burned (30%)</span>
            <span className="text-burn font-bold">30 $PYRE</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-pyre-primary">👨‍💻 Provider (50%)</span>
            <span className="font-bold">50 $PYRE</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-accent">📈 Holders (15%)</span>
            <span className="font-bold">15 $PYRE</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-tier-silver">🏦 Treasury (5%)</span>
            <span className="font-bold">5 $PYRE</span>
          </div>
        </div>
      </div>

      {/* Burn Projection */}
      <h2>Burn Projection</h2>

      <p>
        Based on projected API usage, here's how the burn might look over time:
      </p>

      <div className="not-prose my-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left py-3 px-4 text-text-muted">Timeframe</th>
                <th className="text-right py-3 px-4 text-text-muted">Daily API Calls</th>
                <th className="text-right py-3 px-4 text-text-muted">Tokens Burned</th>
                <th className="text-right py-3 px-4 text-text-muted">Supply Remaining</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-dark-border">
                <td className="py-3 px-4">Month 1</td>
                <td className="text-right py-3 px-4">10,000</td>
                <td className="text-right py-3 px-4 text-burn">~1.5M</td>
                <td className="text-right py-3 px-4">998.5M</td>
              </tr>
              <tr className="border-b border-dark-border">
                <td className="py-3 px-4">Month 6</td>
                <td className="text-right py-3 px-4">100,000</td>
                <td className="text-right py-3 px-4 text-burn">~50M</td>
                <td className="text-right py-3 px-4">950M</td>
              </tr>
              <tr className="border-b border-dark-border">
                <td className="py-3 px-4">Year 1</td>
                <td className="text-right py-3 px-4">500,000</td>
                <td className="text-right py-3 px-4 text-burn">~150M</td>
                <td className="text-right py-3 px-4">850M</td>
              </tr>
              <tr>
                <td className="py-3 px-4">Year 2</td>
                <td className="text-right py-3 px-4">1,000,000</td>
                <td className="text-right py-3 px-4 text-burn">~350M</td>
                <td className="text-right py-3 px-4">650M</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-text-muted mt-2">
          * Projections are estimates based on assumed growth. Actual numbers may vary.
        </p>
      </div>

      {/* Why This Works */}
      <h2>Why This Model Works</h2>

      <div className="not-prose grid sm:grid-cols-2 gap-4 my-6">
        <div className="p-4 rounded-lg bg-dark-elevated border border-dark-border">
          <h4 className="font-semibold text-accent mb-2">For Users</h4>
          <ul className="text-sm text-text-secondary space-y-1">
            <li>✓ Pay only for what you use</li>
            <li>✓ No subscriptions or commitments</li>
            <li>✓ Holding tokens = earning rewards</li>
            <li>✓ Transparent on-chain payments</li>
          </ul>
        </div>

        <div className="p-4 rounded-lg bg-dark-elevated border border-dark-border">
          <h4 className="font-semibold text-pyre-primary mb-2">For Holders</h4>
          <ul className="text-sm text-text-secondary space-y-1">
            <li>✓ Deflationary supply</li>
            <li>✓ 15% of payments shared</li>
            <li>✓ More usage = more value</li>
            <li>✓ True utility-driven token</li>
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
          href="/docs/burn"
          className="p-4 rounded-lg bg-burn/10 border border-burn/30 hover:border-burn transition-colors"
        >
          <h4 className="font-semibold text-burn mb-1">Burn Mechanism →</h4>
          <p className="text-sm text-text-secondary">Deep dive into how burns work</p>
        </Link>

        <Link
          href="/dashboard"
          className="p-4 rounded-lg bg-pyre-primary/10 border border-pyre-primary/30 hover:border-pyre-primary transition-colors"
        >
          <h4 className="font-semibold text-pyre-primary mb-1">View Live Stats →</h4>
          <p className="text-sm text-text-secondary">See real-time burn statistics</p>
        </Link>
      </div>
    </div>
  );
}
