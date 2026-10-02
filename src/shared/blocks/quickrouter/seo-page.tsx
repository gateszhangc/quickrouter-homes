import { ArrowLeft, ArrowRight, BookOpen, Check, Layers } from 'lucide-react';

import { QuickRouterBrand } from './content';
import type { ModelDoc, SeoDoc, SeoSection } from './seo-content';
import { modelCostExamples } from './seo-content';

/**
 * Server-rendered layouts for the indexable guide, model-price and explainer
 * pages. The answer to each question sits directly under its heading so that
 * search features and answer engines can lift it without extra context.
 */

const usd = (value: number) =>
  value >= 100
    ? `$${value.toFixed(0)}`
    : value >= 1
      ? `$${value.toFixed(2)}`
      : `$${value.toFixed(3)}`;

export type Crumb = { label: string; href?: string };

function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  return (
    <nav className="qr-breadcrumbs" aria-label="Breadcrumb">
      {trail.map((crumb, index) => (
        <span key={`${crumb.label}-${index}`}>
          {crumb.href ? <a href={crumb.href}>{crumb.label}</a> : crumb.label}
          {index < trail.length - 1 ? <i aria-hidden="true">/</i> : null}
        </span>
      ))}
    </nav>
  );
}

function Sections({ sections }: { sections: SeoSection[] }) {
  return (
    <div className="qr-doc-body">
      {sections.map((section) => (
        <section className="qr-doc-section" key={section.heading}>
          <h2>{section.heading}</h2>
          <p className="qr-doc-answer">{section.answer}</p>

          {section.bullets?.length ? (
            <ul className="qr-doc-list">
              {section.bullets.map((item) => (
                <li key={item}>
                  <Check aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          ) : null}

          {section.steps?.length ? (
            <ol className="qr-doc-steps">
              {section.steps.map((step, index) => (
                <li key={step.title}>
                  <span className="qr-doc-step-index">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                    {step.code ? (
                      <pre className="qr-code">
                        <code>{step.code}</code>
                      </pre>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          ) : null}

          {section.code ? (
            <div className="qr-doc-code">
              {section.code.label ? <span>{section.code.label}</span> : null}
              <pre className="qr-code">
                <code>{section.code.value}</code>
              </pre>
            </div>
          ) : null}

          {section.table ? (
            <div className="qr-table-wrap">
              <table className="qr-table qr-table-doc">
                <thead>
                  <tr>
                    {section.table.headers.map((header) => (
                      <th scope="col" key={header}>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {section.table.rows.map((row, rowIndex) => (
                    <tr key={`${section.heading}-${rowIndex}`}>
                      {row.map((cell, cellIndex) => (
                        <td key={`${rowIndex}-${cellIndex}`}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          {section.links?.length ? (
            <div className="qr-doc-links">
              {section.links.map((link) => (
                <a href={link.href} key={link.href}>
                  <b>{link.label}</b>
                  <span>{link.copy}</span>
                  <ArrowRight aria-hidden="true" />
                </a>
              ))}
            </div>
          ) : null}
        </section>
      ))}
    </div>
  );
}

function Faq({ faq }: { faq: { question: string; answer: string }[] }) {
  if (!faq.length) return null;

  return (
    <section className="qr-doc-faq" id="faq">
      <h2>Frequently asked questions</h2>
      <div className="qr-faq">
        {faq.map((item) => (
          <details key={item.question} open>
            <summary>
              {item.question}
              <span>+</span>
            </summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function DocCta() {
  return (
    <section className="qr-doc-cta">
      <h2>One key covers every model in this guide</h2>
      <p>
        Create an account, pick a plan and copy an API key. Gateway plans start
        at $19 per month and model usage is billed at upstream list prices.
      </p>
      <div className="qr-cta-actions">
        <a className="qr-button qr-button-primary" href="/pricing">
          Get started
          <ArrowRight aria-hidden="true" />
        </a>
        <a className="qr-button qr-button-ghost" href="/docs">
          All setup guides
        </a>
      </div>
    </section>
  );
}

export function QuickRouterBreadcrumbs({ trail }: { trail: Crumb[] }) {
  return <Breadcrumbs trail={trail} />;
}

export function QuickRouterDocPage({
  doc,
  trail,
  eyebrow,
  related,
}: {
  doc: SeoDoc;
  trail: Crumb[];
  eyebrow: string;
  related?: { label: string; href: string; copy: string }[];
}) {
  return (
    <main className="qr-doc">
      <div className="qr-container">
        <Breadcrumbs trail={trail} />
        <div className="qr-doc-head">
          <span className="qr-eyebrow">
            <BookOpen aria-hidden="true" />
            {eyebrow}
          </span>
          <h1>{doc.h1}</h1>
          <p className="qr-doc-lede">{doc.intro}</p>
          <span className="qr-doc-updated">{doc.updated}</span>
        </div>

        <Sections sections={doc.sections} />
        <Faq faq={doc.faq} />

        {related?.length ? (
          <section className="qr-doc-related">
            <h2>Keep going</h2>
            <div className="qr-doc-links">
              {related.map((link) => (
                <a href={link.href} key={link.href}>
                  <b>{link.label}</b>
                  <span>{link.copy}</span>
                  <ArrowRight aria-hidden="true" />
                </a>
              ))}
            </div>
          </section>
        ) : null}

        <DocCta />
      </div>
    </main>
  );
}

export function QuickRouterModelPage({
  doc,
  related,
}: {
  doc: ModelDoc;
  related: ModelDoc[];
}) {
  const costs = modelCostExamples(doc);

  return (
    <main className="qr-doc">
      <div className="qr-container">
        <Breadcrumbs
          trail={[
            { label: 'Home', href: '/' },
            { label: 'Model prices', href: '/models' },
            { label: doc.model },
          ]}
        />

        <div className="qr-doc-head">
          <span className="qr-eyebrow">
            <Layers aria-hidden="true" />
            {doc.vendor} model prices
          </span>
          <h1>{doc.h1}</h1>
          <p className="qr-doc-lede">{doc.intro}</p>
          <span className="qr-doc-updated">{doc.updated}</span>
        </div>

        <dl className="qr-model-figures">
          <div>
            <dt>Input / 1M tokens</dt>
            <dd>{doc.input}</dd>
          </div>
          <div>
            <dt>Output / 1M tokens</dt>
            <dd>{doc.output}</dd>
          </div>
          <div>
            <dt>Context window</dt>
            <dd>{doc.context}</dd>
          </div>
          <div>
            <dt>Vendor</dt>
            <dd>{doc.vendor}</dd>
          </div>
        </dl>

        <div className="qr-doc-body">
          <section className="qr-doc-section">
            <h2>What does {doc.model} cost per request?</h2>
            <p className="qr-doc-answer">
              A typical request of 5,000 input tokens and 1,500 output tokens
              costs about {usd(costs.perCall)} at list price. A thousand of those
              requests costs about {usd(costs.perThousand)}.
            </p>
            <div className="qr-table-wrap">
              <table className="qr-table qr-table-doc">
                <thead>
                  <tr>
                    <th scope="col">Workload</th>
                    <th scope="col">Tokens</th>
                    <th scope="col">Cost at list price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Single chat turn</td>
                    <td>5K in / 1.5K out</td>
                    <td>{usd(costs.perCall)}</td>
                  </tr>
                  <tr>
                    <td>1,000 chat turns</td>
                    <td>5M in / 1.5M out</td>
                    <td>{usd(costs.perThousand)}</td>
                  </tr>
                  <tr>
                    <td>Small production month</td>
                    <td>10M in / 2M out</td>
                    <td>{usd(costs.monthly)}</td>
                  </tr>
                  <tr>
                    <td>Busy production month</td>
                    <td>100M in / 20M out</td>
                    <td>{usd(costs.heavyMonthly)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="qr-doc-note">
              Model usage is drawn from your balance at the upstream list price
              of each model. Figures above are indicative and exclude any plan
              fee; the console is the source of truth for live pricing.
            </p>
          </section>

          <section className="qr-doc-section">
            <h2>Where {doc.model} fits</h2>
            <p className="qr-doc-answer">{doc.copy.summary}</p>
            <h3 className="qr-doc-subhead">Pick it when</h3>
            <ul className="qr-doc-list">
              {doc.copy.pickWhen.map((item) => (
                <li key={item}>
                  <Check aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <h3 className="qr-doc-subhead">What to watch</h3>
            <ul className="qr-doc-list">
              {doc.copy.tradeoffs.map((item) => (
                <li key={item}>
                  <Check aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="qr-doc-answer">
              <strong>Best for:</strong> {doc.copy.bestFor}
            </p>
          </section>

          <section className="qr-doc-section">
            <h2>How to call {doc.model} through the gateway</h2>
            <p className="qr-doc-answer">
              Point your client at{' '}
              <code className="qr-inline-code">
                {QuickRouterBrand.baseUrl}
              </code>{' '}
              with a {QuickRouterBrand.name} key and pass{' '}
              <code className="qr-inline-code">{doc.modelId}</code> as the model
              name. Nothing else in an OpenAI-style client changes.
            </p>
            <div className="qr-doc-code">
              <pre className="qr-code">
                <code>{`curl ${QuickRouterBrand.baseUrl}/chat/completions \\
  -H "Authorization: Bearer sk-qr-your-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${doc.modelId}",
    "messages": [{"role": "user", "content": "Hello"}]
  }'`}</code>
              </pre>
            </div>
            <p className="qr-doc-note">
              The console lists the model ids your key can reach - use the id
              exactly as it appears there.
            </p>
          </section>
        </div>

        <Faq faq={doc.copy.faq} />

        {related.length ? (
          <section className="qr-doc-related">
            <h2>Compare with</h2>
            <div className="qr-doc-links">
              {related.map((item) => (
                <a href={`/models/${item.slug}`} key={item.slug}>
                  <b>{item.model}</b>
                  <span>
                    {item.input} per 1M input and {item.output} per 1M output,{' '}
                    {item.context} context.
                  </span>
                  <ArrowRight aria-hidden="true" />
                </a>
              ))}
            </div>
            <p className="qr-doc-related-back">
              <a href="/models">
                <ArrowLeft aria-hidden="true" />
                Back to all model prices
              </a>
            </p>
          </section>
        ) : null}

        <DocCta />
      </div>
    </main>
  );
}

/** Shared hub layout for /docs and /models. */
export function QuickRouterHub({
  eyebrow,
  h1,
  lede,
  trail,
  groups,
  children,
}: {
  eyebrow: string;
  h1: string;
  lede: string;
  trail: Crumb[];
  groups: { label: string; href: string; copy: string }[];
  children?: React.ReactNode;
}) {
  return (
    <main className="qr-doc">
      <div className="qr-container">
        <Breadcrumbs trail={trail} />
        <div className="qr-doc-head">
          <span className="qr-eyebrow">
            <BookOpen aria-hidden="true" />
            {eyebrow}
          </span>
          <h1>{h1}</h1>
          <p className="qr-doc-lede">{lede}</p>
        </div>

        <div className="qr-doc-body">
          <section className="qr-doc-section">
            <h2>Start here</h2>
            <div className="qr-doc-links qr-doc-links-grid">
              {groups.map((group) => (
                <a href={group.href} key={group.href}>
                  <b>{group.label}</b>
                  <span>{group.copy}</span>
                  <ArrowRight aria-hidden="true" />
                </a>
              ))}
            </div>
          </section>
          {children}
        </div>

        <DocCta />
      </div>
    </main>
  );
}
