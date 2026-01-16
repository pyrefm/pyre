import { NextResponse } from 'next/server';
import { getTokenPriceSafe, getAllEndpointPrices } from '@/lib/token/pricing';
import { PYRE_TOKEN } from '@/lib/token/config';
import { isTokenConfigured, PYRE_TOKEN_CONFIG } from '@/lib/solana/config';

export async function GET() {
  try {
    const tokenConfigured = isTokenConfigured();
    const { prices, tokenPrice, priceAvailable } = await getAllEndpointPrices();

    return NextResponse.json({
      success: true,
      token: {
        name: PYRE_TOKEN.name,
        symbol: PYRE_TOKEN.symbol,
        mint: tokenConfigured ? PYRE_TOKEN_CONFIG.mint : null,
        price: tokenPrice,
        priceFormatted: priceAvailable ? `$${tokenPrice.toFixed(6)}` : 'Not available',
        configured: tokenConfigured,
        priceAvailable,
      },
      endpoints: prices,
      timestamp: Date.now(),
      source: priceAvailable ? 'Jupiter API' : null,
    });
  } catch (error) {
    console.error('Token price error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch token price' },
      { status: 500 }
    );
  }
}
