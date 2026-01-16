/**
 * Payment Processing System
 * Handles $PYRE token payments for API access
 */

import { PublicKey } from '@solana/web3.js';
import { 
  getTokenBalance, 
  createPaymentTransaction, 
  verifyTransaction,
  getSolscanUrl,
} from './token';
import { PYRE_TOKEN_CONFIG, isTokenConfigured } from './config';

export interface PaymentRequest {
  walletAddress: string;
  tokenAmount: number;
  endpoint: string;
  providerWallet?: string;
}

export interface PaymentResult {
  success: boolean;
  signature?: string;
  solscanUrl?: string;
  breakdown?: {
    total: number;
    burn: number;
    provider: number;
    holders: number;
    treasury: number;
  };
  error?: string;
}

// Re-export verifyTransaction for middleware use
export { verifyTransaction };

/**
 * Check if user can make a payment
 */
export async function canMakePayment(
  walletAddress: string,
  requiredAmount: number
): Promise<{
  canPay: boolean;
  balance: number;
  requiredAmount: number;
  shortfall: number;
}> {
  const { balance } = await getTokenBalance(walletAddress);
  const canPay = balance >= requiredAmount;
  
  return {
    canPay,
    balance,
    requiredAmount,
    shortfall: canPay ? 0 : requiredAmount - balance,
  };
}

/**
 * Create payment info for frontend display
 */
export function getPaymentInfo(tokenAmount: number) {
  const burn = tokenAmount * 0.30;
  const provider = tokenAmount * 0.50;
  const holders = tokenAmount * 0.15;
  const treasury = tokenAmount * 0.05;
  
  return {
    total: tokenAmount,
    breakdown: {
      burn: { amount: burn, percent: 30, label: '🔥 Burn (Permanent)' },
      provider: { amount: provider, percent: 50, label: '👨‍💻 API Provider' },
      holders: { amount: holders, percent: 15, label: '📈 Holder Pool' },
      treasury: { amount: treasury, percent: 5, label: '🏦 Treasury' },
    },
    token: {
      symbol: PYRE_TOKEN_CONFIG.symbol,
      name: PYRE_TOKEN_CONFIG.name,
      logo: PYRE_TOKEN_CONFIG.logo,
    },
  };
}

/**
 * Prepare a payment transaction for signing
 * Called from frontend with connected wallet
 */
export async function preparePayment(
  walletPublicKey: PublicKey,
  tokenAmount: number,
  providerWallet?: string
) {
  if (!isTokenConfigured()) {
    throw new Error('PYRE token not configured. Please set NEXT_PUBLIC_PYRE_TOKEN_MINT');
  }
  
  // Check balance first
  const { canPay, balance, shortfall } = await canMakePayment(
    walletPublicKey.toString(),
    tokenAmount
  );
  
  if (!canPay) {
    throw new Error(
      `Insufficient balance. You have ${balance.toFixed(2)} $PYRE but need ${tokenAmount.toFixed(2)} $PYRE. ` +
      `Short by ${shortfall.toFixed(2)} $PYRE.`
    );
  }
  
  // Create the transaction
  const { transaction, breakdown } = await createPaymentTransaction(
    walletPublicKey,
    tokenAmount,
    providerWallet
  );
  
  return {
    transaction,
    breakdown,
    paymentInfo: getPaymentInfo(tokenAmount),
  };
}

/**
 * Confirm a payment after user signs
 */
export async function confirmPayment(
  signature: string,
  expectedSender?: string,
  expectedAmount?: number
): Promise<PaymentResult> {
  try {
    const verification = await verifyTransaction(
      signature,
      expectedSender,
      undefined, // recipient not needed for confirmation
      expectedAmount,
      PYRE_TOKEN_CONFIG.mint
    );
    
    if (!verification.valid) {
      return {
        success: false,
        error: verification.error || 'Transaction verification failed',
      };
    }
    
    return {
      success: true,
      signature,
      solscanUrl: getSolscanUrl(signature),
      breakdown: {
        total: verification.amount || 0,
        burn: (verification.amount || 0) * 0.30,
        provider: (verification.amount || 0) * 0.50,
        holders: (verification.amount || 0) * 0.15,
        treasury: (verification.amount || 0) * 0.05,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment confirmation failed',
    };
  }
}
