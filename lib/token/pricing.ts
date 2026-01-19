/**
 * Dynamic Token Pricing System
 * Converts USD prices to $PYRE token amounts
 * Uses Helius DAS API for real-time Solana token prices
 */

import { API_PRICING_USD, PYRE_TOKEN } from './config';
import { isTokenConfigured, PYRE_TOKEN_CONFIG } from '@/lib/solana/config';

// Helius RPC (server-side only)
const HELIUS_RPC = process.env.HELIUS_RPC_URL || 'https://api.mainnet-beta.solana.com';

// Jupiter Price API as fallback
const JUPITER_PRICE_API = 'https://api.jup.ag/price/v2';

// Cache token price for 60 seconds
let cachedPrice: { price: number; timestamp: number } | null = null;
const CACHE_DURATION = 60 * 1000; // 60 seconds

/**
 * Get current $PYRE token price in USD
 * Tries Helius first, then Jupiter, then Birdeye
 */
export async function getTokenPrice(): Promise<number> {
  // Check cache first
  if (cachedPrice && Date.now() - cachedPrice.timestamp < CACHE_DURATION) {
    return cachedPrice.price;
  }

  // If token is not configured yet, we can't fetch price
  if (!isTokenConfigured()) {
    console.log('[Pricing] Token not configured, cannot fetch price');
    return 0;
  }

  const tokenMint = PYRE_TOKEN_CONFIG.mint;

  // Try multiple price sources
  const priceSources = [
    () => fetchFromJupiter(tokenMint),
    () => fetchFromBirdeye(tokenMint),
    () => fetchFromDexScreener(tokenMint),
  ];

  for (const fetchPrice of priceSources) {
    try {
      const price = await fetchPrice();
      if (price > 0) {
        cachedPrice = { price, timestamp: Date.now() };
        console.log(`[Pricing] Fetched $PYRE price: $${price}`);
        return price;
      }
    } catch (error) {
      console.log('[Pricing] Source failed, trying next...', error);
    }
  }

  // If we have a cached price, use it even if expired
  if (cachedPrice) {
    console.log('[Pricing] Using stale cached price');
    return cachedPrice.price;
  }

  // Fallback price for new tokens not yet listed on DEXes
  // This allows testing before token is tradeable
  const fallbackPrice = process.env.PYRE_FALLBACK_PRICE;
  if (fallbackPrice) {
    const price = parseFloat(fallbackPrice);
    if (price > 0) {
      console.log(`[Pricing] Using fallback price: $${price}`);
      cachedPrice = { price, timestamp: Date.now() };
      return price;
    }
  }

  // No price available - throw error
  throw new Error('Token price unavailable from all sources');
}

/**
 * Fetch price from Jupiter API
 */
async function fetchFromJupiter(tokenMint: string): Promise<number> {
  const response = await fetch(
    `${JUPITER_PRICE_API}?ids=${tokenMint}`,
    {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 60 },
    }
  );

  if (!response.ok) {
    throw new Error(`Jupiter API error: ${response.status}`);
  }

  const data = await response.json();
  const tokenData = data.data?.[tokenMint];

  if (!tokenData?.price) {
    throw new Error('No price from Jupiter');
  }

  return parseFloat(tokenData.price);
}

/**
 * Fetch price from Birdeye API (public endpoint)
 */
async function fetchFromBirdeye(tokenMint: string): Promise<number> {
  const response = await fetch(
    `https://public-api.birdeye.so/defi/price?address=${tokenMint}`,
    {
      headers: { 
        'Accept': 'application/json',
        'x-chain': 'solana',
      },
      next: { revalidate: 60 },
    }
  );

  if (!response.ok) {
    throw new Error(`Birdeye API error: ${response.status}`);
  }

  const data = await response.json();
  
  if (!data.data?.value) {
    throw new Error('No price from Birdeye');
  }

  return parseFloat(data.data.value);
}

