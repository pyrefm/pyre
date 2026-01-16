# 🔥 PYRE - Token-Native API Payment Platform

> Every API call burns $PYRE. The deflationary API economy where usage creates scarcity.

[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Solana](https://img.shields.io/badge/Blockchain-Solana-blueviolet)](https://solana.com)
[![Next.js](https://img.shields.io/badge/Framework-Next.js%2014-black)](https://nextjs.org)

---

## 🎯 What is PYRE?

PYRE is a revolutionary API payment platform where all transactions are made using the native $PYRE token. Unlike traditional API billing, every payment creates real value for token holders through our unique burn mechanism:

- **30% of every payment is burned** 🔥 - Permanent deflation
- **50% goes to API providers** - Incentivizing developers
- **15% to holders pool** - Redistributed to token holders
- **5% to treasury** - Platform sustainability

## 🔥 Burn Mechanism

The burn mechanism is the core of PYRE's deflationary model:

### Payment Distribution
```
┌─────────────────────────────────────────┐
│          $PYRE PAYMENT FLOW             │
├─────────────────────────────────────────┤
│  🔥 30% → BURN (Permanent Deflation)     │
│  👨‍💻 50% → API Provider                   │
│  📈 15% → Holders Pool                   │
│  🏦  5% → Treasury                       │
└─────────────────────────────────────────┘
```

### Why Burn?

1. **Every API call requires $PYRE tokens**
2. **30% of payment is burned permanently**
3. **Burned tokens are sent to null address**
4. **Circulating supply decreases over time**

Example: If 1M API calls/day × 100 tokens avg = **30M tokens burned daily** 🔥

At this rate, **50% of supply burns in ~2.3 years**!

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL (required for production)
- Solana wallet
- OpenAI API key (for AI endpoints)

### Installation

```bash
# Clone the repository
git clone https://github.com/pyre-fm/pyre.git
cd pyre

# Install dependencies
npm install

# Set up environment
cp config/env.example.txt .env.local
# Edit .env.local with your configuration

# Generate Prisma client
npm run db:generate

# Run development server
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) to see the app.

### Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Open Prisma Studio
npm run db:studio
```

## 📁 Project Structure

```
pyre/
├── app/
│   ├── api/              # API endpoints
│   │   ├── ai/           # AI APIs (OpenAI integration)
│   │   ├── data/         # Data APIs (CoinGecko, wttr.in)
│   │   └── token/        # Token info (free endpoints)
│   ├── dashboard/        # User dashboard
│   ├── playground/       # API testing
│   ├── analytics/        # Burn analytics
│   └── page.tsx          # Landing page
│
├── components/           # React components
│   ├── wallet/           # Wallet integration
│   └── token/            # Token components
│
├── lib/
│   ├── ai/               # OpenAI integration
│   ├── db/               # Prisma database client
│   ├── token/            # Token config, pricing, burn
│   ├── payments/         # Payment middleware
│   ├── solana/           # Solana blockchain interactions
│   └── blockchain/       # Chain utilities
│
├── prisma/
│   └── schema.prisma     # Database schema
│
└── public/
    └── assets/           # Images & logos
```

## 🔧 API Usage

### Making a Paid API Call

```typescript
// 1. Sign payment transaction with your wallet
const { signature } = await signPaymentTransaction(
  walletAddress,
  tokenAmount,
  PYRE_TOKEN_MINT
);

// 2. Create payment proof
const paymentProof = createPaymentProof(signature);

// 3. Make API request with payment
const response = await fetch('/api/ai/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-wallet-address': walletAddress,
    'x-payment-proof': paymentProof,
  },
  body: JSON.stringify({ message: 'Hello!' }),
});

// 4. Response includes burn receipt
const data = await response.json();
console.log(`Burned: ${data._payment.burned} $PYRE`);
```

### Without Payment (402 Response)

```typescript
// Request without payment returns pricing info
const response = await fetch('/api/ai/chat', {
  method: 'POST',
  headers: {
    'x-wallet-address': walletAddress,
  },
  body: JSON.stringify({ message: 'Hello!' }),
});

// Response: 402 Payment Required
{
  "error": "Payment required",
  "pricing": {
    "priceUSD": 0.05,
    "tokenPrice": 0.001,
    "requiredTokens": 50,
  },
  "burnInfo": {
    "percentage": 30,
    "tokensToBurn": 15
  }
}
```

## 📊 API Endpoints

### Free Endpoints
| Endpoint | Description |
|----------|-------------|
| `/api/health` | Health check |
| `/api/token/price` | Token price from Jupiter API |
| `/api/token/burn-stats` | Burn statistics from database |

### Paid Endpoints (Burns $PYRE!)
| Endpoint | Price | Description | Data Source |
|----------|-------|-------------|-------------|
| `/api/ai/chat` | $0.05 | AI Chat Completion | OpenAI GPT-4 |
| `/api/ai/image` | $0.10 | Image Generation | OpenAI DALL-E 3 |
| `/api/data/crypto` | $0.02 | Crypto Prices | CoinGecko API |
| `/api/data/weather` | $0.01 | Weather Data | wttr.in |

## 🛠 Configuration

### Environment Variables

```env
# Database (Required)
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# Token Configuration (Required after launch)
NEXT_PUBLIC_PYRE_TOKEN_MINT=your_token_mint_address
NEXT_PUBLIC_PAYMENT_WALLET=your_payment_wallet
NEXT_PUBLIC_TREASURY_WALLET=your_treasury_wallet
NEXT_PUBLIC_HOLDER_POOL_WALLET=your_holder_pool_wallet

# Solana Network
NEXT_PUBLIC_SOLANA_NETWORK=mainnet

# AI Integration (Required for AI endpoints)
OPENAI_API_KEY=sk-...
```

### Adding New API Endpoints

1. Create route in `app/api/your-endpoint/route.ts`
2. Add pricing in `lib/token/config.ts`
3. Wrap handler with `withTokenPayment`

```typescript
import { withTokenPayment } from '@/lib/payments/middleware';

async function handler(req: NextRequest) {
  // Your API logic
  return NextResponse.json({ data: 'result' });
}

// Price: $0.05 per call (30% = $0.015 burned!)
export const POST = withTokenPayment(handler, 0.05);
```

## 🔌 Integrations

### Real Data Sources (No Mock Data)
- **Token Price**: Jupiter API (real-time Solana token prices)
- **Burn Statistics**: PostgreSQL database (persistent storage)
- **AI Chat**: OpenAI GPT-4o-mini
- **Image Generation**: OpenAI DALL-E 3
- **Crypto Prices**: CoinGecko API
- **Weather Data**: wttr.in

### Payment Verification
All payments are verified on-chain via Solana RPC:
- Transaction signature validation
- Sender/recipient verification
- Amount verification with 1% tolerance

## 🎨 Theming

PYRE uses a dark-first design with custom color variables:

```css
--pyre-primary: #0066FF;    /* Electric Blue */
--pyre-accent: #00FF88;     /* Neon Green */
--pyre-burn: #FF6B00;       /* Orange (burn color) */
--pyre-bg: #0A0A0F;         /* Dark background */
```

## 📈 Roadmap

- [x] Core payment middleware with burn
- [x] Burn tracking & statistics (database)
- [x] Dashboard & burn analytics
- [x] API Playground
- [x] Real token price from Jupiter API
- [x] OpenAI integration for AI endpoints
- [x] On-chain payment verification
- [ ] Burn leaderboard & badges
- [ ] Multi-chain support (BSC, ETH)
- [ ] SDK packages (npm, pip)
- [ ] Mobile wallet app

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines first.

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes using conventional commits (`feat:`, `fix:`, `docs:`, etc.)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🔗 Links

- **Website**: [pyrefm.xyz](https://pyrefm.xyz)
- **Twitter**: [@pyrefm](https://x.com/pyrefm)
- **Docs**: [pyrefm.xyz/docs](https://pyrefm.xyz/docs)

---

**Built with 🔥 by PYRE**

*Every API call burns $PYRE. Join the deflationary revolution.*
