import { NextRequest, NextResponse } from 'next/server';
import { withTokenPayment } from '@/lib/payments/middleware';
import QRCode from 'qrcode';

// Prevent static generation
export const dynamic = 'force-dynamic';

async function handler(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      data, 
      size = 256, 
      darkColor = '#000000',
      lightColor = '#FFFFFF',
      margin = 1,
    } = body;

    if (!data) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Data is required',
          example: { data: 'https://pyrefm.xyz', size: 256 }
        },
        { status: 400 }
      );
    }

    // Generate real QR code using qrcode library (no API key needed!)
    const qrCodeDataURL = await QRCode.toDataURL(data, {
      width: parseInt(size.toString()),
      margin: margin,
      color: {
        dark: darkColor,
        light: lightColor,
      },
      errorCorrectionLevel: 'M',
    });

    return NextResponse.json({
      success: true,
      data: {
        qrCode: qrCodeDataURL,
        originalData: data,
        size: `${size}x${size}`,
        options: {
          darkColor,
          lightColor,
          margin,
        },
        timestamp: new Date().toISOString(),
        source: 'qrcode library (Real Generation)',
      },
    });
  } catch (error) {
    console.error('QR Code generation error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to generate QR code',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Price: $0.005 per request - 30% ($0.0015) burned!
export const POST = withTokenPayment(handler, 0.005);
