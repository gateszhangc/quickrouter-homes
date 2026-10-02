import { QuickRouterBrand } from '@/shared/blocks/quickrouter/content';

/**
 * Small JSON-LD builders shared by the guide, model and explainer pages.
 * Kept separate from the page components so every route emits the same
 * breadcrumb, FAQ and article shapes.
 */

export type Crumb = { label: string; href?: string };

function absolute(appUrl: string, href?: string) {
  if (!href) return appUrl;
  if (href.startsWith('http')) return href;
  return `${appUrl}${href === '/' ? '' : href}`;
}

export function breadcrumbJsonLd(appUrl: string, trail: Crumb[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      item: absolute(appUrl, crumb.href),
    })),
  };
}

export function faqJsonLd(faq: { question: string; answer: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export function techArticleJsonLd({
  appUrl,
  url,
  headline,
  description,
  dateModified,
  keywords,
}: {
  appUrl: string;
  url: string;
  headline: string;
  description: string;
  dateModified: string;
  keywords?: string;
}) {
  return {
    '@type': 'TechArticle',
    '@id': `${absolute(appUrl, url)}#article`,
    headline,
    description,
    url: absolute(appUrl, url),
    mainEntityOfPage: absolute(appUrl, url),
    dateModified,
    inLanguage: 'en',
    keywords,
    author: {
      '@type': 'Organization',
      name: QuickRouterBrand.name,
      url: appUrl,
    },
    publisher: { '@id': `${appUrl}/#organization` },
  };
}

export function itemListJsonLd({
  name,
  items,
}: {
  name: string;
  items: { name: string; url: string; description?: string }[];
}) {
  return {
    '@type': 'ItemList',
    name,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: item.url,
      ...(item.description ? { description: item.description } : {}),
    })),
  };
}

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
