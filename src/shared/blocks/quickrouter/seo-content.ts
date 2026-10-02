import { ModelRows, QuickRouterBrand } from './content';

/**
 * Content layer for the indexable guide and model-price pages.
 *
 * The marketing home page keeps the visual narrative, but every commercial
 * query it answers needs its own URL to be rankable and citable. This file
 * holds that content so the routes stay thin templates.
 */

export type SeoFaqItem = {
  question: string;
  answer: string;
};

export type SeoStep = {
  title: string;
  body: string;
  code?: string;
};

export type SeoTable = {
  headers: string[];
  rows: string[][];
};

export type SeoLink = {
  label: string;
  href: string;
  copy: string;
};

export type SeoSection = {
  heading: string;
  /** Direct answer to the heading. Kept first so answer engines can lift it. */
  answer: string;
  bullets?: string[];
  steps?: SeoStep[];
  code?: { label?: string; value: string };
  table?: SeoTable;
  links?: SeoLink[];
};

export type SeoDoc = {
  slug: string;
  title: string;
  h1: string;
  /** One-line summary used on hub and related cards. */
  card: string;
  description: string;
  intro: string;
  updated: string;
  keywords: string;
  tool?: string;
  sections: SeoSection[];
  faq: SeoFaqItem[];
};

export const SEO_UPDATED = 'Last updated: October 2026';
export const SEO_UPDATED_ISO = '2026-10-02';

const baseUrl = QuickRouterBrand.baseUrl;
const hostUrl = QuickRouterBrand.claudeBaseUrl;
const support = QuickRouterBrand.support;

export const DocsIntro = `Every guide below starts from a working install of the tool and ends with a request that actually reaches ${QuickRouterBrand.name}. One API key works across all of them, so you only create a key once.`;

