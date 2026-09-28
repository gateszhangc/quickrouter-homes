import { setRequestLocale } from 'next-intl/server';

import { QuickRouterLegalPage } from '@/shared/blocks/quickrouter/legal-page';
import { QuickRouterTerms } from '@/shared/blocks/quickrouter/legal';
import { getMetadata } from '@/shared/lib/seo';

export const revalidate = 3600;

export const generateMetadata = getMetadata({
  title: 'Terms of Service - QuickRouter.AI',
  description:
    'The terms that govern QuickRouter.AI accounts, API keys, acceptable use, upstream provider policies, subscription billing and liability.',
  canonicalUrl: '/terms-of-service',
});

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <QuickRouterLegalPage doc={QuickRouterTerms} />;
}
