import { setRequestLocale } from 'next-intl/server';

import { envConfigs } from '@/config';
import {
  LearnDoc,
  SEO_UPDATED_ISO,
} from '@/shared/blocks/quickrouter/seo-content';
import { QuickRouterDocPage } from '@/shared/blocks/quickrouter/seo-page';
import { getMetadata } from '@/shared/lib/seo';
import {
  breadcrumbJsonLd,
  faqJsonLd,
  JsonLd,
  techArticleJsonLd,
} from '@/shared/lib/seo-schema';

export const revalidate = 3600;

export const generateMetadata = getMetadata({
  title: LearnDoc.title,
  description: LearnDoc.description,
  keywords: LearnDoc.keywords,
  canonicalUrl: `/${LearnDoc.slug}`,
});

export default async function LearnPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const appUrl = envConfigs.app_url;
  const trail = [
    { label: 'Home', href: '/' },
    { label: 'What is an LLM API gateway?', href: `/${LearnDoc.slug}` },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      breadcrumbJsonLd(appUrl, trail),
      techArticleJsonLd({
        appUrl,
        url: `/${LearnDoc.slug}`,
        headline: LearnDoc.h1,
        description: LearnDoc.description,
        dateModified: SEO_UPDATED_ISO,
        keywords: LearnDoc.keywords,
      }),
      faqJsonLd(LearnDoc.faq),
      {
        '@type': 'DefinedTerm',
        name: 'LLM API gateway',
        description: LearnDoc.intro,
        url: `${appUrl}/${LearnDoc.slug}`,
        inDefinedTermSet: {
          '@type': 'DefinedTermSet',
          name: 'QuickRouter developer glossary',
        },
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <QuickRouterDocPage
        doc={LearnDoc}
        trail={trail}
        eyebrow="Explainer"
        related={[
          {
            label: 'Model list prices',
            href: '/models',
            copy: 'Indicative per-token rates for the models people ask about most.',
          },
          {
            label: 'Claude Code setup',
            href: '/docs/claude-code',
            copy: 'A worked example using the Anthropic-style base URL.',
          },
          {
            label: 'Cursor setup',
            href: '/docs/cursor',
            copy: 'The OpenAI-style path, configured inside an editor.',
          },
        ]}
      />
    </>
  );
}