export const GuideDocs: SeoDoc[] = [
  {
    slug: 'claude-code',
    title: 'Claude Code custom base URL: connect it to QuickRouter',
    h1: 'How to set a custom base URL for Claude Code',
    card: 'Point ANTHROPIC_BASE_URL at the gateway host and pin the Claude model you want to pay for.',
    description: `Set ANTHROPIC_BASE_URL and ANTHROPIC_AUTH_TOKEN so Claude Code runs through ${QuickRouterBrand.name}, with the exact values to paste, a verification step and the errors people actually hit.`,
    intro: `Claude Code reads two environment variables. Set ANTHROPIC_BASE_URL to ${hostUrl} - the host on its own, with no /v1 suffix - and set ANTHROPIC_AUTH_TOKEN to a ${QuickRouterBrand.name} API key. Restart the CLI and every request is routed through the gateway.`,
    updated: SEO_UPDATED,
    keywords:
      'claude code base url, anthropic_base_url, claude code custom api endpoint, claude code api key, claude code proxy',
    tool: 'Claude Code',
    sections: [
      {
        heading: 'What you need before you start',
        answer:
          'Four things: a working Claude Code install, Node 18 or newer, an active gateway plan and one API key. The key is created once and works for every tool on this site.',
        bullets: [
          `A ${QuickRouterBrand.name} account with an active plan - Claude Code needs an authenticated endpoint, there is no anonymous tier.`,
          'An API key from the console: open token management, add a token and copy the value once. The full key is only shown at creation time.',
          'Node.js 18+ and the Claude Code CLI. Install it with npm install -g @anthropic-ai/claude-code.',
          'A shell you can restart, so the new environment variables are picked up.',
        ],
      },
      {
        heading: 'Set the two environment variables',
        answer: `Export ANTHROPIC_BASE_URL with the host root and ANTHROPIC_AUTH_TOKEN with your key. Claude Code treats the Anthropic base URL as a host, not as an OpenAI-style path, so adding /v1 produces a 404 instead of a connection.`,
        steps: [
          {
            title: 'Open a terminal and export the variables',
            body: 'Run both lines in the shell you start Claude Code from. Use the host root, without /v1.',
            code: `export ANTHROPIC_BASE_URL="${hostUrl}"
export ANTHROPIC_AUTH_TOKEN="sk-qr-your-key"`,
          },
          {
            title: 'Optionally pin the model',
            body: 'Without a model variable Claude Code uses its own default model name. Pin the gateway model you want to pay for, so the request cannot silently fall back to a name your key does not cover.',
            code: `export ANTHROPIC_MODEL="claude-sonnet-4-5"`,
          },
          {
            title: 'Make it permanent if it works',
            body: 'Add the same lines to ~/.zshrc or ~/.bashrc after you have verified them. Store the key in your secret manager rather than in a dotfile you sync to a public repo.',
          },
          {
            title: 'Restart Claude Code',
            body: 'Environment variables are read at process start, so an already-running session keeps the old endpoint until you reopen it.',
            code: `claude "summarise this repository"`,
          },
        ],
      },
      {
        heading: 'Verify the request reaches the gateway',
        answer: `Send one prompt, then open the usage view in the console. A request that appears there with a token count and a status code came through the gateway; a response that arrives with no console entry came from somewhere else.`,
        bullets: [
          'In the console, open the usage view and look for a row with the model name you pinned and a timestamp from seconds ago.',
          'Run the built-in /status command inside Claude Code to confirm which endpoint and model the session is using.',
          'If you see the row and the answer, the wiring is done. Roll the key into your other machines the same way.',
        ],
      },
      {
        heading: 'Errors you are most likely to hit',
        answer:
          'Nearly every Claude Code connection problem is one of three things: the wrong variable name, a /v1 suffix on the Anthropic base URL, or a model name the gateway does not serve.',
        table: {
          headers: ['Symptom', 'Cause', 'Fix'],
          rows: [
            [
              '401 invalid x-api-key',
              'ANTHROPIC_AUTH_TOKEN is unset or still holds a previous provider key',
              'Set ANTHROPIC_AUTH_TOKEN to the gateway key and restart the CLI',
            ],
            [
              '404 on every request',
              `${baseUrl} was used for ANTHROPIC_BASE_URL`,
              `Use the host root ${hostUrl} instead - Claude Code adds the path itself`,
            ],
            [
              'Model not found',
              'The pinned model name is an OpenAI-style name',
              'Use the Anthropic model name shown in the console, for example claude-sonnet-4-5',
            ],
            [
              'Connection reset behind a corporate proxy',
              'The proxy intercepts TLS to the gateway host',
              'Allow-list the gateway host, or set HTTPS_PROXY for the shell',
            ],
            [
              'Empty response, no console entry',
              'The shell never picked up the exported variables',
              'Re-export them, or add them to the shell profile and open a new terminal',
            ],
          ],
        },
      },
      {
        heading: 'Which Claude model should Claude Code use?',
        answer:
          'Sonnet is the usual default for day-to-day coding, Haiku is the cheapest option for sub-agents and small edits, and Opus is reserved for the hardest reasoning steps because its output price is fifteen times Sonnet\u2019s.',
        links: [
          {
            label: 'Claude Sonnet 4.5',
            href: '/models/claude-sonnet-4-5',
            copy: '$3.00 per 1M input and $15.00 per 1M output, 200K context.',
          },
          {
            label: 'Claude Haiku 4.5',
            href: '/models/claude-haiku-4-5',
            copy: '$1.00 per 1M input and $5.00 per 1M output, 200K context.',
          },
          {
            label: 'Claude Opus 4.1',
            href: '/models/claude-opus-4-1',
            copy: '$15.00 per 1M input and $75.00 per 1M output, 200K context.',
          },
        ],
      },
    ],
    faq: [
      {
        question: 'Does Claude Code accept an OpenAI-compatible endpoint?',
        answer: `Claude Code speaks the Anthropic Messages API rather than the OpenAI chat completions shape. ${QuickRouterBrand.name} exposes both, so you keep the Anthropic variable names and point them at the gateway host.`,
      },
      {
        question: 'Should ANTHROPIC_BASE_URL end with /v1?',
        answer:
          'No. Claude Code appends the path itself, so the variable holds the host root. Adding /v1 gives you a doubled path and a 404.',
      },
      {
        question: 'Can the same key power Claude Code and Cursor?',
        answer:
          'Yes. One key covers every tool on the gateway. Cursor and similar editors take the OpenAI-style base URL with the /v1 suffix, while Claude Code takes the host root.',
      },
      {
        question: 'What does this setup cost?',
        answer:
          'Gateway plans start at $19 per month. Model usage is drawn from your balance at the upstream list price of whichever model you call, so verifying a base URL and a key costs a fraction of a cent.',
      },
    ],
  },
  {
    slug: 'cursor',
    title: 'Cursor custom OpenAI base URL: point Cursor at QuickRouter',
    h1: 'How to add a custom OpenAI base URL in Cursor',
    card: 'Set the OpenAI base URL override, then add the model names Cursor is allowed to call.',
    description: `Add a custom OpenAI base URL in Cursor so requests run through ${QuickRouterBrand.name}. The exact fields to fill, the model names to add and how to confirm every request is billed to your key.`,
    intro: `Open Cursor settings, go to Models, paste your gateway key into the OpenAI API key field and set the OpenAI base URL override to ${baseUrl}. Then add the model names you intend to call - Cursor only routes to models that are explicitly enabled in that list.`,
    updated: SEO_UPDATED,
    keywords:
      'cursor custom base url, cursor openai base url, cursor custom api key, cursor openai compatible, cursor custom model',
    tool: 'Cursor',
    sections: [
      {
        heading: 'What you need before you start',
        answer:
          'Cursor can only verify a key it can reach, so create the key first and keep the model list close by.',
        bullets: [
          `A ${QuickRouterBrand.name} account with an active plan and an API key copied from the console.`,
          `The OpenAI-style base URL: ${baseUrl}. Cursor expects the full path here, /v1 included.`,
          'The model names you plan to use, spelled exactly as the gateway serves them - gpt-5, claude-sonnet-4-5, deepseek-v3.2 and so on.',
          'A Cursor plan that allows custom API keys. Team plans can restrict this per member.',
        ],
      },
      {
        heading: 'Add the key and the base URL in Cursor',
        answer:
          'Everything happens in one settings pane. Set the key first, then the override, then enable the models, because Cursor validates the connection as you type.',
        steps: [
          {
            title: 'Open the Models pane',
            body: 'In Cursor, open Settings and select Models. The OpenAI section holds both fields you need.',
          },
          {
            title: 'Paste the API key',
            body: 'Put your gateway key in the OpenAI API key field. Cursor stores it locally and uses it for every OpenAI-shaped request.',
          },
          {
            title: 'Turn on the base URL override',
            body: 'Enable Override OpenAI Base URL and paste the full path, /v1 included.',
            code: `Override OpenAI Base URL: ${baseUrl}
API key:                  sk-qr-your-key`,
          },
          {
            title: 'Add the models you want to call',
            body: 'Add each model name to the list below the key. A model that is reachable through the gateway is still invisible to Cursor until it appears here.',
            code: `gpt-5
gpt-5-mini
claude-sonnet-4-5`,
          },
          {
            title: 'Send one request to confirm',
            body: 'Ask a short question in the chat pane, then check the usage view in the gateway console for a matching entry.',
          },
        ],
      },
      {
        heading: 'Turning off the base URL override',
        answer:
          'If you later switch back to your own provider key, disable the override first. Leaving the override on while pasting a different provider key sends that key to the wrong host and produces 401 responses that look like a billing problem.',
        bullets: [
          'Clear or disable the override, then paste the other key - the field alone does not switch the routing back.',
          'Keep a separate profile or project if you need both providers active at the same time.',
        ],
      },
      {
        heading: 'Errors you are most likely to hit',
        answer:
          'Cursor reports almost everything as a generic failure, so work through the three causes in order: wrong path, missing model, or a key the editor cannot validate.',
        table: {
          headers: ['Symptom', 'Cause', 'Fix'],
          rows: [
            [
              'Model not found or model disappears from the picker',
              'The name is not in the custom model list',
              'Add the exact gateway model name in the Models pane',
            ],
            [
              '404 from the API',
              `The override holds ${hostUrl} without the /v1 suffix`,
              `Set the override to ${baseUrl}`,
            ],
            [
              'Invalid API key',
              'The key was pasted with trailing whitespace or was truncated',
              'Paste again from the console, then use the verification button',
            ],
            [
              'Requests succeed but nothing is billed',
              'The override is off, so Cursor used its own provider',
              'Turn the override back on and re-check the console usage view',
            ],
            [
              'Tool calls stop working on a smaller model',
              'The chosen model does not expose tool calling through the gateway',
              'Switch the agent model to gpt-5 or claude-sonnet-4-5',
            ],
          ],
        },
      },
      {
        heading: 'Which model should Cursor use?',
        answer:
          'Use a fast, cheap model for inline completions and a stronger one for agent mode. The pricing difference between the two is large enough that splitting them is worth the setup.',
        links: [
          {
            label: 'GPT-5 mini',
            href: '/models/gpt-5-mini',
            copy: '$0.25 per 1M input - the cheap default for tab completion and small edits.',
          },
          {
            label: 'GPT-5',
            href: '/models/gpt-5',
            copy: '$1.25 per 1M input and $10.00 per 1M output, 400K context for agent mode.',
          },
          {
            label: 'Claude Sonnet 4.5',
            href: '/models/claude-sonnet-4-5',
            copy: '$3.00 per 1M input and $15.00 per 1M output, a common agent-mode choice.',
          },
        ],
      },
    ],
    faq: [
      {
        question: 'Does Cursor work with an OpenAI-compatible gateway?',
        answer:
          'Yes. Cursor routes custom models through the OpenAI chat completions shape, which is what the gateway exposes, so the override field is the only change you need.',
      },
      {
        question: 'Should the Cursor base URL include /v1?',
        answer: `Yes. Unlike Claude Code, Cursor expects the full path: ${baseUrl}.`,
      },
      {
        question: 'Can I use Claude models in Cursor through the gateway?',
        answer:
          'Yes. Request an Anthropic model name from the OpenAI-shaped endpoint and the gateway routes it to the matching upstream provider.',
      },
      {
        question: 'Do I need a separate key for each editor?',
        answer:
          'No. One key works across every tool on the gateway. Separate keys per tool are still useful if you want per-tool spend reporting in the console.',
      },
    ],
  },
  {
    slug: 'codex',
    title: 'Codex CLI custom base URL: run it through QuickRouter',
    h1: 'How to point the Codex CLI at a custom base URL',
    card: 'Use OPENAI_BASE_URL or a model provider block in config.toml, and keep the key in an env var.',
    description: `Point the OpenAI Codex CLI at ${QuickRouterBrand.name} with OPENAI_BASE_URL or a model provider block, including the config file, the pipe test and the errors to expect.`,
    intro: `The Codex CLI honours OPENAI_BASE_URL and OPENAI_API_KEY, so setting OPENAI_BASE_URL to ${baseUrl} is enough. If you prefer a persistent configuration, declare the gateway as a model provider in ~/.codex/config.toml and point the default provider at it.`,
    updated: SEO_UPDATED,
    keywords:
      'codex cli base url, openai_base_url codex, codex config.toml model provider, codex custom provider, codex api key',
    tool: 'Codex',
    sections: [
      {
        heading: 'What you need before you start',
        answer:
          'The Codex CLI reads plain environment variables, so the setup is short: install the CLI, create a gateway key, then choose between an environment variable and a config file.',
        bullets: [
          `A ${QuickRouterBrand.name} account with an active plan and an API key from the console.`,
          `The OpenAI-style base URL, /v1 included: ${baseUrl}.`,
          'Node.js 18+ with npm, or a package manager that can install a global CLI.',
          'A shell profile you can edit if you want the setting to survive a reboot.',
        ],
      },
      {
        heading: 'Option 1: environment variables',
        answer:
          'The fastest route. Export the two variables, then start the CLI from the same shell - Codex reads them at startup.',
        steps: [
          {
            title: 'Export the base URL and key',
            body: 'Run both lines in the terminal you use for Codex.',
            code: `export OPENAI_BASE_URL="${baseUrl}"
export OPENAI_API_KEY="sk-qr-your-key"`,
          },
          {
            title: 'Run a first task',
            body: 'Start with something small and read-only so you can confirm the wiring before it edits files.',
            code: `codex "list the files in this repository and summarise the build"`,
          },
        ],
      },
      {
        heading: 'Option 2: a persistent provider in config.toml',
        answer:
          'Declare the gateway once in ~/.codex/config.toml and select it as the default provider. The file survives new shells, which is what you want on a work machine.',
        steps: [
          {
            title: 'Add the provider block',
            body: 'Use the chat wire API for an OpenAI-compatible endpoint and keep the key in an environment variable rather than in the file.',
            code: `[model_providers.quickrouter]
name = "QuickRouter"
base_url = "${baseUrl}"
env_key = "OPENAI_API_KEY"
wire_api = "chat"

[profiles.quickrouter]
model_provider = "quickrouter"
model = "gpt-5"`,
          },
          {
            title: 'Select the profile',
            body: 'Start Codex with the profile so the gateway becomes the active provider for that session.',
            code: `codex --profile quickrouter "summarise the open issues"`,
          },
        ],
      },
      {
        heading: 'Errors you are most likely to hit',
        answer:
          'Configuration mistakes in Codex surface as connection errors during startup, before any model call happens.',
        table: {
          headers: ['Symptom', 'Cause', 'Fix'],
          rows: [
            [
              'Connection error on start',
              'The base URL is missing /v1',
              `Set OPENAI_BASE_URL to ${baseUrl}`,
            ],
            [
              '401 from the provider',
              'OPENAI_API_KEY still holds another provider key',
              'Export the gateway key in the same shell that starts Codex',
            ],
            [
              'Unknown provider in the config',
              'The profile references a provider that is not declared',
              'Keep the model_providers key and the profile name identical',
            ],
            [
              'Empty completions on a small model',
              'The model does not support the tool protocol Codex uses',
              'Point the profile at gpt-5 or gpt-5-mini',
            ],
            [
              'Settings ignored after a restart',
              'The exports were typed into a shell that has since closed',
              'Move them into ~/.zshrc, or use the config.toml provider',
            ],
          ],
        },
      },
      {
        heading: 'Which model should Codex use?',
        answer:
          'Codex spends most of its tokens re-reading context, so the input price dominates the bill. A cheap input model with a long context window is usually the better default than the flagship.',
        links: [
          {
            label: 'GPT-5',
            href: '/models/gpt-5',
            copy: '$1.25 per 1M input, 400K context - the strongest reasoning option.',
          },
          {
            label: 'GPT-5 mini',
            href: '/models/gpt-5-mini',
            copy: '$0.25 per 1M input - five times cheaper for the same 400K context.',
          },
          {
            label: 'DeepSeek V3.2',
            href: '/models/deepseek-v3-2',
            copy: '$0.28 per 1M input and $0.42 per 1M output - the cheapest output in the catalogue.',
          },
        ],
      },
    ],
    faq: [
      {
        question: 'Which environment variable does the Codex CLI read?',
        answer:
          'OPENAI_BASE_URL for the endpoint and OPENAI_API_KEY for the credential. Both are read at process start, so export them before launching Codex.',
      },
      {
        question: 'Should the Codex base URL include /v1?',
        answer: `Yes. Codex expects the OpenAI-style path: ${baseUrl}.`,
      },
      {
        question: 'Can I keep the API key out of config.toml?',
        answer:
          'Yes, and you should. Use the env_key field so the file only names the variable, and keep the value in your shell profile or secret manager.',
      },
      {
        question: 'Does the same key work for Claude Code and Codex?',
        answer:
          'Yes. Each tool takes a different base URL format, but the key itself is shared across every tool on the gateway.',
      },
    ],
  },
  {
    slug: 'opencode',
    title: 'opencode custom provider: add QuickRouter to opencode.json',
    h1: 'How to add a custom provider in opencode',
    card: 'Register the gateway as an OpenAI-compatible provider in opencode.json and pick models per agent.',
    description: `Register ${QuickRouterBrand.name} as an OpenAI-compatible provider in opencode, pick models per agent and confirm that opencode is routing through the gateway.`,
    intro: `opencode reads providers from opencode.json. Add an entry that uses the OpenAI-compatible provider package with baseURL set to ${baseUrl}, then list the models you want available. Nothing else in your configuration changes.`,
    updated: SEO_UPDATED,
    keywords:
      'opencode custom provider, opencode.json provider, opencode openai compatible, opencode base url, opencode api key',
    tool: 'opencode',
    sections: [
      {
        heading: 'What you need before you start',
        answer:
          'opencode is configured through a JSON file, so the work happens in your editor rather than in a settings screen.',
        bullets: [
          `A ${QuickRouterBrand.name} account with an active plan and an API key from the console.`,
          `The base URL ${baseUrl} - opencode expects the OpenAI-style path.`,
          'opencode installed and run at least once, so it has created its config directory.',
          'Write access to opencode.json in the project root or in the global config directory.',
        ],
      },
      {
        heading: 'Register the provider',
        answer:
          'Add the provider under the provider key. The npm field tells opencode which SDK to load, and options carries the endpoint and credential.',
        steps: [
          {
            title: 'Open opencode.json',
            body: 'Create the file in the project root if it does not exist, or edit the global config to make the provider available in every project.',
            code: `{
  "provider": {
    "quickrouter": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "QuickRouter",
      "options": {
        "baseURL": "${baseUrl}",
        "apiKey": "sk-qr-your-key"
      },
      "models": {
        "gpt-5": { "name": "GPT-5" },
        "claude-sonnet-4-5": { "name": "Claude Sonnet 4.5" },
        "deepseek-v3-2": { "name": "DeepSeek V3.2" }
      }
    }
  }
}`,
          },
          {
            title: 'Reference the provider in an agent',
            body: 'A model id is written as provider/model, so the gateway entry is selected explicitly rather than by guessing a default.',
            code: `{
  "agent": {
    "build": { "model": "quickrouter/gpt-5" }
  }
}`,
          },
          {
            title: 'Confirm the route',
            body: 'Start opencode and run a short prompt, then check the console usage view for the matching request.',
          },
        ],
      },
      {
        heading: 'Errors you are most likely to hit',
        answer:
          'Because opencode validates the config at load time, a mistake in the JSON shows up immediately rather than as a network error later.',
        table: {
          headers: ['Symptom', 'Cause', 'Fix'],
          rows: [
            [
              'Provider not found',
              'The agent references a provider key that is not declared',
              'Use the same key in provider and in the agent model string',
            ],
            [
              'Config fails to parse',
              'Trailing comma or an unquoted model id in opencode.json',
              'Validate the file as JSON before restarting',
            ],
            [
              '404 from the endpoint',
              'baseURL points at the host root',
              `Set baseURL to ${baseUrl}`,
            ],
            [
              '401 from the endpoint',
              'The apiKey value was edited by hand and lost characters',
              'Paste the key again from the console',
            ],
            [
              'Model works in chat but not in an agent',
              'The model is not listed under the provider models',
              'Add the model id under models, then restart opencode',
            ],
          ],
        },
      },
      {
        heading: 'Which models should opencode use?',
        answer:
          'Split roles rather than picking one model for everything: a strong planner for the main agent and a cheaper model for search and summarisation steps.',
        links: [
          {
            label: 'GPT-5',
            href: '/models/gpt-5',
            copy: '$1.25 per 1M input, 400K context - a good planner default.',
          },
          {
            label: 'Claude Sonnet 4.5',
            href: '/models/claude-sonnet-4-5',
            copy: '$3.00 per 1M input and $15.00 per 1M output, 200K context.',
          },
          {
            label: 'GPT-5 mini',
            href: '/models/gpt-5-mini',
            copy: '$0.25 per 1M input - keep the expensive model for the hard steps.',
          },
        ],
      },
    ],
    faq: [
      {
        question: 'Which package does the provider need?',
        answer:
          'The OpenAI-compatible SDK, referenced as @ai-sdk/openai-compatible. opencode installs it from the npm field in your provider entry.',
      },
      {
        question: 'Can I keep the key out of opencode.json?',
        answer:
          'Yes. Read it from an environment variable in your shell and reference that variable from your own tooling, or keep the file out of version control so the literal never leaves your machine.',
      },
      {
        question: 'Should the base URL include /v1?',
        answer: `Yes. opencode expects the OpenAI-style path: ${baseUrl}.`,
      },
      {
        question: 'Does opencode work with Claude models through the gateway?',
        answer:
          'Yes. Model names are routed upstream by the gateway, so an Anthropic model id works through the same OpenAI-compatible provider entry.',
      },
    ],
  },
  {
    slug: 'cherry-studio',
    title: 'Cherry Studio custom API host: add QuickRouter as a provider',
    h1: 'How to add a custom API host in Cherry Studio',
    card: 'Add a custom OpenAI-compatible provider to the desktop client, then list the models you want.',
    description: `Add ${QuickRouterBrand.name} to Cherry Studio as an OpenAI-compatible provider: the API host, the key, the model list and how to check a desktop client is routed correctly.`,
    intro: `Cherry Studio lets you add a provider that speaks the OpenAI protocol. Create the provider, set the API host to ${baseUrl} and paste your gateway key, then add the model ids you want in the chat model picker.`,
    updated: SEO_UPDATED,
    keywords:
      'cherry studio custom api host, cherry studio openai compatible, cherry studio add provider, cherry studio api key, cherry studio base url',
    tool: 'Cherry Studio',
    sections: [
      {
        heading: 'What you need before you start',
        answer:
          'Cherry Studio is a desktop client, so the key lives in the app rather than in a dotfile - which makes cleaning up after a shared machine more important, not less.',
        bullets: [
          `A ${QuickRouterBrand.name} account with an active plan and an API key from the console.`,
          `The API host ${baseUrl} - Cherry Studio expects the OpenAI-style path.`,
          'The model ids you plan to use, spelled as the gateway serves them.',
          'A Cherry Studio version recent enough to support custom OpenAI-compatible providers.',
        ],
      },
      {
        heading: 'Add the provider',
        answer:
          'Everything happens in one settings screen. Set the host and key first, then add models, because the model list is what the chat picker reads.',
        steps: [
          {
            title: 'Open the provider list',
            body: 'In Cherry Studio, open Settings and go to Model providers. Add a new provider and choose the OpenAI-compatible type.',
          },
          {
            title: 'Fill in the host and key',
            body: 'Paste the full path, /v1 included, and your gateway key.',
            code: `API host: ${baseUrl}
API key:  sk-qr-your-key`,
          },
          {
            title: 'Add the models',
            body: 'Add each model id you want to call. A model that is reachable through the gateway is invisible in the chat picker until it is listed here.',
            code: `gpt-5
claude-sonnet-4-5
gemini-2-5-pro`,
          },
          {
            title: 'Send a test message',
            body: 'Pick the new provider in a chat, send one message and confirm the request appears in the gateway console usage view.',
          },
        ],
      },
      {
        heading: 'Errors you are most likely to hit',
        answer:
          'Desktop clients hide the underlying HTTP status behind a generic toast, so test the same key with a curl request before you start changing settings at random.',
        table: {
          headers: ['Symptom', 'Cause', 'Fix'],
          rows: [
            [
              'The provider shows no models',
              'No model ids were added to the provider',
              'Add the ids manually - the gateway does not push a model list into the picker',
            ],
            [
              '404 from the API',
              `The host field holds ${hostUrl} without /v1`,
              `Set the API host to ${baseUrl}`,
            ],
            [
              '401 or invalid key',
              'The key was trimmed when copied from the console',
              'Paste again and avoid editing the middle of the string',
            ],
            [
              'Streaming stops mid-answer',
              'A local proxy or VPN is buffering the connection',
              'Disable the interceptor and retry the same prompt',
            ],
            [
              'Images fail on a text model',
              'The selected model does not accept image input',
              'Switch to a vision-capable model id from the catalogue',
            ],
          ],
        },
      },
      {
        heading: 'Which models should Cherry Studio use?',
        answer:
          'A desktop client is usually a comparison surface, so keep two or three models from different vendors in the list rather than one per vendor.',
        links: [
          {
            label: 'GPT-5',
            href: '/models/gpt-5',
            copy: '$1.25 per 1M input and $10.00 per 1M output, 400K context.',
          },
          {
            label: 'Gemini 2.5 Pro',
            href: '/models/gemini-2-5-pro',
            copy: '$1.25 per 1M input with a 1M token context window.',
          },
          {
            label: 'DeepSeek V3.2',
            href: '/models/deepseek-v3-2',
            copy: '$0.28 per 1M input - the cheapest way to run bulk prompts.',
          },
        ],
      },
    ],
    faq: [
      {
        question: 'Does Cherry Studio support OpenAI-compatible providers?',
        answer:
          'Yes. Add a provider and choose the OpenAI-compatible type, which is what the gateway exposes.',
      },
      {
        question: 'Why are no models showing after I add the key?',
        answer:
          'Cherry Studio reads the provider model list from your configuration, not from the endpoint, so you add the model ids yourself.',
      },
      {
        question: 'Should the API host include /v1?',
        answer: `Yes. Cherry Studio expects the OpenAI-style path: ${baseUrl}.`,
      },
      {
        question: 'Is my key stored locally?',
        answer:
          'Cherry Studio keeps provider credentials on the machine where it runs. Treat a shared or borrowed machine as a machine you need to clear before you hand it back.',
      },
    ],
  },
  {
    slug: 'trae',
    title: 'Trae custom model provider: connect it to QuickRouter',
    h1: 'How to add a custom model provider in Trae',
    card: 'Configure a custom model provider and confirm the session is not falling back to a built-in model.',
    description: `Configure Trae with an OpenAI-compatible provider so requests run through ${QuickRouterBrand.name}, including the base URL, the model ids and the checks that prove the route is live.`,
    intro: `Trae accepts custom model providers through its AI settings. Add an OpenAI-compatible provider, set the base URL to ${baseUrl}, paste your gateway key and add the model ids you want in the model selector.`,
    updated: SEO_UPDATED,
    keywords:
      'trae custom model provider, trae openai compatible, trae base url, trae api key, trae custom api',
    tool: 'Trae',
    sections: [
      {
        heading: 'What you need before you start',
        answer:
          'Trae has both packaged and custom model paths. Only the custom path lets you point at your own endpoint, so start there.',
        bullets: [
          `A ${QuickRouterBrand.name} account with an active plan and an API key from the console.`,
          `The base URL ${baseUrl} for an OpenAI-compatible provider entry.`,
          'The model ids you plan to use, for example gpt-5, claude-sonnet-4-5 or deepseek-v3.2.',
          'A Trae build that exposes custom providers in its AI settings; older builds hide the option.',
        ],
      },
      {
        heading: 'Add the gateway as a custom provider',
        answer:
          'Add the provider in the AI settings, then select it in the model picker. Providers that are configured but not selected stay unused.',
        steps: [
          {
            title: 'Open the AI settings',
            body: 'In Trae, open Settings and find the section that lists model providers, then add a custom or OpenAI-compatible provider.',
          },
          {
            title: 'Enter the endpoint and key',
            body: 'Use the full OpenAI-style path and your gateway key.',
            code: `Base URL: ${baseUrl}
API key:  sk-qr-your-key`,
          },
          {
            title: 'Add model ids',
            body: 'Register each model you want selectable. Names must match how the gateway serves them.',
            code: `gpt-5
claude-sonnet-4-5
deepseek-v3.2`,
          },
          {
            title: 'Select it in a session',
            body: 'Choose the new provider and model in the chat panel, send a short prompt, then confirm the request in the gateway console usage view.',
          },
        ],
      },
      {
        heading: 'Errors you are most likely to hit',
        answer:
          'The common failure here is configuration drift: the provider is created correctly but the session is still using a built-in model.',
        table: {
          headers: ['Symptom', 'Cause', 'Fix'],
          rows: [
            [
              'Still billed by another provider',
              'The session is using a built-in model',
              'Select the custom provider in the model picker before prompting',
            ],
            [
              '404 from the API',
              'The base URL is missing /v1',
              `Set the base URL to ${baseUrl}`,
            ],
            [
              '401 or invalid key',
              'The key was pasted into the wrong provider entry',
              'Re-copy the key and paste it into the custom provider only',
            ],
            [
              'Tool calls fail on a reasoning model',
              'The model does not expose tool calling through the gateway',
              'Pick gpt-5, gpt-5-mini or claude-sonnet-4-5 for tool-heavy work',
            ],
            [
              'The provider disappears after an update',
              'An editor update reset its provider store',
              'Re-add the provider and keep the values in your notes or secret manager',
            ],
          ],
        },
      },
      {
        heading: 'Which models should Trae use?',
        answer:
          'Editor agents alternate between long context reads and short edits, so pair a long-context model for reading with a cheaper one for the edits.',
        links: [
          {
            label: 'Claude Sonnet 4.5',
            href: '/models/claude-sonnet-4-5',
            copy: '$3.00 per 1M input and $15.00 per 1M output, 200K context.',
          },
          {
            label: 'GPT-5 mini',
            href: '/models/gpt-5-mini',
            copy: '$0.25 per 1M input with the same 400K context as GPT-5.',
          },
          {
            label: 'DeepSeek V3.2',
            href: '/models/deepseek-v3-2',
            copy: '$0.28 per 1M input and $0.42 per 1M output, 128K context.',
          },
        ],
      },
    ],
    faq: [
      {
        question: 'Can Trae use a custom OpenAI-compatible endpoint?',
        answer:
          'Yes, through the custom provider option in its AI settings. The packaged model list does not accept a custom endpoint.',
      },
      {
        question: 'Should the base URL include /v1?',
        answer: `Yes. Set the base URL to ${baseUrl}.`,
      },
      {
        question: 'Why does the gateway console show no requests?',
        answer:
          'The session is probably still using a built-in model. Select the custom provider in the model picker and send another prompt.',
      },
      {
        question: 'Where do I get help with a tool that will not connect?',
        answer: `Mail ${support} with the tool name, the exact error text and the request id when you have one. A trailing /v1 or a key copied with whitespace explains most of these reports.`,
      },
    ],
  },
];

