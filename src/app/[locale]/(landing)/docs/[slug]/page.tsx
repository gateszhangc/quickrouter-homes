import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { envConfigs } from '@/config';
import {
  GuideDocs,
  SEO_UPDATED_ISO,
  getGuideDoc,
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const doc = getGuideDoc(slug);
  if (!doc) return {};

  return getMetadata({
    title: doc.title,
    description: doc.description,
    keywords: doc.keywords,
    canonicalUrl: `/docs/${doc.slug}`,
  })({ params: params as Promise<{ locale: string }> });
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const doc = getGuideDoc(slug);
  if (!doc) notFound();

  const appUrl = envConfigs.app_url;
  const trail = [
    { label: 'Home', href: '/' },
    { label: 'Setup guides', href: '/docs' },
    { label: doc.tool ?? doc.h1 },
  ];

  const others = GuideDocs.filter((item) => item.slug !== doc.slug).slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      breadcrumbJsonLd(appUrl, trail),
      techArticleJsonLd({
        appUrl,
        url: `/docs/${doc.slug}`,
        headline: doc.h1,
        description: doc.description,
        dateModified: SEO_UPDATED_ISO,
        keywords: doc.keywords,
      }),
      faqJsonLd(doc.faq),
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <QuickRouterDocPage
        doc={doc}
        trail={trail}
        eyebrow={`${doc.tool} setup`}
        related={others.map((item) => ({
          label: item.tool ?? item.title,
          href: `/docs/${item.slug}`,
          copy: item.card,
        }))}
      />
    </>
  );
}
