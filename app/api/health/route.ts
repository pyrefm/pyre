import { NextResponse } from 'next/server';

// Prevent static generation
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'PYRE API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
}