export function getGuideDoc(slug: string): SeoDoc | undefined {
  return GuideDocs.find((doc) => doc.slug === slug);
}

/**
 * Unique editorial content for the model price pages. Prices and context
 * windows are read from ModelRows so the price tables stay in one place.
 */
export type ModelCopy = {
  /** Model id as passed in the request body - the console lists the live ids. */
  modelId: string;
  summary: string;
  pickWhen: string[];
  tradeoffs: string[];
  bestFor: string;
  faq: SeoFaqItem[];
};

export const ModelCopyByModel: Record<string, ModelCopy> = {
  'GPT-5': {
    modelId: 'gpt-5',
    summary:
      'GPT-5 is the flagship model in the OpenAI family on this gateway, with a 400K context window and the highest output price of the GPT-5 tier.',
    pickWhen: [
      'The task needs multi-step reasoning that a smaller model gets wrong, such as planning a refactor across several files.',
      'A single request has to carry a large amount of context - a long repository summary or a lengthy specification.',
      'You are running an agent loop where a wrong tool call costs more than the tokens do.',
    ],
    tradeoffs: [
      'Output costs eight times as much as input, so long generated answers drive the bill more than long prompts.',
      'GPT-5 mini shares the same 400K context window at a fifth of the input price, which makes mini the better default for high-volume work.',
    ],
    bestFor:
      'Agentic coding, multi-step analysis and the reasoning steps you would rather not retry.',
    faq: [
      {
        question: 'How much does GPT-5 cost through the gateway?',
        answer:
          'List price on this gateway is $1.25 per 1M input tokens and $10.00 per 1M output tokens, with a 400K token context window. Usage is drawn from your balance at that rate.',
      },
      {
        question: 'When should I use GPT-5 mini instead?',
        answer:
          'When throughput matters more than the last few points of quality. Mini has the same 400K window and costs $0.25 per 1M input, so it is a much cheaper default for bulk work.',
      },
      {
        question: 'Which tools work well with GPT-5?',
        answer:
          'Coding agents that use the OpenAI-compatible protocol: Codex, Cursor, opencode and Cherry Studio all route to it through the same key.',
      },
    ],
  },
  'GPT-5 mini': {
    modelId: 'gpt-5-mini',
    summary:
      'GPT-5 mini keeps the 400K context window of the flagship at roughly a fifth of the input price, which makes it the default for high-volume and high-concurrency work.',
    pickWhen: [
      'You are classifying, extracting or summarising at scale, where the cost per call matters more than the last increment of quality.',
      'You need a long context window but you are reading far more tokens than you generate.',
      'You are building a sub-agent or an editor helper that runs on every keystroke or save.',
    ],
    tradeoffs: [
      'Harder multi-step reasoning degrades earlier than on the flagship, so escalate the hard cases rather than retrying them.',
      'Output still costs eight times input, so cap generated length when you are producing long documents.',
    ],
    bestFor:
      'Bulk extraction, retrieval summaries and the cheap half of a two-model agent setup.',
    faq: [
      {
        question: 'How much does GPT-5 mini cost?',
        answer:
          'List price on this gateway is $0.25 per 1M input tokens and $2.00 per 1M output tokens, with a 400K token context window.',
      },
      {
        question: 'Is GPT-5 mini good enough for coding agents?',
        answer:
          'It handles routine edits and searches well and is a common choice for the cheaper role in a two-model setup. Keep a stronger model for planning and for changes that touch several files.',
      },
      {
        question: 'Does the same API key cover GPT-5 mini?',
        answer:
          'Yes. One key covers every model on the gateway, so you can switch model names without changing credentials.',
      },
    ],
  },
  'Claude Sonnet 4.5': {
    modelId: 'claude-sonnet-4-5',
    summary:
      'Claude Sonnet 4.5 sits in the middle of the Anthropic range at $3.00 per 1M input tokens, and it is the model most Claude Code users keep as their default.',
    pickWhen: [
      'You are running an Anthropic-style coding agent and want one model for both planning and editing.',
      'You want stronger instruction-following on long documents than a small model gives you, without Opus pricing.',
      'Your workload mixes chat, code and tool calls, and you would rather not split models by task type.',
    ],
    tradeoffs: [
      'At $15.00 per 1M output tokens it costs five times what GPT-5 mini costs, so it rewards workloads with short answers.',
      'The 200K context window is smaller than the 400K and 1M windows elsewhere in the catalogue, so very large inputs need chunking or a different model.',
    ],
    bestFor:
      'Claude Code sessions, long-document editing and tool-calling agents that need reliable instruction following.',
    faq: [
      {
        question: 'How much does Claude Sonnet 4.5 cost?',
        answer:
          'List price on this gateway is $3.00 per 1M input tokens and $15.00 per 1M output tokens, with a 200K token context window.',
      },
      {
        question: 'How do I use it in Claude Code?',
        answer:
          'Set ANTHROPIC_BASE_URL to the gateway host and pin ANTHROPIC_MODEL to claude-sonnet-4-5. The step-by-step walkthrough is in the Claude Code guide.',
      },
      {
        question: 'Can I call Sonnet 4.5 from an OpenAI-style SDK?',
        answer:
          'Yes. Request the model name from the OpenAI-compatible endpoint and the gateway routes it to Anthropic upstream.',
      },
    ],
  },
  'Claude Opus 4.1': {
    modelId: 'claude-opus-4-1',
    summary:
      'Claude Opus 4.1 is the most expensive model on the gateway at $15.00 per 1M input and $75.00 per 1M output tokens, positioned for work where a retry costs more than the tokens.',
    pickWhen: [
      'A single hard reasoning step is blocking a pipeline and a wrong answer is genuinely expensive.',
      'You are validating a smaller model\u2019s output on a sample of cases rather than running it in production.',
      'You need the strongest Anthropic model available for a narrow, well-specified job.',
    ],
    tradeoffs: [
      'Output is 25 times the input price, so an unbounded generation can dwarf everything else in your monthly spend.',
      'For most production traffic Sonnet 4.5 or Haiku 4.5 returns a better cost per resolved task.',
    ],
    bestFor:
      'Escalation paths, hard evaluation cases and one-off analysis where quality is the only constraint.',
    faq: [
      {
        question: 'How much does Claude Opus 4.1 cost?',
        answer:
          'List price on this gateway is $15.00 per 1M input tokens and $75.00 per 1M output tokens, with a 200K token context window.',
      },
      {
        question: 'Should I use Opus for production traffic?',
        answer:
          'Usually not by default. Route the hard cases to it and keep the bulk on Sonnet or Haiku, where the same task often resolves for a fraction of the cost.',
      },
      {
        question: 'Can I switch to Opus without a new key?',
        answer:
          'Yes. Changing the model name in the request is the only change required.',
      },
    ],
  },
  'Claude Haiku 4.5': {
    modelId: 'claude-haiku-4-5',
    summary:
      'Claude Haiku 4.5 is the cheapest Anthropic model on the gateway at $1.00 per 1M input tokens, and it is the natural choice for the many small calls an agent makes.',
    pickWhen: [
      'You are running sub-agents, file summaries or search steps that do not need deep reasoning.',
      'You want Anthropic model behaviour at a price that makes retries affordable.',
      'You are moderating, tagging or routing traffic before it reaches an expensive model.',
    ],
    tradeoffs: [
      'Long chains of dependent reasoning still work better on Sonnet, so keep the escalate path available.',
      'Output at $5.00 per 1M tokens is five times the input rate, which punishes prompts that ask for long answers.',
    ],
    bestFor:
      'High-frequency small calls, classification and the cheap role in a two-model Claude setup.',
    faq: [
      {
        question: 'How much does Claude Haiku 4.5 cost?',
        answer:
          'List price on this gateway is $1.00 per 1M input tokens and $5.00 per 1M output tokens, with a 200K token context window.',
      },
      {
        question: 'Can Haiku replace Sonnet?',
        answer:
          'For short, well-scoped tasks often yes; for multi-step agent loops it is better used as the cheap step with Sonnet as the fallback.',
      },
      {
        question: 'Is Haiku available in Claude Code?',
        answer:
          'Yes. Set ANTHROPIC_MODEL to claude-haiku-4-5 for a session, or switch models from inside the CLI.',
      },
    ],
  },
  'Gemini 2.5 Pro': {
    modelId: 'gemini-2.5-pro',
    summary:
      'Gemini 2.5 Pro pairs a 1M token context window with the same input price as GPT-5, which makes it the practical option for inputs that are simply too large for other models.',
    pickWhen: [
      'A single request has to hold an entire codebase, a long transcript or a large document set.',
      'You want to avoid building a chunking and retrieval pipeline for a one-off analysis.',
      'You are comparing vendor output on the same long input and want to hold everything else constant.',
    ],
    tradeoffs: [
      'Filling a 1M token context costs $1.25 on input alone before any output is generated, so measure the call rather than assuming it is cheap.',
      'Long contexts raise latency, which matters for interactive tools even when the price is acceptable.',
    ],
    bestFor:
      'Whole-repository analysis, long-document reasoning and one-shot jobs where chunking would lose the point.',
    faq: [
      {
        question: 'How much does Gemini 2.5 Pro cost?',
        answer:
          'List price on this gateway is $1.25 per 1M input tokens and $10.00 per 1M output tokens, with a 1M token context window.',
      },
      {
        question: 'How much does a full 1M token prompt cost?',
        answer:
          'About $1.25 at list price for the input alone, plus whatever the model generates as output.',
      },
      {
        question: 'When is Gemini 2.5 Flash the better choice?',
        answer:
          'When you want the same 1M window at a fraction of the input price for extraction and classification work that does not need deep reasoning.',
      },
    ],
  },
  'Gemini 2.5 Flash': {
    modelId: 'gemini-2.5-flash',
    summary:
      'Gemini 2.5 Flash offers the 1M token context window of the Pro model at $0.30 per 1M input tokens, which makes long-input workloads affordable at volume.',
    pickWhen: [
      'You are extracting fields from long documents at scale rather than reasoning over them.',
      'You want a large context window on a budget for classification, tagging or summarisation.',
      'You are prototyping a pipeline and want to see cost per thousand calls before switching to a stronger model.',
    ],
    tradeoffs: [
      'Reasoning depth is lower than the Pro tier, so keep an escalation path for the cases it gets wrong.',
      'A 1M window at $0.30 per 1M tokens still costs real money at volume - measure before you assume the price is negligible.',
    ],
    bestFor:
      'Large-scale extraction, document summarisation and the first pass of any long-input pipeline.',
    faq: [
      {
        question: 'How much does Gemini 2.5 Flash cost?',
        answer:
          'List price on this gateway is $0.30 per 1M input tokens and $2.50 per 1M output tokens, with a 1M token context window.',
      },
      {
        question: 'Is Flash good enough for long-document work?',
        answer:
          'For extraction and summarisation it is usually sufficient. For reasoning across the whole document, run the Pro model on the subset that Flash flags as hard.',
      },
      {
        question: 'Can I mix Flash and Pro in one pipeline?',
        answer:
          'Yes. Both models are reached with the same key, so switching is a model-name change rather than a second integration.',
      },
    ],
  },
  'DeepSeek V3.2': {
    modelId: 'deepseek-v3.2',
    summary:
      'DeepSeek V3.2 has the cheapest output price on the gateway at $0.42 per 1M tokens, which changes which workloads are economically viable in the first place.',
    pickWhen: [
      'You are generating a lot of text rather than reading it, so the output price dominates the bill.',
      'You are running bulk jobs - enrichment, drafting, translation - where a per-call cost above a fraction of a cent kills the idea.',
      'You want a cheap default for internal tools that have no revenue attached to each call.',
    ],
    tradeoffs: [
      'The context window is 128K, which is smaller than the 400K and 1M windows elsewhere in the catalogue.',
      'Frontier-level reasoning is better served by a stronger model, so pair it with an escalation path for the hard 5%.',
    ],
    bestFor:
      'Bulk generation, enrichment pipelines and internal tooling where unit cost sets the ceiling.',
    faq: [
      {
        question: 'How much does DeepSeek V3.2 cost?',
        answer:
          'List price on this gateway is $0.28 per 1M input tokens and $0.42 per 1M output tokens, with a 128K token context window.',
      },
      {
        question: 'Why is the output price the one that matters here?',
        answer:
          'Because $0.42 per 1M tokens is low enough that generated length stops driving your bill, which is the opposite of how the flagship models behave.',
      },
      {
        question: 'Does DeepSeek work with the OpenAI SDK?',
        answer:
          'Yes. It is served through the same OpenAI-compatible endpoint, so existing code only needs the new base URL, key and model name.',
      },
    ],
  },
  'Grok 4': {
    modelId: 'grok-4',
    summary:
      'Grok 4 combines a 256K context window with $3.00 per 1M input and $15.00 per 1M output tokens, the same price band as Claude Sonnet 4.5.',
    pickWhen: [
      'You want to compare vendors on the same task and the same budget rather than only on price.',
      'You need a 256K window - larger than the Anthropic models, smaller than the 1M options.',
      'Your workload mixes long-context reading with a moderate amount of generation.',
    ],
    tradeoffs: [
      'At the same price as Sonnet 4.5 the choice comes down to output quality and tool behaviour, so test both on your own cases.',
      'The cheaper Grok 4 Fast sits alongside it in the catalogue when throughput matters more than depth.',
    ],
    bestFor:
      'Vendor comparison runs, 256K-context analysis and workloads already built around xAI output.',
    faq: [
      {
        question: 'How much does Grok 4 cost?',
        answer:
          'List price on this gateway is $3.00 per 1M input tokens and $15.00 per 1M output tokens, with a 256K token context window.',
      },
      {
        question: 'How does Grok 4 compare with Grok 4 Fast?',
        answer:
          'Grok 4 Fast is priced far lower per token and carries a larger advertised window, so it suits high-volume work while Grok 4 suits deeper reasoning.',
      },
      {
        question: 'Can I run a GPT-5 and Grok comparison with one key?',
        answer:
          'Yes. Both models are reached through the same endpoint, so a comparison is a model-name change in the same request shape.',
      },
    ],
  },
};

