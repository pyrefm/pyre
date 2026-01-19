'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

export interface TokenBalanceState {
  balance: number;
  rawBalance: bigint;
  hasTokens: boolean;
  loading: boolean;
  error: string | null;
  isConfigured: boolean;
}

export function useTokenBalance() {
  const { publicKey, connected } = useWallet();
  const [state, setState] = useState<TokenBalanceState>({
    balance: 0,
    rawBalance: BigInt(0),
    hasTokens: false,
    loading: false,
    error: null,
    isConfigured: true, // Token is configured
  });

  const fetchBalance = useCallback(async () => {
    if (!publicKey || !connected) {
      setState(prev => ({
        ...prev,
        balance: 0,
        rawBalance: BigInt(0),
        hasTokens: false,
        loading: false,
        error: null,
      }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Use server-side API to fetch balance (uses private RPC)
      const res = await fetch(`/api/token/balance?wallet=${publicKey.toString()}`);
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch balance');
      }

      setState({
        balance: data.data.balance,
        rawBalance: BigInt(data.data.rawBalance),
        hasTokens: data.data.hasTokens,
        loading: false,
        error: null,
        isConfigured: true,
      });
    } catch (error) {
      console.error('[useTokenBalance] Error:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch balance',
      }));
    }
  }, [publicKey, connected]);

  useEffect(() => {
    fetchBalance();
    
    // Refresh balance every 30 seconds
    const interval = setInterval(fetchBalance, 30000);
    return () => clearInterval(interval);
  }, [fetchBalance]);

  return {
    ...state,
    refetch: fetchBalance,
  };
}
