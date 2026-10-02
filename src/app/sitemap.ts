import type { MetadataRoute } from 'next';

import { envConfigs } from '@/config';
import {
  SEO_UPDATED_ISO,
  GuideDocs,
  ModelDocs,
} from '@/shared/blocks/quickrouter/seo-content';

export default function sitemap(): MetadataRoute.Sitemap {
  const appUrl = envConfigs.app_url;
  const updated = new Date(SEO_UPDATED_ISO);
  const published = new Date('2026-09-28');

  return [
    {
      url: `${appUrl}/`,
      lastModified: published,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${appUrl}/pricing`,
      lastModified: published,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${appUrl}/models`,
      lastModified: updated,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${appUrl}/docs`,
      lastModified: updated,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${appUrl}/what-is-an-llm-api-gateway`,
      lastModified: updated,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...ModelDocs.map((doc) => ({
      url: `${appUrl}/models/${doc.slug}`,
      lastModified: updated,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...GuideDocs.map((doc) => ({
      url: `${appUrl}/docs/${doc.slug}`,
      lastModified: updated,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    {
      url: `${appUrl}/privacy-policy`,
      lastModified: published,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${appUrl}/terms-of-service`,
      lastModified: published,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${appUrl}/refund-policy`,
      lastModified: published,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}
