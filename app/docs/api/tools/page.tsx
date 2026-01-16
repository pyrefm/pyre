import Link from 'next/link';
import { Wrench, QrCode, Camera, FileText } from 'lucide-react';

const endpoints = [
  {
    name: 'QR Code Generator',
    path: '/api/tools/qrcode',
    method: 'POST',
    price: 0.005,
    icon: QrCode,
    description: 'Generate QR codes from any text or URL',
    params: [
      { name: 'data', type: 'string', required: true, desc: 'Text or URL to encode' },
      { name: 'size', type: 'number', required: false, desc: 'Image size in pixels (default: 256)' },
      { name: 'format', type: 'string', required: false, desc: 'Output format: png, svg' },
    ],
    example: {
      request: { data: 'https://pyrefm.xyz', size: 256 },
      response: {
        success: true,
        data: {
          qrCode: 'data:image/png;base64,...',
          originalData: 'https://pyrefm.xyz',
          size: '256x256',
        },
      },
    },
  },
  {
    name: 'Screenshot Capture',
    path: '/api/tools/screenshot',
    method: 'POST',
    price: 0.05,
    icon: Camera,
    description: 'Capture screenshots of any website',
    params: [
      { name: 'url', type: 'string', required: true, desc: 'Website URL to capture' },
      { name: 'width', type: 'number', required: false, desc: 'Viewport width (default: 1280)' },
      { name: 'height', type: 'number', required: false, desc: 'Viewport height (default: 720)' },
      { name: 'fullPage', type: 'boolean', required: false, desc: 'Capture full page (default: false)' },
    ],
    example: {
      request: { url: 'https://pyrefm.xyz', width: 1280, fullPage: false },
      response: {
        success: true,
        data: {
          imageUrl: 'https://...',
          width: 1280,
          height: 720,
          format: 'png',
        },
      },
    },
  },
  {
    name: 'PDF Generation',
    path: '/api/tools/pdf',
    method: 'POST',
    price: 0.08,
    icon: FileText,
    description: 'Generate PDFs from HTML content or URLs',
    params: [
      { name: 'html', type: 'string', required: false, desc: 'HTML content to convert' },
      { name: 'url', type: 'string', required: false, desc: 'URL to convert to PDF' },
      { name: 'format', type: 'string', required: false, desc: 'Paper format: A4, Letter, etc.' },
      { name: 'margin', type: 'object', required: false, desc: 'Page margins' },
    ],
    example: {
      request: { url: 'https://pyrefm.xyz/docs', format: 'A4' },
      response: {
        success: true,
        data: {
          pdfUrl: 'https://...',
          pages: 5,
          size: '245KB',
        },
      },
    },
  },
];

export default function ToolsEndpointsPage() {
  return (
    <div className="prose prose-invert max-w-none">
      {/* Hero */}
      <div className="not-prose mb-8">
        <div className="flex items-center gap-2 text-tier-gold text-sm font-medium mb-4">
          <Wrench className="w-4 h-4" />
          <span>API Reference</span>
        </div>
        <h1 className="text-4xl font-bold font-heading mb-4">Tool Endpoints</h1>
        <p className="text-xl text-text-secondary">
          Utility APIs for common tasks like QR codes, screenshots, and PDF generation.
        </p>
      </div>

      {/* Endpoints */}
      <div className="not-prose space-y-8">
        {endpoints.map((endpoint) => {
          const Icon = endpoint.icon;
          return (
            <div
              key={endpoint.path}
              className="p-6 rounded-xl bg-dark-card border border-dark-border"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-tier-gold/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-tier-gold" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{endpoint.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 rounded bg-pyre-primary/20 text-pyre-primary text-xs font-mono">
                        {endpoint.method}
                      </span>
                      <span className="font-mono text-sm text-text-secondary">{endpoint.path}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-burn">${endpoint.price.toFixed(3)}</div>
                  <div className="text-xs text-text-muted">per request</div>
                </div>
              </div>

              <p className="text-text-secondary mb-4">{endpoint.description}</p>

              {/* Parameters */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-text-muted mb-2">Body Parameters</h4>
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
                  <h4 className="text-sm font-semibold text-text-muted mb-2">Request Body</h4>
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
            </div>
          );
        })}
      </div>

      {/* More Endpoints */}
      <div className="not-prose mt-8">
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            href="/docs/api/data"
            className="p-4 rounded-lg bg-dark-elevated border border-dark-border hover:border-pyre-primary transition-colors"
          >
            <h4 className="font-semibold mb-1">← Data Endpoints</h4>
            <p className="text-sm text-text-secondary">Crypto, weather, stocks, news</p>
          </Link>
          <Link
            href="/docs/sdk/javascript"
            className="p-4 rounded-lg bg-dark-elevated border border-dark-border hover:border-pyre-primary transition-colors"
          >
            <h4 className="font-semibold mb-1">JavaScript SDK →</h4>
            <p className="text-sm text-text-secondary">Easy integration with SDK</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
