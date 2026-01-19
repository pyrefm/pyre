/**
 * Token Balance API Route
 * Fetches user's $PYRE token balance using server-side RPC
 */

import { NextRequest, NextResponse } from 'next/server';
import { Connection, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token';

export const dynamic = 'force-dynamic';

// Server-side RPC (not exposed to client)
// Set HELIUS_RPC_URL in .env.local for production
const HELIUS_RPC = process.env.HELIUS_RPC_URL || 'https://api.mainnet-beta.solana.com';

// Token configuration
const PYRE_TOKEN_MINT = 'Ecqv1vJq8dDHqq7hU5bLFZC42DQSsKgnANFdaFEtBAGS';
const TOKEN_DECIMALS = 9;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('wallet');

    if (!walletAddress) {
      return NextResponse.json(
        { success: false, error: 'Wallet address required' },
        { status: 400 }
      );
    }

    // Validate wallet address
    let wallet: PublicKey;
    try {
      wallet = new PublicKey(walletAddress);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid wallet address' },
        { status: 400 }
      );
    }

    const connection = new Connection(HELIUS_RPC, 'confirmed');
    const mint = new PublicKey(PYRE_TOKEN_MINT);

    // Get associated token account
    const tokenAccount = await getAssociatedTokenAddress(mint, wallet);

    try {
      const account = await getAccount(connection, tokenAccount);
      const rawBalance = account.amount;
      const balance = Number(rawBalance) / Math.pow(10, TOKEN_DECIMALS);

      return NextResponse.json({
        success: true,
        data: {
          balance,
          rawBalance: rawBalance.toString(),
          hasTokens: rawBalance > BigInt(0),
          tokenAccount: tokenAccount.toString(),
        },
      });
    } catch {
      // Token account doesn't exist = 0 balance
      return NextResponse.json({
        success: true,
        data: {
          balance: 0,
          rawBalance: '0',
          hasTokens: false,
          tokenAccount: tokenAccount.toString(),
        },
      });
    }
  } catch (error) {
    console.error('[API] Token balance error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch balance' 
      },
      { status: 500 }
    );
  }
}
