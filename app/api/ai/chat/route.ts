import { NextRequest, NextResponse } from 'next/server';
import { withTokenPayment } from '@/lib/payments/middleware';
import { chatCompletion, isOpenAIConfigured } from '@/lib/ai/openai';

// Prevent static generation
export const dynamic = 'force-dynamic';

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
    const { message, model = 'gpt-4o-mini', systemPrompt, maxTokens, temperature } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (typeof message !== 'string' || message.length > 10000) {
      return NextResponse.json(
        { error: 'Message must be a string with max 10000 characters' },
        { status: 400 }
      );
    }

    const result = await chatCompletion(message, {
      model,
      systemPrompt,
      maxTokens,
      temperature,
    });

    return NextResponse.json({
      success: true,
      data: {
        message,
        response: result.response,
        model: result.model,
        tokens: result.tokens,
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to process chat request';
    
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
// Price: $0.05 per request
export const POST = withTokenPayment(handler, 0.05);
