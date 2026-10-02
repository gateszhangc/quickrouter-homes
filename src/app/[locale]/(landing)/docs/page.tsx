import { setRequestLocale } from 'next-intl/server';

import { envConfigs } from '@/config';
import {
  DocsHub,
  GuideDocs,
  ModelDocs,
} from '@/shared/blocks/quickrouter/seo-content';
import { QuickRouterHub } from '@/shared/blocks/quickrouter/seo-page';
import { getMetadata } from '@/shared/lib/seo';
import { breadcrumbJsonLd, itemListJsonLd, JsonLd } from '@/shared/lib/seo-schema';

export const revalidate = 3600;

export const generateMetadata = getMetadata({
  title: DocsHub.title,
  description: DocsHub.description,
  keywords: DocsHub.keywords,
  canonicalUrl: '/docs',
});

export default async function DocsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const appUrl = envConfigs.app_url;
  const trail = [
    { label: 'Home', href: '/' },
    { label: 'Setup guides', href: '/docs' },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      breadcrumbJsonLd(appUrl, trail),
      itemListJsonLd({
        name: 'Setup guides',
        items: GuideDocs.map((doc) => ({
          name: doc.title,
          url: `${appUrl}/docs/${doc.slug}`,
          description: doc.description,
        })),
      }),
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <QuickRouterHub
        eyebrow="Setup guides"
        h1={DocsHub.h1}
        lede={DocsHub.intro}
        trail={trail}
        groups={GuideDocs.map((doc) => ({
          label: doc.tool ?? doc.title,
          href: `/docs/${doc.slug}`,
          copy: doc.card,
        }))}
      >
        <section className="qr-doc-section">
          <h2>Model prices and background reading</h2>
          <p className="qr-doc-answer">
            Every guide ends with a model, so the price pages below give you the
            per-token rate before you paste a model name into a config file.
          </p>
          <div className="qr-doc-links qr-doc-links-grid">
            <a href="/what-is-an-llm-api-gateway">
              <b>What is an LLM API gateway?</b>
              <span>
                The definition behind every guide on this page, and when a
                gateway layer is worth adding.
              </span>
            </a>
            {ModelDocs.map((doc) => (
              <a href={`/models/${doc.slug}`} key={doc.slug}>
                <b>{doc.model}</b>
                <span>
                  {doc.input} per 1M input and {doc.output} per 1M output,{' '}
                  {doc.context} context.
                </span>
              </a>
            ))}
          </div>
        </section>
      </QuickRouterHub>
    </>
  );
}
