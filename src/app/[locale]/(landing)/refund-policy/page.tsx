import { setRequestLocale } from 'next-intl/server';

import { QuickRouterLegalPage } from '@/shared/blocks/quickrouter/legal-page';
import { QuickRouterRefund } from '@/shared/blocks/quickrouter/legal';
import { getMetadata } from '@/shared/lib/seo';

export const revalidate = 3600;

export const generateMetadata = getMetadata({
  title: 'Refund Policy - QuickRouter',
  description:
    'Cancellations, the 14 day refund window, usage-based spend, gateway failures and how to request a billing correction from QuickRouter.',
  canonicalUrl: '/refund-policy',
});

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <QuickRouterLegalPage doc={QuickRouterRefund} />;
}
