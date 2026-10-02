'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Menu, X } from 'lucide-react';
import { toast } from 'sonner';

import { SignModal } from '@/shared/blocks/sign/sign-modal';
import { useAppContext } from '@/shared/contexts/app';
import type { DirectoryBadge } from '@/shared/lib/directory-badges';
import { QuickRouterBrand, QuickRouterNav, FooterColumns } from './content';
import { FooterDirectoryBadges } from './footer-directory-badges';
import { QuickRouterSession } from './session';

/**
 * Single entry point for every primary call to action.
 *
 * Signed out -> Google sign-in dialog. Signed in with an active plan -> home.
 * Signed in without a plan -> /pricing. The billing backend stays untouched:
 * this only reads what the subscription tables already know.
 */
export function QuickRouterAction({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();
  const { user, isCheckSign, setIsShowSignModal } = useAppContext();
  const [loading, setLoading] = useState(false);

  const act = async () => {
    if (loading || isCheckSign) return;

    if (!user) {
      setIsShowSignModal(true);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/user/get-subscription', {
        method: 'POST',
      });
      if (response.status === 401 || response.status === 403) {
        setIsShowSignModal(true);
        return;
      }
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result?.code !== 0) {
        throw new Error(result?.message || 'Unable to check your plan');
      }
      router.push(result?.data?.subscribed ? '/' : '/pricing');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      className={className}
      disabled={loading || isCheckSign}
      onClick={act}
    >
      {loading ? (
        <>
          <Loader2 aria-hidden="true" className="qr-spin" />
          Checking plan
        </>
      ) : (
        children
      )}
    </button>
  );
}

function AccountEntry({ compact = false }: { compact?: boolean }) {
  const { user, isCheckSign, setIsShowSignModal } = useAppContext();

  if (isCheckSign) return null;

  if (!user) {
    return (
      <button
        type="button"
        className={compact ? 'qr-signin qr-signin-compact' : 'qr-signin'}
        onClick={() => setIsShowSignModal(true)}
      >
        Sign in
      </button>
    );
  }

  const label = (user.name || user.email || 'Account').trim();

  return (
    <a
      className="qr-account"
      href="/settings/billing"
      title={user.email || label}
      aria-label={`Account: ${label}`}
    >
      <span aria-hidden="true">{label.slice(0, 1).toUpperCase()}</span>
    </a>
  );
}

export function QuickRouterHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="qr-header">
      <QuickRouterSession />
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
          <AccountEntry />
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
          <AccountEntry compact />
          <QuickRouterAction className="qr-button qr-button-primary">
            Get started
          </QuickRouterAction>
        </div>
      )}
      <SignModal googleOnly className="qr-sign-dialog" />
    </header>
  );
}

export function QuickRouterFooter({
  badges = [],
}: {
  badges?: DirectoryBadge[];
}) {
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
      <FooterDirectoryBadges badges={badges} />
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
