// Lightweight per-instance query cache for Prisma reads. Vercel reuses warm
// serverless instances across requests (see src/lib/db.ts's singleton), so
// this avoids re-querying Postgres on every page navigation — while every
// mutation explicitly invalidates the relevant prefixes, so a logged entry
// shows up immediately rather than waiting out a TTL.
type CacheEntry = { value: unknown; expiresAt: number };

const store = new Map<string, CacheEntry>();
const DEFAULT_TTL_MS = 5 * 60 * 1000;

export async function cached<T>(key: string, fn: () => Promise<T>, ttlMs = DEFAULT_TTL_MS): Promise<T> {
  const hit = store.get(key);
  if (hit && hit.expiresAt > Date.now()) {
    return hit.value as T;
  }
  const value = await fn();
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
  return value;
}

export function invalidate(...prefixes: string[]) {
  for (const key of store.keys()) {
    if (prefixes.some((p) => key.startsWith(p))) store.delete(key);
  }
}
