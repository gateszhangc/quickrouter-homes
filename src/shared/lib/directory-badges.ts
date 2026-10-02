import snapshot from './directory-badges.json';

export type DirectoryBadge = {
  label: string;
  href: string;
  title: string;
  rel?: string;
} & ({ imageSrc: string; text?: never } | { text: string; imageSrc?: never });

/**
 * Public JSON manifest that drives the footer directory badge strip for this
 * site. Upload a new revision to add or remove badges without shipping a
 * build; the committed snapshot below is the fallback used whenever the
 * manifest is unreachable or unusable.
 *
 * The manifest holds this site's own listings. Badges that belong to another
 * product in the fleet are filtered out by `normalizeDirectoryBadges`, because
 * a sibling product's listing page is not a listing for this site.
 */
export const DIRECTORY_BADGES_URL =
  process.env.DIRECTORY_BADGES_URL?.trim() ||
  'https://pub-e1eb76428e24457ebfc067c635cb4fc4.r2.dev/badges/quickrouter.homes.json';

/**
 * Deep links that belong to another product in the fleet. They are dropped
 * instead of rendered, so this site never advertises a sibling's listing page.
 */
const FOREIGN_PRODUCT_PATTERN =
  /mirofish|soul-?cinema|animatephoto|outfit|soulcinema/i;

export const DIRECTORY_BADGES_REVALIDATE_SECONDS = 300;
export const DIRECTORY_BADGES_TAG = 'directory-badges';
export const DIRECTORY_BADGES_MAX_ITEMS = 500;

const FETCH_TIMEOUT_MS = 3000;

const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

const isHttpsUrl = (value: string) => {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
};

const readBadgeEntries = (input: unknown): unknown[] => {
  if (Array.isArray(input)) {
    return input;
  }

  if (input && typeof input === 'object') {
    const badges = (input as { badges?: unknown }).badges;
    if (Array.isArray(badges)) {
      return badges;
    }
  }

  return [];
};

/**
 * Keeps only entries that can be rendered safely: an https listing link, a
 * label/title, exactly one of imageSrc or text, and a unique href.
 */
export function normalizeDirectoryBadges(input: unknown): DirectoryBadge[] {
  const badges: DirectoryBadge[] = [];
  const seenHrefs = new Set<string>();

  for (const raw of readBadgeEntries(input)) {
    if (badges.length >= DIRECTORY_BADGES_MAX_ITEMS) {
      break;
    }

    if (!raw || typeof raw !== 'object') {
      continue;
    }

    const entry = raw as Record<string, unknown>;
    const label = asText(entry.label);
    const href = asText(entry.href);
    const title = asText(entry.title) || label;
    const imageSrc = asText(entry.imageSrc);
    const text = asText(entry.text);
    const rel = asText(entry.rel) || 'noopener noreferrer';

    if (!label || !title || !isHttpsUrl(href) || seenHrefs.has(href)) {
      continue;
    }

    // a sibling product's listing page is not a listing for this site
    if (FOREIGN_PRODUCT_PATTERN.test(href)) {
      continue;
    }

    if (imageSrc && text) {
      continue;
    }

    if (imageSrc) {
      if (!isHttpsUrl(imageSrc)) {
        continue;
      }

      seenHrefs.add(href);
      badges.push({ label, href, title, rel, imageSrc });
      continue;
    }

    if (!text) {
      continue;
    }

    seenHrefs.add(href);
    badges.push({ label, href, title, rel, text });
  }

  return badges;
}

const SNAPSHOT_BADGES = normalizeDirectoryBadges(snapshot);

export function getDirectoryBadgesSnapshot(): DirectoryBadge[] {
  return SNAPSHOT_BADGES;
}

const createTimeoutSignal = () => {
  if (
    typeof AbortSignal === 'undefined' ||
    typeof AbortSignal.timeout !== 'function'
  ) {
    return undefined;
  }

  return AbortSignal.timeout(FETCH_TIMEOUT_MS);
};

/**
 * Loads the directory badges from the public manifest and falls back to the
 * repository snapshot whenever the manifest is unreachable or unusable.
 */
export async function getDirectoryBadges(): Promise<DirectoryBadge[]> {
  if (process.env.DIRECTORY_BADGES_SOURCE?.trim().toLowerCase() === 'snapshot') {
    return SNAPSHOT_BADGES;
  }

  try {
    const response = await fetch(DIRECTORY_BADGES_URL, {
      headers: { accept: 'application/json' },
      signal: createTimeoutSignal(),
      next: {
        revalidate: DIRECTORY_BADGES_REVALIDATE_SECONDS,
        tags: [DIRECTORY_BADGES_TAG],
      },
    });

    if (response.status === 404) {
      // expected until a revision is uploaded for this site: the committed
      // snapshot is the intended source in that case, so stay quiet
      return SNAPSHOT_BADGES;
    }

    if (!response.ok) {
      console.warn(
        `[directory-badges] ${DIRECTORY_BADGES_URL} responded with ${response.status}; using repository snapshot.`
      );
      return SNAPSHOT_BADGES;
    }

    const badges = normalizeDirectoryBadges(await response.json());

    if (badges.length === 0) {
      console.warn(
        `[directory-badges] ${DIRECTORY_BADGES_URL} had no usable entries; using repository snapshot.`
      );
      return SNAPSHOT_BADGES;
    }

    return badges;
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    console.warn(
      `[directory-badges] failed to load ${DIRECTORY_BADGES_URL} (${reason}); using repository snapshot.`
    );
    return SNAPSHOT_BADGES;
  }
}
