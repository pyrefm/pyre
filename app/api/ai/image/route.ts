import { NextRequest, NextResponse } from 'next/server';
import { withTokenPayment } from '@/lib/payments/middleware';
import { generateImage, isOpenAIConfigured } from '@/lib/ai/openai';

async function handler(req: NextRequest) {
  try {
    // Check if OpenAI is configured
    if (!isOpenAIConfigured()) {
      return NextResponse.json(
        {
          error: 'AI service not configured',
          code: 'SERVICE_UNAVAILABLE',
          message: 'OpenAI API key is not configured. Please contact support.',
        },
        { status: 503 }
      );
    }

    const body = await req.json();
    const { prompt, size = '1024x1024', quality = 'standard', style = 'vivid' } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    if (typeof prompt !== 'string' || prompt.length > 4000) {
      return NextResponse.json(
        { error: 'Prompt must be a string with max 4000 characters' },
        { status: 400 }
      );
    }

    // Validate size parameter
    const validSizes = ['1024x1024', '1024x1792', '1792x1024'];
    if (!validSizes.includes(size)) {
      return NextResponse.json(
        { error: `Size must be one of: ${validSizes.join(', ')}` },
        { status: 400 }
      );
    }

    const result = await generateImage(prompt, {
      size: size as '1024x1024' | '1024x1792' | '1792x1024',
      quality: quality as 'standard' | 'hd',
      style: style as 'vivid' | 'natural',
    });

    return NextResponse.json({
      success: true,
      data: {
        prompt,
        imageUrl: result.imageUrl,
        revisedPrompt: result.revisedPrompt,
        model: result.model,
        size,
        quality,
        style,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Image generation error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Failed to generate image';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

// Wrap with token payment middleware
// Price: $0.10 per request
export const POST = withTokenPayment(handler, 0.10);
