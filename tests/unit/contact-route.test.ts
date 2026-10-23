// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';
const mail = vi.hoisted(() => ({ send: vi.fn(), config: vi.fn() }));
const rate = vi.hoisted(() => vi.fn());
vi.mock('@/lib/email', () => ({ sendContactEmail: mail.send, getMailConfiguration: mail.config }));
vi.mock('@/lib/rate-limit', () => ({ checkRateLimit: rate }));
import { POST } from '@/app/api/contact/route';
const data = {
  name: 'Test Person',
  email: 'person@example.com',
  subject: 'Product enquiry',
  message: 'Please tell me about your platform.',
};
const request = (body: unknown, origin = 'http://localhost:3000') =>
  new Request('http://localhost:3000/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin },
    body: JSON.stringify(body),
  });
beforeEach(() => {
  vi.clearAllMocks();
  rate.mockResolvedValue({ allowed: true, retryAfter: 600 });
  mail.config.mockReturnValue({});
  mail.send.mockResolvedValue(undefined);
});
describe('contact route', () => {
  it('sends validated data through the mocked email transport', async () => {
    expect((await POST(request(data))).status).toBe(200);
    expect(mail.send).toHaveBeenCalledWith({ ...data, phone: '', website: '' });
  });
  it('rejects header injection', async () => {
    expect((await POST(request({ ...data, subject: 'Hi\r\nBcc: test@example.com' }))).status).toBe(
      400,
    );
    expect(mail.send).not.toHaveBeenCalled();
  });
  it('rejects other origins', async () => {
    expect((await POST(request(data, 'https://evil.example'))).status).toBe(403);
  });
  it('traps honeypot submissions', async () => {
    expect((await POST(request({ ...data, website: 'https://spam.example' }))).status).toBe(200);
    expect(mail.send).not.toHaveBeenCalled();
  });
  it('enforces rate limits', async () => {
    rate.mockResolvedValue({ allowed: false, retryAfter: 60 });
    const response = await POST(request(data));
    expect(response.status).toBe(429);
    expect(response.headers.get('retry-after')).toBe('60');
    expect(mail.send).not.toHaveBeenCalled();
  });
  it('fails closed when rate storage is unavailable', async () => {
    rate.mockRejectedValue(new Error('store'));
    expect((await POST(request(data))).status).toBe(503);
  });
  it('reports missing SMTP configuration honestly', async () => {
    mail.config.mockReturnValue(null);
    expect((await POST(request(data))).status).toBe(503);
  });
  it('handles email transport failures without leaking details', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    mail.send.mockRejectedValue(new Error('secret credential'));
    const response = await POST(request(data));
    expect(response.status).toBe(502);
    expect(await response.text()).not.toContain('secret credential');
  });
  it('rejects oversized requests', async () => {
    expect((await POST(request({ ...data, message: 'a'.repeat(17000) }))).status).toBe(400);
  });
});
