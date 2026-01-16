/**
 * Dynamic Token Pricing System
 * Converts USD prices to $PYRE token amounts
 * Uses Jupiter API for real-time Solana token prices
 */

import { API_PRICING_USD, PYRE_TOKEN } from './config';
import { isTokenConfigured, PYRE_TOKEN_CONFIG } from '@/lib/solana/config';

// Jupiter Price API - Free, no API key required
const JUPITER_PRICE_API = 'https://api.jup.ag/price/v2';

// Cache token price for 60 seconds
let cachedPrice: { price: number; timestamp: number } | null = null;
const CACHE_DURATION = 60 * 1000; // 60 seconds

/**
 * Get current $PYRE token price in USD from Jupiter API
 */
export async function getTokenPrice(): Promise<number> {
  // Check cache first
  if (cachedPrice && Date.now() - cachedPrice.timestamp < CACHE_DURATION) {
    return cachedPrice.price;
  }

  // If token is not configured yet, we can't fetch price
  if (!isTokenConfigured()) {
    console.log('[Pricing] Token not configured, cannot fetch price');
    // Return a placeholder that indicates token is not live
    return 0;
  }

  try {
    const tokenMint = PYRE_TOKEN_CONFIG.mint;
    
    // Fetch from Jupiter Price API
    const response = await fetch(
      `${JUPITER_PRICE_API}?ids=${tokenMint}`,
      {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 60 }, // Next.js cache for 60 seconds
      }
    );

    if (!response.ok) {
      throw new Error(`Jupiter API error: ${response.status}`);
    }

    const data = await response.json();
    const tokenData = data.data?.[tokenMint];

    if (!tokenData || !tokenData.price) {
      throw new Error('Token price not available from Jupiter');
    }

    const price = parseFloat(tokenData.price);
    
    // Cache the price
    cachedPrice = { price, timestamp: Date.now() };
    
    console.log(`[Pricing] Fetched $PYRE price: $${price}`);
    return price;
  } catch (error) {
    console.error('[Pricing] Error fetching token price:', error);
    
    // If we have a cached price, use it even if expired (better than nothing)
    if (cachedPrice) {
      console.log('[Pricing] Using stale cached price');
      return cachedPrice.price;
    }
    
    // No cached price available - throw error to indicate price unavailable
    throw new Error('Token price unavailable');
  }
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
