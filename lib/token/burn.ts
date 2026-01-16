/**
 * Token Burn Mechanism
 * Every API call burns 30% of the payment
 * Uses database storage for persistence
 */

import { PAYMENT_DISTRIBUTION, PYRE_TOKEN } from './config';
import prisma from '@/lib/db';

/**
 * Record a token burn to the database
 */
export async function recordBurn(
  amount: number | bigint,
  txHash?: string,
  endpoint?: string,
  transactionId?: string
): Promise<void> {
  const burnAmount = typeof amount === 'number' ? BigInt(Math.floor(amount)) : amount;

  try {
    // Create burn record
    await prisma.burnRecord.create({
      data: {
        amount: burnAmount,
        txHash,
        endpoint,
        transactionId,
      },
    });

    // Update global stats
    await updateGlobalBurnStats(burnAmount);

    // Update daily stats
    await updateDailyBurnStats(burnAmount);
  } catch (error) {
    console.error('Failed to record burn:', error);
    throw error;
  }
}

/**
 * Update global burn statistics
 */
async function updateGlobalBurnStats(burnAmount: bigint): Promise<void> {
  await prisma.globalStats.upsert({
    where: { id: 'global' },
    update: {
      totalBurned: { increment: burnAmount },
      burnedToday: { increment: burnAmount },
      burnedThisWeek: { increment: burnAmount },
      burnedThisMonth: { increment: burnAmount },
      totalApiCalls: { increment: BigInt(1) },
    },
    create: {
      id: 'global',
      totalBurned: burnAmount,
      burnedToday: burnAmount,
      burnedThisWeek: burnAmount,
      burnedThisMonth: burnAmount,
      totalApiCalls: BigInt(1),
    },
  });
}

/**
 * Update daily burn statistics for charts
 */
async function updateDailyBurnStats(burnAmount: bigint): Promise<void> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.dailyBurnStats.upsert({
    where: { date: today },
    update: {
      totalBurned: { increment: burnAmount },
      apiCalls: { increment: 1 },
    },
    create: {
      date: today,
      totalBurned: burnAmount,
      apiCalls: 1,
      uniqueUsers: 1,
    },
  });
}

/**
 * Reset daily/weekly/monthly counters (run via cron job)
 */
export async function resetPeriodicCounters(period: 'daily' | 'weekly' | 'monthly'): Promise<void> {
  const updates: Record<string, bigint> = {};

  if (period === 'daily') {
    updates.burnedToday = BigInt(0);
  } else if (period === 'weekly') {
    updates.burnedThisWeek = BigInt(0);
  } else if (period === 'monthly') {
    updates.burnedThisMonth = BigInt(0);
  }

  await prisma.globalStats.update({
    where: { id: 'global' },
    data: updates,
  });
}

/**
 * Get current burn statistics from database
 */
