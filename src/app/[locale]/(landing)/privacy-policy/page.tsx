import { setRequestLocale } from 'next-intl/server';

import { QuickRouterLegalPage } from '@/shared/blocks/quickrouter/legal-page';
import { QuickRouterPrivacy } from '@/shared/blocks/quickrouter/legal';
import { getMetadata } from '@/shared/lib/seo';

export const revalidate = 3600;

export const generateMetadata = getMetadata({
  title: 'Privacy Policy - QuickRouter.AI',
  description:
    'What QuickRouter.AI collects, how request metadata and billing data are used, which sub-processors are involved and how to exercise your data rights.',
  canonicalUrl: '/privacy-policy',
});

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <QuickRouterLegalPage doc={QuickRouterPrivacy} />;
}
