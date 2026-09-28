import { QuickRouterBrand } from './content';

export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  list?: string[];
};

export type LegalDoc = {
  slug: string;
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
};

const support = QuickRouterBrand.support;

export const QuickRouterPrivacy: LegalDoc = {
  slug: 'privacy-policy',
  title: 'Privacy Policy',
  intro: `How ${QuickRouterBrand.name} collects, uses and protects your information when you use ${QuickRouterBrand.domain}.`,
  updated: 'Last updated: September 2026',
  sections: [
    {
      heading: 'Information we collect',
      paragraphs: [
        'We keep collection limited to what the gateway needs in order to serve requests and bill them accurately.',
      ],
      list: [
        'Account data: the name, email address and profile image returned by your sign-in provider. We never receive your provider password.',
        'Billing data from Stripe: plan, subscription status, billing period and the last four digits of the payment method. Full card numbers never reach our servers.',
        'Usage data: request timestamps, model, token counts, latency, status codes and basic device, browser and IP information used for security and abuse prevention.',
        'Support messages you send us, together with the address you send them from.',
      ],
    },
    {
      heading: 'How we use your information',
      paragraphs: [
        'Your data is used to operate the service you asked for, not to build advertising profiles.',
      ],
      list: [
        'Authenticate you and keep your session secure.',
        'Route requests to the model providers you call and return their responses.',
        'Meter usage, draw down your balance and produce invoices.',
        'Detect abuse, rate-limit runaway jobs and investigate incidents.',
        'Answer support questions and send service notices such as outages or billing events.',
      ],
    },
    {
      heading: 'What we never do',
      list: [
        'We do not sell your personal data.',
        'We do not use your prompts or completions to train models.',
        'We do not read your request bodies for marketing purposes. Access is limited to security, abuse, and support cases you ask us to investigate.',
      ],
    },
    {
      heading: 'Sub-processors',
      paragraphs: [
        'Requests are forwarded to the upstream model providers you select. Their handling of the forwarded payload is governed by their own terms. Payment processing is handled by Stripe and hosting is provided by our infrastructure provider. Each sub-processor receives only the data required for its task.',
      ],
    },
    {
      heading: 'Retention',
      paragraphs: [
        'Metadata is retained while your account is open so that billing and usage history stay auditable. Prompt and completion bodies are retained only as long as needed for the feature you are using, and are removed on account deletion. Aggregated, de-identified counters may be kept longer.',
      ],
    },
    {
      heading: 'Your choices',
      paragraphs: [
        `You can request a copy, correction or deletion of your personal data, and you can object to specific processing, by writing to ${support}. We answer verified requests within 30 days.`,
      ],
    },
    {
      heading: 'Cookies',
      paragraphs: [
        'We use strictly necessary cookies for sign-in sessions and abuse prevention. Optional analytics cookies are off until you accept them where consent is required.',
      ],
    },
    {
      heading: 'Security',
      paragraphs: [
        'Keys are stored hashed where possible, traffic is encrypted in transit, and access to production systems is restricted and logged. No system is perfect: if we ever detect a breach affecting your data we will notify you without undue delay.',
      ],
    },
    {
      heading: 'Children',
      paragraphs: [
        'The service is not directed at children under 16 and we do not knowingly collect their personal data.',
      ],
    },
    {
      heading: 'Changes and contact',
      paragraphs: [
        `We will post any material change to this policy on this page and update the date above. Questions go to ${support}.`,
      ],
    },
  ],
};

