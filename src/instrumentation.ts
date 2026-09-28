/**
 * Next.js instrumentation hook: runs once per server instance, before the app
 * starts handling requests. Used to make sure the PostgreSQL schema exists.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') {
    return;
  }

  try {
    const { runMigrations } = await import('@/core/db/migrate');
    await runMigrations();
  } catch (error) {
    console.error('[instrumentation] migrations failed:', error);
  }
}
