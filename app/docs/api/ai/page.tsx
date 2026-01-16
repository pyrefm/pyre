import Link from 'next/link';
import { Sparkles, MessageSquare, Image, Languages, Volume2 } from 'lucide-react';

const endpoints = [
  {
    name: 'Chat Completion',
    path: '/api/ai/chat',
    method: 'POST',
    price: 0.05,
    icon: MessageSquare,
    description: 'Get AI-powered responses to your messages',
    params: [
      { name: 'message', type: 'string', required: true, desc: 'The message to send to the AI' },
      { name: 'model', type: 'string', required: false, desc: 'AI model to use (default: gpt-4)' },
      { name: 'temperature', type: 'number', required: false, desc: 'Creativity level 0-1 (default: 0.7)' },
    ],
    example: {
      request: { message: 'Explain quantum computing simply', model: 'gpt-4' },
      response: {
        success: true,
        data: {
          message: 'Quantum computing uses quantum mechanics principles...',
          model: 'gpt-4',
          tokens: 150,
        },
      },
    },
  },
  {
    name: 'Image Generation',
    path: '/api/ai/image',
    method: 'POST',
    price: 0.10,
    icon: Image,
    description: 'Generate images from text descriptions',
    params: [
      { name: 'prompt', type: 'string', required: true, desc: 'Description of the image to generate' },
      { name: 'size', type: 'string', required: false, desc: 'Image size: 256x256, 512x512, 1024x1024' },
      { name: 'style', type: 'string', required: false, desc: 'Style: realistic, artistic, cartoon' },
    ],
    example: {
      request: { prompt: 'A futuristic city at sunset', size: '512x512' },
      response: {
        success: true,
        data: {
          imageUrl: 'https://...',
          prompt: 'A futuristic city at sunset',
          size: '512x512',
        },
      },
    },
  },
  {
    name: 'Translation',
    path: '/api/ai/translate',
    method: 'POST',
    price: 0.03,
    icon: Languages,
    description: 'Translate text between languages',
    params: [
      { name: 'text', type: 'string', required: true, desc: 'Text to translate' },
      { name: 'from', type: 'string', required: false, desc: 'Source language (auto-detect if not provided)' },
      { name: 'to', type: 'string', required: true, desc: 'Target language code (en, es, fr, etc.)' },
    ],
    example: {
      request: { text: 'Hello, how are you?', to: 'es' },
      response: {
        success: true,
        data: {
          original: 'Hello, how are you?',
          translated: '¡Hola, cómo estás?',
          from: 'en',
          to: 'es',
        },
      },
    },
  },
  {
    name: 'Text-to-Speech',
    path: '/api/ai/tts',
    method: 'POST',
    price: 0.08,
    icon: Volume2,
    description: 'Convert text to natural-sounding speech',
    params: [
      { name: 'text', type: 'string', required: true, desc: 'Text to convert to speech' },
      { name: 'voice', type: 'string', required: false, desc: 'Voice ID: male, female, neutral' },
      { name: 'speed', type: 'number', required: false, desc: 'Speech speed 0.5-2.0 (default: 1.0)' },
    ],
    example: {
      request: { text: 'Welcome to PYRE', voice: 'female' },
      response: {
        success: true,
        data: {
          audioUrl: 'https://...',
          duration: 2.5,
          format: 'mp3',
        },
      },
    },
  },
];

export default function AIEndpointsPage() {
  return (
    <div className="prose prose-invert max-w-none">
      {/* Hero */}
      <div className="not-prose mb-8">
        <div className="flex items-center gap-2 text-pyre-primary text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          <span>API Reference</span>
        </div>
        <h1 className="text-4xl font-bold font-heading mb-4">AI Endpoints</h1>
        <p className="text-xl text-text-secondary">
          Powerful AI capabilities accessible with $PYRE token payments.
        </p>
      </div>

      {/* Endpoints */}
      <div className="not-prose space-y-8">
        {endpoints.map((endpoint) => {
          const Icon = endpoint.icon;
          return (
            <div
              key={endpoint.path}
              id={endpoint.path.split('/').pop()}
              className="p-6 rounded-xl bg-dark-card border border-dark-border"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-pyre-primary/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-pyre-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{endpoint.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 rounded bg-accent/20 text-accent text-xs font-mono">
                        {endpoint.method}
                      </span>
                      <span className="font-mono text-sm text-text-secondary">{endpoint.path}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-burn">${endpoint.price.toFixed(2)}</div>
                  <div className="text-xs text-text-muted">per request</div>
                </div>
              </div>

              <p className="text-text-secondary mb-4">{endpoint.description}</p>

              {/* Parameters */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-text-muted mb-2">Parameters</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-dark-border">
                        <th className="text-left py-2 pr-4 text-text-muted font-medium">Name</th>
                        <th className="text-left py-2 pr-4 text-text-muted font-medium">Type</th>
                        <th className="text-left py-2 pr-4 text-text-muted font-medium">Required</th>
                        <th className="text-left py-2 text-text-muted font-medium">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {endpoint.params.map((param) => (
                        <tr key={param.name} className="border-b border-dark-border/50">
                          <td className="py-2 pr-4 font-mono text-burn">{param.name}</td>
                          <td className="py-2 pr-4 font-mono text-text-secondary">{param.type}</td>
                          <td className="py-2 pr-4">
                            {param.required ? (
                              <span className="text-accent">Yes</span>
                            ) : (
                              <span className="text-text-muted">No</span>
                            )}
                          </td>
                          <td className="py-2 text-text-secondary">{param.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Example */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-text-muted mb-2">Request</h4>
                  <div className="bg-dark-elevated rounded-lg border border-dark-border overflow-hidden">
                    <pre className="p-3 overflow-x-auto text-xs">
                      <code>{JSON.stringify(endpoint.example.request, null, 2)}</code>
                    </pre>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-text-muted mb-2">Response</h4>
                  <div className="bg-dark-elevated rounded-lg border border-dark-border overflow-hidden">
                    <pre className="p-3 overflow-x-auto text-xs">
                      <code>{JSON.stringify(endpoint.example.response, null, 2)}</code>
                    </pre>
                  </div>
                </div>
              </div>

              {/* Try It */}
              <div className="mt-4 pt-4 border-t border-dark-border">
                <Link
                  href="/playground"
                  className="text-sm text-pyre-primary hover:underline"
                >
                  Try it in the Playground →
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* More Endpoints */}
      <div className="not-prose mt-8">
        <h2 className="text-xl font-bold mb-4">More Endpoints</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            href="/docs/api/data"
            className="p-4 rounded-lg bg-dark-elevated border border-dark-border hover:border-pyre-primary transition-colors"
          >
            <h4 className="font-semibold mb-1">Data Endpoints →</h4>
            <p className="text-sm text-text-secondary">Crypto, weather, stocks, news</p>
          </Link>
          <Link
            href="/docs/api/tools"
            className="p-4 rounded-lg bg-dark-elevated border border-dark-border hover:border-pyre-primary transition-colors"
          >
            <h4 className="font-semibold mb-1">Tool Endpoints →</h4>
            <p className="text-sm text-text-secondary">QR codes, screenshots, PDFs</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
