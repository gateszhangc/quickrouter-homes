'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Bot,
  Check,
  Copy,
  KeyRound,
  Plug,
  Rocket,
  Sparkles,
  Terminal,
} from 'lucide-react';
import { toast } from 'sonner';

import { QuickRouterAction } from './site';
import {
  DevTools,
  Faq,
  HeroChips,
  HeroStats,
  InstallSteps,
  ModelRows,
  ModelVendors,
  PricingCards,
  QuickRouterBrand,
  QuickStartSteps,
  Showcases,
  Testimonials,
  ToolChips,
  ToolLogos,
  VendorLogos,
  Vendors,
} from './content';

const stepIcons = [KeyRound, Terminal, Plug, Rocket];

export function QuickRouterHome() {
  const [vendor, setVendor] = useState<string>('All models');
  const [tool, setTool] = useState<string>(DevTools[0].name);
  const showcaseRefs = useRef(new Map<string, HTMLVideoElement>());

  /**
   * The reference site only paints posters until a card is on screen. Keep the
   * same behaviour: no 4MB of video on first paint, playback when visible.
   */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            void video.play().catch(() => {});
          } else {
            video.pause();
          }
        }
      },
      { threshold: 0.25 }
    );

    for (const video of showcaseRefs.current.values()) observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const registerShowcase = useCallback(
    (key: string, node: HTMLVideoElement | null) => {
      if (node) showcaseRefs.current.set(key, node);
      else showcaseRefs.current.delete(key);
    },
    []
  );

  const filteredModels = useMemo(
    () =>
      vendor === 'All models'
        ? ModelRows
        : ModelRows.filter((row) => row.vendor === vendor),
    [vendor]
  );

  const activeTool = DevTools.find((item) => item.name === tool) ?? DevTools[0];
  const vendorTabs = ['All models', ...ModelVendors.map((item) => item.name)];

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success('Copied to clipboard');
    } catch {
      toast.error('Copy failed, select the text manually');
    }
  };

  return (
    <main className="qr-main">
      <section className="qr-hero" id="home">
        <div className="qr-hero-glow" aria-hidden="true" />
        <div className="qr-container qr-hero-inner">
          <span className="qr-eyebrow">
            <Sparkles aria-hidden="true" />
            {QuickRouterBrand.tagline}
          </span>
          <h1>
            {QuickRouterBrand.name} - the LLM API platform for builders
          </h1>
          <p className="qr-hero-lede">
            Direct, high-speed access to OpenAI, Claude, Gemini, DeepSeek, Grok
            and 400+ more models. Pay for what you use, skip the monthly fee, and
            keep the OpenAI SDK you already wrote.
          </p>
          <div className="qr-hero-actions">
            <QuickRouterAction className="qr-button qr-button-primary">
              Get started
              <ArrowRight aria-hidden="true" />
            </QuickRouterAction>
            <a className="qr-button qr-button-ghost" href="#model-prices">
              See model prices
            </a>
          </div>
          <ul className="qr-hero-chips">
            {HeroChips.map((chip) => (
              <li key={chip}>
                <Check aria-hidden="true" />
                {chip}
              </li>
            ))}
          </ul>
          <dl className="qr-stats">
            {HeroStats.map(([value, label]) => (
              <div key={label}>
                <dt>{value}</dt>
                <dd>{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="qr-band" aria-label="Supported providers">
        <div className="qr-band-track">
          {[...Vendors, ...Vendors].map((name, index) => (
            <span key={`${name}-${index}`}>
              {VendorLogos[name] ? (
                <img src={VendorLogos[name]} alt="" aria-hidden="true" />
              ) : null}
              {name}
            </span>
          ))}
        </div>
      </section>

      <section className="qr-section" id="pricing">
        <div className="qr-container">
          <SectionTitle
            eyebrow="Pricing"
            title="Every frontier model, one balance"
            copy="One API key, one balance and one dashboard for the whole model catalogue. Top up when you need to and spend it across any provider."
          />
          <div className="qr-card-grid">
            {PricingCards.map((card) => (
              <article
                className={`qr-price-card${card.featured ? ' qr-price-card-featured' : ''}`}
                key={card.name}
              >
                {card.badge ? (
                  <span className="qr-price-badge">{card.badge}</span>
                ) : null}
                <h3>{card.name}</h3>
                <p className="qr-price-subtitle">{card.subtitle}</p>
                <p className="qr-price-amount">
                  <b>{card.price}</b>
                  <span>{card.unit}</span>
                </p>
                <ul>
                  {card.features.map((feature) => (
                    <li key={feature}>
                      <Check aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  className={`qr-button ${card.featured ? 'qr-button-primary' : 'qr-button-ghost'}`}
                  href={card.cta.href}
                >
                  {card.cta.label}
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="qr-section qr-alt" id="model-prices">
        <div className="qr-container">
          <SectionTitle
            eyebrow="Model prices"
            title="Published list prices, no markup games"
            copy="Usage is drawn from your balance at the list price of each upstream model. Prices below are indicative list rates per 1M tokens - the console is the source of truth."
          />
          <div className="qr-tabs" role="tablist" aria-label="Filter by vendor">
            {vendorTabs.map((name) => (
              <button
                key={name}
                type="button"
                role="tab"
                aria-selected={vendor === name}
                className={vendor === name ? 'qr-tab qr-tab-active' : 'qr-tab'}
                onClick={() => setVendor(name)}
              >
                {name}
              </button>
            ))}
          </div>
          <div className="qr-table-wrap">
            <table className="qr-table">
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
                {filteredModels.map((row) => (
                  <tr key={`${row.vendor}-${row.model}`}>
                    <td>{row.vendor}</td>
                    <td className="qr-table-model">{row.model}</td>
                    <td>{row.context}</td>
                    <td>{row.input}</td>
                    <td>{row.output}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="qr-section" id="quick-start">
        <div className="qr-container">
          <SectionTitle
            eyebrow="Quick start"
            title="From signup to a first call in 3 minutes"
            copy="Register, copy a key, swap the base URL. Four steps stand between you and a working request."
          />
          <div className="qr-steps">
            {QuickStartSteps.map((item, index) => {
              const Icon = stepIcons[index] ?? Terminal;
              return (
                <article key={item.step}>
                  <span className="qr-step-icon">
                    <Icon aria-hidden="true" />
                  </span>
                  <b>{item.step}</b>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="qr-section qr-alt" id="models">
        <div className="qr-container">
          <SectionTitle
            eyebrow="Model catalogue"
            title="Direct routes to 400+ large language models"
            copy="OpenAI, Anthropic, Google, DeepSeek, xAI, Qwen, Meta and more - one endpoint, one key, one bill."
          />
          <div className="qr-vendor-grid">
            {ModelVendors.map((item) => (
              <article key={item.name}>
                <Bot aria-hidden="true" />
                <h3>{item.name}</h3>
                <p>{item.count}</p>
              </article>
            ))}
          </div>
          <div className="qr-chip-row">
            {ToolChips.map((chip) => (
              <span key={chip}>
                {ToolLogos[chip] ? (
                  <img src={ToolLogos[chip]} alt="" aria-hidden="true" />
                ) : null}
                {chip}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="qr-section" id="workbench">
        <div className="qr-container">
          <SectionTitle
            eyebrow="Workbench"
            title="Turn a prompt into something you can ship"
            copy="The same key powers chat, image and video models, so a creative pipeline is one integration instead of five."
          />
          <div className="qr-showcase-grid">
            {Showcases.map((item) => (
              <article key={item.model}>
                <div className="qr-showcase-art">
                  <video
                    className="qr-showcase-media"
                    poster={item.poster}
                    src={item.video}
                    ref={(node) => registerShowcase(item.model, node)}
                    aria-label={`${item.title} - ${item.model}`}
                    muted
                    loop
                    playsInline
                    preload="none"
                  />
                  <span>{item.kind}</span>
                </div>
                <div className="qr-showcase-body">
                  <h3>{item.title}</h3>
                  <p>
                    {item.vendor}
                    <span>{item.model}</span>
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="qr-section qr-alt" id="setup">
        <div className="qr-container">
          <SectionTitle
            eyebrow="Setup guide"
            title="Pick your tool and copy the config"
            copy="After you create a key, paste the base URL and model name into the tool you already use. Claude Code takes the host without /v1 - everything else takes the full path."
          />
          <div className="qr-tabs" role="tablist" aria-label="Developer tools">
            {DevTools.map((item) => (
              <button
                key={item.name}
                type="button"
                role="tab"
                aria-selected={tool === item.name}
                className={tool === item.name ? 'qr-tab qr-tab-active' : 'qr-tab'}
                onClick={() => setTool(item.name)}
              >
                {item.name}
              </button>
            ))}
          </div>
          <div className="qr-setup-card">
            <div className="qr-setup-rows">
              <div>
                <span>API key</span>
                <code>{activeTool.apiKey}</code>
              </div>
              <div>
                <span>Base URL</span>
                <code>{activeTool.baseUrl}</code>
                <button
                  type="button"
                  className="qr-copy"
                  onClick={() => copy(activeTool.baseUrl)}
                >
                  <Copy aria-hidden="true" />
                  Copy
                </button>
              </div>
              <div>
                <span>Model</span>
                <code>{activeTool.model}</code>
              </div>
            </div>
            <pre className="qr-code">
              <code>{activeTool.snippet}</code>
            </pre>
          </div>
          <div className="qr-install-grid">
            {InstallSteps.map((item) => (
              <article key={`${item.tool}-${item.platform}`}>
                <h3>
                  {item.tool}
                  <span>{item.platform}</span>
                </h3>
                <pre className="qr-code">
                  <code>{item.commands.join('\n')}</code>
                </pre>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="qr-section" id="trust">
        <div className="qr-container">
          <SectionTitle
            eyebrow="Trusted by developers"
            title="Teams keep one gateway in front of every model"
            copy="From solo builders to product teams shipping with OpenAI, Claude, Gemini, DeepSeek and Grok every day."
          />
          <div className="qr-people">
            {Testimonials.map(([name, role, avatar], index) => (
              <article key={name}>
                {avatar ? (
                  <img
                    className="qr-avatar"
                    src={avatar}
                    alt=""
                    aria-hidden="true"
                  />
                ) : (
                  <span
                    className="qr-avatar"
                    style={{
                      background: `hsl(${(index * 37) % 360} 70% 58%)`,
                    }}
                    aria-hidden="true"
                  >
                    {name.slice(0, 1)}
                  </span>
                )}
                <div>
                  <b>{name}</b>
                  <span>{role}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="qr-section qr-alt" id="faq">
        <div className="qr-container">
          <SectionTitle
            eyebrow="FAQ"
            title="Questions developers ask before the first call"
            copy="Everything about keys, base URLs, billing and compatibility with the OpenAI protocol."
          />
          <div className="qr-faq">
            {Faq.map(([question, answer]) => (
              <details key={question}>
                <summary>
                  {question}
                  <span>+</span>
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="qr-cta">
        <div className="qr-container">
          <h2>Create your API key and make the first call in 3 minutes</h2>
          <p>
            Create an account, pick a plan, copy your API key and point your
            base URL at {QuickRouterBrand.name}.
          </p>
          <div className="qr-cta-actions">
            <QuickRouterAction className="qr-button qr-button-primary">
              Get started
              <ArrowRight aria-hidden="true" />
            </QuickRouterAction>
            <a className="qr-button qr-button-ghost" href="/pricing">
              Compare plans
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

function SectionTitle({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
}) {
  return (
    <div className="qr-section-title">
      <span className="qr-eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {copy ? <p>{copy}</p> : null}
    </div>
  );
}
