import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import postgres from 'postgres';

import { envConfigs } from '@/config';

const LEDGER_TABLE = '__app_migrations';
const STATEMENT_BREAKPOINT = '--> statement-breakpoint';

function migrationsDir() {
  return path.resolve(
    process.cwd(),
    envConfigs.db_migrations_out || 'src/config/db/migrations'
  );
}

/**
 * Apply drizzle-kit SQL migrations at server startup.
 *
 * The production image has no init container and no shell access, so tables are
 * created from the app itself on boot. Applied files are recorded in
 * `__app_migrations`, which makes this idempotent across restarts.
 */
export async function runMigrations(): Promise<void> {
  const databaseUrl = envConfigs.database_url;

  if (!databaseUrl) {
    console.log('[db-migrate] DATABASE_URL is not set, skipping migrations');
    return;
  }

  const dir = migrationsDir();
  let files: string[];

  try {
    files = (await readdir(dir)).filter((name) => name.endsWith('.sql')).sort();
  } catch (error: any) {
    console.log(
      `[db-migrate] no migrations found in ${dir} (${error?.code || error?.message})`
    );
    return;
  }

  if (files.length === 0) {
    console.log(`[db-migrate] no migrations found in ${dir}`);
    return;
  }

  const client = postgres(databaseUrl, {
    max: 1,
    prepare: false,
    idle_timeout: 5,
    connect_timeout: 30,
    onnotice: () => {},
  });

  try {
    await client.unsafe(
      `CREATE TABLE IF NOT EXISTS "${LEDGER_TABLE}" (` +
        `"id" text PRIMARY KEY, ` +
        `"applied_at" timestamptz NOT NULL DEFAULT now())`
    );

    const rows = await client.unsafe(`SELECT "id" FROM "${LEDGER_TABLE}"`);
    const applied = new Set<string>(rows.map((row: any) => row.id));

    for (const file of files) {
      if (applied.has(file)) {
        console.log(`[db-migrate] already applied: ${file}`);
        continue;
      }

      const raw = await readFile(path.join(dir, file), 'utf8');
      const statements = raw
        .split(STATEMENT_BREAKPOINT)
        .map((statement) => statement.trim())
        .filter(Boolean);

      await client.begin(async (tx) => {
        for (const statement of statements) {
          await tx.unsafe(statement);
        }
        await tx.unsafe(`INSERT INTO ${LEDGER_TABLE} (id) VALUES ($1)`, [file]);
      });

      console.log(`[db-migrate] applied: ${file}`);
    }

    console.log('[db-migrate] done');
  } catch (error: any) {
    // Keep the site serving even if the schema cannot be created; the failure is
    // logged loudly so it shows up in the deployment logs.
    console.error('[db-migrate] failed:', error);
  } finally {
    await client.end({ timeout: 5 }).catch(() => {});
  }
}