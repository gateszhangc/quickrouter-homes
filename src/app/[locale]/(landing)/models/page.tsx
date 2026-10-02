import { setRequestLocale } from 'next-intl/server';
import { Check } from 'lucide-react';

import { envConfigs } from '@/config';
import { ModelRows, ModelVendors } from '@/shared/blocks/quickrouter/content';
import {
  ModelDocs,
  ModelsHub,
} from '@/shared/blocks/quickrouter/seo-content';
import { QuickRouterHub } from '@/shared/blocks/quickrouter/seo-page';
import { getMetadata } from '@/shared/lib/seo';
import { breadcrumbJsonLd, itemListJsonLd, JsonLd } from '@/shared/lib/seo-schema';

export const revalidate = 3600;

export const generateMetadata = getMetadata({
  title: ModelsHub.title,
  description: ModelsHub.description,
  keywords: ModelsHub.keywords,
  canonicalUrl: '/models',
});

export default async function ModelsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const appUrl = envConfigs.app_url;
  const trail = [
    { label: 'Home', href: '/' },
    { label: 'Model prices', href: '/models' },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      breadcrumbJsonLd(appUrl, trail),
      itemListJsonLd({
        name: 'Model list prices per 1M tokens',
        items: ModelRows.map((row) => ({
          name: `${row.vendor} ${row.model}`,
          url: row.slug ? `${appUrl}/models/${row.slug}` : `${appUrl}/models`,
          description: `Context ${row.context}, input ${row.input}, output ${row.output} per 1M tokens`,
        })),
      }),
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <QuickRouterHub
        eyebrow="Model prices"
        h1={ModelsHub.h1}
        lede={ModelsHub.intro}
        trail={trail}
        groups={ModelDocs.map((doc) => ({
          label: doc.model,
          href: `/models/${doc.slug}`,
          copy: `${doc.input} per 1M input and ${doc.output} per 1M output, ${doc.context} context.`,
        }))}
      >
        <section className="qr-doc-section" id="price-table">
          <h2>Indicative list prices per 1M tokens</h2>
          <p className="qr-doc-answer">
            Prices are the upstream list rates the gateway bills against, so a
            call to any row below draws from your balance at that rate. Model
            names in the first group link to a page with worked cost examples.
          </p>
          <div className="qr-table-wrap">
            <table className="qr-table qr-table-doc">
              <thead>
                <tr>
                  <th scope="col">Vendor</th>
                  <th scope="col">Model</th>
                  <th scope="col">Context</th>
                  <th scope="col">Input / 1M</th>
                  <th scope="col">Output / 1M</th>
                </tr>
              </thead>
              <tbody>
                {ModelRows.map((row) => (
                  <tr key={`${row.vendor}-${row.model}`}>
                    <td>{row.vendor}</td>
                    <td className="qr-table-model">
                      {row.slug ? (
                        <a href={`/models/${row.slug}`}>{row.model}</a>
                      ) : (
                        row.model
                      )}
                    </td>
                    <td>{row.context}</td>
                    <td>{row.input}</td>
                    <td>{row.output}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="qr-doc-note">
            The table shows the models people ask about most, not the full
            catalogue. {ModelVendors.length} vendors and 400+ models are
            reachable through the same endpoint; the console lists every id your
            key can call along with live pricing.
          </p>
        </section>

        <section className="qr-doc-section">
          <h2>How model pricing works on the gateway</h2>
          <p className="qr-doc-answer">
            You pay two separate things: a gateway plan from $19 per month, and
            model usage drawn from your balance at the upstream list price of
            whichever model you call. There is no per-model markup and no
            rounding up.
          </p>
          <ul className="qr-doc-list">
            <li>
              <Check aria-hidden="true" />
              Input tokens are what you send: prompts, context, files and tool
              results.
            </li>
            <li>
              <Check aria-hidden="true" />
              Output tokens are what the model generates, and they are usually
              the more expensive half - up to 8x on the GPT-5 tier.
            </li>
            <li>
              <Check aria-hidden="true" />
              Agent loops re-read context on every step, so their cost tracks
              the input price rather than the output price.
            </li>
          </ul>
          <div className="qr-doc-links">
            <a href="/what-is-an-llm-api-gateway">
              <b>What is an LLM API gateway?</b>
              <span>
                Why one endpoint, one key and one balance changes which models
                you can afford to test.
              </span>
            </a>
            <a href="/pricing">
              <b>Plans and pricing</b>
              <span>
                Compare the gateway plans that sit in front of the per-token
                rates above.
              </span>
            </a>
          </div>
        </section>
      </QuickRouterHub>
    </>
  );
}
