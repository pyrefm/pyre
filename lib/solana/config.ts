/**
 * Solana Configuration
 * Token addresses and wallet configuration
 */

import { PublicKey } from '@solana/web3.js';

// $PYRE Token Configuration
// UPDATE THIS WITH YOUR BAGS.FM TOKEN ADDRESS!
export const PYRE_TOKEN_CONFIG = {
  // Token mint address - UPDATE AFTER LAUNCH!
  mint: process.env.NEXT_PUBLIC_PYRE_TOKEN_MINT || 'PYRE_TOKEN_MINT_ADDRESS_HERE',
  
  // Token details
  name: 'PYRE',
  symbol: '$PYRE',
  decimals: 9, // Standard SPL token decimals
  
  // Logo
  logo: '/assets/pyre-logo-no-bg.png',
};

// Payment Distribution Wallets
// UPDATE THESE WITH YOUR WALLET ADDRESSES!
export const PAYMENT_WALLETS = {
  // Main payment receiving wallet (receives all payments initially)
  payment: process.env.NEXT_PUBLIC_PAYMENT_WALLET || 'PAYMENT_WALLET_ADDRESS_HERE',
  
  // Treasury wallet (receives 5%)
  treasury: process.env.NEXT_PUBLIC_TREASURY_WALLET || 'TREASURY_WALLET_ADDRESS_HERE',
  
  // Holder rewards pool (receives 15%)
  holderPool: process.env.NEXT_PUBLIC_HOLDER_POOL_WALLET || 'HOLDER_POOL_WALLET_ADDRESS_HERE',
  
  // Burn address (Solana's null address for permanent burns)
  burn: '1nc1nerator11111111111111111111111111111111', // Standard burn address
};

// Payment distribution percentages
export const PAYMENT_DISTRIBUTION = {
  burn: 30,      // 30% burned permanently 🔥
  provider: 50,  // 50% to API provider
  holders: 15,   // 15% to holder pool
  treasury: 5,   // 5% to treasury
};

// Solana RPC endpoints
export const SOLANA_RPC = {
  mainnet: process.env.NEXT_PUBLIC_SOLANA_RPC_MAINNET || 'https://api.mainnet-beta.solana.com',
  devnet: process.env.NEXT_PUBLIC_SOLANA_RPC_DEVNET || 'https://api.devnet.solana.com',
};

// Current network (change to 'mainnet' for production)
export const SOLANA_NETWORK = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'mainnet';

// Get current RPC endpoint
export function getRpcEndpoint(): string {
  return SOLANA_NETWORK === 'mainnet' ? SOLANA_RPC.mainnet : SOLANA_RPC.devnet;
}

// Validate if mint address is configured
export function isTokenConfigured(): boolean {
  return PYRE_TOKEN_CONFIG.mint !== 'PYRE_TOKEN_MINT_ADDRESS_HERE' && 
         PYRE_TOKEN_CONFIG.mint.length > 30;
}

// Get PublicKey for token mint
export function getTokenMintPublicKey(): PublicKey | null {
  try {
    if (!isTokenConfigured()) return null;
    return new PublicKey(PYRE_TOKEN_CONFIG.mint);
  } catch {
    return null;
  }
}