export const QuickRouterTerms: LegalDoc = {
  slug: 'terms-of-service',
  title: 'Terms of Service',
  intro: `The agreement between you and ${QuickRouterBrand.name} for use of ${QuickRouterBrand.domain} and the API gateway behind it.`,
  updated: 'Last updated: September 2026',
  sections: [
    {
      heading: 'The service',
      paragraphs: [
        `${QuickRouterBrand.name} is an API gateway. We accept requests on one OpenAI-compatible endpoint, forward them to the upstream model provider you select, and return the response to you. Model weights stay with their providers; we do not host them.`,
      ],
    },
    {
      heading: 'Your account',
      paragraphs: [
        'You are responsible for the accuracy of your account details, for keeping API keys secret and for all activity performed with them. Keys must not be embedded in public clients or committed to public repositories. Tell us immediately if a key leaks.',
      ],
    },
    {
      heading: 'Acceptable use',
      paragraphs: ['You agree not to use the service to:'],
      list: [
        'Break the law, infringe intellectual property, or process data you have no right to process.',
        'Generate malware, conduct fraud, harass people, or create sexual content involving minors.',
        'Bypass upstream provider policies, quota systems or regional restrictions.',
        'Resell access in a way that misrepresents your relationship with the upstream providers.',
        'Probe, overload or interfere with the gateway or with other customers.',
      ],
    },
    {
      heading: 'Upstream providers',
      paragraphs: [
        'Calls are also subject to the terms and policies of the provider whose model you invoke. If an upstream provider blocks a request on policy grounds, we cannot override that decision. Model availability, context windows and prices can change as providers update their catalogues.',
      ],
    },
    {
      heading: 'Billing',
      paragraphs: [
        'Subscriptions are billed in advance through Stripe and renew automatically until cancelled. Usage-based spend is drawn from your balance at the list price of the model you call. You can cancel at any time; access continues to the end of the paid period. Prices are shown before you confirm any purchase.',
      ],
    },
    {
      heading: 'Availability',
      paragraphs: [
        'We aim for high availability but the service is provided on an as-available basis. Scheduled maintenance, upstream outages and force majeure can interrupt requests. Rate limits protect the platform and are shown in the console.',
      ],
    },
    {
      heading: 'Intellectual property',
      paragraphs: [
        'You keep the rights you hold in your prompts and in the outputs you receive, subject to the upstream provider terms. We keep the rights in the gateway, its software and its branding.',
      ],
    },
    {
      heading: 'Disclaimer and liability',
      paragraphs: [
        'Model output can be wrong, incomplete or unsuitable for a given purpose. Do not rely on it as legal, medical, financial or safety-critical advice, and review outputs before you act on them. To the extent permitted by law our aggregate liability is limited to the amount you paid in the twelve months before the claim.',
      ],
    },
    {
      heading: 'Suspension and termination',
      paragraphs: [
        'We may suspend or close an account that breaches these terms, that poses a security risk, or where required by law. You may close your account at any time. Sections that by their nature should survive termination do so.',
      ],
    },
    {
      heading: 'Governing law and contact',
      paragraphs: [
        `These terms are governed by the laws of the operator's place of business, without regard to conflict of law rules. Questions and notices go to ${support}.`,
      ],
    },
  ],
};

export const QuickRouterRefund: LegalDoc = {
  slug: 'refund-policy',
  title: 'Refund Policy',
  intro: `How cancellations, refunds and billing corrections work for ${QuickRouterBrand.name} subscriptions and balances.`,
  updated: 'Last updated: September 2026',
  sections: [
    {
      heading: 'Subscriptions',
      paragraphs: [
        'Subscriptions renew automatically until you cancel. Cancel from the billing page in the console and the renewal stops immediately: you keep access until the end of the period you already paid for.',
      ],
    },
    {
      heading: 'Fourteen day refund window',
      paragraphs: [
        'If you have not consumed usage through the subscription, ask for a refund within 14 days of the charge and we cancel and refund it. A first refund on a plan is normally approved the same business day.',
      ],
    },
    {
      heading: 'Usage-based spend',
      paragraphs: [
        'Top-ups are added to a balance and spent on model calls. Spend that has already been forwarded to an upstream provider is not refundable, because the provider has already billed us for it.',
      ],
    },
    {
      heading: 'Service failures',
      paragraphs: [
        'If a request fails because of our gateway - a 5xx we returned, a timeout we caused, or a double charge - we credit the affected amount back to your balance once we confirm it in the request log.',
      ],
    },
    {
      heading: 'Wrong or duplicate charges',
      paragraphs: [
        'Duplicate charges, charges after a cancellation, and charges you do not recognise are refunded in full after verification. Card-network timing can make a refund appear up to 10 business days after we issue it.',
      ],
    },
    {
      heading: 'How to request a refund',
      paragraphs: [
        `Write to ${support} from the email address on the account and include the invoice or payment id, the date and the reason. We reply to every request and record the outcome on the invoice.`,
      ],
    },
    {
      heading: 'Chargebacks',
      paragraphs: [
        'Please contact us before filing a chargeback - almost every case is faster to resolve directly. Accounts with an open chargeback are paused until the dispute is resolved, and confirmed fraud is not eligible for a refund.',
      ],
    },
  ],
};
