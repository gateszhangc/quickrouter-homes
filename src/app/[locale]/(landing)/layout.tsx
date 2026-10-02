import { ReactNode } from 'react';

import '@/config/style/quickrouter.css';

import {
  QuickRouterFooter,
  QuickRouterHeader,
} from '@/shared/blocks/quickrouter/site';
import { getDirectoryBadges } from '@/shared/lib/directory-badges';

export default async function LandingLayout({
  children,
}: {
  children: ReactNode;
}) {
  const directoryBadges = await getDirectoryBadges();

  return (
    <div className="qr-shell">
      <QuickRouterHeader />
      {children}
      <QuickRouterFooter badges={directoryBadges} />
    </div>
  );
}
