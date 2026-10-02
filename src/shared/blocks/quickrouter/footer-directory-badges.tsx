'use client';

import { useState } from 'react';

import type { DirectoryBadge } from '@/shared/lib/directory-badges';

const DIRECTORY_BADGES_MARQUEE_MIN_ITEMS = 6;

/**
 * Badge strip shown at the bottom of the site footer. The badge list is loaded
 * on the server (see `@/shared/lib/directory-badges`) and handed to this
 * component, so nothing extra is fetched from the browser.
 */
export function FooterDirectoryBadges({
  badges,
}: {
  badges: DirectoryBadge[];
}) {
  if (badges.length === 0) {
    return null;
  }

  const isMarquee = badges.length >= DIRECTORY_BADGES_MARQUEE_MIN_ITEMS;
  const marqueeFlag = isMarquee ? 'true' : 'false';

  return (
    <div
      className="qr-footer-badges"
      data-testid="quickrouter-footer-badges"
      data-count={badges.length}
      data-marquee={marqueeFlag}
    >
      <p className="qr-footer-badges-title" id="quickrouter-footer-badges-title">
        Featured directories
      </p>
      <div
        className="qr-directory-badge-viewport"
        data-marquee={marqueeFlag}
        data-testid="quickrouter-footer-badges-viewport"
        aria-labelledby="quickrouter-footer-badges-title"
      >
        <div className="qr-directory-badge-track" data-marquee={marqueeFlag}>
          <div className="qr-directory-badge-set">
            {badges.map((badge) => (
              <DirectoryBadgeLink key={badge.href} badge={badge} />
            ))}
          </div>
          {isMarquee ? (
            <div aria-hidden="true" className="qr-directory-badge-set">
              {badges.map((badge) => (
                <DirectoryBadgeLink
                  key={`duplicate-${badge.href}`}
                  badge={badge}
                  duplicate
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function DirectoryBadgeLink({
  badge,
  duplicate = false,
}: {
  badge: DirectoryBadge;
  duplicate?: boolean;
}) {
  // a badge whose artwork stops loading takes its link with it rather than
  // leaving an empty plate behind in the strip
  const [failed, setFailed] = useState(false);

  if (failed) {
    return null;
  }

  // the strip is moved with a css transform rather than a scroll, so the
  // browser never fires the lazy-loader for the badges waiting off screen:
  // they are fetched eagerly at low priority instead
  const imageProps = {
    loading: 'eager' as const,
    fetchPriority: 'low' as const,
    decoding: 'async' as const,
    onError: () => setFailed(true),
  };

  return (
    <a
      href={badge.href}
      target="_blank"
      rel={badge.rel ?? 'noopener noreferrer'}
        title={badge.title}
      aria-label={duplicate ? undefined : badge.label}
      tabIndex={duplicate ? -1 : undefined}
      className="qr-directory-badge"
    >
      {badge.imageSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={badge.imageSrc}
          alt={duplicate ? '' : badge.label}
          width="160"
          {...imageProps}
        />
      ) : (
        <span className="qr-directory-badge-text">{badge.text}</span>
      )}
    </a>
  );
}
