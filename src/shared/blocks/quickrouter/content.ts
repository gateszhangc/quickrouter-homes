export const QuickRouterBrand = {
  name: 'QuickRouter.AI',
  domain: 'quickrouter.homes',
  baseUrl: 'https://api.quickrouter.homes/v1',
  claudeBaseUrl: 'https://api.quickrouter.homes',
  support: 'support@quickrouter.homes',
  tagline: 'One API key for 400+ large language models',
};

export const QuickRouterNav = [
  { label: 'Home', href: '/' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Model prices', href: '/#model-prices' },
  { label: 'Setup guide', href: '/#setup' },
  { label: 'FAQ', href: '/#faq' },
] as const;

export const HeroChips = [
  'One API key, every model',
  'OpenAI SDK compatible',
  'No overseas card required',
] as const;

export const HeroStats = [
  ['400+', 'models behind one endpoint'],
  ['99.9%', 'gateway uptime target'],
  ['3 min', 'from signup to first call'],
  ['1', 'base URL to remember'],
] as const;

export const Vendors = [
  'OpenAI',
  'Anthropic',
  'Google',
  'DeepSeek',
  'xAI',
  'Qwen',
  'Meta',
  'Mistral',
  'Zhipu',
  'Moonshot',
  'MiniMax',
  'ByteDance',
  'Kling',
  'Vidu',
] as const;

/** Vendor rail logos mirrored from the reference site. Names without an entry stay text-only. */
export const VendorLogos: Record<string, string> = {
  OpenAI: '/images/openai.png',
  Anthropic: '/images/claude.png',
  Google: '/images/google.png',
  DeepSeek: '/images/deepseek.png',
  xAI: '/images/grok.png',
  Meta: '/images/meta.png',
  Mistral: '/images/mistral.png',
  Moonshot: '/images/moonshot.png',
  MiniMax: '/images/minimax.png',
  Vidu: '/images/vidu.png',
};

export const ToolChips = [
  'Claude Code',
  'Codex',
  'Cursor',
  'opencode',
  'Cherry Studio',
  'Trae',
  'OpenClaw',
  'Hermes',
] as const;

/** Tool chip logos mirrored from the reference site. Codex has no asset and stays text-only. */
export const ToolLogos: Record<string, string> = {
  'Claude Code': '/images/claude.png',
  Cursor: '/images/brand_logos/cursor.svg',
  opencode: '/images/brand_logos/opencode.svg',
  'Cherry Studio': '/images/brand_logos/cherrystudio.svg',
  Trae: '/images/brand_logos/trae.svg',
  OpenClaw: '/images/openclaw-bot.png',
  Hermes: '/images/brand_logos/hermes.png',
};

export const PricingCards = [
  {
    name: 'Pay as you go',
    subtitle: 'Top up, then spend per token',
    price: 'Usage based',
    unit: 'no monthly fee',
    featured: false,
    badge: '',
    features: [
      'Billed from the list price of every model',
      'Card, wallet and crypto top-ups',
      'Per-request detail in the console',
      'Balance works across all 400+ models',
    ],
    cta: { label: 'Top up balance', href: '/pricing' },
  },
  {
    name: 'Starter',
    subtitle: 'From $19 / month',
    price: '$19',
    unit: 'per month',
    featured: true,
    badge: 'Recommended',
    features: [
      'One API key across 400+ models',
      'OpenAI-compatible base URL',
      'Usage billed at upstream list price',
      'Cancel any time from the console',
    ],
    cta: { label: 'Choose Starter', href: '/pricing' },
  },
  {
    name: 'Enterprise',
    subtitle: 'Volume, invoicing and support',
    price: 'Custom',
    unit: 'talk to us',
    featured: false,
    badge: '',
    features: [
      'Volume discounts on every model',
      'Invoicing and annual contracts',
      'Dedicated routing and rate limits',
      'Priority support channel',
    ],
    cta: { label: 'Contact sales', href: 'mailto:support@quickrouter.homes' },
  },
] as const;

export const ModelRows: {
  vendor: string;
  model: string;
  context: string;
  input: string;
  output: string;
}[] = [
  { vendor: 'OpenAI', model: 'GPT-5', context: '400K', input: '$1.25', output: '$10.00' },
  { vendor: 'OpenAI', model: 'GPT-5 mini', context: '400K', input: '$0.25', output: '$2.00' },
  { vendor: 'Anthropic', model: 'Claude Sonnet 4.5', context: '200K', input: '$3.00', output: '$15.00' },
  { vendor: 'Anthropic', model: 'Claude Opus 4.1', context: '200K', input: '$15.00', output: '$75.00' },
  { vendor: 'Anthropic', model: 'Claude Haiku 4.5', context: '200K', input: '$1.00', output: '$5.00' },
  { vendor: 'Google', model: 'Gemini 2.5 Pro', context: '1M', input: '$1.25', output: '$10.00' },
  { vendor: 'Google', model: 'Gemini 2.5 Flash', context: '1M', input: '$0.30', output: '$2.50' },
  { vendor: 'DeepSeek', model: 'DeepSeek V3.2', context: '128K', input: '$0.28', output: '$0.42' },
  { vendor: 'DeepSeek', model: 'DeepSeek R1', context: '128K', input: '$0.55', output: '$2.19' },
  { vendor: 'xAI', model: 'Grok 4', context: '256K', input: '$3.00', output: '$15.00' },
  { vendor: 'xAI', model: 'Grok 4 Fast', context: '2M', input: '$0.20', output: '$0.50' },
  { vendor: 'Qwen', model: 'Qwen3 Max', context: '256K', input: '$1.20', output: '$6.00' },
  { vendor: 'Zhipu', model: 'GLM-4.6', context: '200K', input: '$0.60', output: '$2.20' },
  { vendor: 'Moonshot', model: 'Kimi K2', context: '256K', input: '$0.60', output: '$2.50' },
  { vendor: 'MiniMax', model: 'MiniMax M2', context: '200K', input: '$0.30', output: '$1.20' },
  { vendor: 'Mistral', model: 'Mistral Large 3', context: '128K', input: '$2.00', output: '$6.00' },
  { vendor: 'Meta', model: 'Llama 4 Maverick', context: '1M', input: '$0.27', output: '$0.85' },
  { vendor: 'ByteDance', model: 'Seedance 2.0', context: 'Video', input: 'per clip', output: 'per clip' },
] as const;

export const ModelVendors = [
  { name: 'OpenAI', count: '24 models' },
  { name: 'Anthropic', count: '14 models' },
  { name: 'Google', count: '21 models' },
  { name: 'DeepSeek', count: '9 models' },
  { name: 'xAI', count: '8 models' },
  { name: 'Qwen', count: '26 models' },
  { name: 'Meta', count: '18 models' },
  { name: 'Mistral', count: '15 models' },
] as const;

export const QuickStartSteps = [
  {
    step: '01',
    title: 'Create an account',
    copy: 'Sign up with a single click. Your starter credit lands in the console immediately.',
  },
  {
    step: '02',
    title: 'Copy your API key',
    copy: 'Open token management in the console, add a token and copy the key once.',
  },
  {
    step: '03',
    title: 'Point your base URL',
    copy: 'Swap the base URL in the SDK or dev tool you already use. Nothing else changes.',
  },
  {
    step: '04',
    title: 'Ship the first call',
    copy: 'Send one request, confirm the response and roll the key into staging.',
  },
] as const;

export const Showcases = [
  {
    title: 'Release night',
    model: 'Seedance 2.5',
    vendor: 'ByteDance',
    kind: 'Video',
    poster: '/videos/creative-studio/seedance25-stage-v1.jpg',
    video: '/videos/creative-studio/seedance25-stage-v2.mp4',
  },
  {
    title: 'Through the painting',
    model: 'Seedance 2.0',
    vendor: 'ByteDance',
    kind: 'Video',
    poster: '/videos/creative-studio/seedance20-demo-v1.jpg',
    video: '/videos/creative-studio/seedance20-demo-v2.mp4',
  },
  {
    title: 'Coffee shop detour',
    model: 'Vidu Q3 Pro',
    vendor: 'Shengshu',
    kind: 'Video',
    poster: '/videos/creative-studio/vidu-demo-v1.jpg',
    video: '/videos/creative-studio/vidu-demo-v2.mp4',
  },
  {
    title: 'Breakfast in the garden',
    model: 'Kling 3.0 Turbo',
    vendor: 'Kuaishou',
    kind: 'Video',
    poster: '/videos/creative-studio/kling-official-v1.jpg',
    video: '/videos/creative-studio/kling-official-v2.mp4',
  },
  {
    title: 'Knights of the forest',
    model: 'Grok Imagine Video',
    vendor: 'xAI',
    kind: 'Video',
    poster: '/videos/creative-studio/grok-knight-v1.jpg',
    video: '/videos/creative-studio/grok-knight-v2.mp4',
  },
] as const;

export const DevTools = [
  {
    name: 'Claude Code',
    hint: 'CLI',
    apiKey: 'Console → Token management → copy the key',
    baseUrl: QuickRouterBrand.claudeBaseUrl,
    model: 'claude-sonnet-4-5',
    snippet: `export ANTHROPIC_BASE_URL="${QuickRouterBrand.claudeBaseUrl}"
export ANTHROPIC_AUTH_TOKEN="sk-qr-your-key"
claude "summarise this repository"`,
  },
  {
    name: 'Cursor',
    hint: 'IDE',
    apiKey: 'Settings → Models → OpenAI API key',
    baseUrl: `${QuickRouterBrand.baseUrl}`,
    model: 'gpt-5',
    snippet: `Base URL: ${QuickRouterBrand.baseUrl}
API key:  sk-qr-your-key
Model:    gpt-5`,
  },
  {
    name: 'Codex',
    hint: 'CLI',
    apiKey: 'Console → Token management → copy the key',
    baseUrl: `${QuickRouterBrand.baseUrl}`,
    model: 'gpt-5',
    snippet: `export OPENAI_BASE_URL="${QuickRouterBrand.baseUrl}"
export OPENAI_API_KEY="sk-qr-your-key"
codex "write the migration for this model"`,
  },
  {
    name: 'opencode',
    hint: 'CLI',
    apiKey: 'Console → Token management → copy the key',
    baseUrl: `${QuickRouterBrand.baseUrl}`,
    model: 'gpt-5-mini',
    snippet: `"provider": {
  "quickrouter": {
    "npm": "@ai-sdk/openai-compatible",
    "options": { "baseURL": "${QuickRouterBrand.baseUrl}", "apiKey": "sk-qr-your-key" }
  }
}`,
  },
  {
    name: 'Cherry Studio',
    hint: 'Desktop',
    apiKey: 'Settings → Model providers → API key',
    baseUrl: `${QuickRouterBrand.baseUrl}`,
    model: 'claude-sonnet-4-5',
    snippet: `Provider: OpenAI compatible
API host: ${QuickRouterBrand.baseUrl}
API key:  sk-qr-your-key`,
  },
  {
    name: 'Trae',
    hint: 'IDE',
    apiKey: 'Settings → AI providers → OpenAI compatible',
    baseUrl: `${QuickRouterBrand.baseUrl}`,
    model: 'deepseek-v3.2',
    snippet: `Base URL: ${QuickRouterBrand.baseUrl}
API key:  sk-qr-your-key
Model:    deepseek-v3.2`,
  },
] as const;

export const InstallSteps = [
  {
    tool: 'Claude Code',
    platform: 'macOS / Linux',
    commands: ['npm install -g @anthropic-ai/claude-code', 'claude'],
  },
  {
    tool: 'Claude Code',
    platform: 'Windows PowerShell',
    commands: [
      'npm install -g @anthropic-ai/claude-code',
      '$env:ANTHROPIC_BASE_URL="' + QuickRouterBrand.claudeBaseUrl + '"',
    ],
  },
  {
    tool: 'Codex',
    platform: 'macOS / Linux',
    commands: ['npm install -g @openai/codex', 'codex'],
  },
  {
    tool: 'Codex',
    platform: 'Windows PowerShell',
    commands: [
      'npm install -g @openai/codex',
      '$env:OPENAI_BASE_URL="' + QuickRouterBrand.baseUrl + '"',
    ],
  },
] as const;

export const Testimonials = [
  ['Alex Chen', 'Full-stack engineer', '/images/testimonials/alex-chen.webp'],
  ['Li Ming', 'AI product lead', '/images/testimonials/cartoon-dev-a.webp'],
  ['Emily Zhang', 'Technical PM', '/images/testimonials/asian-dev-b.webp'],
  [
    'Wang Yihang',
    'Automation developer',
    '/images/testimonials/cartoon-dev-b.webp',
  ],
  ['Lin Zhou', 'AI architect', ''],
  ['Chen Ruoxi', 'Indie developer', ''],
  ['Daniel Wang', 'Backend engineer', '/images/testimonials/daniel-wang.webp'],
  ['Jessica Martinez', 'Head of design', ''],
  ['Zhao Yu', 'SaaS founder', ''],
  ['Robert Taylor', 'Software architect', ''],
] as const;

export const Faq = [
  [
    'How much does it cost to start?',
    'Gateway plans start at $19 per month. Model usage is billed at the upstream list price of whichever model you call, so validating a base URL, a key and your SDK wiring costs a fraction of a cent.',
  ],
  [
    'Who do I contact when a tool will not connect?',
    'Mail support@quickrouter.homes with the tool name, the exact error and the request id when you have one. Connection problems are usually a trailing /v1 or a key that was copied with whitespace, and both take a minute to fix.',
  ],
  [
    'What should I put in the base URL field?',
    'Most tools take https://api.quickrouter.homes/v1. Claude Code is the exception: it expects https://api.quickrouter.homes without the /v1 suffix. Each card in the setup guide above shows the value to paste.',
  ],
  [
    'How do I configure Claude Code, Cursor or Codex?',
    'Open the setup guide on this page, pick your tool and copy the API key, base URL and model name into the fields listed on the card. The snippets are written for a clean install.',
  ],
  [
    'What is the first thing to do after signing up?',
    'Sign in, open token management and create an API key. Copy it once and store it in your secret manager - the console only shows the full key at creation time.',
  ],
  [
    'Is the gateway compatible with the OpenAI protocol?',
    'Yes. Requests and responses follow the OpenAI chat completions shape, so existing code usually needs only a new base URL and API key. Streaming, tools and vision inputs are supported on models that expose them.',
  ],
  [
    'How is usage billed?',
    'Usage is priced at the list price of each upstream model and drawn from your balance. Nothing is rounded up, and the console shows per-request detail so you can reconcile spend against your own logs.',
  ],
  [
    'What is an LLM API gateway?',
    'A gateway keeps one endpoint, one key and one billing relationship in front of many providers. Your code stops depending on a single vendor, and switching models becomes a one-line change instead of a new integration.',
  ],
] as const;

export const FooterColumns = [
  {
    title: 'Product',
    links: [
      { label: 'Pricing', href: '/pricing' },
      { label: 'Model prices', href: '/#model-prices' },
      { label: 'Setup guide', href: '/#setup' },
      { label: 'Plans', href: '/pricing' },
    ],
  },
  {
    title: 'Models',
    links: [
      { label: 'GPT-5 API', href: '/#models' },
      { label: 'Claude Sonnet 4.5 API', href: '/#models' },
      { label: 'Gemini 2.5 Pro API', href: '/#models' },
      { label: 'DeepSeek V3.2 API', href: '/#models' },
      { label: 'Grok 4 API', href: '/#models' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'FAQ', href: '/#faq' },
      { label: 'Claude Code setup', href: '/#setup' },
      { label: 'Cursor setup', href: '/#setup' },
      { label: 'Base URL reference', href: '/#setup' },
      { label: 'Contact support', href: 'mailto:support@quickrouter.homes' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy policy', href: '/privacy-policy' },
      { label: 'Terms of service', href: '/terms-of-service' },
      { label: 'Refund policy', href: '/refund-policy' },
    ],
  },
] as const;
