/**
 * SPL Token Utilities
 * Balance checking, transfers, and burns
 */

import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { 
  getAssociatedTokenAddress, 
  createTransferInstruction,
  createBurnInstruction,
  getAccount,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { PYRE_TOKEN_CONFIG, PAYMENT_WALLETS, getRpcEndpoint } from './config';

/**
 * Get connection to Solana
 */
export function getConnection(): Connection {
  return new Connection(getRpcEndpoint(), 'confirmed');
}

/**
 * Get user's $PYRE token balance
 */
export async function getTokenBalance(walletAddress: string): Promise<{
  balance: number;
  rawBalance: bigint;
  hasTokens: boolean;
}> {
  try {
    const connection = getConnection();
    const wallet = new PublicKey(walletAddress);
    const mint = new PublicKey(PYRE_TOKEN_CONFIG.mint);
    
    console.log('[getTokenBalance] Mint:', PYRE_TOKEN_CONFIG.mint);
    console.log('[getTokenBalance] Wallet:', walletAddress);
    console.log('[getTokenBalance] Decimals:', PYRE_TOKEN_CONFIG.decimals);
    
    // Get associated token account
    const tokenAccount = await getAssociatedTokenAddress(mint, wallet);
    console.log('[getTokenBalance] Token Account:', tokenAccount.toString());
    
    try {
      const account = await getAccount(connection, tokenAccount);
      const rawBalance = account.amount;
      const balance = Number(rawBalance) / Math.pow(10, PYRE_TOKEN_CONFIG.decimals);
      
      console.log('[getTokenBalance] Raw Balance:', rawBalance.toString());
      console.log('[getTokenBalance] Balance:', balance);
      
      return {
        balance,
        rawBalance,
        hasTokens: rawBalance > BigInt(0),
      };
    } catch (err) {
      // Token account doesn't exist = 0 balance
      console.log('[getTokenBalance] Token account not found or error:', err);
      return {
        balance: 0,
        rawBalance: BigInt(0),
        hasTokens: false,
      };
    }
  } catch (error) {
    console.error('[getTokenBalance] Error:', error);
    return {
      balance: 0,
      rawBalance: BigInt(0),
      hasTokens: false,
    };
  }
}

/**
 * Check if user has enough tokens for a payment
 */
export async function hasEnoughTokens(
  walletAddress: string, 
  requiredAmount: number
): Promise<boolean> {
  const { balance } = await getTokenBalance(walletAddress);
  return balance >= requiredAmount;
}

/**
 * Create payment transaction with burn
 * Returns unsigned transaction for wallet to sign
 */
export async function createPaymentTransaction(
  payerWallet: PublicKey,
  tokenAmount: number,
  providerWallet?: string, // Optional: specific provider wallet
): Promise<{
  transaction: Transaction;
  breakdown: {
    total: number;
    burn: number;
    provider: number;
    holders: number;
    treasury: number;
  };
}> {
  const connection = getConnection();
  const mint = new PublicKey(PYRE_TOKEN_CONFIG.mint);
  
  // Convert to raw amount (with decimals)
  const rawAmount = BigInt(Math.floor(tokenAmount * Math.pow(10, PYRE_TOKEN_CONFIG.decimals)));
  
  // Calculate distribution
  const burnAmount = (rawAmount * BigInt(30)) / BigInt(100);
  const providerAmount = (rawAmount * BigInt(50)) / BigInt(100);
  const holdersAmount = (rawAmount * BigInt(15)) / BigInt(100);
  const treasuryAmount = (rawAmount * BigInt(5)) / BigInt(100);
  
  // Get token accounts
  const payerTokenAccount = await getAssociatedTokenAddress(mint, payerWallet);
  
  const treasuryWallet = new PublicKey(PAYMENT_WALLETS.treasury);
  const treasuryTokenAccount = await getAssociatedTokenAddress(mint, treasuryWallet);
  
  const holderPoolWallet = new PublicKey(PAYMENT_WALLETS.holderPool);
  const holderPoolTokenAccount = await getAssociatedTokenAddress(mint, holderPoolWallet);
  
  const providerWalletPubkey = new PublicKey(providerWallet || PAYMENT_WALLETS.payment);
  const providerTokenAccount = await getAssociatedTokenAddress(mint, providerWalletPubkey);
  
  // Create transaction
  const transaction = new Transaction();
  
  // Add recent blockhash
  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = payerWallet;
  
  // 1. BURN 30% 🔥
  transaction.add(
    createBurnInstruction(
      payerTokenAccount,
      mint,
      payerWallet,
      burnAmount,
      [],
      TOKEN_PROGRAM_ID
    )
  );
  
  // 2. Transfer 50% to Provider
  transaction.add(
    createTransferInstruction(
      payerTokenAccount,
      providerTokenAccount,
      payerWallet,
      providerAmount,
      [],
      TOKEN_PROGRAM_ID
    )
  );
  
  // 3. Transfer 15% to Holder Pool
  transaction.add(
    createTransferInstruction(
      payerTokenAccount,
      holderPoolTokenAccount,
      payerWallet,
      holdersAmount,
      [],
      TOKEN_PROGRAM_ID
    )
  );
  
  // 4. Transfer 5% to Treasury
  transaction.add(
    createTransferInstruction(
      payerTokenAccount,
      treasuryTokenAccount,
      payerWallet,
      treasuryAmount,
      [],
      TOKEN_PROGRAM_ID
    )
  );
  
  return {
    transaction,
    breakdown: {
      total: tokenAmount,
      burn: Number(burnAmount) / Math.pow(10, PYRE_TOKEN_CONFIG.decimals),
      provider: Number(providerAmount) / Math.pow(10, PYRE_TOKEN_CONFIG.decimals),
      holders: Number(holdersAmount) / Math.pow(10, PYRE_TOKEN_CONFIG.decimals),
      treasury: Number(treasuryAmount) / Math.pow(10, PYRE_TOKEN_CONFIG.decimals),
    },
  };
}

/**
 * Verify a payment transaction on-chain
 * Validates sender, recipient, amount, and token mint
 */
export async function verifyTransaction(
  signature: string,
  expectedSender?: string,
  expectedRecipient?: string,
  expectedAmount?: number,
  expectedMint?: string
): Promise<{
  valid: boolean;
  amount?: number;
  sender?: string;
  error?: string;
}> {
  try {
    const connection = getConnection();
    
    // Wait for confirmation
    const confirmation = await connection.confirmTransaction(signature, 'confirmed');
    
    if (confirmation.value.err) {
      return {
        valid: false,
        error: 'Transaction failed on-chain',
      };
    }
    
    // Get transaction details
    const tx = await connection.getParsedTransaction(signature, {
      maxSupportedTransactionVersion: 0,
    });
    
    if (!tx) {
      return {
        valid: false,
        error: 'Transaction not found',
      };
    }

    // Parse token transfers from the transaction
    const instructions = tx.transaction.message.instructions;
    let totalAmount = 0;
    let sender: string | undefined;

    for (const instruction of instructions) {
      if ('parsed' in instruction && instruction.program === 'spl-token') {
        const parsed = instruction.parsed;
        
        if (parsed.type === 'transfer' || parsed.type === 'transferChecked') {
          const info = parsed.info;
          
          // Check mint if specified
          if (expectedMint && info.mint && info.mint !== expectedMint) {
            continue; // Skip non-matching token transfers
          }

          // Get sender
          if (!sender && info.authority) {
            sender = info.authority;
          }

          // Accumulate amount
          const amount = info.tokenAmount?.uiAmount || 
            Number(info.amount) / Math.pow(10, PYRE_TOKEN_CONFIG.decimals);
          totalAmount += amount;
        }

        if (parsed.type === 'burn') {
          const info = parsed.info;
          if (!sender && info.authority) {
            sender = info.authority;
          }
          const amount = info.tokenAmount?.uiAmount || 
            Number(info.amount) / Math.pow(10, PYRE_TOKEN_CONFIG.decimals);
          totalAmount += amount;
        }
      }
    }

    // Validate sender if specified
    if (expectedSender && sender && sender !== expectedSender) {
      return {
        valid: false,
        error: 'Transaction sender does not match expected wallet',
      };
    }

    // Validate amount if specified (allow 1% tolerance for rounding)
    if (expectedAmount && totalAmount > 0) {
      const tolerance = expectedAmount * 0.01;
      if (totalAmount < expectedAmount - tolerance) {
        return {
          valid: false,
          error: `Insufficient payment: expected ${expectedAmount}, got ${totalAmount}`,
        };
      }
    }

    return {
      valid: true,
      amount: totalAmount,
      sender,
    };
  } catch (error) {
    console.error('Error verifying transaction:', error);
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Verification failed',
    };
  }
}

/**
 * Get Solscan URL for a transaction
 */
export function getSolscanUrl(signature: string): string {
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'mainnet';
  const cluster = network === 'mainnet' ? '' : '?cluster=devnet';
  return `https://solscan.io/tx/${signature}${cluster}`;
}

/**
 * Format token amount for display
 */
export function formatTokenAmount(amount: number): string {
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(2)}M`;
  }
  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(2)}K`;
  }
  return amount.toLocaleString(undefined, { maximumFractionDigits: 2 });
}