export async function getBurnStats(): Promise<{
  totalBurned: string;
  burnedToday: string;
  burnedThisWeek: string;
  burnedThisMonth: string;
  supplyRemaining: string;
  percentBurned: string;
  burnRate: number;
  totalSupply: number;
  recentBurns: Array<{ amount: string; timestamp: number; txHash?: string | null }>;
}> {
  try {
    // Get global stats
    const globalStats = await prisma.globalStats.findUnique({
      where: { id: 'global' },
    });

    // Get recent burns for burn rate calculation
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentBurns = await prisma.burnRecord.findMany({
      where: {
        createdAt: { gte: oneDayAgo },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    // Calculate burn rate (tokens per hour based on last 24h)
    const totalRecentBurn = recentBurns.reduce(
      (sum, b) => sum + Number(b.amount),
      0
    );
    const burnRate = totalRecentBurn / 24;

    const totalBurned = globalStats?.totalBurned ?? BigInt(0);
    const supplyRemaining = BigInt(PYRE_TOKEN.totalSupply) - totalBurned;
    const percentBurned = (Number(totalBurned) / PYRE_TOKEN.totalSupply) * 100;

    // Get last 10 burns for display
    const lastTenBurns = await prisma.burnRecord.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return {
      totalBurned: (globalStats?.totalBurned ?? BigInt(0)).toString(),
      burnedToday: (globalStats?.burnedToday ?? BigInt(0)).toString(),
      burnedThisWeek: (globalStats?.burnedThisWeek ?? BigInt(0)).toString(),
      burnedThisMonth: (globalStats?.burnedThisMonth ?? BigInt(0)).toString(),
      supplyRemaining: supplyRemaining.toString(),
      percentBurned: percentBurned.toFixed(4),
      burnRate: Math.floor(burnRate),
      totalSupply: PYRE_TOKEN.totalSupply,
      recentBurns: lastTenBurns.map((b) => ({
        amount: b.amount.toString(),
        timestamp: b.createdAt.getTime(),
        txHash: b.txHash,
      })),
    };
  } catch (error) {
    console.error('Failed to get burn stats:', error);
    // Return zero values if database is unavailable
    return {
      totalBurned: '0',
      burnedToday: '0',
      burnedThisWeek: '0',
      burnedThisMonth: '0',
      supplyRemaining: PYRE_TOKEN.totalSupply.toString(),
      percentBurned: '0.0000',
      burnRate: 0,
      totalSupply: PYRE_TOKEN.totalSupply,
      recentBurns: [],
    };
  }
}

/**
 * Calculate burn amount from payment
 */
export function calculateBurnAmount(paymentAmount: number | bigint): bigint {
  const amount =
    typeof paymentAmount === 'number'
      ? BigInt(Math.floor(paymentAmount))
      : paymentAmount;
  return (amount * BigInt(PAYMENT_DISTRIBUTION.burn)) / BigInt(100);
}

/**
 * Calculate full payment distribution
 */
export function calculateDistribution(paymentAmount: number | bigint): {
  burn: bigint;
  provider: bigint;
  holders: bigint;
  treasury: bigint;
  total: bigint;
} {
  const amount =
    typeof paymentAmount === 'number'
      ? BigInt(Math.floor(paymentAmount))
      : paymentAmount;

  if (!amount || amount <= BigInt(0)) {
    return {
      burn: BigInt(0),
      provider: BigInt(0),
      holders: BigInt(0),
      treasury: BigInt(0),
      total: BigInt(0),
    };
  }

  return {
    burn: (amount * BigInt(PAYMENT_DISTRIBUTION.burn)) / BigInt(100),
    provider: (amount * BigInt(PAYMENT_DISTRIBUTION.provider)) / BigInt(100),
    holders: (amount * BigInt(PAYMENT_DISTRIBUTION.holders)) / BigInt(100),
    treasury: (amount * BigInt(PAYMENT_DISTRIBUTION.treasury)) / BigInt(100),
    total: amount,
  };
}

/**
 * Get burn projection based on current activity
 */
export async function getBurnProjection(): Promise<{
  dailyBurn: number;
  weeklyBurn: number;
  monthlyBurn: number;
  yearlyBurn: number;
  yearsToHalfSupply: string;
}> {
  try {
    // Get average daily burns from last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentStats = await prisma.dailyBurnStats.findMany({
      where: {
        date: { gte: sevenDaysAgo },
      },
    });

    const totalBurnLast7Days = recentStats.reduce(
      (sum, day) => sum + Number(day.totalBurned),
      0
    );
    const avgDailyBurn = totalBurnLast7Days / Math.max(recentStats.length, 1);

    const globalStats = await prisma.globalStats.findUnique({
      where: { id: 'global' },
    });

    const currentSupply =
      PYRE_TOKEN.totalSupply - Number(globalStats?.totalBurned ?? BigInt(0));
    const yearlyBurn = avgDailyBurn * 365;
    const yearsToHalfSupply =
      yearlyBurn > 0 ? currentSupply / 2 / yearlyBurn : Infinity;

    return {
      dailyBurn: Math.floor(avgDailyBurn),
      weeklyBurn: Math.floor(avgDailyBurn * 7),
      monthlyBurn: Math.floor(avgDailyBurn * 30),
      yearlyBurn: Math.floor(yearlyBurn),
      yearsToHalfSupply: isFinite(yearsToHalfSupply)
        ? yearsToHalfSupply.toFixed(2)
        : 'N/A',
    };
  } catch (error) {
    console.error('Failed to get burn projection:', error);
    return {
      dailyBurn: 0,
      weeklyBurn: 0,
      monthlyBurn: 0,
      yearlyBurn: 0,
      yearsToHalfSupply: 'N/A',
    };
  }
}

/**
 * Get historical burn data for charts
 */
export async function getBurnHistory(days: number = 30): Promise<
  Array<{
    date: string;
    burned: number;
    apiCalls: number;
  }>
> {
  try {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const dailyStats = await prisma.dailyBurnStats.findMany({
      where: {
        date: { gte: startDate },
      },
      orderBy: { date: 'asc' },
    });

    return dailyStats.map((day) => ({
      date: day.date.toISOString().split('T')[0],
      burned: Number(day.totalBurned),
      apiCalls: day.apiCalls,
    }));
  } catch (error) {
    console.error('Failed to get burn history:', error);
    return [];
  }
}
