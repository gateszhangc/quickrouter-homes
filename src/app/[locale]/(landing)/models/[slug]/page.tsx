import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { envConfigs } from '@/config';
import {
  ModelDocs,
  SEO_UPDATED_ISO,
  getModelDoc,
} from '@/shared/blocks/quickrouter/seo-content';
import { QuickRouterModelPage } from '@/shared/blocks/quickrouter/seo-page';
import { getMetadata } from '@/shared/lib/seo';
import {
  breadcrumbJsonLd,
  faqJsonLd,
  JsonLd,
  techArticleJsonLd,
} from '@/shared/lib/seo-schema';

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const doc = getModelDoc(slug);
  if (!doc) return {};

  return getMetadata({
    title: doc.title,
    description: doc.description,
    keywords: doc.keywords,
    canonicalUrl: `/models/${doc.slug}`,
  })({ params: params as Promise<{ locale: string }> });
}

export default async function ModelPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const doc = getModelDoc(slug);
  if (!doc) notFound();

  const appUrl = envConfigs.app_url;
  const trail = [
    { label: 'Home', href: '/' },
    { label: 'Model prices', href: '/models' },
    { label: doc.model },
  ];

  const sameVendor = ModelDocs.filter(
    (item) => item.vendor === doc.vendor && item.slug !== doc.slug
  );
  const rest = ModelDocs.filter(
    (item) => item.vendor !== doc.vendor && item.slug !== doc.slug
  );
  const related = [...sameVendor, ...rest].slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      breadcrumbJsonLd(appUrl, trail),
      techArticleJsonLd({
        appUrl,
        url: `/models/${doc.slug}`,
        headline: `${doc.model} API pricing on QuickRouter`,
        description: doc.description,
        dateModified: SEO_UPDATED_ISO,
        keywords: doc.keywords,
      }),
      faqJsonLd(doc.copy.faq),
      {
        '@type': 'WebPage',
        '@id': `${appUrl}/models/${doc.slug}`,
        url: `${appUrl}/models/${doc.slug}`,
        name: `${doc.model} API pricing`,
        description: doc.description,
        isPartOf: { '@id': `${appUrl}/#website` },
        about: {
          '@type': 'SoftwareApplication',
          name: doc.model,
          applicationCategory: 'DeveloperApplication',
          softwareRequirements: `${doc.context} token context window`,
          offers: {
            '@type': 'Offer',
            price: doc.inputUsd,
            priceCurrency: 'USD',
            description: `${doc.input} per 1M input tokens and ${doc.output} per 1M output tokens through QuickRouter`,
          },
        },
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <QuickRouterModelPage doc={doc} related={related} />
    </>
  );
}
