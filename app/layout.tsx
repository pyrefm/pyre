import type { Metadata } from 'next';
import './globals.css';
import WalletProvider from '@/components/wallet/WalletProvider';

export const metadata: Metadata = {
  title: 'PYRE - Token-Native API Payments',
  description: 'Every API call burns $PYRE. The deflationary API economy where usage creates scarcity.',
  keywords: ['API', 'payments', 'crypto', 'token', 'Solana', 'burn', 'deflationary'],
  authors: [{ name: 'PYRE' }],
  openGraph: {
    title: 'PYRE - Token-Native API Payments',
    description: 'Every API call burns $PYRE. The deflationary API economy.',
    url: 'https://pyrefm.xyz',
    siteName: 'PYRE',
    images: [
      {
        url: '/assets/pyre-logo-no-bg.png',
        width: 512,
        height: 512,
        alt: 'PYRE - Token-Native API Payments',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PYRE - Burn to Earn 🔥',
    description: 'Every API call burns $PYRE. The deflationary API economy.',
    site: '@pyrefm',
    creator: '@pyrefm',
    images: ['/assets/pyre-logo-no-bg.png'],
  },
  icons: {
    icon: '/assets/pyre-logo-no-bg.png',
    apple: '/assets/pyre-logo-no-bg.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {/* Animated Background */}
        <div className="animated-bg" />
        
        {/* Wallet Provider for Solana */}
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
