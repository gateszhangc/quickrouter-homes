import { ReactNode } from 'react';

import '@/config/style/quickrouter.css';

import {
  QuickRouterFooter,
  QuickRouterHeader,
} from '@/shared/blocks/quickrouter/site';

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="qr-shell">
      <QuickRouterHeader />
      {children}
      <QuickRouterFooter />
    </div>
  );
}