export type ModelDoc = {
  slug: string;
  vendor: string;
  model: string;
  modelId: string;
  context: string;
  input: string;
  output: string;
  inputUsd: number;
  outputUsd: number;
  title: string;
  h1: string;
  description: string;
  intro: string;
  updated: string;
  keywords: string;
  copy: ModelCopy;
};

function usd(value: string): number {
  return Number.parseFloat(value.replace(/[^0-9.]/g, ''));
}

export const ModelDocs: ModelDoc[] = Object.entries(ModelCopyByModel)
  .map(([model, copy]) => {
    const row = ModelRows.find((item) => item.model === model);
    if (!row || !row.slug) return undefined;

    const inputUsd = usd(row.input);
    const outputUsd = usd(row.output);

    return {
      slug: row.slug,
      vendor: row.vendor,
      model: row.model,
      modelId: copy.modelId,
      context: row.context,
      input: row.input,
      output: row.output,
      inputUsd,
      outputUsd,
      title: `${row.model} API price: ${row.input} / 1M input tokens on QuickRouter`,
      h1: `${row.model} API pricing`,
      description: `${row.model} through ${QuickRouterBrand.name}: ${row.input} per 1M input tokens, ${row.output} per 1M output tokens and a ${row.context} context window, on one OpenAI-compatible endpoint.`,
      intro: `${row.model} costs ${row.input} per 1M input tokens and ${row.output} per 1M output tokens on this gateway, with a ${row.context} token context window. You reach it with the same key and the same OpenAI-compatible base URL as every other model in the catalogue.`,
      updated: SEO_UPDATED,
      keywords: `${row.model.toLowerCase()} api price, ${row.model.toLowerCase()} pricing per 1m tokens, ${row.model.toLowerCase()} api key, ${row.model.toLowerCase()} context window, ${row.vendor.toLowerCase()} api gateway`,
      copy,
    } satisfies ModelDoc;
  })
  .filter((doc): doc is ModelDoc => Boolean(doc));

