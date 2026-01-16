/**
 * PYRE Token Configuration
 * Token-Native API Payment System with Burn Mechanism
 */

export const PYRE_TOKEN = {
  name: 'PYRE',
  symbol: '$PYRE',
  decimals: 9,
  totalSupply: 1_000_000_000, // 1 Billion
  mint: process.env.PYRE_TOKEN_MINT || '',
  
  // Logo and branding
  logo: '/assets/pyre-logo-no-bg.png',
  tagline: 'Every API call burns $PYRE 🔥',
};

/**
 * Payment Distribution
 * How tokens are distributed on every API call
 */
export const PAYMENT_DISTRIBUTION = {
  burn: 30,        // 30% permanently burned 🔥
  provider: 50,    // 50% to API provider
  holders: 15,     // 15% to token holders (redistributed)
  treasury: 5,     // 5% to platform treasury
} as const;

/**
 * API Pricing in USD
 * Tokens are calculated dynamically based on market price
 */
export const API_PRICING_USD: Record<string, number> = {
  // AI Endpoints
  '/api/ai/chat': 0.05,
  '/api/ai/image': 0.10,
  '/api/ai/translate': 0.03,
  '/api/ai/tts': 0.08,
  '/api/ai/vision': 0.15,
  
  // Data Endpoints
  '/api/data/weather': 0.01,
  '/api/data/crypto': 0.02,
  '/api/data/stock': 0.02,
  '/api/data/news': 0.025,
  
  // Tool Endpoints
  '/api/tools/qrcode': 0.005,
  '/api/tools/screenshot': 0.05,
  '/api/tools/pdf': 0.08,
  
  // Premium Endpoints
  '/api/premium/content': 1.00,
  '/api/premium/analytics': 0.50,
};

/**
 * Burn Statistics (updated in real-time)
 */
export interface BurnStats {
  totalBurned: bigint;
  burnedToday: bigint;
  burnedThisWeek: bigint;
  burnedThisMonth: bigint;
  burnRate: number; // tokens per hour
  supplyRemaining: bigint;
  percentBurned: number;
}

/**
 * Free endpoints (no payment required)
 */
export const FREE_ENDPOINTS = [
  '/api/health',
  '/api/info',
  '/api/token/price',
  '/api/token/burn-stats',
];

/**
 * Wallet Addresses
 */
export const WALLETS = {
  payment: process.env.PAYMENT_WALLET || '',
  treasury: process.env.TREASURY_WALLET || '',
  holderPool: process.env.HOLDER_POOL_WALLET || '',
  burn: 'null', // Solana null address for burns
};
