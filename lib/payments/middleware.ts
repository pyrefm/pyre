/**
 * Token Payment Middleware
 * Wraps API handlers to require $PYRE token payments with burn mechanism
 */

import { NextRequest, NextResponse } from 'next/server';
import { API_PRICING_USD, FREE_ENDPOINTS, PAYMENT_DISTRIBUTION } from '../token/config';
import { getTokenPrice, calculateTokenAmount } from '../token/pricing';
import { recordBurn, calculateDistribution } from '../token/burn';
import { isTokenConfigured, PAYMENT_WALLETS, PYRE_TOKEN_CONFIG } from '../solana/config';
import { verifyTransaction } from '../solana/payment';

interface PaymentInfo {
  walletAddress: string;
  tokenAmount: number;
  txHash: string;
  timestamp: number;
}

/**
 * Verify payment transaction on Solana blockchain
 */
async function verifyPayment(
  paymentProof: string,
  expectedAmount: number,
  walletAddress: string
): Promise<{ valid: boolean; payment?: PaymentInfo; error?: string }> {
  try {
    // Decode payment proof (contains transaction signature)
    const decoded = JSON.parse(Buffer.from(paymentProof, 'base64').toString());

    if (!decoded.txHash) {
      return {
        valid: false,
        error: 'Transaction signature is required',
      };
    }

    // Verify the transaction on-chain
    const verification = await verifyTransaction(
      decoded.txHash,
      walletAddress,
      PAYMENT_WALLETS.payment,
      expectedAmount,
      PYRE_TOKEN_CONFIG.mint
    );

    if (!verification.valid) {
      return {
        valid: false,
        error: verification.error || 'Transaction verification failed',
      };
    }

    return {
      valid: true,
      payment: {
        walletAddress,
        tokenAmount: verification.amount || expectedAmount,
        txHash: decoded.txHash,
        timestamp: Date.now(),
      },
    };
  } catch (error) {
    console.error('Payment verification error:', error);
    return {
      valid: false,
      error: 'Invalid payment proof format',
    };
  }
}

/**
 * Main payment middleware wrapper
 */
export function withTokenPayment(
  handler: (req: NextRequest) => Promise<NextResponse>,
  customPriceUSD?: number
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const endpoint = new URL(req.url).pathname;

    // Check if endpoint is free
    if (FREE_ENDPOINTS.includes(endpoint)) {
      return handler(req);
    }

    // If token is not configured yet, return service unavailable
    if (!isTokenConfigured()) {
      return NextResponse.json(
        {
          error: 'Service unavailable',
          code: 'TOKEN_NOT_CONFIGURED',
          message: '$PYRE token is not yet launched. API payments will be enabled after token launch.',
        },
        { status: 503 }
      );
    }

    // Get wallet address
    const walletAddress = req.headers.get('x-wallet-address');
    if (!walletAddress) {
      return NextResponse.json(
        {
          error: 'Wallet address required',
          code: 'NO_WALLET',
          message: 'Please connect your wallet to use this API',
        },
        { status: 401 }
      );
    }

    // Get pricing
    const priceUSD = customPriceUSD || API_PRICING_USD[endpoint] || 0;

    let tokenPrice: number;
    let requiredTokens: number;

    try {
      tokenPrice = await getTokenPrice();
      requiredTokens = calculateTokenAmount(priceUSD, tokenPrice);
    } catch (error) {
      return NextResponse.json(
        {
          error: 'Price unavailable',
          code: 'PRICE_ERROR',
          message: 'Unable to fetch token price. Please try again later.',
        },
        { status: 503 }
      );
    }

    // Check for payment proof
    const paymentProof = req.headers.get('x-payment-proof');

    if (!paymentProof) {
      // Return 402 Payment Required with pricing info
      return NextResponse.json(
        {
          error: 'Payment required',
          code: 'PAYMENT_REQUIRED',
          pricing: {
            endpoint,
            priceUSD,
            tokenPrice,
            requiredTokens,
          },
          distribution: {
            burn: `${PAYMENT_DISTRIBUTION.burn}%`,
            provider: `${PAYMENT_DISTRIBUTION.provider}%`,
            holders: `${PAYMENT_DISTRIBUTION.holders}%`,
            treasury: `${PAYMENT_DISTRIBUTION.treasury}%`,
          },
          burnInfo: {
            percentage: PAYMENT_DISTRIBUTION.burn,
            tokensToBurn: Math.floor(requiredTokens * (PAYMENT_DISTRIBUTION.burn / 100)),
          },
          paymentWallet: PAYMENT_WALLETS.payment,
          tokenMint: PYRE_TOKEN_CONFIG.mint,
          instructions: 'Send required tokens to payment wallet and include tx signature in x-payment-proof header',
        },
        { status: 402 }
      );
    }

    // Verify payment on-chain
    const verification = await verifyPayment(paymentProof, requiredTokens, walletAddress);

    if (!verification.valid || !verification.payment) {
      return NextResponse.json(
        {
          error: 'Payment verification failed',
          code: 'INVALID_PAYMENT',
          message: verification.error || 'Could not verify payment on blockchain',
        },
        { status: 402 }
      );
    }

    // Process payment distribution
    const distribution = calculateDistribution(verification.payment.tokenAmount);

    // Record burn to database
    try {
      await recordBurn(distribution.burn, verification.payment.txHash, endpoint);
    } catch (error) {
      console.error('Failed to record burn:', error);
      // Continue with request even if burn recording fails
    }

    // Log transaction
    console.log('[Payment]', {
      endpoint,
      wallet: walletAddress,
      amount: verification.payment.tokenAmount,
      burned: distribution.burn.toString(),
      txHash: verification.payment.txHash,
    });

    // Add payment info to request headers for handler
    const modifiedHeaders = new Headers(req.headers);
    modifiedHeaders.set('x-payment-verified', 'true');
    modifiedHeaders.set('x-payment-amount', verification.payment.tokenAmount.toString());
    modifiedHeaders.set('x-payment-burned', distribution.burn.toString());

    // Call the actual handler
    const response = await handler(req);

    // Add payment receipt to response
    const responseData = await response.json();

    return NextResponse.json({
      ...responseData,
      _payment: {
        success: true,
        amount: verification.payment.tokenAmount,
        burned: distribution.burn.toString(),
        txHash: verification.payment.txHash,
      },
    });
  };
}

/**
 * Helper to create payment proof for client-side usage
 */
export function createPaymentProof(txHash: string): string {
  const proof = {
    txHash,
    timestamp: Date.now(),
  };

  return Buffer.from(JSON.stringify(proof)).toString('base64');
}