export function getModelDoc(slug: string): ModelDoc | undefined {
  return ModelDocs.find((doc) => doc.slug === slug);
}

/** Builds the standard conversational cost examples shown on a model page. */
export function modelCostExamples(doc: ModelDoc) {
  /** A typical request: 5,000 input tokens and 1,500 output tokens. */
  const perCall =
    (5000 / 1_000_000) * doc.inputUsd + (1500 / 1_000_000) * doc.outputUsd;

  return {
    perCall,
    perThousand: perCall * 1000,
    /** 10M input + 2M output tokens in a month. */
    monthly: 10 * doc.inputUsd + 2 * doc.outputUsd,
    /** 100M input + 20M output tokens in a month. */
    heavyMonthly: 100 * doc.inputUsd + 20 * doc.outputUsd,
  };
}

export const LearnDoc: SeoDoc = {
  slug: 'what-is-an-llm-api-gateway',
  title: 'What is an LLM API gateway? Definition, use cases and pricing',
  h1: 'What is an LLM API gateway?',
  card: 'One endpoint, one key and one bill in front of many providers - and when that layer is worth it.',
  description:
    'An LLM API gateway puts one endpoint, one key and one bill in front of many model providers. Here is what it does, when it is worth it and what to check before choosing one.',
  intro:
    'An LLM API gateway is a service that sits between your application and several model providers. Your code sends OpenAI-shaped requests to one base URL with one API key, and the gateway routes each request to whichever provider serves the model you named, then reports usage in one place.',
  updated: SEO_UPDATED,
  keywords:
    'what is an llm api gateway, llm gateway, api gateway for llm, openai compatible base url, llm router, model gateway, one api key multiple models',
  sections: [
    {
      heading: 'What does an LLM API gateway actually do?',
      answer:
        'It does four jobs: it authenticates your requests, it routes each one to the provider that serves the requested model, it normalises the request and response shapes, and it records token usage so the cost lands on one balance.',
      bullets: [
        'Authentication and key management - one credential instead of one per provider.',
        'Routing - the model name in the request decides which upstream endpoint is called.',
        'Protocol translation - OpenAI-shaped requests are translated to providers that use a different wire format, such as Anthropic.',
        'Metering and billing - token counts, per-request detail and a single balance rather than several invoices.',
        'Operational controls - rate limits, retries and failover when an upstream provider degrades.',
      ],
    },
    {
      heading: 'Why not call each provider directly?',
      answer:
        'Calling providers directly is fine until you need a second vendor. At that point you take on a second SDK, a second key store and a second invoice, and every experiment becomes an integration project instead of a configuration change.',
      bullets: [
        'Switching models becomes a one-line change rather than a new SDK and a new billing relationship.',
        'Comparison work stops being biased by whichever provider was easiest to wire up first.',
        'Credential handling stays in one place, which matters when several tools share the same budget.',
        'Spend is attributable per key and per request, so a runaway job is visible instead of absorbed.',
      ],
    },
    {
      heading: 'What does "OpenAI-compatible base URL" mean?',
      answer:
        'It means the endpoint accepts the same request and response shape as OpenAI\u2019s chat completions API. Existing SDKs work after you change the base URL, the key and the model name - no new client library, and no rewrite of the code around it.',
      code: {
        label: 'Same request shape, different endpoint',
        value: `from openai import OpenAI

client = OpenAI(
    base_url="${baseUrl}",
    api_key="sk-qr-your-key",
)

response = client.chat.completions.create(
    model="claude-sonnet-4-5",
    messages=[{"role": "user", "content": "Summarise this changelog."}],
)`,
      },
    },
    {
      heading: 'When is a gateway the wrong choice?',
      answer:
        'If you have committed to a single provider, negotiated enterprise terms with it and have no plan to test another model, a gateway adds a hop without adding a decision. The value comes from optionality, and optionality you never exercise is overhead.',
      bullets: [
        'A single-model product with no evaluation roadmap gains little from a routing layer.',
        'Latency-sensitive paths should measure the extra hop rather than assume it is free.',
        'Regulated workloads need the data-handling terms of every upstream provider reviewed, not just the gateway\u2019s.',
      ],
    },
    {
      heading: 'What should you check before choosing a gateway?',
      answer:
        'Check how billing works, whether keys are scoped per tool, which models are actually available and whether the pricing is the upstream list price or a marked-up rate. Those four answers decide whether the gateway saves you money or just adds a layer.',
      table: {
        headers: ['Question', 'Why it matters'],
        rows: [
          [
            'Is usage billed at list price or at a markup?',
            'A markup quietly changes the cost of every experiment you run.',
          ],
          [
            'Can you create separate keys per tool?',
            'Per-key spend is what makes a runaway agent visible before the invoice arrives.',
          ],
          [
            'How many models are actually reachable?',
            'A long catalogue that excludes the model you need is not optionality.',
          ],
          [
            'What protocol does each tool need?',
            'Anthropic-style clients take the host root; OpenAI-style clients take the /v1 path.',
          ],
          [
            'What happens when an upstream provider degrades?',
            'Routing, retries and failover behaviour is the operational half of the product.',
          ],
        ],
      },
    },
    {
      heading: `How does ${QuickRouterBrand.name} fit this definition?`,
      answer: `${QuickRouterBrand.name} is an LLM API gateway with two differences that matter for cost: usage is billed from your balance at the upstream list price of the model you call, and the same key works across every model in the catalogue.`,
      bullets: [
        `One OpenAI-compatible base URL: ${baseUrl}.`,
        'One key across the whole catalogue, including OpenAI, Anthropic, Google, DeepSeek and xAI models.',
        'Gateway plans start at $19 per month, with model usage billed separately at upstream list prices.',
        'Per-request detail in the console, so you can reconcile spend against your own logs.',
      ],
      links: [
        {
          label: 'Model list prices',
          href: '/models',
          copy: 'Indicative list rates per 1M tokens across the catalogue.',
        },
        {
          label: 'Claude Code setup',
          href: '/docs/claude-code',
          copy: 'A worked example of pointing an Anthropic-style client at the gateway.',
        },
        {
          label: 'Cursor setup',
          href: '/docs/cursor',
          copy: 'The OpenAI-style path, using a custom base URL in an editor.',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'Is an LLM API gateway the same as a proxy?',
      answer:
        'A proxy only forwards traffic. A gateway authenticates, routes by model, normalises protocols and meters usage, which is why it can produce a single bill and per-request cost detail.',
    },
    {
      question: 'Does a gateway add latency?',
      answer:
        'It adds one network hop. For most workloads that is small relative to model inference time, but measure it on your own path if you are optimising a latency-sensitive surface.',
    },
    {
      question: 'Is an OpenAI-compatible endpoint the same as OpenAI?',
      answer:
        'No. Compatibility describes the request shape, not the model behind it. A compatible endpoint can serve Anthropic, Google, DeepSeek or open-weight models while your code stays unchanged.',
    },
    {
      question: 'What does "billed at upstream list price" mean?',
      answer:
        'You pay the published per-token rate of the model you called, rather than a rounded or marked-up rate, and the console shows per-request detail so the number is checkable.',
    },
    {
      question: 'What is the difference between a gateway and a model router?',
      answer:
        'They overlap. A router chooses between models, often automatically; a gateway is the single authenticated endpoint, key and billing surface that the routing happens behind. Many products do both.',
    },
  ],
};

export const DocsHub = {
  title: 'Setup guides: point your tools at QuickRouter',
  h1: 'Setup guides for every tool that speaks the OpenAI protocol',
  description: `Step-by-step guides for Claude Code, Cursor, Codex, opencode, Cherry Studio and Trae. Exact base URLs, the fields to edit and the connection errors people hit, on ${QuickRouterBrand.name}.`,
  keywords:
    'claude code base url, cursor custom base url, codex base url, opencode provider, cherry studio api host, trae custom provider',
  intro: DocsIntro,
};

export const ModelsHub = {
  title: 'Model list prices: 400+ LLMs on one OpenAI-compatible endpoint',
  h1: 'Model prices on QuickRouter',
  description:
    'Indicative list prices per 1M tokens for GPT-5, Claude, Gemini, DeepSeek, Grok and the wider catalogue, all reachable through one OpenAI-compatible base URL and one API key.',
  keywords:
    'llm api pricing, gpt-5 api price, claude api price, gemini api price, deepseek api price, grok api price, per 1m tokens',
  intro: `Usage is drawn from your balance at the listed price of each upstream model. The table below shows indicative list rates per 1M tokens for the models people ask about most; the console is the source of truth for live pricing.`,
};
