import { NextRequest, NextResponse } from 'next/server';
import { withTokenPayment } from '@/lib/payments/middleware';
import axios from 'axios';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

// Map common symbols to CoinGecko IDs
const SYMBOL_TO_ID: Record<string, string> = {
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'SOL': 'solana',
  'USDC': 'usd-coin',
  'USDT': 'tether',
  'BNB': 'binancecoin',
  'MATIC': 'matic-network',
  'AVAX': 'avalanche-2',
  'DOGE': 'dogecoin',
  'ADA': 'cardano',
  'XRP': 'ripple',
  'DOT': 'polkadot',
  'LINK': 'chainlink',
  'UNI': 'uniswap',
  'ATOM': 'cosmos',
};

async function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get('symbol')?.toUpperCase() || 'SOL';

    // Get CoinGecko ID from symbol
    const coinId = SYMBOL_TO_ID[symbol] || symbol.toLowerCase();

    // Fetch real data from CoinGecko API
    const response = await axios.get(
      `${COINGECKO_API}/simple/price`,
      {
        params: {
          ids: coinId,
          vs_currencies: 'usd',
          include_24hr_change: true,
          include_24hr_vol: true,
          include_market_cap: true,
          include_last_updated_at: true,
        },
        timeout: 10000,
      }
    );

    const data = response.data[coinId];

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cryptocurrency not found',
          code: 'NOT_FOUND',
          supportedSymbols: Object.keys(SYMBOL_TO_ID),
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        symbol,
        coinId,
        price: data.usd,
        priceFormatted: `$${data.usd.toLocaleString()}`,
        change24h: data.usd_24h_change?.toFixed(2) || '0',
        change24hFormatted: `${data.usd_24h_change >= 0 ? '+' : ''}${data.usd_24h_change?.toFixed(2)}%`,
        volume24h: data.usd_24h_vol || 0,
        marketCap: data.usd_market_cap || 0,
        lastUpdated: data.last_updated_at
          ? new Date(data.last_updated_at * 1000).toISOString()
          : new Date().toISOString(),
        source: 'CoinGecko',
      },
    });
  } catch (error) {
    console.error('Crypto API error:', error);

    // Return proper error response instead of fake data
    const errorMessage = axios.isAxiosError(error)
      ? error.response?.data?.error || error.message
      : 'Failed to fetch cryptocurrency data';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        code: 'EXTERNAL_API_ERROR',
        message: 'Unable to fetch data from CoinGecko. Please try again later.',
      },
      { status: 502 }
    );
  }
}

// Price: $0.02 per request - 30% ($0.006) burned!
export const GET = withTokenPayment(handler, 0.02);
