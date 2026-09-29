'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';

import { QuickRouterBrand, QuickRouterNav, FooterColumns } from './content';

/**
 * Single entry point for every primary call to action.
 *
 * Sign-in and the subscription gate are intentionally not wired yet: this round
 * ships the marketing surface, so the action routes to the pricing page. When the
 * auth round lands, this component is the only place that has to change.
 */
export function QuickRouterAction({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();

  return (
    <button
      type="button"
      className={className}
      onClick={() => router.push('/pricing')}
    >
      {children}
    </button>
  );
}

export function QuickRouterHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="qr-header">
      <div className="qr-nav">
        <a className="qr-logo" href="/" aria-label={`${QuickRouterBrand.name} home`}>
          <img src="/quickrouter/mark.svg" alt="" aria-hidden="true" />
          <span>{QuickRouterBrand.name}</span>
        </a>
        <nav className="qr-nav-links">
          {QuickRouterNav.map((item) => (
            <a href={item.href} key={item.label}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="qr-nav-actions">
          <QuickRouterAction className="qr-button qr-button-primary">
            Get started
          </QuickRouterAction>
        </div>
        <button
          className="qr-menu"
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="qr-mobile-menu">
          {QuickRouterNav.map((item) => (
            <a href={item.href} key={item.label} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
          <QuickRouterAction className="qr-button qr-button-primary">
            Get started
          </QuickRouterAction>
        </div>
      )}
    </header>
  );
}

export function QuickRouterFooter() {
  return (
    <footer className="qr-footer">
      <div className="qr-footer-top">
        <div className="qr-footer-brand">
          <a className="qr-logo" href="/">
            <img src="/quickrouter/mark.svg" alt="" aria-hidden="true" />
            <span>{QuickRouterBrand.name}</span>
          </a>
          <p>
            {QuickRouterBrand.name} puts OpenAI, Claude, Gemini, DeepSeek, Grok
            and 400+ more models behind one base URL, one key and one invoice.
          </p>
          <a href={`mailto:${QuickRouterBrand.support}`}>
            {QuickRouterBrand.support}
          </a>
        </div>
        {FooterColumns.map((column) => (
          <div className="qr-footer-group" key={column.title}>
            <h3>{column.title}</h3>
            {column.links.map((link) => (
              <a href={link.href} key={link.label}>
                {link.label}
              </a>
            ))}
          </div>
        ))}
      </div>
      <div className="qr-footer-bottom">
        <span>
          © {new Date().getFullYear()} {QuickRouterBrand.name}. All rights
          reserved.
        </span>
        <span className="qr-footer-legal">
          <a href="/privacy-policy">Privacy</a>
          <a href="/terms-of-service">Terms</a>
          <a href="/refund-policy">Refunds</a>
        </span>
      </div>
    </footer>
  );
}
