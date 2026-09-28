import { setRequestLocale } from 'next-intl/server';

import { envConfigs } from '@/config';
import { Faq, ModelRows, QuickRouterBrand } from '@/shared/blocks/quickrouter/content';
import { QuickRouterHome } from '@/shared/blocks/quickrouter/sections';
import { getMetadata } from '@/shared/lib/seo';

export const revalidate = 3600;

export const generateMetadata = getMetadata({
  title:
    'QuickRouter.AI - LLM API gateway for OpenAI, Claude, Gemini, DeepSeek and Grok',
  description:
    'One OpenAI-compatible base URL and API key for 400+ large language models. High-speed gateway, list-price usage, free credit on signup, Claude Code and Cursor ready.',
  keywords:
    'llm api gateway, openai api, claude api, gemini api, deepseek api, grok api, openai compatible base url, claude code api key, cursor api, one api key',
  canonicalUrl: '/',
});

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const appUrl = envConfigs.app_url;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${appUrl}/#organization`,
        name: QuickRouterBrand.name,
        url: appUrl,
        email: QuickRouterBrand.support,
        description:
          'LLM API gateway offering one OpenAI-compatible endpoint for OpenAI, Anthropic, Google, DeepSeek, xAI and 400+ further models.',
      },
      {
        '@type': 'WebSite',
        '@id': `${appUrl}/#website`,
        url: appUrl,
        name: QuickRouterBrand.name,
        inLanguage: 'en',
        publisher: { '@id': `${appUrl}/#organization` },
      },
      {
        '@type': 'SoftwareApplication',
        name: QuickRouterBrand.name,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Web, macOS, Windows, Linux',
        url: appUrl,
        description:
          'OpenAI-compatible API gateway for 400+ large language models with usage-based billing.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          description: 'Free starter credit, then usage-based list pricing.',
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: Faq.map(([question, answer]) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer },
        })),
      },
      {
        '@type': 'ItemList',
        name: 'Model list prices per 1M tokens',
        itemListElement: ModelRows.map((row, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: `${row.vendor} ${row.model}`,
          description: `Context ${row.context}, input ${row.input}, output ${row.output} per 1M tokens`,
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <QuickRouterHome />
    </>
  );
}
