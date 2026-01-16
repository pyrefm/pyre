/**
 * OpenAI Integration
 * Provides chat completion and image generation services
 */

const OPENAI_API_URL = 'https://api.openai.com/v1';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionResponse {
  id: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface ImageGenerationResponse {
  created: number;
  data: Array<{
    url?: string;
    b64_json?: string;
    revised_prompt?: string;
  }>;
}

/**
 * Check if OpenAI API key is configured
 */
export function isOpenAIConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.length > 20;
}

/**
 * Get OpenAI API key
 */
function getApiKey(): string {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }
  return apiKey;
}

/**
 * Chat completion using OpenAI API
 */
export async function chatCompletion(
  message: string,
  options: {
    model?: string;
    systemPrompt?: string;
    maxTokens?: number;
    temperature?: number;
  } = {}
): Promise<{
  response: string;
  model: string;
  tokens: {
    prompt: number;
    completion: number;
    total: number;
  };
}> {
  const {
    model = 'gpt-4o-mini',
    systemPrompt = 'You are a helpful assistant for the PYRE API platform.',
    maxTokens = 1000,
    temperature = 0.7,
  } = options;

  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: message },
  ];

  const response = await fetch(`${OPENAI_API_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getApiKey()}`,
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: maxTokens,
      temperature,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `OpenAI API error: ${response.status}`);
  }

  const data: ChatCompletionResponse = await response.json();

  return {
    response: data.choices[0]?.message?.content || '',
    model: model,
    tokens: {
      prompt: data.usage.prompt_tokens,
      completion: data.usage.completion_tokens,
      total: data.usage.total_tokens,
    },
  };
}

/**
 * Image generation using OpenAI DALL-E
 */
export async function generateImage(
  prompt: string,
  options: {
    model?: string;
    size?: '1024x1024' | '1024x1792' | '1792x1024';
    quality?: 'standard' | 'hd';
    style?: 'vivid' | 'natural';
  } = {}
): Promise<{
  imageUrl: string;
  revisedPrompt: string;
  model: string;
}> {
  const {
    model = 'dall-e-3',
    size = '1024x1024',
    quality = 'standard',
    style = 'vivid',
  } = options;

  const response = await fetch(`${OPENAI_API_URL}/images/generations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getApiKey()}`,
    },
    body: JSON.stringify({
      model,
      prompt,
      n: 1,
      size,
      quality,
      style,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `OpenAI API error: ${response.status}`);
  }

  const data: ImageGenerationResponse = await response.json();
  const imageData = data.data[0];

  if (!imageData?.url) {
    throw new Error('No image URL in response');
  }

  return {
    imageUrl: imageData.url,
    revisedPrompt: imageData.revised_prompt || prompt,
    model,
  };
}
