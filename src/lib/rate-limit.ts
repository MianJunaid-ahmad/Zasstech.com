import { createHash } from 'node:crypto';
const WINDOW_SECONDS = 600;
const MAX_REQUESTS = 5;
const localStore = new Map<string, { count: number; expires: number }>();
export interface RateResult {
  allowed: boolean;
  retryAfter: number;
}

export async function checkRateLimit(identity: string): Promise<RateResult> {
  const key = `zasstech:contact:${createHash('sha256').update(identity).digest('hex')}`;
  const url = process.env.RATE_LIMIT_REDIS_REST_URL;
  const token = process.env.RATE_LIMIT_REDIS_REST_TOKEN;
  if (url && token) {
    if (new URL(url).protocol !== 'https:') throw new Error('Rate store requires HTTPS');
    const response = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([
        'EVAL',
        "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]) end; return {n,redis.call('TTL',KEYS[1])}",
        '1',
        key,
        String(WINDOW_SECONDS),
      ]),
      cache: 'no-store',
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error('Rate store unavailable');
    const payload: { result?: unknown } = await response.json();
    if (
      !Array.isArray(payload.result) ||
      payload.result.length !== 2 ||
      !payload.result.every(Number.isFinite)
    )
      throw new Error('Invalid rate store response');
    return {
      allowed: Number(payload.result[0]) <= MAX_REQUESTS,
      retryAfter: Math.max(1, Number(payload.result[1])),
    };
  }
  // Fail closed in production; never silently weaken protection across instances.
  if (process.env.NODE_ENV === 'production') throw new Error('Shared rate store unavailable');
  const now = Date.now();
  for (const [storedKey, value] of localStore)
    if (value.expires <= now) localStore.delete(storedKey);
  let record = localStore.get(key);
  if (!record) {
    if (localStore.size >= 10000) return { allowed: false, retryAfter: WINDOW_SECONDS };
    record = { count: 0, expires: now + WINDOW_SECONDS * 1000 };
    localStore.set(key, record);
  }
  record.count++;
  return {
    allowed: record.count <= MAX_REQUESTS,
    retryAfter: Math.max(1, Math.ceil((record.expires - now) / 1000)),
  };
}
