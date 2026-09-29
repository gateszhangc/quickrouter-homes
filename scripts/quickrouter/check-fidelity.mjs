#!/usr/bin/env node
/**
 * Copy and link checks for the QuickRouter.AI marketing surface.
 *
 * Usage: node scripts/quickrouter/check-fidelity.mjs [baseUrl]
 * Defaults to http://localhost:3100 so it can run against `pnpm dev` or
 * `pnpm start` before a deploy.
 */

const base = (process.argv[2] || 'http://localhost:3100').replace(/\/$/, '');

const pages = [
  {
    path: '/',
    probes: [
      'QuickRouter.AI',
      'One API key',
      'id="pricing"',
      'id="model-prices"',
      'id="models"',
      'id="setup"',
      'id="faq"',
      'Claude Code',
      'api.quickrouter.homes/v1',
      'Get started',
    ],
  },
  {
    path: '/pricing',
    probes: ['Starter', 'Pro', 'Elite', '$19', '$39', '$99', 'Yearly'],
  },
  {
    path: '/privacy-policy',
    probes: ['Privacy Policy', 'QuickRouter.AI', 'Back to'],
  },
  {
    path: '/terms-of-service',
    probes: ['Terms of Service', 'Acceptable use', 'Back to'],
  },
  {
    path: '/refund-policy',
    probes: ['Refund Policy', 'Fourteen day refund window', 'Back to'],
  },
];

const sectionOrder = [
  'id="pricing"',
  'id="model-prices"',
  'id="quick-start"',
  'id="models"',
  'id="workbench"',
  'id="setup"',
  'id="trust"',
  'id="faq"',
];

// The site sells paid gateway plans only: no free tier, no free credit claims.
const banned = [/free/i];

let failures = 0;
const internalLinks = new Set();

function fail(message) {
  failures += 1;
  console.error(`FAIL ${message}`);
}

for (const page of pages) {
  const response = await fetch(`${base}${page.path}`);
  if (!response.ok) {
    fail(`${page.path} returned ${response.status}`);
    continue;
  }
  const html = await response.text();
  const missing = page.probes.filter((probe) => !html.includes(probe));
  if (missing.length) fail(`${page.path} missing copy: ${missing.join(', ')}`);
  else console.log(`ok   ${page.path} (${page.probes.length} probes)`);

  for (const pattern of banned) {
    const hit = html.match(pattern);
    if (hit) fail(`${page.path} still contains banned wording "${hit[0]}"`);
  }

  if (page.path === '/') {
    const positions = sectionOrder.map((probe) => html.indexOf(probe));
    const outOfOrder = positions.some(
      (position, index) => position === -1 || (index > 0 && position < positions[index - 1])
    );
    if (outOfOrder) fail(`home sections are missing or out of order: ${sectionOrder.join(' -> ')}`);
    else console.log('ok   home section order');

    for (const match of html.matchAll(/href="(\/[^"#?]*)/g)) {
      internalLinks.add(match[1]);
    }
  }
}

for (const link of [...internalLinks].sort()) {
  const response = await fetch(`${base}${link}`, { redirect: 'manual' });
  if (response.status >= 400) fail(`${link} returned ${response.status}`);
}
console.log(`ok   ${internalLinks.size} internal links checked`);

if (failures) {
  console.error(`\n${failures} check(s) failed`);
  process.exit(1);
}
console.log('\nall fidelity checks passed');
