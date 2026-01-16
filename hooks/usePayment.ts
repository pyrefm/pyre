'use client';

import { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { preparePayment, confirmPayment, getPaymentInfo } from '@/lib/solana/payment';
import { getSolscanUrl } from '@/lib/solana/token';

export type PaymentStatus = 'idle' | 'preparing' | 'awaiting_signature' | 'confirming' | 'success' | 'error';

export interface PaymentState {
  status: PaymentStatus;
  error: string | null;
  signature: string | null;
  solscanUrl: string | null;
  breakdown: {
    total: number;
    burn: number;
    provider: number;
    holders: number;
    treasury: number;
  } | null;
}

export function usePayment() {
  const { publicKey, signTransaction, connected } = useWallet();
  const { connection } = useConnection();
  
  const [state, setState] = useState<PaymentState>({
    status: 'idle',
    error: null,
    signature: null,
    solscanUrl: null,
    breakdown: null,
  });

  const pay = useCallback(async (
    tokenAmount: number,
    providerWallet?: string
  ): Promise<boolean> => {
    if (!publicKey || !signTransaction || !connected) {
      setState(prev => ({
        ...prev,
        status: 'error',
        error: 'Wallet not connected',
      }));
      return false;
    }

    try {
      // Step 1: Prepare transaction
      setState(prev => ({ ...prev, status: 'preparing', error: null }));
      
      const { transaction, breakdown } = await preparePayment(
        publicKey,
        tokenAmount,
        providerWallet
      );

      // Step 2: Request signature from wallet
      setState(prev => ({ ...prev, status: 'awaiting_signature' }));
      
      const signedTransaction = await signTransaction(transaction);
      
      // Step 3: Send transaction
      setState(prev => ({ ...prev, status: 'confirming' }));
      
      const signature = await connection.sendRawTransaction(
        signedTransaction.serialize(),
        { skipPreflight: false }
      );

      // Step 4: Wait for confirmation
      await connection.confirmTransaction(signature, 'confirmed');

      // Step 5: Success!
      setState({
        status: 'success',
        error: null,
        signature,
        solscanUrl: getSolscanUrl(signature),
        breakdown,
      });

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      
      // Handle user rejection
      if (errorMessage.includes('User rejected')) {
        setState(prev => ({
          ...prev,
          status: 'error',
          error: 'Transaction cancelled by user',
        }));
      } else {
        setState(prev => ({
          ...prev,
          status: 'error',
          error: errorMessage,
        }));
      }
      
      return false;
    }
  }, [publicKey, signTransaction, connected, connection]);

  const reset = useCallback(() => {
    setState({
      status: 'idle',
      error: null,
      signature: null,
      solscanUrl: null,
      breakdown: null,
    });
  }, []);

  const getInfo = useCallback((tokenAmount: number) => {
    return getPaymentInfo(tokenAmount);
  }, []);

  return {
    ...state,
    pay,
    reset,
    getInfo,
    isProcessing: ['preparing', 'awaiting_signature', 'confirming'].includes(state.status),
  };
}
