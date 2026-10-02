import { MetadataRoute } from 'next';

import { envConfigs } from '@/config';

export default function robots(): MetadataRoute.Robots {
  const appUrl = envConfigs.app_url;

  const privatePaths = [
    '/*?*q=',
    '/settings/*',
    '/activity/*',
    '/admin/*',
    '/api/*',
    '/sign-in',
    '/sign-up',
    '/verify-email',
    '/no-permission',
  ];

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: privatePaths,
      },
      {
        // Answer engines that fetch pages for citation and grounding.
        // Explicitly allowed so a future blanket rule cannot cut them off.
        userAgent: [
          'GPTBot',
          'OAI-SearchBot',
          'ChatGPT-User',
          'ClaudeBot',
          'Claude-User',
          'anthropic-ai',
          'PerplexityBot',
          'Perplexity-User',
          'Google-Extended',
          'Applebot-Extended',
          'Bingbot',
        ],
        allow: '/',
        disallow: [
          '/settings/*',
          '/activity/*',
          '/admin/*',
          '/api/*',
          '/sign-in',
          '/sign-up',
        ],
      },
    ],
    sitemap: `${appUrl}/sitemap.xml`,
  };
}
