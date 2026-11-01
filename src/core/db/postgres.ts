import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { getCloudflareContext } from '@opennextjs/cloudflare';

import { envConfigs } from '@/config';
import { isCloudflareWorker } from '@/shared/lib/env';

// Global database connection instance (singleton pattern)
let dbInstance: ReturnType<typeof drizzle> | null = null;
let client: ReturnType<typeof postgres> | null = null;

export function getPostgresDb() {
  let databaseUrl = envConfigs.database_url;

  let isHyperdrive = false;
  const schemaName = (envConfigs.db_schema || 'public').trim();
  const connectionSchemaOptions =
    schemaName && schemaName !== 'public'
      ? { connection: { options: `-c search_path=${schemaName}` } }
      : {};

  if (isCloudflareWorker) {
    let env: any = {};
    try {
      env = getCloudflareContext().env;
    } catch {
      // Local Workers emulation may not expose a request context.
    }

    isHyperdrive = Boolean(env.HYPERDRIVE);

    if (isHyperdrive) {
      databaseUrl = env.HYPERDRIVE.connectionString;
      console.log('using Hyperdrive connection');
    } else if (env.DATABASE_URL) {
      databaseUrl = env.DATABASE_URL;
    }
  }

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set');
  }

  // A Worker TCP socket is request-scoped. Do not retain it in a module global.
  if (isCloudflareWorker) {
    const requestClient = postgres(databaseUrl, {
      prepare: false,
      max: 1,
      idle_timeout: 2,
      connect_timeout: 5,
      ...connectionSchemaOptions,
    });

    return drizzle(requestClient);
  }

  // Singleton mode: reuse existing connection on traditional servers.
  if (envConfigs.db_singleton_enabled === 'true') {
    if (dbInstance) {
      return dbInstance;
    }

    client = postgres(databaseUrl, {
      prepare: false,
      max: Number(envConfigs.db_max_connections) || 1,
      idle_timeout: 30,
      connect_timeout: 10,
      ...connectionSchemaOptions,
    });

    dbInstance = drizzle({ client });
    return dbInstance;
  }

  // Serverless/non-singleton mode.
  const serverlessClient = postgres(databaseUrl, {
    prepare: false,
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
    ...connectionSchemaOptions,
  });

  return drizzle({ client: serverlessClient });
}

export async function closePostgresDb() {
  if (envConfigs.db_singleton_enabled && client) {
    await client.end();
    client = null;
    dbInstance = null;
  }
}
