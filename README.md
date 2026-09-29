# QuickRouter.AI (quickrouter.homes)

The site behind [quickrouter.homes](https://quickrouter.homes) - an English
marketing surface for an LLM API gateway that puts OpenAI, Claude, Gemini,
DeepSeek, Grok and 400+ further models behind one OpenAI-compatible base URL.

## Stack

- Next.js (App Router) + React + Tailwind CSS v4
- ShipAny Two template (`ai-shipany-template-two-lite`)
- PostgreSQL + Drizzle ORM, migrations applied on boot by `src/instrumentation.ts`
- Stripe for subscriptions, Google OAuth reserved for the auth round

## Layout

- `src/app/[locale]/(landing)/page.tsx` - home page, sections live in `src/shared/blocks/quickrouter`
- `src/shared/blocks/quickrouter/content.ts` - brand copy, model table, tools, FAQ, footer
- `src/shared/blocks/quickrouter/site.tsx` - header, footer and `QuickRouterAction` (the single CTA seam)
- `src/shared/blocks/quickrouter/legal.ts` - privacy, terms and refund documents
- `src/config/style/quickrouter.css` - the site theme
- `src/config/locale/messages/en/pages/pricing.json` - plans and Stripe product ids
- `public/quickrouter/*` - logo, favicon, apple touch icon and OG preview

## Assets

The mark, wordmark and social preview are authored as SVG and rasterised by
`scripts/quickrouter/build-assets.sh` (headless Chrome + Pillow). Run it after
editing any SVG in `public/quickrouter`.

## CTA behaviour

Every primary call to action runs through `QuickRouterAction`:

1. signed out -> Google sign-in dialog
2. signed in without an active subscription -> `/pricing`
3. signed in with an active subscription -> the home page

The gate reads `/api/user/get-subscription`; the billing backend is untouched.
Sign-in is Google-only (`GOOGLE_AUTH_ENABLED=true` plus the OAuth client in the
deploy environment) and the modal is themed with `.qr-sign-dialog`.

## Checks

```bash
pnpm build                       # production build + type check
node scripts/quickrouter/check-fidelity.mjs   # copy probes and link crawl against a running server
```

## Out of scope in this round

Sign-in, the subscription gate, the API console, the 165-page reference
content tree (models, tutorials, tools, questions, blog) and GA4.
