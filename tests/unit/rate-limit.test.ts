// @vitest-environment node
import { afterEach, expect, it, vi } from 'vitest';
import { checkRateLimit } from '@/lib/rate-limit';
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
it('allows five attempts and expires the development limit', async () => {
  vi.stubEnv('RATE_LIMIT_REDIS_REST_URL', '');
  vi.stubEnv('RATE_LIMIT_REDIS_REST_TOKEN', '');
  vi.stubEnv('NODE_ENV', 'test');
  vi.useFakeTimers();
  for (let i = 0; i < 5; i++) expect((await checkRateLimit('local-limit-test')).allowed).toBe(true);
  expect((await checkRateLimit('local-limit-test')).allowed).toBe(false);
  vi.advanceTimersByTime(601000);
  expect((await checkRateLimit('local-limit-test')).allowed).toBe(true);
});
it('requires shared storage in production', async () => {
  vi.stubEnv('NODE_ENV', 'production');
  vi.stubEnv('RATE_LIMIT_REDIS_REST_URL', '');
  vi.stubEnv('RATE_LIMIT_REDIS_REST_TOKEN', '');
  await expect(checkRateLimit('production-test')).rejects.toThrow('Shared rate store unavailable');
});
it('uses an atomic expiring Redis counter without exposing raw IPs', async () => {
  vi.stubEnv('RATE_LIMIT_REDIS_REST_URL', 'https://redis.example.com');
  vi.stubEnv('RATE_LIMIT_REDIS_REST_TOKEN', 'test-token');
  const mockedFetch = vi
    .fn()
    .mockResolvedValue({ ok: true, json: async () => ({ result: [6, 420] }) });
  vi.stubGlobal('fetch', mockedFetch);
  expect(await checkRateLimit('192.0.2.1')).toEqual({ allowed: false, retryAfter: 420 });
  const payload = JSON.parse(mockedFetch.mock.calls[0][1].body);
  expect(payload[0]).toBe('EVAL');
  expect(payload[3]).not.toContain('192.0.2.1');
});
