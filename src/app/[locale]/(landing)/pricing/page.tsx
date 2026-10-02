import { getTranslations, setRequestLocale } from 'next-intl/server';

import { envConfigs } from '@/config';
import { Pricing } from '@/themes/default/blocks/pricing';
import { getMetadata } from '@/shared/lib/seo';
import { breadcrumbJsonLd, JsonLd } from '@/shared/lib/seo-schema';
import { getCurrentSubscription } from '@/shared/models/subscription';
import { getUserInfo } from '@/shared/models/user';
import { DynamicPage } from '@/shared/types/blocks/landing';

export const revalidate = 3600;

export const generateMetadata = getMetadata({
  metadataKey: 'pages.pricing.metadata',
  canonicalUrl: '/pricing',
});

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // get current subscription
  let currentSubscription;
  try {
    const user = await getUserInfo();
    if (user) {
      currentSubscription = await getCurrentSubscription(user.id);
    }
  } catch (error) {
    console.log('getting current subscription failed:', error);
  }

  // get pricing data
  const t = await getTranslations('pages.pricing');

  // build page sections
  const page: DynamicPage = {
    title: t.raw('page.title'),
    sections: {
      pricing: {
        ...t.raw('page.sections.pricing'),
        data: {
          currentSubscription,
        },
      },
    },
  };

  // structured data: keep the plan range in sync with the translated plan list
  const pricing = t.raw('page.sections.pricing');
  const amounts: number[] = Array.isArray(pricing?.items)
    ? pricing.items
        .map((item: any) => Number(item?.amount))
        .filter((amount: number) => Number.isFinite(amount) && amount > 0)
    : [];
  const appUrl = envConfigs.app_url;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      breadcrumbJsonLd(appUrl, [
        { label: 'Home', href: '/' },
        { label: 'Pricing', href: '/pricing' },
      ]),
      {
        '@type': 'Product',
        '@id': `${appUrl}/pricing#plans`,
        name: 'QuickRouter gateway plans',
        description:
          'Gateway plans for one OpenAI-compatible endpoint, one API key and usage billed at upstream model list prices.',
        brand: { '@type': 'Brand', name: 'QuickRouter' },
        category: 'DeveloperApplication',
        url: `${appUrl}/pricing`,
        ...(amounts.length
          ? {
              offers: {
                '@type': 'AggregateOffer',
                priceCurrency: 'USD',
                lowPrice: Math.min(...amounts) / 100,
                highPrice: Math.max(...amounts) / 100,
                offerCount: amounts.length,
                url: `${appUrl}/pricing`,
              },
            }
          : {}),
      },
    ],
  };

  // load page component
  return (
    <>
      <JsonLd data={jsonLd} />
      <h1 className="sr-only">{page.title}</h1>
      <Pricing
        section={t.raw('page.sections.pricing')}
        currentSubscription={currentSubscription}
      />
    </>
  );
}
