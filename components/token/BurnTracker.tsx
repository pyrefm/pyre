'use client';

import { useState, useEffect } from 'react';
import { Flame } from 'lucide-react';

interface BurnTrackerProps {
  initialValue?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function BurnTracker({ 
  initialValue = 15000000, 
  size = 'md',
  showLabel = true 
}: BurnTrackerProps) {
  const [burned, setBurned] = useState(initialValue);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const increase = Math.floor(Math.random() * 100) + 10;
      setBurned(prev => prev + increase);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1_000_000_000) {
      return `${(num / 1_000_000_000).toFixed(2)}B`;
    }
    if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(2)}M`;
    }
    if (num >= 1_000) {
      return `${(num / 1_000).toFixed(2)}K`;
    }
    return num.toLocaleString();
  };

  const sizeClasses = {
    sm: {
      container: 'gap-2 px-3 py-1.5',
      icon: 'w-4 h-4',
      text: 'text-sm',
    },
    md: {
      container: 'gap-3 px-4 py-2',
      icon: 'w-5 h-5',
      text: 'text-lg',
    },
    lg: {
      container: 'gap-4 px-6 py-3',
      icon: 'w-6 h-6',
      text: 'text-2xl',
    },
  };

  const classes = sizeClasses[size];

  return (
    <div 
      className={`inline-flex items-center ${classes.container} rounded-full bg-burn/10 border border-burn/30`}
    >
      <Flame 
        className={`${classes.icon} text-burn ${isAnimating ? 'animate-pulse' : ''}`} 
      />
      <span 
        className={`${classes.text} font-mono font-bold text-burn transition-all ${
          isAnimating ? 'scale-105' : ''
        }`}
      >
        {formatNumber(burned)}
      </span>
      {showLabel && (
        <span className="text-burn/70 text-sm">$PYRE BURNED</span>
      )}
      <span className="pulse-dot ml-1" />
    </div>
  );
}
