import { NextResponse } from 'next/server';
import { getBurnStats, getBurnProjection, getBurnHistory } from '@/lib/token/burn';

// Prevent static generation - this route needs database access
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [stats, projection, history] = await Promise.all([
      getBurnStats(),
      getBurnProjection(),
      getBurnHistory(30),
    ]);

    return NextResponse.json({
      success: true,
      data: stats,
      projection,
      history,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Burn stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch burn stats' },
      { status: 500 }
    );
  }
}
