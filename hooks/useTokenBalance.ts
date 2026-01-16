'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { getTokenBalance } from '@/lib/solana/token';
import { isTokenConfigured } from '@/lib/solana/config';

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
    isConfigured: false,
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

    if (!isTokenConfigured()) {
      setState(prev => ({
        ...prev,
        isConfigured: false,
        loading: false,
        error: 'Token not configured',
      }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await getTokenBalance(publicKey.toString());
      setState({
        balance: result.balance,
        rawBalance: result.rawBalance,
        hasTokens: result.hasTokens,
        loading: false,
        error: null,
        isConfigured: true,
      });
    } catch (error) {
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