/**
 * Fetch price from DexScreener API
 */
async function fetchFromDexScreener(tokenMint: string): Promise<number> {
  const response = await fetch(
    `https://api.dexscreener.com/latest/dex/tokens/${tokenMint}`,
    {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 60 },
    }
  );

  if (!response.ok) {
    throw new Error(`DexScreener API error: ${response.status}`);
  }

  const data = await response.json();
  
  // Get the first pair's price
  const pair = data.pairs?.[0];
  if (!pair?.priceUsd) {
    throw new Error('No price from DexScreener');
  }

  return parseFloat(pair.priceUsd);
}

/**
 * Get token price with fallback for API display
 * Returns 0 if price unavailable (indicates token not tradeable yet)
 */
export async function getTokenPriceSafe(): Promise<number> {
  try {
    return await getTokenPrice();
  } catch {
    return 0;
  }
}

/**
 * Calculate token amount needed for USD price
 */
export function calculateTokenAmount(usdPrice: number, tokenPrice: number): number {
  if (tokenPrice <= 0) {
    // Token not priced yet - cannot calculate
    throw new Error('Token price not available');
  }
  return Math.ceil(usdPrice / tokenPrice);
}

/**
 * Calculate token amount with safe fallback
 * Returns null if price unavailable
 */
export function calculateTokenAmountSafe(usdPrice: number, tokenPrice: number): number | null {
  if (tokenPrice <= 0) {
    return null;
  }
  return Math.ceil(usdPrice / tokenPrice);
}

/**
 * Get API price in tokens
 */
export async function getApiPriceInTokens(endpoint: string): Promise<{
  usdPrice: number;
  tokenPrice: number;
  tokenAmount: number | null;
  available: boolean;
}> {
  const usdPrice = API_PRICING_USD[endpoint] || 0;
  const tokenPrice = await getTokenPriceSafe();
  const tokenAmount = calculateTokenAmountSafe(usdPrice, tokenPrice);

  return {
    usdPrice,
    tokenPrice,
    tokenAmount,
    available: tokenPrice > 0 && tokenAmount !== null,
  };
}

/**
 * Format token amount for display
 */
export function formatTokenAmount(amount: number | bigint): string {
  const num = typeof amount === 'bigint' ? Number(amount) : amount;

  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(2)}B`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(2)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(2)}K`;
  }
  return num.toLocaleString();
}

/**
 * Format USD amount
 */
export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(amount);
}

/**
 * Calculate estimated burn from transaction
 */
export function calculateBurn(tokenAmount: number, burnPercentage: number = 30): number {
  return Math.floor(tokenAmount * (burnPercentage / 100));
}

/**
 * Get all endpoint prices
 */
export async function getAllEndpointPrices(): Promise<{
  prices: Record<string, {
    endpoint: string;
    usdPrice: number;
    tokenAmount: number | null;
    burnAmount: number | null;
    category: string;
    available: boolean;
  }>;
  tokenPrice: number;
  priceAvailable: boolean;
}> {
  const tokenPrice = await getTokenPriceSafe();
  const priceAvailable = tokenPrice > 0;

  const prices: Record<string, {
    endpoint: string;
    usdPrice: number;
    tokenAmount: number | null;
    burnAmount: number | null;
    category: string;
    available: boolean;
  }> = {};

  for (const [endpoint, usdPrice] of Object.entries(API_PRICING_USD)) {
    const tokenAmount = calculateTokenAmountSafe(usdPrice, tokenPrice);
    const burnAmount = tokenAmount !== null ? calculateBurn(tokenAmount) : null;

    // Determine category from endpoint path
    const category = endpoint.split('/')[2] || 'other';

    prices[endpoint] = {
      endpoint,
      usdPrice,
      tokenAmount,
      burnAmount,
      category,
      available: priceAvailable && tokenAmount !== null,
    };
  }

  return { prices, tokenPrice, priceAvailable };
}
