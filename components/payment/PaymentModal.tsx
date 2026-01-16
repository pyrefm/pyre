'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Flame, 
  X, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  ExternalLink,
  Wallet,
  AlertTriangle,
} from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { usePayment } from '@/hooks/usePayment';
import { useTokenBalance } from '@/hooks/useTokenBalance';
import { PYRE_TOKEN_CONFIG } from '@/lib/solana/config';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (signature: string) => void;
  tokenAmount: number;
  endpoint: string;
  usdPrice: number;
}

export function PaymentModal({
  isOpen,
  onClose,
  onSuccess,
  tokenAmount,
  endpoint,
  usdPrice,
}: PaymentModalProps) {
  const { connected, publicKey } = useWallet();
  const { setVisible: openWalletModal } = useWalletModal();
  const { balance, loading: balanceLoading, refetch: refetchBalance } = useTokenBalance();
  const { 
    status, 
    error, 
    signature, 
    solscanUrl, 
    breakdown,
    pay, 
    reset, 
    getInfo,
    isProcessing 
  } = usePayment();

  const paymentInfo = getInfo(tokenAmount);
  const hasEnoughBalance = balance >= tokenAmount;

  useEffect(() => {
    if (isOpen) {
      reset();
      refetchBalance();
    }
  }, [isOpen, reset, refetchBalance]);

  useEffect(() => {
    if (status === 'success' && signature) {
      // Wait a moment then call onSuccess
      const timer = setTimeout(() => {
        onSuccess(signature);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status, signature, onSuccess]);

  const handlePay = async () => {
    const success = await pay(tokenAmount);
    if (success) {
      refetchBalance();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-dark-card border border-dark-border rounded-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-dark-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-burn/20 flex items-center justify-center">
              <Flame className="w-5 h-5 text-burn" />
            </div>
            <div>
              <h3 className="font-bold">Pay with $PYRE</h3>
              <p className="text-xs text-text-muted">{endpoint}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-dark-elevated rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-text-muted" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!connected ? (
            /* Connect Wallet State */
            <div className="text-center py-8">
              <Wallet className="w-16 h-16 text-text-muted mx-auto mb-4" />
              <h4 className="text-lg font-bold mb-2">Connect Your Wallet</h4>
              <p className="text-text-secondary text-sm mb-6">
                Connect a Solana wallet to pay with $PYRE tokens
              </p>
              <button
                onClick={() => openWalletModal(true)}
                className="btn-primary w-full"
              >
                Connect Wallet
              </button>
            </div>
          ) : status === 'success' ? (
            /* Success State */
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-accent" />
              </div>
              <h4 className="text-xl font-bold mb-2 text-accent">Payment Successful!</h4>
              <p className="text-text-secondary text-sm mb-4">
                🔥 {breakdown?.burn.toFixed(2)} $PYRE burned forever
              </p>
              {solscanUrl && (
                <a
                  href={solscanUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-pyre-primary hover:text-pyre-primary-light"
                >
                  View on Solscan
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          ) : status === 'error' ? (
            /* Error State */
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-10 h-10 text-red-400" />
              </div>
              <h4 className="text-xl font-bold mb-2 text-red-400">Payment Failed</h4>
              <p className="text-text-secondary text-sm mb-4">{error}</p>
              <button onClick={reset} className="btn-secondary">
                Try Again
              </button>
            </div>
          ) : (
            /* Payment Form */
            <>
              {/* Balance */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-dark-elevated mb-4">
                <span className="text-text-secondary text-sm">Your Balance</span>
                <div className="flex items-center gap-2">
                  <Image 
                    src={PYRE_TOKEN_CONFIG.logo} 
                    alt="PYRE" 
                    width={20} 
                    height={20}
                    className="rounded-full"
                  />
                  <span className="font-bold">
                    {balanceLoading ? '...' : balance.toLocaleString()} $PYRE
                  </span>
                </div>
              </div>

              {/* Not enough balance warning */}
              {!hasEnoughBalance && !balanceLoading && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30 mb-4">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-400 text-sm font-medium">Insufficient Balance</p>
                    <p className="text-text-muted text-xs">
                      You need {(tokenAmount - balance).toFixed(2)} more $PYRE
                    </p>
                  </div>
                </div>
              )}

              {/* Amount */}
              <div className="text-center mb-6">
                <div className="text-4xl font-bold mb-1">
                  {tokenAmount.toLocaleString()} $PYRE
                </div>
                <div className="text-text-muted text-sm">
                  ≈ ${usdPrice.toFixed(4)} USD
                </div>
              </div>

              {/* Distribution Breakdown */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-burn">🔥 Burn (30%)</span>
                  <span className="font-mono">{paymentInfo.breakdown.burn.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-pyre-primary">👨‍💻 Provider (50%)</span>
                  <span className="font-mono">{paymentInfo.breakdown.provider.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-accent">📈 Holders (15%)</span>
                  <span className="font-mono">{paymentInfo.breakdown.holders.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-tier-silver">🏦 Treasury (5%)</span>
                  <span className="font-mono">{paymentInfo.breakdown.treasury.amount.toFixed(2)}</span>
                </div>
              </div>

              {/* Pay Button */}
              <button
                onClick={handlePay}
                disabled={isProcessing || !hasEnoughBalance}
                className="btn-burn w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {status === 'preparing' && 'Preparing...'}
                    {status === 'awaiting_signature' && 'Confirm in Wallet...'}
                    {status === 'confirming' && 'Confirming...'}
                  </>
                ) : (
                  <>
                    <Flame className="w-5 h-5" />
                    Pay & Burn
                  </>
                )}
              </button>

              <p className="text-center text-text-muted text-xs mt-4">
                30% of your payment will be burned forever 🔥
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
