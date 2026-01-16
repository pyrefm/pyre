'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Wallet, LogOut, Copy, Check, ExternalLink, Flame, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import { useTokenBalance } from '@/hooks/useTokenBalance';
import { PYRE_TOKEN_CONFIG, isTokenConfigured } from '@/lib/solana/config';
import { formatTokenAmount } from '@/lib/solana/token';

export default function ConnectButton() {
  const { publicKey, disconnect, connected } = useWallet();
  const { setVisible } = useWalletModal();
  const { balance, loading: balanceLoading, refetch, isConfigured } = useTokenBalance();
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  if (!connected || !publicKey) {
    return (
      <button
        onClick={() => setVisible(true)}
        className="btn-primary flex items-center gap-2"
      >
        <Wallet className="w-4 h-4" />
        Connect Wallet
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-3 px-4 py-2 rounded-xl bg-dark-elevated border border-dark-border hover:border-pyre-primary transition-colors"
      >
        {/* Token Balance */}
        {isConfigured && (
          <div className="flex items-center gap-1.5 pr-3 border-r border-dark-border">
            <Image 
              src={PYRE_TOKEN_CONFIG.logo} 
              alt="PYRE" 
              width={18} 
              height={18}
              className="rounded-full"
            />
            <span className="text-sm font-medium text-burn">
              {balanceLoading ? '...' : formatTokenAmount(balance)}
            </span>
          </div>
        )}
        
        {/* Wallet Address */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent" />
          <span className="font-mono text-sm">{shortenAddress(publicKey.toString())}</span>
        </div>
      </button>

      {showMenu && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowMenu(false)} 
          />
          
          {/* Menu */}
          <div className="absolute right-0 mt-2 w-64 rounded-xl bg-dark-card border border-dark-border shadow-lg z-50">
            {/* Balance Section */}
            {isConfigured && (
              <div className="p-4 border-b border-dark-border bg-burn/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-text-muted">$PYRE Balance</span>
                  <button 
                    onClick={refetch}
                    className="p-1 hover:bg-dark-elevated rounded transition-colors"
                    title="Refresh balance"
                  >
                    <RefreshCw className={`w-3 h-3 text-text-muted ${balanceLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <Image 
                    src={PYRE_TOKEN_CONFIG.logo} 
                    alt="PYRE" 
                    width={24} 
                    height={24}
                    className="rounded-full"
                  />
                  <span className="text-xl font-bold text-burn">
                    {balanceLoading ? '...' : balance.toLocaleString()}
                  </span>
                  <span className="text-text-muted text-sm">$PYRE</span>
                </div>
              </div>
            )}

            {/* Wallet Info */}
            <div className="p-3 border-b border-dark-border">
              <div className="text-xs text-text-muted mb-1">Connected Wallet</div>
              <div className="font-mono text-sm truncate">{publicKey.toString()}</div>
            </div>
            
            {/* Actions */}
            <div className="p-2">
              <button
                onClick={copyAddress}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-elevated transition-colors text-left"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-accent" />
                ) : (
                  <Copy className="w-4 h-4 text-text-muted" />
                )}
                <span className="text-sm">{copied ? 'Copied!' : 'Copy Address'}</span>
              </button>
              
              <a
                href={`https://solscan.io/account/${publicKey.toString()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-elevated transition-colors text-left"
              >
                <ExternalLink className="w-4 h-4 text-text-muted" />
                <span className="text-sm">View on Solscan</span>
              </a>
              
              <button
                onClick={() => {
                  disconnect();
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-elevated transition-colors text-left text-red-400"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Disconnect</span>
              </button>
            </div>

            {/* Token Not Configured Warning */}
            {!isConfigured && (
              <div className="p-3 border-t border-dark-border bg-yellow-500/10">
                <div className="flex items-start gap-2">
                  <Flame className="w-4 h-4 text-yellow-500 mt-0.5" />
                  <div className="text-xs text-yellow-500">
                    $PYRE token not configured. Waiting for token launch.
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
