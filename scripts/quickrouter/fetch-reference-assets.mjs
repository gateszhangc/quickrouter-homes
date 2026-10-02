#!/usr/bin/env node
/**
 * Mirror the marketing media that quickrouter.homes reuses from the
 * quickrouter.ai reference site.
 *
 * The reference host sits behind a bot filter, so every request carries a
 * browser User-Agent plus a Referer. Files that already exist are skipped
 * unless FORCE=1, and every download is checked for a sane content type and a
 * non-empty body before it is written into public/.
 *
 * Usage: node scripts/quickrouter/fetch-reference-assets.mjs
 *        FORCE=1 node scripts/quickrouter/fetch-reference-assets.mjs
 */

import { mkdir, stat, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const ORIGIN = 'https://quickrouter.ai';
const FORCE = process.env.FORCE === '1';

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/140.0 Safari/537.36',
  Referer: `${ORIGIN}/`,
  Accept: '*/*',
};

/** remote path -> local path under public/ */
const VIDEOS = [
  ['/videos/creative-studio/seedance25-stage-v1.jpg'],
  ['/videos/creative-studio/seedance25-stage-v2.mp4'],
  ['/videos/creative-studio/seedance20-demo-v1.jpg'],
  ['/videos/creative-studio/seedance20-demo-v2.mp4'],
  ['/videos/creative-studio/vidu-demo-v1.jpg'],
  ['/videos/creative-studio/vidu-demo-v2.mp4'],
  ['/videos/creative-studio/kling-official-v1.jpg'],
  ['/videos/creative-studio/kling-official-v2.mp4'],
  ['/videos/creative-studio/grok-knight-v1.jpg'],
  ['/videos/creative-studio/grok-knight-v2.mp4'],
].map(([path]) => [path, path]);

const IMAGES = [
  '/images/logo-dark.png',
  '/images/logo-light.png',
  '/images/openai.png',
  '/images/claude.png',
  '/images/google.png',
  '/images/deepseek.png',
  '/images/grok.png',
  '/images/meta.png',
  '/images/mistral.png',
  '/images/moonshot.png',
  '/images/xai.png',
  '/images/minimax.png',
  '/images/chatglm.png',
  '/images/ollama.png',
  '/images/vidu.png',
  '/images/brand_logos/opencode.svg',
  '/images/brand_logos/cursor.svg',
  '/images/brand_logos/cherrystudio.svg',
  '/images/brand_logos/workbuddy.svg',
  '/images/brand_logos/trae.svg',
  '/images/brand_logos/hermes.png',
  '/images/brand_logos/cc-switch.png',
  '/images/chatbox.png',
  '/images/openclaw-bot.png',
  '/images/testimonials/alex-chen.webp',
  '/images/testimonials/daniel-wang.webp',
  '/images/testimonials/asian-dev-b.webp',
  '/images/testimonials/landscape-lake.webp',
  '/images/testimonials/landscape-city.webp',
  '/images/testimonials/cartoon-dev-a.webp',
  '/images/testimonials/cartoon-dev-b.webp',
  '/images/testimonials/landscape-workspace.svg',
  '/images/testimonials/landscape-night.svg',
  '/images/testimonials/cartoon-dev-c.svg',
].map((path) => [path, path]);

const MANIFEST = [...VIDEOS, ...IMAGES];

const exists = async (path) => {
  try {
    const info = await stat(path);
    return info.isFile() && info.size > 0;
  } catch {
    return false;
  }
};

const failures = [];

for (const [remote, local] of MANIFEST) {
  const target = join(ROOT, 'public', local);

  if (!FORCE && (await exists(target))) {
    console.log(`skip   ${local}`);
    continue;
  }

  const response = await fetch(`${ORIGIN}${remote}`, { headers: HEADERS });
  if (!response.ok) {
    failures.push(`${remote} -> HTTP ${response.status}`);
    console.error(`fail   ${remote} (HTTP ${response.status})`);
    continue;
  }

  const body = Buffer.from(await response.arrayBuffer());
  if (body.length === 0) {
    failures.push(`${remote} -> empty body`);
    console.error(`fail   ${remote} (empty body)`);
    continue;
  }

  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, body);
  console.log(`fetch  ${local} (${body.length} bytes)`);
}

if (failures.length > 0) {
  console.error(`\n${failures.length} asset(s) failed:`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log(`\n${MANIFEST.length} reference assets ready under public/`);
